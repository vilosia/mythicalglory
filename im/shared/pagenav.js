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
    'news':'news.html',
    'home':'home.html',
    'groups':'groups.html',      /* 群组页（大厅返回键用） */
    'search':'groups.html',
    'me':'me.html',
    'bet':'game-bet.html',
    'channel':'game-bet.html',
    'bets':'game-bet.html',
    'lobby':'game-bet.html',
    'autos':'hall-plans.html',      /* 自动投 → 策略投注（游戏厅一层，2026-08-06 结构改版） */
    'formula':'hall-plans.html',
    'templates':'hall-plans.html',
    'chat':'game-chat.html',
    'chatsearch':'game-chat.html',
    'chatdetail':'game-chat.html',
    'bust':'game-bust.html',
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
       从群组点进游戏厅，落到<游戏>页（现在的 index.html）。
       旧大厅（策略优先的那一屏）没删，搬回 hall.html，仍可单独打开对照。 */
    'hall':'index.html'
  };

  function here(v){return !!document.querySelector('.view-'+v);}

  var NAV={
    map:MAP,
    /* app.js 的 showView() 的第一句。返回 true＝已经开始跳页，调用方立刻 return。 */
    route:function(v){
      if(!v)return false;
      /* ── 临时 · 演示范围收窄（2026-08-06）──────────────────────
         客户先验收 聊天 → 游戏厅（大厅 / 投注 / 策略投注）这一条动线。
         下面这些 view 的入口暂时全部原地吞掉（不跳页、不报错）。
         恢复：把这个 HIDDEN 块整段删掉即可，MAP 一个字没动。 */
      var HIDDEN={news:1,home:1,me:1,wallet:1,withdraw:1,request:1,reqhistory:1,
                  owner:1,approvals:1,members:1,member:1,memberedit:1,rake:1};
      if(HIDDEN[v]&&!here(v)){console.info('[pagenav] 「'+v+'」暂不在本轮演示范围（Lobby/投注/策略投注 验收后恢复）');return true;}
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
