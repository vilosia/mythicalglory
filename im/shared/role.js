/* ══ 视角（群主 / 成员）· 2026-08-13 ═══════════════════════════════════════════
   Hector：「To find a place to move 管理面板 into 游戏厅 —— park it in the wallet
   or as a setting icon beside wallet for 群主 view. Add a toggle to preview between
   群主 and Member view.」

   做法：
     · <b>管理中心的入口</b>＝顶栏钱包<b>左边</b>的一枚齿轮（→ admin.html）。
       只在<b>群主视角</b>出现；成员视角整颗不渲染（不是变灰）——
       成员根本没有这个后台，灰着反而像「你也有，只是没权限」。
     · <b>视角开关</b>住在 我的 → 设置（演示视角 · 群主／成员），
       写进 localStorage，全站共用；切换后广播 im168role，各页自己重画。

   ⚠ 这一支是<b>演示件</b>：真产品里「是不是群主」由后端给，不该由前端存一个开关。
     上线前把 role.js 的引用删掉，并把齿轮改成按后端返回的角色渲染。
   ⚠ 08-13S（Hector）：齿轮改插在 .bal <b>之后</b>（钱包右边）——
     顶栏最右那一格在这一版留给管理。一版放左边是想「别把钱包挤走」，
     但那样齿轮夹在标题与钱包之间，反而像是钱包的一部分。 */
(function(){
  'use strict';
  var KEY='im168_role_v1', OWNER='owner', MEMBER='member';

  function get(){
    try{return localStorage.getItem(KEY)===MEMBER?MEMBER:OWNER;}catch(e){return OWNER;}
  }
  function isOwner(){return get()===OWNER;}
  function set(role){
    try{localStorage.setItem(KEY,role===MEMBER?MEMBER:OWNER);}catch(e){}
    window.dispatchEvent(new CustomEvent('im168role',{detail:{role:get()}}));
    apply();
  }

  var GEAR='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" '+
    'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+
    '<circle cx="12" cy="12" r="3.2"/>'+
    '<path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>';

  function apply(){
    var bars=document.querySelectorAll('.gtop');
    [].forEach.call(bars,function(bar){
      var bal=bar.querySelector('.bal'),old=bar.querySelector('.gadmin');
      if(!bal)return;
      /* ⚠ 有的页面（钱包）里 .gtop 是一条<b>没有在显示</b>的备用顶栏 —— 钱包页顶栏
         本来就不放钱包药丸。往那种条里插齿轮，只会得到一枚量出来 0×0 的按钮（实测）。
         用 getClientRects().length 判断这一条到底有没有被排版，没有就跳过。 */
      if(!bal.getClientRects().length){if(old)old.remove();return;}
      /* ⚠ 08-13T（Hector：Setting dont need to go into inner pages. only on outer pages）——
         有的页面（策略）L1 与 L2 <b>共用同一条顶栏</b>，只是把标题换掉。
         进到 L2 之后那一条已经挤着 ‹ 返回 · 代号 · 分享 · 钱包，再插一枚齿轮，
         代号会被省略号切掉（实测「C040…」）。而且管理是<b>外层</b>的事，
         内层是「这一套策略」的上下文，本来就不该出现。
         页面自己在进内层时打上 body[data-inner="1"]，这里认这一个标记。 */
      if(document.body&&document.body.getAttribute('data-inner')==='1'){if(old)old.remove();return;}
      if(!isOwner()){if(old)old.remove();return;}
      if(old)return;
      var a=document.createElement('a');
      a.className='gadmin';a.href='admin.html';
      a.setAttribute('aria-label','管理中心');a.title='管理中心';
      a.setAttribute('data-component','AdminEntry');
      a.innerHTML=GEAR;
      bal.parentNode.insertBefore(a,bal.nextSibling);   /* 钱包右边 */
    });
  }

  window.IM168Role={get:get,set:set,isOwner:isOwner,OWNER:OWNER,MEMBER:MEMBER,apply:apply};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);
  else apply();
})();
