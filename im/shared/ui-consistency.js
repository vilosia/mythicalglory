/* Global presentation guardrails: visible currency marks are removed and
   dynamically rendered micro-copy never falls below the 10px floor. */
(function(){
  'use strict';
  var CURRENCY=/[¥￥]/g;
  var SKIP={SCRIPT:1,STYLE:1,TEMPLATE:1,NOSCRIPT:1};
  var GAME_GROUPS=[
    {name:'PK10',items:[['极速赛车','pk10'],['极速飞艇','pk'],['极速赛车（自选）','pk10'],['澳洲幸运10','pk10']]},
    {name:'时时彩',items:[['极速时时彩','ssc'],['幸运飞艇','ssc'],['澳洲幸运5','ssc'],['极速时时彩（自选）','ssc']]},
    {name:'PC28',items:[['PC28','ssc'],['加拿大PC28','ssc']]},
    {name:'快开',items:[['极速快乐十分','pk'],['极速快3','pk']]},
    {name:'六合',items:[['极速六合彩','pk'],['香港六合彩','pk']]}
  ];

  function setupGameDrawer(){
    var trigger=document.querySelector('.gtitle[data-act="gameheadmenu"]');
    var drawer=document.getElementById('gameHeadMenu');
    if(!trigger||!drawer||drawer.getAttribute('data-drawer-ready')==='true')return;

    /* 2026-08-13（Hector）：群名 <small> 保留 —— 顶栏全站统一成「标题 · 群组」。
       这里原本把它 remove() 掉（配合 reference-theme 的 display:none），
       于是除了彩票那一屏，其余各页只剩一个光秃秃的游戏名。
       回滚：把下面两行换回 var subtitle=trigger.querySelector('small');if(subtitle)subtitle.remove(); */
    var icon=trigger.querySelector('.tcaret');
    if(icon){
      icon.classList.add('game-menu-icon');
      icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>';
    }

    var phone=document.querySelector('.phone');
    var currentMode=phone?phone.getAttribute('data-game'):'pk';
    var currentLabel=currentMode==='pk'?'极速飞艇':(currentMode==='pk10'?'极速赛车':'极速时时彩');
    drawer.setAttribute('data-drawer-ready','true');
    drawer.innerHTML='<div class="game-drawer-head"><span><b>切换游戏</b><small>游戏大厅 · 14 款</small></span><button type="button" aria-label="关闭游戏列表">×</button></div>'+
      '<div class="game-drawer-scroll">'+GAME_GROUPS.map(function(group){
        return '<section><h3>'+group.name+'</h3><div>'+group.items.map(function(item){
          var on=item[0]===currentLabel?' class="on"':'';
          return '<button type="button" role="menuitemradio" aria-checked="'+(on?'true':'false')+'" data-game-option="'+item[1]+'" data-game-mode="'+item[1]+'" data-game-label="'+item[0]+'" data-act="gameheadpick"'+on+'><span>'+item[0]+'</span><i>✓</i></button>';
        }).join('')+'</div></section>';
      }).join('')+'</div>';

    var close=drawer.querySelector('.game-drawer-head button');
    close.addEventListener('click',function(){
      drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');trigger.setAttribute('aria-expanded','false');
    });
    var backdrop=document.createElement('button');
    backdrop.type='button';backdrop.className='game-drawer-backdrop';backdrop.setAttribute('aria-label','关闭游戏列表');
    backdrop.addEventListener('click',function(){close.click();});
    drawer.parentNode.insertBefore(backdrop,drawer);
  }

  function cleanText(node){
    if(node.nodeType!==3||!node.nodeValue||!CURRENCY.test(node.nodeValue))return;
    CURRENCY.lastIndex=0;
    node.nodeValue=node.nodeValue.replace(CURRENCY,'');
  }

  function cleanElement(el){
    if(!el||el.nodeType!==1||SKIP[el.tagName])return;
    var size=parseFloat(getComputedStyle(el).fontSize);
    if(size&&size<10){
      el.classList.add('ui-font-floor');
      el.style.setProperty('font-size','10px','important');
    }
    ['placeholder','title','aria-label'].forEach(function(name){
      var value=el.getAttribute(name);
      if(value&&/[¥￥]/.test(value))el.setAttribute(name,value.replace(CURRENCY,''));
    });
  }

  function audit(root){
    if(!root)return;
    if(root.nodeType===3){cleanText(root);return;}
    if(root.nodeType!==1||SKIP[root.tagName])return;
    cleanElement(root);
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
    var node;
    while((node=walker.nextNode())){
      if(node.nodeType===3)cleanText(node);else cleanElement(node);
    }
  }

  function start(){
    setupGameDrawer();
    audit(document.body);
    new MutationObserver(function(records){
      records.forEach(function(record){
        if(record.type==='characterData')cleanText(record.target);
        record.addedNodes&&record.addedNodes.forEach(audit);
      });
    }).observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
})();

/* ══ 2026-08-13：演示登录闸<b>已撤</b>（Hector）═══════════════════════════════
   原来这里是一段客户端访问闸（sessionStorage 旗标 im168_client_auth_v1），
   打开任何一页先要账号密码。这一轮整段删掉：交付档直接打开就是原型。
   ⚠ 各页 <script src="shared/ui-consistency.js?v=…"> 的版本号同步换成 …noauth1，
     否则看过旧版的浏览器会拿缓存里的旧脚本，闸还在。
   要恢复：scratchpad 里留了 ui-consistency.with-auth.js.bak（本 session 内有效），
   或从 Latest 2／Ref 的同名档把那一段 IIFE 拷回来。 */

/* ══ 2026-08-13 · 08-13C · 切内容时让内容「从下往上浮一下」════════════════════
   Hector：「instead of instant switch, have some subtle transition animation of cards
   pushing up from bottom (Very subtle) … Apply to whole platform as well depending on
   their content. to make all navigation more natural」

   ── 为什么放在这支共用脚本里，而不是各页自己写 ────────────────────────────
   全平台的切换其实只有三种写法（扫过 17 个真实页面）：
     ① .view 拿到 .on            —— 钱包 4 屏、群组 2 屏、投注 4 屏、策略的内页
     ② .bd-l1pane 拿到 .bd-on    —— 策略页 L1 两个页签
     ③ 一个容器的 hidden 被摘掉   —— 注单页 未结/已结
   在这里用一个 MutationObserver 认这三种，各页的切页签代码<b>一行都不用改</b>；
   将来加第四种，只改这一处。样式在 shared/reference-theme.css（.mo-rise / @keyframes moRise）。

   ── 刻意<b>不</b>动的地方（这就是「depending on their content」那一句）─────────
   · <b>彩票页那排页签不做</b>：它是 jumper —— 点一下只把对应分区滚到顶，
     一张卡都不藏、内容根本没换。给「没换的东西」做入场动画，读起来像闪了一下。
   · <b>首屏轮播不做</b>：它自己 4.8s 一换，再加位移会变成两套节奏打架。
   · <b>引擎每期重绘不做</b>：只认 class/hidden 的变化，不认 childList ——
     否则策略页每 15 秒开一期、卡片重绘一次，整屏每 15 秒浮一下，很快就烦。
   · 首屏进场不做：初始那一屏本来就带着 .on，不产生 mutation，自然不会触发。

   ⚠ 动的是「浮层的直接子元素」：从切换的容器往下走，只要它<b>只有一个</b>元素子节点就继续往下
     （典型是 .bd-l1pane → .bd-scroll），停在第一个真正有多个孩子的容器 —— 那一层才是卡片列表。
   ⚠ 摘 class 的 520ms 是「240 动画 ＋ 130 最大延迟」再留余量；不摘的话下次切回来不会重播。 */
(function(){
  'use strict';
  var PANES=[['.view','on'],['.bd-l1pane','bd-on']];
  /* 优先让<b>卡片列表本身</b>逐个浮起来（Hector 要的是「cards pushing up」）。
     ⚠ 这是返工过的一处：第一版只做「只有一个子节点就往下走」的探法，结果停在
       .bd-l1pane（它有 .bd-scroll ＋ 右下角浮标两个孩子），于是<b>整屏当成一块</b>浮 ——
       动是动了，但没有一张卡是分开的，读起来像整页闪了一下（实测 animationstart 只有一条，
       target 是 .bd-scroll）。所以先按名字找列表容器，找不到才退回探法。 */
  var LISTS='#bdCards,#bdMine,.bet-list,.rr-list,.gx-cards,[data-mo-list]';
  /* 08-13J：动画放慢到 380ms ＋ 最大延迟 225ms，摘 class 的等待跟着从 520 → 700ms。
     忘了改这里的话，最后几个元素会在动画途中被摘掉 class —— 表现是「后面几张突然定住」。 */
  var HOLD=700;

  function riseTarget(pane){
    var list=pane.querySelector(LISTS);
    if(list&&list.children.length>1)return list;
    var el=pane,hop=0;
    while(el&&el.children.length===1&&hop++<4)el=el.children[0];
    return el&&el.children.length?el:null;
  }
  function rise(pane){
    var t=riseTarget(pane);if(!t)return;
    t.classList.remove('mo-rise');
    void t.offsetWidth;                 /* 强制回流，否则同一帧内加回去不会重播 */
    t.classList.add('mo-rise');
    setTimeout(function(){t.classList.remove('mo-rise');},HOLD);
  }

  function onMutation(records){
    records.forEach(function(r){
      var el=r.target;
      if(r.attributeName==='class'){
        for(var i=0;i<PANES.length;i++){
          if(el.matches(PANES[i][0])&&el.classList.contains(PANES[i][1])&&
             (r.oldValue||'').indexOf(PANES[i][1])<0){rise(el);return;}
        }
      }else if(r.attributeName==='hidden'&&!el.hasAttribute('hidden')){rise(el);}
    });
  }

  function start(){
    if(!window.MutationObserver)return;
    var mo=new MutationObserver(onMutation);
    [].forEach.call(document.querySelectorAll('.view,.bd-l1pane'),function(el){
      mo.observe(el,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
    });
    [].forEach.call(document.querySelectorAll('[data-mo-panel]'),function(el){
      mo.observe(el,{attributes:true,attributeFilter:['hidden']});
    });
  }

  if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
})();

/* ══ 2026-08-16 · 顶端渐隐的滚动开关 ═══════════════════════════════════════
   蒙版渐隐（reference-theme 尾部那两段）只在容器真的滚动后出现——
   静止时首行不该被啃（Hector：dont have the blur fade before the scroll happen）。
   capture 监听：scroll 不冒泡，容器各自触发这里统一接。
   ⚠ 预览面板设 scrollTop 不发 scroll 事件（已知限制）——验收用 dispatchEvent，真机自然触发。 */
(function(){
  window.__scrollFadeHook=1;
  var SEL='.hall-body,.gx-list,.bd-scroll,.scroll2,.bd-oscroll,.view-chat .scroll';
  document.addEventListener('scroll',function(e){
    var t=e.target;
    if(!t||!(t instanceof Element)||!t.matches||!t.matches(SEL))return;
    t.classList.toggle('is-scrolled',t.scrollTop>4);
  },true);
})();

/* 取证开关（临时）：URL 带 ?debug=frame 时给 .screen 描红边+左上角报宽度，
   用于远程对质「屏外蓝」问题（Hector 端与本机渲染层不一致）。定位完即可删。 */
(function(){
  if(location.search.indexOf('debug=frame')<0)return;
  var s=document.querySelector('.screen');if(!s)return;
  s.style.outline='2px solid red';
  var b=document.createElement('div');
  var pt=document.querySelector('.bd-ptabs'),pc=pt?getComputedStyle(pt):null;
  b.textContent='screen '+Math.round(s.getBoundingClientRect().width)+'×'+Math.round(s.getBoundingClientRect().height)
    +' / win '+innerWidth+'×'+innerHeight
    +(pc?(' / ptabs w:'+pc.width+' ml:'+pc.marginLeft+' mr:'+pc.marginRight+' themeRules:'+document.styleSheets.length):' / ptabs:none(先切到我的策略再刷)');
  b.style.cssText='position:fixed;left:4px;top:4px;z-index:9999;background:#C00;color:#fff;font:700 11px/1.6 monospace;padding:2px 6px;border-radius:4px';
  document.body.appendChild(b);
})();

/* ══ 2026-08-16 · 蓝区自适应换色钩子（Hector：contrast on different background）═══════
   页顶蓝渐隐固定在 .screen 上不随内容滚 —— 于是同一个元素「滚到上半屏就站在蓝上」。
   这里按元素当前 y 与 --x-fade-end（各页自订的落地%）比较，给站在蓝区的挂 .on-blue，
   两套皮写在 hall.css。只认标了 data-adaptive 的选择器族，避免全页扫描。
   ⚠ 预览面板设 scrollTop 不发 scroll 事件（已知限制）：验收要 dispatchEvent，真机自然触发。 */
(function(){
  window.__adaptHook=1;
  var SEL='.gx-gh,.gx-tabs';           /* 分区标题 · 分类 chips */
  var screenEl,fadePx=0,raf=0;
  function calcFade(){
    screenEl=document.querySelector('.screen');if(!screenEl)return;
    var v=getComputedStyle(document.body).getPropertyValue('--x-fade-end').trim();
    var h=screenEl.getBoundingClientRect().height||1;
    fadePx=/%$/.test(v)?h*parseFloat(v)/100:(parseFloat(v)||0);
  }
  function sweep(){
    if(!screenEl)calcFade();if(!screenEl||!fadePx)return;
    var top=screenEl.getBoundingClientRect().top;
    document.querySelectorAll(SEL).forEach(function(el){
      var r=el.getBoundingClientRect();
      /* 元素中线还在蓝区内 → 站蓝上（留 8px 余量，避免边界抖动） */
      var on=(r.top+r.height/2-top)<(fadePx-8);
      el.classList.toggle('on-blue',on);
      window.__adaptLast={fadePx:Math.round(fadePx),n:document.querySelectorAll(SEL).length,at:Date.now()};
    });
  }
  /* ⚠ 不用 requestAnimationFrame 合帧：预览面板不推进 rAF（本项目已知限制族），
     排队的 sweep 永远不执行。改成 16ms 节流的直接调用，真机同样平滑。 */
  var lastRun=0;
  function schedule(){var t=Date.now();if(t-lastRun<16)return;lastRun=t;sweep();}
  document.addEventListener('scroll',schedule,true);
  /* 兜底轮询：预览面板设 scrollTop 不发 scroll 事件；真机也可能有惯性滚动末尾漏帧。
     200ms 一次、只在页面可见时跑，代价可忽略（sweep 只量两三个元素）。 */
  /* ⚠ 不用 !document.hidden 守卫：预览面板整体不在前台时 document.hidden 恒为 true，
     会把轮询整个挡掉（排障踩过）。sweep 只量两三个元素，200ms 一次代价可忽略。 */
  setInterval(schedule,200);
  window.addEventListener('resize',function(){calcFade();schedule();});
  document.addEventListener('click',function(){setTimeout(schedule,60);},true); /* 切页签/筛选后重扫 */
  if(document.readyState!=='loading')setTimeout(function(){calcFade();sweep();},0);
  else document.addEventListener('DOMContentLoaded',function(){calcFade();sweep();});
})();

/* ══ 2026-08-17 · 「离开游戏厅」确认（Hector：apply to all pages that go back to chat）══
   原来只有策略页有（那支绑在 hall-plans 页内，依赖它的 openSheet/MINE）。这里做一支
   <b>自足版</b>给其余游戏厅页用：不依赖任何页内函数与数据，只认「返回键指向 groups.html」。
   ⚠ 策略页自己那支保留（它能报「N 个策略正在运行」，信息更足）——本支用 data-leaveguard
     在 body 上打标，策略页不打标即自动跳过，避免两支同时拦一颗按钮。
   ⚠ capture 阶段拦：<a href> 的默认跳转要在冒泡前截住。
   ⚠ 确认过一次就放行（LEFT=true），否则「留在这里→再点返回」会连问两遍。
   回滚：删本段。 */
(function(){
  /* 2026-08-17：策略页那支已退役（两种样子的问题），这里统一接管；
     它把 runningCount 挂成 window.LEAVE_RUNNING，本支据此补出「N 个策略正在运行」。 */
  var LEFT=false;
  function backLinks(){
    return [].filter.call(document.querySelectorAll('a[href*="groups.html"]'),function(a){
      return a.classList.contains('gback')||a.classList.contains('bk');});
  }
  function ensureDlg(){
    var d=document.getElementById('leaveHallDlg');if(d)return d;
    d=document.createElement('div');d.id='leaveHallDlg';d.className='lh-mask';
    d.innerHTML='<div class="lh-card" role="dialog" aria-modal="true" aria-label="离开游戏厅">'+
      '<span class="lh-ico" aria-hidden="true">!</span>'+
      '<b class="lh-t">离开游戏厅？</b>'+
      '<p class="lh-p">策略在后台继续运行，离开不会中断它们。<br>返回游戏厅即可继续查看。</p>'+
      /* 2026-08-17 Hector：主次对调 —— 离开＝主动作（红实心、右），留在＝次级（描边、左）。
         回滚：左 lh-go 描边 / 右 lh-stay 主蓝。 */
      '<div class="lh-acts"><button type="button" class="lh-stay">留在游戏厅</button>'+
      '<button type="button" class="lh-go">离开</button></div></div>';
    document.body.appendChild(d);
    d.addEventListener('click',function(e){
      if(e.target===d||e.target.closest('.lh-stay')){d.classList.remove('on');return;}
      if(e.target.closest('.lh-go')){
        LEFT=true;d.classList.remove('on');
        var href=d.getAttribute('data-href')||'groups.html#groups';
        location.href=href;
      }
    });
    return d;
  }
  function runningN(){
    try{var f=window.LEAVE_RUNNING;return typeof f==='function'?(f()||0):(+f||0);}catch(err){return 0;}
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="groups.html"]');
    if(!a||LEFT)return;
    if(!(a.classList.contains('gback')||a.classList.contains('bk')))return;
    if(document.body.classList.contains('bd-inner'))return;   /* 内页：照旧一步返回 */
    e.preventDefault();e.stopPropagation();
    var d=ensureDlg(),n=runningN();
    d.querySelector('.lh-p').innerHTML=(n?('<b>'+n+'</b> 个策略正在运行，离开不会中断它们。')
      :'策略在后台继续运行，离开不会中断它们。')+'<br>返回游戏厅即可继续查看。';
    d.setAttribute('data-href',a.getAttribute('href'));d.classList.add('on');
  },true);
})();

