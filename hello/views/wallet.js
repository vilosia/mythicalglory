/* IM168 · 钱包（成员钱包 / 资金记录 / 上下分申请 / 交易详情 / 申请记录）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:12,h:`

          <!-- ===== 钱包（成员 · 额度）· 对齐管理中心设计语言 ===== -->
          <div class="view view-wallet">
            <div class="subhead"><span class="bk" data-act="show" data-arg="bet"><svg class="icx" viewBox="25.0 51.0 11.0 17.0" fill="none"><path d="M34 66L27 59.5L34 53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b>钱包</b><span class="rt"></span></div>
            <div class="scroll2">
              <div class="fg-hero uw-hero">
                <div class="cap">当前额度 <span class="fg-eye" data-act="uweye"><svg class="eye-ic eye-on" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg><svg class="eye-ic eye-off" width="14" height="14" viewBox="0 0 512 512" fill="currentColor"><path d="M348.366 231.618L348.714 231.867C349.259 233.052 350.091 237.465 350.371 238.99C352.909 252.563 352.424 266.528 348.944 279.891C342.479 304.651 326.451 325.831 304.379 338.781C288.719 348.083 270.694 352.631 252.496 351.873C248.542 351.733 241.539 351.063 237.687 350.058C235.463 349.553 233.444 349.086 231.184 348.733C237.143 342.551 243.177 336.443 249.285 330.408C252.649 327.043 256.804 322.631 260.301 319.546C266.174 318.423 269.244 318.548 275.691 316.463C294.711 310.166 309.714 295.366 316.269 276.433C317.106 273.946 317.629 271.621 318.179 269.251C318.636 267.276 319.284 260.851 320.304 259.671C322.776 256.813 326.909 252.638 329.661 250.028C335.746 244.264 342.146 237.069 348.366 231.618Z"/><path d="M369.06 120.272C372.82 116.042 377.73 111.354 381.78 107.302L403.425 85.6608L414.875 74.2631C417.322 71.8096 419.535 69.1798 422.328 67.1115C428.443 62.5788 437.23 63.0493 442.858 68.19C446.055 71.1583 447.895 75.3098 447.945 79.6733C448.075 86.42 444.638 89.9161 440.23 94.3268L203.274 331.258L127.108 407.433L102.896 431.626C100.809 433.713 98.7385 435.861 96.6215 437.936C91.5092 442.941 87.811 448.008 79.958 447.921C66.9268 447.773 59.5513 433.408 66.938 422.741C68.9188 419.881 71.6192 417.441 74.0827 414.986L83.8092 405.301C93.2455 395.863 103.651 384.956 113.304 375.911C110.154 373.676 106.677 371.621 103.423 369.493C98.4515 366.228 93.577 362.818 88.8065 359.266C54.7278 333.843 24.8345 301.153 2.63532 264.933C1.5524 263.166 0.977803 260.748 0 259.176V252.661L0.237356 252.231C1.49973 249.885 2.25648 247.407 3.74268 245.026C42.9397 182.232 103.084 130.589 174.289 108.252C225.076 92.4618 279.357 91.771 330.527 106.264C338.905 108.668 347.162 111.465 355.275 114.647C358.66 115.994 366.027 119.398 369.06 120.272ZM137.571 351.851C140.13 348.553 145.391 343.823 148.418 340.648L177.766 311.378C162.757 289.763 156.892 264.773 161.549 238.751C166.1 213.746 180.359 191.558 201.213 177.03C221.929 162.656 247.475 157.025 272.315 161.356C282.9 163.203 293.097 166.833 302.467 172.093C305.607 173.843 308.64 175.999 311.663 177.644C315.408 173.452 320.228 168.857 324.253 164.831C330.783 158.181 337.41 151.628 344.133 145.173C340 143.208 333.942 141.159 329.56 139.711C305.265 131.763 279.837 127.822 254.277 128.043C180.831 129.257 120.3 160.075 69.6375 212.475C59.6092 223.001 50.281 234.173 41.7132 245.919C40.0562 248.198 36.1665 253.536 34.8925 255.956C57.5515 289.613 86.4852 318.591 120.11 341.301C124.337 344.098 133.093 349.871 137.571 351.851ZM201.128 288.233C204.524 284.381 209.594 279.398 213.331 275.743L288.112 201.026C277.807 194.927 267.142 191.933 255.152 192.036C237.047 192.612 221.531 199.149 209.069 212.505C197.461 224.953 191.341 241.543 192.083 258.548C192.531 269.263 195.742 279.026 201.128 288.233Z"/><path d="M425.398 154.464C428.901 156.464 436.541 163.002 439.818 165.792C462.528 185.17 482.636 207.406 499.638 231.945C503.048 236.905 506.511 242.112 509.538 247.326C510.336 248.702 511.273 251.383 511.998 252.973V258.893C510.963 260.728 510.463 263.081 509.076 265.341C477.448 316.863 429.841 362.138 375.418 388.571C324.776 413.291 267.686 421.611 212.095 412.373C200.759 410.496 186.694 407.436 175.879 403.696C177.852 402.251 181.047 398.606 182.975 396.778C189.241 390.841 195.786 383.323 202.174 377.711C205.379 378.083 209.83 379.158 213.111 379.808C217.723 380.698 222.364 381.433 227.026 382.011C255.608 385.571 284.598 383.908 312.586 377.106C369.743 363.073 419.158 327.943 456.658 283.196C462.748 275.926 472.183 264.026 477.081 255.943C475.093 252.298 467.343 242.181 464.736 238.796C446.321 214.871 426.166 195.742 402.266 177.53C409.836 170.299 417.683 161.369 425.398 154.464Z"/></svg></span></div>
                <div class="fg-amt-row"><div class="big" id="uwAmt" data-real="240,000.00">240,000.00</div></div>
                <div class="uw-btns">
                  <button class="wbtn" id="uwUpBtn" data-act="show" data-arg="request"><span aria-hidden="true">↑</span>上分</button>
                  <button class="wbtn" id="uwDnBtn" data-act="show" data-arg="withdraw">下分<span aria-hidden="true">↓</span></button>
                </div>
                <div class="uw-lockmsg" id="uwLockMsg" style="display:none"><i>ⓘ</i><span>有 <b id="uwLockCnt">1</b> 笔申请待审核，审核完成后可再次申请。</span></div>
                <div class="fg-comm uw-comm" data-act="show" data-arg="bets">
                  <div class="uws2"><span>今日盈亏</span><b class="win">+78.00</b></div>
                  <div class="uws2 dv"><span>今日未结</span><b>3 笔</b></div>
                  <i class="uws-cv">›</i>
                </div>
              </div>

              <div class="uw-pendwrap wallet-pending-card" id="uwPendWrap" style="display:none">
                <div class="md-sec wallet-pending-head"><b>待审核申请</b><span><b id="uwPendCount">1</b> 笔</span></div>
                <div class="blist txlist tx-quiet tx-tag">
                  <div class="bi" id="uwPendUp" style="display:none">
                    <div class="q"><b><span class="dtag">上分</span>额度申请</b><span class="txtm" id="uwPendUpTime">2026/07/07 14:32</span></div>
                    <div class="r"><b id="uwPendUpTxt">+500.00</b><span class="txst pd">待审核</span></div>
                  </div>
                  <div class="transaction-divider uw-pending-divider" id="uwPendDivider" aria-hidden="true" style="display:none"></div>
                  <div class="bi" id="uwPendDn" style="display:none">
                    <div class="q"><b><span class="dtag">下分</span>额度申请</b><span class="txtm" id="uwPendDnTime">2026/07/07 14:32</span></div>
                    <div class="r"><b id="uwPendDnTxt">−200.00</b><span class="txst pd">待审核</span></div>
                  </div>
                </div>
              </div>

              <div class="wallet-tx-card">
              <div class="md-sec wallet-tx-head">
                <b>额度明细</b>
                <span class="dt-trigger md-dt" data-act="uwtpop" data-list="pl-wallet-flow"><b>今天</b><i><svg class="icx" viewBox="371.3 56.9 12.6 7.4" fill="none"><path d="M321.5 47.5L326 52L321.5 56.5" stroke="currentColor" stroke-width="1.8px" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="rotate(90 377.57 60.64) matrix(1.1661579810495626 0 0 1.1661579810495626 0 0.00044415087462888964)"></path></svg></i></span>
                <div class="dt-pop" id="uwPop">
                  <span class="on" data-act="uwtpick" data-v="0">今天</span>
                  <span data-act="uwtpick" data-v="7">最近 7 天</span>
                  <span data-act="uwtpick" data-v="month">本月</span>
                  <span data-act="uwtpick" data-v="custom">自定义日期</span>
                </div>
              </div>
              <div class="wallet-period-summary" id="walletTxSummary">
                <div class="wallet-period-metric">
                  <span>上分 <b><i id="uwTxUpCount">0</i>笔</b></span>
                  <strong id="uwTxUp">0.00</strong>
                </div>
                <div class="wallet-period-metric">
                  <span>下分 <b><i id="uwTxDownCount">0</i>笔</b></span>
                  <strong id="uwTxDown">0.00</strong>
                </div>
                <div class="wallet-period-metric game">
                  <span>游戏盈亏</span>
                  <strong id="uwTxGame">0.00</strong>
                </div>
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
                <option value="0" selected>今天</option>
                <option value="7">最近 7 天</option>
                <option value="month">本月</option>
              </select>
              <input type="hidden" class="wfdate" data-list="pl-wallet-flow" data-edge="start" value="">
              <input type="hidden" class="wfdate" data-list="pl-wallet-flow" data-edge="end" value="">
              <div class="tx-list-head" data-list="pl-wallet-flow" aria-hidden="true"><span>类型 / 时间</span><span>额度</span></div>
              <div class="blist txlist tx-quiet tx-tag" id="pl-wallet-flow">
                  <div class="bi tap" data-t="credit" data-days="0" data-act="txopen" data-st="ok" data-time="2026/07/07 14:32"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">2026/07/07 14:32</span></div><div class="r"><b class="win">+1,000.00</b></div></div>
                  <div class="bi tap" data-t="plan" data-days="0" data-act="show" data-arg="bets"><div class="q"><b><span class="dtag">游戏盈亏</span>SG飞艇 (共10笔)</b><span class="txtm">2026/07/07 14:32</span></div><div class="r"><b class="win">+78.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="1" data-act="txopen" data-st="ok" data-time="2026/07/06 18:45"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">2026/07/06 18:45</span></div><div class="r"><b>−500.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="2" data-act="txopen" data-st="ok" data-time="2026/07/05 09:12"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">2026/07/05 09:12</span></div><div class="r"><b class="win">+2,000.00</b></div></div>
                  <div class="bi tap" data-t="plan" data-days="2" data-act="show" data-arg="bets"><div class="q"><b><span class="dtag">游戏盈亏</span>SG飞艇 (共10笔)</b><span class="txtm">2026/07/05 21:40</span></div><div class="r"><b class="lose">−45.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="3" data-act="txopen" data-st="ok" data-time="2026/07/04 21:33"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">2026/07/04 21:33</span></div><div class="r"><b>−1,000.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="4" data-act="txopen" data-st="ok" data-time="2026/07/03 16:20"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">2026/07/03 16:20</span></div><div class="r"><b class="win">+500.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="6" data-act="txopen" data-st="ok" data-time="2026/07/01 17:40"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">2026/07/01 17:40</span></div><div class="r"><b class="win">+1,500.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="8" data-act="txopen" data-st="ok" data-time="2026/06/29 20:15"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">2026/06/29 20:15</span></div><div class="r"><b>−300.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="9" data-act="txopen" data-st="ok" data-time="2026/06/28 10:08"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">2026/06/28 10:08</span></div><div class="r"><b class="win">+800.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="11" data-act="txopen" data-st="ok" data-time="2026/06/26 22:51"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">2026/06/26 22:51</span></div><div class="r"><b class="win">+300.00</b></div></div>
                  <div class="bi tap" data-t="withdraw" data-days="15" data-act="txopen" data-st="ok" data-time="2026/06/22 13:26"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">2026/06/22 13:26</span></div><div class="r"><b>−600.00</b></div></div>
                  <div class="bi tap" data-t="credit" data-days="20" data-act="txopen" data-st="ok" data-time="2026/06/17 19:44"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">2026/06/17 19:44</span></div><div class="r"><b class="win">+1,000.00</b></div></div>
              </div>
              <div class="lst-empty" data-list="pl-wallet-flow" style="display:none"><b>没有符合条件的记录</b><span>尝试调整类型或时间范围</span></div>
              <div class="loadmore" id="uwFlowMore" data-act="lmore" data-list="pl-wallet-flow" style="display:none"><span class="wallet-more-divider" aria-hidden="true"></span><span class="wallet-more-label">查看更多 (+6)</span></div>
              </div>
            </div>
          </div>
`});




(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:14,h:`

          <!-- ===== 申请下分（Amount Input · 严格按 spec）===== -->
          <div class="view view-withdraw amount-page">
            <div class="subhead"><span class="bk" data-act="show" data-arg="wallet"><svg class="icx" viewBox="25.0 51.0 11.0 17.0" fill="none"><path d="M34 66L27 59.5L34 53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b>申请下分</b><span class="rt"></span></div>
            <main class="amount-page__content">
              <section class="amount-entry">
                                <div class="amount-entry__value-row"><input id="wdHeroAmt" class="amount-entry__value withdraw-amt" type="text" inputmode="numeric" value="200.00" aria-label="申请金额">
                </div>
                <div class="amount-entry__balance"><span>当前额度 240,000.00</span></div>
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
              <div class="cf-h" style="display:flex;align-items:center;"><span>交易详情</span><span class="cf-x" data-act="txclose"><svg class="icx" viewBox="348.1 671.0 17.4 17.4" fill="none"><path d="M352.114 654.324C352.545 653.892 353.244 653.892 353.676 654.324C354.108 654.755 354.108 655.454 353.676 655.886L348.562 660.999L353.676 666.114C354.108 666.545 354.108 667.244 353.676 667.676C353.244 668.108 352.545 668.108 352.114 667.676L346.999 662.562L341.886 667.676C341.454 668.108 340.755 668.108 340.324 667.676C339.892 667.244 339.892 666.545 340.324 666.114L345.437 660.999L340.324 655.886C339.892 655.454 339.892 654.755 340.324 654.324C340.755 653.892 341.454 653.892 341.886 654.324L346.999 659.437L352.114 654.324Z" fill="currentColor" transform="matrix(1.0282575514138816 0 0 1.0282575514138816 0 0.006989074550144833)"></path></svg></span></div>
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
            <div class="subhead"><span class="bk" data-act="show" data-arg="wallet"><svg class="icx" viewBox="25.0 51.0 11.0 17.0" fill="none"><path d="M34 66L27 59.5L34 53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b>申请上分</b><span class="rt"></span></div>
            <main class="amount-page__content">
              <section class="amount-entry">
                                <div class="amount-entry__value-row"><input id="reqHeroAmt" class="amount-entry__value amtin" type="text" inputmode="numeric" value="500.00" aria-label="申请金额">
                </div>
                <div class="amount-entry__balance"><span>当前额度 240,000.00</span></div>
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
              <div class="cf-h" style="display:flex;align-items:center;"><span id="acTitle">上分申请确认</span><span class="cf-x" data-act="apclose"><svg class="icx" viewBox="348.1 671.0 17.4 17.4" fill="none"><path d="M352.114 654.324C352.545 653.892 353.244 653.892 353.676 654.324C354.108 654.755 354.108 655.454 353.676 655.886L348.562 660.999L353.676 666.114C354.108 666.545 354.108 667.244 353.676 667.676C353.244 668.108 352.545 668.108 352.114 667.676L346.999 662.562L341.886 667.676C341.454 668.108 340.755 668.108 340.324 667.676C339.892 667.244 339.892 666.545 340.324 666.114L345.437 660.999L340.324 655.886C339.892 655.454 339.892 654.755 340.324 654.324C340.755 653.892 341.454 653.892 341.886 654.324L346.999 659.437L352.114 654.324Z" fill="currentColor" transform="matrix(1.0282575514138816 0 0 1.0282575514138816 0 0.006989074550144833)"></path></svg></span></div>
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
            <div class="subhead"><span class="bk" data-act="show" data-arg="request"><svg class="icx" viewBox="25.0 51.0 11.0 17.0" fill="none"><path d="M34 66L27 59.5L34 53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b>申请记录</b><span class="rt"></span></div>
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
