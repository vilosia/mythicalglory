/* IM168 · 钱包（成员钱包 / 资金记录 / 上下分申请 / 交易详情 / 申请记录）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:12,h:`

          <!-- ===== 钱包（成员 · 额度）· 对齐管理中心设计语言 ===== -->
          <div class="view view-wallet">
            <div class="subhead"><span class="bk" data-act="show" data-arg="bet">‹</span><b>钱包</b><span class="rt"></span></div>
            <div class="scroll2">
              <div class="fg-hero uw-hero">
                <div class="cap">当前额度 <span class="fg-eye" data-act="uweye"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg></span></div>
                <div class="fg-amt-row"><div class="big" id="uwAmt" data-real="240,000.00">240,000.00</div></div>
                <div class="uw-btns">
                  <button class="wbtn" id="uwUpBtn" data-act="show" data-arg="request"><span aria-hidden="true">↑</span>上分</button>
                  <button class="wbtn" id="uwDnBtn" data-act="show" data-arg="withdraw">下分<span aria-hidden="true">↓</span></button>
                </div>
                <div class="fg-comm uw-comm" data-act="show" data-arg="bets">
                  <div class="uws2"><span>今日盈亏</span><b class="win">+78.00</b></div>
                  <div class="uws2 dv"><span>今日未结</span><b>3 笔</b></div>
                  <i class="uws-cv">›</i>
                </div>
              </div>

              <div class="uw-pend" id="uwPendUp" style="display:none">
                <div class="q"><b><span class="dtag">上分</span>额度申请</b><span class="txtm" id="uwPendUpTime">今天 14:32</span></div>
                <div class="r"><b id="uwPendUpTxt">+500.00</b><span class="txst pd">待审核</span></div>
              </div>
              <div class="uw-pend" id="uwPendDn" style="display:none">
                <div class="q"><b><span class="dtag">下分</span>额度申请</b><span class="txtm" id="uwPendDnTime">今天 14:32</span></div>
                <div class="r"><b id="uwPendDnTxt">−200.00</b><span class="txst pd">待审核</span></div>
              </div>

              <div class="wallet-tx-card">
              <div class="md-sec wallet-tx-head">
                <b>额度往来</b>
                <span class="dt-trigger md-dt" data-act="uwtpop" data-list="pl-wallet-flow"><b>今天</b><i>▾</i></span>
                <div class="dt-pop" id="uwPop">
                  <span class="on" data-act="uwtpick" data-v="0">今天</span>
                  <span data-act="uwtpick" data-v="7">最近 7 天</span>
                  <span data-act="uwtpick" data-v="30">最近 30 天</span>
                  <span data-act="uwtpick" data-v="all">全部时间</span>
                  <span data-act="uwtpick" data-v="custom">自定义日期</span>
                </div>
              </div>
              <div class="tx-summary wallet-tx-summary" id="walletTxSummary">
                <div class="txs-item"><span>上分</span><b id="uwTxUp">0.00</b><small id="uwTxUpCount">0 笔</small></div>
                <div class="txs-item"><span>下分</span><b id="uwTxDown">0.00</b><small id="uwTxDownCount">0 笔</small></div>
                <div class="txs-net"><span id="uwTxNetLabel">额度净变动</span><b id="uwTxNet">0.00</b></div>
                <div class="txs-note">含游戏盈亏 <b id="uwTxGame">0.00</b> · 仅统计已完成记录</div>
              </div>
              <div class="ctl-row otx-ctl">
                <div class="filterbar" style="padding:0;flex:1;">
                  <span class="fchip on" data-act="wff" data-list="pl-wallet-flow" data-f="all">全部</span>
                  <span class="fchip" data-act="wff" data-list="pl-wallet-flow" data-f="credit">上分</span>
                  <span class="fchip" data-act="wff" data-list="pl-wallet-flow" data-f="withdraw">下分</span>
                  <span class="fchip" data-act="wff" data-list="pl-wallet-flow" data-f="plan">游戏盈亏</span>
                </div>
              </div>
              <select class="wfsel hid" data-list="pl-wallet-flow">
                <option value="all">全部时间</option>
                <option value="0" selected>今天</option>
                <option value="7">最近 7 天</option>
                <option value="30">最近 30 天</option>
              </select>
              <input type="hidden" class="wfdate" data-list="pl-wallet-flow" data-edge="start" value="">
              <input type="hidden" class="wfdate" data-list="pl-wallet-flow" data-edge="end" value="">
              <div class="blist txlist tx-quiet tx-tag" id="pl-wallet-flow">
                  <div class="bi tap" data-t="credit" data-days="0" data-act="txopen" data-st="ok" data-time="2026/07/07 14:32"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">今天 14:32</span></div><div class="r"><b class="win">+1,000.00</b></div></div>
                  <div class="bi tap" data-t="plan" data-days="0" data-act="show" data-arg="bets"><div class="q"><b><span class="dtag">游戏盈亏</span>PK10 (共10注)</b><span class="txtm">今天 14:32</span></div><div class="r"><b class="win">+78.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="1" data-act="txopen" data-st="ok" data-time="2026/07/06 18:45"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">昨天 18:45</span></div><div class="r"><b>−500.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="2" data-act="txopen" data-st="ok" data-time="2026/07/05 09:12"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">07-05 09:12</span></div><div class="r"><b class="win">+2,000.00</b></div></div>
                  <div class="bi tap" data-t="plan" data-days="2" data-act="show" data-arg="bets"><div class="q"><b><span class="dtag">游戏盈亏</span>PK10 (共10注)</b><span class="txtm">07-05 21:40</span></div><div class="r"><b>−45.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="3" data-act="txopen" data-st="ok" data-time="2026/07/04 21:33"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">07-04 21:33</span></div><div class="r"><b>−1,000.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="4" data-act="txopen" data-st="ok" data-time="2026/07/03 16:20"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">07-03 16:20</span></div><div class="r"><b class="win">+500.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="6" data-act="txopen" data-st="ok" data-time="2026/07/01 17:40"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">07-01 17:40</span></div><div class="r"><b class="win">+1,500.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="8" data-act="txopen" data-st="ok" data-time="2026/06/29 20:15"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">06-29 20:15</span></div><div class="r"><b>−300.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="9" data-act="txopen" data-st="ok" data-time="2026/06/28 10:08"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">06-28 10:08</span></div><div class="r"><b class="win">+800.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="11" data-act="txopen" data-st="ok" data-time="2026/06/26 22:51"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">06-26 22:51</span></div><div class="r"><b class="win">+300.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="15" data-act="txopen" data-st="ok" data-time="2026/06/22 13:26"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">06-22 13:26</span></div><div class="r"><b>−600.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="20" data-act="txopen" data-st="ok" data-time="2026/06/17 19:44"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">06-17 19:44</span></div><div class="r"><b class="win">+1,000.00</b></div></div>
              </div>
              <div class="lst-empty" data-list="pl-wallet-flow" style="display:none"><b>没有符合条件的记录</b><span>尝试调整类型或时间范围</span></div>
              <div class="loadmore" id="uwFlowMore" data-act="lmore" data-list="pl-wallet-flow" style="display:none">查看更多</div>
              </div>
            </div>
          </div>
`});




(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:14,h:`

          <!-- ===== 申请下分（Amount Input · 严格按 spec）===== -->
          <div class="view view-withdraw amount-page">
            <div class="subhead"><span class="bk" data-act="show" data-arg="wallet">‹</span><b>申请下分</b><span class="rt"></span></div>
            <main class="amount-page__content">
              <section class="amount-entry">
                                <div class="amount-entry__value-row"><input id="wdHeroAmt" class="amount-entry__value withdraw-amt" type="text" inputmode="numeric" value="200.00" aria-label="申请金额">
                </div>
                <div class="amount-entry__balance"><span>当前额度：240,000.00</span></div>
              </section>
              <section class="amount-presets"><button class="amount-preset amtchip" data-v="100">100</button><button class="amount-preset amtchip on" data-v="200">200</button><button class="amount-preset amtchip" data-v="500">500</button><button class="amount-preset amtchip" data-v="2000">2,000</button><button class="amount-preset amount-preset--max amtchip" data-act="apmax">最高</button></section>
              <section class="number-pad"><button class="number-pad__key" data-act="npk" data-k="1">1</button><button class="number-pad__key" data-act="npk" data-k="2">2</button><button class="number-pad__key" data-act="npk" data-k="3">3</button><button class="number-pad__key" data-act="npk" data-k="4">4</button><button class="number-pad__key" data-act="npk" data-k="5">5</button><button class="number-pad__key" data-act="npk" data-k="6">6</button><button class="number-pad__key" data-act="npk" data-k="7">7</button><button class="number-pad__key" data-act="npk" data-k="8">8</button><button class="number-pad__key" data-act="npk" data-k="9">9</button><button class="number-pad__key" data-act="npk" data-k="00">00</button><button class="number-pad__key" data-act="npk" data-k="0">0</button><button class="number-pad__key number-pad__key--delete" data-act="npk" data-k="del">⌫</button></section>
            </main>
            <footer class="amount-page__footer">
              <button class="amount-page__next" data-act="apnext" data-dir="down">继续</button>
            </footer>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:15,h:`

          <!-- ===== 上下分说明 drawer ===== -->
          <div class="tpl-modal" id="uwHelp">
            <div class="cf-backdrop" data-act="uwhelpclose"></div>
            <div class="cf-sheet">
              <div class="cf-h">什么是上分 / 下分？</div>
              <div class="uwh-body">
                <p><b>上分</b>：把你与群主结算好的金额，转成场内可下注的额度，群主确认后到账。</p>
                <p><b>下分</b>：把额度换回，与群主结算取回。</p>
                <p>两者同一时间各只能有一笔申请，通过后才能提交下一笔。</p>
              </div>
              <div class="fz-btns solo"><button class="cta" data-act="uwhelpclose">知道了</button></div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:16,h:`

          <!-- ===== 交易详情 drawer（通用）===== -->
          <div class="tpl-modal" id="txDrawer">
            <div class="cf-backdrop" data-act="txclose"></div>
            <div class="cf-sheet">
              <div class="cf-h" style="display:flex;align-items:center;"><span>交易详情</span><span class="cf-x" data-act="txclose">✕</span></div>
              <div class="txd-hero txd-gray">
                <div class="txd-amt" id="tdAmt">+1,000.00</div>
              </div>
              <div class="ac-rows">
                <div class="ac-row"><span>类型</span><b id="tdType"><span class="dtag">上分</span></b></div>
                <div class="ac-row"><span>对象</span><b id="tdObj">额度</b></div>
                <div class="ac-row"><span>状态</span><b id="tdSt">已完成</b></div>
                <div class="ac-row"><span>时间</span><b id="tdTime">2026-07-05 13:00</b></div>
                <div class="ac-row"><span>交易编号</span><b id="tdId">TX20260707093001<span class="txid-copy" data-act="txcopy">⧉</span></b></div>
                <div class="ac-row"><span>处理方</span><b>群主</b></div>
                <div class="ac-row"><span>备注</span><b id="tdNote">—</b></div>
              </div>
              <button class="cta txd-close" data-act="txclose">关闭</button>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:17,h:`

          <!-- ===== 申请上分（Amount Input · 严格按 spec）===== -->
          <div class="view view-request amount-page">
            <div class="subhead"><span class="bk" data-act="show" data-arg="wallet">‹</span><b>申请上分</b><span class="rt"></span></div>
            <main class="amount-page__content">
              <section class="amount-entry">
                                <div class="amount-entry__value-row"><input id="reqHeroAmt" class="amount-entry__value amtin" type="text" inputmode="numeric" value="500.00" aria-label="申请金额">
                </div>
                <div class="amount-entry__balance"><span>当前额度：240,000.00</span></div>
              </section>
              <section class="amount-presets"><button class="amount-preset amtchip" data-v="100">100</button><button class="amount-preset amtchip on" data-v="500">500</button><button class="amount-preset amtchip" data-v="2000">2,000</button><button class="amount-preset amtchip" data-v="5000">5,000</button><button class="amount-preset amount-preset--max amtchip" data-act="apmax">最高</button></section>
              <section class="number-pad"><button class="number-pad__key" data-act="npk" data-k="1">1</button><button class="number-pad__key" data-act="npk" data-k="2">2</button><button class="number-pad__key" data-act="npk" data-k="3">3</button><button class="number-pad__key" data-act="npk" data-k="4">4</button><button class="number-pad__key" data-act="npk" data-k="5">5</button><button class="number-pad__key" data-act="npk" data-k="6">6</button><button class="number-pad__key" data-act="npk" data-k="7">7</button><button class="number-pad__key" data-act="npk" data-k="8">8</button><button class="number-pad__key" data-act="npk" data-k="9">9</button><button class="number-pad__key" data-act="npk" data-k="00">00</button><button class="number-pad__key" data-act="npk" data-k="0">0</button><button class="number-pad__key number-pad__key--delete" data-act="npk" data-k="del">⌫</button></section>
            </main>
            <footer class="amount-page__footer">
              <button class="amount-page__next" data-act="apnext" data-dir="up">继续</button>
            </footer>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:18,h:`

          <!-- ===== 申请确认 drawer（上/下分共用）===== -->
          <div class="tpl-modal" id="apConfirm">
            <div class="cf-backdrop" data-act="apclose"></div>
            <div class="cf-sheet">
              <div class="cf-h" style="display:flex;align-items:center;"><span id="acTitle">上分申请确认</span><span class="cf-x" data-act="apclose">✕</span></div>
              <div class="ac-hero"><b id="acAmt">+1,000.00</b></div>
              <div class="ac-rows">
                <div class="ac-row"><span>当前可用额度</span><b id="acCur">240,000.00</b></div>
                <div class="ac-row"><span>申请额度</span><b id="acApply">+1,000.00</b></div>
                <div class="ac-div"></div>
                <div class="ac-row hl"><span>通过后可用额度</span><b id="acAfter">241,000.00</b></div>
              </div>
              <div class="ac-rows plain">
                <div class="ac-row"><span>申请时间</span><b>2026-07-07 14:32</b></div>
                <div class="ac-row"><span>申请编号</span><b id="acId">UP202607070001</b></div>
              </div>
              <div class="cf-btns"><button class="ghost" data-act="apclose">取消</button><button class="cta" data-act="apsubmit">确认提交</button></div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:19,h:`

          <!-- ===== 申请记录（成员 · 查询页）===== -->
          <div class="view view-reqhistory">
            <div class="subhead"><span class="bk" data-act="show" data-arg="request">‹</span><b>申请记录</b><span class="rt"></span></div>
            <div class="scroll2">
              <div class="filterbar">
                <span class="fchip on" data-act="lfilter" data-target="pl-reqhistory" data-f="all">全部</span>
                <span class="fchip" data-act="lfilter" data-target="pl-reqhistory" data-f="pending">待确认</span>
                <span class="fchip" data-act="lfilter" data-target="pl-reqhistory" data-f="done">已到账</span>
                <span class="fchip" data-act="lfilter" data-target="pl-reqhistory" data-f="rejected">已拒绝</span>
              </div>
              <div class="blist pagelist txlist" id="pl-reqhistory" data-size="5">
                <div class="bi" data-t="pending"><div class="q"><b><i class="stag pd">待审核</i>申请 300 额度</b><span>2026/07/07 10:02</span></div><div class="r"><b>+300.00</b></div></div>
                <div class="bi" data-t="done"><div class="q"><b><i class="stag ok">已完成</i>申请 500 额度</b><span>2026/07/07 09:28</span></div><div class="r"><b class="win">+500.00</b></div></div>
                <div class="bi" data-t="done"><div class="q"><b><i class="stag ok">已完成</i>申请 300 额度</b><span>2026/07/06 21:00</span></div><div class="r"><b class="win">+300.00</b></div></div>
                <div class="bi rej" data-t="rejected"><div class="q"><b><i class="stag no">已拒绝</i>申请 1,000 额度</b><span>2026/07/06 18:30</span></div><div class="r"><b>+1,000.00</b></div></div>
                <div class="bi" data-t="done"><div class="q"><b><i class="stag ok">已完成</i>申请 200 额度</b><span>2026/07/05 14:12</span></div><div class="r"><b class="win">+200.00</b></div></div>
                <div class="bi" data-t="done"><div class="q"><b><i class="stag ok">已完成</i>申请 300 额度</b><span>2026/07/04 20:45</span></div><div class="r"><b class="win">+300.00</b></div></div>
              </div>
              <div class="pager" data-target="pl-reqhistory"><span class="pgbtn" data-act="pgnav" data-target="pl-reqhistory" data-dir="prev">‹</span><span class="pgtxt">1 / 2</span><span class="pgbtn" data-act="pgnav" data-target="pl-reqhistory" data-dir="next">›</span></div>
            </div>
          </div>
`});