/* 投注页 ⋯ 菜单里的「显示方式」选中态（2026-08-17）——点了打勾，逻辑仍走既有 data-act=skin。 */
(function(){
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.bhm-skin');if(!b)return;
    document.querySelectorAll('.bhm-skin').forEach(function(x){x.classList.toggle('is-on',x===b);});
  },true);
})();

/* ══ 2026-08-17 · 全站倒计时统一规格（Hector：「make all the timer consistent」）══════
   改之前全站有三种读法、四套配色：
     ⓐ 投注/聊天/管理/钱包 顶部节拍条 .rseal —— 「0分48秒」＋甜甜圈＋逐秒 hue 绿→红
     ⓑ 策略页 tab条/卡脚/下一期 .bd-ptcd —— 「0分9秒」＋同一颗甜甜圈＋同一条 hue
     ⓒ 彩票厅 游戏卡 .gx-timer —— 「00:25」＋时钟轮廓图标＋固定蓝
     ⓓ 彩票厅 正在连开 .gx-opnext —— 「00:01」＋进度环＋hue
   统一成一条：<b>进度环 ＋ 等宽 mm:ss ＋ 两态配色</b>。
   为什么是 mm:ss 而不是「M分S秒」：中文写法<b>宽度会跳</b>（0分9秒 → 0分10秒 把整行右侧推着抖），
   mm:ss 定长等宽，成排放（彩票厅一屏十几张卡）才对得齐。
   为什么放弃 hue 插值：每一秒都在换颜色 ＝ 没有任何一秒是「信号」；两态把阈值说清楚。

   阈值用<b>周期相对</b>而非固定秒数 —— 本原型的演示节拍只有 11–22 秒，固定 15 秒会让
   策略页整屏常驻红；而彩票厅有 3–4 分钟的款，固定 15 秒又太晚。
   公式：剩余 ≤ 周期的 20%，但最多提前 15 秒。 */
window.TIMER_URGENT=function(rem,cyc){
  return rem<=Math.min(15,(cyc||60)*0.2);
};
/* 等宽 mm:ss —— 三处（app.js fmt / hall-plans beatText / hall-lottery paint*）都调它。 */
window.TIMER_TEXT=function(s){
  s=Math.max(0,s|0);var m=Math.floor(s/60),x=s%60;
  return (m<10?'0':'')+m+':'+(x<10?'0':'')+x;
};
