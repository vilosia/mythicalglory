/* IM168 · 游戏厅 · 查爆仓 Tab（v3.2 · 2026-07-25 历史首页 → 表单 → 结果）
   流程：进入历史/空态 → 表单屏(#bqFormScr) → 立即查询 → 结果屏(#bqResScr) → 重置条件回到表单。
   表单屏＝旧版原样（投注模式 / 回测方式 / 长龙区间 / 候选下注回合数）；结果屏＝单页重构（爆仓分布 + 记录 + 候选滑杆）。
   首次帮助改为结果页内轻量解读卡；生成/最近查询沿用 #bqGen / #bqRecent 抽屉。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:29,h:`

          <!-- ===== Tab 4 · 查爆仓 ===== -->
          <div class="view view-bust">
            <div class="scroll2" id="bqScroll">

              <!-- 历史查询屏（默认显示） -->
              <div class="bq-scr on" id="bqHistoryScr">
                <section class="bq-latest" id="bqLatest"></section>
                <div class="bq-history-top" id="bqHistoryTop">
                  <span class="bq-hc-count" id="bqHistCount">最近查询</span>
                  <span class="bq-hc-edit" data-act="bqedit" id="bqHistEdit">编辑</span>
                </div>
                <div class="bq-history-list" id="bqHistoryList"></div>
                <button class="bq-history-all" id="bqHistoryAll" type="button" data-act="bqrecent">查看全部查询</button>
                <div class="bq-history-empty" id="bqHistoryEmpty">
                  <div class="bq-empty-mark"><span></span></div>
                  <div class="bq-empty-title">先看历史风险，再设置回合数</div>
                  <div class="bq-empty-copy">选择玩法和跟／反投方式，查看历史爆仓分布及候选回合覆盖率，辅助设置策略回合数。</div>
                  <div class="bq-empty-points"><span>历史爆仓次数</span><span>连输集中回合</span><span>候选覆盖率</span></div>
                  <div class="bq-empty-quick">
                    <div class="bq-empty-quickhead"><b>快速开始</b><span>带入条件后可调整</span></div>
                    <button type="button" data-act="bqquickpreset" data-arg="follow">
                      <span><b>跟投长龙</b><small>两面 · 连开 3–8 期入场 · 候选 6 回合</small></span><i>›</i>
                    </button>
                    <button type="button" data-act="bqquickpreset" data-arg="reverse">
                      <span><b>反投单跳</b><small>两面 · 单跳 4–7 期入场 · 候选 5 回合</small></span><i>›</i>
                    </button>
                    <button type="button" data-act="bqquickpreset" data-arg="position">
                      <span><b>定位冷热号</b><small>定位 3 码 · 热 3／冷 2 · 候选 7 回合</small></span><i>›</i>
                    </button>
                  </div>
                  <button class="bq-example-link" type="button" data-act="bqexample">先看一份示例</button>
                </div>
              </div>

              <!-- 新建查询屏（由历史页二级触发，以底部抽屉打开） -->
              <div class="bq-scr" id="bqFormScr">
                <div class="bq-hdr">
                  <span class="bq-title">爆仓查询</span>
                  <span class="bq-info" data-act="bqinfo" aria-label="说明">?</span>
                </div>
                <div class="bq-tip" id="bqTip">爆仓数据根据历史开奖模拟计算。系统会依照【跟投】或【反投】规则，按设定的投注方式（倍投或固定投注）持续追投，并统计历史上最多需要追到第几回才能回本。这个回合数就是爆仓数据。</div>

                <div class="bq-card">
                  <div class="bq-lab">投注模式</div>
                  <div class="stg-opts two" id="bqModeSeg">
                    <div class="stg-opt" data-act="bqmode" data-arg="两面"><div class="t">两面</div><div class="d">大小 / 单双 / 龙虎</div></div>
                    <div class="stg-opt" data-act="bqmode" data-arg="定位"><div class="t">定位</div><div class="d">1–10位置排名</div></div>
                  </div>
                </div>

                <div class="bq-card" id="bqDirCard" style="display:none;">
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
                    <div class="stg-stp full" id="bqCandFieldPos"><div class="col"><div class="num"><span class="val">6 回合</span></div><div class="lbl">你打算设置的回合数</div></div><div class="sbtns"><button data-act="bqcand" data-d="-1">−</button><button data-act="bqcand" data-d="1">+</button></div></div>
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
                    <div class="stg-stp full" id="bqCandField"><div class="col"><div class="num"><span class="val">6 回合</span></div><div class="lbl">你打算设置的回合数</div></div><div class="sbtns"><button data-act="bqcand" data-d="-1">−</button><button data-act="bqcand" data-d="1">+</button></div></div>
                  </div>
                  <div class="tipline"></div>
                </div>

                <div class="bq-formfoot">
                  <button class="bq-fbtn ghost" data-act="bqnewclose">取消</button>
                  <button class="bq-fbtn primary" data-act="bqquery">立即查询</button>
                </div>
              </div>

              <!-- 结果屏（立即查询后显示 · 单页重构 v3） -->
              <div class="bq-scr" id="bqResScr">
                <div class="bx-titlerow">
                  <span class="bx-back" data-act="bqback" aria-label="返回查询记录"><svg class="icx" viewBox="25.0 51.0 11.0 17.0" fill="none"><path d="M34 66L27 59.5L34 53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                  <div class="bx-tags" id="bqResTags"></div>
                  <span class="bx-title" id="bqResTitle"></span>
                  <span class="bx-time-created" id="bqResTime"></span>
                </div>

                <div class="bq-result-guide" id="bqResultGuide" aria-live="polite">
                  <div class="bq-rg-head"><b>先看这三个指标</b><button type="button" data-act="bqresultguideclose">知道了</button></div>
                  <div class="bq-rg-grid">
                    <div><i>1</i><span><b>爆仓次数</b><small>追完候选回合仍未中的历史次数</small></span></div>
                    <div><i>2</i><span><b>集中回合</b><small>柱越高，连输越常在该回结束</small></span></div>
                    <div><i>3</i><span><b>候选覆盖率</b><small>候选回合内结束连输的历史占比</small></span></div>
                  </div>
                </div>

                <div class="bx-card">
                  <div class="bx-dir" id="bqRDirSeg">
                    <span class="bx-diropt" data-act="bqrdir" data-arg="跟">跟投</span>
                    <span class="bx-diropt" data-act="bqrdir" data-arg="反">反投</span>
                  </div>
                  <div class="bx-lab" id="bqRRangeLab">长龙区间<span>连开几期入场</span></div>
                  <div class="bx-streak" id="bqStreak">
                    <span class="bx-stk" data-act="bqstreak" data-arg="3">3</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="4">4</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="5">5</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="6">6</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="7">7</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="8">8</span>
                    <span class="bx-stk" data-act="bqstreak" data-arg="8+">8+</span>
                  </div>
                  <div class="bx-possum" id="bqPosSum" style="display:none;"></div>
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
                  <div class="bx-chtitle">爆仓发生在哪几回？</div>
                  <div class="bx-chsub">Y轴 = 爆仓次数 · X轴 = 连输追到第几回</div>
                  <div class="bx-chart">
                    <div class="bx-cut" id="bqCut"></div>
                    <div class="bx-cuttag" id="bqCutTag"></div>
                    <div class="bx-bars" id="bqBars"></div>
                  </div>
                  <div class="bx-xrow">
                    <span class="bx-xlab">1回</span><span class="bx-xlab">2回</span><span class="bx-xlab">3回</span><span class="bx-xlab">4回</span><span class="bx-xlab">5回</span><span class="bx-xlab">6回</span><span class="bx-xlab">7回</span><span class="bx-xlab">8回</span><span class="bx-xlab">9+</span>
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
                      <span class="bx-slab" data-lb="0">3</span><span class="bx-slab" data-lb="1">4</span><span class="bx-slab" data-lb="2">5</span><span class="bx-slab" data-lb="3">6</span><span class="bx-slab" data-lb="4">7</span><span class="bx-slab" data-lb="5">8</span><span class="bx-slab" data-lb="6">9+</span>
                    </div>
                    <div class="bx-read" id="bqRead"></div>
                  </div>
                </div>

                <div class="bx-card">
                  <div class="bx-chtitle" style="margin-bottom:12px;">最高爆仓记录<span id="bqRecCnt" class="bx-reccnt"></span></div>
                  <div class="bx-recs">
                    <div class="bx-rhead"><span>时间</span><span>投注项目</span><span style="text-align:right;">连输回合</span><span></span></div>
                    <div id="bqRecs"></div>
                  </div>
                </div>
                <div class="bq-data-note">结果基于历史开奖模拟，仅用于评估策略风险，不代表未来表现。</div>

              </div>
            </div>

            <div class="bx-foot">
              <span class="bx-btn ghost" data-act="bqtoform">新建查询</span>
              <span class="bx-btn primary" data-act="bqcreate">生成策略</span>
            </div>
            <div class="bq-history-foot"><button class="bq-new-anchor" data-act="bqnew"><span>＋</span>新建查询</button></div>
            <div class="bq-undo" id="bqUndo">已删除查询记录<button type="button" data-act="bqundo">撤销</button></div>
            <div class="bq-new-scrim" data-act="bqnewclose"></div>

            <!-- 生成策略 · 启动确认（bottom drawer · 风格同自动投 sheet） -->
            <div class="tpl-modal" id="bqGen">
              <div class="cf-backdrop" data-act="bqgenclose"></div>
              <div class="bq-sheet">
                <div class="bq-handle"><i></i></div>
                <div class="bq-sht" id="bqGenTitle">生成「跟投 · 数据推荐」</div>
                <div class="bq-shs">玩法与触发来自查询 · 执行与风控为默认值，可调整</div>
                <span class="bq-srcchip" id="bqGenSrc">来自爆仓查询 · 近 7 天</span>
                <div class="bq-srows">
                  <div class="bq-srow"><span>玩法</span><b id="bqGenPlay">两面 · 跟投 · 单双＋龙虎（已避开在爆玩法）</b></div>
                  <div class="bq-srow"><span>触发</span><b id="bqGenTrig">长龙 3~8 期入场</b></div>
                  <div class="bq-srow"><span>执行</span><b id="bqGenExec">每注 10 × 9 回合 · 倍投 2×</b></div>
                  <div class="bq-srow"><span>最坏情况</span><b class="rd" id="bqGenWorst">−190 自动停止</b></div>
                  <div class="bq-srow"><span>达到止盈</span><b class="gn" id="bqGenTp">+300 自动停止</b></div>
                  <div class="bq-srow last"><span>占用预算</span><b id="bqGenBudget">190 <small>/ 余额 240</small></b></div>
                </div>
                <div class="bq-shnote"><span><svg class="icx" viewBox="355.8 52.9 22.2 22.2" fill="none"><circle cx="344" cy="60" r="9" stroke="currentColor" stroke-width="1.5px" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="matrix(1.0666458333333333 0 0 1.0666458333333333 0 0.008197916666639004)"></circle><path d="M344.135 65.3424C343.731 65.3517 343.398 65.0263 343.398 64.6217L343.398 59.3993C343.398 59.0011 343.721 58.6784 344.119 58.6784C344.517 58.6784 344.84 59.0012 344.84 59.3993L344.84 62.0023L344.84 64.6217C344.84 65.0133 344.527 65.3333 344.135 65.3424ZM344.119 54.9994C344.425 54.9994 344.688 55.1092 344.908 55.3288C345.128 55.5484 345.237 55.8115 345.237 56.118C345.237 56.4246 345.128 56.6877 344.908 56.9073C344.688 57.1269 344.425 57.2366 344.119 57.2366C343.812 57.2366 343.549 57.1269 343.329 56.9073C343.11 56.6877 343 56.4246 343 56.118C343 55.915 343.052 55.7286 343.155 55.5587C343.255 55.3889 343.39 55.2521 343.559 55.1486C343.725 55.0491 343.912 54.9994 344.119 54.9994Z" fill="currentColor" transform="matrix(1.0666458333333333 0 0 1.0666458333333333 0 0.008197916666639004)"></path></svg></span><span id="bqGenNote">启动后每期自动下注，投注金额从钱包余额中扣除。</span></div>
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
                <div class="bq-rechint">按查询时间排列 · 最多保留 20 条</div>
                <div class="bq-recentlist" id="bqRecentList"></div>
              </div>
            </div>

          </div>
`});
