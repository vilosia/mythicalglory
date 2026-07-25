/* IM168 · 游戏厅 · 查爆仓 Tab（v3.1 · 2026-07-20 双屏流程：表单 → 结果）
   流程：进入 → 首次引导(#bustGuide) → 表单屏(#bqFormScr) → 立即查询 → 结果屏(#bqResScr) → 重置条件回到表单。
   表单屏＝旧版原样（投注模式 / 回测方式 / 长龙区间 / 候选下注回合数）；结果屏＝单页重构（爆仓分布 + 记录 + 候选滑杆）。
   逻辑在 shared/app.js 末尾的「查爆仓模块」；生成/最近查询/引导沿用 #bqGen / #bqRecent / #bustGuide 抽屉。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:29,h:`

          <!-- ===== Tab 4 · 查爆仓 ===== -->
          <div class="view view-bust">
            <div class="scroll2" id="bqScroll">

              <!-- 表单屏（默认显示） -->
              <div class="bq-scr on" id="bqFormScr">
                <div class="bq-hdr">
                  <span class="bq-title">爆仓查询</span>
                  <span class="bq-info" data-act="bqinfo" aria-label="说明">?</span>
                  <span class="bq-recentbtn" data-act="bqrecent">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    最近查询
                  </span>
                </div>
                <div class="bq-tip" id="bqTip">爆仓数据根据历史开奖模拟计算。系统会依照【跟投】或【反投】规则，按设定的投注方式（倍投或固定投注）持续追投，并统计历史上最多需要追到第几回才能回本。这个回合数就是爆仓数据。</div>

                <div class="bq-card">
                  <div class="bq-lab">投注模式</div>
                  <div class="stg-opts two" id="bqModeSeg">
                    <div class="stg-opt" data-act="bqmode" data-arg="两面"><div class="t">两面</div><div class="d">大小 / 单双 / 龙虎</div></div>
                    <div class="stg-opt" data-act="bqmode" data-arg="定位"><div class="t">定位</div><div class="d">1–10位置排名</div></div>
                  </div>
                </div>

                <div class="bq-card" id="bqDirCard">
                  <div class="bq-lab">回测方式</div>
                  <div class="stg-opts" id="bqDirSeg">
                    <div class="stg-opt" data-act="bqdir" data-arg="跟投"><div class="t">跟投</div><div class="d">同方向连开回测（长龙）</div></div>
                    <div class="stg-opt" data-act="bqdir" data-arg="反投"><div class="t">反投</div><div class="d">单跳交替回测（投反方向）</div></div>
                  </div>
                </div>

                <div class="bq-card" id="bqPosWrap" style="display:none;">
                  <div class="bq-lab">定位条件</div>
                  <div class="stg-grid">
                    <div class="stg-stp full"><div class="col"><div class="num" id="bqPosN">3 码</div><div class="lbl">定位几码</div></div><div class="sbtns"><button data-act="bqposstep" data-k="posN" data-d="-1">−</button><button data-act="bqposstep" data-k="posN" data-d="1">+</button></div></div>
                  </div>
                  <div class="stg-grid" style="margin-top:8px;">
                    <div class="stg-stp"><div class="col"><div class="num" id="bqPosHot">3 个</div><div class="lbl">热号数量</div></div><div class="sbtns"><button data-act="bqposstep" data-k="hot" data-d="-1">−</button><button data-act="bqposstep" data-k="hot" data-d="1">+</button></div></div>
                    <div class="stg-stp"><div class="col"><div class="num" id="bqPosCold">2 个</div><div class="lbl">冷号数量</div></div><div class="sbtns"><button data-act="bqposstep" data-k="cold" data-d="-1">−</button><button data-act="bqposstep" data-k="cold" data-d="1">+</button></div></div>
                  </div>
                  <div class="bq-lab" style="margin-top:12px;">候选下注回合数</div>
                  <div class="stg-grid">
                    <div class="stg-stp full" id="bqCandFieldPos"><div class="col"><div class="num"><span class="val">6 期</span></div><div class="lbl">你打算设置的回合数</div></div><div class="sbtns"><button data-act="bqcand" data-d="-1">−</button><button data-act="bqcand" data-d="1">+</button></div></div>
                  </div>
                </div>

                <div class="bq-rangewrap bq-card" id="bqRangeWrap" style="display:none;">
                  <div class="bq-lab" id="bqRangeLab">长龙区间</div>
                  <div class="stg-grid">
                    <div class="stg-stp"><div class="col"><div class="num" id="bqMinV">3</div><div class="lbl"><span id="bqMinLab">最低长龙</span> ≥</div></div><div class="sbtns"><button data-act="bqstep" data-k="min" data-d="-1">−</button><button data-act="bqstep" data-k="min" data-d="1">+</button></div></div>
                    <div class="stg-stp"><div class="col"><div class="num" id="bqMaxV">8</div><div class="lbl"><span id="bqMaxLab">最高长龙</span> ≤</div></div><div class="sbtns"><button data-act="bqstep" data-k="max" data-d="-1">−</button><button data-act="bqstep" data-k="max" data-d="1">+</button></div></div>
                  </div>
                  <div class="bq-lab" style="margin-top:12px;">候选下注回合数</div>
                  <div class="stg-grid">
                    <div class="stg-stp full" id="bqCandField"><div class="col"><div class="num"><span class="val">6 期</span></div><div class="lbl">你打算设置的回合数</div></div><div class="sbtns"><button data-act="bqcand" data-d="-1">−</button><button data-act="bqcand" data-d="1">+</button></div></div>
                  </div>
                  <div class="tipline"></div>
                </div>

                <div class="bq-formfoot">
                  <div class="bq-formcta" data-act="bqquery">立即查询</div>
                  <div class="bq-formreset" data-act="bqreset">重置条件</div>
                </div>
              </div>

              <!-- 结果屏（立即查询后显示 · 单页重构 v3） -->
              <div class="bq-scr" id="bqResScr">
                <div class="bx-titlerow">
                  <span class="bx-title" id="bqResTitle">两面爆仓查询</span>
                  <div class="bx-acts">
                    <span class="bx-pill save" data-act="bqsave">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>
                      保存查询
                    </span>
                    <span class="bx-pill recent" data-act="bqrecent">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                      最近查询
                    </span>
                  </div>
                </div>

                <div class="bx-card">
                  <div class="bx-dir" id="bqRDirSeg">
                    <span class="bx-diropt" data-act="bqrdir" data-arg="跟">跟投</span>
                    <span class="bx-diropt" data-act="bqrdir" data-arg="反">反投</span>
                  </div>
                  <div class="bx-lab">长龙区间<span>连开几期入场</span></div>
                  <div class="bx-streak" id="bqStreak">
                    <span class="bx-stk" data-act="bqstreak" data-arg="3">3</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="4">4</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="5">5</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="6">6</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="7">7</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="8">8</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="8+">8+</span>
                  </div>
                </div>

                <div class="bx-sechead">
                  <div class="bx-sectitle">爆仓记录<span class="bx-info" data-act="bqinfo" aria-label="说明">?</span></div>
                  <div class="bx-time" id="bqTimeSeg">
                    <span class="bx-tb" data-act="bqrange" data-arg="1d">今日</span>
                    <span class="bx-tb" data-act="bqrange" data-arg="3d">3 天</span>
                    <span class="bx-tb" data-act="bqrange" data-arg="7d">7 天</span>
                  </div>
                </div>

                <div class="bx-card">
                  <div class="bx-chtitle">爆仓发生在哪几期？</div>
                  <div class="bx-chsub">Y轴 = 爆仓次数 · X轴 = 连输追到第几期</div>
                  <div class="bx-chart">
                    <div class="bx-cut" id="bqCut"></div>
                    <div class="bx-cuttag" id="bqCutTag"></div>
                    <div class="bx-bars" id="bqBars"></div>
                  </div>
                  <div class="bx-xrow">
                    <span class="bx-xlab">1期</span><span class="bx-xlab">2期</span><span class="bx-xlab">3期</span><span class="bx-xlab">4期</span><span class="bx-xlab">5期</span><span class="bx-xlab">6期</span><span class="bx-xlab">7期</span><span class="bx-xlab">8期</span><span class="bx-xlab">9+</span>
                  </div>
                  <div class="bx-legend">
                    <span class="bx-lg"><i style="background:#1FA971"></i>覆盖内</span>
                    <span class="bx-lg"><i style="background:#EF9F27"></i>候选临界</span>
                    <span class="bx-lg"><i style="background:#E24B4A"></i>更深（打爆）</span>
                  </div>
                  <div class="bx-candbox">
                    <div class="bx-candlab">候选回合</div>
                    <div class="bx-slider" id="bqSlider">
                      <div class="bx-track"></div>
                      <div class="bx-fill" id="bqFill"></div>
                      <div class="bx-dots" id="bqDots"></div>
                    </div>
                    <div class="bx-slabs">
                      <span class="bx-slab" data-lb="0">3期</span><span class="bx-slab" data-lb="1">4期</span><span class="bx-slab" data-lb="2">5期</span><span class="bx-slab" data-lb="3">6期</span><span class="bx-slab" data-lb="4">7期</span><span class="bx-slab" data-lb="5">8期</span><span class="bx-slab" data-lb="6">9+</span>
                    </div>
                    <div class="bx-read" id="bqRead"></div>
                  </div>
                </div>

                <div class="bx-card">
                  <div class="bx-chtitle" style="margin-bottom:12px;">最高爆仓记录<span id="bqRecCnt" class="bx-reccnt"></span></div>
                  <div class="bx-recs">
                    <div class="bx-rhead"><span>时间</span><span>投注项目</span><span style="text-align:right;">爆仓期数</span><span></span></div>
                    <div id="bqRecs"></div>
                  </div>
                </div>

                <div class="bx-foot">
                  <span class="bx-btn ghost" data-act="bqtoform">重置条件</span>
                  <span class="bx-btn primary" data-act="bqcreate">生成策略</span>
                </div>
              </div>
            </div>

            <!-- 生成策略 · 启动确认（bottom drawer · 风格同自动投 sheet） -->
            <div class="tpl-modal" id="bqGen">
              <div class="cf-backdrop" data-act="bqgenclose"></div>
              <div class="bq-sheet">
                <div class="bq-handle"><i></i></div>
                <div class="bq-sht" id="bqGenTitle">生成「跟投 · 数据推荐」</div>
                <div class="bq-shs">参数来自你的爆仓查询，可调整后再启动</div>
                <span class="bq-srcchip" id="bqGenSrc">来自爆仓查询 · 近 7 天</span>
                <div class="bq-srows">
                  <div class="bq-srow"><span>玩法</span><b id="bqGenPlay">两面 · 跟投 · 单双＋龙虎（已避开在爆玩法）</b></div>
                  <div class="bq-srow"><span>触发</span><b id="bqGenTrig">长龙 3~8 期入场</b></div>
                  <div class="bq-srow"><span>执行</span><b id="bqGenExec">每注 10 × 9 回合 · 倍投 2×</b></div>
                  <div class="bq-srow"><span>最坏情况</span><b class="rd">−500 自动停止</b></div>
                  <div class="bq-srow"><span>达到止盈</span><b class="gn">+1000 自动停止</b></div>
                  <div class="bq-srow last"><span>占用预算</span><b>190 <small>/ 余额 240</small></b></div>
                </div>
                <div class="bq-shnote"><span>ⓘ</span><span id="bqGenNote">启动后每期自动下注，投注金额从钱包余额中扣除。</span></div>
                <div class="bq-ctarow">
                  <button class="bq-gho" data-act="bqgenadjust">调整设置</button>
                  <button class="bq-cta" data-act="bqgenstart">确认启动</button>
                </div>
              </div>
            </div>

            <!-- 最近查询（bottom drawer · 最多显示 6 条） -->
            <div class="tpl-modal" id="bqRecent">
              <div class="cf-backdrop" data-act="bqrecentclose"></div>
              <div class="bq-sheet bq-recentsheet">
                <div class="bq-handle"><i></i></div>
                <div class="bq-rechead">
                  <span class="bq-recttl" id="bqRecentTitle">最近查询（0）</span>
                  <span class="bq-recx" data-act="bqrecentclose" aria-label="关闭"><svg class="icx" viewBox="348.1 671.0 17.4 17.4" fill="none"><path d="M352.114 654.324C352.545 653.892 353.244 653.892 353.676 654.324C354.108 654.755 354.108 655.454 353.676 655.886L348.562 660.999L353.676 666.114C354.108 666.545 354.108 667.244 353.676 667.676C353.244 668.108 352.545 668.108 352.114 667.676L346.999 662.562L341.886 667.676C341.454 668.108 340.755 668.108 340.324 667.676C339.892 667.244 339.892 666.545 340.324 666.114L345.437 660.999L340.324 655.886C339.892 655.454 339.892 654.755 340.324 654.324C340.755 653.892 341.454 653.892 341.886 654.324L346.999 659.437L352.114 654.324Z" fill="currentColor" transform="matrix(1.0282575514138816 0 0 1.0282575514138816 0 0.006989074550144833)"></path></svg></span>
                </div>
                <div class="bq-rechint">最多显示 6 条 · 超过自动移除最旧一条</div>
                <div class="bq-recentlist" id="bqRecentList"></div>
              </div>
            </div>

            <!-- 查爆仓 · 首次引导（1 页 · 每会话首次进入弹一次） -->
            <div class="ob-drawer" id="bustGuide">
              <div class="ob-backdrop" data-act="bqobclose"></div>
              <div class="ob-sheet">
                <div class="ob-top"><div class="ob-close" data-act="bqobclose" aria-label="关闭引导"><svg class="icx" viewBox="348.1 671.0 17.4 17.4" fill="none"><path d="M352.114 654.324C352.545 653.892 353.244 653.892 353.676 654.324C354.108 654.755 354.108 655.454 353.676 655.886L348.562 660.999L353.676 666.114C354.108 666.545 354.108 667.244 353.676 667.676C353.244 668.108 352.545 668.108 352.114 667.676L346.999 662.562L341.886 667.676C341.454 668.108 340.755 668.108 340.324 667.676C339.892 667.244 339.892 666.545 340.324 666.114L345.437 660.999L340.324 655.886C339.892 655.454 339.892 654.755 340.324 654.324C340.755 653.892 341.454 653.892 341.886 654.324L346.999 659.437L352.114 654.324Z" fill="currentColor" transform="matrix(1.0282575514138816 0 0 1.0282575514138816 0 0.006989074550144833)"></path></svg></div></div>
                <div class="ob-page on">
                  <div class="ob-img"><img src="shared/auto-guide/01.png" alt="" onerror="this.remove()"></div>
                  <div class="ob-body">
                    <div class="ob-title">拿不准如何下注？</div>
                    <div class="ob-copy">爆仓数据根据历史开奖模拟计算。系统会依照【跟投】或【反投】规则，按设定的投注方式（倍投或固定投注）持续追投，并统计历史上最多需要追到第几回才能回本。这个回合数就是爆仓数据。</div>
                  </div>
                  <div class="ob-ftr"><button class="pri" data-act="bqobgo">开始查询</button></div>
                </div>
              </div>
            </div>
          </div>
`});
