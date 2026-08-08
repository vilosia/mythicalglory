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

    var subtitle=trigger.querySelector('small');
    if(subtitle)subtitle.remove();
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

/* Prototype access gate. Authentication is scoped to the current browser tab
   so page-to-page navigation stays uninterrupted, while a new session asks
   for the client credentials again. */
(function(){
  'use strict';
  var KEY='im168_client_auth_v1';
  try{if(sessionStorage.getItem(KEY)==='verified')return;}catch(ignore){}

  var style=document.createElement('style');
  style.textContent='\
    html.proto-auth-locked,html.proto-auth-locked body{overflow:hidden!important;}\
    .proto-auth{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;box-sizing:border-box;background:radial-gradient(circle at 50% 18%,#fff 0,#f4faff 31%,#e8f3fc 72%,#e2eef8 100%);font-family:"Noto Sans SC",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#202b3d;}\
    .proto-auth-card{width:min(354px,calc(100vw - 32px));box-sizing:border-box;padding:28px 24px 24px;border:1px solid rgba(69,142,202,.2);border-radius:24px;background:rgba(255,255,255,.96);box-shadow:0 22px 60px rgba(37,83,122,.16);}\
    .proto-auth-brand{display:flex;align-items:center;gap:11px;margin-bottom:25px;}\
    .proto-auth-mark{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(145deg,#148ce3,#39b7f4);box-shadow:0 8px 18px rgba(20,140,227,.25);color:#fff;}\
    .proto-auth-mark svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}\
    .proto-auth-brand span{display:block;min-width:0;}\
    .proto-auth-brand b{display:block;font-size:18px;line-height:1.2;font-weight:800;color:#202b3d;}\
    .proto-auth-brand small{display:block;margin-top:3px;font-size:11px;line-height:1.3;font-weight:600;color:#7c8ba2;}\
    .proto-auth h1{margin:0;font-size:25px;line-height:1.25;font-weight:800;letter-spacing:-.02em;}\
    .proto-auth-intro{margin:7px 0 22px;font-size:13px;line-height:1.55;color:#718198;}\
    .proto-auth-field{display:block;margin-top:14px;}\
    .proto-auth-field>span{display:block;margin:0 0 7px 2px;font-size:12px;font-weight:750;color:#344158;}\
    .proto-auth-input{position:relative;}\
    .proto-auth-input input{width:100%;height:48px;box-sizing:border-box;padding:0 14px;border:1px solid #d4e0eb;border-radius:12px;outline:0;background:#f8fafc;color:#202b3d;font:650 16px/1 inherit;transition:border-color .15s,box-shadow .15s,background .15s;}\
    .proto-auth-input input::placeholder{color:#a5b1c1;font-weight:500;}\
    .proto-auth-input input:focus{border-color:#229be8;background:#fff;box-shadow:0 0 0 3px rgba(34,155,232,.12);}\
    .proto-auth-input input[aria-invalid="true"]{border-color:#ef4852;box-shadow:0 0 0 3px rgba(239,72,82,.1);}\
    .proto-auth-eye{position:absolute;right:5px;top:5px;width:38px;height:38px;display:grid;place-items:center;border:0;border-radius:9px;background:transparent;color:#718198;cursor:pointer;}\
    .proto-auth-eye svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}\
    .proto-auth-pass input{padding-right:47px;}\
    .proto-auth-error{min-height:19px;margin:8px 2px 0;font-size:11px;line-height:1.45;font-weight:650;color:#e33f49;}\
    .proto-auth-submit{width:100%;height:48px;margin-top:10px;border:0;border-radius:12px;background:linear-gradient(100deg,#128de5,#34b0f4);box-shadow:0 8px 20px rgba(20,145,229,.22);color:#fff;font:800 15px/1 inherit;cursor:pointer;}\
    .proto-auth-submit:active{transform:translateY(1px);}\
    .proto-auth-note{display:flex;align-items:center;justify-content:center;gap:5px;margin:16px 0 0;font-size:10px;line-height:1.4;color:#8b98aa;}\
    .proto-auth-note svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.8;}\
    @media(max-width:430px){.proto-auth{padding:16px}.proto-auth-card{padding:26px 22px 22px;border-radius:22px}}\
  ';
  document.head.appendChild(style);
  document.documentElement.classList.add('proto-auth-locked');

  function mount(){
    if(document.querySelector('.proto-auth'))return;
    var gate=document.createElement('div');
    gate.className='proto-auth';
    gate.innerHTML='<main class="proto-auth-card" role="dialog" aria-modal="true" aria-labelledby="protoAuthTitle">'+
      '<div class="proto-auth-brand"><i class="proto-auth-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3"/><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M12 14v3"/></svg></i><span><b>幸运组</b><small>安全访问验证</small></span></div>'+
      '<h1 id="protoAuthTitle">欢迎回来</h1><p class="proto-auth-intro">请输入账号信息以继续访问。</p>'+
      '<form novalidate><label class="proto-auth-field"><span>用户名</span><div class="proto-auth-input"><input name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="请输入用户名" aria-label="用户名"></div></label>'+
      '<label class="proto-auth-field"><span>密码</span><div class="proto-auth-input proto-auth-pass"><input name="password" type="password" autocomplete="current-password" placeholder="请输入密码" aria-label="密码"><button class="proto-auth-eye" type="button" aria-label="显示密码"><svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="3"/></svg></button></div></label>'+
      '<p class="proto-auth-error" role="alert" aria-live="polite"></p><button class="proto-auth-submit" type="submit">登录</button></form>'+
      '<p class="proto-auth-note"><svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3"/><rect x="4" y="10" width="16" height="11" rx="3"/></svg>验证后本次浏览会话内保持登录</p></main>';
    document.body.appendChild(gate);

    var form=gate.querySelector('form'),user=form.elements.username,pass=form.elements.password;
    var error=gate.querySelector('.proto-auth-error'),eye=gate.querySelector('.proto-auth-eye');
    function clearError(){
      error.textContent='';user.removeAttribute('aria-invalid');pass.removeAttribute('aria-invalid');
    }
    user.addEventListener('input',clearError);pass.addEventListener('input',clearError);
    eye.addEventListener('click',function(){
      var show=pass.type==='password';pass.type=show?'text':'password';
      eye.setAttribute('aria-label',show?'隐藏密码':'显示密码');
      eye.querySelector('svg').innerHTML=show?'<path d="M3 3l18 18"/><path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15.2 15.2 0 0 1-2.1 2.8M6.1 6.1C3.7 7.8 2.5 12 2.5 12s3.5 6 9.5 6c1 0 2-.2 2.8-.5M9.9 9.9a3 3 0 0 0 4.2 4.2"/>':'<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="3"/>';
      pass.focus();
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();clearError();
      if(user.value.trim()==='client'&&pass.value==='msgw'){
        try{sessionStorage.setItem(KEY,'verified');}catch(ignore){}
        document.documentElement.classList.remove('proto-auth-locked');gate.remove();return;
      }
      error.textContent='用户名或密码不正确，请重新输入。';
      user.setAttribute('aria-invalid','true');pass.setAttribute('aria-invalid','true');pass.value='';pass.focus();
    });
    requestAnimationFrame(function(){user.focus();});
  }
  if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount,{once:true});
})();
