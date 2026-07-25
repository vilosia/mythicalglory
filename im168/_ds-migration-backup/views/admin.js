/* IM168 · 群主管理（管理中心首页 / 待审批 / 成员列表 / 成员详情 / 抽成设置 / 群主交易记录）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   2026-07-10：按「管理中心_Redesign_v1」方向 C（单页纵览）改版，去 3-tab，待审批/成员改独立页。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:20,h:`

          <!-- ===== 管理中心首页（单页纵览 · Figma Phase2 风格）===== -->
          <div class="view view-owner">
            <div class="fg-head">
              <span class="bk" data-act="show" data-arg="groups">‹</span><b>管理中心</b><i class="tcaret">▾</i>
              <span class="fg-grp fg-grp-inline">幸运组</span>
              <span class="fg-gear" data-act="show" data-arg="rake"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
            </div>
            <div class="scroll2">
              <div class="admin-home">
                <div class="fg-card fg-hero">
                  <div class="cap">我的额度 <span class="fg-eye" data-act="ageye"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg></span></div>
                  <div class="fg-amt-row">
                    <div class="big" id="agentAmt" data-v="240000" data-real="240,000.00">240,000.00</div>
                  </div>
                  <div class="fg-comm">
                    <div class="g g3">
                      <div><span>今日抽成</span><b id="rkToday">68.00</b></div>
                      <div><span>累计抽成</span><b id="rkTotal">1,240.00</b></div>
                      <div><span>抽成比例<i class="rk-info" data-act="rkinfo" data-tip="抽成比例是按成员投注计算">?</i></span><b id="rkRateShow">0.0008%</b></div>
                    </div>
                  </div>
                </div>

                <div class="admin-2col">
                  <div class="fg-card fg-stat" data-act="show" data-arg="members">
                    <div class="row1"><strong id="memHomeCnt">8</strong><b>成员</b><i>›</i></div>
                    <span>活跃 4/8 · 已停用 1</span>
                  </div>
                  <div class="fg-card fg-stat" data-act="show" data-arg="approvals">
                    <div class="row1"><strong id="apHomeCnt">4</strong><b>待审批<u class="fg-dot"></u></b><i>›</i></div>
                    <span>今天 08:56</span>
                  </div>
                </div>

                <!-- 额度往来内联：日期范围驱动汇总与已完成明细；待审批不混入流水 -->
                <div class="otx-wrap">
                  <div class="md-sec otx-head">
                    <b>额度往来</b>
                    <span class="dt-trigger md-dt" data-act="dtpop" data-list="pl-owner-tx"><b>今天</b><i>▾</i></span>
                    <div class="dt-pop" id="dtPop">
                      <span class="on" data-act="dtpick" data-v="0">今天</span>
                      <span data-act="dtpick" data-v="7">最近 7 天</span>
                      <span data-act="dtpick" data-v="30">最近 30 天</span>
                      <span data-act="dtpick" data-v="all">全部时间</span>
                      <span data-act="dtpick" data-v="custom">自定义日期</span>
                    </div>
                  </div>
                  <div class="tx-summary" id="ownerTxSummary">
                    <div class="txs-item"><span>上分</span><b id="otxUp">0.00</b><small id="otxUpCount">0 笔</small></div>
                    <div class="txs-item"><span>下分</span><b id="otxDown">0.00</b><small id="otxDownCount">0 笔</small></div>
                    <div class="txs-net"><span id="otxNetLabel">额度池净变动</span><b id="otxNet">0.00</b></div>
                    <div class="txs-note">仅统计已完成交易，不含待审批</div>
                  </div>
                  <div class="ctl-row otx-ctl">
                    <div class="filterbar" style="padding:0;flex:1;">
                      <span class="fchip on" data-act="wff" data-list="pl-owner-tx" data-f="all">全部</span>
                      <span class="fchip" data-act="wff" data-list="pl-owner-tx" data-f="out">上分</span>
                      <span class="fchip" data-act="wff" data-list="pl-owner-tx" data-f="in">下分</span>
                    </div>
                  </div>

                  <select class="wfsel hid" data-list="pl-owner-tx">
                    <option value="all">全部时间</option>
                    <option value="0" selected>今天</option>
                    <option value="7">最近 7 天</option>
                    <option value="30">最近 30 天</option>
                  </select>
                  <input type="hidden" class="wfdate" data-list="pl-owner-tx" data-edge="start" value="">
                  <input type="hidden" class="wfdate" data-list="pl-owner-tx" data-edge="end" value="">

                  <div class="blist txlist tx-quiet tx-tag" id="pl-owner-tx">
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 09:12"><div class="q"><b><span class="dtag">下分</span>吴先生</b><span class="txtm">今天 09:12</span></div><div class="r"><b class="win">+80,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 08:35"><div class="q"><b><span class="dtag">上分</span>杨姐</b><span class="txtm">今天 08:35</span></div><div class="r"><b>−15,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 08:12"><div class="q"><b><span class="dtag">下分</span>孙姐</b><span class="txtm">今天 08:12</span></div><div class="r"><b class="win">+6,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 07:58"><div class="q"><b><span class="dtag">上分</span>陈生</b><span class="txtm">今天 07:58</span></div><div class="r"><b>−12,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 07:26"><div class="q"><b><span class="dtag">下分</span>林仔</b><span class="txtm">今天 07:26</span></div><div class="r"><b class="win">+3,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 07:05"><div class="q"><b><span class="dtag">上分</span>李姐</b><span class="txtm">今天 07:05</span></div><div class="r"><b>−18,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 06:48"><div class="q"><b><span class="dtag">下分</span>王哥</b><span class="txtm">今天 06:48</span></div><div class="r"><b class="win">+9,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 06:20"><div class="q"><b><span class="dtag">上分</span>周先生</b><span class="txtm">今天 06:20</span></div><div class="r"><b>−6,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 06:02"><div class="q"><b><span class="dtag">下分</span>刘姐</b><span class="txtm">今天 06:02</span></div><div class="r"><b class="win">+15,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 05:40"><div class="q"><b><span class="dtag">上分</span>吴先生</b><span class="txtm">今天 05:40</span></div><div class="r"><b>−9,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 05:15"><div class="q"><b><span class="dtag">下分</span>周先生</b><span class="txtm">今天 05:15</span></div><div class="r"><b class="win">+11,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 04:52"><div class="q"><b><span class="dtag">上分</span>杨姐</b><span class="txtm">今天 04:52</span></div><div class="r"><b>−14,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 04:20"><div class="q"><b><span class="dtag">下分</span>陈生</b><span class="txtm">今天 04:20</span></div><div class="r"><b class="win">+7,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 03:58"><div class="q"><b><span class="dtag">上分</span>孙姐</b><span class="txtm">今天 03:58</span></div><div class="r"><b>−8,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 03:30"><div class="q"><b><span class="dtag">下分</span>李姐</b><span class="txtm">今天 03:30</span></div><div class="r"><b class="win">+22,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 02:45"><div class="q"><b><span class="dtag">上分</span>刘姐</b><span class="txtm">今天 02:45</span></div><div class="r"><b>−5,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 02:10"><div class="q"><b><span class="dtag">下分</span>林仔</b><span class="txtm">今天 02:10</span></div><div class="r"><b class="win">+4,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="0" data-st="ok" data-time="2026/07/07 01:38"><div class="q"><b><span class="dtag">上分</span>王哥</b><span class="txtm">今天 01:38</span></div><div class="r"><b>−16,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="0" data-st="ok" data-time="2026/07/07 01:05"><div class="q"><b><span class="dtag">下分</span>吴先生</b><span class="txtm">今天 01:05</span></div><div class="r"><b class="win">+9,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="1" data-st="ok" data-time="2026/07/06 21:15"><div class="q"><b><span class="dtag">下分</span>孙姐</b><span class="txtm">昨天 21:15</span></div><div class="r"><b class="win">+12,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="1" data-st="ok" data-time="2026/07/06 18:44"><div class="q"><b><span class="dtag">上分</span>孙姐</b><span class="txtm">昨天 18:44</span></div><div class="r"><b>−10,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="1" data-st="ok" data-time="2026/07/06 14:30"><div class="q"><b><span class="dtag">下分</span>杨姐</b><span class="txtm">昨天 14:30</span></div><div class="r"><b class="win">+7,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="1" data-st="ok" data-time="2026/07/06 11:20"><div class="q"><b><span class="dtag">上分</span>林仔</b><span class="txtm">昨天 11:20</span></div><div class="r"><b>−7,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="1" data-st="ok" data-time="2026/07/06 09:05"><div class="q"><b><span class="dtag">下分</span>王哥</b><span class="txtm">昨天 09:05</span></div><div class="r"><b class="win">+13,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="1" data-st="ok" data-time="2026/07/06 08:12"><div class="q"><b><span class="dtag">上分</span>陈生</b><span class="txtm">昨天 08:12</span></div><div class="r"><b>−9,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="3" data-st="ok" data-time="2026/07/04 20:15"><div class="q"><b><span class="dtag">上分</span>吴先生</b><span class="txtm">07-04 20:15</span></div><div class="r"><b>−25,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="3" data-st="ok" data-time="2026/07/04 09:40"><div class="q"><b><span class="dtag">下分</span>林仔</b><span class="txtm">07-04 09:40</span></div><div class="r"><b class="win">+4,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="4" data-st="ok" data-time="2026/07/03 15:20"><div class="q"><b><span class="dtag">上分</span>刘姐</b><span class="txtm">07-03 15:20</span></div><div class="r"><b>−30,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="5" data-st="ok" data-time="2026/07/02 17:22"><div class="q"><b><span class="dtag">上分</span>孙姐</b><span class="txtm">07-02 17:22</span></div><div class="r"><b>−7,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="6" data-st="ok" data-time="2026/07/01 11:02"><div class="q"><b><span class="dtag">下分</span>陈生</b><span class="txtm">07-01 11:02</span></div><div class="r"><b class="win">+18,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="7" data-st="ok" data-time="2026/06/30 19:05"><div class="q"><b><span class="dtag">下分</span>王哥</b><span class="txtm">06-30 19:05</span></div><div class="r"><b class="win">+30,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="8" data-st="ok" data-time="2026/06/29 11:30"><div class="q"><b><span class="dtag">上分</span>李姐</b><span class="txtm">06-29 11:30</span></div><div class="r"><b>−22,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="9" data-st="ok" data-time="2026/06/28 10:15"><div class="q"><b><span class="dtag">上分</span>陈生</b><span class="txtm">06-28 10:15</span></div><div class="r"><b>−11,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="10" data-st="ok" data-time="2026/06/27 09:30"><div class="q"><b><span class="dtag">上分</span>林仔</b><span class="txtm">06-27 09:30</span></div><div class="r"><b>−5,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="11" data-st="ok" data-time="2026/06/26 15:33"><div class="q"><b><span class="dtag">下分</span>吴先生</b><span class="txtm">06-26 15:33</span></div><div class="r"><b class="win">+5,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="12" data-st="ok" data-time="2026/06/25 13:25"><div class="q"><b><span class="dtag">上分</span>吴先生</b><span class="txtm">06-25 13:25</span></div><div class="r"><b>−35,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="14" data-st="ok" data-time="2026/06/23 12:45"><div class="q"><b><span class="dtag">上分</span>孙姐</b><span class="txtm">06-23 12:45</span></div><div class="r"><b>−16,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="15" data-st="ok" data-time="2026/06/22 10:02"><div class="q"><b><span class="dtag">下分</span>周先生</b><span class="txtm">06-22 10:02</span></div><div class="r"><b class="win">+8,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="17" data-st="ok" data-time="2026/06/20 16:40"><div class="q"><b><span class="dtag">上分</span>杨姐</b><span class="txtm">06-20 16:40</span></div><div class="r"><b>−9,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="19" data-st="ok" data-time="2026/06/18 09:05"><div class="q"><b><span class="dtag">下分</span>杨姐</b><span class="txtm">06-18 09:05</span></div><div class="r"><b class="win">+6,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="21" data-st="ok" data-time="2026/06/16 14:50"><div class="q"><b><span class="dtag">上分</span>王哥</b><span class="txtm">06-16 14:50</span></div><div class="r"><b>−40,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="23" data-st="ok" data-time="2026/06/14 20:11"><div class="q"><b><span class="dtag">下分</span>李姐</b><span class="txtm">06-14 20:11</span></div><div class="r"><b class="win">+25,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="27" data-st="ok" data-time="2026/06/10 11:30"><div class="q"><b><span class="dtag">下分</span>陈生</b><span class="txtm">06-10 11:30</span></div><div class="r"><b class="win">+12,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="32" data-st="ok" data-time="2026/06/05 16:10"><div class="q"><b><span class="dtag">上分</span>李姐</b><span class="txtm">06-05 16:10</span></div><div class="r"><b>−20,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="38" data-st="ok" data-time="2026/05/30 09:20"><div class="q"><b><span class="dtag">上分</span>陈生</b><span class="txtm">05-30 09:20</span></div><div class="r"><b>−15,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="42" data-st="ok" data-time="2026/05/26 10:40"><div class="q"><b><span class="dtag">下分</span>林仔</b><span class="txtm">05-26 10:40</span></div><div class="r"><b class="win">+9,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="46" data-st="ok" data-time="2026/05/22 14:18"><div class="q"><b><span class="dtag">下分</span>孙姐</b><span class="txtm">05-22 14:18</span></div><div class="r"><b class="win">+10,000.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="50" data-st="ok" data-time="2026/05/18 09:40"><div class="q"><b><span class="dtag">上分</span>周先生</b><span class="txtm">05-18 09:40</span></div><div class="r"><b>−12,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="in" data-days="56" data-st="ok" data-time="2026/05/12 16:22"><div class="q"><b><span class="dtag">下分</span>杨姐</b><span class="txtm">05-12 16:22</span></div><div class="r"><b class="win">+6,500.00</b></div></div>
                    <div class="bi tap" data-act="txopen" data-t="out" data-days="60" data-st="ok" data-time="2026/05/08 11:15"><div class="q"><b><span class="dtag">上分</span>李姐</b><span class="txtm">05-08 11:15</span></div><div class="r"><b>−18,000.00</b></div></div>
                  </div>
                  <div class="lst-empty" data-list="pl-owner-tx" style="display:none"><b>没有符合条件的交易记录</b><span>尝试调整方向或时间范围</span></div>
                  <div class="loadmore" id="ownerTxMore" data-act="otxmore" style="display:none">查看更多</div>
                </div>
              </div>
            </div>
          </div>
`});


(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:24,h:`

          <!-- ===== 待审批 V1（任务队列：等待时长排序 · 即批即走 auto-next）===== -->
          <div class="view view-approvals">
            <div class="subhead"><span class="bk" data-act="show" data-arg="owner">‹</span><b>待审批</b><span class="rt apr-balchip" data-act="show" data-arg="owner"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><path d="M3 8V6a2 2 0 0 1 2-2h10"/></svg><b id="apPoolNum" data-v="240000">240,000.00</b></span></div>
            <div class="scroll2">
              <div class="btabs fg-btabs">
                <span class="btab on" data-act="bettab" data-arg="apup" data-scope="apv">上分申请<u class="cnt">3</u></span>
                <span class="btab" data-act="bettab" data-arg="apdown" data-scope="apv">下分申请<u class="cnt">1</u></span>
              </div>

              <div class="btabpanel on" data-btab="apup" data-scope="apv">
                                <div class="apr-card" data-pool="-20000" data-nm="王哥" data-typ="上分申请">
                  <div class="apr-r1"><span class="av">王</span><span class="apr-who"><b>王哥</b><span class="apr-wait">今天08:56 • 已申请: 3次</span></span><span class="apr-side"><em class="amt">20,000.00</em><span class="apr-credit">当前额度: 100</span></span></div>
                  <div class="apc-btns"><span class="abtn stop" data-act="aprno">拒绝</span><span class="abtn pri2" data-act="aprok">通过</span></div>
                </div>

                <div class="apr-card" data-nm="刘姐" data-typ="上分申请">
                  <div class="apr-r1"><span class="av" style="background:#F7D9E2;color:#C2337E">刘</span><span class="apr-who"><b>刘姐</b><span class="apr-wait">今天08:21 • 已申请: 2次</span></span><span class="apr-side"><em class="amt">300,000.00</em><span class="apr-credit">当前额度: 0</span></span></div>
                  <div class="apr-guard"><i class="mi-info gd"></i>可分配额度不足</div>
                  <div class="apc-btns"><span class="abtn stop" data-act="aprno">拒绝</span><span class="abtn pri2 dis">通过</span></div>
                </div>

                <div class="apr-card" data-pool="-50000" data-nm="杨姐" data-typ="上分申请">
                  <div class="apr-r1"><span class="av" style="background:#FFE9A0;color:#9A6C00">杨</span><span class="apr-who"><b>杨姐</b><span class="apr-wait">今天06:26 • 已申请: 1次</span></span><span class="apr-side"><em class="amt">50,000.00</em><span class="apr-credit">当前额度: 80</span></span></div>
                  <div class="apc-btns"><span class="abtn stop" data-act="aprno">拒绝</span><span class="abtn pri2" data-act="aprok">通过</span></div>
                </div>
              </div>

              <div class="btabpanel" data-btab="apdown" data-scope="apv">
                                <div class="apr-card" data-pool="80000" data-nm="吴先生" data-typ="下分申请">
                  <div class="apr-r1"><span class="av" style="background:#E3DBFF;color:#5A3FC0">吴</span><span class="apr-who"><b>吴先生</b><span class="apr-wait">今天09:18 • 已申请: 1次</span></span><span class="apr-side"><em class="amt">80,000.00</em><span class="apr-credit">当前额度: 300</span></span></div>
                  <div class="apc-btns"><span class="abtn stop" data-act="aprno">拒绝</span><span class="abtn pri2" data-act="aprok">通过</span></div>
                </div>
              </div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:25,h:`

          <!-- ===== 成员 V2（发现与导航：搜索 → 状态+排序 → 列表 → 分页）===== -->
          <div class="view view-members">
            <div class="subhead"><span class="bk" data-act="show" data-arg="owner">‹</span><b>成员<em class="hd-sub">8 位成员</em></b><span class="rt"></span></div>
            <div class="scroll2">
              <div class="btabs fg-btabs">
                <span class="btab on" data-act="mtab" data-f="all">全部</span>
                <span class="btab" data-act="mtab" data-f="act">活跃</span>
                <span class="btab" data-act="mtab" data-f="idle">不活跃</span>
                <span class="btab" data-act="mtab" data-f="fz">已停用</span>
              </div>

              <div class="ctl-row">
                <div class="psrch"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/></svg><input type="text" data-roster="pl-members" placeholder="搜索成员名或账号"><span class="clr" data-act="sclr">✕</span></div>
                <span class="dt-trigger" data-act="msopen"><b>排序</b><i>▾</i></span>
                <div class="dt-pop" id="msPop">
                  <span class="on" data-act="mspick" data-k="bet_asc">最近投注</span>
                  <span data-act="mspick" data-k="cr_desc">额度从高到低</span>
                  <span data-act="mspick" data-k="cr_asc">额度从低到高</span>
                  <span data-act="mspick" data-k="join_asc">加入时间</span>
                </div>
              </div>

              <div class="memroster pagelist" id="pl-members" data-size="5">
                <div class="mrow tap" data-st="act" data-bet="0" data-credit="80000" data-join="40" data-name="吴先生" data-mid="88201" data-act="show" data-arg="member"><span class="av" style="background:#E3DBFF;color:#5A3FC0">吴</span><div class="mtx"><b>吴先生</b><span>今天 09:20 投注</span></div><i>›</i></div>
                <div class="mrow tap" data-st="act" data-bet="0" data-credit="30000" data-join="120" data-name="李姐" data-mid="88202" data-act="show" data-arg="member"><span class="av" style="background:#D6E4FF;color:#0B52CC">李</span><div class="mtx"><b>李姐</b><span>今天 08:35 投注</span></div><i>›</i></div>
                <div class="mrow tap" data-st="act" data-bet="0" data-credit="19000" data-join="34" data-name="王哥" data-mid="88213" data-act="show" data-arg="member"><span class="av">王</span><div class="mtx"><b>王哥</b><span>今天 07:58 投注</span></div><i>›</i></div>
                <div class="mrow tap" data-st="act" data-bet="1" data-credit="6000" data-join="88" data-name="刘姐" data-mid="88204" data-act="show" data-arg="member"><span class="av" style="background:#FDE8D2;color:#B4640A">刘</span><div class="mtx"><b>刘姐</b><span>昨天 21:15 投注</span></div><i>›</i></div>
                <div class="mrow tap" data-st="fz" data-bet="3" data-credit="20000" data-join="200" data-name="陈生" data-mid="88205" data-act="show" data-arg="member"><span class="av" style="background:#F7D9E2;color:#C2337E">陈</span><div class="mtx"><b>陈生<em class="stchip fz">已停用</em></b><span>3 天前投注</span></div><i>›</i></div>
                <div class="mrow tap" data-st="idle" data-bet="22" data-credit="15000" data-join="150" data-name="杨姐" data-mid="88206" data-act="show" data-arg="member"><span class="av" style="background:#FFE9A0;color:#9A6C00">杨</span><div class="mtx"><b>杨姐</b><span>22 天前投注</span></div><i>›</i></div>
                <div class="mrow tap" data-st="idle" data-bet="35" data-credit="0" data-join="300" data-name="周先生" data-mid="88207" data-act="show" data-arg="member"><span class="av" style="background:#DDEFE0;color:#1FA971">周</span><div class="mtx"><b>周先生</b><span>超过 30 天未投注</span></div><i>›</i></div>
                <div class="mrow tap" data-st="idle" data-bet="999" data-credit="0" data-join="3" data-name="林仔" data-mid="88209" data-act="show" data-arg="member"><span class="av" style="background:#D9F0E5;color:#0B7A4B">林</span><div class="mtx"><b>林仔</b><span>尚无投注</span></div><i>›</i></div>
              </div>
              <div class="lst-empty" data-roster="pl-members" style="display:none"><b>没有找到符合条件的成员</b><span>尝试修改搜索内容或筛选条件</span></div>
              <div class="loadmore" id="memMore" data-act="lmore" data-list="pl-members" style="display:none">查看更多</div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:21,h:`

          <!-- ===== 成员详情 V3（身份+编辑 · 额度 · 记录；低频动作移编辑页）===== -->
          <div class="view view-member">
            <div class="subhead"><span class="bk" data-act="show" data-arg="members">‹</span><b>成员详情</b><span class="rt"></span></div>
            <div class="scroll2">
              <div class="md-fzbar" id="mdFzBar" style="display:none">
                <span class="md-fz-txt"><b>已停用游戏权限</b><i>无法下注、使用自动投或申请额度</i></span>
                <button class="md-unfz" data-act="freezeask">恢复游戏权限</button>
              </div>
              <div class="md-id tap" data-act="show" data-arg="memberedit">
                <span class="av">王</span>
                <div class="md-id-mid">
                  <div class="md-name"><b>王哥</b><span class="md-idpill" data-act="idcopy">#88213<i></i></span><em class="stchip ok" style="display:none">活跃</em></div>
                  <span class="md-idnum">今天 09:20 投注</span>
                </div>
                <i class="md-chev">›</i>
              </div>

              <div class="md-credit">
                <div class="md-cr-head"><span>当前额度</span><b>19,000.00</b></div>
                <div class="md-cr-stats">
                  <div class="mds"><span>累计总盈亏</span><b>+32,450.00</b></div>
                  <div class="mds"><span>群主累计抽成</span><b>1,240.00</b></div>
                </div>
              </div>

              <div class="member-tx-card">
              <div class="md-sec member-tx-head">
                <b>额度往来</b>
                <span class="dt-trigger md-dt" data-act="mhpop" data-list="pl-member-hist"><b>本月</b><i>▾</i></span>
                <div class="dt-pop" id="mhPop">
                  <span data-act="mhpick" data-v="0">今天</span>
                  <span data-act="mhpick" data-v="7">最近 7 天</span>
                  <span class="on" data-act="mhpick" data-v="m">本月</span>
                  <span data-act="mhpick" data-v="all">全部时间</span>
                  <span data-act="mhpick" data-v="custom">自定义日期</span>
                </div>
              </div>
              <div class="tx-summary member-tx-summary" id="memberTxSummary">
                <div class="txs-item"><span>上分</span><b id="mhUp">0.00</b><small id="mhUpCount">0 笔</small></div>
                <div class="txs-item"><span>下分</span><b id="mhDown">0.00</b><small id="mhDownCount">0 笔</small></div>
                <div class="txs-net"><span id="mhNetLabel">净上分</span><b id="mhNet">0.00</b></div>
                <div class="txs-note">仅统计已完成交易，不含待审批</div>
              </div>
              <div class="ctl-row mh-tabs">
                <div class="filterbar" style="padding:0;flex:1;">
                  <span class="fchip on" data-act="mhtab" data-f="all">全部</span>
                  <span class="fchip" data-act="mhtab" data-f="up">上分</span>
                  <span class="fchip" data-act="mhtab" data-f="down">下分</span>
                </div>
              </div>
              <div class="blist txlist tx-quiet tx-tag" id="pl-member-hist">
                <div class="bi tap" data-t="up" data-days="0" data-act="txopen"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">今天 14:20</span></div><div class="r"><b class="win">+30,000.00</b></div></div>
                <div class="bi tap" data-t="down" data-days="0" data-act="txopen"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">今天 11:05</span></div><div class="r"><b>−5,000.00</b></div></div>
                <div class="bi tap" data-t="up" data-days="0" data-act="txopen"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">今天 09:12</span></div><div class="r"><b class="win">+8,000.00</b></div></div>
                <div class="bi tap" data-t="down" data-days="7" data-act="txopen"><div class="q"><b><span class="dtag">下分</span>额度</b><span class="txtm">06-30 18:40</span></div><div class="r"><b>−15,000.00</b></div></div>
                <div class="bi tap" data-t="up" data-days="15" data-act="txopen"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">06-22 15:20</span></div><div class="r"><b class="win">+20,000.00</b></div></div>
                <div class="bi tap" data-t="up" data-days="30" data-act="txopen"><div class="q"><b><span class="dtag">上分</span>额度</b><span class="txtm">06-07 16:20</span></div><div class="r"><b class="win">+10,000.00</b></div></div>
              </div>
              <div class="lst-empty" id="mhEmpty" style="display:none"><b>该时间范围内没有记录</b><span>试试更换时间范围</span></div>
              <div class="loadmore" id="mhMore" data-act="lmore" data-list="pl-member-hist" style="display:none">查看更多</div>
              </div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:26,h:`

          <!-- ===== 编辑成员（备注昵称 · 低频管理动作）===== -->
          <div class="view view-memberedit">
            <div class="subhead"><span class="bk" data-act="show" data-arg="member">‹</span><b>王哥</b><span class="rt me-save" data-act="medsave">保存</span></div>
            <div class="scroll2">
              <div class="me-profile">
                <span class="av me-bigav">王</span>
                <div class="me-role">Wang Zhi Ming</div>
              </div>

              <div class="me-field"><label>备注昵称 <em>仅群主可见 · 便于辨认</em></label><input type="text" value="王哥" placeholder="例如 VIP王 / 高频王"></div>

              <div class="me-sechead">管理</div>
              <div class="blist me-actions">
                <div class="frow2" data-act="mdcopy"><i class="mmi-copy"></i><b>复制成员 ID</b><span class="frv">88213</span></div>
                <div class="frow2 danger" data-act="freezeask"><i class="mmi-fz"></i><b>停用游戏权限</b><i class="mi-cv">›</i></div>
              </div>
            </div>

            <!-- 冻结确认 bottom sheet -->
            <div class="fz-sheet" id="fzSheet">
              <div class="fz-back" data-act="fzclose"></div>
              <div class="fz-panel">
                <div class="fz-title" id="fzTitle">停用游戏权限 - 王哥</div>
                <div class="fz-body" id="fzBody">停用后，该成员将无法：<ul><li>下注或使用自动投</li><li>申请额度</li></ul>已下注单照常开奖结算，现有额度会保留，您可随时恢复。</div>
                <div class="fz-note-wrap" id="fzNoteWrap"><div class="fz-note-lab">停用原因（选填）</div><textarea class="pm-reason fz-note" id="fzNote" rows="2" placeholder="例如: 异常投注"></textarea></div>
                <div class="fz-btns"><button class="fz-ghost" data-act="fzclose">取消</button><button class="cta danger fz-go" data-act="fzdone">确认停用</button></div>
              </div>
            </div>
          </div>

`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:22,h:`

          <!-- ===== 抽成设置 V4（设置与试算分离；试算使用独立 Bottom Drawer）===== -->
          <div class="view view-rake">
            <div class="subhead"><span class="bk" data-act="rkback">‹</span><b>抽成设置</b><span class="rt"></span></div>
            <div class="scroll2">
              <div class="rakecard rk-formula">
                <div class="rk-lab rk-titlelab">抽成方式</div>
                <div class="rk-modes" id="rkSeg">
                  <div class="rk-mode on" data-act="rkseg" data-arg="stake"><b>按成员投注</b><span>按成员投注额度计算抽成</span></div>
                  <div class="rk-mode" data-act="rkseg" data-arg="win"><b>按成员盈利</b><span>按成员投注获得的盈利计算抽成</span></div>
                </div>

                <div class="rk-lab rk-lab-gap">抽成比例 (%) <em class="rk-sub">支持 4 位小数</em></div>
                <div class="rk-presets">
                  <span class="rkp" data-act="rkp" data-v="0.0005">0.0005</span>
                  <span class="rkp on" data-act="rkp" data-v="0.0008">0.0008</span>
                  <span class="rkp" data-act="rkp" data-v="0.0010">0.0010</span>
                  <span class="rkp" data-act="rkpcustom" id="rkpOther">自定义</span>
                </div>
                <div class="rk-custom" id="rkCustomRow" style="display:none"><span>自定义比例 (%)</span><div class="rk-in"><input type="text" id="rkRate" value="0.0008" inputmode="decimal" maxlength="8"></div></div>

                <div class="rk-current">
                  <i class="rk-current-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 8h9M17.5 8H21"/><circle cx="15" cy="8" r="2.6"/><path d="M3 16h3.5M12 16h9"/><circle cx="9" cy="16" r="2.6"/></svg></i><div><b>当前设置</b><span><em id="rkCurrentMode">按成员投注额度抽成</em><i></i>比例 <strong id="rkCurrentRate">0.0008%</strong></span></div>
                </div>

                <div class="rk-tool" data-act="rksimopen">
                  <i class="rkpv-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M8 7h8"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/></svg></i>
                  <div><b>试算工具</b><span>输入额度，估算预计可获得的抽成，<br>仅供参考。</span></div><em>试算</em><i class="arr">›</i>
                </div>
              </div>
            </div>
            <div class="ftcta"><button class="ghost" data-act="rkreset">恢复原设置</button><button class="cta dim" id="rkSaveBtn" data-act="rksave">保存修改</button></div>

            <div class="fz-sheet" id="rkSheet">
              <div class="fz-back" data-act="rkclose"></div>
              <div class="fz-panel">
                <div class="fz-title">修改抽成设置</div>
                <div class="fz-body">保存后：<ul><li>修改将于下一期开始生效</li><li>历史数据不会重新计算</li></ul></div>
                <div class="fz-btns"><button class="fz-ghost" data-act="rkclose">取消</button><button class="cta" data-act="rkconfirm">保存</button></div>
              </div>
            </div>

            <div class="tpl-modal rk-sim-sheet" id="rkSimSheet">
              <div class="cf-backdrop" data-act="rksimclose"></div>
              <div class="cf-sheet">
                <div class="rk-sim-title">抽成试算</div>
                <div class="rk-sim-sub">输入额度查看预计抽成，仅供参考</div>
                <label class="rkpv-lab2" id="rkTestLab">成员投注额度</label>
                <div class="rk-sim-input"><input class="rkpv-in" type="number" id="rkTest" value="10000" inputmode="numeric"></div>
                <div class="rkpv-out rk-sim-out">
                  <div class="num"><small>预计抽成</small><b id="rkOut">0.08</b></div>
                  <span class="rkpv-rate"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6"/><path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"/></svg>按当前比例 <b id="rkRateLine">0.0008%</b> 计算</span>
                </div>
                <button class="cta rk-sim-close" data-act="rksimclose">关闭</button>
              </div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:28,h:`

          <!-- ===== 自定义日期 日历（全局共用，data-list 指定目标）===== -->
              <div class="tpl-modal" id="dtSheet" data-list="pl-owner-tx" data-ym="2026-07">
                <div class="cf-backdrop" data-act="dtclose"></div>
                <div class="cf-sheet">
                  <div class="cf-h" style="display:flex;align-items:center;">自定义日期<span data-act="dtclose" style="margin-left:auto;color:var(--muted);cursor:pointer;font-weight:400;">✕</span></div>
                  <div class="dt-cal-h"><span class="dt-nav" data-act="dtmon" data-d="-12">«</span><span class="dt-nav" data-act="dtmon" data-d="-1">‹</span><b id="dtYm" data-act="dtymtoggle">2026年7月 ▾</b><span class="dt-nav" data-act="dtmon" data-d="1">›</span><span class="dt-nav" data-act="dtmon" data-d="12">»</span></div>
                  <div class="dt-ym" id="dtYmPanel" style="display:none">
                    <div class="dt-ym-yr"><span class="dt-nav" data-act="dtymyr" data-d="-1">‹</span><b id="dtYmYear">2026</b><span class="dt-nav" data-act="dtymyr" data-d="1">›</span></div>
                    <div class="dt-ym-grid" id="dtYmGrid"></div>
                  </div>
                  <div class="dt-grid" id="dtGrid"></div>
                  <div class="dt-foot"><span class="dt-sel-label" id="dtSelLabel">点选起止日期</span><button class="cta" data-act="dtapply">应用</button></div>
                </div>
              </div>
`});
