/* ══════════════════════════════════════════════════════════════════════════
   IM168 · 自动投 · 历史试跑「工作台」 —— 行为
   来源：Ref/IM168_AutoBet_TrialRun_Workbench_V3.html（V3.6.1 · 2026-07-29）
   引擎 / 样本 / 口径与 V3、v1.2 冻结档同源，逐位自校验（见文件末的载入校验）。

   这个模块<只加东西>，不改自动投页原有的任何功能：
     · 自动投页顶部加两条：十名次「路子条」＋「先用历史试跑」入口条（#trTopBand）
     · 执行动态那排图标多一个 🧪；策略详情底部变成 编辑 · 🧪 试跑 · 启用
     · ＋新建策略 先进「模板页」，不再直接进向导
     · 新增三个整屏：看路屏（view-road）· 模板页（view-tplpick）· 工作台（view-bench）

   口径要点（07-29 会议 + V3）：
     · 试跑<只跑最新那一段路子>，没有换样本按钮 —— 能挑样本就等于能挑一个好看的
       结论，那不是验证是选美。波动改由只读的「稳健度」页呈现。
     · 回合数 R ＝下注次数预算；输赢都不提前停，只有止盈/止损能截停。
     · 命中一律写成 x/y（y＝触发次数），不出现裸百分比。
     · 位置条只切换查看；改策略只走「＋加入策略」和位置卡片。
     · 参数从观察 → 试跑 → 创建全程带过去，不重填。

   自定义 data 属性一律用 data-tract / data-tr*，不占用 data-act ——
   shared/app.js 的事件委托只认 data-act，两边互不干扰。
   ══════════════════════════════════════════════════════════════════════════ */

