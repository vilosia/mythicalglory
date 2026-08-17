/* ══════════════════════════════════════════════════════════════════════════
   IM168 · 分页路由（每页一个 HTML）
   ─────────────────────────────────────────────────────────────────────────
   原型原本是单页：所有 view 一起进 DOM，切页只是换 .on 这个 class。
   拆成一页一档之后，每个 HTML 只带自己那几个 view，于是：

     shared/app.js 的 showView(v) 一开头会问这里一句 route(v)：
       · v 在本页 DOM 里  → route() 返回 false，照原来的方式换 class（不跳页）
       · v 不在本页       → route() 把浏览器真的带去那一页，返回 true

   所以 views/*.js 里所有 data-act="show" data-arg="x" 一个都不用改；
   app.js 内部自己调 showView('wallet') 之类的地方也一样照用。

   这一档必须在 app.js <之前> 加载 —— showView 第一次被调用时它就得在。
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  /* view 名 → 所在页面。改页面划分请同时改 Source/build-pages.js 的 PAGES
     （构建脚本会核对这两处，不一致就报错并且不生成任何文件）。 */
  var MAP={
    /* 'news'/'home'/'me' 已撤（2026-08-16）：IM 外壳填充页与游戏厅流程无关，
       六页清理（home/me/news/game-bust/hall/pages）见 Daily Log；回滚走 Drive 版本历史。 */
    'groups':'groups.html',      /* 群组页（大厅返回键用） */
    'search':'groups.html',
    'bet':'game-bet.html',
    /* 'channel' 已撤（08-15）：频道屏删除，见 game-bet.html 里的墓碑 */
    'bets':'game-bet.html',
    'lobby':'game-bet.html',
    'autos':'hall-plans.html',      /* 自动投 → 策略投注（游戏厅一层，2026-08-06 结构改版） */
    'formula':'hall-plans.html',
    'templates':'hall-plans.html',
    'chat':'game-chat.html',
    'chatsearch':'game-chat.html',
    'chatdetail':'game-chat.html',
    /* 'bust' 已撤（2026-08-16）：查爆仓页早已无入口（孤儿），随六页清理一并删除。 */
    'wallet':'wallet.html',
    'withdraw':'wallet.html',
    'request':'wallet.html',
    'reqhistory':'wallet.html',
    'owner':'admin.html',
    'approvals':'admin.html',
    'members':'admin.html',
    'member':'admin.html',
    'memberedit':'admin.html',
    'rake':'admin.html',
    'road':'hall-plans.html',
    'tplpick':'hall-plans.html',
    'bench':'hall-plans.html',
    /* 2026-08-08（Alex：大厅拿掉，游戏当玩家第一眼见到的那一页）——
       从群组点进游戏厅，落到<游戏>页。
       旧大厅曾留档在 hall.html 对照（2026-08-16 六页清理时已删，回滚走 Drive 版本历史）。
       2026-08-11（Alex：策略当落地页）—— 'hall' 是「从聊天进游戏厅」那一下，
       现在<b>落到策略</b>：「去 Iris chat 那边就不用大厅了，直接拿掉那个大厅，
       直接放这一个（策略）做那个入口」。
       彩票另给一条 'lottery' —— 游戏屏（投注/聊天室/查爆仓）的返回键用它，
       因为那几屏是<从彩票点进去的>，回头路要回彩票，不是回策略。 */
    'hall':'hall-plans.html',
    'lottery':'hall-lottery.html',
    /* 2026-08-11 新增：动态（广播频道）。刻意<不>叫 'feed' ——
       hall-plans.html 里 .view-feed 已经是「执行动态」那一屏，撞名会被 here() 认错页。 */
    'activity':'hall-activity.html'
  };

  function here(v){return !!document.querySelector('.view-'+v);}

  var NAV={
    map:MAP,
    /* app.js 的 showView() 的第一句。返回 true＝已经开始跳页，调用方立刻 return。 */
    route:function(v){
      if(!v)return false;
      /* 2026-08-11：08-06 那个 HIDDEN 块（临时收窄演示范围，把 资讯/好友/我的/钱包/
         管理中心 的跳转原地吞掉）<整段删掉了>—— Alex 08-11：「上下分在哪里？群组的呢？
         这个还没有拎回去…我们现在整个策略全部放掉了，所以我们下 100% 把这些全部加回来」。
         MAP 从头到尾没被动过，所以删掉就是直接恢复，不需要补任何一条路由。 */
      if(here(v))return false;              /* 就在本页，交回 app.js 原来的逻辑 */
      var page=MAP[v];
      if(!page){
        console.warn('[pagenav] 不认识的 view：'+v+'（本页没有，也不在页面表里）');
        return false;                        /* 宁可什么都不做，也不要把人带去错的页 */
      }
      location.href=page+'#'+v;
      return true;
    },
    /* 本页的落地 view，启动补 hash 用它。
       取 <body data-im168-default>（由 Source/build-pages.js 按 PAGES 里第一个 view 写入）——
       不能用「DOM 里第一个 .view」，因为注入顺序按 views/*.js 的 o 排，
       例如投注页里 channel（o:4）在 bet（o:5）前面，那样会落在频道而不是投注。 */
    defaultView:function(){
      var d=document.body&&document.body.getAttribute('data-im168-default');
      if(d&&document.querySelector('.view-'+d))return d;
      var el=document.querySelector('.view');
      if(!el)return '';
      var m=(el.className||'').match(/view-([a-z0-9]+)/);
      return m?m[1]:'';
    }
  };
  window.IM168_PAGENAV=NAV;

  /* app.js 启动时读 location.hash 决定开哪个 view，读不到就退回 'news'。
     拆页之后 'news' 在别的档里，会导致本页什么都不显示 —— 所以进页面先把 hash
     补成本页真有的那个 view。带着别页的 hash 进来（例如从收藏夹）也一并纠正。 */
  var def=NAV.defaultView();
  var want=(location.hash||'').replace('#','');
  if(def&&(!want||!here(want))){
    try{history.replaceState(null,'','#'+def);}catch(e){location.hash=def;}
  }
})();
