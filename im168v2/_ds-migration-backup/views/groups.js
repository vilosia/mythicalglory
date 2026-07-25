/* IM168 · 聊天/群组列表 · 消息 · 全局搜索
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:0,h:`

          <!-- ===== 首页 / 消息 ===== -->
          <div class="view view-home on">
            <div class="imhead">
              <span class="ham" data-act="drawer"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></span>
              <span class="ttl">消息</span>
              <span class="sp"></span>
              <span class="hact" data-act="show" data-arg="search" aria-label="搜索"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span>
            </div>
            <div class="imempty" style="flex:1;">
              <div class="ie-ico"><svg viewBox="0 0 24 24"><path d="M4 6h16v12H9l-4 4v-4H4z"/></svg></div>
              <p>暂无消息</p>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:2,h:`

          <!-- ===== 聊天 / 群组（风格 B）===== -->
          <div class="view view-groups">
            <div class="imsearch"><input placeholder="搜索"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></div>
            <div class="siterow">
              <span class="sitem" data-act="drawer" aria-label="打开侧边栏"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></span>
              <span class="sitem on" data-act="sgrp"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>最近</span>
              <span class="sitem" data-act="sgrp">幸运组</span>
              <span class="sitem" data-act="sgrp">VIP 大厅</span>
              <span class="sitem" data-act="sgrp">极速专区</span>
            </div>
            <div class="imchips">
              <span class="imchip on">全部</span>
              <span class="imchip">未读</span>
              <span class="imchip">已加入</span>
              <span class="imchip">未加入</span>
            </div>
            <div class="imlist" style="flex:1;overflow:auto;">
              <div class="chsub">频道内群组</div>
              <div class="imrow im-pin" data-act="show" data-arg="owner">
                <div class="sq sq-admin">管</div>
                <div class="gx"><b>幸运组 · 管理面板</b><span><em id="pinApTxt">4</em> 个待审核申请</span></div>
                <div class="rmeta"><span class="badge" id="pinApCnt">4</span></div>
              </div>
              <div class="imrow"><div class="sq sq-notice"><svg viewBox="0 0 24 24"><path d="M4 9v6h4l7 4V5L8 9H4z"/><path d="M18 9a4 4 0 0 1 0 6"/></svg></div><div class="gx"><b>公告</b><span>群主：今晚 8 点开盘</span></div><span class="arr">›</span></div>
              <div class="imrow" data-act="show" data-arg="bet"><div class="sq sq-game"><svg viewBox="0 0 24 24"><path d="M5 8h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/><path d="M7 12v3M5.5 13.5h3"/><path d="M15.5 13h.01M17.5 15h.01"/></svg></div><div class="gx"><b>幸运组·游戏厅</b><span>投注 · 自动投 · 聊天</span></div><div class="rmeta"><span class="badge">12</span></div></div>
              <div class="imrow"><div class="sq sq-chat"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-4 4v-4H4z"/></svg></div><div class="gx"><b>极速专区·闲聊</b><span>王哥：今天手气不错</span></div><div class="rmeta"><span class="badge">3</span></div></div>
              <div class="imrow"><div class="sq sq-red"><svg viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" rx="2"/><path d="M4 9V6h16v3M12 9v11"/><path d="M9 6a3 3 0 0 1 3-2 3 3 0 0 1 3 2"/></svg></div><div class="gx"><b>VIP大厅·优惠群</b><span>李姐 发了一个红包</span></div><span class="arr">›</span></div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:9,h:`

          <!-- ===== 外层消息搜索（首页 🔍）===== -->
          <div class="view view-search">
            <div class="subhead"><span class="bk" data-act="show" data-arg="home">‹</span><b>搜索</b><span class="rt"></span></div>
            <div class="searchbar">🔍 搜索消息 / 注单 / 成员 / 计划…</div>
            <div class="scroll2" style="flex:1;">
              <div class="chsub">最近搜索</div>
              <div class="gitem"><div class="ico">🕘</div><div class="gx"><b>冠军大</b></div><span class="arr">›</span></div>
              <div class="gitem"><div class="ico">🕘</div><div class="gx"><b>王哥</b></div><span class="arr">›</span></div>
              <div class="btabs">
                <span class="btab on" data-act="bettab" data-arg="msg" data-scope="search">消息</span>
                <span class="btab" data-act="bettab" data-arg="bet" data-scope="search">注单</span>
                <span class="btab" data-act="bettab" data-arg="member" data-scope="search">成员</span>
                <span class="btab" data-act="bettab" data-arg="plan" data-scope="search">计划</span>
              </div>
              <div class="btabpanel on" data-btab="msg" data-scope="search">
                <div class="blist pagelist" id="pl-search-msg" data-size="3">
                  <div class="bi"><div class="q"><b>王哥</b><span>这期车头看大，跟一手</span></div><div class="r" style="color:var(--muted)">09:38</div></div>
                  <div class="bi"><div class="q"><b>李姐</b><span>自动投挂上了，跟投模式 😎</span></div><div class="r" style="color:var(--muted)">09:36</div></div>
                  <div class="bi"><div class="q"><b>陈生</b><span>冠军大 稳一点的</span></div><div class="r" style="color:var(--muted)">09:20</div></div>
                  <div class="bi"><div class="q"><b>王哥</b><span>刚才那把冠军大中了</span></div><div class="r" style="color:var(--muted)">09:15</div></div>
                </div>
                <div class="pager" data-target="pl-search-msg"><span class="pgbtn" data-act="pgnav" data-target="pl-search-msg" data-dir="prev">‹</span><span class="pgtxt">1 / 2</span><span class="pgbtn" data-act="pgnav" data-target="pl-search-msg" data-dir="next">›</span></div>
              </div>
              <div class="btabpanel" data-btab="bet" data-scope="search">
                <div class="blist pagelist" id="pl-search-bet" data-size="3">
                  <div class="bi"><div class="q"><b>089 期 · 冠军大</b><span>50 @1.99</span></div><div class="r" style="color:var(--muted)">待开</div></div>
                  <div class="bi"><div class="q"><b>088 期 · 冠军大</b><span>80 @1.99</span></div><div class="r win">+78</div></div>
                  <div class="bi"><div class="q"><b>082 期 · 冠军大</b><span>100 @1.99</span></div><div class="r win">+99</div></div>
                </div>
                <div class="pager" data-target="pl-search-bet"><span class="pgbtn" data-act="pgnav" data-target="pl-search-bet" data-dir="prev">‹</span><span class="pgtxt">1 / 1</span><span class="pgbtn" data-act="pgnav" data-target="pl-search-bet" data-dir="next">›</span></div>
              </div>
              <div class="btabpanel" data-btab="member" data-scope="search">
                <div class="blist pagelist" id="pl-search-member" data-size="3">
                  <div class="bi"><div class="q"><b>王哥</b><span>剩余额度 190</span></div><div class="r" style="color:var(--muted)">›</div></div>
                  <div class="bi"><div class="q"><b>王先生</b><span>剩余额度 60</span></div><div class="r" style="color:var(--muted)">›</div></div>
                </div>
                <div class="pager" data-target="pl-search-member"><span class="pgbtn" data-act="pgnav" data-target="pl-search-member" data-dir="prev">‹</span><span class="pgtxt">1 / 1</span><span class="pgbtn" data-act="pgnav" data-target="pl-search-member" data-dir="next">›</span></div>
              </div>
              <div class="btabpanel" data-btab="plan" data-scope="search">
                <div class="blist pagelist" id="pl-search-plan" data-size="3">
                  <div class="bi"><div class="q"><b>跟投 · 冠军大小</b><span>运行中 · 已投 3 期</span></div><div class="r win">+120</div></div>
                </div>
                <div class="pager" data-target="pl-search-plan"><span class="pgbtn" data-act="pgnav" data-target="pl-search-plan" data-dir="prev">‹</span><span class="pgtxt">1 / 1</span><span class="pgbtn" data-act="pgnav" data-target="pl-search-plan" data-dir="next">›</span></div>
              </div>
            </div>
          </div>
`});
