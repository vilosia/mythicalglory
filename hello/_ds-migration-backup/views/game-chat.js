/* IM168 · 游戏厅 · 聊天室（消息流 / 聊天室搜索）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:7,h:`

          <!-- ===== Tab 3 · 聊天（讨论 · 分享 · 跟单）===== -->
          <div class="view view-chat">
            <div class="chat-top">
              <div class="chat-search-entry" data-act="show" data-arg="chatsearch" role="search" aria-label="搜索群聊内容">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
                <span>搜索群聊内容</span>
              </div>
              <button class="chat-more" data-act="show" data-arg="chatdetail" aria-label="群聊详情"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg></button>
            </div>
            <div class="scroll">
              <div class="sys">今天 09:30 · 群内公开消息</div>
              <div class="msg"><div class="av">H</div><div class="bubble"><div class="nm">Henry <span>09:33</span></div>「长龙反打」刚开始这一轮，满足条件后会自动反向投注。</div></div>
              <div class="msg"><div class="av" style="background:#D6E4FF;color:#0B52CC">李</div><div class="bubble"><div class="nm">李姐 <span>09:35</span></div>我先看这轮触发表现，稳定的话再套用。</div></div>
              <div class="betmsg stg live-strategy-share" data-share-idx="0"></div>
              <div class="msg"><div class="av" style="background:#E8F5EE;color:#14875A">陈</div><div class="bubble"><div class="nm">陈生 <span>09:37</span></div>最近触发结果不错，我去看一下实时动态和风控设置。</div></div>
              <div class="sys">陈生已查看「长龙反打」本轮动态</div>
              <div class="msg me"><div class="av" style="background:#126BFF;color:#fff">我</div><div class="bubble"><div class="nm">我 <span>09:38</span></div>我先观察，开奖前不临时加注。</div></div>
              <div class="sys">策略运行数据按分享设置公开</div>
            </div>
            <div class="inputbar"><div class="field ph" style="flex:1">发送群消息</div><span class="sendico">➤</span></div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:10,h:`

          <!-- ===== 当前群聊内容搜索 ===== -->
          <div class="view view-chatsearch">
            <div class="subhead"><span class="bk" data-act="show" data-arg="chat">‹</span><b>搜索群聊内容</b><span class="rt"></span></div>
            <div class="chat-search-page"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><input type="search" data-chat-search placeholder="搜索消息、期数或策略名称" aria-label="搜索群聊内容"></div>
            <div class="chat-search-hint">仅搜索「幸运组 · 游戏厅」内的公开消息</div>
            <div class="scroll2 chat-search-scroll">
              <div class="chat-result-title"><b>最近消息</b><span id="chatSearchCount">4 条</span></div>
              <div class="chat-search-results">
                <div class="chat-search-result" data-chat-search-item data-act="show" data-arg="chat"><div class="csr-av">H</div><div><b>Henry <span>今天 09:33</span></b><p>「长龙反打」刚开始这一轮，满足条件后会自动反向投注。</p></div></div>
                <div class="chat-search-result" data-chat-search-item data-act="show" data-arg="chat"><div class="csr-av lilac">策</div><div><b>策略分享 <span>今天 09:36</span></b><p>Henry 正在分享「长龙反打」当前这一轮运行</p></div></div>
                <div class="chat-search-result" data-chat-search-item data-act="show" data-arg="chat"><div class="csr-av green">李</div><div><b>李姐 <span>今天 09:35</span></b><p>我先看这轮触发表现，稳定的话再套用。</p></div></div>
                <div class="chat-search-result" data-chat-search-item data-act="show" data-arg="chat"><div class="csr-av orange">陈</div><div><b>陈生 <span>今天 09:37</span></b><p>最近触发结果不错，我去看一下实时动态和风控设置。</p></div></div>
              </div>
              <div class="chat-search-empty" id="chatSearchEmpty"><b>没有找到相关消息</b><span>试试成员昵称、期数或策略名称</span></div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:13,h:`

          <!-- ===== 群聊详情 ===== -->
          <div class="view view-chatdetail">
            <div class="subhead"><span class="bk" data-act="show" data-arg="chat">‹</span><b>群聊详情</b><span class="rt"></span></div>
            <div class="scroll2 chat-detail-scroll">
              <section class="chat-detail-hero">
                <div class="chat-group-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/><path d="M7 12v3M5.5 13.5h3M15.5 13h.01M17.5 15h.01"/></svg></div>
                <div><h2>幸运组 · 游戏厅</h2><p>28 位成员 · 群主 王哥</p></div>
              </section>

              <section class="chat-detail-section">
                <h3>群描述</h3>
                <div class="chat-detail-copy">PK10 走势交流、策略分享与开奖讨论。请勿发布与本群无关的信息。</div>
              </section>

              <section class="chat-detail-section">
                <div class="chat-detail-title"><h3>成员</h3><button data-act="chatmembers">查看全部 28 人</button></div>
                <div class="chat-member-card">
                  <div><i class="cm-av owner">王</i><span>王哥<em>群主</em></span></div>
                  <div><i class="cm-av">李</i><span>李姐</span></div>
                  <div><i class="cm-av green">陈</i><span>陈生</span></div>
                  <div><i class="cm-av blue">我</i><span>我</span></div>
                  <div class="more"><i class="cm-av">+24</i><span>更多</span></div>
                </div>
              </section>

              <section class="chat-detail-section">
                <h3>群聊设置</h3>
                <div class="chat-detail-list">
                  <button class="chat-detail-row" data-act="chatnotify"><i><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg></i><span>消息通知</span><em id="chatNotifyValue">全部消息</em><b>›</b></button>
                  <button class="chat-detail-row" data-act="show" data-arg="chatsearch"><i><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg></i><span>查找群聊内容</span><b>›</b></button>
                  <button class="chat-detail-row" data-act="chatreport"><i><svg viewBox="0 0 24 24"><path d="M12 3 21 20H3L12 3Z"/><path d="M12 9v4M12 17h.01"/></svg></i><span>举报群聊</span><b>›</b></button>
                </div>
              </section>

              <button class="chat-leave" data-act="chatleave"><svg viewBox="0 0 24 24"><path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10"/></svg>退出群聊</button>
            </div>
          </div>
`});