(function(){
  'use strict';

  /* ══ 数据与引擎：与 v1.2 / V3 同源 ══
     三段历史样本。wi 恒为 0 ＝「最新那一段」，试跑只认它；
     另外两段只在「稳健度」页作只读参考出现。 */
  var WINDOWS=[
    {lab:'今天',range:'00029–00088',start:29,seq:[1,1,0,1,1,1,1,0,1,0,0,0,0,1,1,0,1,0,0,0,0,1,0,0,1,0,1,0,1,1,0,0,0,1,0,1,1,0,1,1,1,1,0,1,1,0,1,0,0,1,1,1,1,1,0,1,1,0,1,1]},
    {lab:'昨天',range:'00701–00760',start:701,seq:[1,1,1,1,0,0,1,1,1,0,0,0,0,1,1,0,1,1,1,1,1,0,0,1,0,0,0,1,1,0,0,1,1,1,1,0,1,0,0,0,0,1,1,0,0,1,1,1,0,0,1,0,1,1,1,1,0,0,0,1]},
    {lab:'前天',range:'00341–00400',start:341,seq:[1,1,0,1,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,1,0,1,0,0,1,1,0,1,1,1,1,0,0,1,0,1,1,0,1,0,0,0,1,1,1]}
  ];
  var ODDS=1.95,RMAX=12,SMAX=12,BAL=240000;
  var LADDER_RESET=true;   /* 赢即回 R1。仍未决：倍投赢后是否归零（待 Les 确认） */
  var HOT=4;               /* 路子条的金色门槛：中性的 4 连，不取选中策略的 min */
  var STOPTXT={rounds:'回合用完',sl:'止损截停',tp:'止盈达成',endofdata:'这段路子没跑满'};
  var RISKTXT={low:'低风险',mid:'中风险',high:'自己拿主意'};

  /* 新建走「先给模板」（Les 07-27 的要求），不是直接把人丢进试跑 */
  var TEMPLATES=[
    {name:'官方 · 稳健反投',risk:'low',dir:'break',min:4,max:8,R:8,mult:2,base:10,tp:300,sl:300,focus:{0:1},cur:0,
     note:'连 4–8 期才出手，赌它断掉。回合少、门槛低，最常用的一套。'},
    {name:'官方 · 长龙跟投',risk:'mid',dir:'chase',min:4,max:8,R:10,mult:2,base:10,tp:300,sl:300,focus:{0:1},cur:0,
     note:'连 4–8 期出手，赌它继续。回合给到 10，本金要求跳一档。'},
    {name:'小资金试水',risk:'low',dir:'break',min:5,max:9,R:5,mult:2,base:10,tp:100,sl:100,focus:{0:1},cur:0,
     note:'只跑 5 回合，最坏情况 310 额度就够——先摸清规则再加码。'},
    {name:'自定义',risk:'high',dir:'break',min:4,max:8,R:10,mult:2,base:10,tp:300,sl:300,focus:{0:1,2:1,4:1},cur:0,
     note:'从三个位置的空白草稿开始，位置和参数全部自己配。'}
  ];

  function lcg(seed){return function(){seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};}
  /* 由「冠军大小」的 0/1 序列反推出十个名次的完整开奖，保证冠军通道与手工样本逐位一致 */
  function buildDraws(seq,seed){
    var rnd=lcg(seed);
    return seq.map(function(v){
      var pool=[1,2,3,4,5,6,7,8,9,10],i,j,t;
      for(i=pool.length-1;i>0;i--){j=Math.floor(rnd()*(i+1));t=pool[i];pool[i]=pool[j];pool[j]=t;}
      var want=(v===1);
      for(i=0;i<10;i++){if((pool[i]>=6)===want){t=pool[0];pool[0]=pool[i];pool[i]=t;break;}}
      return pool;
    });
  }
  var DRAWS=WINDOWS.map(function(W,i){return buildDraws(W.seq,7919*(i+1)+13);});
  var POSN=['冠军','亚军','季军','第四','第五','第六','第七','第八','第九','第十'];
  var POSS=['冠','亚','季','四','五','六','七','八','九','十'];      /* 路子条上的窄标签 */
  var PLAYS={bs:{lab:'大小',a:'大',b:'小',f:function(n){return n>=6?1:0;}},
             oe:{lab:'单双',a:'单',b:'双',f:function(n){return n%2===1?1:0;}}};
  /* 20 个通道 ＝ 10 名次 × 2 玩法，交错排列（与自动投的「投注项」是同一个模型） */
  var LANES=[];(function(){for(var p=0;p<10;p++){LANES.push({pi:p,pk:'bs'});LANES.push({pi:p,pk:'oe'});}})();
  function laneName(L){return POSN[L.pi]+'·'+PLAYS[L.pk].lab;}
  function laneIdx(pi,pk){return pi*2+(pk==='bs'?0:1);}
  function laneFace(L,v){return v===1?PLAYS[L.pk].a:PLAYS[L.pk].b;}
  function laneSeq(wi,L){var f=PLAYS[L.pk].f;return DRAWS[wi].map(function(r){return f(r[L.pi]);});}

  /* 触发统计：h＝当前连长；trig＝落在 [min,max] 的机会数；chase/brk＝跟/反各中几次。
     07-29 §2：chase + brk === trig，所以屏上的 x/y 永远可以对账。 */
  function laneStats(seq,min,max){
    var h=0,prev=null,trig=0,cw=0,bw=0,idx=[];
    for(var i=0;i<seq.length;i++){
      var v=seq[i];h=(prev===v)?h+1:1;prev=v;
      if(h>=min&&h<=max&&i<seq.length-1){trig++;idx.push(i+1);if(seq[i+1]===v)cw++;else bw++;}
    }
    return {trig:trig,chase:cw,brk:bw,curH:h,curV:prev,idx:idx};
  }
  /* 一个通道跑一遍：R 是下注次数预算，输赢都不提前停；只有止盈/止损能截停 */
  function simulate(seq,cfg){
    var marks=seq.map(function(){return null;});
    var st={bets:0,win:0,lose:0,stake:0,net:0,deep:0,worst:0,stop:'',stopAt:-1};
    var ladder=0,runLoss=0,pending=null,h=0,prev=null,tp=cfg.tp||0,sl=cfg.sl||0;
    for(var i=0;i<seq.length;i++){
      var v=seq[i];
      if(pending){
        if(v===pending.pick){
          marks[pending.i].result='win';st.win++;st.net+=pending.stake*(ODDS-1);
          if(LADDER_RESET){ladder=0;runLoss=0;}else{ladder++;}
        }else{
          marks[pending.i].result='lose';st.lose++;st.net-=pending.stake;
          ladder++;runLoss+=pending.stake;st.worst=Math.max(st.worst,runLoss);
        }
        pending=null;
        if(!st.stop&&sl&&st.net<=-sl){st.stop='sl';st.stopAt=i;}
        if(!st.stop&&tp&&st.net>=tp){st.stop='tp';st.stopAt=i;}
        if(!st.stop&&st.bets>=cfg.R){st.stop='rounds';st.stopAt=i;}
      }
      h=(prev===v)?h+1:1;prev=v;
      if(st.stop)continue;
      if(i>=seq.length-1)continue;
      if(st.bets>=cfg.R)continue;
      if(h>=cfg.min&&h<=cfg.max){
        var rung=ladder+1,stake=Math.round(cfg.base*Math.pow(cfg.mult,ladder));
        marks[i+1]={bet:true,pick:(cfg.dir==='chase')?v:(1-v),stake:stake,rung:rung,result:null};
        st.bets++;st.stake+=stake;st.deep=Math.max(st.deep,rung);
        pending={i:i+1,pick:marks[i+1].pick,stake:stake};
      }
    }
    if(!st.stop)st.stop=(st.bets>=cfg.R)?'rounds':'endofdata';
    return {marks:marks,st:st};
  }
  /* 止损会在第几个连输回合截停 —— 后面的回合等于设了用不到 */
  function slCutRung(base,mult,sl){
    if(!sl)return null;var c=base,sum=0;
    for(var n=1;n<=40;n++){sum+=c;if(sum>sl)return n;c*=mult;}
    return null;
  }
  function ladderRows(base,mult,R){
    var rows=[],c=base,sum=0;
    for(var n=1;n<=R;n++){sum+=c;rows.push({n:n,stake:Math.round(c),cum:Math.round(sum)});c*=mult;}
    return rows;
  }
  function ladderTotal(base,mult,R){var r=ladderRows(base,mult,R);return r.length?r[r.length-1].cum:0;}
  function money(n){return Math.round(n).toLocaleString('en-US');}
  function signed(n){n=Math.round(n);return (n>0?'+':(n<0?'−':''))+Math.abs(n).toLocaleString('en-US');}
  function maxRunOf(seq){
    var m=0,c=0,prev=null;
    seq.forEach(function(v){c=(prev===v)?c+1:1;prev=v;if(c>m)m=c;});
    return m;
  }
  /* 同色叠柱；超 6 珠拐弯继续（真正的路子图画法） */
  function pillars(seq){
    var p=[];seq.forEach(function(v,i){
      if(p.length&&p[p.length-1].v===v)p[p.length-1].idx.push(i);else p.push({v:v,idx:[i]});
    });return p;
  }
  /* keepCols＝只画最后几列。柱子仍在<完整序列>上算好再截列，所以柱下的连长数字是真的。 */
  function renderRoad(el,seq,marks,L,keepCols){
    if(!el)return;
    el.innerHTML='';
    var cols=[];
    pillars(seq).forEach(function(p){
      for(var c=0;c<p.idx.length;c+=6){
        cols.push({v:p.v,chunk:p.idx.slice(c,c+6),h:p.idx.length,last:(c+6>=p.idx.length)});
      }
    });
    if(keepCols)cols=cols.slice(-keepCols);
    cols.forEach(function(co){
      var col=document.createElement('div');col.className='tr-pil';
      co.chunk.forEach(function(pi){
        var b=document.createElement('div');
        b.className='tr-bd '+(co.v===1?'v1':'v0');
        b.textContent=laneFace(L,co.v);
        var m=marks&&marks[pi];
        if(m&&m.bet){
          b.classList.add('tgt');
          if(m.result){
            var g=document.createElement('i');
            g.className='tr-bg '+(m.result==='win'?'w':'l');
            g.textContent=(m.result==='win'?'✓':'✕');
            b.appendChild(g);
          }
        }
        col.appendChild(b);
      });
      if(co.last){var hh=document.createElement('div');hh.className='tr-ph';hh.textContent=co.h;col.appendChild(hh);}
      el.appendChild(col);
    });
    if(el.parentElement)el.parentElement.scrollLeft=el.parentElement.scrollWidth;
  }

  /* ══════════ 状态 ══════════
     持久化到 sessionStorage：拆成「每页一个 HTML」之后，屏间跳转是<真的换页>，
     所以试跑的参数必须能跨页活下来（07-29 §1.3 参数带过去，不重填）。 */
  var SKEY='im168_trialrun_state';
  var PKEY='im168_trialrun_pending_setup';   /* 「用这个建策略」跨页兑现用 */
  var DEFAULT={
    nav:[],r2pos:0,stripPk:'bs',
    plan:{name:'新策略（草稿）',src:'从试跑入口进入'},
    dir:'break',min:4,max:8,R:10,base:10,mult:2,tp:300,sl:300,wi:0,
    cur:0,focus:{0:1,2:1,4:1},edit:null,mtab:'detail',coach:false
  };
  var S=load();
  function load(){
    try{
      var raw=sessionStorage.getItem(SKEY);
      if(raw){
        var o=JSON.parse(raw),out={};
        Object.keys(DEFAULT).forEach(function(k){out[k]=(o[k]===undefined)?clone(DEFAULT[k]):o[k];});
        if(!out.focus||!Object.keys(out.focus).length)out.focus={0:1};
        return out;
      }
    }catch(e){}
    return clone(DEFAULT);
  }
  function save(){try{sessionStorage.setItem(SKEY,JSON.stringify(S));}catch(e){}}
  function clone(v){return JSON.parse(JSON.stringify(v));}

  function $(s){return document.querySelector(s);}
  function focusList(){return Object.keys(S.focus).filter(function(k){return S.focus[k];}).map(Number);}
  function cfg(){return {dir:S.dir,min:S.min,max:S.max,R:S.R,base:S.base,mult:S.mult,tp:S.tp,sl:S.sl};}
  function curLane(){return LANES[S.cur]||LANES[0];}
  function stat(L){return laneStats(laneSeq(S.wi,L||curLane()),S.min,S.max);}
  function codeTxt(){return 'S'+S.min+'M'+S.max;}
  function needOne(){return ladderTotal(S.base,S.mult,S.R);}
  function needAll(){return needOne()*Math.max(1,focusList().length);}
  function perLane(){
    return focusList().map(function(i){
      return {i:i,L:LANES[i],st:simulate(laneSeq(S.wi,LANES[i]),cfg()).st};
    });
  }
  function outAll(){
    var t={net:0,bets:0,stops:{}};
    perLane().forEach(function(p){
      t.net+=p.st.net;t.bets+=p.st.bets;t.stops[p.st.stop]=(t.stops[p.st.stop]||0)+1;
    });
    return t;
  }
  function stopSummary(t){
    var ks=Object.keys(t.stops);
    if(!ks.length)return '未出手';
    if(ks.length===1)return STOPTXT[ks[0]];
    return ks.sort(function(a,b){return t.stops[b]-t.stops[a];}).map(function(k){return STOPTXT[k]+'×'+t.stops[k];}).join(' ');
  }
  /* stable＝勾选不置顶（位置卡片用：点一下就跳位会让人找不到刚点的卡） */
  function laneRank(n,stable){
    var rows=LANES.map(function(L,i){
      var s=stat(L);return {i:i,L:L,s:s,win:(S.dir==='chase')?s.chase:s.brk};
    });
    rows.sort(function(a,b){
      if(!stable){
        var fa=S.focus[a.i]?1:0,fb=S.focus[b.i]?1:0;
        if(fa!==fb)return fb-fa;
      }
      return b.s.trig-a.s.trig;
    });
    return n?rows.slice(0,n):rows;
  }
  /* 迷你路子图：与主路子图同一种画法（叠柱 · 金圈＝会下注），只是小一号。
     容器右对齐＋左侧渐隐 → 永远看到最近的走势。 */
  function renderMini(el,L){
    var seq=laneSeq(S.wi,L),st=laneStats(seq,S.min,S.max),tset={};
    st.idx.forEach(function(i){tset[i]=1;});
    var from=Math.max(0,seq.length-24),tail=seq.slice(from);
    el.innerHTML='';
    pillars(tail).forEach(function(p){
      for(var c=0;c<p.idx.length;c+=6){
        var col=document.createElement('span');col.className='tr-mpil';
        p.idx.slice(c,c+6).forEach(function(ti){
          var b=document.createElement('b');
          b.className='tr-mb '+(p.v===1?'v1':'v0')+(tset[from+ti]?' tg':'');
          b.textContent=laneFace(L,p.v);
          col.appendChild(b);
        });
        el.appendChild(col);
      }
    });
  }

  /* ══════════ 跨屏跳转 ══════════
     单页时走 app.js 的 showView；拆页后 showView 里的 IM168_PAGENAV 钩子会
     把它变成真正的换页（并把参数留在 sessionStorage 里）。 */
  function goView(v){
    save();
    if(window.IM168_SHOW){window.IM168_SHOW(v);return;}
    if(window.IM168_PAGENAV&&window.IM168_PAGENAV.route(v))return;
    location.hash=v;
  }
  function currentViewName(){
    var on=document.querySelector('.view.on');
    if(!on)return '';
    var m=(on.className||'').match(/view-([a-z0-9]+)/);
    return m?m[1]:'';
  }
  function go(v){S.nav.push(currentViewName()||'autos');goView(v);}
  function back(){
    var prev=S.nav.pop()||'autos';
    goView(prev);
  }

  /* ══════════ 一、自动投页顶部：路子条 ＋ 试跑入口条 ══════════ */
  function paintTopBand(){
    var host=$('#trTopBand');if(!host)return;
    var pk=S.stripPk;
    var cells=POSN.map(function(nm,pi){
      var L={pi:pi,pk:pk},s=laneStats(laneSeq(0,L),4,8),hot=(s.curH>=HOT);
      return '<span class="tr-pc" data-trpos="'+pi+'">'
        +'<span class="tr-bd2 c'+s.curV+(hot?' hot':'')+'">'+laneFace(L,s.curV)
        +'<em>'+s.curH+'</em></span><span>'+POSS[pi]+'</span></span>';
    }).join('');
    /* 只有<珠子那一行>可点（进看路屏），行尾一个 › 表明这件事 —— 标题行不可点，
       否则点玩法切换旁边的空白会莫名跳页。试跑入口收到标题行右上角，
       原来那条占两行的「先用历史试跑」横幅整块去掉了。
       玩法切换（data-trpk）和单个名次（data-trpos）都带自己的 data 属性，
       事件里用 closest 取<最近>的那一个，所以点它们不会触发整行跳转。 */
    host.innerHTML=
      '<div class="tr-strip">'
      +'<div class="tr-rh"><b>最新路子图</b>'
      +'<span class="tr-pkseg">'+['bs','oe'].map(function(k){
          return '<button type="button" data-trpk="'+k+'" class="'+(pk===k?'on':'')+'" aria-pressed="'+(pk===k?'true':'false')+'">'+PLAYS[k].lab+'</button>';
        }).join('')+'</span>'
      +'<button type="button" class="tr-tryentry" data-tract="bench-auto">🧪 试跑策略</button></div>'
      +'<div class="tr-pos10" data-tract="road" role="button" tabindex="0" aria-label="查看十个名次的完整大路">'
      +cells+'<span class="tr-chev" aria-hidden="true">›</span></div>'
      +'</div>';
  }

  /* ══════════ 二、看路屏：十个名次，每段都是完整的大路 ══════════ */
  function paintRoadScreen(){
    var body=$('#trRoadBody');if(!body)return;
    var pk=S.stripPk;
    var seg=$('#trRoadSeg');
    if(seg){
      seg.innerHTML=['bs','oe'].map(function(k){
        return '<button type="button" data-trpk="'+k+'" class="'+(pk===k?'on':'')+'" aria-pressed="'+(pk===k?'true':'false')+'">'+PLAYS[k].lab+'</button>';
      }).join('');
    }
    var h='<div class="tr-roadfoot" style="margin:0 0 8px">'
      +'<span class="lg"><i class="dot" style="background:var(--red)"></i>'+PLAYS[pk].a+'</span>'
      +'<span class="lg"><i class="dot" style="background:var(--blue)"></i>'+PLAYS[pk].b+'</span>'
      +'<span class="lg">同色叠柱 · 柱下数＝连了几期 · 超 6 珠拐弯续</span></div>';
    h+=POSN.map(function(nm,pi){
      var L={pi:pi,pk:pk},seq=laneSeq(0,L),st=laneStats(seq,4,8);
      return '<div class="tr-rsec'+(pi===S.r2pos?' on':'')+'" data-trpos="'+pi+'">'
        +'<div class="tr-rsh"><b>'+nm+'</b><span class="sp"></span>'
        +'<em class="'+(st.curH>=HOT?'hot':'')+'">当前连 <b>'+st.curH+'</b></em>'
        +'<em>最长 <b>'+maxRunOf(seq)+'</b></em></div>'
        +'<div class="tr-roadbox"><div class="tr-road" id="trRR'+pi+'"></div></div></div>';
    }).join('');
    body.innerHTML=h;
    /* 每段各画一幅完整大路；renderRoad 会把它滚到最右＝最新一期 */
    POSN.forEach(function(nm,pi){
      renderRoad(document.getElementById('trRR'+pi),laneSeq(0,{pi:pi,pk:pk}),null,{pi:pi,pk:pk});
    });
    var Lsel={pi:S.r2pos,pk:pk},seqSel=laneSeq(0,Lsel),stSel=laneStats(seqSel,4,8),n1=0;
    seqSel.forEach(function(v){if(v===1)n1++;});
    var sel=$('#trRoadSel'),info=$('#trRoadInfo');
    if(sel)sel.textContent=laneName(Lsel);
    if(info)info.textContent='当前连 '+stSel.curH+' · 本段最长 '+maxRunOf(seqSel)+' · '
      +PLAYS[pk].a+'/'+PLAYS[pk].b+' '+n1+'/'+(seqSel.length-n1);
  }

  /* ══════════ 三、模板页：先给模板，不直接丢进试跑 ══════════ */
  function paintTplScreen(){
    var body=$('#trTplBody');if(!body)return;
    var h='<div class="tr-note">挑一个模板打底，再改成自己的。想先验证再决定？每个模板都能<b>直接拿去试跑</b>。</div>';
    h+=TEMPLATES.map(function(t,i){
      var need=ladderTotal(t.base,t.mult,t.R)*Object.keys(t.focus).length;
      return '<div class="tr-tpl"><div class="r1"><b>'+t.name+'</b>'
        +'<span class="tg '+t.risk+'">'+RISKTXT[t.risk]+'</span></div>'
        +'<div class="r2">'+(t.dir==='chase'?'跟投':'反投')+' · S'+t.min+'M'+t.max+' · R'+t.R+' · '+t.mult+'× · '
        +Object.keys(t.focus).length+' 个位置 · 最坏需备 <b>'+money(need)+'</b></div>'
        +'<div class="tr-note" style="margin:0">'+t.note+'</div>'
        +'<div class="r3"><button type="button" class="try" data-trtpl="'+i+'">🧪 试跑策略</button>'
        +'<button type="button" class="pri" data-tract="usetpl" data-trtpl2="'+i+'">启用策略</button></div></div>';
    }).join('');
    body.innerHTML=h;
  }

  /* ══════════ 四、工作台 ══════════ */
  function paintTop(){
    var n=$('#trPlanName'),s=$('#trPlanSrc');
    if(n)n.textContent=S.plan.name;
    if(s)s.textContent=S.plan.src;
  }
  /* 位置条排序：策略里的在前，其余按触发多少，补满 8 个。
     「正在看的」只保证<在条里>，不参与排序 —— 否则点一个胶囊它就窜到最前面，
     等于每次翻看都在指下跳位。 */
  function railRows(n){
    var all=laneRank(0,true),foc={};
    focusList().forEach(function(i){foc[i]=1;});
    var head=all.filter(function(r){return foc[r.i];}),
        tail=all.filter(function(r){return !foc[r.i];}),
        list=head.concat(tail),
        out=list.slice(0,Math.max(n,head.length));
    if(!out.some(function(r){return r.i===S.cur;})){
      var cr=list.filter(function(r){return r.i===S.cur;})[0];
      if(cr)out.push(cr);   /* 从位置卡选了冷门位置时，把它补到条尾，不挤掉别人 */
    }
    return out;
  }
  /* 选中的胶囊必须看得见：补到条尾的冷门位置本来会停在可视范围外，看起来「什么都没选」 */
  function revealActive(rail){
    if(!rail)return;
    var a=rail.querySelector('button.on');
    if(a)rail.scrollLeft=Math.max(0,a.offsetLeft-8);
  }
  function paintRail(){
    var rail=$('#trRail');if(!rail)return;
    rail.innerHTML=railRows(8).map(function(r){
      return '<button type="button" data-trlane="'+r.i+'" class="'+(r.i===S.cur?'on ':'')+(S.focus[r.i]?'foc':'')+'">'
        +(S.focus[r.i]?'<i class="fk">✓</i>':'')
        +'<span>'+laneName(r.L)+'</span>'
        +'<em>连'+r.s.curH+' · '+r.win+'/'+r.s.trig+'</em></button>';
    }).join('');
    revealActive(rail);
  }
  function paintRoad(){
    var road=$('#trRoad');if(!road)return;
    var o=simulate(laneSeq(S.wi,curLane()),cfg());
    renderRoad(road,laneSeq(S.wi,curLane()),o.marks,curLane());
    var rl=$('#trRoadLane'),rc=$('#trRoadCount');
    if(rl)rl.textContent=laneName(curLane());
    if(rc)rc.textContent='下注 '+o.st.bets+' 期';
    /* 加入／移出策略：最后一个位置不能移出（没有位置就没有东西可算） */
    var ab=$('#trAddBtn'),inp=!!S.focus[S.cur],only=(inp&&focusList().length===1);
    if(ab){
      ab.className='tr-addb'+(inp?' inplan':'')+(only?' lock':'');
      ab.textContent=only?'✓ 策略里就这个':(inp?'✓ 已在策略':'＋ 加入策略');
    }
    var L=curLane(),leg=$('#trLegend');
    if(leg){
      leg.innerHTML=
        '<span class="lg"><i class="dot" style="background:var(--red)"></i>'+PLAYS[L.pk].a+'</span>'
        +'<span class="lg"><i class="dot" style="background:var(--blue)"></i>'+PLAYS[L.pk].b+'</span>'
        +'<span class="lg"><i class="ring"></i>会下注</span>'
        +'<span class="lg" style="color:var(--win)">✓中</span><span class="lg" style="color:#8E1F1F">✕未中</span>'
        +'<span class="lg">柱下数＝连几期 · 超 6 珠拐弯续</span>';
    }
  }
  function paintChipRow(){
    var box=$('#trChips');if(!box)return;
    var s=stat();
    var items=[
      {k:'pos',t:'位置',v:focusList().length+' 个'},
      {k:'dir',t:'方向',v:(S.dir==='chase'?'跟 ':'反 ')+((S.dir==='chase')?s.chase:s.brk)+'/'+s.trig},
      {k:'range',t:'区间',v:codeTxt()},
      {k:'rounds',t:'回合',v:'R'+S.R},
      {k:'stake',t:'注·倍投',v:S.base+'×'+S.mult}
    ];
    box.innerHTML=items.map(function(it){
      return '<button type="button" data-tredit="'+it.k+'" class="'+(S.edit===it.k?'on':'')+'"><span>'+it.t+'</span><b>'+it.v+'</b></button>';
    }).join('');
  }
  /* 滑块拖动中只能改数值不能重建 DOM（重建会把正在拖的滑块换掉、drag 直接断）。
     所以编辑器拆成两层：paintEditor 建骨架，editorInPlace 原地刷值。 */
  function editorInPlace(){
    var rg=$('#trRangeCtl');
    if(rg){
      var f=rg.querySelector('.tr-rangefill');
      var lo=(S.min-1)/(SMAX-1)*100,hi=(S.max-1)/(SMAX-1)*100;
      f.style.left=lo+'%';f.style.width=Math.max(0,hi-lo)+'%';
      rg.querySelector('.rmin').value=S.min;rg.querySelector('.rmax').value=S.max;
      var c=$('#trEdCode');if(c)c.textContent=codeTxt();
    }
    var rr=$('#trRoundCtl');
    if(rr){
      var f2=rr.querySelector('.tr-rangefill');
      f2.style.left='0%';f2.style.width=((S.R-1)/(RMAX-1)*100)+'%';
      rr.querySelector('.rone').value=S.R;
      var rt=$('#trEdRt');
      if(rt)rt.textContent='R'+S.R+' · 单位置需备 '+money(needOne());
      var sw=$('#trSlWarn');
      if(sw){
        var cut=slCutRung(S.base,S.mult,S.sl);
        if(cut&&cut<S.R){sw.classList.add('show');sw.textContent='止损 '+S.sl+' 会在第 '+cut+' 个连输回合截停，后 '+(S.R-cut)+' 回合用不到。';}
        else{sw.classList.remove('show');sw.textContent='';}
      }
    }
  }
  function rangeCtrl(id,min,max){
    return '<div class="tr-rangewrap" id="'+id+'">'
      +'<div class="tr-rangetrack"></div><div class="tr-rangefill"></div>'
      +'<input type="range" class="rmin" min="1" max="'+SMAX+'" step="1" value="'+min+'">'
      +'<input type="range" class="rmax" min="1" max="'+SMAX+'" step="1" value="'+max+'"></div>'
      +'<div class="tr-ticks"><span>1</span><span>4</span><span>8</span><span>12</span></div>';
  }
  function paintEditor(){
    var ed=$('#trEditor');if(!ed)return;
    var s=stat();
    if(!S.edit){ed.classList.remove('show');ed.innerHTML='';return;}
    if(S.edit==='pos'){S.edit=null;ed.classList.remove('show');ed.innerHTML='';paintChipRow();openSheet('pos');return;}
    ed.classList.add('show');
    if(S.edit==='dir'){
      /* 07-29 §3：选的当下就看到这个方向在同一段样本上的结果 */
      ed.innerHTML='<div class="tr-seg">'
        +'<button type="button" data-trdir="chase" class="'+(S.dir==='chase'?'on':'')+'">跟投<span class="hr">'+s.chase+'/'+s.trig+'</span></button>'
        +'<button type="button" data-trdir="break" class="'+(S.dir==='break'?'on':'')+'">反投<span class="hr">'+s.brk+'/'+s.trig+'</span></button></div>';
    }
    if(S.edit==='range'){
      ed.innerHTML='<div class="tr-lab">多长的龙才出手<span class="tr-code" id="trEdCode">'+codeTxt()+'</span></div>'
        +rangeCtrl('trRangeCtl',S.min,S.max);
    }
    if(S.edit==='rounds'){
      ed.innerHTML='<div class="tr-lab">最多下注几回合<span class="rt" id="trEdRt"></span></div>'
        +'<div class="tr-rangewrap" id="trRoundCtl">'
        +'<div class="tr-rangetrack"></div><div class="tr-rangefill"></div>'
        +'<input type="range" class="rone" min="1" max="'+RMAX+'" step="1" value="'+S.R+'"></div>'
        +'<div class="tr-ticks"><span>1</span><span>5</span><span>8</span><span>12</span></div>'
        +'<div class="tr-slwarn" id="trSlWarn"></div>';
    }
    if(S.edit==='stake'){
      ed.innerHTML='<div class="tr-lab">倍投倍率</div><div class="tr-seg">'
        +[1,2,2.5,3].map(function(m){return '<button type="button" data-trmult="'+m+'" class="'+(S.mult===m?'on':'')+'">'+(m===1?'固定':m+'×')+'</button>';}).join('')+'</div>';
    }
    editorInPlace();
  }
  function paintChips(){paintChipRow();paintEditor();}
  function paintMid(){
    var mb=$('#trMidBody');if(!mb)return;
    document.querySelectorAll('#trMidTabs button').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-trmt')===S.mtab);
    });
    if(S.mtab==='detail'){
      mb.innerHTML=perLane().map(function(p){
        return '<div class="tr-drow"><span class="nm">'+laneName(p.L)+'</span>'
          +'<span class="st">出手 '+p.st.bets+'/'+S.R+' · 中 '+p.st.win+' · '+STOPTXT[p.st.stop]+'</span>'
          +'<b class="'+(p.st.net>0?'pos':(p.st.net<0?'neg':''))+'">'+signed(p.st.net)+'</b></div>';
      }).join('')
      +'<div class="tr-sfoot">每个位置各自触发、各爬各的梯子；上面路子图画的是「'+laneName(curLane())+'」。</div>';
    }
    if(S.mtab==='money'){
      var rows=ladderRows(S.base,S.mult,S.R);
      mb.innerHTML='<table class="tr-mt"><thead><tr><th>回合</th><th>单注</th><th>累计</th></tr></thead><tbody>'
        +rows.map(function(r){return '<tr class="'+(r.cum>BAL?'hot':'')+'"><td>R'+r.n+'</td><td>'+money(r.stake)+'</td><td>'+money(r.cum)+'</td></tr>';}).join('')
        +'</tbody></table>'
        +'<div class="tr-sfoot">单位置 <b>'+money(needOne())+'</b> × '+focusList().length+' 位置 ＝ 合计 <b>'+money(needAll())+'</b>'
        +(needAll()>BAL?'（<b style="color:var(--red)">超出余额</b>）':'（余额够）')
        +(S.mult<=2?' · 纯 2 倍数学上追不平（赔率 1.95）':'')+'</div>';
    }
    /* 稳健度：只读。试跑本身锁死在最新那一段；「同样设置放到更早历史上会怎样」只作为
       提示摆出来，不给切换按钮 —— 能挑样本就等于能挑一个好看的结论，那就不是验证了。 */
    if(S.mtab==='cmp'){
      var nets=WINDOWS.map(function(W,i){return simulate(laneSeq(i,curLane()),cfg()).st;});
      mb.innerHTML='<table class="tr-wt"><thead><tr><th>历史段 · '+laneName(curLane())+'</th><th>回合</th><th>净结果</th><th>结束</th></tr></thead><tbody>'
        +WINDOWS.map(function(W,i){
          var st=nets[i],anchor=(i===0);
          return '<tr'+(anchor?' style="background:var(--blue-soft)"':'')+'>'
            +'<td>'+(anchor?'<b>最新（本次试跑）</b>':'<span style="color:var(--faint)">更早 · 仅参考</span>')+'</td>'
            +'<td>'+st.bets+'/'+S.R+'</td>'
            +'<td><b class="'+(st.net>0?'pos':(st.net<0?'neg':''))+'">'+signed(st.net)+'</b></td>'
            +'<td>'+STOPTXT[st.stop]+'</td></tr>';
        }).join('')+'</tbody></table>'
        +'<div class="tr-sfoot">同一套设置换成更早的历史会变成 '
        +nets.slice(1).map(function(st){return signed(st.net);}).join(' / ')
        +'。<b>试跑只认最新这一段</b>——不让你挑样本，因为挑得出好看的结论就等于没验证。</div>';
    }
  }
  function paintBar(){
    var n=$('#trNet');if(!n)return;
    var t=outAll(),fn=focusList().length;
    n.className='n '+(t.net>0?'pos':(t.net<0?'neg':''));
    n.textContent=signed(t.net);
    var sub=$('#trNetSub');
    if(sub){
      sub.innerHTML=(fn>1?'<b>'+fn+' 位置</b>合计 · ':'')+'出手 '+t.bets+' 次 · <b>'+stopSummary(t)+'</b>'
        +'<br>需备 <b>'+money(needAll())+'</b>'+(fn>1?'（'+money(needOne())+'×'+fn+'）':'');
    }
  }
  function refresh(){
    paintTop();paintRail();paintRoad();paintChips();paintMid();paintBar();
    save();
  }

  /* ══════════ sheets ══════════ */
  function openSheet(kind){
    var sh=$('#trSheet'),sc=$('#trSheetCard');
    if(!sh||!sc)return;
    sh.classList.add('show');
    if(kind==='terms'){
      var L=curLane(),s=stat();
      sc.innerHTML='<button type="button" class="x" data-tract="sheetclose">✕</button><h4>这一屏的四个词</h4><div class="tr-terms">'
        +'<div><b>路子图</b>　红＝'+PLAYS[L.pk].a+'、蓝＝'+PLAYS[L.pk].b+'，同色叠柱、柱高＝连几期，超 6 珠拐弯继续。<b>金圈＝按当前设置这期会真的下注</b>，✓ 中 ✕ 未中。</div>'
        +'<div><b>'+codeTxt()+'（触发区间）</b>　最低连 '+S.min+' 期才出手，超过 '+S.max+' 连只旁观。这段路子里这样的机会共 <b>'+s.trig+'</b> 次（跟中 '+s.chase+'＋反中 '+s.brk+'＝'+s.trig+'，可对账）。</div>'
        +'<div><b>回合数 R</b>　＝下注次数预算：被触发 '+S.R+' 次就收工，<b>输赢都不提前停</b>；能提前叫停的是止损（'+S.sl+'）／止盈（'+S.tp+'）。最坏连输 '+S.R+' 次单位置需备 <b>'+money(needOne())+'</b>。</div>'
        +'<div><b>命中 x/y</b>　y＝触发次数（有几次机会），x＝这个方向猜中几次。历史结果不代表未来收益。</div></div>';
      return;
    }
    /* 2026-07-30 改：这里<不再>问「模拟钱还是真钱」。
       用哪种钱跑是<启动>的选择，属于策略卡底部那条「模拟策略 / 启用策略」——
       藏在试跑页里等于没人找得到。试跑页只负责一件事：把这套参数变成一张策略。 */
    if(kind==='create'){
      var fl=focusList();
      sc.innerHTML='<button type="button" class="x" data-tract="sheetclose">✕</button><h4>用这套参数创建策略？</h4>'
        +'<div class="tr-lsparams"><div class="t">试跑参数直接带过去，不用重填</div><div class="row">'
        +[(fl.length>1?fl.length+' 个位置':laneName(curLane())),(S.dir==='chase'?'跟投':'反投'),codeTxt(),'R'+S.R,'单注 '+S.base,'倍投 '+S.mult+'×','止盈 '+S.tp,'止损 '+S.sl]
          .map(function(t){return '<span>'+t+'</span>';}).join('')+'</div></div>'
        +'<div class="tr-terms" style="margin-bottom:10px"><div>最坏情况需备 <b>'+money(needAll())+'</b> 额度'
        +(needAll()>BAL?'，<b style="color:var(--red)">超出余额</b>':'，余额够')+'。</div></div>'
        +'<button type="button" class="tr-lsopt real" data-tract="createplan"><b>创建策略</b>'
        +'<em>创建后回到自动投页，在策略卡底部再决定用<b>模拟策略</b>（假额度）还是<b>启用策略</b>（真额度）跑。</em></button>'
        +'<button type="button" class="tr-lscancel" data-tract="sheetclose">再回去调一下</button>';
      return;
    }
    if(kind==='pos'){
      /* 每个位置一张小卡，卡里就是一幅缩小的路子图（同样的叠柱、同样的金圈），
         和主路子图完全同一种画法，只是小一号。点整张卡＝勾选／取消。 */
      sc.innerHTML='<button type="button" class="x" data-tract="sheetclose">✕</button><h4>盯哪几个位置（<span id="trPosCount">'+focusList().length+'</span>/20）</h4>'
        +'<div class="tr-sfoot" style="margin:0 0 8px">每张卡＝那个位置的迷你路子图（最近走势，金圈＝会下注）。点卡片勾选，按触发多少排序。</div>'
        +'<div class="tr-pgrid">'+laneRank(0,true).map(function(r){
          return '<div class="tr-pcard'+(S.focus[r.i]?' foc':'')+'" data-trfk="'+r.i+'">'
            +'<div class="hd"><span class="ck"></span><span class="nm">'+laneName(r.L)+'</span>'
            +'<span class="hn'+(r.s.curH>=S.min&&r.s.curH<=S.max?' hot':'')+'">连'+r.s.curH+'</span>'
            +'<span class="xy">'+r.win+'/'+r.s.trig+'</span></div>'
            +'<div class="tr-mroad" data-trmr="'+r.i+'"></div></div>';
        }).join('')+'</div>'
        +'<div class="tr-sfoot" id="trPosFoot">勾几个位置，本金按几份备：<b>'+money(needOne())+' × '+focusList().length+' ＝ '+money(needAll())+'</b> · 每位置各自触发、各爬各的梯子</div>';
      sc.querySelectorAll('.tr-mroad').forEach(function(el){
        renderMini(el,LANES[parseInt(el.getAttribute('data-trmr'),10)]);
      });
      return;
    }
  }
  function closeSheet(){var sh=$('#trSheet');if(sh)sh.classList.remove('show');}

  /* ══════════ 进工作台：都是「带着一份东西」进来 ══════════
     {plan:cfgObj} → 自动投页策略卡的 🧪（执行动态图标 / 详情底部按钮）
     {tpl:i}       → 模板页的「先试跑」
     {lane:i}      → 看路屏的「拿这个位置去试跑」
     {}            → 空白草稿（带一次性指引）

     ⚠ 样本口径（07-29）：试跑<只跑最新那一段路子>，没有换样本的按钮。 */
  function enterBench(spec){
    spec=spec||{};
    var base;
    if(spec.plan){
      base=spec.plan;
      S.plan={name:spec.plan.name||'策略',src:'从自动投页 · '+(spec.plan.name||'策略')+' 进入'};
      S.coach=false;
    }else if(spec.tpl!=null){
      var t=TEMPLATES[spec.tpl];
      base=t;
      S.plan={name:t.name+'（草稿）',src:'从新建模板 · '+t.name+' 进入'};
      S.coach=false;
    }else{
      S.plan={name:'新策略（草稿）',src:spec.lane!=null?'从看路屏进入':'从试跑入口进入'};
      base={dir:'break',min:4,max:8,R:10,base:10,mult:2,tp:300,sl:300,focus:{0:1,2:1,4:1},cur:0};
      S.coach=(spec.lane==null);
    }
    S.dir=base.dir;S.min=base.min;S.max=base.max;S.R=base.R;S.mult=base.mult;
    S.base=(base.base==null?10:base.base);
    S.tp=(base.tp==null?300:base.tp);S.sl=(base.sl==null?300:base.sl);
    /* 深拷贝：在工作台里改位置不能回头改掉存着的那份策略／模板 */
    S.focus={};Object.keys(base.focus||{0:1}).forEach(function(k){S.focus[k]=1;});
    S.cur=(spec.lane!=null)?spec.lane:(base.cur||0);
    if(spec.lane!=null)S.focus[spec.lane]=1;
    if(!Object.keys(S.focus).length)S.focus[S.cur]=1;
    S.edit=null;S.mtab='detail';S.wi=0;
    go('bench');
  }

  /* 把自动投页真实的那份策略设置翻译成试跑的参数（07-29 §1.3 参数原样带入）。
     两边其实是同一个模型：自动投的「投注项」＝ 名次 × 玩法 ＝ 这里的 20 个通道。
     龙虎在 V3 的 20 通道模型里没有对位，只能跳过 —— 已在副标题写明。 */
  function planToSpec(p){
    if(!p)return null;
    var focus={},skipped=[];
    var plays=p.plays||[];
    var exMap=p.exMap||{};
    var POSFULL=['冠军','亚军','第三名','第四名','第五名','第六名','第七名','第八名','第九名','第十名'];
    plays.forEach(function(play){
      var pk=(play==='大小')?'bs':((play==='单双')?'oe':null);
      if(!pk){if(skipped.indexOf(play)<0)skipped.push(play);return;}
      for(var pi=0;pi<10;pi++){
        var ex=exMap[POSFULL[pi]]||[];
        if(ex.indexOf(play)>=0)continue;          /* 被排除的名次不扫描 */
        focus[laneIdx(pi,pk)]=1;
      }
    });
    if(!Object.keys(focus).length)focus[0]=1;      /* 定位玩法／全排除 → 退回冠军大小做示意 */
    var mult=(p.style==='倍投')?(parseFloat(p.multi)||2):1;
    return {
      name:p.name||'策略',
      dir:(p.dir==='跟投')?'chase':'break',
      min:parseInt(p.minS,10)||4,
      max:parseInt(p.maxS,10)||8,
      R:parseInt(p.rounds,10)||10,
      base:parseFloat(p.amount)||10,
      mult:mult,
      tp:parseFloat(p.tp)||300,
      sl:parseFloat(p.sl)||300,
      focus:focus,
      cur:parseInt(Object.keys(focus)[0],10)||0,
      skipped:skipped
    };
  }
  /* app.js 把当前选中的策略挂到 window.IM168_CURRENT_PLAN（见 shared/app.js 的
     策略中心模块）；拿不到就退回空白草稿，不让入口点了没反应。 */
  function enterBenchFromPlan(){
    var p=(typeof window.IM168_CURRENT_PLAN==='function')?window.IM168_CURRENT_PLAN():null;
    var spec=planToSpec(p);
    if(!spec){enterBench({});return;}
    enterBench({plan:spec});
    if(spec.skipped&&spec.skipped.length){
      var s=$('#trPlanSrc');
      if(s)s.textContent=s.textContent+'（'+spec.skipped.join('/')+' 暂无路子通道，未计入）';
    }
  }

  /* ══════════ 每屏进入时的绘制 ══════════ */
  function paintFor(view){
    if(view==='autos'){paintTopBand();return;}
    if(view==='road'){paintRoadScreen();return;}
    if(view==='tplpick'){paintTplScreen();return;}
    if(view==='bench'){
      closeSheet();
      refresh();
      var co=$('#trCoach');
      if(co)co.classList.toggle('show',!!S.coach);
      return;
    }
  }
  window.IM168_TRIALRUN_PAINT=paintFor;

  /* ══════════ 事件 ══════════ */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var b=t.closest('[data-tract],[data-trpos],[data-trpk],[data-trtpl],[data-trlane],[data-trfk],[data-trmt],[data-trdir],[data-trmult],[data-tredit]');
    if(!b)return;
    var act=b.getAttribute('data-tract');

    /* ── 顶部路子条 / 看路屏 ── */
    if(b.hasAttribute('data-trpk')){
      S.stripPk=b.getAttribute('data-trpk');save();
      if(currentViewName()==='road')paintRoadScreen();else paintTopBand();
      return;
    }
    if(b.hasAttribute('data-trpos')){
      S.r2pos=parseInt(b.getAttribute('data-trpos'),10);save();
      if(currentViewName()==='road')paintRoadScreen();else go('road');
      return;
    }
    if(act==='road'){go('road');return;}
    if(act==='roadtry'){enterBench({lane:laneIdx(S.r2pos,S.stripPk)});return;}

    /* ── 进工作台的几条来路 ── */
    if(act==='bench-blank'){enterBench({});return;}
    if(act==='bench-from-plan'){enterBenchFromPlan();return;}
    /* 路子图右上角那个「试跑策略」：页面上正选着一张策略卡就拿它的参数进去
       （按钮上写的就是「试跑策略」），没有就给一张空白草稿＋一次性指引。 */
    if(act==='bench-auto'){
      var cp=(typeof window.IM168_CURRENT_PLAN==='function')?window.IM168_CURRENT_PLAN():null;
      if(cp)enterBenchFromPlan();else enterBench({});
      return;
    }
    if(b.hasAttribute('data-trtpl')){enterBench({tpl:parseInt(b.getAttribute('data-trtpl'),10)});return;}
    /* 「用这个建策略」＝接回自动投原有的 5 步向导，不另造一套设置流程。
       拆页后跳回自动投是真的换页，所以把「进来后要开向导」记在 sessionStorage，
       由下一页的 boot() 兑现（见文件末 PENDING_SETUP）。 */
    if(act==='usetpl'){
      try{sessionStorage.setItem(PKEY,'custom');}catch(err){}
      goView('autos');
      /* 单页运行时 goView 只是换 class，还在同一个文档里，得自己兑现；
         拆页之后这一句到不了（上面已经开始跳页），由下一页的 boot() 兑现。 */
      runPendingSetup();
      return;
    }
    if(act==='back'){back();return;}

    /* ── 工作台内 ── */
    /* 位置条＝只切换查看。以前顺手把它加进 focus，结果「翻着看」会悄悄把位置加进策略、
       本金和结论跟着变，胶囊还会因为置顶排序在指下跳位。改策略只走「＋加入策略」和位置卡。 */
    if(b.hasAttribute('data-trlane')){S.cur=parseInt(b.getAttribute('data-trlane'),10);refresh();return;}
    if(act==='addcur'){
      if(S.focus[S.cur]){
        if(focusList().length===1)return;   /* 最后一个不能移出 */
        delete S.focus[S.cur];
      }else S.focus[S.cur]=1;
      refresh();return;
    }
    if(b.hasAttribute('data-trfk')){
      var fi=b.getAttribute('data-trfk');
      if(S.focus[fi])delete S.focus[fi];else S.focus[fi]=1;
      if(!focusList().length)S.focus[fi]=1;
      /* 卡片原地打勾，不重开 sheet：重开会重排卡片、滚动位置也会跳回顶部 */
      b.classList.toggle('foc',!!S.focus[fi]);
      var cnt=$('#trPosCount');if(cnt)cnt.textContent=focusList().length;
      var pf=$('#trPosFoot');
      if(pf)pf.innerHTML='勾几个位置，本金按几份备：<b>'+money(needOne())+' × '+focusList().length+' ＝ '+money(needAll())+'</b> · 每位置各自触发、各爬各的梯子';
      refresh();return;
    }
    if(b.hasAttribute('data-trmt')){S.mtab=b.getAttribute('data-trmt');save();paintMid();return;}
    if(b.hasAttribute('data-trdir')){S.dir=b.getAttribute('data-trdir');refresh();return;}
    if(b.hasAttribute('data-trmult')){S.mult=parseFloat(b.getAttribute('data-trmult'));refresh();return;}
    if(b.hasAttribute('data-tredit')){
      var k=b.getAttribute('data-tredit');S.edit=(S.edit===k?null:k);save();paintChips();return;
    }
    if(act==='terms'){openSheet('terms');return;}
    if(act==='create'){openSheet('create');return;}
    if(act==='sheetclose'){closeSheet();return;}
    if(act==='coachok'){
      S.coach=false;save();
      var co=$('#trCoach');if(co)co.classList.remove('show');
      return;
    }
    if(act==='createplan'){
      closeSheet();
      alert('草案示意：用这套参数创建一张策略卡（'+(S.dir==='chase'?'跟投':'反投')+' · '+codeTxt()+' · R'+S.R
        +' · '+focusList().length+' 个位置，需备 '+money(needAll())+' 额度），然后回到自动投页。\n\n'
        +'用哪种钱跑在策略卡底部选：「模拟策略」＝假额度，「启用策略」＝真额度。');
      goView('autos');
      return;
    }
  });

  /* 拖动中不重建编辑器 DOM（会把正在拖的滑块换掉），只原地刷值；其余区域照常重算 */
  document.addEventListener('input',function(e){
    var t=e.target;
    if(!t||t.type!=='range')return;
    if(!t.closest||!t.closest('.tr-editor'))return;
    var v=parseInt(t.value,10);
    if(t.classList.contains('rmin')){S.min=v;if(S.min>S.max)S.max=S.min;}
    else if(t.classList.contains('rmax')){S.max=v;if(S.max<S.min)S.min=S.max;}
    else if(t.classList.contains('rone')){S.R=v;}
    else return;
    paintTop();paintRail();paintRoad();paintMid();paintBar();paintChipRow();
    editorInPlace();
    save();
  });

  /* ══════════ 启动 ══════════
     单页时 hashchange 会切 view；拆页后每个 HTML 只有自己那一个 view。
     两种情况都走同一个入口：看现在亮着哪个 view，就画哪一屏。 */
  /* 模板页点了「用这个建策略」→ 回到自动投页后把原有的 5 步向导打开。

     两个坑，都踩过：
     ① app.js 自己的启动流程（showView('autos') → openDashHome() → 首次引导 Drawer）
        在我们之后还会继续跑，setTimeout(0) 里开的向导会被它当场盖掉。所以这里
        <验证＋重试>：确认 #stgSheet 真的挂上 .open 了才算成功，最多试 1 秒。
     ② 玩家是带着明确意图过来的（我要建这个策略），首次引导不该在这时候插一脚，
        所以先把引导 Drawer 关掉再开向导。 */
  function runPendingSetup(){
    var k;
    try{k=sessionStorage.getItem(PKEY);}catch(e){}
    if(!k)return;
    /* ③ 向导的骨架 #stgSheet 只在自动投页那一档里 —— app.js 每页都在，所以光看
       IM168_STG_SETUP 存不存在会误判。骨架不在就<不要消费这个标记>，留给真正
       落到自动投页的那一次；否则模板页会先把它吃掉，跳过去就什么都不弹了。 */
    if(!$('#stgSheet')||!window.IM168_STG_SETUP)return;
    try{sessionStorage.removeItem(PKEY);}catch(e){}

    var tries=0;
    (function attempt(){
      tries++;
      var ob=$('#obDrawer');
      if(ob)ob.classList.remove('open');
      window.IM168_STG_SETUP(k);
      var sheet=$('#stgSheet');
      if(sheet&&sheet.classList.contains('open'))return;      /* 开成功了 */
      if(tries<10){setTimeout(attempt,100);return;}
      console.warn('[试跑] 「用这个建策略」没能打开 5 步向导，已放弃重试');
    })();
  }

  function boot(){
    paintFor(currentViewName());
    /* 自动投页的顶部两条要一直在（app.js 只重画 #stgScroll，不会动 #trTopBand） */
    if($('#trTopBand'))paintTopBand();
    if(currentViewName()==='autos')setTimeout(runPendingSetup,0);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
  window.addEventListener('hashchange',function(){paintFor(currentViewName());});

  /* 载入自校验：由序列反推的开奖，其「冠军·大小」通道必须与手工样本逐位一致。
     不一致就说明数据层坏了，屏上所有 x/y 都不能信 —— 直接吼出来。 */
  (function(){
    for(var i=0;i<WINDOWS.length;i++){
      if(laneSeq(i,{pi:0,pk:'bs'}).join('')!==WINDOWS[i].seq.join(''))
        console.error('[试跑数据层] 第'+i+'段冠军大小序列失真，屏上的命中数字不可信');
    }
  })();
})();
