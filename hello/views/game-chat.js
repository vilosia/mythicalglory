/* IM168 · 游戏厅 · 聊天室（消息流 / 聊天室搜索）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:7,h:`

          <!-- ===== Tab 3 · 聊天（讨论 · 分享 · 跟单）===== -->
          <div class="view view-chat">
            <div class="scroll" id="chatMessageList" aria-live="polite">
              <div class="sys chat-day">今天</div>
              <div class="msg" id="shareDemoLead"><div class="av">H</div><div class="bubble"><div class="nm"><b>Henry</b> <span>09:33</span></div><p>「长龙反打」刚开始这一轮，满足条件后会自动反向投注。</p></div></div>
              <div class="msg" id="chatMsgLi"><div class="av" style="background:#D6E4FF;color:var(--blue)">李</div><div class="bubble"><div class="nm">李姐 <span>09:35</span></div>我先看这轮触发表现，稳定的话再套用。</div></div>
              <div class="betmsg stg live-strategy-share" id="chatMsgStrategy" data-share-idx="0"></div>
              <div class="msg" id="shareDemoReply"><div class="av" style="background:#E8F5EE;color:#14875A">陈</div><div class="bubble"><div class="nm">陈生 <span>09:37</span></div><p>最近触发结果不错，我去看一下执行动态和风控设置。</p></div></div>
              <div class="msg me" id="chatMsgMine"><div class="av" style="background:var(--blue);color:#fff">我</div><div class="bubble"><div class="nm">我 <span>09:38</span></div>我先观察，开奖前不临时加注。</div></div>
            </div>
            <div class="inputbar chat-inputbar">
              <div class="field ph" contenteditable="true" role="textbox" aria-label="发送群消息" data-placeholder="发送群消息">发送群消息</div>
              <button class="chat-composer-tool chat-emoji-trigger" type="button" data-act="chatemoji" aria-label="选择表情" aria-haspopup="true" aria-expanded="false">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 10h.01M15.5 10h.01M8 14c1 1.5 2.3 2.2 4 2.2s3-.7 4-2.2"/></svg>
              </button>
              <button class="chat-composer-tool chat-more-trigger" type="button" data-act="chatmore" aria-label="更多发送方式" aria-haspopup="true" aria-expanded="false">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>
              </button>
              <button class="sendico disabled" type="button" data-act="chatsend" aria-label="发送群消息" aria-disabled="true">➤</button>
              <div class="chat-composer-popover chat-emoji-panel" id="chatEmojiPanel" aria-label="常用表情" aria-hidden="true">
                <div class="chat-popover-title">常用表情</div>
                <div class="chat-emoji-grid">
                  <button type="button" data-act="chatemojipick" data-arg="😀">😀</button><button type="button" data-act="chatemojipick" data-arg="😄">😄</button><button type="button" data-act="chatemojipick" data-arg="😂">😂</button><button type="button" data-act="chatemojipick" data-arg="😊">😊</button>
                  <button type="button" data-act="chatemojipick" data-arg="😍">😍</button><button type="button" data-act="chatemojipick" data-arg="👍">👍</button><button type="button" data-act="chatemojipick" data-arg="👏">👏</button><button type="button" data-act="chatemojipick" data-arg="🎉">🎉</button>
                  <button type="button" data-act="chatemojipick" data-arg="🔥">🔥</button><button type="button" data-act="chatemojipick" data-arg="❤️">❤️</button><button type="button" data-act="chatemojipick" data-arg="🤔">🤔</button><button type="button" data-act="chatemojipick" data-arg="😭">😭</button>
                </div>
              </div>
              <div class="chat-composer-popover chat-more-panel" id="chatMorePanel" role="menu" aria-hidden="true">
                <button type="button" role="menuitem" data-act="chatattach" data-arg="camera"><span>相机</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z"/><circle cx="12" cy="13" r="3.2"/></svg></button>
                <button type="button" role="menuitem" data-act="chatattach" data-arg="gallery"><span>从图库选择</span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="13" height="15" rx="2"/><path d="m7.5 16 3.2-3.2 2.2 2.1 2-1.8 3.1 3"/><circle cx="14.5" cy="8.5" r="1"/></svg></button>
                <button type="button" role="menuitem" data-act="chatattach" data-arg="file"><span>上传附件</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 12 5.6-5.6a3 3 0 0 1 4.2 4.2l-7.4 7.4a5 5 0 0 1-7.1-7.1l7-7"/><path d="m8 14 7-7"/></svg></button>
              </div>
              <input id="chatCameraInput" class="chat-file-input" type="file" accept="image/*" capture="environment" data-chat-attachment="camera">
              <input id="chatGalleryInput" class="chat-file-input" type="file" accept="image/*" data-chat-attachment="gallery">
              <input id="chatFileInput" class="chat-file-input" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" data-chat-attachment="file">
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:10,h:`

          <!-- ===== 当前群聊内容搜索 ===== -->
          <div class="view view-chatsearch">
            <div class="subhead"><span class="bk" data-act="chatsearchback"><svg class="icx" viewBox="25.0 51.0 11.0 17.0" fill="none"><path d="M34 66L27 59.5L34 53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b>搜索群聊内容</b><span class="rt"></span></div>
            <div class="chat-search-page"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><input type="search" data-chat-search placeholder="搜索消息、成员、期号或策略" aria-label="搜索群聊内容"><button type="button" class="chat-search-clear" data-act="chatsearchclear" aria-label="清空搜索">×</button></div>
            <div class="chat-search-hint">仅搜索「SG飞艇 · 幸运组·游戏厅」中的内容</div>
            <div class="scroll2 chat-search-scroll">
              <section class="chat-search-recent" id="chatSearchRecent">
                <div class="chat-result-title"><b>最近搜索</b><button type="button" data-act="chatsearchrecentclear">清空</button></div>
                <div class="chat-recent-chips" id="chatRecentChips"></div>
              </section>
              <section class="chat-search-found" id="chatSearchFound">
                <div class="chat-search-filters" role="tablist" aria-label="搜索结果类型">
                  <button class="on" type="button" data-act="chatsearchfilter" data-arg="all">全部</button>
                  <button type="button" data-act="chatsearchfilter" data-arg="message">消息</button>
                  <button type="button" data-act="chatsearchfilter" data-arg="strategy">策略</button>
                  <button type="button" data-act="chatsearchfilter" data-arg="member">成员</button>
                </div>
                <div class="chat-result-title"><b>搜索结果</b><span id="chatSearchCount">0 条</span></div>
                <div class="chat-search-results">
                  <div class="chat-search-result" data-chat-search-item data-kind="message member" data-target="shareDemoLead" data-act="chatsearchjump"><div class="csr-av">H</div><div><b>Henry <span>今天 09:33</span></b><p>「长龙反打」刚开始这一轮，满足条件后会自动反向投注。</p><small>前文：今天 · 群内公开消息</small></div></div>
                  <div class="chat-search-result" data-chat-search-item data-kind="strategy" data-target="chatMsgStrategy" data-act="chatsearchjump"><div class="csr-av lilac">策</div><div><b>Henry · 策略分享 <span>今天 09:36</span></b><p>「长龙反打」本轮运行动态 · 86 人使用中</p><small>点击后回到策略卡所在位置</small></div></div>
                  <div class="chat-search-result" data-chat-search-item data-kind="message member" data-target="chatMsgLi" data-act="chatsearchjump"><div class="csr-av green">李</div><div><b>李姐 <span>今天 09:35</span></b><p>我先看这轮触发表现，稳定的话再套用。</p><small>前文：Henry 分享了「长龙反打」</small></div></div>
                  <div class="chat-search-result" data-chat-search-item data-kind="message member" data-target="shareDemoReply" data-act="chatsearchjump"><div class="csr-av orange">陈</div><div><b>陈生 <span>今天 09:37</span></b><p>最近触发结果不错，我去看一下执行动态和风控设置。</p><small>后文：我先观察，开奖前不临时加注</small></div></div>
                  <div class="chat-search-result" data-chat-search-item data-kind="message member" data-target="chatMsgMine" data-act="chatsearchjump"><div class="csr-av blue">我</div><div><b>我 <span>今天 09:38</span></b><p>我先观察，开奖前不临时加注。</p><small>前文：陈生正在查看执行动态</small></div></div>
                </div>
                <div class="chat-search-empty" id="chatSearchEmpty"><b>没有找到相关内容</b><span>试试成员昵称、期号或策略名称</span></div>
              </section>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:13,h:`

          <!-- ===== 群聊详情 ===== -->
          <div class="view view-chatdetail">
            <div class="subhead"><span class="bk" data-act="show" data-arg="chat"><svg class="icx" viewBox="25.0 51.0 11.0 17.0" fill="none"><path d="M34 66L27 59.5L34 53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b>群聊详情</b><span class="rt"></span></div>
            <div class="scroll2 chat-detail-scroll">
              <section class="chat-detail-hero">
                <div class="chat-group-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/><path d="M7 12v3M5.5 13.5h3M15.5 13h.01M17.5 15h.01"/></svg></div>
                <div><h2>幸运组 · 游戏厅</h2><p>28 位成员 · 群主 王哥</p></div>
              </section>

              <section class="chat-detail-section">
                <h3>群描述</h3>
                <div class="chat-detail-copy">SG飞艇走势交流、策略分享与开奖讨论。请勿发布与本群无关的信息。</div>
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

          <!-- ===== 群聊功能 Bottom Sheet ===== -->
          <div class="chat-action-modal" id="chatActionModal" aria-hidden="true">
            <div class="chat-action-backdrop" data-act="chatactionclose"></div>
            <section class="chat-action-sheet" role="dialog" aria-modal="true" aria-labelledby="chatActionTitle">
              <div class="chat-action-head"><b id="chatActionTitle">群聊设置</b><button type="button" data-act="chatactionclose" aria-label="关闭">×</button></div>
              <div id="chatActionBody"></div>
            </section>
          </div>
`});
