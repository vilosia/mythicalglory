/* IM168 · 资讯首页（App 首页）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:1,h:`

          <!-- ===== 资讯首页 ===== -->
          <div class="view view-news shell-view">
            <div class="newscats" role="tablist" aria-label="资讯分类">
              <button class="newscat on" type="button" role="tab" aria-selected="true">最新</button>
              <button class="newscat" type="button" role="tab">政治</button>
              <button class="newscat" type="button" role="tab">财经</button>
              <button class="newscat" type="button" role="tab">科技</button>
              <button class="newscat" type="button" role="tab">体育</button>
              <button class="newscat" type="button" role="tab">娱乐</button>
              <button class="newscat" type="button" role="tab">其他</button>
              <button class="newscat nsearch" type="button" aria-label="搜索资讯"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button>
            </div>
            <div class="newsfeed">
              <article class="newscard">
                <div class="nthumb news-art art-office"><svg viewBox="0 0 104 74" aria-hidden="true"><rect x="0" y="0" width="104" height="74" fill="#DDE8F2"/><rect x="8" y="8" width="35" height="58" rx="2" fill="#BFD7EA"/><path d="M18 8v58M32 8v58M8 24h35M8 43h35" stroke="#6FA7D2" stroke-width="2"/><circle cx="69" cy="27" r="11" fill="#E5B58C"/><path d="M57 24c1-10 22-12 25 2-9-4-16-1-25-2Z" fill="#3B4654"/><path d="M48 70c2-19 11-27 21-27s20 8 23 27" fill="#384A5C"/><path d="M65 43h8l4 27H60Z" fill="#F3F6F8"/></svg></div>
                <div class="ntext"><div class="nttl">亿万富翁比尔·盖茨在周二发布的众议院监督委员会闭门采访记录中被反复提及</div><div class="nmeta"><span class="ntag">娱乐</span><time class="ndate">06月24日</time></div></div>
              </article>
              <article class="newscard">
                <div class="nthumb news-art art-letter"><svg viewBox="0 0 104 74" aria-hidden="true"><rect width="104" height="74" fill="#EEEAE1"/><rect x="12" y="15" width="57" height="45" rx="2" transform="rotate(-7 12 15)" fill="#FFFDF7"/><path d="m38 38 28 17H16Z" fill="#F6F3EA" stroke="#D4CEC1"/><circle cx="57" cy="51" r="7" fill="#B74444"/><path d="M25 24h35M24 30h28" stroke="#C9C1B3" stroke-width="2"/><circle cx="82" cy="16" r="8" fill="#CED4DB"/></svg></div>
                <div class="ntext"><div class="nttl">新披露的细节来自在南希·古思里失踪几天后发送给新闻机构的一封匿名信</div><div class="nmeta"><span class="ntag">娱乐</span><time class="ndate">06月24日</time></div></div>
              </article>
              <article class="newscard">
                <div class="nthumb news-art art-housing"><svg viewBox="0 0 104 74" aria-hidden="true"><rect width="104" height="74" fill="#E7E2D5"/><path d="M8 19h57v44H8z" fill="#F7F4EC"/><path d="M16 16 7 26h19Zm25 0-9 10h19Zm25 0-9 10h19Z" fill="#9BA9B4"/><path d="M14 29h9v12h-9zm25 0h9v12h-9zm25 0h9v12h-9z" fill="#C7D9E5"/><circle cx="84" cy="50" r="12" fill="#B98A43"/><path d="M75 59 98 36M72 56l5 5M94 33l5 5" stroke="#6B4E2E" stroke-width="4" stroke-linecap="round"/></svg></div>
                <div class="ntext"><div class="nttl">一项具有里程碑意义的住房可负担性法案在本周获得国会两院通过</div><div class="nmeta"><span class="ntag">财经</span><time class="ndate">06月24日</time></div></div>
              </article>
              <article class="newscard">
                <div class="nthumb news-art art-politics"><svg viewBox="0 0 104 74" aria-hidden="true"><rect width="104" height="74" fill="#243B68"/><path d="M0 13 104 45M0 34l104 30" stroke="#E9EEF7" stroke-width="9" opacity=".35"/><circle cx="35" cy="24" r="10" fill="#D9A77E"/><path d="M20 66c1-23 8-32 18-32 11 0 19 10 21 32" fill="#202A3B"/><rect x="57" y="26" width="26" height="36" rx="2" fill="#EFF2F6"/><circle cx="71" cy="16" r="10" fill="#DDB18C"/><path d="M60 24c2-7 6-10 12-10s10 3 13 10" fill="#2D3440"/></svg></div>
                <div class="ntext"><div class="nttl">南卡罗来纳州检察长艾伦·威尔逊将赢得该州共和党州长提名</div><div class="nmeta"><span class="ntag">政治</span><time class="ndate">06月24日</time></div></div>
              </article>
              <article class="newscard">
                <div class="nthumb news-art art-ai"><svg viewBox="0 0 104 74" aria-hidden="true"><defs><linearGradient id="aiBg" x1="0" x2="1"><stop stop-color="#DFECF1"/><stop offset="1" stop-color="#6AB8D8"/></linearGradient></defs><rect width="104" height="74" fill="url(#aiBg)"/><circle cx="26" cy="44" r="13" fill="#C59A54"/><path d="m26 15 6 11-6 11-6-11Z" fill="#D8B66B"/><path d="M26 15v-7" stroke="#8D6C34" stroke-width="3"/><path d="M46 58c12-20 28-29 51-31M50 20c16 9 27 21 33 38" stroke="#C5F0FF" stroke-width="1.3" opacity=".8"/><circle cx="61" cy="24" r="3" fill="#E8FBFF"/><circle cx="88" cy="40" r="3" fill="#E8FBFF"/></svg></div>
                <div class="ntext"><div class="nttl">斯坦福是他们的金钥匙——人工智能能否帮助或阻碍这一点？</div><div class="nmeta"><span class="ntag">科技</span><time class="ndate">06月24日</time></div></div>
              </article>
              <article class="newscard">
                <div class="nthumb news-art art-train"><svg viewBox="0 0 104 74" aria-hidden="true"><rect width="104" height="74" fill="#DDE8ED"/><path d="M0 0h104v29H0z" fill="#BED5E0"/><path d="M14 12h76M25 0v29M52 0v29M78 0v29" stroke="#8CA9B7" stroke-width="2"/><path d="m28 74 14-37h21l14 37" fill="#EEF4F6" stroke="#7294A4" stroke-width="2"/><path d="M39 36h29v20H39z" fill="#F6FAFB" stroke="#5E879B" stroke-width="2"/><rect x="44" y="40" width="19" height="7" rx="2" fill="#77B1CB"/><circle cx="44" cy="59" r="3" fill="#455D68"/><circle cx="64" cy="59" r="3" fill="#455D68"/></svg></div>
                <div class="ntext"><div class="nttl">德国铁路网络因 IT 故障完全停运，数十万旅客出行受到影响</div><div class="nmeta"><span class="ntag">科技</span><time class="ndate">06月24日</time></div></div>
              </article>
              <article class="newscard">
                <div class="nthumb news-art art-phone"><svg viewBox="0 0 104 74" aria-hidden="true"><rect width="104" height="74" fill="#DCE9E8"/><circle cx="31" cy="22" r="9" fill="#B78161"/><path d="M15 70c2-25 8-37 18-37 11 0 17 11 20 37" fill="#263B4C"/><rect x="55" y="17" width="25" height="43" rx="5" fill="#253B4A"/><rect x="59" y="22" width="17" height="30" rx="2" fill="#58C9C3"/><path d="M82 9c8 10 12 22 13 35M75 6c11 11 17 26 18 44" stroke="#7CCDC9" stroke-width="2" opacity=".7"/></svg></div>
                <div class="ntext"><div class="nttl">Kunal Shah：印度企业家如何掌控 WhatsApp 时代的商业机会</div><div class="nmeta"><span class="ntag">科技</span><time class="ndate">06月24日</time></div></div>
              </article>
            </div>
          </div>
`});
