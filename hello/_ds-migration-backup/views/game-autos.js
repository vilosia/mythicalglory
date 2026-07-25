/* IM168 · 游戏厅 · 自动投（策略中心 v0.8 / 爆仓查询 / 全部计划 / 旧版编辑页）
   修改这一块的页面只需编辑本文件。文件里是页面的 HTML 内容，由 index.html 按原顺序注入。
   ⚠ 内容里不要使用反引号 ` 或 ${ } 字符。
   v0.8（2026-07-09）：自动投整页重构为「策略中心」，复刻 ref.html 自动投的流程/IA/交互；
   旧版 L1 仪表盘 + L2 计划助手已移除（完整旧版见 backup/index-presplit-2026-07-09.html）。 */

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:6,h:`

          <!-- ===== Tab 2 · 自动投 · 策略中心 v0.8（复刻 ref.html 自动投 UX · 2026-07-09）=====
               L1a 策略模板（无策略时）/ L1b 策略中心（有策略后）由 shared/app.js 末尾的策略中心模块渲染进 #stgScroll。
               新建向导（5 步）、策略详情、玩法说明共用 #stgSheet；执行报告用 #stgReport。 -->
          <div class="view view-autos">
            <div class="autodash on">
              <!-- 上滑后策略卡收合成的 Sticky Tab Bar（由 app.js 渲染/显隐） -->
              <div class="stg-tabbar" id="stgTabs"></div>
              <div class="dashscroll" id="stgScroll"></div>
              <!-- 「/」指令面板（沿用现有 cmddrawer 交互；快捷键改为直接执行动作） -->
              <div class="cmddrawer" id="dashCmd">
                <div class="cmdintro"><b id="dashCmdTitle">怎么用指令</b><span>直接说你要做什么，助手会先确认，再从下一回合生效。</span></div>
                <div class="cmdexamples" id="dashCmdEx">
                  <div><b>查状态</b><span data-act="cmdpick" data-arg="查看当前策略">查看当前策略</span><span data-act="cmdpick" data-arg="今天赚了多少">今天赚了多少</span></div>
                  <div><b>改风控</b><span data-act="cmdpick" data-arg="止盈改成 300">止盈改成 300</span><span data-act="cmdpick" data-arg="止损改成 200">止损改成 200</span></div>
                  <div><b>改投注</b><span data-act="cmdpick" data-arg="每注金额改成 50">每注金额改成 50</span><span data-act="cmdpick" data-arg="倍投改成 2 倍">倍投改成 2 倍</span></div>
                  <div><b>控制策略</b><span data-act="cmdpick" data-arg="暂停本策略">暂停本策略</span><span data-act="cmdpick" data-arg="急停本策略">急停本策略</span></div>
                </div>
                <div class="cmdhead">快捷操作</div>
                <div class="cmdgrid">
                  <button data-act="stgcmd" data-arg="new">新建策略</button>
                  <button data-act="stgcmd" data-arg="report">查看报告</button>
                  <button data-act="stgcmd" data-arg="edit">编辑策略</button>
                  <button data-act="stgcmd" data-arg="stop">急停策略</button>
                  <button data-act="stgcmd" data-arg="help">设置说明</button>
                  <button data-act="cmdpick" data-arg="今天赚了多少">今天盈亏</button>
                </div>
              </div>
              <!-- 未启用官方模板：固定底部决策区；与指令栏互斥显示 -->
              <div class="stg-preview-actions" id="stgPreviewActions"></div>
              <div class="inputbar stg-commandbar"><b class="cmd-strategy-name" id="stgCmdStrategy">当前策略</b><div class="slash" data-act="dashcmds" aria-label="打开当前策略指令">/</div><div class="field ph">打开针对该策略的指令</div><span class="sendico">➤</span></div>
            </div>

            <!-- 策略设置向导 / 策略详情 / 玩法说明（bottom sheet 共用） -->
            <div class="tpl-modal" id="stgSheet">
              <div class="cf-backdrop" data-act="stgclose"></div>
              <div class="cf-sheet"><div id="stgSheetBody"></div></div>
            </div>

            <!-- 执行报告（bottom sheet） -->
            <div class="tpl-modal" id="stgReport">
              <div class="cf-backdrop" data-act="stgrepclose"></div>
              <div class="cf-sheet"><div id="stgReportBody"></div></div>
            </div>

            <!-- 执行动态 · 合并筛选 Drawer -->
            <div class="tpl-modal stg-filter-sheet" id="stgFilterSheet">
              <div class="cf-backdrop" data-act="stgfilterclose"></div>
              <div class="cf-sheet"><div id="stgFilterBody"></div></div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:24,h:`

          <!-- ===== 旧版 新建/编辑 计划（整页设置 · 已被策略中心 v0.8 的 5 步向导取代，暂保留备查，无入口）===== -->
          <div class="view view-formula">
            <div class="subhead"><span class="bk" data-act="show" data-arg="autos">‹</span><b><span class="t-new">新建自动投计划</span><span class="t-edit">计划设置</span></b><span class="rt"></span></div>
            <div class="planpreview" id="planPreview">
              <div id="planPreviewText"></div>
              <div class="stake" id="planStakeText"></div>
            </div>
            <div class="planpreview-hint">向下滚动查看全部设置，以上策略预览与总投入始终固定显示</div>
            <div class="scroll2">
              <div class="monitor">
                <div class="mh"><span class="live"><i></i>运行中</span><span style="font-size:11px;color:#CFE0FF">跟投模式</span></div>
                <div class="pnl">+120 <small>当前盈亏</small></div>
                <div class="mstat"><div>已进行<b>3 期</b></div><div>累计投注<b>240</b></div><div>距止盈<b>80</b></div></div>
                <div class="mbar"><i></i></div>
                <button class="stopbtn">急停 · 停止本计划</button>
              </div>
              <div class="frow"><div class="lt"><b>计划名称</b><i class="finfo" data-tip="用于识别与分享该自动投计划，可保存为常用模板重复使用。">i</i><span>方便识别与分享</span></div><input type="text" class="plname" placeholder="给计划起个名字"></div>
              <div class="tipline"></div>

              <div class="sectit">1 · 玩法范围 <i class="finfo" data-tip="系统会持续扫描 PK10 全部10个名次（冠军~第十名）及5组龙虎对位。这里选中的类别决定扫描范围，类别内每个名次/对位各自独立判断、独立触发，互不影响。再点一次已选类别即可取消（等同排除）。">i</i></div>
              <div class="tipline"></div>
              <div class="frow rangerow" style="flex-direction:column;align-items:stretch;">
                <div class="playgrp" id="marketChips">
                  <span class="fchip playchip" data-act="playchip" data-n="10">大小<em>（10）</em></span>
                  <span class="fchip playchip" data-act="playchip" data-n="10">单双<em>（10）</em></span>
                  <span class="fchip playchip" data-act="playchip" data-n="5">龙虎<em>（5）</em></span>
                </div>
                <div class="marketsub" id="marketSub" style="margin:8px 2px 0;"></div>
              </div>

              <div class="sectit">2 · 触发条件</div>
              <div class="frow"><div class="lt"><b>玩法模式</b><i class="finfo" data-tip="两面：大小/单双/龙虎等对赌类玩法，走同一套长龙扫描机制。定位：车号指定类玩法，触发规则不同，暂不支持长龙自动追投。">i</i><span>两面 / 定位</span></div><div class="seg2 bettype-seg"><div>两面</div><div>定位</div></div></div>
              <div class="tipline"></div>

              <div class="fg-twoside" style="display:none">
                <div class="frow"><div class="lt"><b>两面逻辑</b><i class="finfo" data-tip="跟投：同方向连开（长龙）达到区间后，顺方向继续投——第5名连开大3期：第4期投【大】。反投：方向交替（单跳）达到区间后，投上一期的反向——大、小、大：第4期投【小】。">i</i><span>跟投 / 反投</span></div><div class="seg2 logic-seg"><div>跟投</div><div>反投</div></div></div>
                <div class="tipline"></div>

                <div class="frow rangerow" style="flex-direction:column;align-items:stretch;">
                  <div class="rangehead"><div class="lt" style="margin:0;"><b class="rangelabel">长龙触发区间</b><i class="finfo rangeinfo" data-tip="">i</i></div><span class="rangeval" id="rgVal">请拖动设置区间</span></div>
                  <div class="rangewrap">
                    <div class="rangetrack"></div>
                    <div class="rangefill" id="rgFill"></div>
                    <input type="range" id="rgMin" min="1" max="15" step="1" value="3">
                    <input type="range" id="rgMax" min="1" max="15" step="1" value="8">
                  </div>
                  <div class="rangesub" id="rangeSub">拖动两端滑块设置触发区间后生效</div>
                </div>
                <div class="tipline"></div>
              </div>
              <div class="fg-position" style="display:none">
                <div class="frow"><div class="lt"><b>当日热号数量</b><span>选取热号个数</span></div><div class="stepper"><button>−</button><span class="val">3 码</span><button>+</button></div></div>
                <div class="frow"><div class="lt"><b>当日冷号数量</b><span>选取冷号个数</span></div><div class="stepper"><button>−</button><span class="val">2 码</span><button>+</button></div></div>
              </div>

              <div class="sectit">3 · 执行方式</div>
              <div class="frow"><div class="lt"><b>下注金额</b><i class="finfo" data-tip="每期基础投注金额；倍投模式下为第一期金额，之后按倍数递增。">i</i><span>每注投入</span></div><div class="stepper" id="amountStepper"><button>−</button><span class="val" style="color:var(--muted)">—</span><button>+</button></div></div>
              <div class="tipline"></div>
              <div class="frow"><div class="lt"><b>下注回合数</b><i class="finfo" data-tip="触发后固定执行的期数，不因中途输赢提前结束，直到止盈止损命中或回合数跑完。">i</i><span>共执行多少期</span></div><div class="stepper" id="roundsStepper"><button>−</button><span class="val" style="color:var(--muted)">— 期</span><button>+</button></div></div>
              <div class="tipline"></div>
              <div style="display:flex;justify-content:flex-end;padding:0 2px;">
                <span class="bustlink" data-act="openbust">拿不准设多少？先查爆仓数据 ›</span>
              </div>

              <div class="frow"><div class="lt"><b>投注方式</b><i class="finfo" data-tip="固定投：每期金额不变，风险平稳。倍投：每回合按倍数递增（中奖也不重置），回本快但本金消耗也快。">i</i><span>固定投 / 倍投</span></div><div class="seg2 betstyle-seg"><div>固定投</div><div>倍投</div></div></div>
              <div class="tipline"></div>
              <div class="fg-multi" style="display:none">
                <div class="frow"><div class="lt"><b>倍投倍数</b><span>逐回合递增</span></div><div class="stepper"><button>−</button><span class="val">2×</span><button>+</button></div></div>
                <div class="frow"><div class="lt"><b>尾数回合数量</b><span>最后几期改用尾数倍率</span></div><div class="stepper"><button>−</button><span class="val">3 期</span><button>+</button></div></div>
                <div class="frow"><div class="lt"><b>尾数倍投倍数</b><span>尾数期专用倍率</span></div><div class="stepper"><button>−</button><span class="val">1×</span><button>+</button></div></div>
              </div>
              <div class="frow" style="flex-direction:column;align-items:stretch;">
                <div class="lt"><b>跳过回合</b><i class="finfo" data-tip="点选要跳过的期数；跳过的期数不下注，但仍计入总回合数。">i</i><span>点选即可，默认不跳过</span></div>
                <div class="playgrp" id="skipChips" style="margin-top:8px;"></div>
              </div>
              <div class="tipline"></div>

              <div class="sectit">4 · 止盈止损</div>
              <div class="frow"><div class="lt"><b>止盈</b><i class="finfo" data-tip="止盈止损按全部被触发的投注项合并累计计算：合计盈利达到止盈、或合计亏损达到止损，整个计划立即停止。">i</i></div><div class="stepper" id="tpStepper"><button>−</button><span class="val" style="color:var(--muted)">—</span><button>+</button></div></div>
              <div class="tipline"></div>
              <div class="frow"><div class="lt"><b>止损</b></div><div class="stepper" id="slStepper"><button>−</button><span class="val" style="color:var(--muted)">—</span><button>+</button></div></div>
              <div class="frow rangerow" id="tpSubCard" style="flex-direction:column;align-items:stretch;display:none;">
                <div class="marketsub" id="tpSub" style="margin:0;"></div>
              </div>

              <div class="sectit">时间与风控</div>
              <div class="frow"><div class="lt"><b>暂停自动投时间</b><i class="finfo" data-tip="到达该时间点，计划自动暂停投注。">i</i><span>到点自动暂停</span></div><input type="time" class="timein"></div>
              <div class="tipline"></div>
              <div class="frow"><div class="lt"><b>恢复投注时间</b><i class="finfo" data-tip="到达该时间点，计划自动恢复投注。">i</i><span>到点自动恢复</span></div><input type="time" class="timein"></div>
              <div class="tipline"></div>
              <div class="frow"><div class="lt"><b>恢复后回合是否继续</b><i class="finfo" data-tip="开启：恢复投注后接续暂停前的执行进度。关闭：恢复后重新开始计数。">i</i><span>承接暂停前进度继续执行</span></div><div class="toggle sm off"></div></div>
              <div class="tipline"></div>

              <div class="frow" style="background:var(--tint);border-color:#BBD4FF;"><div class="lt"><b style="color:var(--blue-d)">提示</b><span style="color:#1A4E8A;display:block;line-height:1.6;">玩家设定完成后，可保存为常用模板，下次一键启用。<br>自动投注前，建议弹窗再次确认玩法、金额、回合与止盈止损。<br>如达到止损、止盈、暂停时段或回合结束，系统应立即停止投注并提示结果。</span></div></div>
            </div>
            <div class="ftcta"><button class="ghost" data-act="show" data-arg="autos">保存</button><button class="cta" data-act="saveplan"><span class="t-new">启动计划</span><span class="t-edit">保存修改</span></button></div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:25,h:`

          <!-- ===== 爆仓查询 · Drawer（新版 · 复用查爆仓卡片表单；结果仅趋势+分布，不跳转 Tab）===== -->
          <div class="tpl-modal" id="bqDrawer">
            <div class="cf-backdrop" data-act="dbqclose"></div>
            <div class="bq-dw-sheet">
              <div class="bq-dw-head"><span>爆仓查询</span><span class="x" data-act="dbqclose" aria-label="关闭">×</span></div>
              <div class="bq-dw-scroll" id="dbqScroll">
                <div id="dbqForm">
                  <div class="bq-card">
                    <div class="bq-lab">投注模式</div>
                    <div class="stg-opts two" id="dbqModeSeg">
                      <div class="stg-opt on" data-act="dbqmode" data-arg="两面"><div class="t">两面</div><div class="d">大小 / 单双 / 龙虎</div></div>
                      <div class="stg-opt" data-act="dbqmode" data-arg="定位"><div class="t">定位</div><div class="d">1–10位置排名</div></div>
                    </div>
                  </div>
                  <div class="bq-card" id="dbqDirCard">
                    <div class="bq-lab">回测方式</div>
                    <div class="stg-opts" id="dbqDirSeg">
                      <div class="stg-opt on" data-act="dbqdir" data-arg="跟投"><div class="t">跟投</div><div class="d">同方向连开回测（长龙）</div></div>
                      <div class="stg-opt" data-act="dbqdir" data-arg="反投"><div class="t">反投</div><div class="d">单跳交替回测（投反方向）</div></div>
                    </div>
                  </div>
                  <div class="bq-card" id="dbqPosWrap" style="display:none;">
                    <div class="bq-lab">定位条件</div>
                    <div class="stg-grid"><div class="stg-stp full"><div class="col"><div class="num" id="dbqPosN">3 码</div><div class="lbl">定位几码</div></div><div class="sbtns"><button data-act="dbqposstep" data-k="posN" data-d="-1">−</button><button data-act="dbqposstep" data-k="posN" data-d="1">+</button></div></div></div>
                    <div class="stg-grid" style="margin-top:8px;">
                      <div class="stg-stp"><div class="col"><div class="num" id="dbqPosHot">3 个</div><div class="lbl">热号数量</div></div><div class="sbtns"><button data-act="dbqposstep" data-k="hot" data-d="-1">−</button><button data-act="dbqposstep" data-k="hot" data-d="1">+</button></div></div>
                      <div class="stg-stp"><div class="col"><div class="num" id="dbqPosCold">2 个</div><div class="lbl">冷号数量</div></div><div class="sbtns"><button data-act="dbqposstep" data-k="cold" data-d="-1">−</button><button data-act="dbqposstep" data-k="cold" data-d="1">+</button></div></div>
                    </div>
                    <div class="bq-lab" style="margin-top:12px;">候选下注回合数</div>
                    <div class="stg-grid"><div class="stg-stp full" id="dbqCandFieldPos"><div class="col"><div class="num"><span class="val">6 期</span></div><div class="lbl">你打算设置的回合数</div></div><div class="sbtns"><button data-act="dbqcand" data-d="-1">−</button><button data-act="dbqcand" data-d="1">+</button></div></div></div>
                  </div>
                  <div class="bq-card" id="dbqRangeWrap">
                    <div class="bq-lab" id="dbqRangeLab">长龙区间</div>
                    <div class="stg-grid">
                      <div class="stg-stp"><div class="col"><div class="num" id="dbqMinV">3</div><div class="lbl"><span id="dbqMinLab">最低长龙</span> ≥</div></div><div class="sbtns"><button data-act="dbqstep" data-k="min" data-d="-1">−</button><button data-act="dbqstep" data-k="min" data-d="1">+</button></div></div>
                      <div class="stg-stp"><div class="col"><div class="num" id="dbqMaxV">8</div><div class="lbl"><span id="dbqMaxLab">最高长龙</span> ≤</div></div><div class="sbtns"><button data-act="dbqstep" data-k="max" data-d="-1">−</button><button data-act="dbqstep" data-k="max" data-d="1">+</button></div></div>
                    </div>
                    <div class="bq-lab" style="margin-top:12px;">候选下注回合数</div>
                    <div class="stg-grid"><div class="stg-stp full" id="dbqCandField"><div class="col"><div class="num"><span class="val">6 期</span></div><div class="lbl">你打算设置的回合数</div></div><div class="sbtns"><button data-act="dbqcand" data-d="-1">−</button><button data-act="dbqcand" data-d="1">+</button></div></div></div>
                  </div>
                </div>
                <div id="dbqResult" style="display:none;">
                  <div class="bq-condbar"><span id="dbqCondTxt"></span><span class="edit" data-act="dbqback">修改条件 ›</span></div>
                  <div class="qcard">
                    <div class="qtitle">近期爆仓趋势</div>
                    <div class="bq-qsub" id="dbqCalLine"></div>
                    <div class="bq-days" id="dbqDayGrid"></div>
                    <div id="dbqBustList"></div>
                  </div>
                  <div class="qcard">
                    <div class="qtitle">建议追投回合 · 次数分布</div>
                    <div class="bq-qsub" id="dbqDistLine"></div>
                    <div class="bq-chiprow" id="dbqDistChips"></div>
                    <div class="bq-hwrap">
                      <div class="bq-cutline" id="dbqCutLine"></div>
                      <div class="bq-cutlab" id="dbqCutLab"></div>
                      <div class="bq-hw" id="dbqBarWrap"></div>
                      <div class="bq-hl" id="dbqBarLbl"></div>
                      <div class="bq-xcap">横轴＝追到第几回合才中 · 柱上数字＝发生次数</div>
                    </div>
                    <div class="bq-legend"><span class="bq-lg"><i class="bq-dot" style="background:#1D9E75"></i>安全</span><span class="bq-lg"><i class="bq-dot" style="background:#EF9F27"></i>注意</span><span class="bq-lg"><i class="bq-dot" style="background:#E24B4A"></i>风险高（追得深）</span></div>
                  </div>
                </div>
              </div>
              <div class="bq-dw-foot" id="dbqFootForm"><button class="bq-gho" data-act="dbqreset">重置条件</button><button class="bq-cta" data-act="dbqquery">立即查询</button></div>
              <div class="bq-dw-foot" id="dbqFootResult" style="display:none;"><button class="bq-cta" data-act="dbqback" style="flex:1;">返回修改条件</button></div>
            </div>
          </div>
`});

