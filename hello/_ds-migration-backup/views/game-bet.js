/* IM168 · 游戏厅 · 投注（频道 / 投注 / 更多 / 投注历史 / 全部游戏）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:4,h:`

          <!-- ===== 频道 ===== -->
          <div class="view view-channel">
            <div class="subhead"><span class="bk" data-act="show" data-arg="home">‹</span><b>幸运组 · 频道</b><span class="channel-actions"><span class="owner-entry" data-act="show" data-arg="owner" aria-label="打开管理中心"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/></svg>管理<i class="recount">3</i></span><span class="channel-plus" data-act="newchat" aria-label="发起聊天"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></span></div>
            <div class="imlist" style="flex:1;overflow:auto;">
              <div class="chsub">频道内群组</div>
              <div class="imrow"><div class="sq sq-notice"><svg viewBox="0 0 24 24"><path d="M4 9v6h4l7 4V5L8 9H4z"/><path d="M18 9a4 4 0 0 1 0 6"/></svg></div><div class="gx"><b>公告</b><span>群主：今晚 8 点开盘</span></div><span class="arr">›</span></div>
              <div class="imrow" data-act="show" data-arg="bet"><div class="sq sq-game"><svg viewBox="0 0 24 24"><path d="M5 8h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/><path d="M7 12v3M5.5 13.5h3"/><path d="M15.5 13h.01M17.5 15h.01"/></svg></div><div class="gx"><b>幸运组·游戏厅</b><span>投注 · 自动投 · 聊天</span></div><div class="rmeta"><span class="badge">12</span></div></div>
              <div class="imrow"><div class="sq sq-chat"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-4 4v-4H4z"/></svg></div><div class="gx"><b>极速专区·闲聊</b><span>王哥：今天手气不错</span></div><div class="rmeta"><span class="badge">3</span></div></div>
              <div class="imrow"><div class="sq sq-red"><svg viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" rx="2"/><path d="M4 9V6h16v3M12 9v11"/><path d="M9 6a3 3 0 0 1 3-2 3 3 0 0 1 3 2"/></svg></div><div class="gx"><b>VIP大厅·优惠群</b><span>李姐 发了一个红包</span></div><span class="arr">›</span></div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:5,h:`

          <!-- ===== Tab 1 · 投注（改版）===== -->
          <div class="view view-bet" data-market="lm">
            <div class="gboard">
              <div class="main">
                <div class="playbar pbpk"><span class="pb on" data-act="market" data-arg="lm">两面</span><span class="pb" data-act="market" data-arg="rank">1-10名</span><span class="pb" data-act="market" data-arg="sum">冠亚和</span><span class="viewmode"><span class="on" data-act="skin" data-arg="b" title="紧凑" aria-label="紧凑视图"><svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="3" y="4" width="14" height="5" rx="1.5"/><rect x="3" y="11" width="14" height="5" rx="1.5"/></svg></span><span data-act="skin" data-arg="a" title="宽松" aria-label="宽松视图"><svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1.3"/><rect x="11" y="3" width="6" height="6" rx="1.3"/><rect x="3" y="11" width="6" height="6" rx="1.3"/><rect x="11" y="11" width="6" height="6" rx="1.3"/></svg></span></span><span class="mybets-ico" data-act="show" data-arg="bets" title="我的注单">🧾</span></div>
                <div class="playbar pbssc"><span class="pb on">两面</span><span class="pb">定位胆</span><span class="pb">龙虎</span><span class="pb">总和</span><span class="pb">跨度</span><span class="mybets-ico" data-act="show" data-arg="bets" title="我的注单">🧾</span></div>
                <div class="list game-pk">
                  <div class="grp" data-market="lm"><div class="gh"><b>冠军</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">龙</span><span class="od">1.99</span></div><div class="opt"><span class="nm">虎</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>亚军</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">龙</span><span class="od">1.99</span></div><div class="opt"><span class="nm">虎</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第三名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">龙</span><span class="od">1.99</span></div><div class="opt"><span class="nm">虎</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第四名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">龙</span><span class="od">1.99</span></div><div class="opt"><span class="nm">虎</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第五名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">龙</span><span class="od">1.99</span></div><div class="opt"><span class="nm">虎</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第六名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第七名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第八名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第九名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>第十名</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp" data-market="lm"><div class="gh"><b>冠亚和</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>冠军</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>亚军</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第三名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第四名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第五名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第六名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第七名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第八名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第九名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp rankgrp" data-market="rank"><div class="gh"><b>第十名</b></div><div class="ngrid"><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div></div></div>
                  <div class="grp sumgrp" data-market="sum"><div class="gh"><b>冠亚和</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp sumgrp" data-market="sum"><div class="gh"><b>和值</b></div><div class="ngrid sumgrid"><div class="nb">3</div><div class="nb">4</div><div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div><div class="nb">10</div><div class="nb">11</div><div class="nb">12</div><div class="nb">13</div><div class="nb">14</div><div class="nb">15</div><div class="nb">16</div><div class="nb">17</div><div class="nb">18</div><div class="nb">19</div></div></div>
                </div>
                <div class="list game-ssc">
                  <div class="grp"><div class="gh"><b>万位</b></div><div class="opts">
                    <div class="orow"><div class="opt"><span class="nm">大</span><span class="od">1.99</span></div><div class="opt"><span class="nm">小</span><span class="od">1.99</span></div></div>
                    <div class="orow"><div class="opt"><span class="nm">单</span><span class="od">1.99</span></div><div class="opt"><span class="nm">双</span><span class="od">1.99</span></div></div></div></div>
                  <div class="grp"><div class="gh"><b>个位 · 定位胆</b></div><div class="ngrid">
                    <div class="nb">0</div><div class="nb">1</div><div class="nb">2</div><div class="nb">3</div><div class="nb">4</div>
                    <div class="nb">5</div><div class="nb">6</div><div class="nb">7</div><div class="nb">8</div><div class="nb">9</div></div></div>
                </div>
              </div>
              <div class="gsoon"><div class="ic">🕒</div><b>该游戏即将开放</b><span>玩法上线后会出现在游戏条与全部游戏</span></div>
            </div>
            <div class="bottom-streak"><b>长龙</b><span>冠军大(4期)</span><span>冠亚和单(3期)</span><span>第5名小(3期)</span></div>
            <div class="slip">
              <div class="amtrow"><span class="lb">每注</span><input class="amtin" type="number" inputmode="numeric" placeholder="最低1 - 最高100K"><div class="gear" data-act="showlimitset" title="自定义常用额度"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.3"/><circle cx="12" cy="12" r="4.3"/><line x1="12" y1="2.7" x2="12" y2="5.4"/><line x1="12" y1="18.6" x2="12" y2="21.3"/><line x1="2.7" y1="12" x2="5.4" y2="12"/><line x1="18.6" y1="12" x2="21.3" y2="12"/><line x1="5.42" y1="5.42" x2="7.33" y2="7.33"/><line x1="16.67" y1="16.67" x2="18.58" y2="18.58"/><line x1="16.67" y1="7.33" x2="18.58" y2="5.42"/><line x1="5.42" y1="18.58" x2="7.33" y2="16.67"/></svg></div></div>
              <div class="amt-err"><i class="ae-ico">!</i><span class="ae-msg"></span></div>
              <div class="qa">
                <span class="amtchip mm" data-mm="min">最低</span>
                <span class="amtchip">30</span>
                <span class="amtchip">60</span>
                <span class="amtchip">90</span>
                <span class="amtchip">180</span>
                <span class="amtchip">360</span>
                <span class="amtchip mm" data-mm="max">最高</span>
              </div>
              <div class="foot"><div class="fin"><div class="f1">共 <b class="fin-count">0</b> 注 · 合计 <b class="fin-total">0</b></div><div class="f2">可赢 <span class="fin-win">0</span></div></div><button class="cancel" data-act="clear">清空</button><button class="cta" data-act="confirmbet">查看注单</button></div>
            </div>
            <!-- FAB · 投注历史 -->
            <div class="mybets-fab" data-act="show" data-arg="bets">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5a6480" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
              <span class="fab-badge show">2</span>
            </div>
            <!-- 下注确认弹窗 -->
            <div class="confirm-modal">
              <div class="cf-backdrop" data-act="cfcancel"></div>
              <div class="cf-sheet">
                <div class="cf-h">确认下注</div>
                <div class="cf-meta">第 <b>00089</b> 期</div>
                <div class="cf-list"></div>
                <div class="cf-sum"><span>共 <b class="cf-count">0</b> 注</span><span>合计 <span class="cf-total">0</span></span></div>
                <div class="cf-brk"><div><span>可用余额</span><span class="cfb-bal">0</span></div><div><span>本次投注</span><span class="cfb-total">0</span></div><div class="hi"><span>还差</span><span class="cfb-short">0</span></div></div>
                <div class="cf-btns"><button class="ghost" data-act="cfcancel">再想想</button><button class="cta cf-submit" data-act="cfsubmit">确认提交</button><button class="cta cf-recharge" data-act="show" data-arg="wallet" style="display:none;">去上分</button></div>
              </div>
            </div>
            <!-- 投注触顶封盘弹窗（需求1）-->
            <div class="limit-modal">
              <div class="lm-backdrop" data-act="lmclose"></div>
              <div class="lm-sheet">
                <div class="lm-head"><span class="lm-h">投注已达上限</span></div>
                <div class="lm-body"></div>
                <button class="lm-ok" data-act="lmclose">我知道了</button>
              </div>
            </div>
            <!-- 自定义常用额度设置弹窗 -->
            <div class="limitset-modal">
              <div class="ls-backdrop" data-act="lscancel"></div>
              <div class="ls-sheet">
                <div class="ls-hrow"><span class="ls-h">自定义常用额度</span><span class="ls-clear" data-act="lsclear">清空</span></div>
                <div class="ls-sub">最多 5 档，留空视为不启用，保存后立即生效</div>
                <div class="ls-slots">
                  <div class="ls-slot"><span class="ls-lab">额度1</span><input class="ls-in" type="number" inputmode="numeric" placeholder="10 - 100000" value="30"></div>
                  <div class="ls-slot"><span class="ls-lab">额度2</span><input class="ls-in" type="number" inputmode="numeric" placeholder="10 - 100000" value="60"></div>
                  <div class="ls-slot"><span class="ls-lab">额度3</span><input class="ls-in" type="number" inputmode="numeric" placeholder="10 - 100000" value="90"></div>
                  <div class="ls-slot"><span class="ls-lab">额度4</span><input class="ls-in" type="number" inputmode="numeric" placeholder="10 - 100000" value="180"></div>
                  <div class="ls-slot"><span class="ls-lab">额度5</span><input class="ls-in" type="number" inputmode="numeric" placeholder="10 - 100000" value="360"></div>
                </div>
                <div class="ls-range">每档额度介于 <b>10–100000</b></div>
                <div class="ls-btns">
                  <button class="ghost" data-act="lscancel">取消</button>
                  <button class="cta" data-act="lssave">保存并启用</button>
                </div>
              </div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:11,h:`

          <!-- ===== 历史投注（改版：单行控制条 · 来源下拉切计划 · 已结日期筛选）===== -->
          <div class="view view-bets tab-open">
            <div class="subhead"><span class="bk" data-act="show" data-arg="bet">‹</span><b>历史投注</b><span class="bal" data-act="show" data-arg="wallet"><svg class="wic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><path d="M3 8V6a2 2 0 0 1 2-2h10"/><circle cx="16.5" cy="12.5" r="1.3" fill="currentColor" stroke="none"/></svg><b>240,000.00</b></span></div>
            <div class="scroll2">
              <div class="btabs fg-btabs">
                <span class="btab on" data-act="bettab" data-arg="open">未结</span>
                <span class="btab" data-act="bettab" data-arg="settled">已结</span>
              </div>
              <div class="ctl-row betctl-open" id="betOpenSrc"></div>
              <div class="ctl-row betctl betctl-full">
                <span class="fchip betres on" data-act="betfilter" data-f="all">全部</span>
                <span class="fchip betres" data-act="betfilter" data-f="win">中奖</span>
                <span class="fchip betres" data-act="betfilter" data-f="lose">未中奖</span>
                <span class="sp"></span>
                <span class="betdd"><span class="dt-trigger betsrc" data-act="betsrc"><b>来源</b><i>▾</i></span>
                  <div class="dt-pop" id="betSrcPop">
                    <span class="on" data-act="betsrcpick" data-v="all">全部来源</span>
                    <span data-act="betsrcpick" data-v="manual">手动投注</span>
                    <span class="dt-sep">自动投计划</span>
                    <span data-act="betsrcpick" data-v="p:自定义策略">自定义策略</span>
                    <span data-act="betsrcpick" data-v="p:长龙反投">长龙反投</span>
                    <span data-act="betsrcpick" data-v="p:小本试水">小本试水</span>
                  </div></span>
                <span class="betdd betdt-wrap"><span class="dt-trigger betdt" data-act="betdt"><b>今天</b><i>▾</i></span>
                  <div class="dt-pop" id="betDtPop">
                    <span class="on" data-act="betdtpick" data-v="0">今天</span>
                    <span data-act="betdtpick" data-v="7">最近 7 天</span>
                    <span data-act="betdtpick" data-v="6">本月</span>
                    <span data-act="betdtpick" data-v="custom">自定义日期</span>
                  </div></span>
              </div>
              <div class="btabpanel on" data-btab="open">
                <div class="blist" id="pl-bets-open">
                  <div class="bi" data-src="manual" data-amt="50"><div class="q"><b><i class="gtag">PK10</i>089 期 · 冠军 大</b><span>50 @1.99 · 09:41</span></div><div class="r ropen">49.5</div></div>
                  <div class="bi" data-src="auto" data-plan="自定义策略" data-amt="50"><div class="q"><b><i class="gtag">PK10</i>089 期 · 冠军 大小</b><span><i class="atag">自动投</i>50 @1.99 · 09:41</span></div><div class="r ropen">49.5</div></div>
                </div>
              </div>
              <div class="btabpanel" data-btab="settled">
                <div class="blist" id="pl-bets-settled"></div>
                <div class="loadmore" id="betMore" data-act="betmore">查看更多（+20）</div>
              </div>
            </div>
            <div class="betsum" id="betSum"><div>总注数<b id="bsCount">2</b></div><div>总投入<b id="bsAmt">100</b></div><div id="bsThird">结果<b class="win">99</b></div></div>
            <!-- 自定义日期复用全局 #dtSheet（管理中心交易记录同款，带月份/年份切换）-->
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:28,h:`

          <!-- ===== 全部游戏 ===== -->
          <div class="view view-lobby">
            <div class="subhead"><span class="bk" data-act="show" data-arg="bet">‹</span><b>全部游戏</b><span class="rt">🔍</span></div>
            <div style="flex:1;overflow:auto;">
              <div class="chsub">已开放</div>
              <div class="lobgrid">
                <div class="lobtile live" data-act="gameshow" data-arg="pk"><span class="tg">已开放</span><div class="li">🏎</div><b>极速赛车 PK10</b><span>每 80 秒一期</span></div>
                <div class="lobtile live" data-act="gameshow" data-arg="ssc"><span class="tg">已开放</span><div class="li">🎰</div><b>时时彩 SSC</b><span>每 5 分钟一期</span></div>
              </div>
              <div class="chsub" style="padding-top:14px;">即将上线</div>
              <div class="lobgrid">
                <div class="lobtile soon"><span class="tg">即将上线</span><div class="li">🎲</div><b>快3</b><span>敬请期待</span></div>
                <div class="lobtile soon"><span class="tg">即将上线</span><div class="li">🀄</div><b>六合彩</b><span>敬请期待</span></div>
              </div>
            </div>
          </div>
`});
