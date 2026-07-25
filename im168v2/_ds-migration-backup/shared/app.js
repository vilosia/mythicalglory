/* IM168 · 主逻辑（原 index.html 底部 inline script 迁出，2026-07-09）
   页面切换 showView / 事件委托 data-act / 自动投状态 dashPlans / 跨页联动（如自动投分享→聊天室）都在这里。 */
(function(){
  /* 将 views/*.js 注册的页面片段按原顺序注入 .body（保持与拆分前完全一致的 DOM 顺序） */
  var vb=document.querySelector('.body');
  if(vb&&window.IM168_VIEWS){window.IM168_VIEWS.sort(function(a,b){return a.o-b.o;});vb.innerHTML=window.IM168_VIEWS.map(function(v){return v.h;}).join('\n');}
})();
(function(){
  var root=document;
  var gameMeta={
    pk:{current:'00089期',last:'00088期',status:'投注中',seal:'0分48秒',balls:[
      ['3','c1'],['7','c2'],['1','c3'],['9','c4'],['5','c5'],['2','c6'],['10','c7'],['4','c8'],['6','c9'],['8','c10']
    ],history:[
      {period:'00087期',balls:[['6','c6'],['2','c2'],['8','c8'],['1','c1'],['4','c4'],['5','c5'],['10','c10'],['3','c3'],['9','c9'],['7','c7']]},
      {period:'00086期',balls:[['9','c9'],['3','c3'],['5','c5'],['10','c10'],['1','c1'],['4','c4'],['7','c7'],['2','c2'],['8','c8'],['6','c6']]},
      {period:'00085期',balls:[['1','c1'],['4','c4'],['6','c6'],['8','c8'],['2','c2'],['9','c9'],['5','c5'],['10','c10'],['3','c3'],['7','c7']]},
      {period:'00084期',balls:[['10','c10'],['8','c8'],['2','c2'],['5','c5'],['7','c7'],['1','c1'],['3','c3'],['9','c9'],['4','c4'],['6','c6']]}
    ],streaks:[
      {label:'冠军 大',compact:'冠军大(4期)',group:'冠军',pick:'大'},
      {label:'冠亚和 单',compact:'冠亚和单(3期)',group:'冠亚和',pick:'单'},
      {label:'第5名 小',compact:'第5名小(3期)',group:'第五名',pick:'小'}
    ]},
    ssc:{current:'00089期',last:'00088期',status:'投注中',seal:'3分18秒',balls:[
      ['6','c1'],['2','c2'],['8','c3'],['1','c4'],['4','c5']
    ],history:[
      {period:'00087期',balls:[['3','c1'],['9','c2'],['0','c3'],['7','c4'],['5','c5']]},
      {period:'00086期',balls:[['8','c1'],['1','c2'],['6','c3'],['2','c4'],['9','c5']]},
      {period:'00085期',balls:[['4','c1'],['0','c2'],['7','c3'],['5','c4'],['3','c5']]},
      {period:'00084期',balls:[['9','c1'],['5','c2'],['2','c3'],['8','c4'],['1','c5']]}
    ],streaks:[
      {label:'万位 大',compact:'万位大3',group:'万位',pick:'大'},
      {label:'个位 5',compact:'个位5连3',group:'个位',pick:'5'},
      {label:'万位 单',compact:'万位单3',group:'万位',pick:'单'}
    ]},
    soon:{current:'--',last:'--',status:'待开放',seal:'--',balls:[],history:[],streaks:[]}
  };
  function ballHtml(balls){return balls.map(function(b){return '<i class="bb '+b[1]+'">'+b[0]+'</i>';}).join('');}
  function pad2(n){n=String(n);return n.length<2?'0'+n:n;}
  function ballImgHtml(balls){return balls.map(function(b){
    var num=parseInt(b[0],10);
    if(num>=1&&num<=10){return '<img class="bimg" src="shared/ball/Property 1='+pad2(num)+'.png" alt="'+b[0]+'">';}
    return '<i class="bb '+b[1]+'">'+b[0]+'</i>';
  }).join('');}
  function streakAttrs(s){return ' data-act="streakpick" data-group="'+s.group+'" data-pick="'+s.pick+'" data-label="'+s.label+'"';}
  function renderHistory(rows,streaks){
    var panel=root.querySelector('.resultpanel'); if(!panel) return;
    root.querySelectorAll('.bottom-streak').forEach(function(strip){
      strip.innerHTML=(streaks&&streaks.length)?'<b>长龙</b>'+streaks.map(function(s){return '<span'+streakAttrs(s)+'>'+s.compact+'</span>';}).join(''):'';
    });
    var history=(rows||[]).map(function(row){
      return '<div class="histrow"><span>'+row.period+'</span><span class="histballs">'+ballHtml(row.balls)+'</span></div>';
    }).join('');
    panel.innerHTML=history;
    syncStreakTags();
  }
  /* 长龙栏「已加入注单」角标：与当前投注页选中项同步 */
  function syncStreakTags(){
    var ph=root.querySelector('.phone'),game=ph?ph.getAttribute('data-game'):'pk';
    var list=root.querySelector('.view-bet .list.game-'+game)||root.querySelector('.view-bet .list.game-pk');
    root.querySelectorAll('.bottom-streak span[data-group]').forEach(function(chip){
      var group=chip.getAttribute('data-group'),pick=chip.getAttribute('data-pick'),has=false;
      if(list){
        var groups=[].slice.call(list.querySelectorAll('.grp'));
        var grp=groups.find(function(g){var h=g.querySelector('.gh b');return h&&h.textContent.indexOf(group)>=0;});
        if(grp){
          var choices=[].slice.call(grp.querySelectorAll('.opt,.nb'));
          has=choices.some(function(c){
            var nm=c.querySelector('.nm'),txt=nm?nm.textContent.trim():c.textContent.trim();
            return txt===pick && c.classList.contains('sel');
          });
        }
      }
      chip.classList.toggle('bet-tag',has);
    });
  }
  function showView(v){
    root.querySelectorAll('.view').forEach(function(x){x.classList.remove('on');});
    var el=root.querySelector('.view-'+v); if(el){el.classList.add('on');}
    var chrome=root.querySelector('.chrome');
    if(chrome){
      var mains=(chrome.getAttribute('data-mainviews')||'').split(' ');
      var on=mains.indexOf(v)>=0;
      chrome.style.display=on?'block':'none';
      document.body.classList.toggle('gamehall',on);
      document.body.classList.toggle('betview',v==='bet');
      document.body.classList.toggle('autosview',v==='autos');
      document.body.classList.toggle('chatview',v==='chat');
      if(on){chrome.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-v')===v);});}
    }
    var dwx=root.querySelector('#drawer'); if(dwx){dwx.classList.remove('open');}
    var tb=root.querySelector('.tabbar');
    if(tb){
      var navs=(tb.getAttribute('data-navviews')||'').split(' ');
      var onN=navs.indexOf(v)>=0;
      tb.style.display=onN?'flex':'none';
      if(onN){tb.querySelectorAll('.nav').forEach(function(n){n.classList.toggle('on',n.getAttribute('data-arg')===v);});}
    }
    var rb=root.querySelector('.roundbar');
    if(rb){rb.style.display=(v==='bet')?'':'none';}
    if(v==='bet'){hideQuickSlip();updateTotal();}
    if(v==='autos'){
      openDashHome();
      /* 首次进入自动投：自动弹出 3 页引导（本会话仅一次） */
      if(!obSeen){obSeen=true;var obd0=root.querySelector('#obDrawer'); if(obd0){obGoto(1);obd0.classList.add('open');}}
    }
    if(v==='formula'){updatePlanPreview();}
    if(v==='member'){var mchip=root.querySelector('#mhPop .on');var mvv=mchip?mchip.getAttribute('data-v'):'m';mhApply(mvv==='all'?'all':(mvv==='m'?6:(parseInt(mvv,10)||0)));}
    if(v==='wallet'){applyWF('pl-wallet-flow');}
    if(v==='owner'){applyWF('pl-owner-tx');}
    if(v!=='autos'&&v!=='chat'){hideQuickSlip();}
    /* 把当前页面记进网址（#bet / #autos …）：刷新后停在原页，链接可收藏/分享 */
    if(location.hash!=='#'+v){try{history.replaceState(null,'','#'+v);}catch(e){location.hash=v;}}
  }
  /* 手动改网址 hash 时同步切换页面 */
  window.addEventListener('hashchange',function(){
    var hv=(location.hash||'').replace('#','');
    if(hv&&root.querySelector('.view-'+hv)&&!root.querySelector('.view-'+hv).classList.contains('on')){showView(hv);}
  });
  function openBustModal(){
    var m=root.querySelector('#bustModal'); if(!m) return;
    syncBustFromPlan();
    m.classList.add('open');
  }
  function closeBustModal(){var m=root.querySelector('#bustModal'); if(m){m.classList.remove('open');}}
  function updateRoundbar(g){
    var meta=gameMeta[g]||gameMeta.pk;
    var current=root.querySelector('.rper b'),last=root.querySelector('.rlastlab b'),status=root.querySelector('.roundstatus'),seal=root.querySelector('.rseal'),balls=root.querySelector('.rballs2');
    if(current){current.textContent=meta.current;}
    if(last){last.textContent=meta.last;}
    if(status){status.textContent=meta.status;}
    if(seal){seal.textContent=meta.seal;}
    if(balls){
      balls.innerHTML=ballImgHtml(meta.balls);
    }
    renderHistory(meta.history,meta.streaks);
  }
  function setGame(g,el){
    var ph=root.querySelector('.phone'); if(ph){ph.setAttribute('data-game',g);}
    root.querySelectorAll('.gchip2').forEach(function(c){c.classList.remove('on');});
    if(el){el.classList.add('on');}
    updateRoundbar(g);
  }
  function setSkin(s,el){
    var bet=root.querySelector('.view-bet'); if(bet){bet.classList.toggle('skin-a',s==='a');bet.classList.toggle('skin-b',s==='b');}
    root.querySelectorAll('.sk span,.viewmode span').forEach(function(x){x.classList.remove('on');});
    if(el){el.classList.add('on');}
    updateTotal();
  }
  function setMarket(m,el){
    var bet=root.querySelector('.view-bet'); if(bet){bet.setAttribute('data-market',m);}
    var bar=el?el.parentNode:root.querySelector('.pbpk');
    if(bar){bar.querySelectorAll('.pb').forEach(function(x){x.classList.toggle('on',x===el);});}
    updateTotal();
  }
  function parseAmt(v){return Math.max(0,parseInt(String(v||'').replace(/\.\d*$/,'').replace(/[^\d]/g,''),10)||0);}
  function fmtAmt(n){return n>0?n.toLocaleString()+'.00':'';}
  function cleanNumber(t){return Math.max(0,parseInt(String(t||'').replace(/[^\d]/g,''),10)||0);}
  function amtVal(){var i=root.querySelector('.view-bet .amtin');return i?cleanNumber(i.value):0;}
  function updateFabPos(){
    var fab=root.querySelector('.mybets-fab'); if(!fab) return;
    var slip=root.querySelector('.view-bet .slip');
    var streak=root.querySelector('.view-bet .bottom-streak');
    var slipH=slip&&slip.classList.contains('show')?slip.offsetHeight:0;
    var streakH=streak?streak.offsetHeight:0;
    fab.style.bottom=(slipH+streakH+8)+'px';
  }
  function updateChipBudget(){
    var bal=getBalance();
    var sel=[].slice.call(root.querySelectorAll('.view-bet .list .opt.sel, .view-bet .list .nb.sel')).filter(function(e){return e.offsetParent!==null;});
    var n=sel.length, cap=n>0?Math.floor(bal/n):bal;
    root.querySelectorAll('.view-bet .qa .amtchip').forEach(function(c){
      var v=c.classList.contains('mm')?(c.getAttribute('data-mm')==='min'?chipVals[0]:chipVals[chipVals.length-1]):cleanNumber(c.textContent);
      c.classList.toggle('overbal', v>cap);
    });
  }
  function updateTotal(){
    var slip=root.querySelector('.slip'); if(!slip) return;
    var sel=[].slice.call(root.querySelectorAll('.view-bet .list .opt.sel, .view-bet .list .nb.sel')).filter(function(e){return e.offsetParent!==null;});
    var n=sel.length,a=amtVal();
    var countEl=slip.querySelector('.fin-count'); if(countEl){countEl.textContent=n;}
    slip.classList.toggle('show',n>0);
    var totalEl=slip.querySelector('.fin-total'); if(totalEl){totalEl.textContent=''+(n*a);}
    // 余额不足：错误占用「可赢」行（正常显示可赢，超额时红色区块盖住），联动顶部余额高亮 + 快捷档置灰
    var bal=getBalance(), total=n*a, over=(a>=BET_MIN&&a<=BET_MAX&&n>0&&total>bal);
    var f2=slip.querySelector('.foot .fin .f2');
    if(f2){
      if(over){f2.classList.add('overbal');f2.innerHTML='<span class="redband"><span class="d">!</span>超出余额（'+bal+'），还差 '+(total-bal)+'</span>';}
      else{f2.classList.remove('overbal');f2.innerHTML='可赢 <span class="fin-win">'+Math.round(a*1.995)+'</span>';}
    }
    var balEl=root.querySelector('.bal'); if(balEl){balEl.classList.toggle('low',over);}
    if(totalEl){totalEl.classList.toggle('over',over);}
    updateChipBudget();
    updateFabPos();
    syncStreakTags();
  }
  function openConfirm(){
    var modal=root.querySelector('.confirm-modal'); if(!modal) return;
    var sel=[].slice.call(root.querySelectorAll('.view-bet .list .opt.sel, .view-bet .list .nb.sel')).filter(function(e){return e.offsetParent!==null;});
    if(!sel.length) return;
    var a=amtVal();
    var rows=sel.map(function(c){
      var grp=c.closest('.grp'),gh=grp?grp.querySelector('.gh b'):null,gname=gh?gh.textContent.trim():'';
      var nm=c.querySelector('.nm'),pick=nm?nm.textContent.trim():c.textContent.trim();
      var od=c.querySelector('.od'),odds=od?od.textContent.trim():'1.99';
      return '<div class="cfrow"><span class="cf-nm">'+gname+' '+pick+'</span><span class="cf-od">@'+odds+'</span><span class="cf-amt">'+a+'</span></div>';
    }).join('');
    modal.querySelector('.cf-list').innerHTML=rows;
    modal.querySelector('.cf-count').textContent=sel.length;
    modal.querySelector('.cf-total').textContent=''+(sel.length*a);
    // 余额不足：注单内差额明细 + CTA 改为「修改金额 / 去充值」
    var bal=getBalance(), total=sel.length*a, over=total>bal;
    var ct=modal.querySelector('.cf-total'); if(ct){ct.classList.toggle('over',over);}
    var brk=modal.querySelector('.cf-brk'), ghost=modal.querySelector('.cf-btns .ghost'), sub=modal.querySelector('.cf-submit'), rech=modal.querySelector('.cf-recharge');
    if(over){
      if(brk){var b1=brk.querySelector('.cfb-bal'),b2=brk.querySelector('.cfb-total'),b3=brk.querySelector('.cfb-short'); if(b1){b1.textContent=''+bal;} if(b2){b2.textContent=''+total;} if(b3){b3.textContent=''+(total-bal);} brk.classList.add('show');}
      if(ghost){ghost.textContent='修改金额';} if(sub){sub.style.display='none';} if(rech){rech.style.display='';}
    } else {
      if(brk){brk.classList.remove('show');}
      if(ghost){ghost.textContent='再想想';} if(sub){sub.style.display='';} if(rech){rech.style.display='none';}
    }
    modal.classList.add('open');
  }
  function closeConfirm(){var modal=root.querySelector('.confirm-modal'); if(modal){modal.classList.remove('open');}}
  /* ── 投注限额与校验（需求1/2/3）── */
  var BET_MIN=1, BET_MAX=100000, PROJ_CAP=200000;
  var projStake={};
  function kfmt(n){return n>=1000?(n/1000)+'K':''+n;}
  /* 余额可能带千分位/小数（如 240,000.00）：按小数解析，不能用只取数字的 cleanNumber（会把 240,000.00 拼成 24000000）*/
  function getBalance(){var b=root.querySelector('.bal b');return b?Math.round(parseFloat(String(b.textContent).replace(/[^\d.]/g,''))||0):0;}
  function betKeyOf(el){var grp=el.closest('.grp'),gh=grp?grp.querySelector('.gh b'):null,g=gh?gh.textContent.trim():'';var nm=el.querySelector('.nm'),p=nm?nm.textContent.trim():el.textContent.trim();return g+'|'+p;}
  function betNameOf(el){var k=betKeyOf(el).split('|');return k[0]+'「'+k[1]+'」';}
  function clearBetError(){var slip=root.querySelector('.view-bet .slip'); if(!slip)return; var er=slip.querySelector('.amt-err'); if(er){er.classList.remove('show');} var i=slip.querySelector('.amtin'); if(i){i.classList.remove('err');}}
  function showBetError(msg,recharge){var slip=root.querySelector('.view-bet .slip'); if(!slip)return; var i=slip.querySelector('.amtin'); if(i){i.classList.add('err');} var er=slip.querySelector('.amt-err'); if(!er)return; var m=er.querySelector('.ae-msg'); if(m){m.textContent=msg;} var r=er.querySelector('.ae-recharge'); if(r){r.style.display=recharge?'':'none';} er.classList.add('show');}
  function showSdError(msg){var er=root.querySelector('.sd-amt-err'); if(er){er.textContent=msg; er.classList.add('show');} var inp=root.querySelector('.sd-amt-input'); if(inp){inp.classList.add('err');}}
  function openLimitModal(name,cap){var m=root.querySelector('.limit-modal'); if(!m)return; var b=m.querySelector('.lm-body'); if(b){b.textContent=name+'本期累计已达 '+kfmt(cap)+'，无法继续投注，请选择其他投注项';} m.classList.add('open');}
  function closeLimitModal(){var m=root.querySelector('.limit-modal'); if(m){m.classList.remove('open');}}
  function lockCappedOptions(){root.querySelectorAll('.view-bet .list .opt, .view-bet .list .nb').forEach(function(el){var capped=(projStake[betKeyOf(el)]||0)>=PROJ_CAP; el.classList.toggle('locked',capped); if(capped){el.classList.remove('sel');}});}
  function validateBet(){
    clearBetError();
    var sel=[].slice.call(root.querySelectorAll('.view-bet .list .opt.sel, .view-bet .list .nb.sel')).filter(function(e){return e.offsetParent!==null;});
    if(!sel.length)return false;
    var a=amtVal();
    if(a<BET_MIN){showBetError('单笔最低 '+kfmt(BET_MIN)+'，请调高金额',false);return false;}
    if(a>BET_MAX){showBetError('单笔最高 '+kfmt(BET_MAX)+'，请调低金额',false);return false;}
    for(var i=0;i<sel.length;i++){var key=betKeyOf(sel[i]); if((projStake[key]||0)+a>PROJ_CAP){openLimitModal(betNameOf(sel[i]),PROJ_CAP);return false;}}
    return true;
  }
  projStake['冠军|大']=199900; /* DEMO 种子：让「冠军·大」接近上限，投 180 即可触发触顶弹窗演示；生产环境删除此行 */
  /* ── DEMO 1-4 状态预览（开发调试用，上线前连同 .demo-bar 一起移除）── */
  function demoPick(group,name){var list=root.querySelector('.view-bet .list.game-pk'); if(!list)return null; var g=[].slice.call(list.querySelectorAll('.grp')).find(function(x){var b=x.querySelector('.gh b');return b&&b.textContent.trim()===group;}); if(!g)return null; return [].slice.call(g.querySelectorAll('.opt')).find(function(o){var nm=o.querySelector('.nm');return nm&&nm.textContent.trim()===name;});}
  var demoRealBal=null;
  function runDemo(n){
    showView('bet');
    /* 恢复真实余额显示（离开「余额不足」演示时）*/
    var balB=root.querySelector('.bal b');
    if(demoRealBal!==null&&balB){balB.textContent=demoRealBal;demoRealBal=null;}
    projStake={}; projStake['冠军|大']=199900; lockCappedOptions();
    root.querySelectorAll('.view-bet .list .sel').forEach(function(x){x.classList.remove('sel');});
    clearBetError(); closeLimitModal(); closeConfirm();
    var amt=root.querySelector('.view-bet .amtin'), o;
    if(n==='1'){ o=demoPick('亚军','大'); if(o){o.classList.add('sel');} if(amt){amt.value='150000';} updateTotal(); validateBet(); }
    else if(n==='2'){ /* 钱包余额可能很大，演示时临时把余额压低到 200，投 300 即触发「余额不足」，视觉一致 */ if(balB){demoRealBal=balB.textContent;balB.textContent='200.00';} o=demoPick('亚军','大'); if(o){o.classList.add('sel');} if(amt){amt.value='300';} updateTotal(); }
    else if(n==='3'){ projStake['冠军|大']=PROJ_CAP; lockCappedOptions(); updateTotal(); ['.view-bet .gboard','.view-bet .main','.view-bet .list.game-pk'].forEach(function(s){var el=root.querySelector(s); if(el){el.scrollTop=0;}}); }
  }
  function showQuickSlip(label){
    var qs=root.querySelector('.quickslip'); if(!qs) return;
    var qp=qs.querySelector('.quickpick'); if(qp){qp.textContent=label;}
    qs.classList.add('show');
  }
  function hideQuickSlip(){
    var qs=root.querySelector('.quickslip'); if(qs){qs.classList.remove('show');}
  }
  /* ── 长龙快投 Drawer ── */
  var sdState={group:'',pick:'',label:'',dir:'follow',amt:0};
  /* ── 自定义常用额度（投注页与长龙快投共用）── */
  var chipVals=[30,60,90,180,360];
  function applyChipLabels(){
    var minV=chipVals[0],maxV=chipVals[chipVals.length-1];
    var ph='最低'+kfmt(BET_MIN)+' - 最高'+kfmt(BET_MAX);
    root.querySelectorAll('.view-bet .amtin, .sd-amt-input').forEach(function(i){i.placeholder=ph;});
    var slipAmt=amtVal();
    root.querySelectorAll('.view-bet .qa .amtchip:not(.mm)').forEach(function(c,idx){
      if(idx<chipVals.length){c.textContent=chipVals[idx];c.style.display='';c.classList.toggle('on',slipAmt>0&&chipVals[idx]===slipAmt);}
      else{c.style.display='none';c.classList.remove('on');}
    });
    root.querySelectorAll('.sd-pills .sd-pill:not(.mm)').forEach(function(c,idx){
      if(idx<chipVals.length){c.textContent=chipVals[idx];c.setAttribute('data-arg',chipVals[idx]);c.style.display='';c.classList.toggle('on',sdState.amt>0&&chipVals[idx]===sdState.amt);}
      else{c.style.display='none';c.classList.remove('on');}
    });
    updateChipBudget();
  }
  function openLimitSet(){
    var m=root.querySelector('.limitset-modal'); if(!m) return;
    var ins=[].slice.call(m.querySelectorAll('.ls-in'));
    ins.forEach(function(inp,idx){inp.value=chipVals[idx]!==undefined?chipVals[idx]:'';});
    m.classList.add('open');
  }
  function closeLimitSet(){var m=root.querySelector('.limitset-modal'); if(m){m.classList.remove('open');}}
  function saveLimitSet(){
    var m=root.querySelector('.limitset-modal'); if(!m) return;
    var vals=[].slice.call(m.querySelectorAll('.ls-in')).map(function(i){return cleanNumber(i.value);}).filter(function(v){return v>0;}).sort(function(a,b){return a-b;});
    chipVals=vals.length?vals.slice(0,5):[30,60,90,180,360];
    applyChipLabels();
    closeLimitSet();
  }

  function openStreakDrawer(group,pick,label,compact){
    sdState.group=group; sdState.pick=pick; sdState.label=label; sdState.dir='follow'; sdState.amt=0;
    var d=root.querySelector('.streak-drawer'); if(!d) return;
    // 解析期数：从 compact 取数字，如 "冠军大(4期)" → 4
    var m=compact?compact.match(/\((\d+)期\)/):null;
    var count=m?m[1]:'';
    var badgeText=label.replace(/\s+/,'') + (count?' · 连开 '+count+' 期':'');
    d.querySelector('.sd-badge-txt').textContent=badgeText;
    // 取当前期号
    var period=root.querySelector('.rper b');
    d.querySelector('.sd-period').textContent=period?period.textContent.replace('期',''):'--';
    sdUpdateDir('follow');
    sdUpdateAmt(0);
    d.classList.add('open');
  }
  function closeStreakDrawer(){
    var d=root.querySelector('.streak-drawer'); if(d){d.classList.remove('open');}
  }
  function sdUpdateDir(dir){
    sdState.dir=dir;
    var follow=root.querySelector('.sd-tbtn[data-arg="follow"]');
    var against=root.querySelector('.sd-tbtn[data-arg="against"]');
    if(follow){follow.innerHTML='<div class="tl">跟投「'+sdState.pick+'」</div><div class="to">1.99</div>'; follow.className='sd-tbtn'+(dir==='follow'?' sel-follow':'');}
    var oppMap={'大':'小','小':'大','单':'双','双':'单','龙':'虎','虎':'龙'};
    var opp=oppMap[sdState.pick]||'反';
    if(against){against.innerHTML='<div class="tl">反投「'+opp+'」</div><div class="to">1.99</div>'; against.className='sd-tbtn'+(dir==='against'?' sel-against':'');}
    sdUpdateSummary();
  }
  function sdPillVal(arg){
    if(arg==='min')return chipVals[0];
    if(arg==='max')return chipVals[chipVals.length-1];
    return parseInt(arg,10);
  }
  function sdRealtimeBalance(){
    var er=root.querySelector('.sd-amt-err'), inp=root.querySelector('.sd-amt-input'), a=sdState.amt, bal=getBalance();
    if(a>=BET_MIN&&a<=BET_MAX&&a>bal){if(er){er.textContent='超出余额（'+bal+'），还差 '+(a-bal); er.classList.add('show');} if(inp){inp.classList.add('err');}}
    else{if(er){er.classList.remove('show');} if(inp){inp.classList.remove('err');}}
  }
  function sdUpdateAmt(amt){
    sdState.amt=amt;
    var inp=root.querySelector('.sd-amt-input'); if(inp){inp.value=amt>0?amt:'';}
    root.querySelectorAll('.sd-pill').forEach(function(p){
      p.classList.toggle('on',amt>0&&sdPillVal(p.getAttribute('data-arg'))===amt);
    });
    sdRealtimeBalance();
    sdUpdateSummary();
  }
  function sdUpdateSummary(){
    var win=root.querySelector('.sd-win'); if(win){win.textContent=''+(sdState.amt*0.99).toFixed(2);}
  }
  function submitStreakDrawer(){
    var oppMap={'大':'小','小':'大','单':'双','双':'单','龙':'虎','虎':'龙'};
    var betPick=sdState.dir==='follow'?sdState.pick:(oppMap[sdState.pick]||sdState.pick);
    // 校验（需求1/2/3）：单笔范围 → 余额 → 项目累计上限
    if(sdState.amt<BET_MIN||sdState.amt>BET_MAX){showSdError('单笔范围 '+kfmt(BET_MIN)+' - '+kfmt(BET_MAX));return;}
    if(sdState.amt>getBalance()){showSdError('超出余额（'+getBalance()+'），还差 '+(sdState.amt-getBalance()));return;}
    if((projStake[sdState.group+'|'+betPick]||0)+sdState.amt>PROJ_CAP){closeStreakDrawer();openLimitModal(sdState.group+'「'+betPick+'」',PROJ_CAP);return;}
    // 加入 betslip：找到对应 opt 并选中
    var ph=root.querySelector('.phone'),game=ph?ph.getAttribute('data-game'):'pk';
    var list=root.querySelector('.view-bet .list.game-'+game)||root.querySelector('.view-bet .list.game-pk');
    if(list){
      var groups=[].slice.call(list.querySelectorAll('.grp'));
      var grp=groups.find(function(g){var h=g.querySelector('.gh b');return h&&h.textContent.indexOf(sdState.group)>=0;});
      if(grp){
        var choices=[].slice.call(grp.querySelectorAll('.opt,.nb'));
        var target=choices.find(function(c){
          var nm=c.querySelector('.nm');
          return (nm&&nm.textContent.trim()===betPick)||c.textContent.trim()===betPick;
        });
        if(target){target.classList.add('sel');}
      }
    }
    // 同步注额
    var amtin=root.querySelector('.view-bet .amtin'); if(amtin){amtin.value=sdState.amt>0?sdState.amt:'';}
    root.querySelectorAll('.view-bet .amtchip').forEach(function(c){
      c.classList.toggle('on',!c.classList.contains('mm')&&parseInt(c.textContent.trim(),10)===sdState.amt);
    });
    closeStreakDrawer();
    updateTotal();
  }

  function selectStreak(group,pick,label){
    var ph=root.querySelector('.phone'),game=ph?ph.getAttribute('data-game'):'pk';
    var list=root.querySelector('.view-bet .list.game-'+game)||root.querySelector('.view-bet .list.game-pk');
    var target=null;
    if(list){
      var groups=[].slice.call(list.querySelectorAll('.grp'));
      var grp=groups.find(function(g){var h=g.querySelector('.gh b'); return h&&h.textContent.indexOf(group)>=0;});
      if(grp){
        var choices=[].slice.call(grp.querySelectorAll('.opt,.nb'));
        target=choices.find(function(c){
          var nm=c.querySelector('.nm');
          return (nm&&nm.textContent.trim()===pick)||c.textContent.trim()===pick;
        });
      }
    }
    var nowSel=false;
    if(target){target.classList.toggle('sel');nowSel=target.classList.contains('sel');}
    root.querySelectorAll('[data-act="streakpick"][data-group="'+group+'"][data-pick="'+pick+'"]').forEach(function(c){
      c.classList.toggle('picked',nowSel);
    });
    updateTotal();
  }
  function putCmd(t,source){
    var panel=source?(source.closest('.planpanel')||source.closest('.autodash')):root.querySelector('.planpanel.on');
    var f=panel?panel.querySelector('.field'):root.querySelector('.field');
    if(f){f.textContent=t;f.classList.remove('ph');}
    if(panel){var d=panel.querySelector('.cmddrawer'); if(d){d.classList.remove('open');}}
  }
  function toggleCommands(source){
    var panel=source?source.closest('.planpanel'):root.querySelector('.planpanel.on');
    if(!panel) return;
    root.querySelectorAll('.cmddrawer.open').forEach(function(d){if(d!==panel.querySelector('.cmddrawer')){d.classList.remove('open');}});
    var drawer=panel.querySelector('.cmddrawer'); if(drawer){drawer.classList.toggle('open');}
  }
  function togglePlanHist(source){
    var panel=source?source.closest('.planpanel'):root.querySelector('.planpanel.on');
    if(!panel) return;
    root.querySelectorAll('.planhist-drawer.open').forEach(function(d){if(d!==panel.querySelector('.planhist-drawer')){d.classList.remove('open');}});
    var drawer=panel.querySelector('.planhist-drawer'); if(drawer){drawer.classList.toggle('open');}
  }
  var rkSaved={mode:'stake',rate:0.0008};
  function rkState(){
    var segOn=root.querySelector('#rkSeg .on');
    var ri=root.querySelector('#rkRate');
    return {mode:segOn?segOn.getAttribute('data-arg'):'stake', rate:ri?(parseFloat(ri.value)||0):0};
  }
  function rkDirty(){var c=rkState();return c.mode!==rkSaved.mode||c.rate!==rkSaved.rate;}
  function rkSyncChips(){
    var ri=root.querySelector('#rkRate'); if(!ri)return;
    var v=parseFloat(ri.value), hit=false;
    root.querySelectorAll('.rk-presets .rkp[data-v]').forEach(function(c){var on=parseFloat(c.getAttribute('data-v'))===v;c.classList.toggle('on',on);if(on){hit=true;}});
    var oth=root.querySelector('#rkpOther'); if(oth){oth.classList.toggle('on',!hit);}
    var row=root.querySelector('#rkCustomRow'); if(row&&!hit){row.style.display='';}
  }
  function rkCtaSync(){var b=root.querySelector('#rkSaveBtn'); if(b){b.classList.toggle('dim',!rkDirty());}}
  function rkPresetMRU(rate){
    var chips=[].slice.call(root.querySelectorAll('.rk-presets .rkp[data-v]'));
    if(!chips.length)return;
    var rs=rate.toFixed(4);
    var vals=chips.map(function(c){return c.getAttribute('data-v');}).filter(function(v){return parseFloat(v)!==rate;});
    vals.unshift(rs); vals=vals.slice(0,chips.length);
    chips.forEach(function(c,i){c.setAttribute('data-v',vals[i]);c.textContent=vals[i];});
    rkSyncChips();
  }
  function rkRender(){
    var c=rkState();
    var ti=root.querySelector('#rkTest'); if(!ti)return;
    var test=parseFloat(ti.value)||0;
    var lab=root.querySelector('#rkTestLab');
    if(lab){lab.textContent=c.mode==='win'?'成员盈利额度':'成员投注额度';}
    var out=test*c.rate/100;
    var outTxt=(Math.round(out*10000)/10000).toLocaleString(undefined,{maximumFractionDigits:4,minimumFractionDigits:2});
    var ro=root.querySelector('#rkOut');
    if(ro){ro.textContent=outTxt;}
    var rl=root.querySelector('#rkRateLine');
    if(rl){rl.textContent=c.rate.toFixed(4)+'%';}
    var cm=root.querySelector('#rkCurrentMode');
    if(cm){cm.textContent=c.mode==='win'?'按成员盈利抽成':'按成员投注额度抽成';}
    var cr=root.querySelector('#rkCurrentRate');
    if(cr){cr.textContent=c.rate.toFixed(4)+'%';}
  }
  function rkRestore(){
    var sg=root.querySelector('#rkSeg');
    if(sg){sg.querySelectorAll('div').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-arg')===rkSaved.mode);});}
    var ri=root.querySelector('#rkRate'); if(ri){ri.value=rkSaved.rate.toFixed(4).replace(/0+$/,'').replace(/\.$/,'')||rkSaved.rate;}
    if(ri){ri.value=rkSaved.rate;}
    rkSyncChips();rkRender();rkCtaSync();
    var row=root.querySelector('#rkCustomRow'), oth=root.querySelector('#rkpOther');
    if(row&&oth&&!oth.classList.contains('on')){row.style.display='none';}
  }
  var memSort='bet_asc';
  function applyMem(){
    var pl=root.querySelector('#pl-members'); if(!pl)return;
    var qi=root.querySelector('.psrch input[data-roster]');
    var q=qi?qi.value.trim():'';
    var onTab=root.querySelector('.view-members .fg-btabs .btab.on');
    var f=onTab?onTab.getAttribute('data-f'):'all';
    var rows=[].slice.call(pl.querySelectorAll('.mrow'));
    rows.sort(function(a,b){
      var k=memSort;
      function gi(el,at){return parseInt(el.getAttribute(at),10)||0;}
      if(k==='bet_asc'){return gi(a,'data-bet')-gi(b,'data-bet');}
      if(k==='bet_desc'){return gi(b,'data-bet')-gi(a,'data-bet');}
      if(k==='cr_desc'){return gi(b,'data-credit')-gi(a,'data-credit');}
      if(k==='cr_asc'){return gi(a,'data-credit')-gi(b,'data-credit');}
      if(k==='join_asc'){return gi(a,'data-join')-gi(b,'data-join');}
      if(k==='join_desc'){return gi(b,'data-join')-gi(a,'data-join');}
      return (a.getAttribute('data-name')||'').localeCompare(b.getAttribute('data-name')||'','zh');
    });
    rows.forEach(function(r){pl.appendChild(r);});
    var n=0;
    rows.forEach(function(r){
      var st=r.getAttribute('data-st');
      var okF=(f==='all')||(st===f);
      var ok=okF&&((!q)||r.textContent.indexOf(q)>=0);
      r.classList.toggle('bfilter-hide',!ok);
      r.classList.remove('plitem-hide');
      if(ok){n++;}
    });
    var emp=root.querySelector('.lst-empty[data-roster]');
    if(emp){emp.style.display=n?'none':'block';}
    pl.setAttribute('data-page','1');
    renderPage('pl-members');
  }
  root.addEventListener('input',function(e){
    if(e.target.classList&&e.target.classList.contains('amount-entry__value')){
      var nv=parseAmt(e.target.value);
      e.target.value=fmtAmt(nv);
      var vwI=e.target.closest('.view');
      if(vwI){vwI.querySelectorAll('.amtchip').forEach(function(c){c.classList.toggle('on',c.getAttribute('data-v')===String(nv));});}
      return;
    }
    if(e.target.id==='rkRate'||e.target.id==='rkTest'){
      if(e.target.id==='rkRate'){
        var rv=e.target.value.replace(/[^\d.]/g,'');
        var rp=rv.split('.');
        if(rp.length>2){rv=rp[0]+'.'+rp.slice(1).join('');rp=rv.split('.');}
        if(rp[1]&&rp[1].length>4){rv=rp[0]+'.'+rp[1].slice(0,4);}
        if(rv!==e.target.value){e.target.value=rv;}
        rkSyncChips();rkCtaSync();
      }
      rkRender();return;
    }
    var inp=e.target.closest('.psrch input'); if(!inp)return;
    var bx=inp.closest('.psrch'); if(bx){bx.classList.toggle('has',!!inp.value);}
    var ld=inp.getAttribute('data-list');
    if(ld){applyWF(ld);}else if(inp.getAttribute('data-roster')){applyMem();}
  });
  function mhType(){
    var c=root.querySelector('.view-member .mh-tabs .fchip.on');
    return c?c.getAttribute('data-f'):'all';
  }
  function txAmount(row){
    var b=row&&row.querySelector('.r>b');
    if(!b)return 0;
    return Math.abs(parseFloat((b.textContent||'').replace(/[^0-9.-]/g,''))||0);
  }
  function txMoney(n){
    return Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function paintTxSummary(ids,upCount,upAmt,downCount,downAmt,isOwner){
    var up=root.querySelector(ids.up),upC=root.querySelector(ids.upCount),down=root.querySelector(ids.down),downC=root.querySelector(ids.downCount),lab=root.querySelector(ids.lab),netEl=root.querySelector(ids.net);
    if(up){up.textContent=txMoney(upAmt);}
    if(upC){upC.textContent=upCount+' 笔';}
    if(down){down.textContent=txMoney(downAmt);}
    if(downC){downC.textContent=downCount+' 笔';}
    var net=isOwner?(downAmt-upAmt):(upAmt-downAmt),label;
    if(isOwner){label=net>0?'额度池净增加':(net<0?'额度池净减少':'额度池净变动');}
    else{label=net>0?'净上分':(net<0?'净下分':'额度净变动');}
    if(lab){lab.textContent=label;}
    if(netEl){netEl.textContent=txMoney(Math.abs(net));netEl.classList.toggle('neg',net<0);}
  }
  function updateMemberTxSummary(mv){
    var pl=root.querySelector('#pl-member-hist');if(!pl)return;
    var allT=mv==='all'||mv===99999,limit=allT?99999:parseInt(mv,10)||0;
    var uc=0,ua=0,dc=0,da=0;
    pl.querySelectorAll('.bi').forEach(function(row){
      var dd=parseInt(row.getAttribute('data-days'),10)||0;
      if(!allT&&dd>limit)return;
      if(row.classList.contains('rej')||row.getAttribute('data-st')==='no'||row.getAttribute('data-st')==='pd')return;
      if(row.getAttribute('data-t')==='up'){uc++;ua+=txAmount(row);}
      else if(row.getAttribute('data-t')==='down'){dc++;da+=txAmount(row);}
    });
    paintTxSummary({up:'#mhUp',upCount:'#mhUpCount',down:'#mhDown',downCount:'#mhDownCount',lab:'#mhNetLabel',net:'#mhNet'},uc,ua,dc,da,false);
  }
  function mhApply(mv){
    var pl=root.querySelector('#pl-member-hist'); if(!pl)return;
    var ty=mhType(), cnt=0, allT=(mv==='all'||mv===99999);
    pl.querySelectorAll('.bi').forEach(function(r){
      var dd=parseInt(r.getAttribute('data-days'),10)||0;
      var okT2=(ty==='all')||(r.getAttribute('data-t')===ty);
      var ok=(allT||dd<=mv)&&okT2; r.classList.toggle('bfilter-hide',!ok); if(ok){cnt++;}
    });
    var me=root.querySelector('#mhEmpty'); if(me){me.style.display=cnt?'none':'block';}
    updateMemberTxSummary(mv);
    lmState['pl-member-hist'].shown=lmState['pl-member-hist'].batch;
    renderLM('pl-member-hist');
  }
  function renderPage(id){
    var pl=root.querySelector('#'+id); if(!pl) return;
    var size=parseInt(pl.getAttribute('data-size'),10)||5;
    var items=[].slice.call(pl.children).filter(function(x){return !x.classList.contains('bfilter-hide');});
    var total=items.length,maxPage=Math.max(1,Math.ceil(total/size));
    var page=Math.min(Math.max(1,parseInt(pl.getAttribute('data-page'),10)||1),maxPage);
    pl.setAttribute('data-page',page);
    items.forEach(function(it,i){it.classList.toggle('plitem-hide', i<(page-1)*size || i>=page*size);});
    var pager=root.querySelector('.pager[data-target="'+id+'"]');
    if(pager){
      var txt=pager.querySelector('.pgtxt'); if(txt){txt.textContent=page+' / '+maxPage;}
      var prev=pager.querySelector('[data-dir="prev"]'),next=pager.querySelector('[data-dir="next"]');
      if(prev){prev.classList.toggle('dis',page<=1);}
      if(next){next.classList.toggle('dis',page>=maxPage);}
      pager.style.display=maxPage<=1?'none':'flex';
    }
  }
  function initPagers(){root.querySelectorAll('.pagelist[data-size]').forEach(function(pl){renderPage(pl.id);});}

  /* 交易记录（管理中心首页内联）：方向/时间筛选后每次仅显示 otxShown 条，「查看更多」递增（取代分页）*/
  var OTX_BATCH=6, otxShown=6;
  var lmState={'pl-wallet-flow':{shown:6,batch:6,more:'#uwFlowMore'},'pl-member-hist':{shown:5,batch:5,more:'#mhMore'}};
  function renderLM(lid){
    var st=lmState[lid]; if(!st)return;
    var pl=root.querySelector('#'+lid); if(!pl)return;
    var matched=0, shown=0;
    [].forEach.call(pl.children,function(bi){
      if(!bi.classList||!bi.classList.contains('bi'))return;
      if(bi.classList.contains('bfilter-hide')){bi.classList.remove('plitem-hide');return;}
      matched++;
      if(shown<st.shown){bi.classList.remove('plitem-hide');shown++;}
      else{bi.classList.add('plitem-hide');}
    });
    var more=root.querySelector(st.more), rest=matched-shown;
    if(more){if(rest>0){more.style.display='';more.textContent='查看更多（+'+Math.min(st.batch,rest)+'）';}else{more.style.display='none';}}
  }
  function renderOwnerTx(){
    var pl=root.querySelector('#pl-owner-tx'); if(!pl)return;
    var matched=0, shown=0;
    [].forEach.call(pl.children,function(bi){
      if(bi.classList.contains('bfilter-hide')){bi.classList.remove('plitem-hide');return;}
      matched++;
      if(shown<otxShown){bi.classList.remove('plitem-hide');shown++;}
      else{bi.classList.add('plitem-hide');}
    });
    var more=root.querySelector('#ownerTxMore'), rest=matched-shown;
    if(more){if(rest>0){more.style.display='';more.textContent='查看更多（+'+Math.min(OTX_BATCH,rest)+'）';}else{more.style.display='none';}}
  }
  function txDateMatch(lid,row){
    var sel=root.querySelector('.wfsel[data-list="'+lid+'"]');
    var ds=root.querySelector('.wfdate[data-list="'+lid+'"][data-edge="start"]'),de=root.querySelector('.wfdate[data-list="'+lid+'"][data-edge="end"]');
    var tv=sel?sel.value:'all',dd=parseInt(row.getAttribute('data-days'),10)||0;
    if(ds&&de&&ds.value&&de.value){
      var base=new Date('2026-07-07T00:00:00');
      var d1=Math.round((base-new Date(ds.value+'T00:00:00'))/86400000);
      var d0=Math.round((base-new Date(de.value+'T00:00:00'))/86400000);
      return dd>=Math.max(0,d0)&&dd<=Math.max(0,d1);
    }
    if(tv==='all')return true;
    return dd<=(parseInt(tv,10)||0);
  }
  function updateOwnerTxSummary(){
    var pl=root.querySelector('#pl-owner-tx');if(!pl)return;
    var uc=0,ua=0,dc=0,da=0;
    pl.querySelectorAll('.bi').forEach(function(row){
      if(!txDateMatch('pl-owner-tx',row))return;
      if(row.classList.contains('rej')||row.getAttribute('data-st')==='no'||row.getAttribute('data-st')==='pd')return;
      if(row.getAttribute('data-t')==='out'){uc++;ua+=txAmount(row);}
      else if(row.getAttribute('data-t')==='in'){dc++;da+=txAmount(row);}
    });
    paintTxSummary({up:'#otxUp',upCount:'#otxUpCount',down:'#otxDown',downCount:'#otxDownCount',lab:'#otxNetLabel',net:'#otxNet'},uc,ua,dc,da,true);
  }
  function txSignedAmount(row){
    var b=row&&row.querySelector('.r>b');if(!b)return 0;
    return parseFloat((b.textContent||'').replace(/,/g,'').replace(/−/g,'-').replace(/[^0-9+.-]/g,''))||0;
  }
  function updateWalletTxSummary(){
    var pl=root.querySelector('#pl-wallet-flow');if(!pl)return;
    var uc=0,ua=0,dc=0,da=0,game=0;
    pl.querySelectorAll('.bi').forEach(function(row){
      if(!txDateMatch('pl-wallet-flow',row))return;
      if(row.classList.contains('rej')||row.getAttribute('data-st')==='no'||row.getAttribute('data-st')==='pd')return;
      var typ=row.getAttribute('data-t');
      if(typ==='credit'){uc++;ua+=txAmount(row);}
      else if(typ==='withdraw'){dc++;da+=txAmount(row);}
      else if(typ==='plan'){game+=txSignedAmount(row);}
    });
    var up=root.querySelector('#uwTxUp'),upC=root.querySelector('#uwTxUpCount'),down=root.querySelector('#uwTxDown'),downC=root.querySelector('#uwTxDownCount'),gameEl=root.querySelector('#uwTxGame');
    var lab=root.querySelector('#uwTxNetLabel'),netEl=root.querySelector('#uwTxNet');
    if(up){up.textContent=txMoney(ua);}
    if(upC){upC.textContent=uc+' 笔';}
    if(down){down.textContent=txMoney(da);}
    if(downC){downC.textContent=dc+' 笔';}
    if(gameEl){gameEl.textContent=(game>0?'+':(game<0?'−':''))+txMoney(Math.abs(game));gameEl.classList.toggle('neg',game<0);}
    var net=ua-da+game;
    if(lab){lab.textContent=net>0?'额度净增加':(net<0?'额度净减少':'额度净变动');}
    if(netEl){netEl.textContent=txMoney(Math.abs(net));netEl.classList.toggle('neg',net<0);}
  }

  /* ── 投注历史：结果/来源筛选 + 日期 + 汇总（scoped 到 .view-bets，不影响交易记录）── */
  var betRes='all', betSrc='all', betDate='0', betShown=20, BET_BATCH=20, betOpenSrc='all';
  var BET_DATE_SUM={'0':{c:'142',a:'6,480',p:316},'7':{c:'980',a:'44,200',p:1240},'6':{c:'3,820',a:'171,000',p:-2600}};
  var BET_SRC_SUM={'manual':{c:'106',a:'5,240',p:198},'p:自定义策略':{c:'24',a:'820',p:79},'p:长龙反投':{c:'8',a:'320',p:39},'p:小本试水':{c:'4',a:'100',p:-12}};
  /* 可赢 = 注额 ×（赔率−1）= 注额 × 0.99，精确值（如 50→49.5），不取整 */
  function fmtWin(v){return String(Math.round(v*100)/100);}
  /* 生成约 46 条示意已结注单（多游戏 · 演示「20 条 + 查看更多」）*/
  function buildBetHistory(){
    var box=root.querySelector('#pl-bets-settled'); if(!box||box.children.length)return;
    var GAMES=[
      {n:'PK10',plays:['冠军 大','冠军 小','冠军 单','亚军 单','第三名 龙','第五名 小','冠亚和 大','冠亚和 单']},
      {n:'时时彩',plays:['第一球 大','第二球 单','第三球 小','第四球 双','总和 大','总和 单']}
    ];
    var PLANS=['自定义策略','长龙反投','小本试水'], STAKES=[30,40,50,60,80,100], h='';
    for(var i=0;i<46;i++){
      var g=GAMES[(i%4===3)?1:0], play=g.plays[i%g.plays.length];
      var period=('00'+(88-i)).slice(-3);
      var stake=STAKES[i%STAKES.length], win=stake*0.99;
      var won=((i*3+1)%5!==0&&(i*3+1)%5!==2);
      var isAuto=(i%3===0), plan=PLANS[Math.floor(i/3)%PLANS.length];
      var t=580-i*3, tm=('0'+(Math.floor(t/60))).slice(-2)+':'+('0'+(t%60)).slice(-2);
      h+='<div class="bi" data-src="'+(isAuto?'auto':'manual')+'"'+(isAuto?' data-plan="'+plan+'"':'')+' data-amt="'+stake+'">'
        +'<div class="q"><b><i class="gtag">'+g.n+'</i>'+period+' 期 · '+play+'</b><span>'+(isAuto?'<i class="atag">自动投</i>':'')+stake+' @1.99 · '+tm+'</span></div>'
        +'<div class="r '+(won?'win':'lose')+'">'+(won?'+'+fmtWin(win):'−'+stake)+'</div></div>';
    }
    box.innerHTML=h;
  }
  /* 未结来源 chips：全部 / 手动投注 / 各策略名（有自动投才出现，只显示策略名，格式同已结 pill）*/
  function buildOpenSrcChips(){
    var box=root.querySelector('#betOpenSrc'); if(!box)return;
    var hasManual=false, plans=[];
    root.querySelectorAll('.btabpanel[data-btab="open"] .bi').forEach(function(r){
      if(r.getAttribute('data-src')==='auto'){var p=r.getAttribute('data-plan'); if(p&&plans.indexOf(p)<0)plans.push(p);}else{hasManual=true;}
    });
    var h='<span class="fchip betopensrc'+(betOpenSrc==='all'?' on':'')+'" data-act="betopensrc" data-v="all">全部</span>';
    if(hasManual){h+='<span class="fchip betopensrc'+(betOpenSrc==='manual'?' on':'')+'" data-act="betopensrc" data-v="manual">手动投注</span>';}
    plans.forEach(function(p){h+='<span class="fchip betopensrc'+(betOpenSrc==='p:'+p?' on':'')+'" data-act="betopensrc" data-v="p:'+p+'">'+p+'</span>';});
    box.innerHTML=h;
  }
  function applyBetFilter(){
    var view=root.querySelector('.view-bets'); if(!view)return;
    if(!view.classList.contains('tab-settled')){
      view.querySelectorAll('.btabpanel[data-btab="open"] .bi').forEach(function(bi){
        var src=bi.getAttribute('data-src')||'manual', plan=bi.getAttribute('data-plan')||'';
        var ok=betOpenSrc==='all'||(betOpenSrc==='manual'&&src!=='auto')||(betOpenSrc.indexOf('p:')===0&&('p:'+plan)===betOpenSrc);
        bi.classList.toggle('bfilter-hide',!ok);
      });
      updateBetSum(); return;
    }
    betShown=BET_BATCH; renderSettled();
  }
  /* 已结：结果+来源筛选 + 每次仅显示 betShown 条，其余隐藏；载入更多递增 */
  function renderSettled(){
    var view=root.querySelector('.view-bets'); if(!view)return;
    var matched=0, shown=0;
    view.querySelectorAll('.btabpanel[data-btab="settled"] .bi').forEach(function(bi){
      var resOk=betRes==='all'||(betRes==='win'&&bi.querySelector('.r.win'))||(betRes==='lose'&&bi.querySelector('.r.lose'));
      var src=bi.getAttribute('data-src')||'manual', plan=bi.getAttribute('data-plan')||'';
      var srcOk=betSrc==='all'||(betSrc==='manual'&&src!=='auto')||(betSrc.indexOf('p:')===0&&('p:'+plan)===betSrc);
      if(!(resOk&&srcOk)){bi.classList.add('bfilter-hide');return;}
      matched++;
      if(shown<betShown){bi.classList.remove('bfilter-hide');shown++;}else{bi.classList.add('bfilter-hide');}
    });
    var more=view.querySelector('#betMore'), rest=matched-shown;
    if(more){if(rest>0){more.style.display='';more.textContent='查看更多（+'+Math.min(BET_BATCH,rest)+'）';}else{more.style.display='none';}}
    updateBetSum();
  }
  function updateBetSum(){
    var view=root.querySelector('.view-bets'); if(!view)return;
    var cEl=view.querySelector('#bsCount'), aEl=view.querySelector('#bsAmt'), tEl=view.querySelector('#bsThird');
    if(!cEl||!aEl||!tEl)return;
    if(!view.classList.contains('tab-settled')){
      var vis=0,amt=0,pot=0;
      view.querySelectorAll('.btabpanel[data-btab="open"] .bi').forEach(function(r){if(!r.classList.contains('bfilter-hide')){vis++;var a=parseFloat(r.getAttribute('data-amt'))||0;amt+=a;pot+=a*0.99;}});
      cEl.textContent=vis; aEl.textContent=amt.toLocaleString();
      tEl.innerHTML='结果<b class="win">'+fmtWin(pot)+'</b>';
    }else{
      var s=(betSrc!=='all'&&BET_SRC_SUM[betSrc])?BET_SRC_SUM[betSrc]:(BET_DATE_SUM[betDate]||BET_DATE_SUM['0']);
      cEl.textContent=s.c; aEl.textContent=s.a;
      var pos=s.p>=0; tEl.innerHTML='结果<b class="'+(pos?'win':'lose')+'">'+(pos?'+':'−')+Math.abs(s.p).toLocaleString()+'</b>';
    }
  }
  var formulaSnap=null;
  function snapFormula(){
    var map={};
    root.querySelectorAll('.view-formula .frow').forEach(function(r){
      var lb=r.querySelector('.lt b'); if(!lb) return;
      var key=lb.textContent.trim(), val='';
      var inp=r.querySelector('input'), st=r.querySelector('.stepper .val'), seg=r.querySelector('.seg2 .on'), mn=r.querySelector('.moneyin'), rg=r.querySelector('.rangeval');
      if(inp){val=inp.value;} else if(st){val=st.textContent.trim();} else if(seg){val=seg.textContent.trim();} else if(mn){val=mn.textContent.trim();} else if(rg){val=rg.textContent.trim();}
      if(val){map[key]=val;}
    });
    return map;
  }
  function toggleFormulaGroup(kind,val){
    var view=root.querySelector('.view-formula'); if(!view) return;
    if(kind==='bettype'){
      var isTwo=(val==='两面');
      view.querySelectorAll('.fg-twoside').forEach(function(el){el.style.display=isTwo?'':'none';});
      view.querySelectorAll('.fg-position').forEach(function(el){el.style.display=isTwo?'none':'';});
    }else if(kind==='betstyle'){
      var isMulti=(val==='倍投');
      view.querySelectorAll('.fg-multi').forEach(function(el){el.style.display=isMulti?'':'none';});
    }
    updatePlanPreview();
  }

  /* ── 自动投计划 v2：市场数量 / 触发区间标签 / 策略预览 / 总投入 / 爆仓查询 ── */
  var MARKET_COUNTS={'大小':10,'单双':10,'龙虎':5};
  var rgTouched={touched:false};
  function bindRangeSlider(minEl,maxEl,fillEl,valEl,onChange,touchState,placeholder){
    if(!minEl||!maxEl||!fillEl) return;
    function render(src,isUserAction){
      var min=parseInt(minEl.value),max=parseInt(maxEl.value);
      if(min>=max){ if(src===minEl){max=min+1;maxEl.value=max;} else {min=max-1;minEl.value=min;} }
      var lo=(parseInt(minEl.value)-1)/14*100, hi=(parseInt(maxEl.value)-1)/14*100;
      fillEl.style.left=lo+'%'; fillEl.style.width=(hi-lo)+'%';
      if(isUserAction&&touchState){touchState.touched=true;}
      if(valEl){
        if(touchState&&!touchState.touched&&placeholder){valEl.textContent=placeholder;}
        else{valEl.textContent=minEl.value+' ~ '+maxEl.value+' 期';}
      }
      if(onChange){onChange(parseInt(minEl.value),parseInt(maxEl.value));}
    }
    minEl.oninput=function(){render(minEl,true);};
    maxEl.oninput=function(){render(maxEl,true);};
    render(minEl,false);
  }
  function updateLogicLabel(){
    var view=root.querySelector('.view-formula'); if(!view) return;
    var logicOn=view.querySelector('.logic-seg .on');
    var isFollow=!logicOn||logicOn.textContent.trim()==='跟投';
    var label=view.querySelector('.rangelabel'), info=view.querySelector('.rangeinfo'), sub=view.querySelector('#rangeSub');
    if(label){label.textContent=isFollow?'长龙触发区间':'连续开出触发区间';}
    if(info){info.setAttribute('data-tip', isFollow
      ? '"长龙"指同一名次/对位连续开出同一结果。任意名次/对位达到最低值即独立触发跟投；超过最高值视为异常长龙，暂停跟进。'
      : '反投可能命中大/小/单/双等不同结果，这里统一按"连续开出同一结果"的期数计算，不特指某一"龙"。任意名次/对位达到最低值即独立触发反投；超过最高值暂停。');}
    if(sub){sub.textContent=isFollow?'达到最低值开始跟投；超过最高值视为异常，暂停跟进':'达到最低值开始反投；超过最高值视为异常，暂停跟进';}
  }
  function renderSkipChips(){
    var view=root.querySelector('.view-formula'); if(!view) return;
    var box=view.querySelector('#skipChips'); if(!box) return;
    var roundsVal=view.querySelector('#roundsStepper .val'); if(!roundsVal) return;
    var rounds=cleanNumber(roundsVal.textContent);
    var kept=[]; box.querySelectorAll('.on').forEach(function(c){var n=parseInt(c.getAttribute('data-p')); if(n<=rounds){kept.push(n);}});
    box.innerHTML='';
    for(var i=1;i<=rounds;i++){
      var c=document.createElement('span');
      c.className='fchip playchip'+(kept.indexOf(i)>=0?' on':'');
      c.setAttribute('data-act','playchip');
      c.setAttribute('data-p',i);
      c.textContent='第'+i+'期';
      box.appendChild(c);
    }
  }
  function updatePlanPreview(){
    var view=root.querySelector('.view-formula'); if(!view) return;
    var previewEl=view.querySelector('#planPreviewText'), stakeEl=view.querySelector('#planStakeText'); if(!previewEl||!stakeEl) return;
    renderSkipChips();
    var modeOn=view.querySelector('.bettype-seg .on'); var mode=modeOn?modeOn.textContent.trim():null;
    var marketBox=view.querySelector('#marketChips');
    var selNames=[], n=0;
    if(marketBox){
      marketBox.querySelectorAll('.playchip.on').forEach(function(c){
        var nm=c.textContent.replace(/（\d+）/,'').trim();
        selNames.push(nm); n+=parseInt(c.getAttribute('data-n'))||0;
      });
    }
    var marketSub=view.querySelector('#marketSub');
    if(marketSub){marketSub.textContent=n?('当前扫描范围共 '+n+' 个可独立触发的投注项（每个名次/对位各算一个）'):'（尚未选择任何类别，扫描范围为空）';}
    var tpSub=view.querySelector('#tpSub'), tpSubCard=view.querySelector('#tpSubCard');
    if(tpSub){tpSub.textContent=n?('当前扫描范围含 '+n+' 个投注项，各自独立触发；止盈止损按全部投注项合计计算'):'';}
    if(tpSubCard){tpSubCard.style.display=n?'':'none';}

    if(mode==='定位'){
      previewEl.textContent='定位模式规则暂不在本次范围内演示，请切换回"两面"查看完整策略预览。';
      stakeEl.textContent='';
      return;
    }
    updateLogicLabel();

    var missing=[];
    if(n===0){missing.push('玩法范围');}
    if(!mode){missing.push('玩法模式');}
    var logicOn=view.querySelector('.logic-seg .on');
    if(mode==='两面'&&!logicOn){missing.push('两面逻辑');}
    if(mode==='两面'&&!rgTouched.touched){missing.push('长龙触发区间');}
    var amountVal=view.querySelector('#amountStepper .val'); var amount=amountVal?cleanNumber(amountVal.textContent):0;
    if(!amount){missing.push('下注金额');}
    var roundsVal=view.querySelector('#roundsStepper .val'); var rounds=roundsVal?cleanNumber(roundsVal.textContent):0;
    if(!rounds){missing.push('下注回合数');}
    var methodOn=view.querySelector('.betstyle-seg .on');
    if(!methodOn){missing.push('投注方式');}
    var tpVal=view.querySelector('#tpStepper .val'), slVal=view.querySelector('#slStepper .val');
    var tpSet=tpVal&&tpVal.textContent.trim()!=='—', slSet=slVal&&slVal.textContent.trim()!=='—';
    if(!tpSet){missing.push('止盈');}
    if(!slSet){missing.push('止损');}

    if(missing.length){
      previewEl.textContent='还需完成以下设置才能生成策略预览：'+missing.join('、')+'。';
      stakeEl.textContent='';
      return;
    }

    var logic=logicOn.textContent.trim();
    var rgMin=view.querySelector('#rgMin'), rgMax=view.querySelector('#rgMax');
    var min=parseInt(rgMin.value), max=parseInt(rgMax.value);
    var method=methodOn.textContent.trim();
    var skipBox=view.querySelector('#skipChips'); var skipCount=skipBox?skipBox.querySelectorAll('.on').length:0;
    var skipList=[]; if(skipBox){skipBox.querySelectorAll('.on').forEach(function(c){skipList.push(c.getAttribute('data-p'));});}
    var tp=tpVal.textContent.trim(), sl=slVal.textContent.trim();
    var selText=selNames.join('、');
    var skipText=skipList.length?('，跳过第 '+skipList.join(',')+' 期'):'';
    var text='系统将持续扫描 PK10 全部10个名次及5组龙虎对位中，属于【'+selText+'】类别的全部 '+n+' 个投注项；其中任意一个名次/对位连续开出同一结果达到 '+min+'~'+max+' 期时（超过 '+max+' 期不再追），就会独立触发一笔'
      +logic+'——多个投注项可同时触发、互不影响。每笔 '+amount+' 额度起'
      +(method==='固定投'?'，每期金额不变':'，逐期倍增')
      +'，最长执行 '+rounds+' 期'+skipText
      +'，全部投注项合计盈利满 '+tp+' 或合计亏损满 '+sl+' 时立即停止整个计划。';
    previewEl.textContent=text;

    var k=Math.max(0,rounds-skipCount);
    var perMarket=method==='固定投'?amount*k:amount*(Math.pow(2,k)-1);
    var total=perMarket*n;
    stakeEl.innerHTML='若全部 '+n+' 个投注项同时触发，预计最大总投入：<span'+(total>50000?' class="warn"':'')+'>'+Math.round(total).toLocaleString()+' 额度</span>';
  }
  function syncBustFromPlan(){
    var pv=root.querySelector('.view-formula'), bv=root.querySelector('#bustModal'); if(!pv||!bv) return;
    var modeOn=pv.querySelector('.bettype-seg .on'), logicOn=pv.querySelector('.logic-seg .on');
    var modeVal=modeOn?modeOn.textContent.trim():'两面', logicVal=logicOn?logicOn.textContent.trim():'跟投';
    var bqMode=bv.querySelector('#bqMode'), bqLogic=bv.querySelector('#bqLogic');
    if(bqMode){bqMode.querySelectorAll('div').forEach(function(d){d.classList.toggle('on', d.textContent.trim()===modeVal);});}
    if(bqLogic){bqLogic.querySelectorAll('div').forEach(function(d){d.classList.toggle('on', d.textContent.trim()===logicVal);});}
    var rgMin=pv.querySelector('#rgMin'), rgMax=pv.querySelector('#rgMax'), bqMin=bv.querySelector('#bqMin'), bqMax=bv.querySelector('#bqMax');
    if(rgMin&&bqMin){bqMin.value=rgMin.value; bqMin.dispatchEvent(new Event('input'));}
    if(rgMax&&bqMax){bqMax.value=rgMax.value; bqMax.dispatchEvent(new Event('input'));}
    var roundsVal=pv.querySelector('#roundsStepper .val'), candVal=bv.querySelector('#bqCandStep .val');
    if(roundsVal&&candVal&&cleanNumber(roundsVal.textContent)>0){candVal.textContent=roundsVal.textContent;}
    var bqResult=bv.querySelector('#bqResult'); if(bqResult){bqResult.style.display='none';}
  }
  function runBustQuery(){
    var bv=root.querySelector('#bustModal'); if(!bv) return;
    var logicOn=bv.querySelector('#bqLogic .on'); var logic=logicOn?logicOn.textContent.trim():'跟投';
    var min=parseInt(bv.querySelector('#bqMin').value), max=parseInt(bv.querySelector('#bqMax').value);
    var need=Math.min(15,Math.max(4, 6+(max-min)+(logic==='反投'?2:0)));
    var freqs=[], total=0;
    for(var i=1;i<=need;i++){ var f=(i===need)?1:Math.max(1,Math.round(30*Math.sin(Math.PI*i/need))); freqs.push(f); total+=f; }
    bv.querySelector('#bqNumber').textContent=need;
    var hw=bv.querySelector('#bqHistWrap'); hw.innerHTML='';
    var hl=bv.querySelector('#bqHistLabels'); hl.innerHTML='';
    var maxF=Math.max.apply(null,freqs);
    freqs.forEach(function(f,idx){
      var bar=document.createElement('div'); bar.className='histbar'+((idx+1)===need?' bust':''); bar.style.height=Math.max(3,Math.round(f/maxF*56))+'px'; hw.appendChild(bar);
      var lab=document.createElement('span'); lab.textContent=idx+1; hl.appendChild(lab);
    });
    var candidate=cleanNumber(bv.querySelector('#bqCandStep .val').textContent);
    var covered=0; for(var j=1;j<=Math.min(candidate,need);j++){covered+=freqs[j-1];}
    var pct=Math.round(covered/total*100);
    bv.querySelector('#bqCoverage').innerHTML='候选回合数 <b>'+candidate+' 期</b> 可覆盖约 <b>'+pct+'%</b> 的历史长龙情形；仍有约 <b>'+(100-pct)+'%</b> 的情形可能在回本前提前触及回合上限或止损。爆仓数据为 <b>'+need+' 期</b>（历史最深一路所需追投回合数）。';
    bv.querySelector('#bqResult').style.display='flex';
  }
  function resetBustQuery(){
    var bv=root.querySelector('#bustModal'); if(!bv) return;
    bv.querySelectorAll('#bqMode div').forEach(function(d,i){d.classList.toggle('on', i===0);});
    bv.querySelectorAll('#bqLogic div').forEach(function(d,i){d.classList.toggle('on', i===0);});
    var bqMin=bv.querySelector('#bqMin'), bqMax=bv.querySelector('#bqMax');
    bqMin.value=3; bqMin.dispatchEvent(new Event('input'));
    bqMax.value=8; bqMax.dispatchEvent(new Event('input'));
    bv.querySelector('#bqCandStep .val').textContent='6 期';
    bv.querySelector('#bqResult').style.display='none';
  }
  function applyBustCandidate(){
    var bv=root.querySelector('#bustModal'); if(!bv) return;
    var candidate=bv.querySelector('#bqCandStep .val').textContent.trim();
    var roundsValEl=root.querySelector('.view-formula #roundsStepper .val');
    if(roundsValEl){roundsValEl.style.color='';roundsValEl.textContent=candidate;}
    updatePlanPreview();
    closeBustModal();
  }
  function diffFormula(old){
    if(!old) return '';
    var now=snapFormula(), rows=[];
    for(var k in now){ if(old[k]!==undefined && old[k]!==now[k]){ rows.push('<div class="pm-diffrow"><span>'+k+'</span><b>'+old[k]+' → '+now[k]+'</b></div>'); } }
    return rows.join('');
  }
  /* 「调整设置」：把启动确认弹窗里的当前参数带入计划编辑页，供玩家改完后自己选择启动或保存 */
  function prefillFormulaFromStart(){
    var sm=root.querySelector('#startModal'), view=root.querySelector('.view-formula');
    if(!sm||!view) return;
    var rows=sm.querySelectorAll('.srow b');
    var playText=rows[0]?rows[0].textContent.trim():'';
    var investText=rows[1]?rows[1].textContent.trim():'';
    var slText=rows[2]?rows[2].textContent.trim():'';
    var tpText=rows[3]?rows[3].textContent.trim():'';
    var titleText=sm.querySelector('.sm-h')?sm.querySelector('.sm-h').textContent.trim():'';
    var planName=titleText.replace(/^启动「/,'').replace(/」$/,'');

    var pn=view.querySelector('.plname'); if(pn&&planName){pn.value=planName;}

    view.querySelectorAll('#marketChips .playchip').forEach(function(c){c.classList.toggle('on', c.textContent.indexOf('大小')>=0);});

    view.querySelectorAll('.bettype-seg div').forEach(function(d){d.classList.toggle('on', d.textContent.trim()==='两面');});
    toggleFormulaGroup('bettype','两面');

    var isReverse=/反/.test(playText);
    view.querySelectorAll('.logic-seg div').forEach(function(d){d.classList.toggle('on', d.textContent.trim()===(isReverse?'反投':'跟投'));});

    var rgMin=view.querySelector('#rgMin'), rgMax=view.querySelector('#rgMax');
    if(rgMin&&rgMax){rgMin.value=3;rgMax.value=8;rgTouched.touched=true;rgMin.dispatchEvent(new Event('input'));}

    var nums=investText.match(/\d+(\.\d+)?/g)||[];
    var amount=nums[0]?parseFloat(nums[0]):10;
    var capMax=nums[1]?parseFloat(nums[1]):amount;
    var amtVal=view.querySelector('#amountStepper .val');
    if(amtVal){amtVal.textContent=amount;amtVal.style.color='';}

    var mult=2, rounds=1, cur=amount;
    while(cur*mult<=capMax && rounds<15){cur*=mult;rounds++;}
    var roundsVal=view.querySelector('#roundsStepper .val');
    if(roundsVal){roundsVal.textContent=rounds+' 期';roundsVal.style.color='';}

    var isMulti=capMax>amount;
    view.querySelectorAll('.betstyle-seg div').forEach(function(d){d.classList.toggle('on', d.textContent.trim()===(isMulti?'倍投':'固定投'));});
    toggleFormulaGroup('betstyle', isMulti?'倍投':'固定投');
    if(isMulti){
      var multVal=view.querySelector('.fg-multi .stepper .val');
      if(multVal){multVal.textContent=mult+'×';}
    }

    var tpNum=(tpText.match(/\d+/)||[])[0];
    var slNum=(slText.match(/\d+/)||[])[0];
    var tpVal=view.querySelector('#tpStepper .val'), slVal=view.querySelector('#slStepper .val');
    if(tpVal&&tpNum){tpVal.textContent='+'+tpNum;tpVal.style.color='var(--win)';}
    if(slVal&&slNum){slVal.textContent='−'+slNum;slVal.style.color='var(--red)';}

    updatePlanPreview();
  }
  var mdCurName='王哥';
  function mdSetFrozen(fz){
    var chip=root.querySelector('.view-member .md-name .stchip');
    if(chip){chip.className='stchip '+(fz?'fz':'ok');chip.textContent=fz?'已停用':'活跃';chip.style.display=fz?'':'none';}
    var bar=root.querySelector('#mdFzBar'); if(bar){bar.style.display=fz?'':'none';}
    var fr=root.querySelector('.view-memberedit .me-actions .frow2.danger b');
    if(fr){fr.textContent=fz?'恢复游戏权限':'停用游戏权限';}
  }
  function openMemberDetail(row){
    var v=root.querySelector('.view-member'); if(!v)return;
    mdCurName=row.getAttribute('data-name')||'王哥';
    var rav=row.querySelector('.av'),av=v.querySelector('.md-id .av');
    if(av&&rav){av.textContent=rav.textContent;av.setAttribute('style',rav.getAttribute('style')||'');}
    var nb=v.querySelector('.md-name b');if(nb){nb.textContent=mdCurName;}
    var mid=row.getAttribute('data-mid')||'88213',pill=v.querySelector('.md-idpill');
    if(pill&&pill.childNodes.length){pill.childNodes[0].textContent='#'+mid;}
    var sub=v.querySelector('.md-idnum'),rsub=row.querySelector('.mtx span');if(sub&&rsub){sub.textContent=rsub.textContent;}
    var edit=root.querySelector('.view-memberedit');
    if(edit){var eh=edit.querySelector('.subhead b'),ei=edit.querySelector('.me-field input'),ec=edit.querySelector('.me-actions .frv'),ea=edit.querySelector('.me-bigav');if(eh){eh.textContent=mdCurName;}if(ei){ei.value=mdCurName;}if(ec){ec.textContent=mid;}if(ea&&rav){ea.textContent=rav.textContent;ea.setAttribute('style',rav.getAttribute('style')||'');}}
    mdSetFrozen(row.getAttribute('data-st')==='fz');
  }
  function openPlanModal(kind,name,details){
    var m=root.querySelector('#planModal'); if(!m) return;
    var title=m.querySelector('#pmTitle'),body=m.querySelector('#pmBody'),btns=m.querySelector('#pmBtns');
    var nm=name?('「'+name+'」'):'本计划';
    if(kind==='stop'){
      title.textContent='确认急停？';
      body.innerHTML='急停后 '+nm+' 将<b>立即停止</b>，本期未执行的下注不再进行，<b>未用预算马上退回余额</b>。';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta danger" data-act="'+(pmDashId?'pmstopok':'pmclose')+'">确认急停</button>';
    }else if(kind==='restart'){
      title.textContent='重启计划';
      body.innerHTML='重启 '+nm+'，请选择方式：<div class="pm-opts"><button class="pm-opt" data-act="pmopt"><b>继续上一回合</b><span>保留期数进度与盈亏统计，从中断处继续投注。</span></button><button class="pm-opt" data-act="pmopt"><b>重置设置并重新开始</b><span>以原参数开启全新一轮，期数与盈亏从零计算。</span></button></div>';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta dis" data-act="pmclose">确认</button>';
    }else if(kind==='restart2'){
      /* 仪表盘重启：带上回合概要 + 智能默认（已完成→重置 · 被中断→继续） */
      var rp=details||{};
      title.textContent='重启'+nm;
      body.innerHTML=(rp.ctx?'<div class="pm-ctx">'+rp.ctx+'</div>':'')
        +'<div class="pm-opts">'
        +'<button class="pm-opt'+(rp.def==='resume'?' sel':'')+'" data-act="pmopt" data-opt="resume"><b>继续上一回合</b><span>保留期数进度与盈亏统计，从中断处继续投注。</span></button>'
        +'<button class="pm-opt'+(rp.def==='fresh'?' sel':'')+'" data-act="pmopt" data-opt="fresh"><b>重置设置并重新开始</b><span>以原参数开启全新一轮，期数与盈亏从零计算。</span></button>'
        +'</div>';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta" data-act="pmrestartok">重启</button>';
    }else if(kind==='delete'){
      title.textContent='确认删除？';
      body.innerHTML='删除 '+nm+' 后<b>无法恢复</b>，历史记录一并移除。';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta danger" data-act="pmclose">删除</button>';
    }else if(kind==='savechange'){
      title.textContent='保存修改';
      var diffBox=details?'<div class="pm-diff"><div class="pm-difftitle">本次修改</div>'+details+'</div>':'<div class="pm-diff"><div class="pm-difftitle">本次修改</div><div class="pm-diffrow"><span style="color:var(--muted)">未检测到参数变更</span></div></div>';
      body.innerHTML=diffBox+'选择何时生效：<div class="pm-opts"><button class="pm-opt" data-act="pmopt"><b>马上执行</b><span>立即按新设定下注 · 只影响后续未执行部分</span></button><button class="pm-opt" data-act="pmopt"><b>下一期才套用</b><span>本期维持原设定，下期起按新设定执行</span></button></div>';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta dis" data-act="pmsavedone">确认</button>';
    }else if(kind==='freeze'){
      title.textContent='确认冻结'+(name||'王哥')+'？';
      body.innerHTML='<div class="pm-note2">冻结后，该成员将：<ul class="pm-ul"><li>无法下注或使用自动投</li><li>现有额度会保留</li><li>群主可随时解除冻结</li></ul>成员端将显示「请联系群主」。</div>';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta danger" data-act="pmfreezedone">确认冻结</button>';
    }else if(kind==='unfreeze'){
      title.textContent='解除冻结'+(name||'王哥')+'？';
      body.innerHTML='<div class="pm-note2">解除后，该成员可正常下注与使用自动投。</div>';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta" data-act="pmunfreezedone">确认解除</button>';
    }else if(kind==='rksave'){
      title.textContent='确认修改抽成设置？';
      body.innerHTML='<div class="pm-note2"><ul class="pm-ul"><li>修改后将于下一期开始生效</li><li>历史数据不会重新计算</li><li>成员无法查看此设置</li></ul></div>';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta" data-act="rkconfirm">确认保存</button>';
    }else if(kind==='rkleave'){
      title.textContent='尚未保存修改';
      body.innerHTML='离开后本次调整将不会保存。';
      btns.innerHTML='<button class="ghost" data-act="pmclose">继续编辑</button><button class="cta danger" data-act="rkdiscard">放弃修改</button>';
    }else if(kind==='approve'){
      title.textContent='确认通过？';
      body.innerHTML='确认通过 <b>'+name+'</b> 的'+details+'？<br>到账后立即可用。';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta" data-act="apconfirm">确认通过</button>';
    }else if(kind==='reject'){
      title.textContent='确认拒绝？';
      body.innerHTML='拒绝 <b>'+name+'</b> 的'+details+'。<textarea class="pm-reason" rows="2" placeholder="可选：填写原因（成员可见）"></textarea><small style="display:block;margin-top:7px;color:var(--muted)">成员会看到原因；更多详情请联系 Agent。</small>';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta danger" data-act="aprejectconfirm">确认拒绝</button>';
    }else if(kind==='uwhelp'){
      title.textContent='什么是上分 / 下分？';
      body.innerHTML='<b>上分</b>：把你与群主结算好的金额，转成场内可下注的额度（群主确认后到账）。<br><br><b>下分</b>：把额度换回，与群主结算取回。<br><br>两者同一时间各只能有一笔申请，通过后才能提交下一笔。';
      btns.innerHTML='<button class="cta" data-act="pmclose" style="flex:1">知道了</button>';
    }else if(kind==='withdraw'){
      title.textContent='确认提款？';
      body.innerHTML='申请提款 <b>'+details+' 额度</b>？<br>提交后由群主确认，进度可在「额度往来」查看。';
      btns.innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta" data-act="withdrawconfirm" data-amt="'+details+'">确认提款</button>';
    }
    m.classList.add('open');
  }
  function closePlanModal(){var m=root.querySelector('#planModal'); if(m){m.classList.remove('open');}}

  /* ── 自动投 · 计划仪表盘（L1）── */
  var coachDone=false, lastStopped=null, dashToastTimer=null, npSeq=0, pmDashId=null, approvalTarget=null;
  /* v0.6 · 紧凑行状态：筛选 / 排序 / 收起 / 挂靶 */
  var dashFilter='all', dashSortIdx=0, dashFold=false, dashActive=null, tsSeq=10;
  var DASH_SORTS=[{k:'group',label:'运行中优先 ⇅'},{k:'pnl',label:'盈亏 ↓'},{k:'ts',label:'最近更新 ↓'}];
  var TPL_TRIAL_SHEET=['两面 · 跟投','10 起 · 倍投最高 40','−100 自动停止','+100 自动停止','100 <small>/ 余额 400</small>'];
  /* 排版 DEMO 数据（临时 · 供客户预览四计划排版用，正式版连同 .demofab 一起删除） */
  var DEMO_PLANS=[
    {id:'p1',panel:'p1',name:'跟投 · 冠军大小',mode:'fo',pnl:120,streak:3,params:'倍投 2× · 止盈 +200 / 止损 −300',done:3,used:240,status:'run',ts:4,
     lastResult:{out:'大 ✓ 命中',pnl:40},
     sheet:['冠军 · 大/小（跟长龙）','10 起 · 倍投最高 160','−300 自动停止','+200 自动停止','300 <small>/ 余额 400</small>']},
    {id:'p2',panel:'p2',name:'固定 · 亚军单',mode:'fx',pnl:70,streak:0,params:'固定 20/期 · 止盈 +150 / 止损 −200',done:5,used:160,status:'run',ts:3,
     lastResult:{out:'单 ✗ 未中',pnl:-20},
     sheet:['亚军 · 单（固定）','20/期 · 不倍投','−200 自动停止','+150 自动停止','160 <small>/ 余额 400</small>']},
    {id:'p3',name:'小本试水',mode:'fo',fav:true,pnl:102,streak:0,params:'4 中 1 负 · 未用预算 25 已退回余额',specParams:'倍投 2×（上限3）· 止盈 +100 / 止损 −100',done:5,used:100,refund:25,status:'done',reason:'止盈 +100 达成 · 自动停止',ts:2,
     sheet:TPL_TRIAL_SHEET},
    {id:'p4',name:'反投 · 冠亚和大小',mode:'ag',pnl:-40,streak:0,params:'2 中 3 负 · 未用预算 60 已退回余额',specParams:'连开≥4 · 倍投 3× · 止盈 +200 / 止损 −300',done:5,refund:60,status:'loss',reason:'已到止损线 · 自动停止保护预算',ts:1}
  ];
  /* 初始 = 空态（首次进入引导）；DEMO 按钮可载入上面的四计划排版 */
  var dashPlans=[], demoOn=false, demoSaved=null;
  function planById(id){return dashPlans.filter(function(p){return p.id===id;})[0];}
  function fmtPnl(v){return v>0?'+'+v:(v<0?'−'+Math.abs(v):'0');}
  function pnlCls(v){return v>0?'win':(v<0?'lose':'zero');}
  function dashToastShow(msg,undo){
    var t=root.querySelector('#dashToast'); if(!t) return;
    t.innerHTML='<span>'+msg+'</span>'+(undo?'<span class="undo" data-act="dashundo">撤销</span>':'');
    t.classList.add('open');
    clearTimeout(dashToastTimer); dashToastTimer=setTimeout(function(){t.classList.remove('open');},4200);
  }
  /* v0.6 · 图标（分享 / 修改 / 收藏） */
  var SVG_SHARE='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>';
  var SVG_EDIT='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  var SVG_STAR='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.8 6.2 20.8l1.1-6.4L2.6 9.8l6.5-.9z"/></svg>';
  var SVG_STARF='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.8 6.2 20.8l1.1-6.4L2.6 9.8l6.5-.9z"/></svg>';
  /* 模式标签：跟投(蓝) / 反投(橙) / 固定(灰)，无 mode 字段时从计划名前缀解析 */
  function planMode(p){
    if(p.mode==='ag'||(!p.mode&&p.name.indexOf('反投')===0))return{c:'ag',t:'反投'};
    if(p.mode==='fx'||(!p.mode&&p.name.indexOf('固定')===0))return{c:'fx',t:'固定'};
    return{c:'fo',t:'跟投'};
  }
  function planDisp(p){return p.name.replace(/^(跟投|反投|固定)\s*·\s*/,'');}
  /* 进度：期数只累计（计划以止盈/止损/急停结束，无期数上限设置） */
  function planProg(p){
    var t='已投 '+(p.done||0)+' 期';
    if(p.status==='run'){if(p.used){t+=' · 占用 '+p.used;}}
    else if(p.reason){t+=' · '+p.reason;}
    return t;
  }
  /* 两行紧凑行：L1 = 状态点+模式+名称+连中+盈亏 · L2 = 进度+急停 · 点行展开完整参数 */
  function dashRowCard(p){
    var run=p.status==='run',md=planMode(p),active=dashActive===p.id;
    var dot=run?'<span class="pdot"></span>':(p.status==='done'?'<span class="pdot gold"></span>':'<span class="pdot off"></span>');
    var h='<div class="prow'+(run?' run':'')+(active?' active':'')+'" data-act="dashexpand" data-arg="'+p.id+'">';
    h+='<div class="l1">'+dot+'<span class="mtag '+md.c+'">'+md.t+'</span><span class="nm2">'+planDisp(p)+'</span>';
    if(run&&p.streak>=2){h+='<span class="mfire">🔥'+p.streak+'</span>';}
    if(p.fav){h+='<span class="pstar" title="已收藏">★</span>';}
    h+='<span class="ppnl2 '+pnlCls(p.pnl)+'">'+fmtPnl(p.pnl)+'</span></div>';
    h+='<div class="l2"><span>'+planProg(p)+'</span>'+(run?'<span class="stopmini" data-act="dashstop" data-arg="'+p.id+'">急停</span>':'')+'</div>';
    if(p.coach){h+='<div class="coachbox">急停在这里 —— 点「急停」立即停止下注，未用预算马上退回。点卡片可看每期明细。<br><span class="cok" data-act="coachok">知道了</span></div>';}
    h+='</div>';
    h+='<div class="pxpand">';
    if(run&&p.live){h+='<div class="plive" style="margin-top:0;margin-bottom:8px"><i></i>'+p.live+'</div>';}
    var info=run?('玩法：'+(p.params||'')):((p.params||'')+(p.specParams?'<br>原参数：'+p.specParams:''));
    h+='<div class="pxinfo">'+info+'</div>';
    h+='<div class="pxacts">';
    h+='<span class="icobtn" data-act="dashshare" data-arg="'+p.id+'" title="分享">'+SVG_SHARE+'</span>';
    h+='<span class="icobtn" data-act="dashedit" data-arg="'+p.id+'" title="修改">'+SVG_EDIT+'</span>';
    h+='<span class="icobtn'+(p.fav?' faved':'')+'" data-act="dashfav" data-arg="'+p.id+'" title="'+(p.fav?'已收藏 · 点击取消':'收藏为模板')+'">'+(p.fav?SVG_STARF:SVG_STAR)+'</span>';
    if(run){h+='<span class="go2" data-act="opendetail" data-arg="'+p.id+'">进入查看 ›</span>';}
    else{
      h+='<span class="go2" data-act="dashagain" data-arg="'+p.id+'">重启</span>';
      if(p.status!=='done'){h+='<span class="del2" data-act="dashdel" data-arg="'+p.id+'">删除</span>';}
    }
    h+='</div></div>';
    return h;
  }
  /* 近期动态流：期结果（每计划一行分段）/ 计划运行中 / 已完成，与计划行双向联动 */
  function dashFeed(){
    var items='';
    var res=dashPlans.filter(function(p){return p.lastResult;});
    if(res.length){
      var tot=0,rowsH='';
      res.forEach(function(p){
        var md=planMode(p);tot+=p.lastResult.pnl;
        rowsH+='<div class="rrow'+(dashActive===p.id?' hl':'')+'" data-act="dashexpand" data-arg="'+p.id+'"><span class="mtag '+md.c+'">'+md.t+'</span><span class="rnm">'+planDisp(p)+'</span><span class="rout">'+p.lastResult.out+'</span><span class="rp '+(p.lastResult.pnl<0?'lose':'win')+'">'+fmtPnl(p.lastResult.pnl)+'</span></div>';
      });
      var rel=res.some(function(p){return p.id===dashActive;});
      items+='<div class="msg'+(rel?' rel':'')+'" data-plan="'+res.map(function(p){return p.id;}).join(' ')+'"><div class="av bot">投</div><div class="botcard"><div class="bh">第 088 期结果</div>'+rowsH+'<div class="rsum"><span>本期 '+res.length+' 个计划</span><b class="'+(tot<0?'lose':'')+'">'+fmtPnl(tot)+'</b></div></div></div>';
    }
    var sp=dashPlans.filter(function(p){return p.status==='run'&&p.streak>=2;})[0];
    if(sp){
      var smd=planMode(sp);
      items+='<div class="msg'+(dashActive===sp.id?' rel':'')+'" data-plan="'+sp.id+'" data-act="dashexpand" data-arg="'+sp.id+'"><div class="av bot">投</div><div class="botcard"><div class="bh">⚙ 计划运行中<span class="mtag '+smd.c+'">'+smd.t+'</span>'+planDisp(sp)+'</div><div class="kv">冠军「大」连开 4 期 → 本期跟投 <b>大</b> 40（倍投后）· 已连中 '+sp.streak+' 期</div></div></div>';
    }
    dashPlans.filter(function(p){return p.status==='done';}).forEach(function(p){
      var dmd=planMode(p);
      items+='<div class="msg'+(dashActive===p.id?' rel':'')+'" data-plan="'+p.id+'" data-act="dashexpand" data-arg="'+p.id+'"><div class="av bot">投</div><div class="botcard ok-msg"><div class="bh">✓ 已完成<span class="mtag '+dmd.c+'">'+dmd.t+'</span>'+planDisp(p)+'</div><div class="kv">'+(p.reason||'')+(p.refund?' · 未用预算 '+p.refund+' 已退回':'')+'</div></div></div>';
    });
    if(!items)return '';
    return '<div class="feedhr">近期动态 · 全部计划</div><div class="dashfeed'+(dashActive?' feed-dim':'')+'" id="dashFeed">'+items+'</div>';
  }
  function renderDash(){
    var body=root.querySelector('#dashbody'); if(!body) return;
    var run=dashPlans.filter(function(p){return p.status==='run';});
    var ended=dashPlans.filter(function(p){return p.status!=='run';});
    var strip=root.querySelector('.autodash .bottom-streak');
    var h='';
    if(!dashPlans.length){
      h+='<div class="ehero"><img class="eart" src="shared/plan-hero.png" alt="" onerror="this.remove()"><h4>「自动投」让计划替你盯盘</h4><p><b>追长龙</b>不用手点，定好规则后逐期自动下注，</p><p><b>实时追踪，随时急停</b>。</p></div>';
      h+='<div class="esteps"><div class="estp"><span class="num">1</span><b>挑个打法</b><span>龙来了不错过</span></div><span class="sarr2">›</span><div class="estp"><span class="num">2</span><b>设好底线</b><span>止盈止损你说了算</span></div><span class="sarr2">›</span><div class="estp"><span class="num">3</span><b>交给计划</b><span>不盯盘也不漏一期</span></div></div>';
      h+='<div class="reccard"><div class="ribbon">新手推荐</div><div class="pch"><span class="rtag2">官方</span><b style="font-size:14px">小本试水</b></div>'
        +'<div class="psub">每期 10 · 倍投 2×（上限3）</div>'
        +'<div class="rsafe">亏到 −100 自动停 · 赚到 +100 自动停</div>'
        +'<div class="rusers"><span class="avs"><i style="background:#D6E4FF;color:#0B52CC">王</i><i style="background:#F7D9E2;color:#B03A5B">李</i><i style="background:#DDEFE0;color:#1FA971">陈</i></span><span class="ru"><b>128</b> 人用过 · 本周 <b>36</b> 人在用</span></div>'
        +'<div class="rbtns"><span class="rbtn-p" data-act="tplstart">使用</span></div></div>';
      h+='<div class="tplnew" data-act="customauto" style="margin:9px 0 0;">＋ 自定义新建计划</div>';
      if(strip){strip.style.display='none';}
    }else{
      var sumAll=0; dashPlans.forEach(function(p){sumAll+=p.pnl;});
      if(dashFold){
        /* 收起态：汇总条取代标题栏（数量只出现一次） */
        h+='<div class="sumline"><b>我的计划</b><span class="dsum">运行中 '+run.length+' · 累计盈亏 <em class="'+(sumAll<0?'lose':'')+'">'+fmtPnl(sumAll)+'</em></span><span class="foldbtn" data-act="dashfold">展开 ⌄</span><span class="dadd" data-act="newauto">＋</span></div>';
      }else{
        h+='<div class="dashbar"><b>我的计划</b><span class="dsum">累计盈亏 <em class="'+(sumAll<0?'lose':'')+'">'+fmtPnl(sumAll)+'</em></span>'
          +'<span class="foldbtn" data-act="dashfold">收起 ⌃</span>'
          +'<span class="dadd" data-act="newauto">＋</span></div>';
        /* 筛选/排序条：≥4 个计划才出现，避免轻用户噪音 */
        if(dashPlans.length>=4){
          var favN=dashPlans.filter(function(p){return p.fav;}).length;
          h+='<div class="planfbar">'
            +'<span class="fchip'+(dashFilter==='all'?' on':'')+'" data-act="dashfilter" data-f="all">全部 '+dashPlans.length+'</span>'
            +'<span class="fchip'+(dashFilter==='run'?' on':'')+'" data-act="dashfilter" data-f="run">运行中 '+run.length+'</span>'
            +'<span class="fchip'+(dashFilter==='end'?' on':'')+'" data-act="dashfilter" data-f="end">已结束 '+ended.length+'</span>'
            +(favN?'<span class="fchip'+(dashFilter==='fav'?' on':'')+'" data-act="dashfilter" data-f="fav">★ '+favN+'</span>':'')
            +'<span class="fsort" data-act="dashsort">'+DASH_SORTS[dashSortIdx].label+'</span></div>';
        }
        var fp=dashPlans.filter(function(p){
          return dashFilter==='all'||(dashFilter==='run'&&p.status==='run')||(dashFilter==='end'&&p.status!=='run')||(dashFilter==='fav'&&p.fav);
        });
        var sortMode=DASH_SORTS[dashSortIdx].k;
        if(sortMode==='group'){
          var fr=fp.filter(function(p){return p.status==='run';}),fe=fp.filter(function(p){return p.status!=='run';});
          h+='<div class="plangroup">';
          if(fr.length){h+='<div class="gsec2">运行中 · <b>'+fr.length+'</b></div>'+fr.map(dashRowCard).join('');}
          if(fe.length){h+='<div class="gsec2">已结束 · <b>'+fe.length+'</b></div>'+fe.map(dashRowCard).join('');}
          if(!fp.length){h+='<div class="gsec2">没有符合条件的计划</div>';}
          h+='</div>';
        }else{
          var sortKey=sortMode==='pnl'?'pnl':'ts';
          var sorted=fp.slice().sort(function(a,b){return (b[sortKey]||0)-(a[sortKey]||0);});
          h+='<div class="plangroup">'+(sorted.length?sorted.map(dashRowCard).join(''):'<div class="gsec2">没有符合条件的计划</div>')+'</div>';
        }
      }
      h+=dashFeed();
      if(strip){strip.style.display='';}
    }
    body.innerHTML=h;
    var fld=root.querySelector('.autodash .inputbar .field');
    if(fld){fld.textContent=dashPlans.length?'对助手说：改止盈 / 暂停 / 问进度…':'不会设？对助手说「帮我建个计划」';}
    syncTarget();
  }
  /* 挂靶同步：输入框上方定位条 + 占位文案 + 动态流高亮 */
  function syncTarget(){
    var tb=root.querySelector('#dashTarget'); if(!tb) return;
    var p=dashActive?planById(dashActive):null;
    if(!p){dashActive=null;tb.classList.remove('show');return;}
    var md=planMode(p);
    tb.querySelector('.tx').innerHTML='指令挂靶：<span class="mtag '+md.c+'">'+md.t+'</span> <b>'+planDisp(p)+'</b> —— 对助手说的话只作用于它';
    tb.classList.add('show');
    var fld=root.querySelector('.autodash .inputbar .field');
    if(fld){fld.textContent='对「'+md.t+' · '+planDisp(p)+'」说：改止盈 / 暂停…';}
  }
  function openDashHome(){
    var au=root.querySelector('.view-autos'); if(!au) return;
    var ad=au.querySelector('.autodash'),det=au.querySelector('.plandetail');
    if(ad){ad.classList.add('on');} if(det){det.classList.remove('on');}
  }
  /* ── 首次引导 Drawer（3 页）：每会话首次进入自动投时自动弹出一次 ── */
  var obSeen=false, obPage=1;
  function obGoto(n){
    obPage=Math.min(3,Math.max(1,n));
    root.querySelectorAll('#obDrawer .ob-page').forEach(function(p){p.classList.toggle('on',parseInt(p.getAttribute('data-ob'),10)===obPage);});
    root.querySelectorAll('#obDrawer .ob-dots').forEach(function(g){g.querySelectorAll('span').forEach(function(d,i){d.classList.toggle('on',i===obPage-1);});});
  }
  function openPlanDetail(pid){
    var au=root.querySelector('.view-autos'); if(!au) return;
    var ad=au.querySelector('.autodash'),det=au.querySelector('.plandetail');
    if(ad){ad.classList.remove('on');} if(det){det.classList.add('on');}
    au.querySelectorAll('.planpanel').forEach(function(pp){pp.classList.toggle('on',pp.getAttribute('data-plan')===pid);});
    var p=dashPlans.filter(function(x){return x.panel===pid;})[0];
    var t=au.querySelector('.dettitle'); if(t){t.textContent=p?p.name:'计划详情';}
  }
  function openStartSheet(name,rows,planId){
    var m=root.querySelector('#startModal'); if(!m) return;
    m.querySelector('.sm-h').textContent='启动「'+name+'」';
    var bs=m.querySelectorAll('.srow b');
    (rows||TPL_TRIAL_SHEET).forEach(function(r,i){if(bs[i]){bs[i].innerHTML=r;}});
    m.setAttribute('data-plan',planId||'');
    m.classList.add('open');
  }

  function stepValue(stepper,dir){
    var val=stepper.querySelector('.val'); if(!val) return;
    var raw0=val.textContent.trim();
    if(raw0.indexOf('%')>=0 && raw0.indexOf('.')>=0){
      var f=Math.max(0,(parseFloat(raw0)||0)+dir*0.0001);
      val.textContent=f.toFixed(4)+'%';
      return;
    }
    var raw=val.textContent.trim(),num=cleanNumber(raw);
    var suffix='';
    if(raw.indexOf('%')>=0){suffix='%';}
    else if(raw.indexOf('×')>=0){suffix='×';}
    else if(raw.indexOf('期')>=0){suffix=' 期';}
    else if(raw.indexOf('次')>=0){suffix=' 次';}
    var step=suffix?1:10;
    num=Math.max(0,num+(dir*step));
    if(suffix==='×'){num=Math.max(1,num);}
    val.textContent=(num===0)?('—'+(suffix?suffix:'')):(num+suffix);
    val.style.color=(num===0)?'var(--muted)':'';
  }
  function stepMoney(stepper,dir,sign){
    var val=stepper.querySelector('.val'); if(!val) return;
    var num=cleanNumber(val.textContent)+dir*10;
    num=Math.max(0,num);
    val.textContent=num===0?'—':sign+num;
    val.style.color=num===0?'var(--muted)':(sign==='+'?'var(--win)':'var(--red)');
  }

  document.addEventListener('click',function(e){
    var fi=e.target.closest('.finfo');
    if(fi){
      var host=fi.closest('.frow')||fi.closest('.sectit');
      var tl=host&&host.nextElementSibling;
      if(tl&&tl.classList.contains('tipline')){
        var willOpen=!tl.classList.contains('open');
        root.querySelectorAll('.tipline.open').forEach(function(x){x.classList.remove('open');});
        if(willOpen){tl.textContent=fi.getAttribute('data-tip');tl.classList.add('open');}
      }
      return;
    }
    var act=e.target.closest('[data-act]');
    if(act){
      var a=act.getAttribute('data-act'),arg=act.getAttribute('data-arg');
      if(a==='show'){if(arg==='member'&&act.classList.contains('mrow')){openMemberDetail(act);}showView(arg);}
      else if(a==='idcopy'){gToast('已复制成员 ID');}
      else if(a==='drawer'){var dw=root.querySelector('#drawer'); if(dw){dw.classList.add('open');}}
      else if(a==='drawerclose'){var dwc=root.querySelector('#drawer'); if(dwc){dwc.classList.remove('open');}}
      else if(a==='openbust'){var bdw=root.querySelector('#bqDrawer');if(bdw){bdw.classList.add('open');}}
      else if(a==='closebust'){closeBustModal();}
      else if(a==='game'){setGame(arg,act);}
      else if(a==='gameshow'){setGame(arg,null);showView('bet');}
      else if(a==='skin'){setSkin(arg,act);}
      else if(a==='market'){setMarket(arg,act);}
      else if(a==='menu'){var m=root.querySelector('.cmdmenu'); if(m){m.classList.toggle('open');}}
      else if(a==='results'){var rb=root.querySelector('.roundbar'); if(rb){rb.classList.toggle('show-results');}}
      else if(a==='streakpick'){openStreakDrawer(act.getAttribute('data-group'),act.getAttribute('data-pick'),act.getAttribute('data-label'),act.textContent.trim());}
      else if(a==='sdcancel'){closeStreakDrawer();}
      else if(a==='sdsubmit'){submitStreakDrawer();}
      else if(a==='sddir'){sdUpdateDir(arg);}
      else if(a==='sdpill'){sdUpdateAmt(sdPillVal(arg));}
      else if(a==='showlimitset'){openLimitSet();}
      else if(a==='lscancel'){closeLimitSet();}
      else if(a==='lssave'){saveLimitSet();}
      else if(a==='lsclear'){root.querySelectorAll('.limitset-modal .ls-in').forEach(function(i){i.value='';});}
      else if(a==='quickclose'){hideQuickSlip();}
      else if(a==='commands'){toggleCommands(act);}
      else if(a==='dashcmds'){
        var dc=root.querySelector('#dashCmd');
        if(dc){
          var dct=dc.querySelector('#dashCmdTitle');
          if(dct){var ap=dashActive?planById(dashActive):null;dct.textContent=ap?('怎么用指令 · 对「'+planDisp(ap)+'」'):'怎么用指令';}
          dc.classList.toggle('open');
        }
      }
      else if(a==='betfilter'){
        betRes=act.getAttribute('data-f');
        root.querySelectorAll('.view-bets .betres').forEach(function(c){c.classList.toggle('on',c===act);});
        applyBetFilter();
      }
      else if(a==='betsrc'){var _sp=root.querySelector('#betSrcPop'); if(_sp){var _o=_sp.classList.contains('open');root.querySelectorAll('.view-bets .dt-pop').forEach(function(x){x.classList.remove('open');});_sp.classList.toggle('open',!_o);}}
      else if(a==='betdt'){var _dp=root.querySelector('#betDtPop'); if(_dp){var _o2=_dp.classList.contains('open');root.querySelectorAll('.view-bets .dt-pop').forEach(function(x){x.classList.remove('open');});_dp.classList.toggle('open',!_o2);}}
      else if(a==='betsrcpick'){
        betSrc=act.getAttribute('data-v');
        var _sp2=root.querySelector('#betSrcPop'); if(_sp2){_sp2.querySelectorAll('span[data-act]').forEach(function(x){x.classList.toggle('on',x===act);});_sp2.classList.remove('open');}
        root.querySelectorAll('.view-bets .betsrc b').forEach(function(b){b.textContent=(betSrc==='all')?'来源':act.textContent;});
        applyBetFilter();
      }
      else if(a==='betdtpick'){
        var _dv=act.getAttribute('data-v'), _dp2=root.querySelector('#betDtPop');
        if(_dv==='custom'){ if(_dp2){_dp2.classList.remove('open');} var _bsh=root.querySelector('#betDtSheet'); if(_bsh){_bsh.classList.add('open');} return; }
        betDate=_dv;
        if(_dp2){_dp2.querySelectorAll('span[data-act]').forEach(function(x){x.classList.toggle('on',x===act);});_dp2.classList.remove('open');}
        root.querySelectorAll('.view-bets .betdt b').forEach(function(b){b.textContent=act.textContent;});
        updateBetSum();
      }
      else if(a==='betmore'){betShown+=BET_BATCH;renderSettled();}
      else if(a==='otxmore'){otxShown+=OTX_BATCH;renderOwnerTx();}
      else if(a==='lmore'){var lmL=act.getAttribute('data-list'); if(lmState[lmL]){lmState[lmL].shown+=lmState[lmL].batch;renderLM(lmL);}}
      else if(a==='betopensrc'){
        betOpenSrc=act.getAttribute('data-v');
        root.querySelectorAll('#betOpenSrc .betopensrc').forEach(function(c){c.classList.toggle('on',c===act);});
        applyBetFilter();
      }
      else if(a==='betdtclose'){var _bsc=root.querySelector('#betDtSheet'); if(_bsc){_bsc.classList.remove('open');}}
      else if(a==='betdtday'){
        var _bg=act.closest('.dt-grid'), _bd=parseInt(act.getAttribute('data-d'),10);
        var _bs0=_bg.getAttribute('data-start'), _be0=_bg.getAttribute('data-end');
        if(!_bs0||(_bs0&&_be0)){_bg.setAttribute('data-start',_bd);_bg.removeAttribute('data-end');}
        else{var _bsn=parseInt(_bs0,10); if(_bd<_bsn){_bg.setAttribute('data-start',_bd);}else{_bg.setAttribute('data-end',_bd);}}
        var _bst=parseInt(_bg.getAttribute('data-start'),10), _ben=_bg.getAttribute('data-end')?parseInt(_bg.getAttribute('data-end'),10):null;
        _bg.querySelectorAll('.dtd').forEach(function(c){var _d=parseInt(c.getAttribute('data-d'),10); c.classList.toggle('on',_d===_bst||(_ben!==null&&_d===_ben)); c.classList.toggle('mid',_ben!==null&&_d>_bst&&_d<_ben);});
        var _blb=root.querySelector('#betDtSelLabel'); if(_blb){_blb.textContent=_ben!==null?('7月'+_bst+'日 – 7月'+_ben+'日'):('7月'+_bst+'日 起，点选结束日期');}
      }
      else if(a==='betdtapply'){
        var _bgA=root.querySelector('#betDtSheet .dt-grid');
        var _bsA=_bgA&&_bgA.getAttribute('data-start'), _beA=_bgA&&_bgA.getAttribute('data-end');
        if(_bsA){ betDate='custom'; BET_DATE_SUM.custom={c:'410',a:'18,600',p:520}; var _lab=_beA?('7/'+_bsA+'–7/'+_beA):('7/'+_bsA+' 单日'); root.querySelectorAll('.view-bets .betdt b').forEach(function(b){b.textContent=_lab;}); root.querySelectorAll('#betDtPop span[data-act]').forEach(function(x){x.classList.remove('on');}); }
        var _bshA=root.querySelector('#betDtSheet'); if(_bshA){_bshA.classList.remove('open');}
        updateBetSum();
      }
      else if(a==='agenttab'){
        var ov=root.querySelector('.view-owner');
        if(ov){
          ov.querySelectorAll('.atab').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-arg')===arg);});
          ov.querySelectorAll('.apanel').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-ap')===arg);});
        }
      }
      else if(a==='mfilter'){
        act.parentNode.querySelectorAll('.fchip').forEach(function(c){c.classList.toggle('on',c===act);});
        var mf=act.getAttribute('data-f');
        root.querySelectorAll('.memroster .mrow').forEach(function(r){
          r.style.display=(mf==='all'||r.getAttribute('data-st')===mf)?'':'none';
        });
      }
      else if(a==='gotopending'){
        var ov2=root.querySelector('.view-owner');
        if(ov2){
          ov2.querySelectorAll('.atab').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-arg')==='ap');});
          ov2.querySelectorAll('.apanel').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-ap')==='ap');});
          ov2.querySelectorAll('.btab[data-scope="approve"]').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-arg')==='pending');});
          ov2.querySelectorAll('.btabpanel[data-scope="approve"]').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-btab')==='pending');});
        }
      }
      else if(a==='apok'||a==='apno'){
        approvalTarget=act.closest('.apcard,.apr-card');
        var an=act.getAttribute('data-nm')||'', ad=act.getAttribute('data-desc')||'申请';
        var detail=ad.replace(/^申请\s*/, '').replace(/·.*$/, '').trim();
        detail=(detail||'额度申请');
        openPlanModal(a==='apok'?'approve':'reject',an,detail);
      }
      else if(a==='apconfirm'||a==='aprejectconfirm'){
        if(approvalTarget){
          var isOk=a==='apconfirm', actions=approvalTarget.querySelector('.apc-btns'), guard=approvalTarget.querySelector('.apc-guard,.apr-guard');
          var reason=root.querySelector('#planModal .pm-reason');
          if(!isOk&&approvalTarget.getAttribute('data-reqr')==='1'&&!(reason&&reason.value.trim())){gToast('拒绝下分需填写原因（成员可见）');return;}
          if(actions){actions.outerHTML='<div class="apc-result'+(isOk?'':' no')+'">'+(isOk?'✓ 已通过':'已拒绝'+(reason&&reason.value.trim()?' · '+reason.value.trim():''))+'</div>';approvalTarget.classList.add('done');}
          var circles=approvalTarget.querySelectorAll('.apr-btn');
          if(circles.length){
            [].forEach.call(circles,function(c){c.remove();});
            var st=document.createElement('span');st.className='apr-state';st.textContent=isOk?'已通过':'已拒绝';
            approvalTarget.appendChild(st);
            approvalTarget.classList.add('done');
          }
          if(guard){guard.remove();}
          if(isOk){
            var dp=parseInt(approvalTarget.getAttribute('data-pool')||'0',10);
            var pn=root.querySelector('#apPoolNum');
            if(dp&&pn){var pv2=(parseInt(pn.getAttribute('data-v'),10)||0)+dp;pn.setAttribute('data-v',pv2);pn.textContent=pv2.toLocaleString()+'.00';}
          }
          gToast(isOk?'已通过，额度实时生效':'已拒绝'+(reason&&reason.value.trim()?' · 原因已显示给成员':'') );
        }
        approvalTarget=null;closePlanModal();
      }
      else if(a==='processed'){
        var pr=root.querySelector('#processedList');
        if(pr){pr.classList.toggle('open');var pb=act.querySelector('b');if(pb){pb.textContent=pr.classList.contains('open')?'收起⌃':'查看 ›';}}
      }
      else if(a==='withdrawask'){
        var wi=root.querySelector('.view-withdraw .withdraw-amt'),wa=cleanNumber(wi?wi.value:0);
        if(wa<=0){gToast('请输入提款额度');}
        else{openPlanModal('withdraw','',wa);}
      }
      else if(a==='withdrawconfirm'){
        var wamt=cleanNumber(act.getAttribute('data-amt'));
        closePlanModal();showView('wallet');gToast('提款申请已提交 · 通过后才能申请下一笔');
      }
      else if(a==='newchat'){gToast('发起新聊天 / 群组（示意）');}
      else if(a==='chatmembers'){gToast('共 28 位成员 · 成员列表原型待展开');}
      else if(a==='chatnotify'){
        var cnv=root.querySelector('#chatNotifyValue');if(cnv){var opts=['全部消息','仅提醒 @我','消息免打扰'],at=opts.indexOf(cnv.textContent);cnv.textContent=opts[(at+1)%opts.length];gToast('消息通知已设为「'+cnv.textContent+'」');}
      }
      else if(a==='chatreport'){gToast('举报入口已打开（原型示意）');}
      else if(a==='chatleave'){gToast('退出群聊为原型演示 · 当前未执行');}
      else if(a==='allocask'){gToast('分配额度输入弹窗（原型待补充）');}
      else if(a==='agtopup'){gToast('请通过第三方渠道充值，到账后额度自动更新（示意）');}
      else if(a==='aprok'||a==='aprno'){
        var apc=act.closest('.apr-card'); if(!apc)return;
        var apOk=a==='aprok', apNm=apc.getAttribute('data-nm')||'', apTyp=apc.getAttribute('data-typ')||'申请';
        gToast((apOk?'已通过':'已拒绝')+apNm+'的'+apTyp);
        if(apNm==='王志明'){
          var udir=apTyp.indexOf('上分')===0?'up':'down';
          uwPend[udir]=false; uwSync();
          if(apOk){
            var wAmt=parseAmt(apc.getAttribute('data-amt')||'0');
            if(wAmt){
              var uwfBox=root.querySelector('#pl-wallet-flow');
              if(uwfBox){
                var doneRow=document.createElement('div'),isUp=udir==='up';
                doneRow.className='bi tap';doneRow.setAttribute('data-act','txopen');doneRow.setAttribute('data-t',isUp?'credit':'withdraw');doneRow.setAttribute('data-days','0');doneRow.setAttribute('data-st','ok');doneRow.setAttribute('data-time','2026/07/07 14:32');
                doneRow.innerHTML='<div class="q"><b><span class="dtag">'+(isUp?'上分':'下分')+'</span>额度</b><span class="txtm">今天 14:32</span></div><div class="r"><b'+(isUp?' class="win"':'')+'>'+(isUp?'+':'−')+wAmt.toLocaleString()+'.00</b></div>';
                uwfBox.insertBefore(doneRow,uwfBox.firstChild);applyWF('pl-wallet-flow');
              }
              var wDelta=udir==='up'?wAmt:-wAmt;
              var uwA=root.querySelector('#uwAmt');
              if(uwA){
                var nv2=parseAmt(uwA.getAttribute('data-real'))+wDelta, real2=nv2.toLocaleString()+'.00';
                uwA.setAttribute('data-real',real2);
                if(uwA.textContent.indexOf('•')<0){uwA.textContent=real2;}
                var topBal=root.querySelector('.chrome .bal b'); if(topBal){topBal.textContent=real2;}
                root.querySelectorAll('.amount-entry__balance span').forEach(function(x){x.textContent='当前额度：'+real2;});
              }
              if(udir==='up'){
                var ros=root.querySelector('#pl-members');
                if(ros&&!ros.querySelector('[data-name="王志明"]')){
                  var mr=document.createElement('div'); mr.className='mrow tap';
                  mr.setAttribute('data-st','act');mr.setAttribute('data-bet','0');mr.setAttribute('data-credit',String(wAmt));mr.setAttribute('data-join','0');mr.setAttribute('data-name','王志明');
                  mr.setAttribute('data-act','show');mr.setAttribute('data-arg','member');
                  mr.innerHTML='<span class="av" style="background:#DCEBFF;color:#1F5FBF">王</span><div class="mtx"><b>王志明</b><span>尚未投注</span></div><span class="qt2">'+wAmt.toLocaleString()+'.00</span><i>›</i>';
                  ros.insertBefore(mr,ros.firstChild);
                  renderPage('pl-members');
                  var mc=root.querySelector('#memHomeCnt'); if(mc){mc.textContent=(parseInt(mc.textContent,10)||0)+1;}
                }
              }
            }
          }
        }
        if(apOk){
          var dpv=parseInt(apc.getAttribute('data-pool')||'0',10);
          var pnv=root.querySelector('#apPoolNum');
          if(dpv&&pnv){var nv=(parseInt(pnv.getAttribute('data-v'),10)||0)+dpv;pnv.setAttribute('data-v',nv);pnv.textContent=nv.toLocaleString()+'.00';}
        }
        apc.classList.add('leaving');
        setTimeout(function(){
          var pnl=apc.closest('.btabpanel');
          apc.remove();
          apHomeBump(-1);
          if(pnl){
            var left=pnl.querySelectorAll('.apr-card').length;
            var cntEl=root.querySelector('.fg-btabs .btab[data-arg="'+pnl.getAttribute('data-btab')+'"] .cnt');
            if(cntEl){cntEl.textContent=left; if(!left){cntEl.style.display='none';}}
            var srW=pnl.querySelector('.apr-sortrow .sw');
            var first=pnl.querySelector('.apr-card .apr-wait');
            if(srW){
              if(first){
                srW.textContent='最长'+first.textContent;
                srW.className='sw'+(first.classList.contains('w-red')?' w-red':(first.classList.contains('w-amber')?' w-amber':''));
              } else {
                var sr=pnl.querySelector('.apr-sortrow'); if(sr){sr.remove();}
                pnl.insertAdjacentHTML('beforeend','<div class="apr-empty">全部处理完毕</div>');
              }
            }
          }
        },230);
      }
      else if(a==='uwtpop'){var uwp=root.querySelector('#uwPop'); if(uwp){uwp.classList.toggle('open');}}
      else if(a==='uwtpick'){
        var up=root.querySelector('#uwPop');
        if(up){up.classList.remove('open');}
        if(act.getAttribute('data-v')==='custom'){
          dtOpenSheet('pl-wallet-flow');
          return;
        }
        if(up){up.querySelectorAll('span').forEach(function(x){x.classList.toggle('on',x===act);});}
        var utr=root.querySelector('.dt-trigger[data-list="pl-wallet-flow"] b'); if(utr){utr.textContent=act.textContent;}
        var udsS=root.querySelector('.wfdate[data-list="pl-wallet-flow"][data-edge="start"]');
        var udsE=root.querySelector('.wfdate[data-list="pl-wallet-flow"][data-edge="end"]');
        if(act.getAttribute('data-v')==='lm'){
          if(udsS){udsS.value='2026-06-01';} if(udsE){udsE.value='2026-06-30';}
        }else{
          if(udsS){udsS.value='';} if(udsE){udsE.value='';}
          var usel=root.querySelector('.wfsel[data-list="pl-wallet-flow"]'); if(usel){usel.value=act.getAttribute('data-v');}
        }
        applyWF('pl-wallet-flow');
      }
      else if(a==='mhtab'){
        act.parentNode.querySelectorAll('.fchip').forEach(function(c){c.classList.toggle('on',c===act);});
        var onT=root.querySelector('#mhPop .on'), tv2=onT?onT.getAttribute('data-v'):'m';
        mhApply(tv2==='all'?'all':(tv2==='m'?6:(parseInt(tv2,10)||0)));
      }
      else if(a==='mhpop'){var mhp=root.querySelector('#mhPop'); if(mhp){mhp.classList.toggle('open');}}
      else if(a==='mhpick'){
        var mp=root.querySelector('#mhPop');
        if(mp){mp.classList.remove('open');}
        if(act.getAttribute('data-v')==='custom'){
          dtOpenSheet('pl-member-hist');
          return;
        }
        if(mp){mp.querySelectorAll('span').forEach(function(x){x.classList.toggle('on',x===act);});}
        var mtr=root.querySelector('.dt-trigger[data-list="pl-member-hist"] b'); if(mtr){mtr.textContent=act.textContent;}
        if(act.getAttribute('data-v')==='lm'){
          var cntL=0;
          root.querySelectorAll('#pl-member-hist .bi').forEach(function(r){
            var ddL=parseInt(r.getAttribute('data-days'),10)||0;
            var okL=ddL>=7&&ddL<=36;
            r.classList.toggle('bfilter-hide',!okL); if(okL){cntL++;}
          });
          var meL=root.querySelector('#mhEmpty'); if(meL){meL.style.display=cntL?'none':'block';}
        }else{
          var mvP=act.getAttribute('data-v');
          mhApply(mvP==='all'?'all':(mvP==='m'?6:(parseInt(mvP,10)||0)));
        }
      }
      else if(a==='dtpop'){var dpp=root.querySelector('#dtPop'); if(dpp){dpp.classList.toggle('open');}}
      else if(a==='dtpick'){
        var dv=act.getAttribute('data-v'), lidP='pl-owner-tx';
        var popEl=root.querySelector('#dtPop');
        if(dv==='custom'){
          if(popEl){popEl.classList.remove('open');}
          dtOpenSheet('pl-owner-tx');
          return;
        }
        if(popEl){popEl.querySelectorAll('span').forEach(function(x){x.classList.toggle('on',x===act);});popEl.classList.remove('open');}
        var selP=root.querySelector('.wfsel[data-list="'+lidP+'"]');
        var dsP=root.querySelector('.wfdate[data-list="'+lidP+'"][data-edge="start"]'), deP=root.querySelector('.wfdate[data-list="'+lidP+'"][data-edge="end"]');
        if(dv==='lm'){ if(dsP){dsP.value='2026-06-01';} if(deP){deP.value='2026-06-30';} }
        else{ if(dsP){dsP.value='';} if(deP){deP.value='';} if(selP){selP.value=dv;} }
        var trP=root.querySelector('.dt-trigger[data-list="'+lidP+'"] b'); if(trP){trP.textContent=act.textContent;}
        applyWF(lidP);
      }
      else if(a==='sclr'){
        var box=act.closest('.psrch'), inp=box?box.querySelector('input'):null;
        if(inp){inp.value='';box.classList.remove('has');
          if(inp.getAttribute('data-list')){applyWF(inp.getAttribute('data-list'));}
          else{applyMem();}
        }
      }
      else if(a==='mtab'){
        act.parentNode.querySelectorAll('.btab').forEach(function(t){t.classList.toggle('on',t===act);});
        applyMem();
      }
      else if(a==='rkseg'){
        act.parentNode.querySelectorAll('div').forEach(function(x){x.classList.toggle('on',x===act);});
        rkRender();rkCtaSync();
      }
      else if(a==='rkp'){
        var ri2=root.querySelector('#rkRate');
        if(ri2){ri2.value=act.getAttribute('data-v');}
        var rowP=root.querySelector('#rkCustomRow'); if(rowP){rowP.style.display='none';}
        rkSyncChips();rkRender();rkCtaSync();
      }
      else if(a==='rkpcustom'){
        var rowC=root.querySelector('#rkCustomRow'); if(rowC){rowC.style.display='';}
        root.querySelectorAll('.rk-presets .rkp').forEach(function(c){c.classList.toggle('on',c===act);});
        var riC=root.querySelector('#rkRate'); if(riC){riC.focus();}
      }
      else if(a==='rksimopen'){
        rkRender();var rsim=root.querySelector('#rkSimSheet');if(rsim){rsim.classList.add('open');}
      }
      else if(a==='rksimclose'){
        var rsimC=root.querySelector('#rkSimSheet');if(rsimC){rsimC.classList.remove('open');}
      }
      else if(a==='rkreset'){rkRestore();gToast('已恢复当前生效设置');}
      else if(a==='rksave'){
        if(!rkDirty()){gToast('设置未变更');}
        else{openPlanModal('rksave');}
      }
      else if(a==='rkconfirm'){
        rkSaved=rkState();
        rkPresetMRU(rkSaved.rate);
        var rsh=root.querySelector('#rkRateShow'); if(rsh){rsh.textContent=rkSaved.rate.toFixed(4)+'%';}
        var rowS=root.querySelector('#rkCustomRow'), othS=root.querySelector('#rkpOther');
        if(rowS&&othS&&!othS.classList.contains('on')){rowS.style.display='none';}
        rkCtaSync();
        closePlanModal();gToast('已保存 · 自下一期开始生效');
      }
      else if(a==='rkback'){
        if(rkDirty()){openPlanModal('rkleave');}
        else{showView('owner');}
      }
      else if(a==='rkdiscard'){rkRestore();closePlanModal();showView('owner');}
      else if(a==='msopen'){var msp=root.querySelector('#msPop'); if(msp){msp.classList.toggle('open');}}
      else if(a==='mspick'){
        var mspp=root.querySelector('#msPop');
        if(mspp){mspp.querySelectorAll('span').forEach(function(x){x.classList.toggle('on',x===act);});mspp.classList.remove('open');}
        memSort=act.getAttribute('data-k')||'bet_asc';
        var mtr=root.querySelector('.view-members .dt-trigger b'); if(mtr){mtr.textContent=act.textContent;}
        applyMem();
      }
      else if(a==='dtopen'){var dsh=root.querySelector('#dtSheet'); if(dsh){dsh.classList.add('open');}}
      else if(a==='dtclose'){var dsc=root.querySelector('#dtSheet'); if(dsc){dsc.classList.remove('open');}}
      else if(a==='dtpreset'){
        root.querySelectorAll('#dtSheet .dtp').forEach(function(c){c.classList.toggle('on',c===act);});
        var dg0=root.querySelector('#dtSheet .dt-grid');
        if(dg0){dg0.removeAttribute('data-start');dg0.removeAttribute('data-end');dg0.querySelectorAll('.dtd').forEach(function(c){c.classList.remove('on','mid');});}
        var lb0=root.querySelector('#dtSelLabel'); if(lb0){lb0.textContent=act.textContent;}
      }
      else if(a==='dtymtoggle'){
        var pnl=root.querySelector('#dtYmPanel'), grd=root.querySelector('#dtGrid'), chT=root.querySelector('#dtSheet .dt-cal-h');
        if(pnl){var open0=pnl.style.display!=='none';
          pnl.style.display=open0?'none':'';
          if(grd){grd.style.display=open0?'':'none';}
          if(chT){chT.style.display=open0?'':'none';}
          if(!open0){dtYmSync();}
        }
      }
      else if(a==='dtymyr'){
        var yEl=root.querySelector('#dtYmYear');
        if(yEl){var yv=parseInt(yEl.textContent,10)+parseInt(act.getAttribute('data-d'),10);
          if(yv>2026){yv=2026;}
          yEl.textContent=yv;dtYmSync();}
      }
      else if(a==='dtympick'){
        var shY=root.querySelector('#dtSheet'), yEl2=root.querySelector('#dtYmYear');
        if(shY&&yEl2){
          shY.setAttribute('data-ym',yEl2.textContent+'-'+('0'+act.getAttribute('data-m')).slice(-2));
          var pnl2=root.querySelector('#dtYmPanel'), grd2=root.querySelector('#dtGrid');
          if(pnl2){pnl2.style.display='none';} if(grd2){grd2.style.display='';}
          dtRender();
        }
      }
      else if(a==='dtmon'){
        var shM=root.querySelector('#dtSheet'); if(!shM)return;
        var ym0=shM.getAttribute('data-ym')||'2026-07';
        var y0=parseInt(ym0.split('-')[0],10), m0=parseInt(ym0.split('-')[1],10)+parseInt(act.getAttribute('data-d'),10);
        while(m0<1){m0+=12;y0--;} while(m0>12){m0-=12;y0++;}
        if((y0+'-'+('0'+m0).slice(-2))>'2026-07'){y0=2026;m0=7;}
        shM.setAttribute('data-ym',y0+'-'+('0'+m0).slice(-2));
        dtRender();
      }
      else if(a==='dtday'){
        var shD2=root.querySelector('#dtSheet'), iso=act.getAttribute('data-date');
        var st0=shD2.getAttribute('data-start')||'', en0=shD2.getAttribute('data-end')||'';
        if(!st0||(st0&&en0)){shD2.setAttribute('data-start',iso);shD2.removeAttribute('data-end');}
        else{ if(iso<st0){shD2.setAttribute('data-start',iso);} else {shD2.setAttribute('data-end',iso);} }
        dtRender();
        var st1=shD2.getAttribute('data-start'), en1=shD2.getAttribute('data-end');
        function fmt(x){var p2=x.split('-');return parseInt(p2[1],10)+'月'+parseInt(p2[2],10)+'日';}
        var lb1=root.querySelector('#dtSelLabel'); if(lb1){lb1.textContent=en1?(fmt(st1)+' – '+fmt(en1)):(fmt(st1)+' 起，点选结束日期');}
      }
      else if(a==='dtapply'){
        var shD=root.querySelector('#dtSheet');
        /* 执行动态自定义日期：记标签、切非今天 → 无数据（图2）*/
        if(shD&&shD.getAttribute('data-list')==='stgfeeddate'){
          shD.classList.remove('open');
          if(window.__im168StgDate){window.__im168StgDate(shD.getAttribute('data-start'),shD.getAttribute('data-end'));}
          return;
        }
        var lidD=(shD&&shD.getAttribute('data-list'))||'pl-owner-tx';
        var selD=root.querySelector('.wfsel[data-list="'+lidD+'"]');
        var dsD=root.querySelector('.wfdate[data-list="'+lidD+'"][data-edge="start"]'), deD=root.querySelector('.wfdate[data-list="'+lidD+'"][data-edge="end"]');
        var trig=root.querySelector('.dt-trigger[data-list="'+lidD+'"] b');
        var stA=shD&&shD.getAttribute('data-start'), enA=shD&&shD.getAttribute('data-end');
        if(stA){
          var eA=enA||stA;
          function fmtD(x){var p3=x.split('-');return parseInt(p3[1],10)+'月'+parseInt(p3[2],10)+'日';}
          var lblTxt=fmtD(stA)+'–'+fmtD(eA);
          if(lidD==='pl-member-hist'){
            var baseD=new Date(DT_BASE+'T00:00:00');
            var dS=Math.round((baseD-new Date(eA+'T00:00:00'))/86400000);
            var dE=Math.round((baseD-new Date(stA+'T00:00:00'))/86400000);
            var cnt2=0;
            root.querySelectorAll('#pl-member-hist .bi').forEach(function(r){
              var dd2=parseInt(r.getAttribute('data-days'),10)||0;
              var ok2=dd2>=Math.max(0,dS)&&dd2<=Math.max(0,dE);
              r.classList.toggle('bfilter-hide',!ok2); if(ok2){cnt2++;}
            });
            var me2=root.querySelector('#mhEmpty'); if(me2){me2.style.display=cnt2?'none':'block';}
            if(trig){trig.textContent=lblTxt;}
            var popM=root.querySelector('#mhPop'); if(popM){popM.querySelectorAll('span').forEach(function(x){x.classList.remove('on');});}
            shD.classList.remove('open');
            return;
          }
          if(dsD){dsD.value=stA;}
          if(deD){deD.value=eA;}
          if(trig){trig.textContent=lblTxt;}
        }else{
          var onp=root.querySelector('#dtSheet .dtp.on');
          if(dsD){dsD.value='';} if(deD){deD.value='';}
          if(selD&&onp){selD.value=onp.getAttribute('data-v');}
          if(trig&&onp){trig.textContent=onp.textContent;}
        }
        var popQ=root.querySelector('#dtPop'); if(popQ){popQ.querySelectorAll('span').forEach(function(x){x.classList.remove('on');});}
        applyWF(lidD);
        var dsq=root.querySelector('#dtSheet'); if(dsq){dsq.classList.remove('open');}
      }
      else if(a==='mdcopy'){gToast('已复制成员 ID');}
      else if(a==='medavatar'){gToast('更换头像（原型待补充）');}
      else if(a==='mdreport'){var rps=root.querySelector('#rpSheet'); if(rps){rps.classList.add('open');}}
      else if(a==='rpclose'){var rpc=root.querySelector('#rpSheet'); if(rpc){rpc.classList.remove('open');}}
      else if(a==='rpdone'){var rpd=root.querySelector('#rpSheet'); if(rpd){rpd.classList.remove('open');} gToast('已提交举报 · 平台将尽快审核');}
      else if(a==='medsave'){showView('member');gToast('已保存成员资料');}
      else if(a==='freezeask'){
        var frozen=!!root.querySelector('.view-member .md-name .stchip.fz');
        var fzs=root.querySelector('#fzSheet'),h2=root.querySelector('#fzH2'),ft=fzs&&fzs.querySelector('.fz-title'),fg=fzs&&fzs.querySelector('.fz-go'),fb=fzs&&fzs.querySelector('.fz-body'),fnw=fzs&&fzs.querySelector('#fzNoteWrap'),fnt=fzs&&fzs.querySelector('#fzNote');
        if(h2){h2.textContent=(frozen?'恢复游戏权限':'停用游戏权限')+' - '+mdCurName+'？';}
        if(ft){ft.textContent=(frozen?'恢复游戏权限':'停用游戏权限')+' - '+mdCurName;}
        if(fg){fg.textContent=frozen?'确认恢复':'确认停用';fg.classList.toggle('danger',!frozen);}
        if(fb){fb.innerHTML=frozen?'恢复后，该成员可正常下注、使用自动投与申请额度。':'停用后，该成员将无法：<ul><li>下注或使用自动投</li><li>申请额度</li></ul>已下注单照常开奖结算，现有额度会保留，您可随时恢复。';}
        if(fnw){fnw.style.display=frozen?'none':'';}if(fnt){fnt.value='';}
        if(fzs){fzs.setAttribute('data-mode',frozen?'un':'fz');fzs.classList.add('open');}
      }
      else if(a==='fzclose'){var fzc=root.querySelector('#fzSheet'); if(fzc){fzc.classList.remove('open');}}
      else if(a==='fzdone'){
        var fzs2=root.querySelector('#fzSheet'), un=fzs2&&fzs2.getAttribute('data-mode')==='un';
        mdSetFrozen(!un);
        var rr=root.querySelector('.memroster .mrow[data-name="'+mdCurName+'"]');
        if(rr){rr.setAttribute('data-st',un?'act':'fz');var rb=rr.querySelector('.mtx b'),rc=rb&&rb.querySelector('.stchip');if(un){if(rc){rc.remove();}}else if(rb&&!rc){var ne=document.createElement('em');ne.className='stchip fz';ne.textContent='已停用';rb.appendChild(ne);}}
        if(fzs2){fzs2.classList.remove('open');}
        gToast(un?'已恢复「'+mdCurName+'」的游戏权限':'已停用「'+mdCurName+'」的游戏权限 · 他端将显示「请联系群主」');
      }
      else if(a==='invite'){gToast('邀请链接已复制，发给玩家即可加入');}
      else if(a==='wff'){
        act.parentNode.querySelectorAll('.fchip').forEach(function(c){c.classList.toggle('on',c===act);});
        applyWF(act.getAttribute('data-list'));
      }
      else if(a==='wfapply'){
        var wl2=act.getAttribute('data-list');
        var inp=root.querySelector('.wf-custom[data-list="'+wl2+'"] .wfdays');
        var sel2=root.querySelector('.wfsel[data-list="'+wl2+'"]');
        if(sel2){sel2.setAttribute('data-custom',Math.max(0,parseInt(inp&&inp.value||'0',10)||0));}
        applyWF(wl2);
      }
      else if(a==='srchtoggle'){var sb=act.closest('.srchbox'); if(sb){sb.classList.toggle('open'); var si=sb.querySelector('.srch-in'); if(sb.classList.contains('open')&&si){si.focus();}} }
      else if(a==='uweye'){
        var ua=root.querySelector('#uwAmt');
        if(ua){var hid=ua.textContent.indexOf('•')>=0; ua.textContent=hid?(ua.getAttribute('data-real')||'240'):'•••••';}
      }
      else if(a==='ageye'){
        var ga=root.querySelector('#agentAmt');
        if(ga){var ghid=ga.textContent.indexOf('•')>=0; ga.textContent=ghid?(ga.getAttribute('data-real')||'0.00'):'•••••••';}
      }
      else if(a==='agrefresh'){ownerRefresh();}
      else if(a==='apcust'){
        var vw=act.closest('.view'); var ip=vw?vw.querySelector('.amtin,.withdraw-amt'):null;
        if(ip){ip.focus();ip.select&&ip.select();}
      }
      else if(a==='apclr'){
        var vwc=act.closest('.view'); var ipc=vwc?vwc.querySelector('.amtin,.withdraw-amt'):null;
        if(ipc){ipc.value='';vwc.querySelectorAll('.amtchip').forEach(function(c){c.classList.remove('on');});}
      }
      else if(a==='apmax'){
        var vw=act.closest('.view'); var ip=vw?vw.querySelector('.amtin,.withdraw-amt'):null;
        if(ip){ip.value=fmtAmt(240000); if(vw){vw.querySelectorAll('.amtchip').forEach(function(c){c.classList.toggle('on',c===act);});}}
      }
      else if(a==='npk'){
        var vw=act.closest('.view'); var ip=vw?vw.querySelector('.amtin,.withdraw-amt'):null;
        if(ip){
          var k=act.getAttribute('data-k'), cur=String(parseAmt(ip.value)||'');
          if(k==='del'){cur=cur.slice(0,-1);}else{cur=(cur+k).replace(/^0+(?=\d)/,'');}
          ip.value=fmtAmt(parseInt(cur,10)||0);
          vw.querySelectorAll('.amtchip').forEach(function(c){c.classList.toggle('on',c.getAttribute('data-v')===cur);});
        }
      }
      else if(a==='contactag'){gToast('已为你打开与代理的对话（示意）');}
      else if(a==='apnext'){
        var dir=act.getAttribute('data-dir'),vw2=act.closest('.view');
        var ip2=vw2.querySelector('.amtin,.withdraw-amt');
        var v2=parseAmt(ip2?ip2.value:0);
        if(v2<=0){gToast('请输入金额');return;}
        apDir=dir;
        var sign=dir==='up'?'+':'−';
        var uwA0=root.querySelector('#uwAmt');
        var cur=uwA0?parseAmt(uwA0.getAttribute('data-real')):240000, after=dir==='up'?cur+v2:cur-v2;
        if(dir==='down'&&v2>cur){gToast('超出当前额度');return;}
        root.querySelector('#acTitle').textContent=dir==='up'?'上分申请确认':'下分申请确认';
        var acC=root.querySelector('#acCur'); if(acC){acC.textContent=cur.toLocaleString()+'.00';}
        var acA=root.querySelector('#acAmt');acA.textContent=sign+v2.toLocaleString()+'.00';acA.className=dir==='up'?'':'dk';
        root.querySelector('#acApply').textContent=sign+v2.toLocaleString()+'.00';
        root.querySelector('#acAfter').textContent=after.toLocaleString()+'.00';
        var acIdEl=root.querySelector('#acId');
        if(acIdEl){acIdEl.childNodes[0].textContent=(dir==='up'?'UP':'WD')+'2026070714'+('000'+v2).slice(-4);}
        apAmt=v2;
        root.querySelector('#apConfirm').classList.add('open');
      }
      else if(a==='apclose'){root.querySelector('#apConfirm').classList.remove('open');}
      else if(a==='apsubmit'){
        root.querySelector('#apConfirm').classList.remove('open');
        if(apDir==='up'){uwPend.up=true;
          var put=root.querySelector('#uwPendUpTxt'); if(put){put.textContent='+'+apAmt.toLocaleString()+'.00';}
          var pum=root.querySelector('#uwPendUpTime'); if(pum){pum.textContent='今天 14:32';}
        }else{uwPend.down=true;
          var pdt=root.querySelector('#uwPendDnTxt'); if(pdt){pdt.textContent='−'+apAmt.toLocaleString()+'.00';}
          var pdm=root.querySelector('#uwPendDnTime'); if(pdm){pdm.textContent='今天 14:32';}
        }
        var apnl=root.querySelector('.btabpanel[data-btab="'+(apDir==='up'?'apup':'apdown')+'"][data-scope="apv"]');
        if(apnl){
          var apEm=apnl.querySelector('.apr-empty'); if(apEm){apEm.remove();}
          var apCard=document.createElement('div'); apCard.className='apr-card';
          apCard.setAttribute('data-pool',String(apDir==='up'?-apAmt:apAmt));
          apCard.setAttribute('data-nm','王志明');
          apCard.setAttribute('data-typ',apDir==='up'?'上分申请':'下分申请');
          apCard.setAttribute('data-amt',String(apAmt));
          apCard.innerHTML='<div class="apr-r1"><span class="av" style="background:#DCEBFF;color:#1F5FBF">王</span><span class="apr-who"><b>王志明</b><span class="apr-wait">今天 14:32</span></span><em class="amt">'+apAmt.toLocaleString()+'.00</em></div><div class="apc-btns"><span class="abtn stop" data-act="aprno">拒绝</span><span class="abtn pri2" data-act="aprok">通过</span></div>';
          apnl.insertBefore(apCard,apnl.firstChild);
          var apCt=root.querySelector('.fg-btabs .btab[data-arg="'+(apDir==='up'?'apup':'apdown')+'"] .cnt');
          if(apCt){apCt.textContent=apnl.querySelectorAll('.apr-card').length; apCt.style.display='';}
          apHomeBump(1);
        }
        uwSync();
        showView('wallet');
        gToast((apDir==='up'?'上分':'下分')+'申请已提交 · 通过后才能申请下一笔');
      }
      else if(a==='uwhelp'){var uh=root.querySelector('#uwHelp'); if(uh){uh.classList.add('open');}}
      else if(a==='uwhelpclose'){var uh2=root.querySelector('#uwHelp'); if(uh2){uh2.classList.remove('open');}}
      else if(a==='uplocked'){gToast('已有一笔上分待审核 · 通过后才能再次申请');}
      else if(a==='dnlocked'){gToast('已有一笔下分待审核 · 通过后才能再次申请');}
      else if(a==='txopen'){
        var tq=act.querySelector('.q'),tr=act.querySelector('.r');
        if(tq&&tr){
          var tv2=act.closest('.view');
          txBack=tv2?tv2.className.replace('view view-','').split(' ')[0]:'wallet';
          var tb=tq.querySelector('b'),ttl='';
          if(tb){var tbc=tb.cloneNode(true);var tbg=tbc.querySelector('.stag,.rtag,.rst,.txst');if(tbg){tbg.remove();}ttl=tbc.textContent.trim();}
          /* Option C：完整时间戳存 data-time；状态存 data-st（无则回退旧结构：.q span 为时间、.stag 为状态）*/
          var tim=act.getAttribute('data-time')||((tq.querySelector('.txtm')||tq.querySelector('span:last-of-type')||{}).textContent||'');
          var ab=tr.querySelector('b'),amt=ab?ab.textContent:tr.textContent.trim();
          var dst=act.getAttribute('data-st');
          var stEl=act.querySelector('.stag,.rtag,.rst');
          var stCls=dst?dst:(stEl?(stEl.classList.contains('pd')?'pd':(stEl.classList.contains('no')?'no':'ok')):'ok');
          var stTxt=dst?({pd:'待审核',ok:'已完成',no:'已拒绝'}[dst]||'已完成'):(stEl?stEl.textContent:'已完成');
          var tdg=tb?tb.querySelector('.dtag'):null;
          var typTxt=tdg?tdg.textContent.trim():'', objTxt=typTxt?ttl.replace(typTxt,'').trim():ttl;
          if(!objTxt){objTxt='额度';}
          var NID={'王哥':'88213','吴先生':'88201','杨姐':'88205','孙姐':'88208','周先生':'88210','刘姐':'88202','陈生':'88204','李姐':'88206','林仔':'88209','王志明':'88220'};
          if(NID[objTxt]){objTxt+=' (ID '+NID[objTxt]+')';}
          var tty=root.querySelector('#tdType');
          if(typTxt){tty.innerHTML='<span class="dtag">'+typTxt+'</span>';}
          else{tty.textContent=ttl;}
          var tobj=root.querySelector('#tdObj'); if(tobj){tobj.textContent=objTxt;}
          var ta=root.querySelector('#tdAmt');ta.textContent=amt;
          ta.className='txd-amt '+(stCls==='pd'?'pdc':(amt.indexOf('−')>=0?'':'win'));
          var ts=root.querySelector('#tdSt');ts.textContent=stTxt;ts.className=(stCls==='ok')?'':('txst '+stCls);
          root.querySelector('#tdTime').textContent=tim.replace(/\//g,'-');
          var digits=(tim.match(/\d+/g)||[]).join('');
          root.querySelector('#tdId').childNodes[0].textContent='TX'+(digits||'20260707');
          var tnote=act.getAttribute('data-note');
          root.querySelector('#tdNote').textContent=(stCls==='no')?(tnote||'资料不符，已原额退回'):'—';
          root.querySelector('#txDrawer').classList.add('open');
        }
      }
      else if(a==='txclose'){var td=root.querySelector('#txDrawer'); if(td){td.classList.remove('open');}}
      else if(a==='txcopy'){gToast('交易编号已复制');}
      else if(a==='uwdemo'){
        uwPend.up=false;uwPend.down=false;uwSync();
        gToast('演示：群主已通过全部申请 · 可重新申请');
      }
      else if(a==='lfilter'){
        var lfv=act.getAttribute('data-f'),ltid=act.getAttribute('data-target');
        act.parentNode.querySelectorAll('.fchip').forEach(function(c){c.classList.toggle('on',c===act);});
        var lpl=root.querySelector('#'+ltid),lpg=root.querySelector('.pager[data-target="'+ltid+'"]');
        if(lpl){
          if(lfv==='all'){
            [].forEach.call(lpl.children,function(bi){bi.classList.remove('bfilter-hide');});
            renderPage(ltid);
          }else{
            [].forEach.call(lpl.children,function(bi){bi.classList.remove('plitem-hide');bi.classList.toggle('bfilter-hide',bi.getAttribute('data-t')!==lfv);});
            if(lpg){lpg.style.display='none';}
          }
        }
      }
      else if(a==='planhist'){togglePlanHist(act);}
      else if(a==='planask'){var card=act.closest('.autocard'),nm=card?card.querySelector('.ach b').textContent.trim():''; pmDashId=null; openPlanModal(act.getAttribute('data-kind'),nm);}
      else if(a==='pmopt'){var m=root.querySelector('#planModal'); if(m){m.querySelectorAll('.pm-opt').forEach(function(o){o.classList.toggle('sel',o===act);});var ok=m.querySelector('.pm-btns .cta'); if(ok){ok.classList.remove('dis');}} return;}
      else if(a==='pmclose'){pmDashId=null;closePlanModal();}
      else if(a==='saveplan'){
        var fv=root.querySelector('.view-formula');
        if(fv&&fv.classList.contains('creating')){showView('autos');}
        else{openPlanModal('savechange',null,diffFormula(formulaSnap));}
      }
      else if(a==='pmsavedone'){
        var selOpt=root.querySelector('#planModal .pm-opt.sel b');
        var when=selOpt?selOpt.textContent.trim():'下一期才套用';
        closePlanModal();showView('autos');
        dashToastShow('✅ 修改已保存 · '+(when==='马上执行'?'立即生效（仅影响后续下注）':'下期起生效'));
      }
      else if(a==='pgnav'){
        var pl=root.querySelector('#'+act.getAttribute('data-target'));
        if(pl){
          var size=parseInt(pl.getAttribute('data-size'),10)||5;
          var maxPage=Math.max(1,Math.ceil(pl.children.length/size));
          var page=parseInt(pl.getAttribute('data-page'),10)||1;
          page+=(act.getAttribute('data-dir')==='next'?1:-1);
          page=Math.min(Math.max(1,page),maxPage);
          pl.setAttribute('data-page',page);
          renderPage(pl.id);
        }
      }
      else if(a==='cmdpick'){putCmd(arg,act);}
      else if(a==='put'){putCmd(arg,act);}
      else if(a==='plan'){showView('autos');openPlanDetail(arg);}
      else if(a==='autohome'){openDashHome();}
      else if(a==='dashdemo'){
        if(!demoOn){demoSaved=dashPlans;dashPlans=DEMO_PLANS.map(function(p){var c={};for(var k in p){c[k]=p[k];}return c;});demoOn=true;dashToastShow('排版演示 · 已载入 4 个计划，再点 DEMO 退出');}
        else{dashPlans=demoSaved||[];demoSaved=null;demoOn=false;dashToastShow('已退出排版演示');}
        dashActive=null;dashFilter='all';dashFold=false;dashSortIdx=0;
        act.classList.toggle('on',demoOn);
        renderDash();
      }
      else if(a==='opendetail'){var dp=planById(arg); if(dp&&dp.panel){showView('autos');openPlanDetail(dp.panel);} else {var df2=root.querySelector('.view-formula'); if(df2){df2.classList.remove('creating');} showView('formula');}}
      else if(a==='dashstop'){var sp=planById(arg); if(sp&&sp.status==='run'){pmDashId=arg;openPlanModal('stop',sp.name);}}
      else if(a==='pmstopok'){
        var sp2=pmDashId?planById(pmDashId):null;
        if(sp2&&sp2.status==='run'){
          sp2.status='stopped';sp2.reason='手动急停 · 本期未执行的下注已取消';sp2.coach=false;sp2.ts=++tsSeq;lastStopped=sp2.id;
          if(dashActive===sp2.id){dashActive=null;}
          renderDash();dashToastShow('已急停「'+sp2.name+'」，未用预算已退回',true);
        }
        pmDashId=null;closePlanModal();
      }
      else if(a==='dashexpand'){dashActive=(dashActive===arg?null:arg);renderDash();}
      else if(a==='targetoff'){dashActive=null;renderDash();}
      else if(a==='dashfold'){dashFold=!dashFold;dashActive=null;renderDash();}
      else if(a==='dashfilter'){dashFilter=act.getAttribute('data-f');dashActive=null;renderDash();}
      else if(a==='dashsort'){dashSortIdx=(dashSortIdx+1)%DASH_SORTS.length;renderDash();}
      else if(a==='dashfav'){var fvp=planById(arg); if(fvp){fvp.fav=!fvp.fav;renderDash();dashToastShow(fvp.fav?'已收藏为模板 · 可从「★ 收藏」快速重启':'已取消收藏');}}
      else if(a==='dashundo'){var up=planById(lastStopped); if(up){up.status='run';up.reason='';renderDash();} var tt=root.querySelector('#dashToast'); if(tt){tt.classList.remove('open');}}
      else if(a==='dashshare'){var shp=planById(arg); if(shp){dashToastShow('已分享到聊天室 · 只公开玩法，不显示金额'); var cs=root.querySelector('.view-chat .scroll'); if(cs){var bm=document.createElement('div');bm.className='betmsg';bm.innerHTML='<div class="row1"><span class="tag">分享</span><b>你 · '+shp.name+'</b></div><div class="row2">公开了玩法（金额不显示）· 本期 089</div>';cs.appendChild(bm);}}}
      else if(a==='dashedit'){var de=root.querySelector('.view-formula'); if(de){de.classList.remove('creating');} showView('formula'); formulaSnap=snapFormula();}
      else if(a==='dashagain'){
        var ap=planById(arg);
        if(ap){
          pmDashId=arg;
          var apLose=ap.pnl<0;
          var apCtx='上回合：已投 '+(ap.done||0)+' 期'+(ap.reason?' · '+ap.reason:'')+' · 盈亏 <b class="'+(apLose?'lose':'win')+'">'+fmtPnl(ap.pnl)+'</b>'
            +(apLose?'<br><i>选「继续上一回合」，该亏损将延续计入统计</i>':'');
          openPlanModal('restart2',ap.name,{ctx:apCtx,def:ap.status==='done'?'fresh':'resume'});
        }
      }
      else if(a==='pmrestartok'){
        var rp2=pmDashId?planById(pmDashId):null;
        var selo=root.querySelector('#planModal .pm-opt.sel');
        var optK=selo?selo.getAttribute('data-opt'):'resume';
        pmDashId=null;closePlanModal();
        if(rp2){
          if(optK==='fresh'){openStartSheet(rp2.name,rp2.sheet,rp2.id);}
          else{
            rp2.status='run';rp2.reason='';rp2.refund=null;rp2.ts=++tsSeq;
            rp2.live='已恢复 · 下期起继续按原设定投注';
            renderDash();dashToastShow('已重启「'+rp2.name+'」 · 继续上一回合，盈亏统计延续');
          }
        }
      }
      else if(a==='dashdel'){pmDashId=arg;var delp=planById(arg);openPlanModal('delete',delp?delp.name:'');var okb=root.querySelector('#planModal .cta.danger');if(okb){okb.setAttribute('data-act','pmconfirm');}}
      else if(a==='pmconfirm'){if(pmDashId){dashPlans=dashPlans.filter(function(p){return p.id!==pmDashId;});pmDashId=null;renderDash();dashToastShow('已删除计划');}closePlanModal();}
      else if(a==='tplstart'){openStartSheet('小本试水',TPL_TRIAL_SHEET,'');}
      else if(a==='tplcancel'){var smm=root.querySelector('#startModal'); if(smm){smm.classList.remove('open');}}
      else if(a==='tpladjust'){
        var sma=root.querySelector('#startModal'); if(sma){sma.classList.remove('open');}
        var fva=root.querySelector('.view-formula'); if(fva){fva.classList.add('creating');}
        showView('formula');
        prefillFormulaFromStart();
        formulaSnap=snapFormula();
        gToast('已带入当前参数，改好后可启动或保存');
      }
      else if(a==='tplconfirm'){
        var sm2=root.querySelector('#startModal'),tpid=sm2?sm2.getAttribute('data-plan'):'';
        if(sm2){sm2.classList.remove('open');}
        var np=null;
        if(tpid){np=planById(tpid); if(np){np.status='run';np.pnl=0;np.done=1;np.reason='';np.refund=null;np.streak=0;np.ts=++tsSeq;if(np.specParams){np.params=np.specParams;}np.live='本期 00090 · 已投 10 · 待开奖';}}
        else{np={id:'np'+(++npSeq),name:'小本试水',mode:'fo',pnl:0,streak:0,params:'倍投 2×（上限3）· 止盈 +100 / 止损 −100',done:1,used:100,status:'run',ts:++tsSeq,live:'本期 00090 · 已投 冠军·大 10 · 待开奖',sheet:TPL_TRIAL_SHEET};dashPlans.unshift(np);}
        if(np&&!coachDone){np.coach=true;}
        renderDash();
      }
      else if(a==='coachok'){coachDone=true;dashPlans.forEach(function(p){p.coach=false;});renderDash();}
      else if(a==='follow'){act.textContent='已跟单 ✓';act.classList.add('done');}
      else if(a==='newauto'){var nfa=root.querySelector('.view-formula'); if(nfa){nfa.classList.add('creating');} showView('formula');}
      else if(a==='tplclose'){var tmc=root.querySelector('#tplModal'); if(tmc){tmc.classList.remove('open');}}
      else if(a==='guideopen'){var gm=root.querySelector('#guideModal'); if(gm){gm.classList.add('open');}}
      else if(a==='guideclose'){var gmc=root.querySelector('#guideModal'); if(gmc){gmc.classList.remove('open');}}
      else if(a==='obnext'){obGoto(obPage+1);}
      else if(a==='obprev'){obGoto(obPage-1);}
      else if(a==='obclose'){var obd=root.querySelector('#obDrawer'); if(obd){obd.classList.remove('open');}}
      else if(a==='customauto'){var tmx=root.querySelector('#tplModal'); if(tmx){tmx.classList.remove('open');} var nf=root.querySelector('.view-formula'); if(nf){nf.classList.add('creating');} showView('formula');}
      else if(a==='detailauto'){var df=root.querySelector('.view-formula'); if(df){df.classList.remove('creating');} showView('formula'); formulaSnap=snapFormula();}
      else if(a==='clear'){root.querySelectorAll('.view-bet .list .sel').forEach(function(x){x.classList.remove('sel');});root.querySelectorAll('.view-bet [data-act="streakpick"].picked').forEach(function(c){c.classList.remove('picked');});clearBetError();updateTotal();}
      else if(a==='bettab'){
        var scope=act.getAttribute('data-scope'),container=root.querySelector('.view.on');
        var tabSel=scope?'.btab[data-scope="'+scope+'"]':'.btab:not([data-scope])';
        var panelSel=scope?'.btabpanel[data-scope="'+scope+'"]':'.btabpanel:not([data-scope])';
        if(container){
          container.querySelectorAll(tabSel).forEach(function(t){t.classList.toggle('on',t.getAttribute('data-arg')===arg);});
          container.querySelectorAll(panelSel).forEach(function(p){p.classList.toggle('on',p.getAttribute('data-btab')===arg);});
        }
        if(container&&container.classList.contains('view-bets')){
          container.classList.toggle('tab-settled',arg==='settled');
          container.classList.toggle('tab-open',arg==='open');
          root.querySelectorAll('.view-bets .dt-pop').forEach(function(x){x.classList.remove('open');});
          applyBetFilter();
        }
      }
      else if(a==='confirmbet'){if(validateBet()){openConfirm();}}
      else if(a==='cfcancel'){closeConfirm();}
      else if(a==='lmclose'){closeLimitModal();}
      else if(a==='demo'){runDemo(arg);}
      else if(a==='cfsubmit'){
        var csel=[].slice.call(root.querySelectorAll('.view-bet .list .opt.sel, .view-bet .list .nb.sel')).filter(function(e){return e.offsetParent!==null;});
        var camt=amtVal();
        if(csel.length*camt>getBalance()){return;}
        csel.forEach(function(c){var k=betKeyOf(c);projStake[k]=(projStake[k]||0)+camt;});
        lockCappedOptions();
        closeConfirm();root.querySelectorAll('.view-bet .list .sel').forEach(function(x){x.classList.remove('sel');});root.querySelectorAll('.view-bet [data-act="streakpick"].picked').forEach(function(c){c.classList.remove('picked');});clearBetError();updateTotal();}
      else if(a==='playchip'){act.classList.toggle('on');updatePlanPreview();}
      return;
    }
    var o=e.target.closest('.opt,.nb'); if(o){if(o.classList.contains('locked')){openLimitModal(betNameOf(o),PROJ_CAP);return;}o.classList.toggle('sel');clearBetError();updateTotal();return;}
    var ac=e.target.closest('.amtchip'); if(ac){
      var scope=ac.closest('.view')||root;
      scope.querySelectorAll('.amtchip').forEach(function(x){x.classList.remove('on');});
      ac.classList.add('on');
      var val=ac.classList.contains('mm')?(ac.getAttribute('data-mm')==='min'?chipVals[0]:chipVals[chipVals.length-1]):cleanNumber(ac.textContent.trim());
      if(ac.textContent.trim()==='全部'){val=240;}
      if(ac.hasAttribute('data-v')){val=cleanNumber(ac.getAttribute('data-v'));}
      var i=scope.querySelector('.amtin,.withdraw-amt,.alloc-in'); if(i){i.value=i.classList.contains('amount-entry__value')?fmtAmt(val):val;}
      if(i&&i.classList.contains('alloc-in')){var ab=scope.querySelector('[data-act="allocask"]'); if(ab){ab.textContent='转 '+val+' 额度给 王哥';}}
      if(scope.classList && scope.classList.contains('view-bet')){clearBetError();updateTotal();}

      return;
    }
    var qc=e.target.closest('.qamtchip'); if(qc){
      var qs=qc.closest('.quickslip');
      if(qs){
        qs.querySelectorAll('.qamtchip').forEach(function(x){x.classList.remove('on');});
        qc.classList.add('on');
        var qi=qs.querySelector('.qamtin'); if(qi){qi.value=cleanNumber(qc.textContent.trim());}
      }
      return;
    }
    var st=e.target.closest('.stepper button'); if(st){
      var stp=st.parentNode,dir=st.textContent.trim()==='−'?-1:1;
      if(stp.id==='tpStepper'){stepMoney(stp,dir,'+');}
      else if(stp.id==='slStepper'){stepMoney(stp,dir,'−');}
      else{stepValue(stp,dir);}
      updatePlanPreview();return;
    }
    var ri=e.target.closest('.ri'); if(ri){var w=ri.parentNode;w.querySelectorAll('.ri').forEach(function(x){x.classList.remove('on');});ri.classList.add('on');return;}
    var pb=e.target.closest('.pb'); if(pb){var pw=pb.parentNode;pw.querySelectorAll('.pb').forEach(function(x){x.classList.remove('on');});pb.classList.add('on');return;}
    var sg=e.target.closest('.seg2 div'); if(sg){var p=sg.parentNode;p.querySelectorAll('div').forEach(function(x){x.classList.remove('on');});sg.classList.add('on');
      if(p.classList.contains('bettype-seg')){toggleFormulaGroup('bettype',sg.textContent.trim());}
      else if(p.classList.contains('betstyle-seg')){toggleFormulaGroup('betstyle',sg.textContent.trim());}
      else if(p.classList.contains('logic-seg')){updatePlanPreview();}
      return;}
    var tg=e.target.closest('.toggle'); if(tg){tg.classList.toggle('off');return;}
  });
  document.addEventListener('input',function(e){
    if(e.target.classList && e.target.classList.contains('amtin')){
      var scope=e.target.closest('.view')||root;
      scope.querySelectorAll('.amtchip').forEach(function(x){x.classList.remove('on');});
      if(scope.classList && scope.classList.contains('view-bet')){clearBetError();updateTotal();}
    }
    if(e.target.classList && e.target.classList.contains('qamtin')){
      var qs=e.target.closest('.quickslip');
      if(qs){qs.querySelectorAll('.qamtchip').forEach(function(x){x.classList.remove('on');});}
    }
    if(e.target.classList && e.target.classList.contains('sd-amt-input')){
      sdState.amt=cleanNumber(e.target.value);
      root.querySelectorAll('.sd-pill').forEach(function(p){p.classList.remove('on');});
      sdRealtimeBalance();
      sdUpdateSummary();
    }
    if(e.target.classList && e.target.classList.contains('msearch-in')){
      var mv=e.target.closest('.view'),mkw=e.target.value.trim().toLowerCase();
      if(mv){mv.querySelectorAll('.approw, .apcard, .blist .bi').forEach(function(it){
        var nm=(it.querySelector('b')?.textContent||'').toLowerCase();
        it.classList.toggle('bfilter-hide',!(!mkw||nm.indexOf(mkw)>=0));
      });}
    }
    if(e.target.hasAttribute&&e.target.hasAttribute('data-chat-search')){
      var cv=e.target.closest('.view-chatsearch'),cq=e.target.value.trim().toLowerCase(),shown=0;
      if(cv){cv.querySelectorAll('[data-chat-search-item]').forEach(function(it){var ok=!cq||it.textContent.toLowerCase().indexOf(cq)>=0;it.classList.toggle('bfilter-hide',!ok);if(ok)shown++;});
        var cc=cv.querySelector('#chatSearchCount'),ce=cv.querySelector('#chatSearchEmpty');if(cc)cc.textContent=shown+' 条';if(ce)ce.classList.toggle('show',shown===0);
      }
    }
  });
  (function startSealTimer(){
    var seal=root.querySelector('.rseal'),pie=root.querySelector('.sealpie'),prog=pie?pie.querySelector('.prog'):null;
    if(!seal||!prog) return;
    var C=2*Math.PI*8; prog.style.strokeDasharray=C;
    function parse(t){var d=String(t).match(/\d+/g)||[];return d.length>=2?(parseInt(d[0],10)*60+parseInt(d[1],10)):(parseInt(d[0],10)||0);}
    function fmt(s){var m=Math.floor(s/60),x=s%60;return m+'分'+x+'秒';}
    var total=parse(seal.textContent)||60, rem=total;
    function tick(){
      var ratio=Math.max(0,rem)/total;
      prog.style.strokeDashoffset=C*(1-ratio);
      seal.textContent=fmt(rem);
      var hue=120*ratio, col='hsl('+hue+',75%,42%)';
      prog.style.stroke=col; seal.style.color=col;
      rem=rem<=0?total:rem-1;
    }
    tick(); setInterval(tick,1000);
  })();
  updateRoundbar(root.querySelector('.phone')?.getAttribute('data-game')||'pk');
  applyChipLabels();
  /* ── 资金记录：时间(dropdown) × 类型(chips) 联动筛选 ── */
  var DT_BASE='2026-07-07';
  function apHomeBump(d){
    var el=root.querySelector('#apHomeCnt'); if(!el)return;
    var v=Math.max(0,(parseInt(el.textContent,10)||0)+d); el.textContent=v;
    var dot=el.parentNode.querySelector('.fg-dot'); if(dot){dot.style.display=v?'':'none';}
  }
  function dtOpenSheet(target){
    var sh=root.querySelector('#dtSheet'); if(!sh)return;
    sh.setAttribute('data-list',target);
    sh.setAttribute('data-start',DT_BASE);sh.setAttribute('data-end',DT_BASE);
    sh.setAttribute('data-ym',DT_BASE.slice(0,7));
    dtRender();
    var lb=root.querySelector('#dtSelLabel'); if(lb){lb.textContent=DT_BASE.replace(/-/g,'/');}
    sh.classList.add('open');
  }
  /* 跨 IIFE 桥接：自动投模块（另一 IIFE）需要打开同一个全局日期选择器 */
  window.__im168DtOpen=dtOpenSheet;
  function dtYmSync(){
    var yEl=root.querySelector('#dtYmYear'), g=root.querySelector('#dtYmGrid');
    if(!yEl||!g)return;
    var y=parseInt(yEl.textContent,10), h='';
    for(var m=1;m<=12;m++){
      var dis=(y===2026&&m>7)||y>2026;
      h+='<span class="dtym'+(dis?' dis':'')+'"'+(dis?'':' data-act="dtympick" data-m="'+m+'"')+'>'+m+'月</span>';
    }
    g.innerHTML=h;
    var nxY=root.querySelector('.dt-nav[data-act="dtymyr"][data-d="1"]');
    if(nxY){nxY.classList.toggle('dis',y>=2026);}
  }
  function dtRender(){
    var sh=root.querySelector('#dtSheet'),g=root.querySelector('#dtGrid'); if(!sh||!g)return;
    g.style.display='';
    var ch9=root.querySelector('#dtSheet .dt-cal-h'); if(ch9){ch9.style.display='';}
    var pnl9=root.querySelector('#dtYmPanel'); if(pnl9){pnl9.style.display='none';}
    var ym=sh.getAttribute('data-ym')||'2026-07';
    var y=parseInt(ym.split('-')[0],10), m=parseInt(ym.split('-')[1],10);
    var lb=root.querySelector('#dtYm'); if(lb){lb.textContent=y+'年'+m+'月';}
    var first=new Date(y,m-1,1), dow=first.getDay(), dim=new Date(y,m,0).getDate();
    var base=new Date(DT_BASE+'T00:00:00');
    var st=sh.getAttribute('data-start')||'', en=sh.getAttribute('data-end')||'';
    var h='';
    ['日','一','二','三','四','五','六'].forEach(function(w){h+='<span class="wk">'+w+'</span>';});
    for(var i=0;i<dow;i++){h+='<span class="dtd dis"></span>';}
    for(var d=1;d<=dim;d++){
      var iso=y+'-'+('0'+m).slice(-2)+'-'+('0'+d).slice(-2);
      var fut=new Date(iso+'T00:00:00')>base;
      var cls='dtd'+(fut?' dis':'');
      if(!fut){
        if(iso===st||iso===en){cls+=' on';}
        else if(st&&en&&iso>st&&iso<en){cls+=' mid';}
      }
      h+='<span class="'+cls+'"'+(fut?'':' data-act="dtday" data-date="'+iso+'"')+'>'+d+'</span>';
    }
    g.innerHTML=h;
    var atMax=(y+'-'+('0'+m).slice(-2))>='2026-07';
    root.querySelectorAll('.dt-nav[data-d="1"],.dt-nav[data-d="12"]').forEach(function(n){n.classList.toggle('dis',atMax);});
  }
  function applyWF(lid){
    lid=lid||'pl-wallet-flow';
    var sel=root.querySelector('.wfsel[data-list="'+lid+'"]'),ySel=root.querySelector('.fchip.on[data-list="'+lid+'"]');
    var ds=root.querySelector('.wfdate[data-list="'+lid+'"][data-edge="start"]'),de=root.querySelector('.wfdate[data-list="'+lid+'"][data-edge="end"]');
    var tv=sel?sel.value:'all', yv=ySel?ySel.getAttribute('data-f'):'all';
    var dRange=null;
    if(ds&&de&&ds.value&&de.value){
      var base=new Date('2026-07-07T00:00:00');
      var d1=Math.round((base-new Date(ds.value+'T00:00:00'))/86400000);
      var d0=Math.round((base-new Date(de.value+'T00:00:00'))/86400000);
      dRange=[Math.max(0,d0),Math.max(0,d1)];
      tv='range';
    }
    var pl2=root.querySelector('#'+lid),pg2=root.querySelector('.pager[data-target="'+lid+'"]');
    if(!pl2) return;
    var cnt=0,inn=0,outn=0;
    [].forEach.call(pl2.children,function(bi){
      var dd=parseInt(bi.getAttribute('data-days'),10)||0;
      var okT;
      if(tv==='range'&&dRange){okT=(dd>=dRange[0]&&dd<=dRange[1]);}
      else{var lim=(tv==='custom')?(parseInt(sel&&sel.getAttribute('data-custom'),10)||99999):parseInt(tv,10);
      okT=(tv==='all')||(dd<=lim);}
      var okY=(yv==='all')||(bi.getAttribute('data-t')===yv);
      var qi=root.querySelector('.psrch input[data-list="'+lid+'"]');
      var q=qi?qi.value.trim():'';
      var okS=(!q)||bi.textContent.indexOf(q)>=0;
      var show=okT&&okY&&okS;
      bi.classList.remove('plitem-hide');
      bi.classList.toggle('bfilter-hide',!show);
      if(show){cnt++;}
    });
    var emp=root.querySelector('.lst-empty[data-list="'+lid+'"]');
    if(emp){emp.style.display=cnt?'none':'block';}
    var uc=root.querySelector('.util-cnt[data-list="'+lid+'"]');
    if(uc){uc.textContent='共 '+cnt+' 笔记录';}
    pl2.setAttribute('data-page','1');
    if(lid==='pl-owner-tx'){updateOwnerTxSummary();otxShown=OTX_BATCH;renderOwnerTx();}
    else if(lid==='pl-wallet-flow'){updateWalletTxSummary();lmState[lid].shown=lmState[lid].batch;renderLM(lid);}
    else if(lmState[lid]){lmState[lid].shown=lmState[lid].batch;renderLM(lid);}
    else{renderPage(lid);}
  }
  document.addEventListener('change',function(e){
    if(e.target && e.target.classList && e.target.classList.contains('wfsel')){
      var wl=e.target.getAttribute('data-list');
      var cr=root.querySelector('.wf-custom[data-list="'+wl+'"]');
      if(cr){cr.classList.toggle('open',e.target.value==='custom');}
      if(e.target.value!=='custom'){applyWF(wl);}
    }
    if(e.target && e.target.classList && e.target.classList.contains('wfdate')){
      applyWF(e.target.getAttribute('data-list'));
    }
  });

  /* ── 申请提款：到账金额实时联动 ── */
  function updWithdraw(){
    var i=root.querySelector('.view-withdraw .withdraw-amt'); if(!i) return;
    var v=Math.max(0,cleanNumber(i.value));
    var txt=''+v.toFixed(2);
    var a1=root.querySelector('#wdArrive'),a2=root.querySelector('#wdFootAmt');
    if(a1){a1.textContent=txt;}
    if(a2){a2.textContent=txt;}
  }

  /* ── 全局轻提示 ── */
  var gToastTimer=null, txBack='wallet', apDir='up', apAmt=0;
  var uwPend={up:false,down:false};
  function uwSync(){
    var ub=root.querySelector('#uwUpBtn'), db=root.querySelector('#uwDnBtn');
    if(ub){
      ub.classList.toggle('lockd',uwPend.up);
      if(uwPend.up){ub.setAttribute('data-act','uplocked');ub.removeAttribute('data-arg');}
      else{ub.setAttribute('data-act','show');ub.setAttribute('data-arg','request');}
    }
    if(db){
      db.classList.toggle('lockd',uwPend.down);
      if(uwPend.down){db.setAttribute('data-act','dnlocked');db.removeAttribute('data-arg');}
      else{db.setAttribute('data-act','show');db.setAttribute('data-arg','withdraw');}
    }
    var su=root.querySelector('#uwPendUp'), sd=root.querySelector('#uwPendDn');
    if(su){su.style.display=uwPend.up?'':'none';}
    if(sd){sd.style.display=uwPend.down?'':'none';}
  }
  function gToast(msg){
    var t=root.querySelector('#gToast');
    if(!t){t=document.createElement('div');t.id='gToast';var sc=root.querySelector('.screen');(sc||document.body).appendChild(t);}
    t.textContent=msg;t.classList.add('open');
    clearTimeout(gToastTimer);gToastTimer=setTimeout(function(){t.classList.remove('open');},3200);
  }



  /* ── 管理中心 下拉刷新（余额+最新交易一次更新；桌面可点金额刷新）── */
  function ownerRefresh(){
    var amt=root.querySelector('#agentAmt'); if(!amt)return;
    var inc=50+Math.floor(Math.random()*200);
    var v=(parseInt(amt.getAttribute('data-v'),10)||0)+inc;
    amt.setAttribute('data-v',v);
    var real=v.toLocaleString()+'.00';
    amt.setAttribute('data-real',real);
    if(amt.textContent.indexOf('•')<0){amt.textContent=real;}
    var txc=root.querySelector('#pl-owner-tx');
    if(txc){
      var r=document.createElement('div');r.className='bi tap';r.setAttribute('data-act','txopen');r.setAttribute('data-t','in');r.setAttribute('data-days','0');r.setAttribute('data-st','ok');r.setAttribute('data-time','2026/07/07 09:41');
      r.innerHTML='<div class="q"><b><span class="dtag">下分</span>林仔</b><span class="txtm">今天 09:41</span></div><div class="r"><b class="win">+'+inc.toLocaleString()+'.00</b></div>';
      txc.insertBefore(r,txc.firstChild);
      var rows=txc.querySelectorAll('.bi'); if(rows.length>16){rows[rows.length-1].remove();}
      applyWF('pl-owner-tx');
    }
    var rInc=Math.round((Math.random()*2+0.3)*100)/100;
    var rtd=root.querySelector('#rkToday');
    if(rtd){rtd.textContent=(parseFloat(rtd.textContent.replace(/,/g,''))+rInc).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    var rtt=root.querySelector('#rkTotal');
    if(rtt){rtt.textContent=(parseFloat(rtt.textContent.replace(/,/g,''))+rInc).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});}
    gToast('页面已刷新');
  }
  (function(){
    var sy=0,pulling=false;
    root.addEventListener('touchstart',function(e){
      var sc=e.target.closest('.view-owner .scroll2');
      if(sc&&sc.scrollTop<=0){sy=e.touches[0].clientY;pulling=true;}else{pulling=false;}
    },{passive:true});
    root.addEventListener('touchend',function(e){
      if(pulling&&e.changedTouches&&(e.changedTouches[0].clientY-sy)>70){ownerRefresh();}
      pulling=false;
    },{passive:true});
  })();
  bindRangeSlider(root.querySelector('#rgMin'),root.querySelector('#rgMax'),root.querySelector('#rgFill'),root.querySelector('#rgVal'),function(){updatePlanPreview();},rgTouched,'请拖动设置区间');
  bindRangeSlider(root.querySelector('#bqMin'),root.querySelector('#bqMax'),root.querySelector('#bqFill'),root.querySelector('#bqRangeVal'));
  var bqQueryBtn=root.querySelector('#bqQuery'); if(bqQueryBtn){bqQueryBtn.addEventListener('click',runBustQuery);}
  var bqResetBtn=root.querySelector('#bqReset'); if(bqResetBtn){bqResetBtn.addEventListener('click',resetBustQuery);}
  var bqApplyBtn=root.querySelector('#bqApply'); if(bqApplyBtn){bqApplyBtn.addEventListener('click',applyBustCandidate);}
  updatePlanPreview();
  (function(){var bar=document.createElement('div');bar.className='demo-bar';bar.innerHTML='<span class="demo-t">DEMO · 状态预览</span><button data-act="demo" data-arg="1">1 · 单笔超范围</button><button data-act="demo" data-arg="2">2 · 余额不足</button><button data-act="demo" data-arg="3">3 · 锁盘视觉</button>';document.body.appendChild(bar);})();
  /* 启动：优先按网址 #hash 打开对应页面（刷新不再跳回首页）；无 hash 或页面不存在时回到资讯首页 */
  var bootV=(location.hash||'').replace('#','');
  if(!bootV||!root.querySelector('.view-'+bootV)){bootV='news';} /* 首页=资讯（2026-07-09 确认） */
  showView(bootV); updateTotal(); initPagers(); renderDash();
  /* 投注历史：生成示意数据（已结列表由「查看更多」CTA 逐批展开，保持滚动位置）*/
  buildBetHistory(); buildOpenSrcChips();
})();

/* ════ 自动投 · 策略中心 v0.8（2026-07-09）════
   复刻 ref.html「自动投 / 策略中心 V6」的流程 / IA / 交互（图一 5 步向导版），视觉沿用本项目设计系统。
   自成一体的 IIFE：只处理 stg* 前缀的 data-act，与主模块的事件委托互不干扰。
   页面骨架在 views/game-autos.js（#stgScroll / #stgSheet / #stgReport）。
   业务口径（图二）：
   - 触发 = 任一投注项长龙落入 [最低S, 最高S]；系统扫描全部名次×已选玩法，可多项并发触发。
   - 触发后固定执行 M 回合，长龙中断/中途输赢都不提前停，仅止盈止损可截停（单个投注项独立核算）。
   - 倍投：前段按倍投倍数递增，最后「尾数回合数量」改用尾数倍率递增。 */
(function(){
  var root=document;
  function $(s){return root.querySelector(s);}
  /* 策略 Drawer 既可从自动投打开，也可从聊天室分享卡打开，因此提升到 screen 层，不受当前 Tab 的 display 状态限制。 */
  var sharedSheet=$('#stgSheet'),sharedScreen=$('.screen');
  if(sharedSheet&&sharedScreen&&sharedSheet.parentNode!==sharedScreen){sharedScreen.appendChild(sharedSheet);}
  var PLAY_N={'大小':10,'单双':10,'龙虎':5,'大龙大虎':1};
  var PLAYS=['大小','单双','龙虎','大龙大虎'];
  var POS=['冠军','亚军','第三名','第四名','第五名','第六名','第七名','第八名','第九名','第十名'];
  /* 龙虎对位：任一名次被排除，该对位即不扫描 */
  var LH_PAIRS=[['冠军','第十名'],['亚军','第九名'],['第三名','第八名'],['第四名','第七名'],['第五名','第六名']];
  var STEP_NAMES=['玩法设置','触发条件','执行方式','风控设置','确认策略'];
  /* 选项注解：不常驻选项内，点各组 label 旁 "?" 后显示在选项下方（同步到全部步骤） */
  var QTIPS={
    mode:[['两面','大小 / 单双 / 龙虎 / 大龙大虎'],['定位','按名次热号冷号执行']],
    dir:[['跟投','同方向连开（长龙）达到区间后，顺方向继续投——连开大 3 期：第 4 期投大'],['反投','方向交替（单跳）达到区间后，投上一期的反向——大、小、大：第 4 期投小']],
    style:[['固定投','每回合投入相同金额'],['倍投','每回合按倍数递增']],
    tail:[['倍投倍数','每期投注金额乘以的倍数'],['尾数回合数','最后几期改用尾数倍投，不再按正常倍数递增'],['尾数倍投倍数','最后几期每期仅乘以此倍数，放缓递增速度，降低尾段风险'],['示例','单注金额10、倍投 2倍、尾数 3 回合、尾数倍投 1.5倍。<br>第 1–7 期按 2倍 递增：10 → 20 → 40 → 80 → 160 → 320 → 640。<br>第 8–10 期改按 1.5倍 递增：960 → 1,440 → 2,160。']],
    resumeMode:[['继续','承接暂停前进度，接着投剩余回合'],['重置','恢复后从第 1 回合重新开始']],
    loop:[['持续监测','执行完回到等待，直到止盈止损'],['只执行一次','完成一次触发任务后自动停止']]
  };
  /* 选择类字段默认为空，由玩家自选；数值类保留合理默认 */
  /* 执行方向默认跟投；尾数两项默认为空（不填 = 不启用尾数机制，全程按倍投倍数） */
  function baseCfg(){return {name:'',mode:'',plays:[],exPos:[],posSel:POS.slice(),hot:3,cold:2,dir:'跟投',minS:3,maxS:8,amount:10,rounds:10,style:'',multi:2,tailN:'',tailM:'',tp:1000,sl:500,pause:'',resume:'',resumeMode:'',loop:null};}
  var TPLS={
    trial:{label:'小本试水策略',stat:'',users:'8,423 人用过',tags:['两面','单注 10','跟投','低风险'],
      cfg:{name:'小本试水策略',mode:'两面',plays:['大小'],dir:'跟投',minS:3,maxS:8,amount:10,rounds:10,style:'固定投',tp:100,sl:100,resumeMode:'继续',loop:true}},
    reverse:{label:'长龙反投策略',stat:'',users:'5,912 人用过',tags:['两面','单注 10','反投','中风险'],
      cfg:{name:'长龙反投策略',mode:'两面',plays:['大小','单双'],dir:'反投',minS:4,maxS:8,amount:10,rounds:10,style:'倍投',multi:2,tailN:'',tailM:'',tp:300,sl:300,resumeMode:'继续',loop:true}}
  };
  /* 状态：stgPlans = 已建策略；cur = 向导工作副本或详情中的策略引用 */
  var stgPlans=[],cur=null,step=0,setupMode='custom',editIdx=-1,confirmIdx=-1,confirmKind='',toastT=null,qOpen={},selIdx=0,estOpen=false;
  var shareApplySource=null,sharePendingIdx=-1,shareReplaceIdx=-1,shareViewIdx=-1,archivedStgs=[],shareDuplicateGuard=false,shareStrategySeq=0;
  /* 聊天室 index 0 为王哥的实时运行演示；其余条目绑定玩家自己的 plan + runId。 */
  var sharedDemo=tplCfg('reverse');
  sharedDemo.name='长龙反打';sharedDemo.shareStrategyId='henry-long-reverse';sharedDemo.tplKey='';sharedDemo.official=false;sharedDemo.status='run';sharedDemo.runId='demo-run';sharedDemo.runPnl=860;sharedDemo.shareTriggered=8;sharedDemo.shareDuration='3小时42分';sharedDemo.shareUsers=86;sharedDemo.shareRecent=['win','win','lose','win','win','win'];
  sharedDemo.shareActivity=[['14:32','20260721058','win',120],['14:26','20260721057','win',80],['14:20','20260721056','none',0],['14:14','20260721055','lose',-40]];
  var sharedStgs=[{plan:sharedDemo,owner:'Henry',runId:'demo-run',active:true,demo:true,state:'running'}];
  /* 官方短名：卡片名称显示为「官方 : 小本试水 / 反投策略」（Tag 只表状态，不再有"官方模板"标） */
  TPLS.trial.short='小本试水'; TPLS.reverse.short='反投策略';
  /* 官方卡「玩家人均盈利」（全体玩家平均，非个人）——未启动时展示以吸引玩家 */
  TPLS.trial.avg=85; TPLS.reverse.avg=142;
  TPLS.trial.avgPct=34; TPLS.reverse.avgPct=41; /* 均盈利改百分比展示 */
  /* 执行动态合并筛选：按玩家任务组织（状态、期数、包含回合、时间），不是数据库事件类型。 */
  var feedKind='all',feedType='all',feedResult='all';
  var feedPeriod='',feedRound='all',feedRoundFrom='',feedRoundTo='';
  /* 演示数据均为今天；近 7/30 天自然包含今天，自定义日期由全局日期 Drawer 回填标签。 */
  var feedDate='today',feedDateLabel='';
  var FEED_DATES=[['today','今天'],['7d','近 7 天'],['30d','近 30 天'],['custom','自定义']];
  var filterDraft=null;
  /* 跨 IIFE 桥接：全局 #dtSheet 的 dtapply 在主模块 IIFE，应用自定义日期时回调这里 */
  window.__im168StgDate=function(stF,enF){
    if(stF){
      var eF=enF||stF;var fmtF=function(x){var q=x.split('-');return parseInt(q[1],10)+'/'+parseInt(q[2],10);};
      var labF=(stF===eF)?fmtF(stF):(fmtF(stF)+'–'+fmtF(eF));
      if(filterDraft){filterDraft.date='custom';filterDraft.dateLabel=labF;renderFilterSheet();}
      else{feedDate='custom';feedDateLabel=labF;if(typeof updateFeed==='function'){updateFeed();}}
    }
  };
  /* 官方常驻卡：seeding 两张官方策略（未启动），玩家用掉→运行中，原地不移除 */
  function mkOfficial(key){var c=tplCfg(key);c.tplKey=key;c.official=true;c.status='off';c.pnl=0;c.reports=[];return c;}
  function seedOfficials(){return [mkOfficial('trial'),mkOfficial('reverse')];}
  function officialShort(p){return (p.tplKey&&TPLS[p.tplKey]&&TPLS[p.tplKey].short)||(((p.name||'').indexOf('反投')>=0)?'反投策略':'小本试水');}
  /* 显示名：官方 → 「官方 : X」（前缀弱化）；自定义 → 原名 */
  function dispName(p){return p.tplKey?officialShort(p):(p.name||'');}
  function hasCustomPlan(){return stgPlans.some(function(p){return !p.tplKey;});}
  /* 初始为两张官方模板；之后三张都是实际卡位，归档后留下空位，不强制补回被归档模板。 */
  function normalizePlans(){
    if(!stgPlans.length){stgPlans=seedOfficials();}
    if(stgPlans.length>3){stgPlans=stgPlans.slice(0,3);}
  }
  /* 执行动态滚动加载：一次补 5 条，封顶 25 条更早记录 */
  var FEED_MAX=25,FEED_STEP=5;
  function toast(m){var t=$('#dashToast');if(!t)return;t.innerHTML='<span>'+m+'</span>';t.classList.add('open');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('open');},3800);}
  function num(v,d){var n=parseFloat(v);return isNaN(n)?d:n;}
  function inum(v,d){var n=parseInt(v,10);return isNaN(n)?d:n;}

  /* ── 风险口径（P0-1 / P0-2 修正）：单项最大投入 × 理论可并发投注项 = 最坏敞口；止损按单项封顶 ── */
  function perItemMax(t){
    var a=num(t.amount,0),R=Math.max(1,inum(t.rounds,1));
    if(t.style!=='倍投')return Math.round(a*R);
    var n1=Math.max(0,R-inum(t.tailN,0)),c=a,sum=0;
    for(var i=0;i<R;i++){sum+=c;c*=(i<n1-1?num(t.multi,2):num(t.tailM,1));}
    return Math.round(sum);
  }
  function maxItems(t){
    if(t.mode==='定位'){
      var pn=(t.posSel&&t.posSel.length)||0;
      return Math.max(1,pn*Math.max(1,inum(t.hot,0)+inum(t.cold,0)));
    }
    var ex=t.exPos||[],exN=ex.length,n=0;
    var lhCut=0;LH_PAIRS.forEach(function(pr){if(ex.indexOf(pr[0])>=0||ex.indexOf(pr[1])>=0)lhCut++;});
    (t.plays||[]).forEach(function(p){
      if(p==='大小'||p==='单双'){n+=Math.max(0,10-exN);}
      else if(p==='龙虎'){n+=Math.max(0,5-lhCut);}
      else{n+=PLAY_N[p]||1;}
    });
    return Math.max(1,n);
  }
  /* 止盈止损按全部投注项合计：最坏投入 = min(单注×回合×投注项数, 止损额度) */
  function riskCalc(t){
    var per=perItemMax(t),items=maxItems(t),total=per*items,sl=num(t.sl,0)||total,worst=Math.min(total,sl);
    return {per:per,items:items,total:total,worst:worst,level:worst<500?'低':(worst<3000?'中':'高')};
  }
  /* 试玩游戏不使用真钱：金额一律以「额度」计 */
  function fmtMoney(v){return (Math.round(v)).toLocaleString()+' 额度';}
  function playsTxt(t){return (t.plays&&t.plays.length)?t.plays.join(' '):'未选玩法';}
  /* 跟投数长龙（同方向连开）、反投数单跳（方向交替），共用最低/最高区间 */
  function trigTxt(t){
    if(t.mode==='定位')return '热号 '+t.hot+' 个｜冷号 '+t.cold+' 个';
    var term=t.dir==='反投'?'单跳':(t.dir==='跟投'?'长龙':'长龙/单跳');
    return term+' ≥'+t.minS+' 且 ≤'+t.maxS+' · '+(t.dir||'方向未选');
  }
  function execTxt(t){return '每注 '+t.amount+' · '+t.rounds+' 回合'+(t.style?(' · '+t.style+(t.style==='倍投'?(' '+t.multi+'×'+(inum(t.tailN,0)>0?('（尾 '+t.tailN+' 回合 '+t.tailM+'×）'):'')):'')):' · 资金方式未选');}
  function stopTxt(t){return '止盈 +'+t.tp+' / 止损 −'+t.sl+' · 全部投注项合计';}
  function sumText(t,upto){
    if(!t.mode){return 'PK10 · 请先选择玩法模式';}
    var s='PK10 · '+t.mode+' · '+(t.mode==='定位'?('热'+t.hot+'/冷'+t.cold):playsTxt(t));
    if(upto>=1){s+=' · '+trigTxt(t);}
    if(upto>=2){s+=' · '+execTxt(t);}
    if(upto>=3){s+=' · '+stopTxt(t);}
    return s;
  }

  /* ── L1 渲染：无策略 = 策略模板落地页；有策略 = 策略中心（我的策略 + 执行动态）── */
  /* 新建策略卡：＋ 在上、文字在下 */
  function addCard(){
    return '<div class="stgcard add" data-act="stgsetup" data-arg="custom"><span class="plus">＋</span><b>新建策略</b></div>';
  }
  /* 卡片带分页圆点：按可视页数生成，随滚动位置高亮 */
  function updateStripDots(){
    var st=$('#stgStrip'),dr=$('#stgDots');if(!st||!dr)return;
    var pages=Math.ceil(st.scrollWidth/st.clientWidth);
    if(pages<2){dr.innerHTML='';return;}
    var maxSl=Math.max(1,st.scrollWidth-st.clientWidth);
    var curPg=Math.min(pages-1,Math.round(st.scrollLeft/maxSl*(pages-1)));
    var h='';for(var i=0;i<pages;i++){h+='<span class="'+(i===curPg?'on':'')+'"></span>';}
    dr.innerHTML=h;
  }
  /* 模板卡与「我的策略」卡共用 .stgcard 视觉（三列网格），降低认知成本 */
  function tplCard(key){
    var d=TPLS[key];
    return '<div class="stgcard tpl" data-act="stgsetup" data-arg="'+key+'">'
      +'<div class="sc-top"><span class="stg-status off">官方模板</span></div>'
      +'<h3>'+d.label+'</h3><p>'+d.tags.join('/')+'</p>'
      +'<span class="watchline">'+d.users+'</span>'
      +'<div class="scbtns"><span class="scbtn go">使用</span></div></div>';
  }
  /* 卡片摘要 · 统一紧凑格式：两面/跟投/3-8/单注10/10回合/固定 */
  function sumSlash(p){
    var parts=[p.mode||'—'];
    if(p.mode==='定位'){parts.push(((p.posSel&&p.posSel.length)||0)+'名次');parts.push('热'+p.hot+'冷'+p.cold);}
    else{parts.push(p.dir||'—');parts.push(p.minS+'-'+p.maxS);}
    parts.push('单注'+p.amount);parts.push(p.rounds+'回合');parts.push(p.style==='倍投'?'倍投':'固定');
    return parts.join('/');
  }
  /* 卡片金额保留两位小数并加千分位；纵向独占整行，长数字不再与另一指标争宽。 */
  function cardMoney(v,signed){
    var n=num(v,0),abs=Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');
    return signed?(n>0?'+'+abs:(n<0?'−'+abs:'0.00')):abs;
  }
  function cardStateIcon(p){
    function radarIcon(state,label){
      return '<span class="sc-state '+state+' radar" aria-label="'+label+'">'
        +'<span class="rd-rot" aria-hidden="true"><span class="rd-sw"></span><span class="rd-ptr"></span></span>'
        +'<svg class="rd-body" viewBox="0 0 495 495" fill="none" aria-hidden="true">'
        +'<path d="M304.25 247.021C304.25 278.627 278.627 304.25 247.021 304.25C215.414 304.25 189.791 278.627 189.791 247.021C189.791 215.414 215.414 189.791 247.021 189.791C278.627 189.791 304.25 215.414 304.25 247.021Z"/>'
        +'<path d="M401.098 247.021C401.098 332.115 332.115 401.098 247.021 401.098C161.926 401.098 92.9434 332.115 92.9434 247.021C92.9434 161.926 161.926 92.9434 247.021 92.9434C332.115 92.9434 401.098 161.926 401.098 247.021Z"/>'
        +'<path d="M488.041 247.021C488.041 380.132 380.132 488.041 247.021 488.041C113.909 488.041 6 380.132 6 247.021C6 113.909 113.909 6 247.021 6C380.132 6 488.041 113.909 488.041 247.021Z"/>'
        +'</svg><span class="rd-pulse" aria-hidden="true"></span><span class="rd-dot" aria-hidden="true"></span></span>';
    }
    if(p.status==='run'){return radarIcon('run','监测中');}
    if(p.status==='stop'){
      if(p.complete){return '<span class="sc-state done" aria-label="计划已完成"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 12.5 3.1 3.1L17.5 8"/></svg></span>';}
      return radarIcon('stopped','已急停');
    }
    return '';
  }
  function stgCard(p,i){
    var pv=p.runPnl!=null?p.runPnl:(p.pnl||0),source=p.official?'官方模板':(p.tplKey?'自定义模板':'自定义策略');
    var head='<div class="sc-headzone"><div class="sc-title"><span class="sc-source">'+source+'</span><h3>'+dispName(p)+'</h3></div>'+cardStateIcon(p)+'</div>';
    var body='';
    if(p.status==='off'){
      /* 未运行模板与运行卡共用纵向指标结构；每个数字独占完整卡宽。 */
      if(p.official){
        var tpl=(p.tplKey&&TPLS[p.tplKey])||{};
        var usersNum=((''+(tpl.users||'')).match(/[\d,]+/)||[''])[0];
        body='<div class="sc-metrics">'
            +'<div class="sc-metric primary"><div class="n win">+'+(tpl.avgPct||0)+'%</div><div class="l">均盈利</div></div>'
            +'<div class="sc-metric secondary"><div class="n">'+usersNum+'</div><div class="l">人用过</div></div>'
            +'</div>';
      }
    }else{
      var stake=p.runStake!=null?p.runStake:90;
      body='<div class="sc-metrics">'
          +'<div class="sc-metric primary"><div class="n '+(pv<0?'neg':(pv>0?'win':''))+'">'+cardMoney(pv,true)+'</div><div class="l">累计盈亏</div></div>'
          +'<div class="sc-metric secondary"><div class="n">'+cardMoney(stake,false)+'</div><div class="l">累计投入</div></div>'
          +'</div>';
    }
    /* 选中态=当前查看；右侧状态图标=真实运行状态，两者彼此独立。 */
    return '<div class="stgcard skin2'+(i===selIdx?' sel':'')+'" data-act="stgselect" data-arg="'+i+'">'
      +head+body+'</div>';
  }
  /* 齿轮菜单：编辑 / 删除（定位在卡片齿轮下方，点其他区域关闭） */
  function openStgMenu(i,anchor){
    closeStgMenu();
    var scr=anchor.closest('.screen');if(!scr)return;
    var sr=scr.getBoundingClientRect(),r=anchor.getBoundingClientRect();
    var m=document.createElement('div');m.id='stgMenu';m.className='stg-menu';
    m.innerHTML='<div data-act="stgmenuedit" data-arg="'+i+'">编辑策略</div><div class="del" data-act="stgmenudel" data-arg="'+i+'">删除策略</div>';
    scr.appendChild(m);
    m.style.top=(r.bottom-sr.top+4)+'px';
    m.style.left=Math.max(8,r.right-sr.left-104)+'px';
  }
  function closeStgMenu(){var m=document.getElementById('stgMenu');if(m)m.remove();}
  /* 同名策略自动加流水号（小本试水策略 → 小本试水策略 2 / 3…），方便玩家区分 */
  function uniqueName(base){
    var n=base,k=2;
    while(stgPlans.some(function(p){return p.name===n;})){n=base+' '+k;k++;}
    return n;
  }
  function safeText(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function sharePlan(entry){return entry&&entry.plan?entry.plan:entry;}
  function shareCfg(entry){return entry&&entry.snapshot&&entry.snapshot.cfg?entry.snapshot.cfg:sharePlan(entry);}
  function shareMoney(v,signed){
    var n=num(v,0),abs=Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    return signed?(n>0?'+'+abs:(n<0?'−'+abs:'0.00')):abs;
  }
  function shareDurationLabel(p){
    if(p.shareDuration)return p.shareDuration;
    if(!p.runStart)return '刚刚开始';
    var a=String(p.runStart).split(':'),end=p.runEnd||nowHM(),b=String(end).split(':'),mins=(inum(b[0],0)*60+inum(b[1],0))-(inum(a[0],0)*60+inum(a[1],0));
    if(mins<0)mins+=1440;if(mins<1)return '不足1分钟';if(mins<60)return mins+'分钟';return Math.floor(mins/60)+'小时'+(mins%60?mins%60+'分':'');
  }
  function calcShareFacts(p){
    var pending=inum(p.sharePending,p.pxState==='pend'?1:0),settled=inum(p.shareSettled,Math.max(0,inum(p.demoPeriods,1)-pending));
    var recent=(p.shareRecent||[]).slice(-10);
    if(!recent.length&&settled>0){var pattern=['win','win','lose','win','win','lose','win','win','win','lose'];recent=pattern.slice(Math.max(0,10-Math.min(10,settled)));}
    return {pnl:num(p.runPnl,0),triggered:inum(p.shareTriggered,settled+pending),settled:settled,pending:pending,recent:recent,duration:shareDurationLabel(p),users:inum(p.shareUsers,86),reason:p.shareReason||'',startAt:p.shareStartAt||'今天 20:00',monitored:inum(p.shareMonitored,0),maxLoss:inum(p.shareMaxLoss,0),drawdown:num(p.shareDrawdown,0)};
  }
  function shareFacts(entry){return entry&&entry.snapshot&&entry.snapshot.facts?entry.snapshot.facts:calcShareFacts(sharePlan(entry));}
  function shareState(entry){
    if(entry&&entry.snapshot&&entry.snapshot.state)return entry.snapshot.state;
    if(entry&&entry.state)return entry.state;
    var p=sharePlan(entry);if(!p)return 'ended';
    if(p.shareStartAt||p.status==='scheduled')return 'scheduled';
    if(p.complete)return 'ended';
    if(p.status==='stop')return 'stopped';
    return calcShareFacts(p).triggered>0?'running':'watching';
  }
  function shareStatusMeta(state){
    return {running:['运行中','run'],watching:['运行中','run'],scheduled:['即将启动','scheduled'],stopped:['急停','stopped'],ended:['已结束','ended']}[state]||['已结束','ended'];
  }
  function shareResultsHtml(f){
    if(!f.recent.length)return '';
    return '<div class="lss-results"><span>最近触发结果</span><div>'+f.recent.map(function(x){return '<i class="'+(x==='win'?'win':(x==='lose'?'lose':'zero'))+'">'+(x==='win'?'✓':(x==='lose'?'×':'—'))+'</i>';}).join('')+'</div></div>';
  }
  function shareRule(p){
    var trigger=p.mode==='定位'?('冷热号 '+p.hot+' / '+p.cold):((p.dir==='反投'?'单跳':'连开')+' '+p.minS+'–'+p.maxS+' 期触发');
    return (p.dir||p.mode)+' · '+trigger+' · '+(p.style==='倍投'?'倍投':'固定金额');
  }
  function shareUseLabel(state){return state==='scheduled'?'提前套用':'套用此策略';}
  function shareAuxLabel(state){return state==='running'?'查看实时动态':(state==='watching'?'查看监测状态':(state==='scheduled'?'查看策略设置':'查看本轮报告'));}
  function shareAudienceLabel(state,f){return f.users+'人'+((state==='running')?'使用中':((state==='watching'||state==='scheduled')?'关注':'查看过'));}
  function shareCardHtml(entry,idx){
    var p=shareCfg(entry),f=shareFacts(entry),state=shareState(entry),sm=shareStatusMeta(state),pc=f.pnl>0?'win':(f.pnl<0?'lose':'zero'),appliedIdx=exactAppliedIndex(entry);
    var body='';
    if(state==='scheduled'){
      body='<div class="lss-metrics scheduled"><div><span>策略状态</span><strong>尚未开始运行</strong></div><div><span>预计开始</span><strong>'+safeText(f.startAt)+'</strong></div></div>'
        +'<div class="lss-monitor"><span>监测条件</span><b>'+safeText(p.mode==='定位'?('冷热号 '+p.hot+' / '+p.cold):((p.dir==='反投'?'单跳':'连开')+' ≥ '+p.minS+'期'))+'</b></div>';
    }else{
      body='<div class="lss-metrics"><div><span>'+(state==='running'||state==='watching'?'当前盈利':'本轮最终盈亏')+'</span><strong class="'+pc+'">'+shareMoney(f.pnl,true)+'</strong></div><div><span>本轮触发</span><strong>'+f.triggered+'<small>次</small></strong></div></div>'
        +(state==='watching'?'<div class="lss-monitor"><span>持续监测中</span><b>暂未满足触发条件</b></div>':shareResultsHtml(f));
    }
    var context=(state==='running'||state==='watching')?'<span class="lss-duration">持续运行 '+safeText(f.duration)+'</span>':'<span class="lss-duration">'+(state==='scheduled'?'等待作者启动':((state==='stopped'?'停止原因 ':'结束方式 ')+safeText(f.reason||(state==='stopped'?'作者急停':'正常结束')))+'</span>');
    return '<div class="lss-v2 state-'+sm[1]+'"><div class="lss-card-content" data-act="stgshareview" data-arg="'+idx+'">'
      +'<div class="lss-state"><span><i></i>'+sm[0]+'</span><em>刚刚更新</em></div>'
      +'<div class="lss-author"><i>'+safeText((entry.owner||'我').slice(0,1))+'</i><span>'+safeText(entry.owner||'我')+' 分享了策略</span></div>'
      +'<div class="lss-title"><b>'+safeText(dispName(p)||p.name)+'</b><span>PK10</span></div>'+body
      +'<div class="lss-context">'+context+'<span class="lss-users"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>'+shareAudienceLabel(state,f)+'</span></div></div>'
      +'<div class="lss-actions"><button class="lss-aux" data-act="'+((state==='stopped'||state==='ended')?'stgsharereport':'stgshareview')+'" data-arg="'+idx+'">'+shareAuxLabel(state)+' ›</button><button class="lss-primary" data-act="'+(appliedIdx>=0?'stgshareexisting':'stgshareapply')+'" data-arg="'+idx+'">'+(appliedIdx>=0?'查看我的策略':shareUseLabel(state))+'</button></div></div>';
  }
  function appendShareCard(entry,idx){
    var sc=root.querySelector('.view-chat .scroll');if(!sc)return;
    var el=document.createElement('div');el.className='betmsg stg live-strategy-share';el.setAttribute('data-share-idx',idx);el.innerHTML=shareCardHtml(entry,idx);
    sc.appendChild(el);sc.scrollTop=sc.scrollHeight;
  }
  function freezeShare(entry,state){
    if(!entry||entry.snapshot)return;
    entry.snapshot={state:state,facts:calcShareFacts(sharePlan(entry)),cfg:copyShareCfg(sharePlan(entry))};entry.active=false;
  }
  function syncSharedCards(){
    root.querySelectorAll('.live-strategy-share[data-share-idx]').forEach(function(el){
      var idx=parseInt(el.getAttribute('data-share-idx'),10),entry=sharedStgs[idx],p=sharePlan(entry);if(!entry||!p)return;
      var state=shareState(entry);
      if(!entry.demo&&(state==='stopped'||state==='ended'))freezeShare(entry,state);
      el.innerHTML=shareCardHtml(entry,idx);
    });
  }
  function activeShareIndex(p){
    for(var i=0;i<sharedStgs.length;i++){var e=sharedStgs[i];if(e&&!e.demo&&sharePlan(e)===p&&String(e.runId)===String(p.runId)){return i;}}
    return -1;
  }
  var SHARE_CFG_KEYS=['mode','plays','exPos','posSel','hot','cold','dir','minS','maxS','amount','rounds','style','multi','tailN','tailM','tp','sl','pause','resume','resumeMode','loop'];
  function copyShareCfg(p){
    var c=baseCfg();SHARE_CFG_KEYS.forEach(function(k){if(p[k]!==undefined){c[k]=(p[k]&&p[k].slice&&typeof p[k]!=='string')?p[k].slice():p[k];}});c.name=p.name||'分享策略';return c;
  }
  function shareCfgChanged(a,b){return SHARE_CFG_KEYS.some(function(k){return JSON.stringify(a&&a[k])!==JSON.stringify(b&&b[k]);});}
  function shareSourceKey(entry){
    var p=sharePlan(entry);if(!p)return '';
    if(!p.shareStrategyId)p.shareStrategyId='strategy-'+(++shareStrategySeq);
    return String(entry.owner||'玩家')+'|'+String(p.shareStrategyId);
  }
  function sameSourcePlans(entry){
    var key=shareSourceKey(entry),p=shareCfg(entry);
    return stgPlans.map(function(x,i){return {plan:x,index:i};}).filter(function(x){var s=x.plan.shareSource||{};return s.key===key||(!s.key&&s.owner===(entry.owner||'玩家')&&s.name===(p&&p.name));});
  }
  function exactAppliedIndex(entry){
    var p=shareCfg(entry),same=sameSourcePlans(entry);
    for(var i=0;i<same.length;i++){if(!shareCfgChanged(same[i].plan,p))return same[i].index;}
    return -1;
  }
  function shareEntryUsable(entry){return !!(entry&&shareCfg(entry));}
  function shareActivityHtml(entry){
    var p=sharePlan(entry),rows=p.shareActivity||[['14:32','20260721058','win',120],['14:26','20260721057','win',80],['14:20','20260721056','none',0],['14:14','20260721055','lose',-40]];
    if(!rows.length)rows=[['14:32','20260721058','none',0],['14:26','20260721057','none',0]];
    return '<div class="lss-detail-section"><div class="lss-section-title"><b>策略动态</b><span>当前这一轮</span></div><div class="lss-activity">'+rows.map(function(r){var st=r[2]==='none'?'未触发':'已触发',val=r[2]==='none'?'监测条件未满足':((r[3]>0?'盈利 +':'亏损 −')+shareMoney(Math.abs(r[3]),false));return '<div><time>'+r[0]+'</time><span>第'+r[1]+'期<small>'+st+'</small></span><b class="'+r[2]+'">'+val+'</b></div>';}).join('')+'</div></div>';
  }
  function shareSettingsHtml(p){
    var trigger=p.mode==='定位'?('冷热号 '+p.hot+' / '+p.cold):((p.dir==='反投'?'连续单跳':'连续开大')+p.minS+'期后触发');
    return '<div class="lss-detail-section"><div class="lss-section-title"><b>策略设置</b><span>不公开个人资金</span></div><div class="lss-settings-grid"><div><span>监测条件</span><b>'+safeText(trigger)+'</b></div><div><span>执行方向</span><b>'+safeText(p.dir||'跟投')+'</b></div><div><span>投注方式</span><b>'+safeText(p.style==='倍投'?'倍投':'固定金额')+'</b></div><div><span>风险控制</span><b>止损 '+shareMoney(p.sl,false)+' · 止盈 '+shareMoney(p.tp,false)+'</b></div></div></div>';
  }
  function openSharedRun(idx){
    var entry=sharedStgs[idx],p=shareCfg(entry);if(!shareEntryUsable(entry)){toast('该分享已不可用');return;}
    var f=shareFacts(entry),state=shareState(entry),sm=shareStatusMeta(state),pc=f.pnl>0?'win':(f.pnl<0?'lose':'zero');shareViewIdx=idx;sheetMode='sharelive';cur=null;editIdx=-1;
    var b=$('#stgSheetBody');if(!b)return;
    b.innerHTML='<div class="lss-detail-v2"><div class="lss-detail-head"><div><div class="cf-h">策略详情</div><div class="cf-meta">'+safeText(entry.owner||'玩家')+' 分享</div></div><span class="lss-detail-tag '+sm[1]+'">'+sm[0]+'</span></div>'
      +'<div class="lss-detail-title"><b>'+safeText(dispName(p)||p.name)+'</b><span>PK10</span></div>'
      +(state==='scheduled'?'<div class="lss-detail-metrics"><div><span>预计开始</span><b>'+safeText(f.startAt)+'</b></div><div><span>状态</span><b>尚未开始运行</b></div></div>':'<div class="lss-detail-metrics"><div><span>'+(state==='running'||state==='watching'?'当前盈利':'本轮最终盈亏')+'</span><b class="'+pc+'">'+shareMoney(f.pnl,true)+'</b></div><div><span>本轮触发</span><b>'+f.triggered+'次</b></div><div><span>'+(state==='running'||state==='watching'?'持续运行':'本轮运行时长')+'</span><b>'+safeText(f.duration)+'</b></div></div>'+shareResultsHtml(f))
      +(state==='scheduled'?'':shareActivityHtml(entry))+shareSettingsHtml(p)
      +'<div class="cf-btns lss-detail-actions"><button class="ghost" data-act="stgclose">关闭</button><button class="cta" data-act="stgshareapply" data-arg="'+idx+'">'+shareUseLabel(state)+'</button></div></div>';
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  function openSharedReport(idx){
    var entry=sharedStgs[idx],p=shareCfg(entry);if(!shareEntryUsable(entry))return;
    var f=shareFacts(entry),state=shareState(entry),pc=f.pnl>0?'win':(f.pnl<0?'lose':'zero');sheetMode='sharereport';shareViewIdx=idx;
    var b=$('#stgSheetBody');if(!b)return;
    b.innerHTML='<div class="lss-detail-v2"><div class="lss-detail-head"><div><div class="cf-h">本轮运行报告</div><div class="cf-meta">'+safeText(dispName(p)||p.name)+' · '+safeText(entry.owner||'玩家')+'</div></div><span class="lss-detail-tag '+(state==='stopped'?'stopped':'ended')+'">'+(state==='stopped'?'急停':'已结束')+'</span></div>'
      +'<div class="lss-report-hero"><span>本轮最终盈亏</span><strong class="'+pc+'">'+shareMoney(f.pnl,true)+'</strong><em>'+safeText(f.reason||(state==='stopped'?'作者急停':'正常结束'))+'</em></div>'
      +'<div class="lss-report-grid"><div><span>本轮触发</span><b>'+f.triggered+'次</b></div><div><span>已监测</span><b>'+(f.monitored||f.triggered)+'期</b></div><div><span>最大连续亏损</span><b>'+f.maxLoss+'次</b></div><div><span>最大回撤</span><b class="lose">'+shareMoney(f.drawdown,true)+'</b></div></div>'+shareResultsHtml(f)
      +'<div class="cf-btns lss-detail-actions"><button class="ghost" data-act="stguseedit" data-arg="'+idx+'">编辑后使用</button><button class="cta" data-act="stgusedirect" data-arg="'+idx+'">直接套用</button></div></div>';
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  function openShareApplyChoice(idx){
    var entry=sharedStgs[idx],p=shareCfg(entry);if(!shareEntryUsable(entry))return;sharePendingIdx=idx;sheetMode='shareapply';
    if(exactAppliedIndex(entry)>=0){openExistingSharedStrategy(idx);return;}
    var b=$('#stgSheetBody');if(!b)return;
    b.innerHTML='<div class="cf-h">套用策略设置</div><div class="cf-meta">复制「'+safeText(dispName(p)||p.name)+'」的规则，生成你自己的策略；不会控制分享者的运行。</div>'+shareSettingsHtml(p)
      +'<div class="share-apply-note">套用后，盈亏、触发次数和运行结果将从零开始统计。</div><div class="cf-btns lss-apply-actions"><button class="ghost" data-act="stguseedit" data-arg="'+idx+'">编辑后使用</button><button class="cta" data-act="stgusedirect" data-arg="'+idx+'">直接套用</button></div>';
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  var shareApplyMode='edit';
  function beginSharedApply(idx,mode){
    var entry=sharedStgs[idx];if(!shareEntryUsable(entry)){toast('该分享已不可用');return;}
    if(exactAppliedIndex(entry)>=0&&!shareDuplicateGuard){openExistingSharedStrategy(idx);return;}
    sharePendingIdx=idx;shareApplyMode=mode||'edit';
    if(stgPlans.length>=3){openShareSlots(idx);return;}
    continueSharedApply(idx);
  }
  function continueSharedApply(idx){
    if(shareApplyMode==='direct')openDirectShareConfirm(idx);else openSharedSetup(idx);
  }
  function appliedStatusLabel(p){if(p.status==='run')return '监测中';if(p.complete)return '已完成';if(p.status==='stop')return '已急停';return '未启用';}
  function openExistingSharedStrategy(idx){
    var entry=sharedStgs[idx],mine=exactAppliedIndex(entry);if(mine<0){openShareApplyChoice(idx);return;}
    var p=stgPlans[mine],running=p.status==='run';sharePendingIdx=idx;sheetMode='shareexisting';
    var b=$('#stgSheetBody');if(!b)return;
    b.innerHTML='<div class="cf-h">你已套用此策略</div><div class="cf-meta">相同规则已保存在你的自动投中，无需重复占用卡位。</div>'
      +'<div class="share-existing-card"><div><span>'+safeText(p.name)+'</span><em>'+appliedStatusLabel(p)+'</em></div><b>'+safeText(sumText(p,3))+'</b></div>'
      +(running?'<div class="share-duplicate-warning"><b>避免重复投注</b><span>当前策略正在监测；再次运行相同规则，可能在同一期产生重复下注。</span></div>':'<div class="share-apply-note">可进入现有策略启用或重新启用。若要创建另一套版本，请先修改核心规则。</div>')
      +'<div class="cf-btns lss-apply-actions"><button class="ghost" data-act="stgshareeditcopy" data-arg="'+idx+'">编辑后另存</button><button class="cta" data-act="stgsharegotoplan" data-arg="'+mine+'">查看我的策略</button></div>';
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  function openDirectShareConfirm(idx){
    var entry=sharedStgs[idx],p=shareCfg(entry);if(!shareEntryUsable(entry))return;
    if(stgPlans.length>=3){openShareSlots(idx);return;}
    sharePendingIdx=idx;sheetMode='sharedirect';
    var b=$('#stgSheetBody');if(!b)return;
    var nextSlot=stgPlans.length+1,free=3-stgPlans.length,defaultName=uniqueName(dispName(p)||p.name||'分享策略'),sameCount=sameSourcePlans(entry).length;
    b.innerHTML='<div class="cf-h">保存为我的策略</div><div class="cf-meta">最后确认策略名称、卡位和启用方式</div>'
      +'<div class="stg-lab share-direct-label">策略名称</div><div class="stg-name"><input id="shareDirectName" type="text" maxlength="12" value="'+safeText(defaultName)+'" placeholder="输入 2–12 个字"><span class="pen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></span></div>'
      +'<div class="share-capacity"><div><span>策略卡位</span><b>'+stgPlans.length+' / 3</b></div><strong>可保存至第 '+nextSlot+' 个卡位</strong><small>当前还有 '+free+' 个空位；保存后不会影响现有策略。</small></div>'
      +'<div class="share-direct-source"><span>策略来源</span><b>'+safeText(entry.owner||'玩家')+' · '+safeText(dispName(p)||p.name)+'</b></div>'
      +(sameCount?'<div class="share-source-notice">你已有 '+sameCount+' 张来自此分享的改编策略；本次将按当前规则另存。</div>':'')
      +'<div class="share-direct-summary"><div><span>投注方式</span><b>'+safeText(p.style==='倍投'?'倍投':'固定金额')+'</b></div><div><span>止盈 / 止损</span><b>+'+shareMoney(p.tp,false)+' / −'+shareMoney(p.sl,false)+'</b></div></div>'
      +'<div class="share-apply-note">只复制策略规则，本轮盈亏、触发次数和运行进度不会带入。选择“保存并启用”后，将从下一期开始监测。</div>'
      +'<div class="cf-btns lss-apply-actions"><button class="ghost" data-act="stgdirectsave" data-arg="'+idx+'">仅保存</button><button class="cta" data-act="stgdirectstart" data-arg="'+idx+'">保存并启用</button></div><div class="stg-backlink" data-act="stgdirectback">‹ 返回查看设置</div>';
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  function completeDirectShareApply(idx,start){
    var entry=sharedStgs[idx],p=shareCfg(entry);if(!shareEntryUsable(entry))return;
    if(stgPlans.length>=3){openShareSlots(idx);return;}
    var ip=$('#shareDirectName'),name=String(ip?ip.value:'').trim();
    if(name.length<2||name.length>12){toast('策略名称需为 2–12 个字');return;}
    if(stgPlans.some(function(x){return x.name===name;})){toast('已有同名策略 · 请换一个名称');return;}
    var c=copyShareCfg(p);c.name=name;c.status=start?'run':'off';c.pnl=0;c.reports=[];c.official=false;c.tplKey='';
    c.shareSource={key:shareSourceKey(entry),owner:entry.owner||'玩家',name:p.name||'分享策略',modified:false};
    if(start){startRun(c);c.reports.unshift({t:nowHM(),title:'策略已启用 · 监测中',s:'从下一期开始按套用设置监测。',set:true,eventType:'enabled',origin:true});}
    stgPlans.push(c);selIdx=stgPlans.length-1;
    closeSheet();location.hash='autos';renderHome();syncSharedCards();toast(start?'策略已保存并启用 · 正在监测中':'策略已保存 · 可稍后启用');
  }
  function openSharedSetup(idx){
    var entry=sharedStgs[idx],p=shareCfg(entry);if(!shareEntryUsable(entry)){toast('该分享已不可用');return;}
    shareApplySource={idx:idx,key:shareSourceKey(entry),owner:entry.owner||'玩家',name:p.name||'分享策略',original:copyShareCfg(p),requireChange:shareDuplicateGuard};shareDuplicateGuard=false;
    setupMode='custom';editIdx=-1;step=0;qOpen={};estOpen=false;cur=copyShareCfg(p);
    location.hash='autos';setTimeout(function(){renderStep();var sm=$('#stgSheet');if(sm)sm.classList.add('open');},60);
  }
  function shareSlotReplaceable(p){return !!p&&(p.status==='off'||p.complete||(p.status==='stop'&&p.settled));}
  function shareSlotState(p){if(p.status==='run')return '监测中 · 不可替换';if(p.status==='stop'&&!p.settled)return '待开奖 · 不可替换';if(p.complete)return '已完成 · 可归档';if(p.status==='stop')return '已急停 · 可归档';return '未启用 · 可归档';}
  function openShareSlots(idx){
    sharePendingIdx=idx;shareReplaceIdx=-1;var m=$('#planModal');if(!m)return;
    m.querySelector('#pmTitle').textContent='策略卡已满';
    m.querySelector('#pmBody').innerHTML='<div class="pm-sub">每人最多保留 3 张策略卡。请选择一张可归档的策略，再套用分享设置。</div><div class="share-slot-list">'+stgPlans.map(function(p,i){var ok=shareSlotReplaceable(p);return '<button class="share-slot" data-act="stgslotpick" data-arg="'+i+'"'+(ok?'':' disabled')+'><div><b>'+safeText(dispName(p)||p.name)+'</b><span>'+shareSlotState(p)+'</span></div><em>'+(ok?'选择':'保留')+'</em></button>';}).join('')+'</div>';
    var any=stgPlans.some(shareSlotReplaceable);
    m.querySelector('#pmBtns').innerHTML=any?'<button class="ghost" data-act="stgslotback">返回群聊</button><button class="cta dis" data-act="stgslotconfirm">归档并继续</button>':'<button class="ghost" data-act="stgslotback">返回群聊</button><button class="cta" data-act="stgslotmanage">前往自动投管理</button>';
    m.classList.add('open');
  }
  /* 执行动态 · 跟随选中策略（默认最新一张）：首条展开为详情，内容按该策略参数推导 */
  function betItemsOf(p){
    var items=[];
    if(p.mode==='定位'){
      var sel=(p.posSel&&p.posSel.length)?p.posSel:['冠军'];
      sel.slice(0,4).forEach(function(ps,i){items.push(ps+' '+((i*3+3)%10+1)+' 号');});
    }else{
      var ex=p.exPos||[],avail=POS.filter(function(x){return ex.indexOf(x)<0;});
      (p.plays||[]).forEach(function(pl){
        if(pl==='大小'){items.push((avail[0]||'冠军')+' 大',(avail[4]||'第五名')+' 小');}
        else if(pl==='单双'){items.push((avail[1]||'亚军')+' 单');}
        else if(pl==='龙虎'){items.push('第三名 龙');}
        else{items.push('大龙大虎');}
      });
    }
    return items.length?items.slice(0,4):['冠军 大'];
  }
  /* 第 k 回合的单注金额：前（回合数−尾数回合数量）期按倍投倍数递增，最后 N 期改按尾数倍投倍数递增 */
  function betAtRound(t,k){
    var a=num(t.amount,0);
    if(t.style!=='倍投')return Math.round(a);
    var R=Math.max(1,inum(t.rounds,1)),n1=Math.max(0,R-inum(t.tailN,0)),c=a;
    for(var i=1;i<k;i++){c*=(i<n1?num(t.multi,2):num(t.tailM,1));}
    return Math.round(c);
  }
  function fxDetail(p){
    var a=num(p.amount,10),R=Math.max(1,inum(p.rounds,1)),items=betItemsOf(p),rows='',sum=0;
    items.forEach(function(nm,ix){
      var round=Math.min([3,5,2,4][ix%4],R);
      var est=betAtRound(p,round);
      var val=(items.length>2&&ix===items.length-1)?-(a*5):Math.round(a*4.9);
      sum+=val;
      rows+='<div class="fxi"><span>'+nm+'</span><em>第 '+round+' 回合 · 预估 '+est+' 额度</em><b class="'+(val<0?'lose':'win')+'">'+(val>0?'+':'−')+Math.abs(val)+'</b></div>';
    });
    return {rows:rows,sum:sum};
  }
  /* ── T3 每期执行卡（三态：计划下注 → 待开奖 → 已结算；监测/历史为同模板收起行）──
     规则：每个投注项独立触发、独立计回合（演示：第3/6/1回 + 1个已停），倍投进程按项目逐行显示。
     计划下注 = 玩家干预窗口（封盘前急停/修改都在下单前生效）。详见 自动投_执行动态报告体系.md */
  var pxOpen={};
  function isPxOpen(k,def){return (k in pxOpen)?pxOpen[k]:!!def;}
  function pxStake(p,r){var a=num(p.amount,10);return p.style==='倍投'?Math.round(a*Math.pow(num(p.multi,2),r-1)):a;}
  function pxProg(p,r){var s=[],i;for(i=1;i<=r;i++){s.push(pxStake(p,i));}return s;}
  /* 演示：策略已运行期数（回合数不得超过它）。真实实现由「该项已连续下注多少期」推导。 */
  var PX_PERIODS=5;
  function pxItems(p){
    var names=betItemsOf(p),R=Math.max(1,inum(p.rounds,10));
    /* 各项独立计回合，但都 ≤ 已运行期数（demoPeriods 供 DEMO 演示"深追"，默认 PX_PERIODS） */
    var per=Math.min(R,inum(p.demoPeriods,PX_PERIODS));
    /* 首次（per=1）：全部第 1 回新触发，无深追、无已停项 */
    var rounds=per===1?[1,1,1]:[per,Math.min(3,R),1],arr=[];
    names.slice(0,3).forEach(function(nm,ix){
      var r=rounds[ix]||1;
      arr.push({nm:nm,r:r,st:r===1?'new':'act',amt:pxStake(p,r),prog:pxProg(p,r)});
    });
    if(names[3]&&per>1){arr.push({nm:names[3],r:2,st:'off',amt:0,prog:pxProg(p,2)});}
    return arr;
  }
  function pxMoney(v){
    v=Math.round(num(v,0)*10)/10;
    return v.toLocaleString('en-US',{minimumFractionDigits:Number.isInteger(v)?0:1,maximumFractionDigits:1});
  }
  /* 单期唯一事实来源：标题、Summary 与逐注明细都从同一组 items 派生，禁止各自写死总数。 */
  function pxFacts(p,o){
    var src=o.items||pxItems(p),state=o.state||'pend';
    var items=src.map(function(raw,ix){
      var it={};for(var k in raw){it[k]=raw[k];}
      it.nm=it.nm||betItemsOf(p)[ix]||('投注项 '+(ix+1));
      it.r=Math.max(1,inum(it.r,1));it.prog=it.prog||pxProg(p,it.r);
      it.outcome=it.outcome||(state==='done'?(ix===0?'hit':'miss'):(state==='failed'?'failed':'pend'));
      it.submitted=it.submitted!==false&&it.outcome!=='failed'&&it.st!=='off';
      it.amt=it.submitted?num(it.amt,pxStake(p,it.r)):0;
      it.res=it.outcome==='hit'?Math.round(it.amt*(ODDS-1)*10)/10:(it.outcome==='miss'?-it.amt:0);
      it.potential=it.submitted?Math.round(it.amt*(ODDS-1)*10)/10:0;
      return it;
    });
    var requested=inum(o.requested,items.filter(function(it){return it.st!=='off';}).length),submitted=0,stake=0,hit=0,miss=0,pnl=0,potential=0;
    items.forEach(function(it){
      if(it.submitted){submitted++;stake+=it.amt;potential+=it.potential;}
      if(it.outcome==='hit'){hit++;pnl+=it.res;}else if(it.outcome==='miss'){miss++;pnl+=it.res;}
    });
    return {items:items,requested:requested,submitted:submitted,stake:Math.round(stake*10)/10,hit:hit,miss:miss,pnl:Math.round(pnl*10)/10,potential:Math.round(potential*10)/10};
  }
  function pxChip(st){
    var m={act:['act','跟投中'],pend:['act','待开奖'],'new':['new','新触发'],off:['off','已停'],hit:['hit','命中'],miss:['miss','未中']};
    var c=m[st]||m.act;
    return '<span class="px-chip '+c[0]+'"><i></i>'+c[1]+'</span>';
  }
  function periodNo(v){return String(v==null?'':v).padStart(5,'0');}
  /* 倍投进程串：当前金额加粗（em=红色下期/当前强调），固定投显示单注金额 */
  function pxProgStr(p,it,mode){
    if(p.style!=='倍投'){return '固定 ¥'+num(p.amount,10)+'/注';}
    if(it.st==='off'){return it.prog.join('→')+'（第'+it.r+'回止）';}
    if(mode==='done'){
      if(it.outcome==='hit'){return it.prog.join('→')+' ✓命中';}
      return it.prog.join('→')+' · 下期 <em>'+pxStake(p,it.r+1)+'</em>';
    }
    var s=it.prog.slice(0,-1).join('→');
    return (s?s+'→':'')+'<em>'+it.prog[it.prog.length-1]+'</em>';
  }
  function pxTbl(p,items,mode){
    var lastCol=mode==='done'?'盈亏':(mode==='failed'||mode==='partial'?'状态':'可赢');
    var h='<div class="px-tbl"><div class="px-tr th"><span>投注项 · 进程</span><span class="rd">回合</span><span class="amt">金额</span><span class="res">'+lastCol+'</span></div>';
    items.forEach(function(it){
      var off=it.st==='off',chip,res;
      if(off){chip=pxChip('off');res='<span class="res mut">'+(p.dir==='反投'?'单跳':'长龙')+'中断</span>';}
      else if(it.outcome==='failed'){chip='';res='<span class="res fail">'+(it.reason||'提交失败')+'</span>';}
      else if(mode==='done'){chip=pxChip(it.outcome==='hit'?'hit':'miss');res='<span class="res '+(it.res>=0?'win':'lose')+'">'+(it.res>0?'+':'−')+pxMoney(Math.abs(it.res))+'</span>';}
      else if(mode==='partial'){chip='';res='<span class="res ok">已提交</span>';}
      else{chip=pxChip(mode==='plan'?it.st:'pend');res='<span class="res stake">'+pxMoney(it.potential)+'</span>';}
      /* 状态列已移除（图1/图2）：命中/未中由「盈亏」正负色即可判断 */
      h+='<div class="px-tr'+(off?' off':'')+(it.outcome==='failed'?' failed':'')+'">'
        +'<span class="name">'+it.nm+'<i class="prog">'+pxProgStr(p,it,mode)+'</i></span>'
        +'<span class="rd">'+(off||it.outcome==='failed'?'—':'第'+it.r+'回')+'</span>'
        +'<span class="amt">'+(off||it.outcome==='failed'?'—':pxMoney(it.amt))+'</span>'+res+'</div>';
    });
    return h+'</div>';
  }
  /* 期卡：o={key,per,t,state:'plan'|'pend'|'done',def} */
  function pxCard(p,o){
    var facts=pxFacts(p,o),items=facts.items,open=isPxOpen(o.key,o.def);
    var rounds=items.filter(function(it){return it&&it.submitted!==false&&it.outcome!=='failed'&&inum(it.r,0)>0;})
      .map(function(it){return inum(it.r,0);}).filter(function(v,i,a){return a.indexOf(v)===i;}).sort(function(a,b){return a-b;}).join(',');
    var attemptedStake=Math.round(items.reduce(function(sum,it){var planned=(it.prog&&it.prog.length)?num(it.prog[it.prog.length-1],0):pxStake(p,it.r);return sum+(it.submitted?num(it.amt,0):planned);},0)*10)/10;
    /* 图2：删除「计划下注」中间态——plan 一律按「待开奖」渲染 */
    var isPend=(o.state==='plan'||o.state==='pend');
    var isFail=o.state==='failed',isPartial=o.state==='partial',title;
    if(isFail){title='第'+periodNo(o.per)+'期 · 投注失败';}
    else if(isPartial){title='第'+periodNo(o.per)+'期 · 已投 '+facts.submitted+'/'+facts.requested+' 注';}
    else if(isPend){title='第'+periodNo(o.per)+'期 · 已投 '+facts.submitted+' 注';}
    else if(facts.hit===0){title='第'+periodNo(o.per)+'期 · 未命中 0/'+facts.submitted+' 注';}
    else if(facts.hit===facts.submitted){title='第'+periodNo(o.per)+'期 · 全部命中 '+facts.hit+'/'+facts.submitted+' 注';}
    else{title='第'+periodNo(o.per)+'期 · 命中 '+facts.hit+'/'+facts.submitted+' 注';}
    var right;
    if(isFail){right='<span class="p zero">未扣款</span>';}
    else if(isPend||isPartial){right='<span class="p stake">'+pxMoney(facts.stake)+'</span>';}
    else{right='<span class="p '+(facts.pnl<0?'lose':(facts.pnl>0?'win':'zero'))+'">'+(facts.pnl>0?'+':(facts.pnl<0?'−':''))+pxMoney(Math.abs(facts.pnl))+'</span>';}
    var kind=(o.state==='done')?'result':'bet',result=(o.state==='done')?(facts.pnl<0?'lose':(facts.pnl>0?'win':'zero')):'';
    var h='<div class="px-item feeditem'+(open?' open':'')+(isFail?' execution-failed':'')+(isPartial?' execution-partial':'')+'" data-kind="'+kind+'" data-result="'+result+'" data-period="'+o.per+'" data-rounds="'+rounds+'" data-requested="'+facts.requested+'" data-submitted="'+facts.submitted+'" data-stake="'+facts.stake+'" data-attempted-stake="'+attemptedStake+'" data-pnl="'+facts.pnl+'">'
      +'<div class="stgact px-head" data-act="stgpx" data-arg="'+o.key+'" data-def="'+(o.def?1:0)+'">'
      +'<span class="t">'+o.t+'</span><div class="m"><b>'+title+'</b></div>'
      +right+'<span class="px-caret'+(open?' up':'')+'">⌄</span></div>';
    if(open){
      var b='';
      /* Listing 已经是单期 Summary；展开后只呈现新增信息，避免重复注数与金额。 */
      b+=pxTbl(p,items,o.state);
      if(o.state==='done'){
        var payout=Math.round((facts.stake+facts.pnl)*10)/10;
        b+='<div class="px-reconcile"><span>投入 <b>'+pxMoney(facts.stake)+'</b></span><span>派彩 <b>'+pxMoney(payout)+'</b></span><strong class="'+(facts.pnl<0?'lose':(facts.pnl>0?'win':'zero'))+'">盈亏 '+(facts.pnl>0?'+':(facts.pnl<0?'−':''))+pxMoney(Math.abs(facts.pnl))+'</strong></div>';
      }
      if(isFail||isPartial){b+='<div class="px-note '+(isFail?'fail-note':'warn-note')+'">'+(o.note||(isFail?'本期没有任何注单提交成功，余额未发生变化。':'未提交成功的注单不会扣款；已提交注单继续等待开奖。'))+'</div>';}
      /* 注解已按需求移除（投注项汇总 / 急停赔率 / 命中倍投说明）*/
      h+='<div class="px-body">'+b+'</div>';
    }
    return h+'</div>';
  }
  /* 通用收起行（监测 / 历史）：o={key,t,title,sub,right(html),body} */
  function pxRow(o){
    var open=isPxOpen(o.key,false);
    var h='<div class="px-item feeditem'+(open?' open':'')+(o.muted?' no-trigger':'')+'" data-kind="'+(o.kind||'bet')+'" data-result="'+(o.result||'')+'" data-period="'+(o.period||'')+'" data-rounds="'+(o.rounds||'')+'">'
      +'<div class="stgact px-head" data-act="stgpx" data-arg="'+o.key+'" data-def="0">'
      +'<span class="t">'+o.t+'</span><div class="m"><b>'+o.title+'</b>'+(o.sub?'<span>'+o.sub+'</span>':'')+'</div>'
      +o.right+'<span class="px-caret'+(open?' up':'')+'">⌄</span></div>';
    if(open&&o.body){h+='<div class="px-body">'+o.body+'</div>';}
    return h+'</div>';
  }
  /* 爆仓次数（未中注 / 已投注项）· 演示口径：每一注未中记一次爆仓 */
  function pxBust(p){return p.bust||'8 / 11';}
  /* 阿拉伯数字→中文（1–99，用于「第五轮」这类序数展示） */
  function cnNum(n){var d='零一二三四五六七八九';n=inum(n,0);
    if(n<=0)return '零';if(n<10)return d[n];if(n===10)return '十';if(n<20)return '十'+d[n-10];
    var t=Math.floor(n/10),o=n%10;return d[t]+'十'+(o?d[o]:'');}
  /* 指标区弹性等分格：2→一行两列 / 3→一行三列 / 4→2×2 / 5→上2下3 */
  function pxKeyGrid(tiles){
    if(tiles.length===5){return '<div class="px-key">'+tiles[0]+tiles[1]+'</div><div class="px-key pxk3">'+tiles[2]+tiles[3]+tiles[4]+'</div>';}
    if(tiles.length===3){return '<div class="px-key pxk3">'+tiles.join('')+'</div>';}
    return '<div class="px-key">'+tiles.join('')+'</div>';
  }
  /* 运行中三态（plan/pend/done）的指标区 —— pxCard 与「全部状态一览」共用同一份 */
  function pxMetricOf(p,state){
    return pxFeedMetricOf(p,state,pxFacts(p,{state:state}));
  }
  /* Feed 详情精简 Summary：沿用旧指标，只排除「累计盈亏 / 累计投入」。 */
  function pxFeedMetricOf(p,state,facts){
    facts=facts||pxFacts(p,{state:state});
    var first=!!p.firstRun,elapsed=inum(p.demoPeriods,5);
    var tStake='<div class="k"><i>'+(state==='plan'?'本期计划':'本期投入')+'</i><b>'+pxMoney(facts.stake)+' · '+facts.submitted+' 注</b></div>';
    if(state==='failed'){return pxKeyGrid(['<div class="k"><i>提交结果</i><b class="lose">0 / '+facts.requested+' 注</b></div>','<div class="k"><i>扣款金额</i><b>0</b></div>']);}
    if(state==='partial'){return pxKeyGrid([tStake,'<div class="k"><i>提交结果</i><b>'+facts.submitted+' / '+facts.requested+' 注</b></div>']);}
    if(first){return pxKeyGrid(['<div class="k"><i>预计盈利</i><b class="win">+'+pxMoney(facts.potential)+'</b></div>',tStake]);}
    var tRounds='<div class="k"><i>计划进度</i><b>第'+cnNum(elapsed)+'轮</b></div>';
    if(state==='done'){return pxKeyGrid([tStake,'<div class="k"><i>命中</i><b class="'+(facts.hit?'win':'lose')+'">'+facts.hit+' / '+facts.submitted+'</b></div>',tRounds]);}
    return pxKeyGrid([tStake,tRounds]);
  }
  /* 终态（急停/完成计划）的指标区 —— pxLedger 与「全部状态一览」共用同一份 */
  function pxLedgerMetricOf(p){
    var elapsed=inum(p.demoPeriods,5);
    return pxKeyGrid([
      '<div class="k bust"><i>未中注数</i><b>'+pxBust(p)+' 注</b></div>',
      '<div class="k"><i>计划进度</i><b>第'+cnNum(elapsed)+'轮</b></div>'
    ]);
  }
  /* ── 急停/结算合并报告 · 急停当期注单（逐注可展开）──
     规则：任一项回合数 ≤ 已运行期数；已停项在其活跃各期计入盈亏，停在实际停的那期标注。 */
  function pxLedgerRow(idx,r,st,base,names){
    /* 单期内一注：idx=项序，r=回合，st: 'miss'|'pend'|'off'，base=起投 */
    var amt=Math.round(base*Math.pow(2,r-1));
    var nm=(names&&names[idx])||['冠军 大','亚军 单','第五名 小','第三名 龙'][idx];
    var res,rd='第'+r+'回';
    if(st==='pend'){res='<span class="rr stake">'+(Math.round(amt*(ODDS-1)*10)/10)+'</span>';}
    else if(st==='hit'){res='<span class="rr win">+'+(Math.round(amt*(ODDS-1)*10)/10)+'</span>';}
    else if(st==='off'){res='<span class="rr mut">−'+amt+'</span>';rd=r+'回止';}
    else{res='<span class="rr" style="color:var(--red)">−'+amt+'</span>';}
    return '<div class="px-tr ledger-bet'+(st==='off'?' off':'')+'"><span class="name">'+nm+'</span><span class="rd">'+rd+'</span><span class="amt">'+amt+'</span>'+res+'</div>';
  }
  function pxLedgerFacts(p){
    var base=num(p.amount,10),states=p.complete?['miss','miss','miss']:(p.settled?['hit','miss','miss']:['pend','pend','pend']);
    var tuples=[[0,5,states[0]],[1,3,states[1]],[2,1,states[2]]],inv=0,pnl=0;
    tuples.forEach(function(it){var amt=Math.round(base*Math.pow(2,it[1]-1));inv+=amt;if(it[2]==='hit'){pnl+=Math.round(amt*(ODDS-1)*10)/10;}else if(it[2]==='miss'){pnl-=amt;}});
    return {items:tuples,n:tuples.length,inv:Math.round(inv*10)/10,pnl:Math.round(pnl*10)/10,pend:states[0]==='pend'};
  }
  function runSummaryHtml(p,lf){
    var final=!!(p.complete||p.settled),start=p.runStart||'09:40',end=p.runEnd||'09:50',mins=inum(p.runMinutes,10);
    var triggers=inum(p.triggerCount,4),bets=inum(p.runBetCount,11),stake=num(p.runStake,450),pnl=num(p.runPnl,p.complete?-91.8:118.2);
    var payout=Math.round((stake+pnl)*10)/10,roi=stake?Math.round(pnl/stake*10000)/100:0;
    function money2(v){return num(v,0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
    var pnlCls=pnl<0?'lose':(pnl>0?'win':'zero'),pnlTxt=(pnl>0?'+':(pnl<0?'−':''))+'¥'+money2(Math.abs(pnl));
    var roiTxt=(roi>0?'+':(roi<0?'−':''))+Math.abs(roi).toFixed(2)+'%';
    var h='<section class="run-summary '+(final?'final ':'pending ')+(p.complete?'complete':'stopped')+'" data-run-stake="'+stake+'" data-run-pnl="'+pnl+'">'
      +'<div class="run-summary-head"><div><b>本次运行</b><span>'+start+'–'+end+'</span></div><em>'+mins+' 分钟</em></div>';
    if(!final){
      h+='<div class="run-pending-alert"><i><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg></i><div><span>最终结果待定</span><b>1 期 · '+lf.n+' 注仍待开奖</b></div></div>'
        +'<div class="run-summary-result"><div><span>当前已结算盈亏</span><b class="'+pnlCls+'">'+pnlTxt+'</b></div><small>不含待开奖注单</small></div>'
        +'<div class="run-summary-grid">'
        +'<div><span>触发</span><b>'+triggers+' 期</b></div>'
        +'<div><span>投注</span><b>'+bets+' 注</b></div>'
        +'<div><span>本次投入</span><b>¥'+money2(stake)+'</b></div>'
        +'</div>'
        +'<div class="run-summary-note">已提交注单会继续正常结算；全部开奖后将追加最终总结。</div>';
    }else{
      h+='<div class="run-summary-result"><div><span>最终盈亏</span><b class="'+pnlCls+'">'+pnlTxt+'</b></div><div class="run-roi"><span>回报率 ROI</span><b class="'+pnlCls+'">'+roiTxt+'</b></div></div>'
        +'<div class="run-cashflow"><div><span>本次投入</span><b>¥'+money2(stake)+'</b></div><i>→</i><div><span>结算派彩</span><b>¥'+money2(payout)+'</b></div></div>'
        +'<div class="run-summary-foot"><span>触发 <b>'+triggers+' 期</b></span><span>投注 <b>'+bets+' 注</b></span>'
        +(p.complete?'<span>完成原因 <b>'+(p.doneReason||'计划条件达成')+'</b></span>':'')+'</div>';
    }
    h+='</section>';
    return h;
  }
  function pxLedger(p){
    /* 终态事件只负责回答「这一轮最终怎样」；单期注单继续作为独立 Feed 事件展示。 */
    return runSummaryHtml(p,pxLedgerFacts(p));
  }
  /* 官方未启动：先回答适合谁，再按开始/投注/停止/停止后组织规则，避免参数平铺。 */
  function stgDataGrid(p){
    function dots(n,kind){var s='<span class="stg-score '+kind+'">';for(var i=1;i<=5;i++){s+='<i'+(i<=n?' class="on"':'')+'></i>';}return s+'</span>';}
    function field(l,v,cls){return '<div class="stg-preview-field'+(cls?' '+cls:'')+'"><span>'+l+'</span><b>'+v+'</b></div>';}
    function ruleIcon(kind){
      var a={
        trigger:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/></svg>',
        bet:'<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/></svg>',
        risk:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5-3.2 8.3-8 10-4.8-1.7-8-5-8-10V6l8-3Z"/><path d="M9 12h6"/></svg>',
        after:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8.2A7 7 0 0 1 18.7 7M17.9 15.8A7 7 0 0 1 5.3 17"/></svg>'
      };return a[kind]||'';
    }
    function block(icon,title,fields){return '<section class="stg-preview-block"><div class="stg-preview-head"><i class="ico">'+ruleIcon(icon)+'</i><b>'+title+'</b></div><div class="stg-preview-fields">'+fields+'</div></section>';}
    var tpl=(p.tplKey&&TPLS[p.tplKey])||{},risk=p.tplKey==='reverse'?3:2,profit=p.tplKey==='reverse'?4:3,stable=p.tplKey==='reverse'?3:4;
    var h='<div class="stg-data stg-preview">'
      +'<div class="stg-profile-strip"><div class="stg-profile-main"><div><span>适合人群</span><b>'+(p.tplKey==='reverse'?'有经验 / 进取型':'新手 / 小资金 / 长期挂机')+'</b></div></div>'
      +'<div class="stg-profile-scores"><div><span>风险</span>'+dots(risk,'risk')+'</div><div><span>收益</span>'+dots(profit,'profit')+'</div><div><span>稳定性</span>'+dots(stable,'stable')+'</div></div></div>';
    var startFields=field('玩法模式',p.mode||'—')+field('执行方向',p.dir||'—')+field(p.dir==='反投'?'单跳条件':'长龙条件','≥'+p.minS+'  ≤'+p.maxS);
    var betFields=field('投注方式',p.style||'—')+field('每注金额',p.amount)+field('最多回合',p.rounds+' 回');
    if(p.style==='倍投'){betFields+=field('倍投倍数',(p.multi||2)+'×');}
    var stopFields=field('止盈','+'+p.tp,'win')+field('止损','−'+p.sl,'lose')+field('暂停时段',((p.pause&&p.resume)?(p.pause+'–'+p.resume):'未设置'));
    var afterFields=field('完成后',(p.loop===false?'只执行一次':'持续监测'))+field('恢复执行',(p.resumeMode||'继续'));
    h+='<div class="stg-preview-section-title settings">策略设置</div>'
      +block('trigger','触发规则',startFields)
      +block('bet','投注执行',betFields)
      +block('risk','风险控制',stopFields)
      +block('after','后续机制',afterFields)
      +'<div class="stg-preview-tip"><i>♧</i><div><b>小贴士</b><span>启用后，系统将持续监测长龙，满足条件自动投注。你可随时急停或编辑策略。</span></div></div>'
      +'</div>';
    return h;
  }
  function feedHtml(){
    var p=stgPlans[selIdx];if(!p)return '';
    /* 官方 · 未启动：执行动态显示策略数据网格（替代无数据）*/
    if(p.status==='off'){return stgDataGrid(p);}
    var fterm=p.dir==='反投'?'单跳':'长龙';
    var h='';
    var stopHistory='';
    /* 急停与最终结算是两个事件：历史只追加，不原地改写。 */
    if(p.status==='stop'){
      var lopen=isPxOpen('pxstop',true),kind=p.stopKind||'急停',settled=!!p.settled;
      var stopFacts=pxLedgerFacts(p),lstate=stopFacts.n+' 注待开奖';
      var stopTitle=p.complete?'计划已完成 · 全部已结算':(settled?'本次运行已全部结算':(kind==='暂停'?'策略已暂停 · 手动暂停':'策略已急停 · 后续投注已停止'));
      var stopPnl=num(p.runPnl,p.complete?-91.8:118.2),stopRight;
      if(settled){stopRight='<span class="p '+(stopPnl<0?'lose':(stopPnl>0?'win':'zero'))+'">'+(stopPnl>0?'+':(stopPnl<0?'−':''))+pxMoney(Math.abs(stopPnl))+'</span>';}
      else{stopRight='<span class="p zero">'+lstate+'</span>';}
      h+='<div class="px-item report set stopreport feeditem'+(lopen?' open':'')+'" data-kind="status" data-result="">'
        +'<div class="stgact px-head" data-act="stgpx" data-arg="pxstop" data-def="1"><span class="t">'+(settled?'09:54':'09:50')+'</span>'
        +'<div class="m"><b>'+stopTitle+'</b></div>'
        +stopRight+'<span class="px-caret'+(lopen?' up':'')+'">⌄</span></div>';
      if(lopen){h+='<div class="px-body">'+pxLedger(p)+'</div>';}
      h+='</div>';
      if(settled&&!p.complete){
        stopHistory='<div class="px-item report set feeditem stop-history" data-kind="status" data-result="">'
          +'<div class="stgact px-head"><span class="t">09:50</span><div class="m"><b>'+(kind==='暂停'?'策略已暂停 · 手动暂停':'策略已急停 · 后续投注已停止')+'</b></div>'
          +'<span class="p zero">'+stopFacts.n+' 注待开奖</span></div></div>';
      }
    }
    /* 报告行 HTML（收起为一行，点开看详情）；nameTitle 标题动态取策略名 */
    function reportRow(r,ri){
      var key='rp'+ri,ropen=isPxOpen(key,false);
      var rawTitle=((r.nameTitle?p.name:r.title)||(r.set?'设置更新':'指令报告'));
      var eventType=r.eventType||((rawTitle.indexOf('策略已重新启用')===0||rawTitle.indexOf('策略已启用')===0)?'enabled':(rawTitle.indexOf('策略已创建')===0?'created':''));
      var title=rawTitle;
      if(eventType==='created'&&r.src==='官方模板'){title='策略已创建 · 基于「'+officialShort(p)+'」官方模板';}
      else if(r.src){title+=' · '+r.src;}
      if(eventType==='enabled'){title='<i class="event-play">▶</i>'+title;}
      var right=(eventType&&r.pnl===undefined)?'' : ((r.pnl!==undefined&&r.pnl!==null)
        ?'<span class="p '+(r.pnl<0?'lose':'win')+'">'+(r.pnl>=0?'+':'−')+Math.abs(r.pnl)+'</span>'
        :'<span class="p zero">'+(r.r||'已确认')+'</span>');
      return '<div class="px-item report feeditem'+(r.set?' set':'')+(ropen?' open':'')+(eventType?' event-'+eventType:'')+'" data-kind="'+(r.kind||'status')+'" data-result="'+(r.result||'')+'" data-period="'+(r.period||'')+'" data-rounds="'+(r.rounds||'')+'">'
        +'<div class="stgact px-head" data-act="stgpx" data-arg="'+key+'" data-def="0"><span class="t">'+r.t+'</span>'
        +'<div class="m"><b>'+title+'</b></div>'+right+'<span class="px-caret'+(ropen?' up':'')+'">⌄</span></div>'
        +(ropen?'<div class="px-body"><div class="px-note">'+r.s+'</div></div>':'')+'</div>';
    }
    var reps=(p.reports||[]);
    /* 🔵 近期报告（非 origin，如设置更新）留在顶部 */
    reps.forEach(function(r,ri){if(!r.origin){h+=reportRow(r,ri);}});
    /* 当前期：投注记录永久保留；开奖后在上方追加结果记录，不原地改写投注历史。 */
    if(p.status==='run'){
      var curState=p.pxState||'pend',curItems=pxItems(p).filter(function(it){return it.st!=='off';}).slice(0,3);
      if(curState==='done'){
        var resultItems=curItems.map(function(it,ix){var x={};for(var k in it){x[k]=it[k];}x.outcome=p.resultMode==='all'?'hit':(p.resultMode==='none'?'miss':(ix===0?'hit':'miss'));return x;});
        h+=pxCard(p,{key:'px090r',per:'090',t:'09:40',state:'done',items:resultItems,def:true});
        h+=pxCard(p,{key:'px090b',per:'090',t:'09:39',state:'pend',items:curItems,def:false});
      }else if(curState==='partial'){
        var partItems=curItems.map(function(it,ix){var x={};for(var k in it){x[k]=it[k];}if(ix===2){x.outcome='failed';x.submitted=false;x.reason='封盘未提交';}return x;});
        h+=pxCard(p,{key:'px090partial',per:'090',t:'09:39',state:'partial',items:partItems,requested:3,def:true});
      }else if(curState==='failed'){
        var failItems=curItems.map(function(it){var x={};for(var k in it){x[k]=it[k];}x.outcome='failed';x.submitted=false;x.reason=p.failReason||'余额不足';return x;});
        h+=pxCard(p,{key:'px090failed',per:'090',t:'09:39',state:'failed',items:failItems,requested:3,note:p.failNote||'余额不足，3 注均未提交；本期未扣款。',def:true});
      }else{
        h+=pxCard(p,{key:'px090b',per:'090',t:'09:39',state:'pend',items:curItems,def:true});
      }
    }
    if(p.status==='stop'){
      var stopItems=pxItems(p).filter(function(it){return it.st!=='off';}).slice(0,3);
      if(p.settled){
        var stopResultItems=stopItems.map(function(it,ix){var x={};for(var sk in it){x[sk]=it[sk];}x.outcome=p.complete?'miss':(ix===0?'hit':'miss');return x;});
        h+=pxCard(p,{key:'px090sr',per:'090',t:'09:53',state:'done',items:stopResultItems,def:false});
        h+=stopHistory;
      }
      if(!p.complete){h+=pxCard(p,{key:'px090sb',per:'090',t:'09:39',state:'pend',items:stopItems,def:false});}
    }
    /* ⚪ T3 历史期：上一期已结算 + 监测/历史收起行；首次（刚触发）无历史期；未启动（草稿）从未执行，也无历史 */
    if(p.status!=='off'&&!p.firstRun){
      h+=pxCard(p,{key:'px089',per:'089',t:'09:38',state:'done',def:false});
      /* 图1：未下注期统一——标题只留期号，右侧留空，第二行「未达条件 · 未下注」 */
      h+=pxRow({key:'px088',t:'09:33',title:'第00088期 · 未达到条件',sub:'',right:'',kind:'bet',period:'088',muted:true,
        body:'<div class="px-note">本期扫描：'+(p.mode==='定位'?'按热冷号规则选号中':fterm+'未达到触发区间（≥'+p.minS+'）')+'，未生成投注项；继续监测下一期。</div>'});
      /* 精简：只保留最近几期（090/089/088/087/086），便于修改；如需更长历史再接真实分页 */
      h+='<div class="feed-daygrp" data-day="past">';
      var hn=betItemsOf(p),base087=num(p.amount,10),histItems=[
        {nm:hn[0]||'冠军 大',r:2,st:'act',amt:p.style==='倍投'?base087*2:base087,prog:pxProg(p,2),outcome:'hit'},
        {nm:hn[1]||'亚军 单',r:1,st:'new',amt:base087,prog:pxProg(p,1),outcome:'miss'}
      ];
      h+=pxCard(p,{key:'px087',per:'087',t:'09:28',state:'done',items:histItems,def:false});
      h+=pxRow({key:'px086',t:'09:22',title:'第00086期 · 未达到条件',sub:'',right:'',kind:'bet',period:'086',muted:true,
        body:'<div class="px-note">本期未生成投注项；继续监测下一期。</div>'});
      h+='</div>';
    }
    /* 🔵 出生回执（创建 / 启用）最旧，沉在最底——新报告/期卡在上，把它们一步步往下推 */
    reps.forEach(function(r,ri){if(r.origin){h+=reportRow(r,ri);}});
    /* 无任何报告/期卡时显示「无数据」空态；不再显示「已显示全部记录」页脚 */
    if(!h){h='<div class="feed-empty"><span>无数据</span></div>';}
    return h;
  }
  /* ═══ DEMO · 自动投状态预览（开发 / 客户演示用，上线前连同 #ademoBar 与 DEMO_AUTOS 一起删除）═══
     维护方式：改场景 = 改 DEMO_AUTOS 里那条数据；加场景 = 追加一条（按钮自动生成）。
     每条只写「策略配置差异 + 状态 + 报告」，随后走真实 renderHome —— 报告 UI 一改这里自动同步，无需双份维护。
     演示钩子（仅 DEMO）：demoPeriods=最深回合、bust='未中/总注'、stopKind、settled。 */
  function demoPlan(o){
    var p=tplCfg('reverse');                 /* 基线：两面·大小+单双 / 倍投 2× / 止盈+300 止损−500 */
    p.name='小本试水策略-1';p.pnl=0;p.official=false;p.settled=false;p.reports=[];
    for(var k in o){p[k]=o[k];}
    return p;
  }
  /* 执行动态从首次启用开始；“策略创建”留在创建完成反馈，不写入执行 Feed。 */
  var RP_START={t:'09:02',title:'策略已启用 · 监测中',s:'开始时间 09:02；从下一期开始按当前设置监测。',set:true,eventType:'enabled',origin:true};
  var RP_EDIT={t:'09:45',title:'策略设置已修改 · 下期生效',s:'<div class="feed-changes"><span><i>每注金额</i><b>10 → 20</b></span><span><i>止损</i><b>−100 → −200</b></span><span><i>暂停时段</i><b>未设置 → 12:00–13:00</b></span></div>',set:true,eventType:'edited'};
  var RP_PAUSE={t:'09:43',title:'策略已暂停 · 余额不足',s:'余额不足以完成下一期投注；当前不会继续提交新注单，已提交注单照常开奖。',set:true,eventType:'paused'};
  var RP_RESUME={t:'09:48',title:'策略已恢复 · 监测中',s:'余额补充完成，已恢复监测；从下一期开始执行。',set:true,eventType:'enabled'};
  var RP_RESTART={t:'09:52',title:'策略已重新启用 · 监测中',s:'开始时间 09:52；继续上一回合进度，本次运行统计已重新计算。',set:true,eventType:'enabled'};
  /* demo 也遵守"永远 3 张"：把演示状态挂到官方卡0（trial），另一官方 + ＋新建 由 normalizePlans 补齐 */
  function demoInto(cfg){
    var d=demoPlan(cfg);d.official=true;d.tplKey='trial';
    if(d.status!=='off'){
      var histStake=d.firstRun?0:240,histPnl=d.firstRun?0:118.2,currentStake=d.firstRun?30:(d.pxState==='failed'?0:(d.pxState==='partial'?200:210)),currentPnl=0;
      if(d.pxState==='done'){currentPnl=d.resultMode==='all'?207.9:(d.resultMode==='none'?-210:108.4);}
      d.runStake=Math.round((histStake+currentStake)*10)/10;
      d.runPnl=Math.round((histPnl+currentPnl)*10)/10;
      if(d.status==='stop'){d.runStake=450;d.runPnl=d.complete?-91.8:(d.settled?226.6:118.2);}
    }
    stgPlans=[d,mkOfficial('reverse')];selIdx=0;
  }
  var DEMO_AUTOS=[
    {id:'draft',label:'1 · 模板概览 · 未启用',build:function(){demoInto({status:'off',reports:[]});}},
    {id:'first',label:'2 · 首次启用 · 第一笔投注',build:function(){demoInto({status:'run',pnl:0,demoPeriods:1,firstRun:true,reports:[RP_START]});}},
    {id:'running',label:'3 · 已投注 · 待开奖',build:function(){demoInto({status:'run',pnl:-210,pxState:'pend',reports:[RP_START]});}},
    {id:'runsettled',label:'4 · 投注 + 结算双记录',build:function(){demoInto({status:'run',pnl:-101.6,pxState:'done',reports:[RP_START]});}},
    {id:'allhit',label:'5 · 全部命中',build:function(){demoInto({status:'run',pnl:207.9,pxState:'done',resultMode:'all',reports:[RP_START]});}},
    {id:'nohit',label:'6 · 全部未命中',build:function(){demoInto({status:'run',pnl:-420,pxState:'done',resultMode:'none',reports:[RP_START]});}},
    {id:'partial',label:'7 · 部分投注成功',build:function(){demoInto({status:'run',pnl:-210,pxState:'partial',reports:[RP_START]});}},
    {id:'failed',label:'8 · 投注失败 · 未扣款',build:function(){demoInto({status:'run',pnl:-210,pxState:'failed',failReason:'余额不足',reports:[RP_START]});}},
    {id:'pause',label:'9 · 暂停 + 恢复',build:function(){demoInto({status:'run',pnl:-40,pxState:'pend',reports:[RP_RESUME,RP_PAUSE,RP_START]});}},
    {id:'editrestart',label:'10 · 修改 + 重新启用',build:function(){demoInto({status:'run',pnl:0,pxState:'pend',reports:[RP_RESTART,RP_EDIT,RP_START]});}},
    {id:'stop',label:'11 · 已急停 · 待开奖',build:function(){demoInto({status:'stop',stopKind:'急停',settled:false,pnl:-210,reports:[]});}},
    {id:'stopsettled',label:'12 · 急停后 · 全部结算',build:function(){demoInto({status:'stop',stopKind:'急停',settled:true,pnl:226.6,reports:[]});}},
    {id:'complete',label:'13 · 计划完成 · 全部结算',build:function(){demoInto({status:'stop',complete:true,settled:true,pnl:-91.8,doneReason:'止损达成',reports:[]});}},
    {id:'sharelive',label:'14 · 聊天实时分享',build:function(){demoInto({status:'run',pnl:108.4,pxState:'done',reports:[RP_START]});}}
  ];
  var SHARE_DEMOS=[['running','分享 · 已触发'],['watching','分享 · 未触发'],['scheduled','分享 · 即将启动'],['stopped','分享 · 急停'],['ended','分享 · 已结束']];
  function runShareDemo(state){
    var p=tplCfg('reverse');p.name='长龙反打';p.tplKey='';p.official=false;p.runId='share-'+state;p.shareUsers=86;p.shareActivity=[['14:32','20260721058','win',120],['14:26','20260721057','win',80],['14:20','20260721056','none',0],['14:14','20260721055','lose',-40]];
    if(state==='running'){p.status='run';p.runPnl=860;p.shareTriggered=8;p.shareDuration='3小时42分';p.shareRecent=['win','win','lose','win','win','win'];}
    if(state==='watching'){p.status='run';p.runPnl=0;p.shareTriggered=0;p.shareDuration='1小时26分';p.shareRecent=[];p.shareActivity=[];}
    if(state==='scheduled'){p.status='scheduled';p.runPnl=0;p.shareTriggered=0;p.shareStartAt='今天 20:00';p.shareRecent=[];}
    if(state==='stopped'){p.status='stop';p.runPnl=-1250;p.shareTriggered=18;p.shareDuration='2小时18分';p.shareRecent=['lose','lose','lose','lose','win','lose'];p.shareReason='触发止损';p.shareMonitored=42;p.shareMaxLoss=5;p.shareDrawdown=-1680;}
    if(state==='ended'){p.status='stop';p.complete=true;p.runPnl=2480;p.shareTriggered=12;p.shareDuration='4小时36分';p.shareRecent=['win','win','win','win','lose','win'];p.shareReason='达到止盈目标';p.shareMonitored=36;p.shareMaxLoss=2;p.shareDrawdown=-420;}
    sharedStgs[0]={plan:p,owner:'Henry',runId:p.runId,active:state==='running'||state==='watching',demo:true,state:state};
    var card=root.querySelector('.live-strategy-share[data-share-idx="0"]');if(card)card.innerHTML=shareCardHtml(sharedStgs[0],0);
    location.hash='chat';
  }
  function runAutoDemo(id){
    var d=DEMO_AUTOS.filter(function(x){return x.id===id;})[0];if(!d)return;
    root.querySelectorAll('#ademoBar button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-arg')===id);});
    closeSheet();closeStgMenu();pxOpen={};unsOpen=false;
    d.build();
    var ob=root.querySelector('#obDrawer');if(ob){ob.classList.remove('open');}
    renderHome();
    if(id==='sharelive'){location.hash='chat';}
  }
  /* ═══ DEMO · Feed 详情规则一览（QA / 客户 / 开发，与线上同源）═══ */
  function specGalleryHtml(){
    var mk=demoPlan;
    function periodCard(p,key,state,mode){
      var items=pxItems(p).filter(function(it){return it.st!=='off';}).slice(0,3);
      if(state==='done'){items=items.map(function(it,ix){var x={};for(var k in it){x[k]=it[k];}x.outcome=mode==='none'?'miss':(mode==='all'?'hit':(ix===0?'hit':'miss'));return x;});}
      if(state==='partial'){items=items.map(function(it,ix){var x={};for(var k in it){x[k]=it[k];}if(ix===2){x.outcome='failed';x.submitted=false;x.reason='封盘未提交';}return x;});}
      if(state==='failed'){items=items.map(function(it){var x={};for(var k in it){x[k]=it[k];}x.outcome='failed';x.submitted=false;x.reason='余额不足';return x;});}
      return pxCard(p,{key:key,per:'090',t:'09:39',state:state,items:items,requested:3,def:true});
    }
    var first=mk({status:'run',firstRun:true}),running=mk({status:'run'}),stopPending=mk({status:'stop',runStake:450,runPnl:118.2}),stopFinal=mk({status:'stop',settled:true,runStake:450,runPnl:226.6});
    var cards=[
      {t:'① 首次启用 · 第一笔投注',b:'待开奖',bc:'',m:periodCard(first,'spec1','pend')},
      {t:'② 已投入 · 待开奖',b:'待开奖',bc:'',m:periodCard(running,'spec2','pend')},
      {t:'③ 单期已结算',b:'投入 / 派彩 / 盈亏',bc:'done',m:periodCard(running,'spec3','done')},
      {t:'④ 部分投注成功',b:'2 / 3 注',bc:'stop',m:periodCard(running,'spec4','partial')},
      {t:'⑤ 急停 · 尚有待开奖',b:'阶段总结',bc:'stop',m:runSummaryHtml(stopPending,pxLedgerFacts(stopPending))},
      {t:'⑥ 急停后 · 全部结算',b:'最终总结',bc:'done',m:runSummaryHtml(stopFinal,pxLedgerFacts(stopFinal))}
    ];
    var h='<div class="spec-inner"><div class="spec-head"><b>Feed 详情 · 规则总览</b><span class="spec-sub">单期明细与 Run Summary · 与线上同源</span><span class="spec-x" data-act="specclose" aria-label="关闭">✕</span></div><div class="spec-grid">';
    cards.forEach(function(c){h+='<div class="spec-card"><div class="spec-ct"><span>'+c.t+'</span><span class="spec-badge '+c.bc+'">'+c.b+'</span></div>'+c.m+'</div>';});
    return h+'</div></div>';
  }
  function openSpecGallery(){var ov=document.getElementById('specOverlay');if(!ov){ov=document.createElement('div');ov.id='specOverlay';document.body.appendChild(ov);}ov.innerHTML=specGalleryHtml();ov.classList.add('open');}
  function closeSpecGallery(){var ov=document.getElementById('specOverlay');if(ov){ov.classList.remove('open');ov.innerHTML='';}}
  (function(){var bar=document.createElement('div');bar.id='ademoBar';bar.className='demo-bar ademo';
    bar.innerHTML='<span class="demo-t">DEMO · 状态预览</span>'+DEMO_AUTOS.map(function(d){return '<button data-act="ademo" data-arg="'+d.id+'">'+d.label+'</button>';}).join('')+'<button data-act="specgallery">15 · 规则总览</button>'+SHARE_DEMOS.map(function(d){return '<button data-act="sharedemo" data-arg="'+d[0]+'">'+d[1]+'</button>';}).join('');
    document.body.appendChild(bar);})();
  function nowHM(){var d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
  function startRun(p,fresh){
    p.runSeq=inum(p.runSeq,0)+1;p.runId=p.runSeq;
    p.runStart=nowHM();p.runEnd='';p.runPnl=0;p.pxState='pend';p.shareTriggered=1;p.sharePending=1;p.shareSettled=0;p.shareRecent=[];
    if(fresh!==false){p.demoPeriods=1;p.firstRun=true;}else{p.firstRun=false;}
    p.runStake=pxFacts(p,{state:'pend'}).stake;
  }
  function stopRun(p){if(p&&!p.runEnd){p.runEnd=nowHM();}}
  /* 标题栏：未启用只读策略设置；启用后才出现执行操作与合并筛选。 */
  function feedKickHtml(){
    var p=stgPlans[selIdx];
    if(!p||p.status==='off'){
      var previewTitle=!p?'策略详情':(p.tplKey==='trial'?'小本试水策略详情':(p.tplKey==='reverse'?'反投策略详情':dispName(p)+'详情'));
      return '<b class="ex-title">'+previewTitle+'</b>';
    }
    return '<b class="ex-title">执行动态</b><span class="feedfilter-inline" id="stgFeedFilter"></span><span class="s2-acts">'
        +((p.status==='run'||p.status==='stop'||p.complete)?'<span class="s2-act" data-act="stgshare" data-arg="'+selIdx+'" aria-label="分享到聊天室"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none"><path d="M13.5 4.2c0-.9 1.05-1.35 1.7-.75l7.2 6.7c.45.4.45 1.1 0 1.5l-7.2 6.7c-.65.6-1.7.15-1.7-.75v-3.3C8.4 14.3 5.2 15.9 3 19c-.35.5-1.1.25-1.05-.35C2.6 12.6 6.6 8.7 13.5 8V4.2z"/></svg></span>':'')
        +'<span class="s2-act" data-act="stgmenu" data-arg="'+selIdx+'" aria-label="设置"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.98 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.98a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03z"/></svg></span>'
        +(p?(p.status==='run'
            ?'<span class="s2-stop" data-act="stgask" data-kind="stop" data-arg="'+selIdx+'">急停</span>'
            :'<span class="s2-go" data-act="stgdetail" data-arg="'+selIdx+'">重新启用</span>')
          :'')
        +'</span>';
  }
  function filterActiveCount(d){
    d=d||{kind:feedKind,type:feedType,result:feedResult,period:feedPeriod,round:feedRound,date:feedDate};var n=0;
    if(d.kind!=='all')n++;if(d.type!=='all')n++;if(d.result!=='all')n++;if(d.period)n++;if(d.type!=='status'&&d.round!=='all')n++;if(d.date!=='today')n++;return n;
  }
  function paintFilter(){
    var box=$('#stgFeedFilter');if(!box)return;
    var feed=root.querySelector('#stgScroll .stg-feed');
    var total=feed?feed.querySelectorAll('.feeditem').length:0;
    if(total===0&&feedDate==='today'){box.innerHTML='';return;}
    var n=filterActiveCount();
    box.innerHTML='<span class="ff-chip'+(n?' on':'')+'" data-act="stgfilteropen" role="button" aria-label="筛选执行动态记录">'
      +'<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18M6 12h12M10 19h4"/></svg>'
      +'筛选'+(n?' · '+n:'')+'</span>';
  }
  function renderFilterSheet(){
    var b=$('#stgFilterBody');if(!b)return;
    var d=filterDraft||{kind:feedKind,type:feedType,result:feedResult,period:feedPeriod,round:feedRound,roundFrom:feedRoundFrom,roundTo:feedRoundTo,date:feedDate,dateLabel:feedDateLabel};
    function chip(label,act,arg,on){return '<button class="stg-filter-chip'+(on?' on':'')+'" data-act="'+act+'" data-arg="'+arg+'">'+label+'</button>';}
    var result=d.kind==='settled'?'<div class="stg-filter-sub"><span>结算结果</span><div>'+chip('全部结果','feedresult','all',d.result==='all')+chip('盈利','feedresult','win',d.result==='win')+chip('亏损','feedresult','lose',d.result==='lose')+chip('持平','feedresult','zero',d.result==='zero')+'</div></div>':'';
    var customRound=d.round==='custom'?'<div class="stg-filter-range"><input class="stg-filter-num" type="number" inputmode="numeric" min="1" placeholder="起始回合" data-feed-filter="roundFrom" value="'+(d.roundFrom||'')+'"><i>至</i><input class="stg-filter-num" type="number" inputmode="numeric" min="1" placeholder="结束回合" data-feed-filter="roundTo" value="'+(d.roundTo||'')+'"></div>':'';
    var custom=d.date==='custom'?(d.dateLabel||'选择日期'):'自定义';
    var summary=filterSummary(d);
    var typeLabel={all:'全部动态',bet:'投注动态',status:'策略事件',error:'执行异常'}[d.type]||'全部动态';
    var roundLabel={all:'全部回合','1':'第 1 回合','2':'第 2 回合','3':'第 3 回合','4plus':'第 4 回合以上',custom:'自定义'}[d.round]||'全部回合';
    var chev='<svg class="stg-filter-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
    var typeOptions=d.openMore==='type'?'<div class="stg-filter-expand"><div class="stg-filter-chips">'
      +chip('全部动态','feedtype','all',d.type==='all')+chip('投注动态','feedtype','bet',d.type==='bet')+chip('策略事件','feedtype','status',d.type==='status')+chip('执行异常','feedtype','error',d.type==='error')+'</div></div>':'';
    var roundOptions=d.type!=='status'&&d.openMore==='round'?'<div class="stg-filter-expand"><div class="stg-filter-chips">'
      +chip('全部回合','feedround','all',d.round==='all')+chip('第 1 回合','feedround','1',d.round==='1')+chip('第 2 回合','feedround','2',d.round==='2')+chip('第 3 回合','feedround','3',d.round==='3')+chip('第 4 回合以上','feedround','4plus',d.round==='4plus')+chip('自定义','feedround','custom',d.round==='custom')+'</div>'+customRound+'</div>':'';
    b.innerHTML='<div class="cf-h">筛选执行动态</div>'
      +'<div class="stg-filter-lab first">搜索期数</div><div class="stg-filter-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><input inputmode="numeric" placeholder="输入期数，例如 00090" data-feed-filter="period" value="'+(d.period||'')+'"></div>'
      +'<div class="stg-filter-lab">执行结果</div><div class="stg-filter-chips stg-filter-primary">'
      +chip('全部','feedkind','all',d.kind==='all')+chip('待开奖','feedkind','pending',d.kind==='pending')+chip('已结算','feedkind','settled',d.kind==='settled')+chip('未投注','feedkind','noBet',d.kind==='noBet')+'</div>'+result
      +'<div class="stg-filter-lab">更多条件</div><div class="stg-filter-more">'
      +'<button class="stg-filter-more-row" data-act="feedmore" data-arg="type"><b>动态类型</b><span>'+typeLabel+'</span>'+chev+'</button>'+typeOptions
      +(d.type==='status'?'':'<button class="stg-filter-more-row" data-act="feedmore" data-arg="round"><b>回合范围</b><span>'+roundLabel+'</span>'+chev+'</button>'+roundOptions)
      +'</div>'
      +'<div class="stg-filter-lab">时间范围</div><div class="stg-filter-chips">'
      +chip('今天','feeddatepick','today',d.date==='today')+chip('近 7 天','feeddatepick','7d',d.date==='7d')+chip('近 30 天','feeddatepick','30d',d.date==='30d')+chip(custom,'feeddatepick','custom',d.date==='custom')+'</div>'
      +filterSummaryHtml(summary,'stg-filter-stats',countFiltered(d))
      +'<div class="stg-filter-actions"><button class="ghost" data-act="feedreset">重置</button><button class="cta" data-act="feedapply">查看 '+countFiltered(d)+' 条动态</button></div>';
  }
  function filterPeriodMatch(x,d){
    var q=String(d.period||'').replace(/\D/g,'');if(!q)return true;
    var p=String(x.getAttribute('data-period')||'').replace(/\D/g,'');return !!p&&p.indexOf(q)>=0;
  }
  function filterRoundMatch(x,d){
    var mode=d.round||'all';if(mode==='all')return true;
    var lo=inum(d.roundFrom,0),hi=inum(d.roundTo,0);if(mode==='custom'&&!lo&&!hi)return true;
    var vals=String(x.getAttribute('data-rounds')||'').split(',').map(function(v){return inum(v,0);}).filter(Boolean);if(!vals.length)return false;
    if(mode==='4plus')return vals.some(function(v){return v>=4;});
    if(mode!=='custom')return vals.indexOf(inum(mode,0))>=0;
    if(!lo)lo=hi;if(!hi)hi=lo;if(lo>hi){var tmp=lo;lo=hi;hi=tmp;}
    return vals.some(function(v){return v>=lo&&v<=hi;});
  }
  function filteredFeedRows(rows,d){
    /* 当前原型记录均发生在今天，因此也属于近 7/30 天；真实数据接入后在 base 中加入记录日期判断。 */
    var base=function(x){return filterPeriodMatch(x,d)&&(d.type==='status'||filterRoundMatch(x,d));},settledPeriods={},resultPeriods={};
    rows.forEach(function(x){if(base(x)&&x.getAttribute('data-kind')==='result'){settledPeriods[x.getAttribute('data-period')]=1;if(d.result==='all'||x.getAttribute('data-result')===d.result)resultPeriods[x.getAttribute('data-period')]=1;}});
    return rows.filter(function(x){
      if(!base(x))return false;
      var kind=x.getAttribute('data-kind'),isError=x.classList.contains('execution-failed')||x.classList.contains('execution-partial');
      if(d.type==='status'&&kind!=='status')return false;
      if(d.type==='error'&&!isError)return false;
      if(d.type==='bet'&&kind!=='bet'&&kind!=='result')return false;
      if(d.kind==='all')return true;
      if(d.kind==='settled')return (kind==='result'&&(d.result==='all'||x.getAttribute('data-result')===d.result))||(kind==='bet'&&!!resultPeriods[x.getAttribute('data-period')]);
      if(d.kind==='pending')return kind==='bet'&&!x.classList.contains('no-trigger')&&!x.classList.contains('execution-failed')&&!x.classList.contains('execution-partial')&&!settledPeriods[x.getAttribute('data-period')];
      if(d.kind==='noBet')return x.classList.contains('no-trigger');
      return false;
    });
  }
  function filterSummary(d){
    var feed=root.querySelector('#stgScroll .stg-feed');if(!feed)return null;
    var rows=filteredFeedRows([].slice.call(feed.querySelectorAll('.feeditem')),d),money=function(v){return Math.round(v*10)/10;};
    if(d.kind==='pending'){
      var pending=rows.filter(function(x){return x.getAttribute('data-kind')==='bet';});
      return {mode:'pending',items:[['待开奖',pending.length],['投注注数',pending.reduce(function(s,x){return s+inum(x.getAttribute('data-submitted'),0);},0)],['累计投入','¥'+pxMoney(money(pending.reduce(function(s,x){return s+num(x.getAttribute('data-stake'),0);},0)))]]};
    }
    if(d.type==='error'){
      return {mode:'error',items:[['异常期数',rows.length],['失败注数',rows.reduce(function(s,x){return s+Math.max(0,inum(x.getAttribute('data-requested'),0)-inum(x.getAttribute('data-submitted'),0));},0)],['未扣款','¥'+pxMoney(money(rows.reduce(function(s,x){return s+Math.max(0,num(x.getAttribute('data-attempted-stake'),0)-num(x.getAttribute('data-stake'),0));},0)))]]};
    }
    if(d.kind==='noBet'||d.type==='status')return null;
    var settled=rows.filter(function(x){return x.getAttribute('data-kind')==='result';});
    var pnl=Math.round(settled.reduce(function(s,x){return s+num(x.getAttribute('data-pnl'),0);},0)*10)/10;
    return {mode:'settled',items:[['已结算',settled.length],['盈利',settled.filter(function(x){return x.getAttribute('data-result')==='win';}).length],['亏损',settled.filter(function(x){return x.getAttribute('data-result')==='lose';}).length],['盈亏',(pnl>0?'+':'')+pxMoney(pnl)]]};
  }
  function filterSummaryHtml(s,cls,count){
    if(!s&&cls!=='stg-filter-stats')return '';
    var match=cls==='stg-filter-stats'?'<em class="stg-filter-match">符合条件 <b>'+inum(count,0)+'</b> 条</em>':'';
    var items=s?s.items.map(function(it,i){var c=(s.mode==='settled'&&i===1)?'win':((s.mode==='settled'&&i===2)||s.mode==='error'?'lose':'');return '<div><span>'+it[0]+'</span><b class="'+c+'">'+it[1]+'</b></div>';}).join(''):'';
    return '<div class="'+cls+' '+(s?s.mode:'count-only')+'">'+match+items+'</div>';
  }
  function countFiltered(d){
    var feed=root.querySelector('#stgScroll .stg-feed');if(!feed)return 0;
    return filteredFeedRows([].slice.call(feed.querySelectorAll('.feeditem')),d).length;
  }
  function refreshFilterPreview(){
    if(!filterDraft)return;var b=$('#stgFilterBody');if(!b)return;
    var s=b.querySelector('.stg-filter-stats'),html=filterSummaryHtml(filterSummary(filterDraft),'stg-filter-stats',countFiltered(filterDraft));if(s){if(html)s.outerHTML=html;else s.remove();}else if(html){var acts=b.querySelector('.stg-filter-actions');if(acts)acts.insertAdjacentHTML('beforebegin',html);}
    var a=b.querySelector('[data-act="feedapply"]');if(a)a.textContent='查看 '+countFiltered(filterDraft)+' 条动态';
  }
  function applyFeedFilters(){
    var feed=root.querySelector('#stgScroll .stg-feed');if(!feed)return;
    var current=stgPlans[selIdx];if(current&&current.status==='off')return;
    var rows=[].slice.call(feed.querySelectorAll('.feeditem')),d={kind:feedKind,type:feedType,result:feedResult,period:feedPeriod,round:feedRound,roundFrom:feedRoundFrom,roundTo:feedRoundTo,date:feedDate,dateLabel:feedDateLabel};
    var shown=filteredFeedRows(rows,d);rows.forEach(function(x){x.classList.toggle('feed-filter-hide',shown.indexOf(x)<0);});
    var visible=rows.filter(function(x){return !x.classList.contains('feed-filter-hide');}).length;
    var old=feed.querySelector('.feed-filter-empty');if(old)old.remove();var oldStats=feed.querySelector('.feed-filter-stats');if(oldStats)oldStats.remove();
    var summary=filterSummary(d);if(filterActiveCount(d)>0&&summary)feed.insertAdjacentHTML('afterbegin',filterSummaryHtml(summary,'feed-filter-stats'));
    if(!visible){feed.insertAdjacentHTML('beforeend','<div class="feed-empty feed-filter-empty"><span>没有符合筛选条件的动态</span></div>');}
  }
  function openFilterSheet(){filterDraft={kind:feedKind,type:feedType,result:feedResult,period:feedPeriod,round:feedRound,roundFrom:feedRoundFrom,roundTo:feedRoundTo,date:feedDate,dateLabel:feedDateLabel,openMore:''};renderFilterSheet();var m=$('#stgFilterSheet');if(m)m.classList.add('open');}
  function closeFilterSheet(){var m=$('#stgFilterSheet');if(m)m.classList.remove('open');filterDraft=null;}
  function syncStrategyShell(){
    var dash=root.querySelector('.autodash'),p=stgPlans[selIdx],preview=!!(p&&p.status==='off');if(!dash)return;
    dash.classList.toggle('preview-mode',preview);
    var bar=$('#stgPreviewActions');
    if(bar){bar.innerHTML=preview?'<button class="ghost" data-act="'+(p.official?'stgcloneedit':'stgedit')+'" data-arg="'+(p.official?p.tplKey:selIdx)+'">编辑</button><button class="cta" data-act="stgstartgo" data-arg="'+selIdx+'">启用</button>':'';}
    if(preview){var cmd=$('#dashCmd');if(cmd)cmd.classList.remove('open');}
  }
  /* 指示线蓝点定位到当前选中卡中心（渐变短线随之居中） */
  function positionSelLine(){
    var line=root.querySelector('#stgScroll .stg-selline'),mark=line&&line.querySelector('.sl-mark');
    var cards=root.querySelectorAll('#stgScroll .tabrow .stgcard');
    if(!mark||!cards[selIdx])return;
    var cr=cards[selIdx].getBoundingClientRect();
    if(!cr.width){requestAnimationFrame(positionSelLine);return;} /* 视图尚未布局时重试 */
    var lr=line.getBoundingClientRect();
    mark.style.left=(cr.left+cr.width/2-lr.left)+'px';
  }
  function renderHome(){
    var box=$('#stgScroll');if(!box)return;
    /* 永远 3 张：规整为 2 官方常驻 + ≤1 自定义（缺失自动补、删除自动还原） */
    normalizePlans();
    selIdx=Math.max(0,Math.min(selIdx,stgPlans.length-1));
    var h='';
    /* 策略区：官方常驻 2 + 第3格（自定义 / ＋新建）；最多 3；无横滑轮播、无右上「＋新建」 */
    var cards=stgPlans.slice(0,3).map(stgCard).join('');
    /* 第3格：未建自定义且未满 3 时显示 ＋新建卡（模版优先、新建垫底） */
    if(stgPlans.length<3){cards+=addCard();}
    /* Tab → 面板：整块浅蓝→白渐变；卡片作为 Tab 连贯连到白色面板（类图2）；选中=白、未选=蓝、无 padding 断裂 */
    h+='<div class="stg-tabwrap">';
    h+='<div class="stg-grid3 tabrow">'+cards+'</div>';
    /* 选中指示线：渐变横线 + 蓝点，蓝点对齐当前选中卡（配合尖角）*/
    h+='<div class="stg-selline"><span class="sl-mark"></span></div>';
    h+='<div class="stg-panel">';
    h+='<div class="stg-kick skin2-feedbar" id="stgFeedKick">'+feedKickHtml()+'</div>';
    h+='<div class="stg-feed">'+feedHtml()+'</div>';
    h+='</div>';
    h+='</div>';
    box.innerHTML=h;
    paintFilter();applyFeedFilters();positionSelLine();
    renderTabs();renderCmdPanel();syncStrategyShell();syncSharedCards();
  }
  /* 局部刷新：切 Tab 时只更新执行动态与选中态，不重刷整页（保持滚动位置） */
  function updateFeed(){
    var k=$('#stgFeedKick');if(k){k.innerHTML=feedKickHtml();}
    var f=root.querySelector('#stgScroll .stg-feed');if(f){f.innerHTML=feedHtml();}
    paintFilter();applyFeedFilters();syncStrategyShell();syncSharedCards();
    root.querySelectorAll('#stgScroll .stg-grid3 .stgcard').forEach(function(c){
      c.classList.toggle('sel',c.getAttribute('data-act')==='stgselect'&&parseInt(c.getAttribute('data-arg'),10)===selIdx);
    });
    positionSelLine();
  }
  /* Sticky Tab Bar：上滑收合状态下的策略切换（状态点 + 名称 + 官方 tag + 新建） */
  function renderTabs(){
    var tb=root.querySelector('#stgTabs');if(!tb)return;
    if(!stgPlans.length){tb.innerHTML='';tb.classList.remove('show');return;}
    tb.innerHTML=stgPlans.map(function(p,i){
      var dc=p.status==='run'?'run':(p.status==='stop'?'stop':'off');
      return '<span class="stgtab'+(i===selIdx?' on':'')+'" data-act="stgtab" data-arg="'+i+'"><i class="dot '+dc+'"></i>'+p.name+(p.official?'<em>官方</em>':'')+'</span>';
    }).join('')+((stgPlans.length<3)?'<span class="stgtab plus" data-act="stgsetup" data-arg="custom">＋</span>':'');
  }
  /* 指令面板：标题标明作用对象；金额直接显示当前策略的实际设定 */
  function syncCmdContext(p){
    var bar=root.querySelector('.autodash .stg-commandbar'),name=$('#stgCmdStrategy'),f=bar&&bar.querySelector('.field');if(!bar)return;
    var key=p?String(selIdx)+':'+String(p.runId||'off'):'none',changed=bar.getAttribute('data-strategy-key')!==key;
    if(name){name.textContent=p?(dispName(p)||p.name||'当前策略'):'当前策略';}
    if(f&&(changed||f.classList.contains('ph'))){f.textContent='打开针对该策略的指令';f.classList.add('ph');}
    bar.setAttribute('data-strategy-key',key);
  }
  function renderCmdPanel(){
    var t=$('#dashCmdTitle'),ex=$('#dashCmdEx'),p=stgPlans[selIdx];
    syncCmdContext(p);
    if(t){t.textContent=p?('怎么用指令 · 对「'+(dispName(p)||p.name)+'」'):'怎么用指令';}
    if(!ex||!p)return;
    function chip(x){return '<span data-act="cmdpick" data-arg="'+x+'">'+x+'</span>';}
    ex.innerHTML='<div><b>查状态</b>'+chip('查看当前策略')+chip('今天赚了多少')+'</div>'
      +'<div><b>改风控</b>'+chip('止盈改成 '+p.tp)+chip('止损改成 '+p.sl)+'</div>'
      +'<div><b>改投注</b>'+chip('每注金额改成 '+p.amount)+chip('倍投改成 '+(p.multi||2)+' 倍')+'</div>'
      +'<div><b>控制策略</b>'+chip('暂停本策略')+chip('急停本策略')+'</div>';
  }
  /* 输入框 ➤ 确认指令：解析 → 应用到当前策略 → 报告插入执行动态 */
  function execCmd(){
    var f=root.querySelector('.autodash .inputbar .field');
    if(!f||f.classList.contains('ph'))return;
    var txt=(f.textContent||'').trim();if(!txt)return;
    var p=stgPlans[selIdx];
    if(!p){toast('还没有策略 · 先新建一个');return;}
    var m,rep='',isSet=false,ttl=null,rlab=null;
    var effective=p.status==='stop'?'重新启用后生效':'下期生效';
    function oneChange(label,from,to){return '<div class="feed-changes"><span><i>'+label+'</i><b>'+from+' → '+to+'</b></span></div>';}
    if((m=txt.match(/止盈改成\s*(\d+)/))){isSet=true;ttl='策略设置已修改 · '+effective;rep=oneChange('止盈','+'+p.tp,'+'+m[1]);p.tp=inum(m[1],p.tp);}
    else if((m=txt.match(/止损改成\s*(\d+)/))){isSet=true;ttl='策略设置已修改 · '+effective;rep=oneChange('止损','−'+p.sl,'−'+m[1]);p.sl=inum(m[1],p.sl);}
    else if((m=txt.match(/每注金额改成\s*(\d+)/))){isSet=true;ttl='策略设置已修改 · '+effective;rep=oneChange('每注金额',p.amount,m[1]);p.amount=inum(m[1],p.amount);}
    else if((m=txt.match(/倍投改成\s*(\d+(?:\.\d+)?)/))){isSet=true;ttl='策略设置已修改 · '+effective;rep=oneChange('倍投倍数',(p.multi||2)+'×',m[1]+'×');p.multi=num(m[1],p.multi);p.style='倍投';}
    var stopCmd=false;
    if(txt.indexOf('暂停')>=0){p.status='stop';p.settled=false;p.stopKind='暂停';stopRun(p);scheduleSettle(p);stopCmd=true;}
    else if(txt.indexOf('急停')>=0){p.status='stop';p.settled=false;p.stopKind='急停';stopRun(p);scheduleSettle(p);stopCmd=true;}
    else if(txt.indexOf('查看当前策略')>=0){rep='当前设置：'+sumSlash(p)+' · 止盈+'+p.tp+'/止损−'+p.sl;}
    else if(txt.indexOf('赚了多少')>=0||txt.indexOf('盈亏')>=0){rep='今天累计盈亏 '+((p.pnl||0)>=0?'+':'−')+Math.abs(p.pnl||0)+' 额度';}
    else{rep='已收到「'+txt+'」· 助手确认后将从下一期生效';}
    p.reports=p.reports||[];
    /* 急停/暂停不单发 T2——feed 顶部急停当期报告已含；其余照常写回执 */
    if(isSet){p.official=false;}
    if(stopCmd){toast('已'+p.stopKind+' · 未结注单将按开奖结算');f.textContent='';f.classList.add('ph');renderHome();return;}
    p.reports.unshift({t:'09:41',title:ttl||undefined,s:rep,set:isSet||!!ttl,r:rlab||undefined});
    f.textContent='';f.classList.add('ph');
    var sc=$('#stgScroll'),sp=sc?sc.scrollTop:0;
    renderHome();
    if(sc){sc.scrollTop=sp;}
    toast('已确认 · 报告已写入执行动态');
  }

  /* ── 5 步向导 ── */
  function dots(){var h='<div class="stg-dots">';for(var i=0;i<5;i++){h+='<span class="'+(i<=step?'on':'')+'"></span>';}return h+'</div>';}
  /* 标题统一为「新建策略 · 步骤名」，步骤名视觉弱化；步骤说明行已按规范移除 */
  function head(){
    var main=shareApplySource?'套用策略':(setupMode==='custom'?'新建策略':TPLS[setupMode].label);
    var restore=editIdx>=0&&stgPlans[editIdx]&&stgPlans[editIdx].tplKey
      ?'<button class="stg-restore" data-act="stgrestoreofficial">恢复官方设置</button>':'';
    return dots()+'<div class="stg-edit-head"><div class="cf-h">'+main+'<span class="cf-hsub"> · '+STEP_NAMES[step]+'</span></div>'+restore+'</div>';
  }
  function qBtn(k){return '<i class="stg-q'+(qOpen[k]?' on':'')+'" data-act="stgq" data-arg="'+k+'" aria-label="查看说明">?</i>';}
  function qTip(k){if(!qOpen[k])return '';return '<div class="stg-qtip">'+QTIPS[k].map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('')+'</div>';}
  /* 单选项卡：items 带 d=解说；two=横向两列（短选项） */
  function seg(k,items,two){
    return '<div class="stg-opts'+(two?' two':'')+'">'+items.map(function(it){
      var on=(k==='loop')?((cur.loop===true&&it.v==='持续监测')||(cur.loop===false&&it.v==='只执行一次')):(cur[k]===it.v);
      return '<div class="stg-opt'+(on?' on':'')+'" data-act="stgset" data-k="'+k+'" data-v="'+it.v+'">'
        +'<div class="t">'+it.v+'</div>'+(it.d?'<div class="d">'+it.d+'</div>':'')+'</div>';
    }).join('')+'</div>';
  }
  /* 数额步进器：数字（可点选输入）在上、标签在下、左对齐；右侧 − / + */
  var STP={amount:[10,1,999999],rounds:[1,1,999],minS:[1,1,30],maxS:[1,1,30],hot:[1,1,10],cold:[1,1,10],multi:[1,1,100],tailN:[1,1,50],tailM:[0.5,1,50],tp:[50,0,9999999],sl:[50,0,9999999]};
  function stp(k,label,ph){
    var v=cur[k],val=(v===''||v===undefined||v===null)?'':v;
    return '<div class="stg-stp"><div class="col">'
      +'<input class="num" type="text" inputmode="decimal" value="'+val+'"'+(val===''?' placeholder="'+(ph||'未设置')+'"':'')+' data-stgk="'+k+'">'
      +'<div class="lbl">'+label+'</div></div>'
      +'<div class="sbtns"><button data-act="stgstep" data-k="'+k+'" data-d="-1">−</button><button data-act="stgstep" data-k="'+k+'" data-d="1">+</button></div>'
      +'</div>';
  }
  /* 时间字段：值在上、标签在下 */
  function tfld(k,label){
    return '<div class="stg-time"><input type="time" value="'+(cur[k]||'')+'" data-stgk="'+k+'"><div class="lbl">'+label+'</div></div>';
  }
  /* 策略名称 + 铅笔 */
  function nameFld(){
    return '<div class="stg-name"><input type="text" value="'+(cur.name||'')+'" placeholder="不填默认「我的策略」" data-stgk="name">'
      +'<span class="pen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></span></div>';
  }
  function fld(k,label,type,suffix,ph){
    return '<div class="stg-fld"><span>'+label+(suffix?'<i class="sfx">'+suffix+'</i>':'')+'</span><input type="'+(type||'text')+'" value="'+(cur[k]!==undefined&&cur[k]!==null?cur[k]:'')+'"'+(ph?' placeholder="'+ph+'"':'')+' data-stgk="'+k+'"'+(type==='number'?' inputmode="numeric"':'')+'></div>';
  }
  /* 预估行：投注项数始终显示；金额信息从执行方式步骤（设置额度后）才出现。
     主行给"第 1 回合要投多少"（马上发生的钱），最多投入降级到第二行（风险边界） */
  function estText(){
    if(!(cur&&((cur.mode==='定位'&&cur.posSel&&cur.posSel.length)||(cur.mode==='两面'&&cur.plays&&cur.plays.length))))return '';
    var rc=riskCalc(cur),s='预估共 '+rc.items+' 个投注项';
    if(step>=2){s+=' · 第 1 回合投入 '+fmtMoney(num(cur.amount,0)*rc.items);}
    return s;
  }
  /* 预估区：收起态只留结论；倍投可展开逐回合投入表（单项 / N项合计 / 累计），把"每回合要掏多少"算给玩家看 */
  function estTable(rc,R){
    var n1=Math.max(0,R-inum(cur.tailN,0)),rowsArr=[],cum=0,k;
    for(k=1;k<=R;k++){var bet=betAtRound(cur,k);cum+=bet*rc.items;rowsArr.push({k:k,b:bet,all:bet*rc.items,cum:cum,tail:k>n1});}
    var show=R>12?rowsArr.slice(0,3).concat([null]).concat(rowsArr.slice(R-6)):rowsArr;
    var h='<div class="est-table"><div class="etr eth"><span>回合</span><span>每项投注</span><span>本回总投入（'+rc.items+'项）</span><span>累计投入</span></div>';
    show.forEach(function(r){
      if(!r){h+='<div class="etr"><span>…</span><span>…</span><span>…</span><span>…</span></div>';return;}
      h+='<div class="etr'+(r.tail?' tail':'')+'"><span>'+r.k+(r.tail?'<i>尾</i>':'')+'</span><span>'+r.b.toLocaleString()+'</span><span>'+r.all.toLocaleString()+'</span><span>'+r.cum.toLocaleString()+'</span></div>';
    });
    h+='<div class="est-note">按全部 '+rc.items+' 个投注项同时触发的情形估算，实际触发通常更少</div></div>';
    return h;
  }
  function estBoxHtml(){
    var et=estText();
    if(!et)return '';
    var isMulti=(cur.style==='倍投'&&step>=2);
    /* 预估主行与展开链接同行：左文字右链接 */
    var h='<div class="est-row"><span class="stg-est">'+et+'</span>'
      +(isMulti?('<span class="est-toggle" data-act="stgestx">'+(estOpen?'收起':'每回合投入 ›')+'</span>'):'')+'</div>';
    if(step>=2){
      var rc=riskCalc(cur),R=Math.max(1,inum(cur.rounds,1)),sl=num(cur.sl,0);
      /* 执行方式步骤只谈资金需求；止损/最多投入的话术从风控步骤起才出现 */
      if(isMulti){
        if(step>=3){h+='<span class="stg-estwhy">最多投入 '+fmtMoney(rc.worst)+'：合计亏损达止损 '+sl+' 额度即提前停止</span>';}
        if(estOpen){h+=estTable(rc,R);}
      }
    }
    return h;
  }
  /* 当前策略摘要 · 标签芯片化（可扫读、自动换行），替代点号长句 */
  function sumChips(t,upto){
    if(!t.mode){return '<span class="sc-empty">请先选择玩法模式</span>';}
    var c=['PK10'];
    if(t.mode==='定位'){
      var pn=t.posSel&&t.posSel.length;
      c.push('定位 · '+(pn?(pn<=3?t.posSel.join(' '):pn+' 个位置'):'未选位置'));
    }else{
      c.push(t.mode+(t.plays&&t.plays.length?(' · '+t.plays.join(' ')):' · 未选玩法'));
      if(t.exPos&&t.exPos.length){c.push('排除 '+t.exPos.length+' 个位置');}
    }
    if(upto>=1){c.push(trigTxt(t));}
    if(upto>=2){
      c.push('每注 '+t.amount+' × '+t.rounds+' 回合');
      if(t.style){c.push(t.style+(t.style==='倍投'?(' '+t.multi+'×'+(inum(t.tailN,0)>0?('（尾'+t.tailN+'回合'+t.tailM+'×）'):'')):''));}
      else{c.push('资金方式未选');}
    }
    if(upto>=3){
      c.push('止盈 +'+t.tp+' / 止损 −'+t.sl);
      if(t.pause&&t.resume){c.push('暂停 '+t.pause+'–'+t.resume);}
      if(t.resumeMode){c.push('恢复后'+t.resumeMode);}
      if(t.loop!==null&&t.loop!==undefined){c.push(t.loop?'持续监测':'只执行一次');}
    }
    return c.map(function(x){return '<span class="schip">'+x+'</span>';}).join('');
  }
  function curBar(upto){
    return '<div class="stg-cur"><div class="sc-head">当前策略</div><div class="sc-chips" id="stgCurSum">'+sumChips(cur,upto)+'</div><span id="stgEstBox">'+estBoxHtml()+'</span></div>';
  }
  function stepBody(){
    var h='';
    if(step===0){
      if(setupMode==='custom'&&!shareApplySource){h+='<div class="stg-lab">策略名称</div>'+nameFld();}
      h+='<div class="stg-lab">投注模式<span class="lab-opt">「必填」</span></div>'+seg('mode',[
        {v:'两面',d:'大小 / 单双 / 龙虎 / 大龙大虎'},
        {v:'定位',d:'1–10 位置排名'}]);
      if(cur.mode==='两面'){
        h+='<div class="stg-lab">两面选择<span class="lab-opt">「必填」</span></div><div class="playgrp stg-playgrp">'+PLAYS.map(function(p){
          return '<span class="fchip playchip'+((cur.plays||[]).indexOf(p)>=0?' on':'')+'" data-act="stgplay" data-arg="'+p+'">'+p+'</span>';
        }).join('')+'</div>';
        /* 排除名次：按 1–10 名反选，缩小扫描范围（大小/单双按名次扣减，龙虎按对位扣减） */
        h+='<div class="stg-lab">排除位置<span class="lab-opt">「选填」</span></div><div class="stg-posgrp ex">'+POS.map(function(ps){
          return '<span class="poschip'+((cur.exPos||[]).indexOf(ps)>=0?' on':'')+'" data-act="stgexpos" data-arg="'+ps+'">'+ps+'</span>';
        }).join('')+'</div>';
      }else if(cur.mode==='定位'){
        /* 定位：先选在哪些名次上执行热冷号 */
        h+='<div class="stg-lab">位置选择<span class="lab-opt">「至少选择 1 项」</span></div><div class="stg-posgrp">'+POS.map(function(ps){
          return '<span class="poschip'+((cur.posSel||[]).indexOf(ps)>=0?' on':'')+'" data-act="stgpossel" data-arg="'+ps+'">'+ps+'</span>';
        }).join('')+'</div>';
      }
      h+=curBar(0);
    }else if(step===1){
      if(cur.mode==='两面'){
        h+='<div class="stg-lab">执行方向<span class="lab-opt">「必填」</span></div>'+seg('dir',[
          {v:'跟投',d:'同方向连开达标后继续同方向投<i class="stg-eg">如：连开大 3 期 → 第 4 期投大</i>'},
          {v:'反投',d:'方向交替（单跳）达标后持续反方向投<i class="stg-eg">如：大、小、大 → 第 4 期投小</i>'}]);
        var trigTerm=cur.dir==='反投'?'单跳':(cur.dir==='跟投'?'连投':'连投 / 单跳');
        h+='<div class="stg-lab">'+trigTerm+'数量（触发区间）</div><div class="stg-grid">'+stp('minS','最低 '+trigTerm+' ≥')+stp('maxS','最高 '+trigTerm+' ≤')+'</div>';
      }else{
        /* 定位：热冷号即触发条件，放在触发步 */
        h+='<div class="stg-lab">冷热数量设置</div><div class="stg-grid">'+stp('hot','当日热号数量')+stp('cold','当日冷号数量')+'</div>';
      }
      h+=curBar(1);
    }else if(step===2){
      /* 爆仓数据入口放在段落标题右侧；基于长龙倍投回测，定位模式不适用 */
      h+='<div class="stg-lab" style="display:flex;align-items:center;">金额与回合'+(cur.mode!=='定位'?'<span class="bustlink" style="margin-left:auto;" data-act="openbust">查看爆仓数据</span>':'')+'</div><div class="stg-grid">'+stp('amount','每注金额')+stp('rounds','买几回合')+'</div>';
      h+='<div class="stg-lab">资金方式<span class="lab-opt">「必填」</span></div>'+seg('style',[
        {v:'固定投',d:'每回合投入相同金额，风险平稳'},
        {v:'倍投',d:'每回合按倍数递增，回本更快、风险更高'}]);
      /* 倍投参数只在选「倍投」后出现；尾数两项默认空，占位「未设置」 */
      if(cur.style==='倍投'){h+='<div class="stg-lab">倍投参数'+qBtn('tail')+'</div><div class="stg-grid">'+stp('multi','倍投倍数')+stp('tailN','尾数回合数量「选填」','未设置')+stp('tailM','尾数倍投倍数「选填」','未设置')+'</div>'+qTip('tail');}
      h+=curBar(2);
    }else if(step===3){
      h+='<div class="stg-lab">止盈止损 · 按全部投注项合计计算</div><div class="stg-grid">'+stp('tp','止盈额度')+stp('sl','止损额度')+'</div>';
      h+='<div class="stg-lab">暂停时段<span class="lab-opt">「选填」</span></div><div class="stg-grid">'+tfld('pause','暂停自动投时间')+tfld('resume','恢复投注时间')+'</div>';
      h+='<div class="stg-lab">恢复后是否继续回合</div>'+seg('resumeMode',[{v:'继续',d:'接着投剩余回合'},{v:'重置',d:'从第 1 回合重来'}],true);
      h+='<div class="stg-lab">完成后继续监测</div>'+seg('loop',[
        {v:'持续监测',d:'执行完回到等待，直到止盈止损'},
        {v:'只执行一次',d:'完成一次触发任务后自动停止'}]);
      h+=curBar(3);
    }else{
      var r=riskCalc(cur);
      if(shareApplySource){
        var changed=shareCfgChanged(cur,shareApplySource.original);
        h+='<div class="stg-lab">策略名称</div>'+nameFld()
          +'<div class="share-apply-source"><b>'+(changed?'改编自':'来自')+' '+safeText(shareApplySource.owner)+' · '+safeText(shareApplySource.name)+'</b>'+(changed?'设置已调整，请确认名称后保存，避免与原策略混淆。':'设置保持不变，你仍可在保存前修改名称。')+'</div>';
      }
      h+='<div class="srow"><span>玩法</span><b>PK10 · '+cur.mode+(cur.mode==='定位'?(' · '+((cur.posSel&&cur.posSel.length)||0)+'个位置'):'')+'</b></div>';
      h+='<div class="srow"><span>目标</span><b>'+(cur.mode==='定位'?((cur.posSel&&cur.posSel.length)?cur.posSel.join(' '):'未选位置'):playsTxt(cur))+'</b></div>';
      h+='<div class="srow"><span>触发</span><b>'+trigTxt(cur)+'</b></div>';
      h+='<div class="srow"><span>执行</span><b>'+execTxt(cur)+'</b></div>';
      h+='<div class="srow"><span>停止</span><b>'+stopTxt(cur)+' · '+(cur.loop===false?'只执行一次':'持续监测')+'</b></div>';
      h+='<div class="stg-risk"><div class="rh">风险预估 · 只看投入，不预测收益<span class="lv '+(r.level==='低'?'lo':(r.level==='中'?'md':'hi'))+'">'+r.level+'风险</span></div>'
        +'<div class="rgrid">'
        +'<div class="ritem"><span>总投入上限</span><b>'+fmtMoney(r.total)+'</b></div>'
        +'<div class="ritem"><span>止损截停</span><b>−'+fmtMoney(num(cur.sl,0))+'</b></div>'
        +'<div class="ritem"><span>理论可并发投注项</span><b>'+r.items+' 项</b></div>'
        +'<div class="ritem"><span>最坏情况投入</span><b class="rd">'+fmtMoney(r.worst)+'</b></div>'
        +'</div><div class="rnote">最坏情况 = 总投入上限（单注 × 回合 × 投注项数，'+(cur.mode==='定位'?('已选 '+((cur.posSel&&cur.posSel.length)||0)+' 个名次 × 热冷号合计'):((cur.plays||[]).join('、')+((cur.exPos&&cur.exPos.length)?('，已排除 '+cur.exPos.length+' 个名次'):'')))+'）与止损额度取较小者；止盈止损按全部投注项合计计算。实际触发数量取决于走势，通常远小于上限。</div></div>';
    }
    return h;
  }
  function footer(){
    if(step===4){
      var lab=editIdx>=0?['保存修改','保存并启用']:['保存策略','保存并启动'];
      return '<div class="cf-btns" style="margin-top:14px;"><button class="ghost" data-act="stgsave">'+lab[0]+'</button><button class="cta" data-act="stgsavestart">'+lab[1]+'</button></div>'
        +'<div class="stg-backlink" data-act="stgprev">‹ 返回修改风控</div>';
    }
    return '<div class="cf-btns" style="margin-top:14px;"><button class="ghost" data-act="'+(step===0?'stgclose':'stgprev')+'">'+(step===0?'取消':'上一步')+'</button><button class="cta" data-act="stgnext">下一步</button></div>';
  }
  function renderStep(){var b=$('#stgSheetBody');if(!b)return;b.innerHTML=head()+stepBody()+footer();}
  /* 官方模板 = 极速启用：点卡直接弹启动确认（预算透明），确认即启动；「调整设置」才进 5 步向导 */
  var quickKind='',WALLET=400;
  function tplCfg(kind){
    var base=baseCfg(),c={},k;
    for(k in base){c[k]=base[k];}
    var t=TPLS[kind]?TPLS[kind].cfg:{};
    for(k in t){c[k]=(t[k]&&t[k].slice&&typeof t[k]!=='string')?t[k].slice():t[k];}
    c.official=true;c.tplKey=kind;
    return c;
  }
  function matchesOfficialConfig(p){
    var d=p&&p.tplKey&&TPLS[p.tplKey];if(!d)return false;
    var cfg=d.cfg;
    return Object.keys(cfg).every(function(k){
      var a=p[k],b=cfg[k];
      return (a&&a.slice&&typeof a!=='string')?JSON.stringify(a)===JSON.stringify(b):String(a==null?'':a)===String(b==null?'':b);
    });
  }
  function tplMaxRound(c){
    var a=num(c.amount,10),R=Math.max(1,inum(c.rounds,1));
    if(c.style!=='倍投')return a;
    var n1=Math.max(0,R-inum(c.tailN,0)),cv=a,mx=a;
    for(var i=1;i<R;i++){cv*=(i<n1?num(c.multi,2):num(c.tailM,1));mx=Math.max(mx,cv);}
    return Math.round(mx);
  }
  function openQuickStart(kind){
    if(stgPlans.length>=3){toast('最多 3 个策略 · 删除其一后可再建');return;}
    var d=TPLS[kind],m=$('#startModal');
    if(!d||!m){openSetup(kind);return;}
    quickKind=kind;
    var c=tplCfg(kind);
    var invest=c.style==='倍投'?(c.amount+' 起 · 倍投最高 '+tplMaxRound(c)):(c.amount+' / 期 · 固定');
    /* 钱包透明：告诉玩家当前额度可进行几轮本策略，不足则禁用启动 */
    var bal=WALLET,need=num(c.sl,0),ok=bal>=need,times=need?Math.floor(bal/need):0;
    var walletLine=ok
      ?'<div class="sm-wallet">钱包余额 '+bal+' 额度 · 足够进行约 <b>'+times+' 轮</b>本策略</div>'
      :'<div class="sm-wallet bad">钱包余额 '+bal+' 额度 · 不足以启动本策略（需预留 '+need+' 额度）</div>';
    var confirmBtn=ok
      ?'<button class="cta" data-act="stgqconfirm">确认启动</button>'
      :'<button class="cta disabled">额度不足</button>';
    m.querySelector('.sm-sheet').innerHTML=
      '<div class="sm-h">启动「'+d.label+'」</div>'
      +'<div class="sm-sub">官方策略 · 启动后每期自动下注，你随时可以急停</div>'
      +'<div class="srow"><span>玩法</span><b>'+c.mode+' · '+c.dir+' · '+(c.plays||[]).join(' ')+'</b></div>'
      +'<div class="srow"><span>每期投入</span><b>'+invest+'</b></div>'
      +'<div class="srow"><span>最坏情况</span><b class="rd">−'+c.sl+' 自动停止</b></div>'
      +'<div class="srow"><span>达到止盈</span><b class="gn">+'+c.tp+' 自动停止</b></div>'
      +'<div class="srow"><span>占用预算</span><b>'+c.sl+' <small>/ 余额 '+bal+'</small></b></div>'
      +walletLine
      +'<div class="sm-btns"><button class="ghost" data-act="stgqadjust">调整设置</button>'+confirmBtn+'</div>';
    m.classList.add('open');
  }
  function openSetup(kind){
    if(stgPlans.length>=3){toast('最多 3 个策略 · 删除其一后可再建');return;}
    setupMode=kind;editIdx=-1;step=0;qOpen={};estOpen=false;
    cur=baseCfg();
    if(TPLS[kind]){var c=TPLS[kind].cfg;for(var k in c){cur[k]=(c[k]&&c[k].slice)?c[k].slice():c[k];}cur.official=true;cur.tplKey=kind;}
    renderStep();
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  /* 官方模板从详情页进入编辑时，必须绑定回当前模板卡；不能按“新建策略”另存一份。 */
  function openTemplateEdit(kind){
    var i=-1;
    stgPlans.some(function(p,idx){if(p.official&&p.tplKey===kind){i=idx;return true;}return false;});
    if(i<0){openSetup(kind);return;}
    var p=stgPlans[i];
    setupMode=kind;editIdx=i;step=0;qOpen={};estOpen=false;
    cur={};for(var k in p){cur[k]=(p[k]&&p[k].slice&&typeof p[k]!=='string')?p[k].slice():p[k];}
    renderStep();
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  function restoreOfficialDraft(){
    var p=editIdx>=0&&stgPlans[editIdx],kind=p&&p.tplKey;if(!kind||!cur)return;
    var base=tplCfg(kind);
    for(var k in base){cur[k]=(base[k]&&base[k].slice&&typeof base[k]!=='string')?base[k].slice():base[k];}
    renderStep();toast('已恢复官方设置预览 · 保存后生效');
  }
  function openEdit(i){
    var p=stgPlans[i];if(!p)return;
    setupMode=p.tplKey||'custom';editIdx=i;step=0;qOpen={};estOpen=false;
    cur={};for(var k in p){cur[k]=(p[k]&&p[k].slice&&typeof p[k]!=='string')?p[k].slice():p[k];}
    renderStep();
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  function closeSheet(){var m=$('#stgSheet');if(m)m.classList.remove('open');unsOpen=false;itemsOpen=false;sheetMode='';openRounds={};shareViewIdx=-1;shareApplySource=null;shareDuplicateGuard=false;}
  function saveStg(start){
    var applying=shareApplySource;
    if(!String(cur.name||'').trim()){cur.name='我的策略';}
    cur.name=String(cur.name).trim();
    if(applying){
      if(cur.name.length<2||cur.name.length>12){toast('策略名称需为 2–12 个字');return;}
      if(stgPlans.some(function(p){return p.name===cur.name;})){toast('已有同名策略 · 请换一个名称');return;}
      if(applying.requireChange&&!shareCfgChanged(cur,applying.original)){toast('请至少修改一项核心规则后再另存');return;}
      cur.shareSource={key:applying.key,owner:applying.owner,name:applying.name,modified:shareCfgChanged(cur,applying.original)};
      cur.official=false;delete cur.tplKey;
    }
    if(editIdx>=0){
      var old=stgPlans[editIdx];
      var wasOff=old.status==='off',before={};for(var bk in old){before[bk]=old[bk];}for(var k in cur){old[k]=cur[k];}
      logSetChange(old,'编辑向导修改',before);
      if(start){old.status='run';startRun(old);}
      if(start&&wasOff){
        old.reports=old.reports||[];
        old.reports.unshift({t:'09:02',title:'策略已启用 · 监测中',s:'开始时间 09:02；从下一期开始按当前设置监测。',set:true,eventType:'enabled',origin:true});
      }
      toast(start?'策略已更新并启用 · 正在监测中':'修改已保存');
    }else{
      cur.status=start?'run':'off';cur.pnl=start?120:0;if(start){startRun(cur);}
      if(!applying){cur.name=uniqueName(cur.name);}
      /* 创建完成由 Toast 反馈；执行动态从真正启用时开始。 */
      cur.reports=cur.reports||[];
      if(start){cur.reports.unshift({t:'09:02',title:'策略已启用 · 监测中',s:'开始时间 09:02；从下一期开始按当前设置监测。',set:true,eventType:'enabled',origin:true});}
      stgPlans.push(cur);
      selIdx=stgPlans.length-1;
      toast(start?'策略已启动 · 正在监测中':'策略已保存 · 可稍后启动');
    }
    cur=null;closeSheet();renderHome();syncSharedCards();
  }

  /* ── 策略详情（点卡片）── */
  function openDetail(i){
    var p=stgPlans[i];if(!p)return;
    cur=p;editIdx=i;
    /* 已急停=重启 drawer；未启动=启动 drawer：两者结构相同（设定 Summary + 修改/启用），
       区别仅在于急停多一段往期报告。运行中=常规详情。 */
    var isStop=p.status==='stop',isOff=p.status!=='run'&&p.status!=='stop';
    sheetMode=isStop?'restart':(isOff?'launch':'detail');
    var h;
    if(isStop){h='<div class="cf-h">重新启用 · '+p.name+'</div><div class="cf-meta">重新启用前，请确认当前策略的执行条件</div>';}
    else if(isOff){h='<div class="cf-h">启动 I '+p.name+'</div>';}
    else{
      h='<div class="stg-dtitle"><div class="cf-h" style="margin:0;flex:1;">'+p.name+'</div><span class="stg-status">运行中</span></div>';
      h+='<div class="cf-meta" style="margin-top:4px;">'+sumText(p,3)+'</div>';
    }
    /* 急停后的 Drawer 只负责预览设置；修改另进编辑流程，避免状态、历史与输入混排。 */
    if(isStop){h+=restartPreview(p);}else{h+='<div class="stg-grid">'
      +'<div class="stg-fld"><span>玩法模式</span><b>'+p.mode+'</b></div>'
      +'<div class="stg-fld"><span>'+(p.mode==='定位'?'热 / 冷号':'执行方向')+'</span><b>'+(p.mode==='定位'?(p.hot+' / '+p.cold):p.dir)+'</b></div>'
      +'<div class="stg-fld"><span>触发区间</span><b>'+(p.mode==='定位'?'—':('≥'+p.minS+' · ≤'+p.maxS))+'</b></div>'
      +'<div class="stg-fld"><span>投注方式</span><b>'+p.style+'</b></div>'
      +fld('amount','每注金额','number')+fld('rounds','买几回合','number')
      +'<div class="stg-fld"><span>止盈 / 止损（合计）</span><b>+'+p.tp+' / −'+p.sl+'</b></div>'
      +'<div class="stg-fld"><span>完成后</span><b>'+(p.loop===false?'只执行一次':'持续监测')+'</b></div>'
      +'<div class="stg-fld"><span>恢复后</span><b>'+(p.resumeMode||'继续')+'</b></div>'
      +'<div class="stg-fld"><span>暂停时段</span><b>'+((p.pause&&p.resume)?(p.pause+'–'+p.resume):'未设置')+'</b></div>'
      +'</div>';}
    if(p.status==='run'){h+='<div class="tipbar2" style="margin-top:10px;">执行情况：已投 3 回合 · 当前盈亏 <b>+'+(p.pnl||0)+'</b> · 正按「'+p.dir+'」等待下一次触发。</div>';}
    if(p.status==='run'){h+='<div style="text-align:right;margin-top:9px;"><span class="bustlink" data-act="stgfulledit">进入完整编辑（5 步向导）›</span></div>';}
    if(p.status==='run'){
      h+='<div class="cf-btns" style="margin-top:12px;"><button class="ghost" data-act="stgclose">关闭</button><button class="ghost" style="color:var(--red);border-color:#F5C9C9;" data-act="stgask" data-kind="stop" data-arg="'+i+'">急停</button><button class="cta" data-act="stgdsave">保存修改</button></div>';
    }else if(isStop){
      h+='<div class="cf-btns" style="margin-top:12px;"><button class="ghost" data-act="stgedit" data-arg="'+i+'">修改设置</button><button class="cta" data-act="stgresume" data-arg="'+i+'">重新启用</button></div>';
    }else{
      h+='<div class="cf-btns" style="margin-top:12px;"><button class="ghost" data-act="stgedit" data-arg="'+i+'">修改</button><button class="cta" data-act="stgstartgo" data-arg="'+i+'">启用</button></div>';
    }
    var b=$('#stgSheetBody');if(b){b.innerHTML=h;}
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }

  /* ── Drawer A「已急停 I 名称」：急停后的报告页 ──
     已结盈亏 → 执行摘要 → 未结投注（收起，含可赢 @1.99）→ 结算说明；按钮：重新启动 / 我知道了。 */
  var unsOpen=false,itemsOpen=false,ODDS=1.99,sheetMode='';
  function stopReportBody(p){
    var pv=p.pnl||0,neg=pv<0;
    var items=betItemsOf(p),doneR=Math.min(3,Math.max(1,inum(p.rounds,3)));
    var spent=0;for(var r=1;r<=doneR;r++){spent+=betAtRound(p,r);}spent*=items.length;
    var h='';
    if(p.settled){
      var ctx2=pv<0?'距止损 −'+p.sl+' 还有 '+Math.max(0,p.sl-Math.abs(pv))+' · 由你手动截停，风控未触发':'全部注单已结算 · 本次急停已完结';
      h+='<div class="sr-pnl"><span>最终盈亏（已全部结算）</span><b class="'+(pv<0?'lose':'')+'">'+(pv>=0?'+':'−')+Math.abs(pv)+' 额度</b><i>'+ctx2+'</i></div>';
    }else{
      var ctx=neg
        ?'距止损 −'+p.sl+' 还有 '+Math.max(0,p.sl-Math.abs(pv))+' · 由你手动截停，风控未触发'
        :(pv>0?'截停时处于领先 · 最终盈亏以未结注单结算后为准':'已结部分持平 · 最终盈亏以未结注单结算后为准');
      h+='<div class="sr-pnl"><span>已结盈亏</span><b class="'+(neg?'lose':'')+'">'+(pv>=0?'+':'−')+Math.abs(pv)+' 额度</b><i>'+ctx+'</i></div>';
    }
    h+='<div class="stg-metrics">'
      +'<div class="mt"><span>执行回合</span><b>第 '+doneR+' / '+p.rounds+' 回合</b></div>'
      +'<div class="mt"><span>运行时长</span><b>36 分钟</b></div>'
      +'<div class="mt"><span>已投注项</span><b>'+(items.length*doneR)+' 注</b></div>'
      +'<div class="mt"><span>累计投入</span><b>'+spent+' 额度</b></div>'
      +'</div>';
    /* 与重启 drawer 共用的执行情况组件（游戏 · 回合概况 · 按回合分组的投注项目） */
    h+=restartInfo(p);
    if(p.settled){
      return h+'<div class="rp-note">全部注单已结算完毕，未用预算已退回余额。</div>';
    }
    var uns=items.slice(0,Math.min(3,items.length)),unsTotal=0,unsRows='';
    uns.forEach(function(nm){
      var amt=betAtRound(p,doneR);unsTotal+=amt;
      var win=Math.round(amt*(ODDS-1)*10)/10;
      unsRows+='<div class="tr"><span>'+nm+'</span><span>第090期</span><span>待开奖</span><span class="num">'+amt+'</span><span class="num win">'+win+'</span></div>';
    });
    h+='<div class="unsettled'+(unsOpen?' open':'')+'">'
      +'<div class="uns-h" data-act="stguns"><b>未结投注</b><span>'+uns.length+' 笔</span><span class="uns-amt">未结额度<b>'+unsTotal+'</b></span><i class="uns-caret">⌄</i></div>'
      +'<div class="uns-list"><div class="uns-tbl">'
      +'<div class="tr th"><span>投注项</span><span>期号</span><span>状态</span><span class="num">金额</span><span class="num">可赢</span></div>'
      +unsRows
      +'</div></div>'
      +'</div>'
      +'<div class="rp-note">未结注单已推出、不可撤回，将按开奖正常结算并计入最终盈亏；可赢按 1.99 赔率估算。</div>';
    return h;
  }
  function openStopReport(i){
    var p=stgPlans[i];if(!p)return;
    cur=p;editIdx=i;sheetMode='report';
    var h='<div class="cf-h">已急停 I '+p.name+'</div>'
      +stopReportBody(p)
      +'<div class="cf-btns" style="margin-top:12px;"><button class="ghost" data-act="stgdetail" data-arg="'+i+'">重新启动</button><button class="cta" data-act="stgclose">我知道了</button></div>';
    var b=$('#stgSheetBody');if(b){b.innerHTML=h;}
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }
  /* ── Drawer B「重启 I 名称」· 执行情况行 ──
     竖线分隔：游戏 │ 回合 │ 每回合投入 │ 投注项目(可展开) │ 当前盈亏。
     展开后按回合分组（默认全部收起）：组头 = 期号 · 项数 · 本回合投入 · 本回合盈亏，一眼可估。 */
  var openRounds={};
  function restartPreview(p){
    function f(l,v,cls){return '<div class="restart-field'+(cls?' '+cls:'')+'"><span>'+l+'</span><b>'+v+'</b></div>';}
    function g(t,s,body){return '<section class="restart-group"><div class="restart-gh"><b>'+t+'</b><span>'+s+'</span></div><div class="restart-fields">'+body+'</div></section>';}
    var start=f('玩法模式',p.mode||'—')+f('执行方向',p.mode==='定位'?('热 '+p.hot+' / 冷 '+p.cold):p.dir)+f(p.dir==='反投'?'单跳条件':'长龙条件',p.mode==='定位'?'动态选号':('≥'+p.minS+'  ≤'+p.maxS));
    var bet=f('投注方式',p.style||'—')+f('每注金额',p.amount)+f('最多回合',p.rounds+' 回');
    var stop=f('止盈','+'+p.tp,'win')+f('止损','−'+p.sl,'lose')+f('暂停时段',((p.pause&&p.resume)?(p.pause+'–'+p.resume):'未设置'));
    var after=f('完成后',p.loop===false?'只执行一次':'持续监测')+f('恢复执行',p.resumeMode||'继续');
    return '<div class="restart-preview"><div class="restart-state"><i></i><div><b>当前状态：已急停</b><span>重新启用后将按以下设置恢复监测</span></div></div>'
      +g('什么时候开始','满足条件后开始执行',start)+g('怎么投注','触发后的投注规则',bet)+g('什么时候停止','触发条件将停止执行',stop)+g('停止以后','策略结束后的行为',after)+'</div>';
  }
  function restartInfo(p){
    var pv=p.pnl||0;
    var items=betItemsOf(p),doneR=Math.min(3,Math.max(1,inum(p.rounds,3)));
    var total=items.length*doneR;
    var per=p.style==='倍投'?('倍投 ¥'+p.amount+' 起/回合'):('固定投 ¥'+p.amount+'/回合');
    var h='<div class="rr-bar">'
      +'<div class="rr-top"><span class="rr-game">PK10</span><span class="rr-info">已执行 '+doneR+'/'+p.rounds+' 回合 · '+per+'</span><span class="rr-pnl">当前盈亏 <b class="'+(pv<0?'lose':'win')+'">'+(pv>=0?'+':'−')+Math.abs(pv)+'</b></span></div>'
      +'<div class="rr-toggle'+(itemsOpen?' open':'')+'" data-act="stgitems">共 '+total+' 个投注项目 <em class="uns-caret">⌄</em></div>'
      +'</div>';
    if(!itemsOpen)return h;
    for(var r=doneR;r>=1;r--){
      var pend=!p.settled&&r===doneR;
      var rows='',stake=0,sum=0;
      for(var ix=0;ix<items.length;ix++){
        var amt=betAtRound(p,r);stake+=amt;
        if(pend){
          rows+='<div class="tr"><span>'+items[ix]+'</span><span>待开奖</span><span class="num">'+amt+'</span><span class="num" style="color:var(--muted)">—</span></div>';
        }else{
          /* 演示结果：按 (回合+序号) 交替命中，可赢 @1.99 */
          var hit=(r+ix)%3!==1;
          var res=hit?Math.round(amt*(ODDS-1)*10)/10:-amt;
          sum=Math.round((sum+res)*10)/10;
          rows+='<div class="tr"><span>'+items[ix]+'</span><span>'+(hit?'命中':'未中')+'</span><span class="num">'+amt+'</span><span class="num '+(res<0?'lose':'win')+'">'+(res>=0?'+':'−')+Math.abs(res)+'</span></div>';
        }
      }
      var pnlTag=pend?'<em class="zero">待开奖</em>':'<em class="'+(sum<0?'lose':'win')+'">'+(sum>=0?'+':'−')+Math.abs(sum)+'</em>';
      h+='<div class="rd-grp'+(openRounds[r]?' open':'')+'">'
        +'<div class="rd-h" data-act="stground" data-arg="'+r+'"><b>第 '+r+' 回合</b><span>第0'+(86+r)+'期 · '+items.length+' 项 · 投入 '+stake+'</span>'+pnlTag+'<i class="uns-caret">⌄</i></div>'
        +'<div class="uns-tbl cols4"><div class="tr th"><span>投注项</span><span>状态</span><span class="num">金额</span><span class="num">盈亏</span></div>'+rows+'</div>'
        +'</div>';
    }
    return h;
  }
  /* 任何途径修改设置：写入执行动态（浅蓝底 · 展示新设置），并摘掉「官方」标 */
  function logSetChange(p,via,before){
    p.reports=p.reports||[];
    var effective=p.status==='stop'?'重新启用后生效':(p.status==='run'?'下期生效':'启用后生效');
    var defs=[['每注金额','amount',''],['最多回合','rounds',' 回'],['倍投倍数','multi','×'],['止盈','tp',''],['止损','sl',''],['暂停开始','pause',''],['恢复时间','resume','']],rows=[];
    if(before){defs.forEach(function(d){var a=before[d[1]],b=p[d[1]];if(String(a==null?'未设置':a)!==String(b==null?'未设置':b)){rows.push('<span><i>'+d[0]+'</i><b>'+(a||'未设置')+d[2]+' → '+(b||'未设置')+d[2]+'</b></span>');}});}
    if(!rows.length){rows.push('<span><i>当前设置</i><b>'+sumSlash(p)+'</b></span>');}
    p.reports.unshift({t:'09:45',title:'策略设置已修改 · '+effective,s:'<div class="feed-changes">'+rows.join('')+'</div>'+(via?'<div class="feed-change-via">'+via+'</div>':''),set:true,eventType:'edited'});
    p.official=matchesOfficialConfig(p);
  }
  /* 启用（重启）前让玩家二选一：继续上一回合 / 重新开始 */
  var resumeIdx=-1;
  function askResumeMode(i){
    var m=$('#planModal');if(!m)return;
    resumeIdx=i;
    m.querySelector('#pmTitle').textContent='如何启用？';
    m.querySelector('#pmBody').innerHTML='<div class="pm-opts">'
      +'<button class="pm-opt" data-act="stgresumego" data-arg="resume"><b>继续上一回合</b><span>保留回合进度与累计盈亏，从中断处继续。</span></button>'
      +'<button class="pm-opt" data-act="stgresumego" data-arg="fresh"><b>重新开始</b><span>回合进度与盈亏清零，按当前设定开新一轮。</span></button>'
      +'</div>';
    m.querySelector('#pmBtns').innerHTML='<button class="ghost" data-act="pmclose">取消</button>';
    m.classList.add('open');
  }
  /* 模拟未结注单开奖结算（原型：急停 30 秒后）：合并最终盈亏 + 向执行动态推报告 */
  function scheduleSettle(p){
    if(p.settleTimer)return;
    p.settleTimer=setTimeout(function(){
      p.settleTimer=null;
      if(p.status!=='stop'||p.settled)return;
      var delta=108.4; /* 3 注命中 1 注：+158.4 − 40 − 10 */
      p.settled=true;p.pnl=(p.pnl||0)+delta;p.runPnl=(p.runPnl||0)+delta;
      p.sharePending=0;p.shareSettled=inum(p.shareSettled,0)+1;p.shareRecent=(p.shareRecent||[]).concat('win').slice(-10);
      p.reports=p.reports||[];
      p.reports.unshift({t:'09:53',title:'第00090期 · 命中 1/3 注',s:'本期投入 210；冠军 大 +158.4、第五名 小 −40、亚军 单 −10；本期盈亏 +108.4。',set:true,pnl:108.4,kind:'result',result:'win',period:'090'});
      renderHome();
      /* 若急停报告 / 重启 drawer 仍开着，按各自版式刷新为已结算版 */
      var sheetOpen=$('#stgSheet')&&$('#stgSheet').classList.contains('open');
      var idx=stgPlans.indexOf(p);
      if(sheetOpen&&editIdx===idx&&cur===p){if(sheetMode==='report'){openStopReport(idx);}else if(sheetMode==='restart'){openDetail(idx);}}
      toast('「'+p.name+'」未结注单已结算 · 最终盈亏 '+((p.pnl>=0?'+':'−')+Math.abs(p.pnl)));
    },30000);
  }

  /* ── 策略设置说明（与新建向导 5 步的设置项一一对应）── */
  function openHelp(){
    var h='<div class="cf-h">策略设置说明</div><div class="cf-meta">与新建策略向导中的设置项一一对应</div><div class="stg-help">'
      +'<div><b>玩法模式</b><span>两面用于大小、单双、龙虎、大龙大虎等方向；定位用于名次热号、冷号（车号指定）。</span></div>'
      +'<div><b>大龙大虎</b><span>第一至第五名车号总和 大于 第六至第十名总和为【大龙】，小于为【大虎】；总和为 55，必分胜负、无和局，共 1 个投注项。</span></div>'
      +'<div><b>排除名次</b><span>两面模式下可勾选不参与的名次，被排除的名次不会生成投注项，可减少同时触发的注数。</span></div>'
      +'<div><b>热号 / 冷号（定位）</b><span>按当日出现频率选车号：热 N 取最热的前 N 个号，冷 M 取最冷的前 M 个号，每期自动更新。</span></div>'
      +'<div><b>跟投 / 反投</b><span>跟投：同方向连开（长龙）达到区间后，顺方向继续投。反投：方向交替（单跳）达到区间后，投上一期的反向——大、小、大 → 第 4 期投小。</span></div>'
      +'<div><b>触发区间</b><span>跟投数长龙、反投数单跳：连续期数达到「最低」才触发；已超过「最高」则不再执行，避免追过长走势。可能多个投注项同时触发、各自独立执行。</span></div>'
      +'<div><b>每注金额</b><span>每个投注项单注的基础金额；倍投模式下按此金额起投递增。</span></div>'
      +'<div><b>买几回合</b><span>触发后固定连续执行的回合数：长龙中断、中途输赢都不会提前停止，只有止盈止损能截停。</span></div>'
      +'<div><b>固定投 / 倍投</b><span>固定投每回合金额相同；倍投每回合按倍数递增（中奖也不重置），最后「尾数回合数量」改用较低的尾数倍率，压住尾部风险。</span></div>'
      +'<div><b>执行中再触发</b><span>执行途中同一目标又形成新长龙时，可叠加一条并行执行，但需玩家确认后才生效。</span></div>'
      +'<div><b>止盈 / 止损</b><span>全部被触发的投注项合并累计盈亏：合计达到止盈或止损，整套策略立即停止；最坏投入见确认页的风险预估。</span></div>'
      +'<div><b>暂停 / 恢复</b><span>到点自动暂停与恢复；「继续」承接暂停前的回合进度，「重置」从第 1 回合重新开始。</span></div>'
      +'<div><b>完成后</b><span>持续监测：一轮执行结束后继续等待下一次触发；只执行一次：完成本轮即停止。</span></div>'
      +'</div><div class="cf-btns" style="margin-top:14px;"><button class="cta" data-act="stgclose">知道了</button></div>';
    var b=$('#stgSheetBody');if(b){b.innerHTML=h;}
    var m=$('#stgSheet');if(m)m.classList.add('open');
  }

  /* ── 执行报告 ── */
  function openReport(){
    var p=stgPlans[0]||{name:'策略',minS:3,dir:'跟投'};
    var h='<div class="cf-h">'+p.name+' · 第089期执行报告</div><div class="cf-meta">PK10 · '+p.dir+' · 本期执行完成</div>'
      +'<div class="stg-metrics">'
      +'<div class="mt"><span>本期盈亏</span><b class="win">+120 额度</b></div>'
      +'<div class="mt"><span>执行注数</span><b>6 注</b></div>'
      +'<div class="mt"><span>命中 / 未中</span><b>4 / 2</b></div>'
      +'<div class="mt"><span>执行后状态</span><b>监测中</b></div>'
      +'</div>'
      +'<div class="cf-list">'
      +'<div class="cfrow"><span class="cf-nm">冠军 大</span><span class="cf-od">命中</span><span class="cf-amt" style="color:var(--win)">+49</span></div>'
      +'<div class="cfrow"><span class="cf-nm">冠军 单</span><span class="cf-od" style="color:var(--muted)">未中</span><span class="cf-amt" style="color:var(--red)">−50</span></div>'
      +'<div class="cfrow"><span class="cf-nm">亚军 小</span><span class="cf-od">命中</span><span class="cf-amt" style="color:var(--win)">+49</span></div>'
      +'<div class="cfrow"><span class="cf-nm">第三名 龙</span><span class="cf-od">命中</span><span class="cf-amt" style="color:var(--win)">+49</span></div>'
      +'</div>'
      +'<div class="tipbar2">当前可用余额：<b>240 额度</b><br>本次任务完成后，策略已回到等待状态，继续等待下一次长龙 ≥ '+p.minS+'。</div>'
      +'<div class="cf-btns" style="margin-top:12px;"><button class="ghost" data-act="stgrepclose">关闭</button><button class="cta" data-act="stgrepedit">编辑策略</button></div>';
    var b=$('#stgReportBody');if(b){b.innerHTML=h;}
    var m=$('#stgReport');if(m)m.classList.add('open');
  }
  function closeReport(){var m=$('#stgReport');if(m)m.classList.remove('open');}

  /* ── 急停使用底部确认 Drawer；最终确认保留强红色。删除仍走居中确认。── */
  function askConfirm(kind,i){
    confirmKind=kind;confirmIdx=i;
    var p=stgPlans[i],nm=p?('「'+p.name+'」'):'本策略';
    if(kind==='stop'){
      var b=$('#stgSheetBody');if(b){b.innerHTML='<div class="cf-h">确认急停？</div><div class="cf-meta">急停后将停止新的下注；已提交注单无法撤回，并按正常开奖结算。</div><div class="cf-btns" style="margin-top:16px;"><button class="ghost" data-act="stgclose">取消</button><button class="cta danger" data-act="stgconfirmok">确认急停</button></div>';}
      sheetMode='stopconfirm';var sm=$('#stgSheet');if(sm)sm.classList.add('open');return;
    }
    var m=$('#planModal');if(!m)return;
    m.querySelector('#pmTitle').textContent=kind==='stop'?'确认急停？':'确认删除？';
    m.querySelector('#pmBody').innerHTML=kind==='stop'
      ?'急停后，将<b>停止新的下注</b>；<br>已提交的注单<b>无法撤回</b>，并按正常开奖结算。'
      :('删除 '+nm+' 后<b>无法恢复</b>，历史记录一并移除。');
    m.querySelector('#pmBtns').innerHTML='<button class="ghost" data-act="pmclose">取消</button><button class="cta danger" data-act="stgconfirmok">'+(kind==='stop'?'确认急停':'删除')+'</button>';
    m.classList.add('open');
  }
  function doConfirm(){
    var m=$('#planModal');if(m)m.classList.remove('open');
    if(confirmKind==='stop'){var sm=$('#stgSheet');if(sm)sm.classList.remove('open');}
    var p=stgPlans[confirmIdx];if(!p)return;
    if(confirmKind==='stop'){
      /* 急停不再单发 T2 报告——feed 顶部的「已急停」当期报告已合并含结算 */
      p.status='stop';p.settled=false;p.stopKind='急停';stopRun(p);
      scheduleSettle(p);toast('策略已急停 · 未用预算已退回');
    }
    else{stgPlans.splice(confirmIdx,1);closeSheet();toast('策略已删除');}
    renderHome();
  }

  /* ── 输入（字段实时写回 cur + 更新摘要行）── */
  document.addEventListener('input',function(e){
    var t=e.target;if(!t||!t.getAttribute)return;
    var fk=t.getAttribute('data-feed-filter');
    if(fk&&filterDraft){filterDraft[fk]=fk==='period'?String(t.value||'').replace(/\D/g,''):String(t.value||'');if(fk==='period'&&t.value!==filterDraft[fk])t.value=filterDraft[fk];refreshFilterPreview();return;}
    var k=t.getAttribute('data-stgk');if(!k||!cur)return;
    cur[k]=(t.type==='number')?num(t.value,cur[k]):t.value;
    var s=$('#stgCurSum');if(s){s.innerHTML=sumChips(cur,Math.min(step,3));}
    /* 金额 / 回合 / 倍投参数直接影响预估：输入时实时重算整个预估区 */
    var eb=$('#stgEstBox');
    if(eb){eb.innerHTML=estBoxHtml();}
    /* 重启 drawer 里改了字段 →「启用」变「保存修改」（先保存、再启用） */
    if(cur&&cur.status==='stop'){
      var rc=root.querySelector('#stgSheetBody [data-act="stgresume"]');
      if(rc){rc.textContent='保存修改';rc.setAttribute('data-act','stgrsave');}
    }
  });

  /* ── 事件委托（仅处理 stg* 动作；与主模块并存互不影响）── */
  document.addEventListener('click',function(e){
    /* 自动投输入框的 ➤：确认执行当前指令 */
    var snd=e.target.closest?e.target.closest('.autodash .inputbar .sendico'):null;
    if(snd){execCmd();return;}
    var act=e.target.closest?e.target.closest('[data-act]'):null;
    /* 点击菜单以外区域 → 关闭齿轮菜单 */
    if(!act||(act.getAttribute('data-act')||'').indexOf('stgmenu')!==0){closeStgMenu();}
    if(!act)return;
    var a=act.getAttribute('data-act'),arg=act.getAttribute('data-arg');
    if(a==='stgmenu'){openStgMenu(parseInt(arg,10),act);}
    else if(a==='stgmenuedit'){closeStgMenu();openEdit(parseInt(arg,10));}
    else if(a==='stgmenudel'){closeStgMenu();askConfirm('delete',parseInt(arg,10));}
    else if(a==='stgtab'){selIdx=parseInt(arg,10)||0;updateFeed();renderTabs();renderCmdPanel();}
    else if(a==='dashcmds'){renderCmdPanel();}
    else if(a==='stgsetup'){
      if(stgPlans.length>=3){toast('最多 3 个策略 · 删除其一后可再建');return;}
      if(arg&&TPLS[arg]){openQuickStart(arg);}else{openSetup(arg||'custom');}
    }
    else if(a==='stgcloneedit'){openTemplateEdit(arg||'trial');}
    else if(a==='stgqadjust'){var qm=$('#startModal');if(qm)qm.classList.remove('open');openSetup(quickKind||'trial');}
    else if(a==='stgqconfirm'){
      var qm2=$('#startModal');if(qm2)qm2.classList.remove('open');
      var qc=tplCfg(quickKind||'trial');qc.status='run';qc.pnl=0;startRun(qc);
      qc.name=uniqueName(qc.name);
      qc.reports=[
        {t:'09:02',title:'策略已启用 · 监测中',s:'开始时间 09:02；从下一期开始按当前设置监测。',set:true,eventType:'enabled',origin:true}
      ];
      stgPlans.push(qc);selIdx=stgPlans.length-1;
      toast('策略已启动 · 正在监测中');renderHome();
    }
    else if(a==='stgselect'){selIdx=parseInt(arg,10)||0;renderHome();}
    else if(a==='stgfilteropen'){openFilterSheet();}
    else if(a==='stgfilterclose'){closeFilterSheet();}
    else if(a==='feedkind'){if(filterDraft){filterDraft.kind=arg||'all';if(filterDraft.kind!=='all')filterDraft.type='bet';if(filterDraft.kind!=='settled')filterDraft.result='all';renderFilterSheet();}}
    else if(a==='feedtype'){if(filterDraft){filterDraft.type=arg||'all';if(filterDraft.type!=='bet')filterDraft.kind='all';if(filterDraft.type==='status')filterDraft.openMore='';renderFilterSheet();}}
    else if(a==='feedmore'){if(filterDraft){filterDraft.openMore=filterDraft.openMore===arg?'':arg;renderFilterSheet();}}
    else if(a==='feedresult'){if(filterDraft){filterDraft.result=arg||'all';renderFilterSheet();}}
    else if(a==='feedround'){if(filterDraft){filterDraft.round=arg||'all';filterDraft.openMore=filterDraft.round==='custom'?'round':'';renderFilterSheet();}}
    else if(a==='feeddatepick'){
      if(!filterDraft)return;
      if(arg==='custom'){if(window.__im168DtOpen){window.__im168DtOpen('stgfeeddate');}}
      else{filterDraft.date=arg||'today';filterDraft.dateLabel='';renderFilterSheet();}
    }
    else if(a==='feedreset'){filterDraft={kind:'all',type:'all',result:'all',period:'',round:'all',roundFrom:'',roundTo:'',date:'today',dateLabel:'',openMore:''};renderFilterSheet();}
    else if(a==='feedapply'){
      if(filterDraft){feedKind=filterDraft.kind;feedType=filterDraft.type||'all';feedResult=filterDraft.result;feedPeriod=filterDraft.period||'';feedRound=filterDraft.round||'all';feedRoundFrom=filterDraft.roundFrom||'';feedRoundTo=filterDraft.roundTo||'';feedDate=filterDraft.date;feedDateLabel=filterDraft.dateLabel||'';}
      closeFilterSheet();updateFeed();
    }
    else if(a==='stguns'){unsOpen=!unsOpen;if(sheetMode==='report'){openStopReport(editIdx);}else{openDetail(editIdx);}}
    else if(a==='stgitems'){itemsOpen=!itemsOpen;if(sheetMode==='report'){openStopReport(editIdx);}else{openDetail(editIdx);}}
    else if(a==='stground'){openRounds[arg]=!openRounds[arg];if(sheetMode==='report'){openStopReport(editIdx);}else{openDetail(editIdx);}}
    else if(a==='stgpx'){pxOpen[arg]=!isPxOpen(arg,act.getAttribute('data-def')==='1');updateFeed();}
    else if(a==='stgpxl'){e.stopPropagation();pxOpen[arg]=!isPxOpen(arg,act.getAttribute('data-def')==='1');updateFeed();}
    else if(a==='ademo'){runAutoDemo(arg);}
    else if(a==='sharedemo'){runShareDemo(arg);}
    else if(a==='specgallery'){openSpecGallery();}
    else if(a==='specclose'){closeSpecGallery();}
    else if(a==='stgedit'){openEdit(parseInt(arg,10));}
    else if(a==='stgshareview'){openSharedRun(parseInt(arg,10));}
    else if(a==='stgsharereport'){openSharedReport(parseInt(arg,10));}
    else if(a==='stgshareapply'){openShareApplyChoice(parseInt(arg,10));}
    else if(a==='stgshareexisting'){openExistingSharedStrategy(parseInt(arg,10));}
    else if(a==='stgshare'){
      var shp=stgPlans[parseInt(arg,10)];if(!shp)return;
      if(shp.status==='off'){toast('策略启用或完成运行后才可以分享');return;}
      var sharedAt=activeShareIndex(shp);
      if(sharedAt>=0){syncSharedCards();toast('本次运行已在聊天室实时分享');return;}
      var ent={plan:shp,owner:'我',runId:shp.runId,active:shp.status==='run'};sharedStgs.push(ent);
      if(shp.status==='stop'||shp.complete){freezeShare(ent,shp.complete?'ended':'stopped');}
      appendShareCard(ent,sharedStgs.length-1);
      toast(shp.status==='run'?'已分享到聊天室 · 数据会随本轮运行实时更新':'本轮结果已分享到聊天室');
    }
    else if(a==='stguse'){openShareApplyChoice(parseInt(arg,10));}
    else if(a==='stgusedirect'){beginSharedApply(parseInt(arg,10),'direct');}
    else if(a==='stguseedit'){beginSharedApply(parseInt(arg,10),'edit');}
    else if(a==='stgshareeditcopy'){shareDuplicateGuard=true;beginSharedApply(parseInt(arg,10),'edit');}
    else if(a==='stgsharegotoplan'){var mineIdx=parseInt(arg,10);if(stgPlans[mineIdx]){selIdx=mineIdx;cur=null;closeSheet();location.hash='autos';renderHome();setTimeout(function(){openDetail(mineIdx);},60);}}
    else if(a==='stgdirectsave'){completeDirectShareApply(parseInt(arg,10),false);}
    else if(a==='stgdirectstart'){completeDirectShareApply(parseInt(arg,10),true);}
    else if(a==='stgdirectback'){openShareApplyChoice(sharePendingIdx);}
    else if(a==='stgslotpick'){
      var pick=parseInt(arg,10),pickPlan=stgPlans[pick];if(!shareSlotReplaceable(pickPlan))return;
      shareReplaceIdx=pick;var pm=$('#planModal');if(pm){pm.querySelectorAll('.share-slot').forEach(function(x){x.classList.toggle('on',parseInt(x.getAttribute('data-arg'),10)===pick);});var go=pm.querySelector('[data-act="stgslotconfirm"]');if(go)go.classList.remove('dis');}
    }
    else if(a==='stgslotconfirm'){
      if(shareReplaceIdx<0||!shareSlotReplaceable(stgPlans[shareReplaceIdx])){toast('请先选择可归档的策略');return;}
      archivedStgs.push(stgPlans[shareReplaceIdx]);stgPlans.splice(shareReplaceIdx,1);selIdx=Math.max(0,Math.min(selIdx,stgPlans.length-1));
      var pmc=$('#planModal');if(pmc)pmc.classList.remove('open');var pendingShare=sharePendingIdx;shareReplaceIdx=-1;renderHome();continueSharedApply(pendingShare);
    }
    else if(a==='stgslotback'){var pmb=$('#planModal');if(pmb)pmb.classList.remove('open');cur=null;closeSheet();location.hash='chat';}
    else if(a==='stgslotmanage'){var pmm=$('#planModal');if(pmm)pmm.classList.remove('open');cur=null;closeSheet();location.hash='autos';renderHome();toast('请先停止或完成一张策略，再归档腾出卡位');}
    else if(a==='stgclose'){cur=null;closeSheet();}
    else if(a==='stgnext'){
      /* 选项默认为空：每步校验选完才能继续 */
      if(cur){
        if(step===0){
          if(!cur.mode){toast('请先选择玩法模式');return;}
          if(cur.mode==='两面'&&!(cur.plays&&cur.plays.length)){toast('请至少选择一个玩法');return;}
          if(cur.mode==='定位'&&!(cur.posSel&&cur.posSel.length)){toast('请至少选择一个位置');return;}
        }
        if(step===1&&cur.mode==='两面'&&!cur.dir){toast('请选择执行方向');return;}
        if(step===2&&!cur.style){toast('请选择资金方式');return;}
        /* 风控步骤的「恢复后是否继续回合」「完成后继续监测」可跳过，未选按默认（继续 / 持续监测）执行 */
      }
      step=Math.min(4,step+1);estOpen=false;renderStep();
    }
    else if(a==='stgq'){qOpen[arg]=!qOpen[arg];renderStep();}
    else if(a==='stgrestoreofficial'){restoreOfficialDraft();}
    else if(a==='stgestx'){estOpen=!estOpen;renderStep();}
    else if(a==='stgprev'){step=Math.max(0,step-1);estOpen=false;renderStep();}
    else if(a==='stgset'){
      var k=act.getAttribute('data-k'),v=act.getAttribute('data-v');
      if(!cur)return;
      if(k==='loop'){cur.loop=(v==='持续监测');}
      else{cur[k]=v;}
      renderStep();
    }
    else if(a==='stgstep'){
      if(!cur)return;
      var sk=act.getAttribute('data-k'),sd=parseInt(act.getAttribute('data-d'),10);
      var conf=STP[sk]||[1,1,999999],optional=(sk==='tailN'||sk==='tailM'),base={tailN:1,tailM:1.5}[sk];
      if(cur[sk]===''||cur[sk]==null){
        if(sd>0){cur[sk]=optional?base:conf[1];}
        else if(!optional){cur[sk]=conf[1];}
      }else{
        var nv=Math.round((num(cur[sk],conf[1])+sd*conf[0])*100)/100;
        if(optional&&nv<conf[1]){cur[sk]='';}
        else{if(nv<conf[1])nv=conf[1];if(nv>conf[2])nv=conf[2];cur[sk]=nv;}
      }
      renderStep();
    }
    else if(a==='stgplay'){
      if(!cur)return;
      var list=cur.plays||[],ix=list.indexOf(arg);
      if(ix>=0){list.splice(ix,1);}else{list.push(arg);}
      cur.plays=list;renderStep();
    }
    else if(a==='stgexpos'){
      if(!cur)return;
      var exl=cur.exPos||[],exi=exl.indexOf(arg);
      if(exi>=0){exl.splice(exi,1);}else{exl.push(arg);}
      cur.exPos=exl;renderStep();
    }
    else if(a==='stgpossel'){
      if(!cur)return;
      var psl=cur.posSel||[],psi=psl.indexOf(arg);
      if(psi>=0){psl.splice(psi,1);}else{psl.push(arg);}
      cur.posSel=psl;renderStep();
    }
    else if(a==='stgsave'){saveStg(false);}
    else if(a==='stgsavestart'){saveStg(true);}
    else if(a==='stgdetail'){openDetail(parseInt(arg,10));}
    else if(a==='stgfulledit'){openEdit(editIdx);}
    else if(a==='stgdsave'){cur=null;closeSheet();toast('策略设置已保存');renderHome();}
    else if(a==='stgask'){askConfirm(act.getAttribute('data-kind'),parseInt(arg,10));}
    else if(a==='stgconfirmok'){doConfirm();}
    else if(a==='stgresume'){askResumeMode(parseInt(arg,10));}
    else if(a==='stgresumego'){
      var rp=stgPlans[resumeIdx];if(!rp)return;
      var fresh=arg==='fresh';
      rp.status='run';rp.settled=false;startRun(rp,fresh);
      if(rp.settleTimer){clearTimeout(rp.settleTimer);rp.settleTimer=null;}
      if(fresh){rp.pnl=0;}
      rp.reports=rp.reports||[];
      rp.reports.unshift({t:'09:45',title:'策略已重新启用 · 监测中',s:fresh?'开始时间 09:45；回合进度已重置，本次运行统计重新计算。':'开始时间 09:45；继续上一回合进度，本次运行统计重新计算。',set:true,eventType:'enabled',origin:true});
      var pm2=$('#planModal');if(pm2)pm2.classList.remove('open');
      cur=null;closeSheet();toast(fresh?'已重新开始 · 正在监测中':'已继续上一回合 · 正在监测中');renderHome();
    }
    else if(a==='stgrsave'){
      var sp3=stgPlans[editIdx];if(!sp3)return;
      logSetChange(sp3,'重启前修改');
      toast('修改已保存 · 尚未启用');
      renderHome();openDetail(editIdx);
    }
    else if(a==='stgstart'){var sp=stgPlans[parseInt(arg,10)];if(sp){sp.status='run';sp.pnl=sp.pnl||0;startRun(sp);sp.reports=sp.reports||[];sp.reports.unshift({t:'09:02',title:'策略已启用 · 监测中',s:'开始时间 09:02；从下一期开始按当前设置监测。',set:true,eventType:'enabled',origin:true});toast('策略已启用 · 正在监测中');openDetail(parseInt(arg,10));renderHome();}}
    else if(a==='stgstartgo'){var spg=stgPlans[parseInt(arg,10)];if(spg){spg.status='run';spg.pnl=spg.pnl||0;startRun(spg);spg.reports=spg.reports||[];spg.reports.unshift({t:'09:02',title:'策略已启用 · 监测中',s:'开始时间 09:02；从下一期开始按当前设置监测。',set:true,eventType:'enabled',origin:true});cur=null;closeSheet();toast('策略已启用 · 正在监测中');renderHome();}}
    else if(a==='stghelp'){openHelp();}
    else if(a==='stgreport'){openReport();}
    else if(a==='stgrepclose'){closeReport();}
    else if(a==='stgrepedit'){closeReport();if(stgPlans.length){openDetail(0);}}
    else if(a==='openbust'){
      /* 向导里打开爆仓查询：把候选回合数同步为当前向导值（主模块已负责打开弹窗） */
      if(cur){var cv=$('#bqCandStep .val');if(cv){cv.textContent=(inum(cur.rounds,6))+' 期';}}
    }
    else if(a==='stgcmd'){
      var dc=$('#dashCmd');if(dc)dc.classList.remove('open');
      if(arg==='new'){openSetup('custom');}
      else if(arg==='help'){openHelp();}
      else if(arg==='report'){if(stgPlans.length){openReport();}else{toast('还没有执行记录 · 先建一个策略');}}
      else if(arg==='edit'){if(stgPlans.length){openDetail(0);}else{toast('还没有策略 · 先新建一个');}}
      else if(arg==='stop'){
        var ri=-1;stgPlans.forEach(function(p,i){if(ri<0&&p.status==='run')ri=i;});
        if(ri>=0){askConfirm('stop',ri);}else{toast('当前没有运行中的策略');}
      }
    }
    else if(a==='stgnew'){location.hash='autos';setTimeout(function(){openSetup('custom');},60);}
    else if(a==='stgopen'){
      location.hash='autos';
      var oi=parseInt(arg,10);
      setTimeout(function(){if(stgPlans[oi]){openDetail(oi);}else if(stgPlans.length){openDetail(0);}else{toast('该计划为演示数据 · 在这里新建你的策略');}},60);
    }
  });

  /* 双状态交互：上滑、策略卡带离开可视区 → 收合成 Sticky Tab；滚回顶部 → 展开还原 */
  var stgScrollEl=$('#stgScroll');
  if(stgScrollEl){stgScrollEl.addEventListener('scroll',function(){
    /* 接近底部 → 执行动态加载更早记录（滚动距离随之变长，收合阈值可自然达到） */
    if(stgScrollEl.scrollTop+stgScrollEl.clientHeight>stgScrollEl.scrollHeight-60){
      var p=stgPlans[selIdx];
      if(p&&(p.feedMore||0)<FEED_MAX){p.feedMore=Math.min(FEED_MAX,(p.feedMore||0)+FEED_STEP);updateFeed();}
    }
    var bar=$('#stgTabs');if(!bar)return;
    var strip=$('#stgStrip');
    if(!strip||!stgPlans.length){bar.classList.remove('show');return;}
    bar.classList.toggle('show',stgScrollEl.scrollTop>strip.offsetTop+strip.offsetHeight-6);
  });}

  /* ── 拖拽横滑（drag-to-pan）：策略卡片带 + Sticky Tab Bar ──
     按住拖动直接平移；拖动超过 6px 时抑制后续 click，不影响正常点击。
     （边缘自动滚动已按需求移除，避免与 drag 手感冲突。） */
  var stripDrag=null,stripMoved=false;
  document.addEventListener('pointerdown',function(e){
    var s=e.target.closest?e.target.closest('#stgStrip,#stgTabs'):null;if(!s)return;
    stripDrag={s:s,x0:e.clientX,lx:e.clientX};stripMoved=false;
  });
  document.addEventListener('pointermove',function(e){
    if(!stripDrag)return;
    var dx=e.clientX-stripDrag.lx;stripDrag.lx=e.clientX;
    if(Math.abs(e.clientX-stripDrag.x0)>6){stripMoved=true;}
    if(stripMoved){stripDrag.s.scrollLeft-=dx;}
  });
  function stripDragEnd(){
    stripDrag=null;
    if(stripMoved){setTimeout(function(){stripMoved=false;},0);}
  }
  document.addEventListener('pointerup',stripDragEnd);
  document.addEventListener('pointercancel',stripDragEnd);
  /* 拖动结束后的第一次 click 抑制（捕获阶段，避免误触卡片动作） */
  document.addEventListener('click',function(e){
    if(stripMoved&&e.target.closest&&e.target.closest('#stgStrip,#stgTabs')){
      e.stopPropagation();e.preventDefault();stripMoved=false;
    }
  },true);

  /* 爆仓查询「使用候选回合数」同步回向导（主模块已写回旧编辑页 + 关弹窗） */
  var bqApplyBtn2=$('#bqApply');
  if(bqApplyBtn2){bqApplyBtn2.addEventListener('click',function(){
    var sheetOpen=$('#stgSheet')&&$('#stgSheet').classList.contains('open');
    if(!sheetOpen||!cur)return;
    var cv=$('#bqCandStep .val');if(cv){cur.rounds=inum(cv.textContent,cur.rounds);renderStep();}
  });}

  renderHome();
})();

/* ══════════ 查爆仓 Tab 模块（v3.1 · 2026-07-20 双屏流程：表单 → 结果）══════════
   表单屏（旧版原样：投注模式 / 回测方式 / 长龙区间 / 候选下注回合数）→ 立即查询 → 结果屏（单页重构：爆仓分布 + 候选滑杆 + 记录）。
   立即查询把表单条件映射到结果状态（长龙区间取最低值→结果单选长龙；候选回合数→候选滑杆）；结果屏「重置条件」清空并返回表单。
   进入先弹首次引导 #bustGuide。生成/最近查询/引导沿用 #bqGen / #bqRecent / #bustGuide 抽屉。
   结果示例数据 = 基准曲线 × 方向系数 × 长龙系数（非真实回测口径，接后端时替换）。 */
(function(){
  var $=function(s){return document.querySelector(s);},$$=function(s){return [].slice.call(document.querySelectorAll(s));};
  if(!$('.view-bust'))return;
  /* ── 共享数据 ── */
  var STK=['3','4','5','6','7','8','8+'];
  var CANDS=[3,4,5,6,7,8,9],CANDLB=['3期','4期','5期','6期','7期','8期','9+'];
  var DIRLB={'跟':'跟投','反':'反投'};
  var RANGE_BASE={'7d':[42,33,24,16,10,5,2,1,1],'3d':[19,14,10,7,4,2,1,0,1],'1d':[7,5,3,2,1,1,0,0,1]};
  var RANGELB={'7d':'近 7 天','3d':'近 3 天','1d':'本日'};
  var DIRF={'跟':1,'反':0.85},STKF={'3':1,'4':0.82,'5':0.66,'6':0.5,'7':0.36,'8':0.24,'8+':0.15};
  var RECBANK={
    '跟':{'7d':[['今天 14:32','冠军 大小'],['07-09 21:05','第五名 单双'],['07-07 15:48','第三名 大小'],['06-30 11:20','冠军 大小'],['06-28 20:14','第二名 单双']],
          '3d':[['今天 14:32','冠军 大小'],['07-09 21:05','第五名 单双'],['07-08 19:40','第八名 大小']],
          '1d':[['今天 14:32','冠军 大小'],['今天 09:12','第七名 单双']]},
    '反':{'7d':[['今天 13:05','亚军 单双'],['07-08 22:11','第六名 大小'],['07-06 16:20','冠军 龙虎'],['07-05 10:41','第九名 单双']],
          '3d':[['今天 13:05','亚军 单双'],['07-08 22:11','第六名 大小']],
          '1d':[['今天 13:05','亚军 单双']]}
  };
  /* ── 表单状态（旧版）与结果状态（新版）── */
  var fs={mode:null,dir:null,min:3,max:8,posN:3,hot:3,cold:2};
  var rsDEF={dir:'跟',streak:'6',range:'7d',ci:3};
  var rs={dir:'跟',streak:'6',range:'7d',ci:3};
  var SAVED_MAX=6;
  var saved=[
    {dir:'跟',streak:'6',range:'7d',ci:3,ts:'07-08 21:14'},
    {dir:'反',streak:'5',range:'3d',ci:4,ts:'07-05 15:02'}
  ];
  function nowStamp(){var d=new Date(),p=function(n){return (n<10?'0':'')+n;};return p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());}
  var toastTimer=null;
  function bqToast(msg){var t=$('#gToast');if(!t){t=document.createElement('div');t.id='gToast';var sc=$('.screen');(sc||document.body).appendChild(t);}t.textContent=msg;t.classList.add('open');clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove('open');},2400);}
  var proxy=document.createElement('span');proxy.style.display='none';document.body.appendChild(proxy);
  function proxyClick(act){proxy.setAttribute('data-act',act);proxy.textContent='';proxy.click();}

  /* ── 表单屏（旧版逻辑）── */
  function candVal(){var v=$('#bqCandField .val');if(!v){return 6;}var n=parseInt(v.textContent,10);return isNaN(n)?6:n;}
  function setCandVal(n){var txt=n+' 期';[$('#bqCandField .val'),$('#bqCandFieldPos .val')].forEach(function(v){if(v){v.textContent=txt;}});}
  function syncDir(){var f=fs.dir==='跟投';var lab=$('#bqRangeLab'),minLab=$('#bqMinLab'),maxLab=$('#bqMaxLab');if(lab){lab.textContent=f?'长龙区间':'单跳区间';}if(minLab){minLab.textContent=f?'最低长龙':'最低单跳';}if(maxLab){maxLab.textContent=f?'最高长龙':'最高单跳';}}
  function syncRangeVisibility(){var isPos=fs.mode==='定位';var ready=!isPos&&!!(fs.mode&&fs.dir);var w=$('#bqRangeWrap');if(w){w.style.display=ready?'':'none';}}
  function syncPos(){var a=$('#bqPosN'),b=$('#bqPosHot'),c=$('#bqPosCold');if(a){a.textContent=fs.posN+' 码';}if(b){b.textContent=fs.hot+' 个';}if(c){c.textContent=fs.cold+' 个';}}
  function syncModeForm(){var isPos=fs.mode==='定位';var dc=$('#bqDirCard'),pw=$('#bqPosWrap');if(dc){dc.style.display=isPos?'none':'';}if(pw){pw.style.display=isPos?'':'none';}syncRangeVisibility();}
  function resetForm(){
    fs.mode=null;fs.dir=null;fs.min=3;fs.max=8;fs.posN=3;fs.hot=3;fs.cold=2;
    $$('#bqModeSeg .stg-opt,#bqDirSeg .stg-opt').forEach(function(b){b.classList.remove('on');});
    var r1=$('#bqMinV'),r2=$('#bqMaxV');if(r1){r1.textContent=3;}if(r2){r2.textContent=8;}
    setCandVal(6);syncPos();syncDir();syncModeForm();
  }
  function bqShow(scr){var f=$('#bqFormScr'),r=$('#bqResScr');if(f){f.classList.toggle('on',scr==='form');}if(r){r.classList.toggle('on',scr==='result');}var sc=$('#bqScroll');if(sc){sc.scrollTop=0;}}

  /* ── 结果屏（新版逻辑）── */
  function cand(){return CANDS[rs.ci];}
  function curBars(){var b=RANGE_BASE[rs.range];return b.map(function(n){return Math.round(n*DIRF[rs.dir]*STKF[rs.streak]);});}
  function paintRDir(){$$('#bqRDirSeg [data-arg]').forEach(function(el){el.classList.toggle('on',el.getAttribute('data-arg')===rs.dir);});}
  function paintStreak(){$$('#bqStreak [data-arg]').forEach(function(el){el.classList.toggle('on',el.getAttribute('data-arg')===rs.streak);});}
  function paintTime(){$$('#bqTimeSeg [data-arg]').forEach(function(el){el.classList.toggle('on',el.getAttribute('data-arg')===rs.range);});}
  function buildSlider(){
    var d=$('#bqDots');
    if(d){d.innerHTML=CANDS.map(function(v,i){var on=i===rs.ci;return '<div class="bx-dotcell" data-act="bqrcand" data-arg="'+i+'"><span class="'+(on?'bx-dotsel':'bx-dot')+'"></span></div>';}).join('');}
    var f=$('#bqFill');if(f){f.style.width=(7+(rs.ci/6)*86)+'%';}
    $$('.bx-slab').forEach(function(el){var i=parseInt(el.getAttribute('data-lb'),10);el.classList.toggle('on',i===rs.ci);});
  }
  function render(){
    var bars=curBars(),total=bars.reduce(function(a,b){return a+b;},0),maxB=Math.max.apply(null,bars)||1;
    var c=cand(),covN=0,i;for(i=0;i<c&&i<9;i++){covN+=bars[i];}
    var covP=total?Math.round(covN/total*100):0,deepP=total?100-covP:0;
    var bw=$('#bqBars');
    if(bw){bw.innerHTML=bars.map(function(n,idx){var per=idx+1,col=per<c?'#1FA971':(per===c?'#EF9F27':'#E24B4A');if(n===0){col='#E5E8EF';}var h=n===0?3:Math.max(4,Math.round(n/maxB*118));return '<div class="bx-bar"><span class="bx-barval">'+(n>0?n+'次':'0')+'</span><div class="bx-brect" style="height:'+h+'px;background:'+col+'"></div></div>';}).join('');}
    var pos=Math.min(100,(Math.min(c,9)/9)*100);
    var cut=$('#bqCut');if(cut){cut.style.left=pos+'%';}
    var ct=$('#bqCutTag');if(ct){ct.style.left=pos+'%';ct.textContent='候选 '+CANDLB[rs.ci]+' · '+covP+'%';}
    var candTxt=(rs.ci===6?'9 期以上':(c+' 期'));
    var rd=$('#bqRead');
    if(rd){rd.innerHTML='下注回合数 <b>'+candTxt+'</b>：历史 <b class="gn">'+covP+'%</b> 未发生爆仓，<b class="rd">'+deepP+'%</b> 发生爆仓。';}
    var recs=RECBANK[rs.dir][rs.range];
    var rcnt=$('#bqRecCnt');if(rcnt){rcnt.textContent='近 '+recs.length+' 条';}
    var depths=bars.map(function(n,idx){return {d:idx+1,n:n};}).filter(function(x){return x.n>0;}).sort(function(a,b){return b.d-a.d;});
    var rl=$('#bqRecs');
    if(rl){rl.innerHTML=recs.map(function(r,idx){var depth=depths.length?depths[Math.min(idx,depths.length-1)].d:c;var col=depth>=7?'#E24B4A':(depth===6?'#E0A83A':'#1FA971');return '<div class="bx-rrow"><span class="bx-c1">'+r[0]+'</span><span class="bx-c2">'+r[1]+'</span><span class="bx-c3" style="color:'+col+'">'+depth+' 期</span><span class="bx-c4">›</span></div>';}).join('');}
    buildSlider();
    var gt=$('#bqGenTitle');if(gt){gt.textContent='生成「'+DIRLB[rs.dir]+' · 数据推荐」';}
    var gsc=$('#bqGenSrc');if(gsc){gsc.textContent='来自爆仓查询 · '+RANGELB[rs.range];}
    var gp=$('#bqGenPlay');if(gp){gp.textContent='两面 · '+DIRLB[rs.dir]+' · 单双＋龙虎（已避开在爆玩法）';}
    var gg=$('#bqGenTrig');if(gg){gg.textContent=(rs.dir==='跟'?'长龙':'单跳')+' '+rs.streak+' 期入场';}
    var ge=$('#bqGenExec');if(ge){ge.textContent='每注 10 × '+c+' 回合 · 倍投 2×（候选回合）';}
    var gn=$('#bqGenNote');if(gn){gn.textContent='回合数取自候选 '+c+' 期，覆盖'+RANGELB[rs.range]+' '+covP+'% 的历史情形。';}
  }
  function renderResultAll(){paintRDir();paintStreak();paintTime();render();}
  /* 表单条件 → 结果状态映射（长龙区间取最低值；候选下注回合数→候选滑杆） */
  function applyFormToResult(){
    rs.dir=(fs.dir==='反投')?'反':'跟';
    var mn=fs.min;
    rs.streak=(mn>=9)?'8+':String(Math.max(3,Math.min(8,mn)));
    var cv=candVal();var ci=Math.max(0,Math.min(6,cv-3));rs.ci=ci;
    rs.range='7d';
    var rt=$('#bqResTitle');if(rt){rt.textContent=(fs.mode==='定位'?'定位爆仓查询':'两面爆仓查询');}
  }
  function renderRecent(){
    var t=$('#bqRecentTitle'),l=$('#bqRecentList');
    if(t){t.textContent='最近查询（'+saved.length+'）';}
    if(!l){return;}
    if(!saved.length){l.innerHTML='<div class="bq-recempty">还没有保存的查询</div>';return;}
    l.innerHTML=saved.slice(0,SAVED_MAX).map(function(s,i){
      var l1=DIRLB[s.dir]+'｜长龙 '+s.streak;
      var l2=RANGELB[s.range]+' · 候选 '+CANDS[s.ci]+' 期';
      return '<div class="bq-rcard" data-act="bqsavedview" data-arg="'+i+'"><div class="sc"><div class="l1">'+l1+'</div><div class="l2">'+l2+' · '+s.ts+'</div></div><div class="rec"><span class="lab">候选回合</span><div class="num">'+CANDS[s.ci]+'<small>期</small></div></div><span class="go">查看 <svg class="icx" viewBox="373.4 53.9 8.2 13.5" fill="none"><path d="M321.5 47.5L326 52L321.5 56.5" stroke="currentColor" stroke-width="1.8px" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="matrix(1.1661579810495626 0 0 1.1661579810495626 0 0.00044415087462888964)"></path></svg></span></div>';
    }).join('');
  }
  /* 首次引导：每会话首次进入查爆仓弹一次 */
  var bustObSeen=false;
  function maybeBustGuide(){
    if(bustObSeen){return;}
    var v=$('.view-bust');
    if(!v||!v.classList.contains('on')){return;}
    bustObSeen=true;
    var g=$('#bustGuide');if(g){g.classList.add('open');}
  }
  /* ── 事件委托（bq* 私有）── */
  document.addEventListener('click',function(e){
    var t=e.target.closest?e.target.closest('[data-act]'):null;
    if(!t){return;}
    var a=t.getAttribute('data-act'),arg=t.getAttribute('data-arg');
    if(a==='show'&&arg==='bust'){setTimeout(maybeBustGuide,60);return;}
    /* 表单屏 */
    if(a==='bqmode'){fs.mode=arg;$$('#bqModeSeg .stg-opt').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-arg')===arg);});syncModeForm();}
    else if(a==='bqdir'){fs.dir=arg;$$('#bqDirSeg .stg-opt').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-arg')===arg);});syncDir();syncRangeVisibility();}
    else if(a==='bqposstep'){var pk=t.getAttribute('data-k'),pdd=parseInt(t.getAttribute('data-d'),10);if(pk==='posN'){fs.posN=Math.min(10,Math.max(1,fs.posN+pdd));}else if(pk==='hot'){fs.hot=Math.min(10,Math.max(0,fs.hot+pdd));}else if(pk==='cold'){fs.cold=Math.min(10,Math.max(0,fs.cold+pdd));}syncPos();}
    else if(a==='bqstep'){var kk=t.getAttribute('data-k'),dd=parseInt(t.getAttribute('data-d'),10);if(kk==='min'){fs.min=Math.min(Math.max(1,fs.min+dd),fs.max);var m1=$('#bqMinV');if(m1){m1.textContent=fs.min;}}if(kk==='max'){fs.max=Math.max(Math.min(25,fs.max+dd),fs.min);var m2=$('#bqMaxV');if(m2){m2.textContent=fs.max;}}}
    else if(a==='bqcand'){var cd=parseInt(t.getAttribute('data-d'),10);setCandVal(Math.min(20,Math.max(1,candVal()+cd)));}
    else if(a==='bqreset'){resetForm();bqToast('已重置条件');}
    else if(a==='bqquery'){
      if(!fs.mode){bqToast('请先选择投注模式');return;}
      if(fs.mode!=='定位'&&!fs.dir){bqToast('请先选择回测方式');return;}
      applyFormToResult();renderResultAll();bqShow('result');
    }
    else if(a==='bqinfo'){
      var onForm=$('#bqFormScr')&&$('#bqFormScr').classList.contains('on');
      if(onForm){var tip=$('#bqTip');if(tip){tip.classList.toggle('open');}}
      else{bqToast('爆仓数据＝历史模拟连输最深要追几回才回本；柱越靠右＝越深越危险');}
    }
    /* 结果屏 */
    else if(a==='bqrdir'){rs.dir=arg;paintRDir();render();}
    else if(a==='bqstreak'){rs.streak=arg;paintStreak();render();}
    else if(a==='bqrange'){rs.range=arg;paintTime();render();}
    else if(a==='bqrcand'){rs.ci=parseInt(arg,10);render();}
    else if(a==='bqtoform'){resetForm();bqShow('form');}
    /* 最近查询 / 保存 / 生成（表单与结果共用） */
    else if(a==='bqsave'){saved.unshift({dir:rs.dir,streak:rs.streak,range:rs.range,ci:rs.ci,ts:nowStamp()});if(saved.length>SAVED_MAX){saved.length=SAVED_MAX;}renderRecent();bqToast('已保存，可在「最近查询」查看');}
    else if(a==='bqrecent'){renderRecent();var rd=$('#bqRecent');if(rd){rd.classList.add('open');}}
    else if(a==='bqrecentclose'){var rc=$('#bqRecent');if(rc){rc.classList.remove('open');}}
    else if(a==='bqsavedview'){
      var sIdx=parseInt(arg,10),it=saved[sIdx];
      if(it){rs.dir=it.dir;rs.streak=it.streak;rs.range=it.range;rs.ci=it.ci;var rt=$('#bqResTitle');if(rt){rt.textContent='两面爆仓查询';}renderResultAll();bqShow('result');}
      var rc2=$('#bqRecent');if(rc2){rc2.classList.remove('open');}
      bqToast('已载入保存的查询（快照数据）');
    }
    else if(a==='bqcreate'){render();var gm=$('#bqGen');if(gm){gm.classList.add('open');}}
    else if(a==='bqgenclose'){var gc=$('#bqGen');if(gc){gc.classList.remove('open');}}
    else if(a==='bqgenadjust'){var ga=$('#bqGen');if(ga){ga.classList.remove('open');}proxyClick('stgnew');}
    else if(a==='bqgenstart'){var gs2=$('#bqGen');if(gs2){gs2.classList.remove('open');}bqToast('策略已生成并启动 · 可在「自动投」查看');}
    else if(a==='bqobgo'||a==='bqobclose'){var og=$('#bustGuide');if(og){og.classList.remove('open');}if(a==='bqobgo'){bqShow('form');bqToast('设好条件，点「立即查询」看结果');}}
  });
  window.addEventListener('hashchange',function(){setTimeout(maybeBustGuide,80);});
  /* 初始：表单屏默认显示；结果屏预渲染一次备用；最近查询列表就绪 */
  syncDir();syncPos();syncModeForm();renderResultAll();renderRecent();bqShow('form');
  setTimeout(maybeBustGuide,150); /* 直接以 #bust 进入时也弹引导 */
})();

/* ══════════ 爆仓查询 · Drawer 模块（新建策略向导内 · 独立于查爆仓 Tab · 结果仅「趋势 + 分布」两块 · 不跳转 Tab）══════════
   由主模块 openbust 打开 #bqDrawer；本模块前缀 dbq*，自带状态/事件/示例数据，复用 .bq-card / .stg-opt / .stg-stp 及结果卡片样式。 */
(function(){
  var root=document.querySelector('#bqDrawer'); if(!root)return;
  var q=function(s){return root.querySelector(s);},qa=function(s){return [].slice.call(root.querySelectorAll(s));};
  var d2={mode:'两面',dir:'跟投',min:3,max:8,posN:3,hot:3,cold:2};
  var DDS={label:'近 7 天',bars:[42,33,24,16,10,5,2,1,1],
    days:[{d:'07-05',n:0},{d:'07-06',n:1},{d:'07-07',n:1},{d:'07-08',n:0},{d:'07-09',n:1},{d:'07-10',n:0},{d:'今天',n:1}],
    busts:[['今天 14:32','冠军 大小','9 期','第1049期'],['07-09 21:05','第五名 单双','7 期','第863期'],['07-07 15:48','第三名 大小','7 期','第412期'],['07-06 11:20','冠军 大小','7 期','第522期']]};
  function candVal(){var v=q('#dbqCandField .val');if(!v){return 6;}var n=parseInt(v.textContent,10);return isNaN(n)?6:n;}
  function setCand(n){var txt=n+' 期';qa('#dbqCandField .val,#dbqCandFieldPos .val').forEach(function(v){v.textContent=txt;});}
  function syncDir(){var f=d2.dir==='跟投',lab=q('#dbqRangeLab'),mn=q('#dbqMinLab'),mx=q('#dbqMaxLab');if(lab){lab.textContent=f?'长龙区间':'单跳区间';}if(mn){mn.textContent=f?'最低长龙':'最低单跳';}if(mx){mx.textContent=f?'最高长龙':'最高单跳';}}
  function syncPos(){var a=q('#dbqPosN'),b=q('#dbqPosHot'),c=q('#dbqPosCold');if(a){a.textContent=d2.posN+' 码';}if(b){b.textContent=d2.hot+' 个';}if(c){c.textContent=d2.cold+' 个';}}
  function syncMode(){var pos=d2.mode==='定位',dc=q('#dbqDirCard'),pw=q('#dbqPosWrap'),rw=q('#dbqRangeWrap');if(dc){dc.style.display=pos?'none':'';}if(pw){pw.style.display=pos?'':'none';}if(rw){rw.style.display=pos?'none':'';}}
  function showResult(on){var f=q('#dbqForm'),r=q('#dbqResult'),ff=q('#dbqFootForm'),fr=q('#dbqFootResult'),sc=q('#dbqScroll');if(f){f.style.display=on?'none':'';}if(r){r.style.display=on?'':'none';}if(ff){ff.style.display=on?'none':'';}if(fr){fr.style.display=on?'':'none';}if(sc){sc.scrollTop=0;}}
  function render(){
    var d=DDS,total=0,rec=0,i;
    d.bars.forEach(function(n,idx){total+=n;if(n>0){rec=idx+1;}});
    var cum=0,k=rec,covN=total;
    for(i=0;i<d.bars.length;i++){cum+=d.bars[i];if(cum/total>=0.95){k=i+1;covN=cum;break;}}
    var covP=total?Math.round(covN/total*100):0,deepN=total-covN;
    var ct=q('#dbqCondTxt');
    if(ct){ct.innerHTML=d2.mode==='定位'?('定位<span class="sep">｜</span>'+d2.posN+' 码<span class="sep">｜</span>热 '+d2.hot+' / 冷 '+d2.cold):(d2.dir+'<span class="sep">｜</span>'+d2.mode+'<span class="sep">｜</span>'+(d2.dir==='跟投'?'长龙':'单跳')+' '+d2.min+'~'+d2.max);}
    var cl=q('#dbqCalLine');if(cl){cl.innerHTML=d.label+'共爆仓 <b>'+d.busts.length+' 次</b>，今天 '+d.days[d.days.length-1].n+' 次——不算密集，但要留意。';}
    var dg=q('#dbqDayGrid');if(dg){dg.style.gridTemplateColumns='repeat('+d.days.length+',1fr)';dg.innerHTML=d.days.map(function(x){return '<div class="bq-day '+(x.n>0?'bad':'ok')+'"><b>'+x.n+'次</b><span>'+x.d+'</span></div>';}).join('');}
    var bl=q('#dbqBustList');if(bl){bl.innerHTML='<table class="bq-btable"><tr><th>时间</th><th>投注项</th><th>连输</th><th>期号</th></tr>'+d.busts.map(function(x){return '<tr><td class="tm">'+x[0]+'</td><td>'+x[1]+'</td><td class="rd">'+x[2]+'</td><td>'+x[3]+'</td></tr>';}).join('')+'</table>';}
    var dl=q('#dbqDistLine');if(dl){dl.innerHTML='历史数据显示，<em>'+covP+'%</em> 情况可在 <em>'+k+' 期</em>内回本。';}
    var dc2=q('#dbqDistChips');
    if(dc2){var cand=candVal(),cc=0;for(i=0;i<Math.min(cand,d.bars.length);i++){cc+=d.bars[i];}var cp=total?Math.round(cc/total*100):0;dc2.innerHTML='<span class="bq-rchip g">'+k+' 期内就中：'+covN+' 次（'+covP+'%）</span><span class="bq-rchip r">要追 '+(k+1)+' 期以上：'+deepN+' 次</span><span class="bq-rchip b">候选 '+cand+' 期：覆盖 '+cp+'%（'+cc+' 次）</span>';}
    var maxB=Math.max.apply(null,d.bars),bw=q('#dbqBarWrap');
    if(bw){bw.innerHTML=d.bars.map(function(n,idx){var hh=n===0?2:Math.max(3,Math.round(n/maxB*52)),c=(idx+1)<k?'#1D9E75':((idx+1)===k?'#EF9F27':'#E24B4A');if(n===0){c='#E5E8EF';}return '<div class="bq-hcol"><span class="bq-hcnt">'+(n>0?n+'次':'0')+'</span><div class="bq-hb" style="height:'+hh+'px;background:'+c+'"></div></div>';}).join('');}
    var lb=q('#dbqBarLbl');if(lb){lb.innerHTML=d.bars.map(function(_,idx){return '<span>'+(idx+1)+'回</span>';}).join('');}
    var pct=Math.min(97,(k/d.bars.length)*100),cutL=q('#dbqCutLine'),cutT=q('#dbqCutLab');
    if(cutL){cutL.style.left=pct+'%';}
    if(cutT){cutT.style.left=pct+'%';cutT.textContent=covP+'% 分界 · '+k+' 期';}
  }
  root.addEventListener('click',function(e){
    var t=e.target.closest?e.target.closest('[data-act]'):null;if(!t){return;}
    var a=t.getAttribute('data-act'),arg=t.getAttribute('data-arg');
    if(a==='dbqclose'){root.classList.remove('open');showResult(false);}
    else if(a==='dbqmode'){d2.mode=arg;qa('#dbqModeSeg .stg-opt').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-arg')===arg);});syncMode();}
    else if(a==='dbqdir'){d2.dir=arg;qa('#dbqDirSeg .stg-opt').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-arg')===arg);});syncDir();}
    else if(a==='dbqposstep'){var pk=t.getAttribute('data-k'),pd=parseInt(t.getAttribute('data-d'),10);if(pk==='posN'){d2.posN=Math.min(10,Math.max(1,d2.posN+pd));}else if(pk==='hot'){d2.hot=Math.min(10,Math.max(0,d2.hot+pd));}else if(pk==='cold'){d2.cold=Math.min(10,Math.max(0,d2.cold+pd));}syncPos();}
    else if(a==='dbqstep'){var kk=t.getAttribute('data-k'),dd=parseInt(t.getAttribute('data-d'),10);if(kk==='min'){d2.min=Math.min(Math.max(1,d2.min+dd),d2.max);var m1=q('#dbqMinV');if(m1){m1.textContent=d2.min;}}if(kk==='max'){d2.max=Math.max(Math.min(25,d2.max+dd),d2.min);var m2=q('#dbqMaxV');if(m2){m2.textContent=d2.max;}}}
    else if(a==='dbqcand'){var cd=parseInt(t.getAttribute('data-d'),10);setCand(Math.min(20,Math.max(1,candVal()+cd)));}
    else if(a==='dbqquery'){render();showResult(true);}
    else if(a==='dbqback'){showResult(false);}
    else if(a==='dbqreset'){d2={mode:'两面',dir:'跟投',min:3,max:8,posN:3,hot:3,cold:2};qa('#dbqModeSeg .stg-opt').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-arg')==='两面');});qa('#dbqDirSeg .stg-opt').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-arg')==='跟投');});var r1=q('#dbqMinV'),r2=q('#dbqMaxV');if(r1){r1.textContent=3;}if(r2){r2.textContent=8;}setCand(6);syncPos();syncDir();syncMode();showResult(false);}
  });
  syncDir();syncPos();syncMode();
})();