(window.IM168_VIEWS=window.IM168_VIEWS||[]).push({o:27,h:`

          <!-- ===== 旧版 模板页（已被策略中心 v0.8 的策略模板落地页取代，暂保留备查，无入口）===== -->
          <div class="view view-templates">
            <div class="subhead"><span class="bk" data-act="show" data-arg="autos">‹</span><b>新建计划 · 选模板</b><span class="rt"></span></div>
            <div class="scroll2">
              <div class="sectit">官方模板 · 点「试用」载入后可微调</div>
              <div class="tpl"><div class="tplh"><b>小本试水</b><span class="tplapply" data-act="stgnew">试用</span></div><div class="tplsum">基础 10 · 倍投 2×（上限3）· 止盈+100/止损−100</div><div class="tplmeta">官方推荐 · 适合新手</div><div class="rusers"><span class="avs"><i style="background:#D6E4FF;color:#0B52CC">王</i><i style="background:#F7D9E2;color:#B03A5B">李</i><i style="background:#DDEFE0;color:#1FA971">陈</i></span><span class="ru"><b>128</b> 人用过 · 本周 <b>36</b> 人在用</span></div></div>
              <div class="tpl"><div class="tplh"><b>反投策略</b><span class="tplapply" data-act="stgnew">试用</span></div><div class="tplsum">反投 · 冠军大小 · 倍投 2×（上限5）· 止盈+200/止损−300</div><div class="tplmeta">稳健 · 近 7 日命中 62%</div><div class="rusers"><span class="avs"><i style="background:#DDEFE0;color:#1FA971">周</i><i style="background:#FFEBC7;color:#9A6C00">刘</i></span><span class="ru"><b>86</b> 人用过 · 本周 <b>21</b> 人在用</span></div></div>
              <div class="tpl"><div class="tplh"><b>跟投策略</b><span class="tplapply" data-act="stgnew">试用</span></div><div class="tplsum">跟投 · 冠军大小 · 倍投 3×（上限7）· 止盈+500/止损−800</div><div class="tplmeta">高风险 · 适合老手</div><div class="rusers"><span class="avs"><i style="background:#E3DBFF;color:#5A3FC0">赵</i></span><span class="ru"><b>42</b> 人用过 · 本周 <b>9</b> 人在用</span></div></div>
              <div class="sectit">我的模板</div>
              <div class="tpl"><div class="tplh"><b>我的反投改</b><span class="tplapply" data-act="stgnew">试用</span></div><div class="tplsum">反投 · 冠军大小 · 倍投 2× · 止盈+300/止损−300</div><div class="tplmeta">上次使用 今天</div></div>
              <div class="tplnew" data-act="stgnew">＋ 不用模板，自定义新计划</div>
            </div>
          </div>
`});
