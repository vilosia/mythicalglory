/* ══ 刮刮乐揭晓 · 行为（2026-08-13）════════════════════════════════════════════
   一份脚本给两处用，各用一种（见 scratch-reveal.css 顶部的理由）：
     · 开奖 tab（hall-results）＝ 方案 B：封条 → 弹层刮
     · 策略 L2 最新开奖（hall-plans #bdFxDraw）＝ 方案 A：就地刮

   对外只有四个入口：
     IM168Scratch.enabled()          玩家有没有开这个功能（我的 → 设置）
     IM168Scratch.setEnabled(bool)   写设置（会广播 im168scratch 事件，各页自己重画）
     IM168Scratch.foil(el, key)      给一块<b>已经是 .sr-foil</b> 的区域装膜（方案 A）
     IM168Scratch.seal(row, opts)    给一行装封条 ＋ 弹层（方案 B）
   key ＝ 这一期的身份（游戏＋期号）。揭过的记在 sessionStorage：
   换筛选、重画、每秒刷新都不会把已经揭晓的那一期重新盖回去。

   ⚠ 这一支是<b>演示脚本</b>，不进前端交付：真做的时候「哪一期算新的」由后端给，
     不该靠 DOM 里的期号字符串。 */
(function(){
  'use strict';
  var SET_KEY='im168_scratch_v1', SEEN_KEY='im168_scratch_seen_v1', DONE_AT=0.55;

  function enabled(){
    try{return localStorage.getItem(SET_KEY)!=='off';}catch(e){return true;}
  }
  function setEnabled(on){
    try{localStorage.setItem(SET_KEY,on?'on':'off');}catch(e){}
    window.dispatchEvent(new CustomEvent('im168scratch',{detail:{enabled:!!on}}));
  }
  function seen(){
    try{return JSON.parse(sessionStorage.getItem(SEEN_KEY)||'[]');}catch(e){return [];}
  }
  function markSeen(key){
    if(!key)return;
    var a=seen();if(a.indexOf(key)<0){a.push(key);
      try{sessionStorage.setItem(SEEN_KEY,JSON.stringify(a));}catch(e){}}
  }
  /* ⚠ 没有 key ＝<b>没揭过</b>，不是「揭过了」。第一版写成 !key||… ——
     于是弹层里那块膜（当时不传 key）一装上就被判成已揭晓，canvas 根本没画出来（实测）。 */
  function isSeen(key){return !!key&&seen().indexOf(key)>=0;}

  var EYE='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" '+
    'stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 12S6.3 5.8 12 5.8 21.4 12 21.4 12 17.7 18.2 12 18.2 2.6 12 2.6 12z"/>'+
    '<circle cx="12" cy="12" r="3.1"/></svg>';

  function tok(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim();}

  /* ── 银膜的形状：<b>一格一片，中间留缝</b>（Hector）────────────────────────
     不是「一整块膜上画几个格子」，而是<b>膜只存在于每个号码的位置上</b> ——
     号码与号码之间<b>透空</b>，露出卡片底色，像真的刮刮乐一样一格一格刮开。
     ⚠ 位置是量出来的（getBoundingClientRect），几个号码就几片：
       飞艇 10 片、时时彩 5 片，换彩种、换版式都不用改这里。
     ⚠ 有了这个，原来那层「位置提示格」就多余了 —— 膜的形状本身就是提示。 */
  function slotPath(g,x,y,w,h,r){
    if(g.roundRect){g.beginPath();g.roundRect(x,y,w,h,r);return;}
    g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);
    g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();
  }
  function cellRects(el,box){
    var cells=[].slice.call(el.querySelectorAll('.sr-payload .rr-grid > *')),out=[];
    var rects=cells.map(function(c){return c.getBoundingClientRect();}).filter(function(r){return r.width&&r.height;});
    /* ⚠ 每片外扩多少，<b>由号码之间的空隙决定</b>，不能写死 4px：
       号码排得密的时候（弹层里只隔 3px），外扩 4 会让相邻两片<b>粘成一整条</b>，
       就又变回「一大块膜」了。留边取 空隙/2 − 2，并夹在 1–5 之间，保证缝一定看得见。 */
    var gap=8;
    for(var i=1;i<rects.length;i++)gap=Math.min(gap,rects[i].left-rects[i-1].right);
    var pad=Math.max(1,Math.min(5,Math.round(gap/2-2)));
    rects.forEach(function(r){
      out.push({x:r.left-box.left-pad,y:r.top-box.top-pad,w:r.width+pad*2,h:r.height+pad*2});
    });
    /* 量不到号码时（理论上不该发生）退回整块 —— 宁可盖住，也不能把答案漏出去 */
    if(!out.length)out.push({x:0,y:0,w:box.width,h:box.height});
    return out;
  }

  /* ── 方案 A：给一块区域盖膜 ─────────────────────────────────────────────── */
  function foil(el,key,hintText){
    if(!el||el._srBound)return;
    if(!enabled()||isSeen(key)){el.classList.add('sr-done');return;}
    el._srBound=true;el._srKey=key;

    var cv=document.createElement('canvas');el.insertBefore(cv,el.firstChild);
    /* 提示语可以在膜<b>里面</b>（弹层那种大面积）也可以在膜<b>下面一行</b>（列表里那种细条）：
       细条上号码几乎占满，字压上去就和银片糊在一起（Hector 指出的就是这个）。
       所以先找膜内，再找<b>紧邻的兄弟节点</b>，都没有才自己造一个。 */
    var hint=el.querySelector('.sr-foil-hint')||
             (el.nextElementSibling&&el.nextElementSibling.classList.contains('sr-foil-hint')
               ?el.nextElementSibling:null);
    if(!hint){hint=document.createElement('div');hint.className='sr-foil-hint';
      hint.innerHTML='<b>'+(hintText||'刮开查看开奖')+'</b>';el.appendChild(hint);}
    var skip=el.querySelector('.sr-skip');
    if(!skip){skip=document.createElement('button');skip.type='button';skip.className='sr-skip';
      skip.setAttribute('aria-label','直接揭晓');skip.title='直接揭晓';skip.innerHTML=EYE;el.appendChild(skip);}

    function paint(){
      var box=el.getBoundingClientRect();
      el.classList.remove('sr-done','sr-started','sr-scratching');
      if(!box.width||!box.height)return;
      var d=Math.min(window.devicePixelRatio||1,2);
      cv.width=Math.round(box.width*d);cv.height=Math.round(box.height*d);
      /* willReadFrequently：刮的过程要反复 getImageData 数进度 */
      var g=cv.getContext('2d',{willReadFrequently:true});
      g.setTransform(d,0,0,d,0,0);
      g.clearRect(0,0,box.width,box.height);   /* 缝隙保持<b>透空</b>，露出卡片底色 */
      g.globalCompositeOperation='source-over';
      cellRects(el,box).forEach(function(r){
        var lin=g.createLinearGradient(r.x,r.y,r.x+r.w,r.y+r.h);
        lin.addColorStop(0,tok('--x-foil-a'));lin.addColorStop(.5,tok('--x-foil-b'));
        lin.addColorStop(1,tok('--x-foil-a'));
        g.fillStyle=lin;slotPath(g,r.x,r.y,r.w,r.h,6);g.fill();
        g.strokeStyle=tok('--x-foil-line');g.lineWidth=1;
        slotPath(g,r.x,r.y,r.w,r.h,6);g.stroke();
      });
      el._g=g;el._box=box;el._path=0;
      /* ⚠ 进度的分母＝<b>真正被盖住的那些采样点</b>，不是整块画布：
         膜现在只占一部分面积，拿整块当分母的话刮干净了也到不了 55%，永远开不了。 */
      el._marks=sampleCovered(g,cv);
    }
    function sampleCovered(g,c){
      try{
        var img=g.getImageData(0,0,c.width,c.height).data,step=6,marks=[];
        for(var y=0;y<c.height;y+=step)for(var x=0;x<c.width;x+=step){
          if(img[(y*c.width+x)*4+3]>=24)marks.push(y*c.width+x);
        }
        return marks;
      }catch(e){return null;}
    }
    function progress(){
      var marks=el._marks;
      try{
        if(!marks||!marks.length)return 0;
        var img=el._g.getImageData(0,0,cv.width,cv.height).data,gone=0;
        for(var i=0;i<marks.length;i++)if(img[marks[i]*4+3]<24)gone++;
        return gone/marks.length;
      }catch(e){ return Math.min(1,el._path/(((el._box&&el._box.width)||160)*2.4)); }
    }
    function reveal(){
      if(el.classList.contains('sr-done'))return;
      el.classList.add('sr-done');markSeen(el._srKey);
      if(typeof el._srOnReveal==='function')el._srOnReveal();
    }
    el._srPaint=paint;el._srReveal=reveal;

    var last=null,ticks=0;
    function at(e){var b=el.getBoundingClientRect();return {x:e.clientX-b.left,y:e.clientY-b.top};}
    function draw(p){
      var g=el._g;if(!g)return;
      el.classList.add('sr-started');
      g.globalCompositeOperation='destination-out';
      g.lineWidth=34;g.lineCap='round';g.lineJoin='round';
      g.beginPath();
      if(last){g.moveTo(last.x,last.y);g.lineTo(p.x,p.y);g.stroke();
               el._path+=Math.hypot(p.x-last.x,p.y-last.y);}
      g.beginPath();g.arc(p.x,p.y,17,0,Math.PI*2);g.fill();
      last=p;
      if(++ticks%6===0&&progress()>=DONE_AT)reveal();
    }
    el.addEventListener('pointerdown',function(e){
      if(el.classList.contains('sr-done')||e.target.closest('.sr-skip'))return;
      el.classList.add('sr-scratching');
      try{el.setPointerCapture&&el.setPointerCapture(e.pointerId);}catch(ignore){}
      last=null;draw(at(e));e.preventDefault();
    });
    el.addEventListener('pointermove',function(e){
      if(!el.classList.contains('sr-scratching'))return;
      draw(at(e));e.preventDefault();
    });
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
      el.addEventListener(ev,function(){
        if(!el.classList.contains('sr-scratching'))return;
        el.classList.remove('sr-scratching');last=null;
        if(progress()>=DONE_AT)reveal();
      });
    });
    skip.addEventListener('click',function(e){e.stopPropagation();reveal();});
    paint();
    return {paint:paint,reveal:reveal};
  }

  /* ── 方案 B：一行封条 ＋ 一个共用弹层 ───────────────────────────────────── */
  function ensureModal(scope){
    var m=scope.querySelector('.sr-modal');
    if(m)return m;
    m=document.createElement('div');
    m.className='sr-modal';m.setAttribute('data-component','ScratchModal');
    /* 2026-08-17：08-17 那一版的「两种玩法（逐个刮/整排刮）＋ 放大画布 ＋ 名次轨」
       已<b>整体撤回</b>（Hector：too much）。这里回到最早的一块膜、一颗眼睛、一颗完成。
       要找回那一版：本次对话里的 buildStage() 与 .sr-modes/.sr-view/.sr-canvas/.sr-rail
       那组样式（reference-theme 里已一并删除）。 */
    m.innerHTML='<div class="sr-sheet" role="dialog" aria-modal="true" aria-labelledby="srModalTitle">'+
      '<h2 id="srModalTitle"></h2><p>刮开银膜查看开奖</p>'+
      '<div class="sr-foil" data-component="ScratchFoil"><div class="sr-payload"></div>'+
        '<div class="sr-foil-hint"><b>用手指刮开</b></div>'+
        '<button type="button" class="sr-skip" aria-label="直接揭晓" title="直接揭晓">'+EYE+'</button>'+
      '</div>'+
      '<button type="button" class="sr-close">完成</button></div>';
    scope.appendChild(m);
    return m;
  }

  /* row 里 opts.payload 指向被盖住的那一块（球号行）；揭晓后它自己露出来。 */
  function seal(row,opts){
    opts=opts||{};
    var payload=opts.payload||row.querySelector('.rr-grid');
    if(!row||!payload||row._srSealed)return;
    var key=opts.key;
    if(!enabled()||isSeen(key))return;                 /* 关了或已揭过：什么都不做 */
    row._srSealed=true;

    var bar=document.createElement('div');
    bar.className='sr-sealrow';bar.setAttribute('data-component','ScratchSeal');
    /* ⚠ 文案不写「轻触刮开」（Hector）：那读起来像<b>一碰就开</b>，
       而这一行其实是「点开一张刮奖卡，再自己刮」。「打开刮奖卡」把这一步说清楚。 */
    bar.innerHTML='<button type="button" class="sr-seal">'+(opts.label||'打开刮奖卡')+'</button>'+
      '<button type="button" class="sr-skip sr-skip-solo" aria-label="直接揭晓" title="直接揭晓">'+EYE+'</button>';
    payload.parentNode.insertBefore(bar,payload);
    payload.hidden=true;
    /* ⚠ 同排的两面（.rr-two / .tw-sum）也一起收起：封着的期不该从别处漏出答案 */
    var extras=(opts.alsoHide||[]).filter(Boolean);
    extras.forEach(function(x){x.hidden=true;});

    function unseal(){
      bar.remove();payload.hidden=false;extras.forEach(function(x){x.hidden=false;});
      markSeen(key);row._srSealed=false;
      if(typeof opts.onReveal==='function')opts.onReveal();
    }

    bar.querySelector('.sr-skip').addEventListener('click',function(e){e.stopPropagation();unseal();});
    bar.querySelector('.sr-seal').addEventListener('click',function(e){
      e.stopPropagation();
      /* 08-13X：调用方可以在这里「钉住」自己的内容 —— 策略页那一块每期都会重画，
         刮到一半换期的话，刮出来的号码就和下面的两面对不上（实测报过）。 */
      if(typeof opts.onOpen==='function')opts.onOpen();
      var scope=opts.modalScope||row.closest('.screen')||document.body,
          m=ensureModal(scope),f=m.querySelector('.sr-foil');
      m.querySelector('h2').textContent=opts.title||'最新开奖';
      var pay=m.querySelector('.sr-payload');
      pay.innerHTML='';pay.appendChild(payload.cloneNode(true));
      pay.firstChild.hidden=false;
      /* 每次打开都是新的一张卡：把上一次的状态与 canvas 清掉再装 */
      f._srBound=false;f.classList.remove('sr-done','sr-started','sr-scratching');
      var old=f.querySelector('canvas');if(old)old.remove();
      m.classList.add('sr-on');
      /* ⚠ <b>同步</b>装膜：放进 rAF 的话，手快的人会在「还没盖上」的那一帧划两下，
         等下一帧盖上去，看起来像刮了个寂寞（实测能复现）。 */
      foil(f,key,'用手指刮开');
      f._srOnReveal=function(){f._revealed=true;};
      f._revealed=false;
      m.querySelector('.sr-close').onclick=function(){
        m.classList.remove('sr-on');
        if(f._revealed)unseal();
        if(typeof opts.onClose==='function')opts.onClose();   /* 08-13X：解除调用方的钉住 */
      };
    });
    return {unseal:unseal};
  }

  /* ── 「重新盖上」按钮 ─────────────────────────────────────────────────────
     只在<b>真的有刮奖区的那一屏</b>出现：它不是自动扫出来的，而是那一屏自己调
     mountRecover() 挂上去的（开奖 tab 与策略 L2 各挂一处），所以别的页面不会冒出来。
     ⚠ 这是<b>演示件</b>：真产品里开过的奖不该能盖回去。给客户来回演示用。
     ⚠ 盖回去＝清掉「已揭晓」记录 ＋ 把现有的膜重画 ＋ 让那一屏自己重新封一遍
       （rearm）——只重画膜是不够的，开奖 tab 那些封条是整行替换掉的。 */
  function mountRecover(scope,rearm){
    if(!scope||scope.querySelector('.sr-recover'))return null;
    var b=document.createElement('button');
    b.type='button';b.className='sr-recover';b.setAttribute('data-demo','');
    b.textContent='重新盖上';
    scope.appendChild(b);
    b.addEventListener('click',function(e){
      e.stopPropagation();
      try{sessionStorage.removeItem(SEEN_KEY);}catch(ignore){}
      [].forEach.call(document.querySelectorAll('.sr-foil'),function(f){
        if(typeof f._srPaint==='function'){f._scratched=false;f._srPaint();}
      });
      if(typeof rearm==='function')rearm();
    });
    function sync(){b.hidden=!enabled();}      /* 设置里关掉刮刮乐时，这枚也跟着收起 */
    window.addEventListener('im168scratch',sync);sync();
    return b;
  }

  window.IM168Scratch={enabled:enabled,setEnabled:setEnabled,foil:foil,seal:seal,
    mountRecover:mountRecover,isSeen:isSeen,markSeen:markSeen,EYE:EYE};
})();
