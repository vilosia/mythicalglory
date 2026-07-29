# IM168 Phase B — 游戏厅 · Handoff（V3 当前版）

本文件已于 2026-07-06 将原 Handoff V1、`IM168_prototype_spec.md` V2、群主管理面板 V2.1 与 User Wallet V3 合并。后续工作以本文件的「已确认决策」为产品口径，以 `index.html` 为可运行事实；V2 规格仍保留作较早的逐屏组件与流程细节索引。

## 2026-07-16 · iM68Archive 定向合并

- 只迁移归档根目录中与本轮指定范围有关的页面；没有覆盖归档内不同分支的自动投 Feed。
- **会员钱包**：申请完成页的申请编号改为纯展示，移除复制符号。
- **管理中心**：「冻结成员」统一调整为更准确的「停用游戏权限」；成员列表与首页使用「已停用」，名册补齐成员 ID，进入详情会带入对应姓名、头像、ID、投注时间与权限状态。已停用详情顶部出现状态条并可直接恢复；停用 Drawer 说明已下注单仍正常结算、额度保留，并支持填写选填原因；操作后同步名册状态。
- **抽成设置**：抽成方式卡片去除装饰性人物/饼图符号，投注口径统一改称「额度」；当前设置使用 sliders 线性图标；试算入口文案更精简。试算 Drawer 去除重复的关闭叉、币种后缀和底部重复提示，以全宽「关闭」按钮收尾。

## 2026-07-17 · iM68Archive 三项视觉定向迁移

- **用户钱包卡片 / 管理员额度卡片**：两处继续使用当前蓝色 Hero，不改信息结构；迁入归档版右上角向内渐隐的白色点阵背景，使用同一套 `.fg-hero::before`，保持两个身份页面的品牌一致性。
- **自动投策略卡监测图标**：运行中升级为 24px 三环雷达；扫描拖尾与指针在同一旋转层以 7 秒一圈同步旋转，中心点以 2 秒轻微脉冲。选中蓝卡自动切换白色微光，未选中白卡保持蓝色。
- **急停表现保持当前产品决定**：仍显示同一雷达的冻结帧并降至 40% 透明度，不使用另一套停止图标；系统开启“减少动态效果”时也会冻结扫描并隐藏脉冲。

## 2026-07-20 · Archive 爆仓页 v3.1 定向迁移

- **迁移范围**：以 `Archive.zip` 根目录的 2026-07-20 版本为准，仅替换 `views/game-bust.js`、`shared/app.js` 中查爆仓 Tab 独立 IIFE，以及 `shared/styles.css` 的 `bq-* / bx-*` 专属样式；没有覆盖当前聊天室、自动投 Feed、钱包或管理中心。
- **双屏流程**：保留原查询表单；点击「立即查询」后进入新结果屏。表单的跟投/反投、长龙最低值与候选下注回合数会映射为结果页的方向、长龙条件及候选回合。
- **结果页信息架构**：顶部提供「保存查询 / 最近查询」；条件区可切换跟投/反投与长龙 3–8/8+；时间范围支持今日、3 天、7 天；主体依次呈现爆仓发生期数分布、覆盖率分界与候选回合滑杆、最高爆仓记录。
- **动态数据关系**：示例柱状分布、覆盖率、风险颜色、记录深度与候选回合说明由同一组状态计算，切换方向、长龙、时间或候选值会同步更新，避免页面数字互相矛盾。
- **操作出口**：结果页底部提供「重置条件」返回表单与「生成策略」；生成策略 Drawer 会带入当前方向、时间范围、长龙触发及候选回合设置。最近查询仍限制最多 6 条，并支持恢复查看。

## 2026-07-20 · 管理中心「额度往来」汇总

- 管理中心原「交易记录」统一改称 **「额度往来」**：该 Section 同时承担日期范围汇总、类型筛选与已完成明细，不再使用只描述列表的「交易记录」。
- 日期选择器移到 Section 标题右侧；下方增加无卡片背景的紧凑摘要栏，展示所选日期范围内的上分笔数/金额、下分笔数/金额，并以群主视角直译为「额度池净增加 / 净减少」，不要求用户解释正负号。
- 汇总数字由当前明细 DOM 实时计算，不写死；切换今天、最近 7 天、最近 30 天、全部时间或自定义日期后，与列表使用同一日期条件同步更新。上分/下分 chips 只筛选明细，不改变总体摘要，避免布局与数字来回跳动。
- **流水边界**：管理中心额度往来只保留已完成记录；待审核申请从该列表移除，由上方「待审批」入口统一承接；已拒绝申请同样不计入额度流水和合计，确保笔数、金额与实际额度变动严格一致。
- 成员详情原「额度记录」同步改成 **「额度往来」**，默认范围为「本月」；复用同一紧凑摘要结构，但净额使用成员视角的「净上分 / 净下分」。类型筛选仍只作用于下方明细。
- **视觉收口（client 看过实机后确认）**：管理中心与成员详情的「标题＋日期、汇总、类型筛选、明细」统一收进一张白色 Section 容器；明细列表取消自身边框与圆角，直接承接在筛选下方，避免灰底上的内容显得松散，也避免卡片嵌套。
- **成员额度 Hero（client 后续确认）**：管理员查看成员详情时，「当前额度＋累计总盈亏＋群主累计抽成」整张卡统一改为管理中心同源的蓝色渐变与右上渐隐点阵；全部标签使用半透明白、数字使用白色，避免同一管理域出现两套资金卡语义。
- **会员钱包同步「额度往来」**：游戏厅钱包原「最新额度记录」改为同结构的白色 Section 容器，日期在标题右侧；汇总展示上分、下分、游戏盈亏，并计算「额度净增加 / 净减少」。汇总跟随日期范围、但不随类型 chips 跳变。原分类和记录中的「游戏盈利」统一改为「游戏盈亏」，避免负数记录语义矛盾。待审核申请继续在钱包 Hero 下方的独立申请卡展示，不进入已完成往来；审批通过后才写入额度往来，拒绝不写入。
- **额度往来汇总最终层级（client 参考图，仅参考排版不参考配色）**：管理中心、成员详情、会员钱包三处统一改为“上/下分标签 → 大号金额 → 小号笔数”；下方完整分隔线承接净额结论，再用灰色说明标注统计边界。管理中心与成员详情说明「仅统计已完成交易，不含待审批」；会员钱包说明同时带出已纳入净额的游戏盈亏。继续沿用项目现有蓝白配色。

## Source of truth / 阅读顺序
1. `HANDOFF.md`：已确认产品决策、当前实现状态与交接重点（本文件）。
2. `index.html` + `views/*.js` + `shared/app.js` + `shared/styles.css`：可运行原型（2026-07-09 已按业务区块拆分，见下方「文件结构」）。
3. `IM168_prototype_spec.md`：V2 的完整逐屏、overlay、组件与用户流程说明，内容已经在本文件下方按模块归纳。
4. `IM168_PhaseB_Brief.md`：较早需求背景；若与以上三者冲突，以较新的已确认决策为准。
5. 模块级功能文档（单模块深度口径，随功能落地维护）：`自动投_功能理解.md`（自动投）、`爆仓.md`（查爆仓）。

## 文件结构（2026-07-09 拆分，client 确认）
`index.html` 已从 3880 行单文件拆分为「外壳 + 区块文件」，运行时行为与拆分前完全一致（同一 DOM、同一 JS 作用域，跨页联动如「自动投分享→聊天室」不受影响，已浏览器实测）。**打开 App 首页 = 资讯（view-news），client 2026-07-09 确认。**

- `index.html`（~200 行）：外壳。手机 chrome、底部导航、屏幕级弹窗（planModal/startModal/guideModal/dashToast/quickslip）、抽屉，以及各文件的 `<script>` 引用清单。新增区块文件时在这里加一行 `<script src="views/xxx.js">`。
- `views/*.js`：每个文件 = 一个业务区块的页面 HTML（模板字符串注册到 `window.IM168_VIEWS`，由 `shared/app.js` 启动时按原顺序注入 `.body`）。**改哪个区块只动哪个文件**：
  - `news.js` 资讯首页 · `groups.js` 聊天/群组+消息+全局搜索 · `me.js` 我的
  - `game-bet.js` 频道+投注+更多+投注历史+全部游戏 · `game-autos.js` 自动投（仪表盘/formula/爆仓/全部计划/模板）· `game-chat.js` 聊天室+聊天室搜索 · `game-bust.js` 查爆仓（2026-07-11 新增第 4 Tab；规范见 `爆仓.md`）
  - `wallet.js` 钱包全套（含上下分 drawer）· `admin.js` 群主管理全套
  - ⚠ view 片段内不可使用反引号 ` 或 `${`（内容在 JS 模板字符串里）。
- `shared/app.js`：全部 JS 逻辑（原 inline script 整体迁出，一个 IIFE：showView 路由、data-act 事件委托、dashPlans 状态、跨页联动）。
- **URL hash 路由（2026-07-09）**：showView 会把当前页写入网址（`#bet`/`#autos`/`#wallet`…，history.replaceState 不污染返回键），刷新停在原页不再跳回首页；直接改 hash 也会切页；无效 hash 安全忽略；无 hash 时默认 `#news`。设计师可收藏/互发 `index.html#bet` 这类链接直达页面。
- `shared/styles.css`：全部 CSS（原 inline `<style>` 1150 行已追加到基础样式之后，覆盖顺序不变）。新增样式写这里。
- `backup/index-presplit-2026-07-09.html`：拆分前的完整单文件备份。
- 后续方向（未做）：多游戏差异抽成 `shared/game-config.js` 配置表，页面只保留一份。

## V3 current status（下一位 Agent 先读这里）

### 自动投 · 策略生命周期布局（2026-07-15 · client 确认，2026-07-15 已实装）
- **固定三张策略 Tab**：首次教程结束后默认展示两张官方模板「小本试水 / 反投策略」＋一张「新增策略」。任何时刻只有一张卡处于 Active；**Active 只表示当前选中，不等于策略已启用**。
- **策略卡 v5（2026-07-16 client 确认，已实装）**：移除卡片区上方「策略」标题和问号，卡片直接承接页面语义。卡片 Header 左侧用小字「官方模板 / 自定义策略」＋策略名两行，右侧状态图标占这两行总高度；运行中使用雷达扫描（支持 `prefers-reduced-motion`），急停冻结并半透明，完成使用静态 Check。蓝色卡片只代表当前查看，状态图标才代表真实执行状态，因此运行卡未被选中时仍可识别。
- **策略卡数据布局**：标题区与数据区用弱分隔线区分；所有指标纵向排列、每个数字独占完整卡宽。运行/急停卡展示「累计盈亏」＋「累计投入」，金额保留两位小数和千分位；未运行官方模板以相同结构展示「均盈利」＋「人用过」。不使用左右双列，避免长金额互相挤压。
- **策略卡与 Feed 微调（2026-07-16 client 反馈，已实装）**：卡片底部内边距收紧、整体最小高度由 152px 降至 134px；策略名到分隔线缩短 2px。运行图标由 Play 呼吸环改为雷达扫描（同样支持减少动态效果）。执行动态「急停」固定为 30px 高，与分享/设置按钮一致；展开注单表格 Header 字号提高到 10.5px、字重 600。
- **状态图标与选中线定稿（2026-07-16 client 确认，已实装）**：雷达移除外层圆形容器，缩为 24px 并贴齐 Header 右侧；运行中仅扫描线旋转，急停后复用同一雷达并冻结扫描、整体降至 40% 透明度，完成计划仍使用静态 Check。选中连接线由 112px 加长至 136px，同时由 3px 减为 2px，两端继续渐隐。
- **未启用 Layout = 策略设置**：选中未启用的官方模板时，下方展示该模板完整设置，不显示执行 Feed、不显示指令栏。屏幕底部固定双 CTA「编辑 / 启用」，玩家浏览到任何位置都无需回滚即可操作；编辑打开带入模板参数的设置 Drawer。
- **新增策略占位**：第三张「新增策略」尚未创建时不显示空 Feed 或指令栏；点击卡片直接从底部打开分步创建 Drawer。创建完成后才成为真实的自定义策略实例。
- **运行中 Layout = 执行动态**：启用后下方切为时间顺序 Feed，逐期追加「是否触发 / 自动投注注数 / 本期总投入」与开奖后的「命中注数 / 最终盈亏」。Section Header 保留分享、设置与「急停」；底部固定区域由双 CTA 切换为指令栏。
- **急停后不回模板预览**：保留执行动态历史与指令栏；Header 标记「已急停」，动作由「急停」切为「重新启用」。玩家可继续用指令修改当前 Active 策略，系统回执「设置已更新，将在重新启用后生效」。急停只阻止后续未提交投注，急停前已提交注单仍等待开奖并继续追加结算动态。
- **指令栏出现条件**：未启用 Layout 一律不显示（包括官方模板和已保存但尚未启用的自定义策略）；运行中、已急停、已完成策略显示。未创建的新增占位也不显示。
- **指令栏策略上下文（2026-07-20）**：指令栏出现时，左侧先显示当前选中的策略名称，紧接可点击 `/`，后方灰字固定为「打开针对该策略的指令」。切换策略会同步切换名称并清空尚未提交的旧策略指令，避免命令误作用到另一张卡；Drawer 标题继续明确写「对『策略名』」。
- **操作区分工**：未启用阶段的高频决策动作放底部固定 CTA；运行/急停阶段底部优先留给指令栏，策略状态动作放在执行动态 Header，Header 随 Feed 吸顶以保证急停/重新启用始终可达。
- **执行动态 Filter 合并（2026-07-21 最新）**：Header 只保留单一 `筛选` 入口；有非默认条件时显示数量提示（如「筛选 · 2」）。Drawer 调整为 **搜索期数 → 执行结果 → 更多条件 → 时间范围 → 对应统计**，底部固定「重置 / 查看 N 条动态」。高频的执行结果常驻显示；低频的动态类型与回合范围改为选择行，点击后在当前 Drawer 内展开，避免按钮平铺造成杂乱。
- **筛选维度拆分**：执行结果为全部 / 待开奖 / 已结算 / 未投注；动态类型为全部动态 / 投注动态 / 策略事件 / 执行异常。选择非「全部」的执行结果时自动限定为投注动态；选择策略事件或执行异常时执行结果恢复为全部。选择「已结算」后再出现全部结果 / 盈利 / 亏损 / 持平；「执行异常」包含部分提交、全部失败、余额不足或封盘失败；「策略事件」包含启用、修改、暂停、恢复、急停与计划完成。
- **回合与时间**：「回合范围」代表该期至少有一个投注项处于所选回合，选项为全部回合 / 第 1 / 第 2 / 第 3 / 第 4 回合以上 / 自定义闭区间；不得表述成“整期处于第 N 回合”。策略事件没有回合概念，选中后隐藏回合范围。时间范围为今天 / 近 7 天 / 近 30 天 / 自定义。
- **动态统计口径**：Drawer 始终显示「符合条件 N 条」；全部、投注动态或已结算显示 `已结算 / 盈利 / 亏损 / 盈亏`；待开奖显示 `待开奖 / 投注注数 / 累计投入`；执行异常显示 `异常期数 / 失败注数 / 未扣款`；未投注和策略事件不硬塞无意义的结果指标。统计与 Drawer 条件实时联动，应用筛选后同步出现在 Feed 顶部。
- **急停入口弱化（2026-07-15 client 确认，已实装）**：执行动态 Header 的「急停」不用红底警示按钮，改为与分享/设置同高度的安静次级入口（白/透明底、浅灰边框、低饱和文字）。只有点击后进入二次确认 Drawer，最终确认「急停」才使用实心红色，形成「安静入口 → 明确危险确认」两级语义。
- **Feed 单期事件规则（2026-07-16 client 全部通过，已实装）**：事件只追加、不改写历史。成功下注先写 `时间　第XXXXX期 · 已投 X 注　投入金额`；开奖后另起一条 `时间　第XXXXX期 · 命中 X/X 注　单期盈亏`，原投注记录继续保留。`0/X` 写「未命中」，`X/X` 写「全部命中」；普通未触发精简为 `第XXXXX期 · 未达到条件`。投注金额使用品牌蓝，正盈利绿、亏损红、0 灰，避免把支出误读为收益。
- **异常投注事件**：部分成功=`第XXXXX期 · 已投 X/Y 注`，详情逐注标示成功与失败原因，只累计已成功提交的注数和金额；全部失败=`第XXXXX期 · 投注失败　未扣款`，Summary 固定显示 `0/Y 注 / 扣款金额 0`。余额不足、封盘超时等失败不得混入已投注数。策略自动暂停、恢复、急停和完成使用独立状态语义，不把自动暂停写成玩家急停。
- **数字唯一事实源**：期号 Header、详情 Summary、逐注 Table、命中数、投入和单期盈亏必须从同一组注单 items 派生；禁止在各层分别写死。每条 Feed 带 `data-requested / data-submitted / data-stake / data-pnl` 供 QA 核对。DEMO 的 3 注示例固定由 160 + 40 + 10 = 210 派生；命中 1 注时盈亏为 `+158.4 − 40 − 10 = +108.4`。
- **策略状态文案（2026-07-17 最新）**：首次=`策略已启用 · 监测中`；重新启用=`策略已重新启用 · 监测中`；修改=`策略设置已修改 · 下期生效`（急停后为「重新启用后生效」），展开只列 `旧值 → 新值`；暂停=`策略已暂停 · 原因`；恢复=`策略已恢复 · 监测中`；急停=`策略已急停 · 后续投注已停止`；自然完成=`计划已完成 · 全部已结算`。急停后若尚有待开奖注单，开奖完成时另行追加 `本次运行已全部结算`，不得把原急停事件改写。官方模板或自定义策略的“已创建”只通过创建完成反馈表达，不进入执行动态。
- **Feed 视觉层级（2026-07-16 最新）**：所有 Feed Header 始终白底，展开/收起不换色；展开详情用极浅中性灰 `#F8F9FB`，Table Header 使用 `#ECEFF3`。未达到条件整行中灰；部分成功用安静琥珀色提示；全部失败用克制红色；启用/恢复/重新启用继续使用蓝色 Play 三角。没有可解释详情的事件不应为了统一而强制提供展开入口。
- **DEMO 状态预览**：自动投侧边 DEMO 已覆盖模板未启用、首次启用＋第一笔投注、投注待开奖、投注＋结算双记录、全部命中、全部未命中、部分成功、全部失败未扣款、暂停＋恢复、设置修改＋重新启用、急停待开奖、急停后全部结算、自然完成全部结算，共 13 个状态。Demo 走正式 `feedHtml / pxCard / pxFacts` 渲染，不维护第二套静态金额。
- **单期详情去重（2026-07-17 定稿）**：单期 Listing 本身就是一行 Summary，已经包含期号、投注/命中注数与投入/盈亏；展开后不再重复 Summary 瓦片，直接进入逐注明细。已结算详情在表格底部只保留一条紧凑核账关系 `投入 / 派彩 / 盈亏`；待开奖、部分成功、失败则仅在必要时补充规则或失败原因。
- **累计与阶段数据边界**：运行中的累计投入/累计盈亏由策略卡承载，不在每条 Feed 重复。只有急停与计划完成展示 `本次运行 Run Summary`：急停待结算显示运行时长、触发期数、投注注数、总投入、已结算盈亏及待开奖数量，不显示 ROI；全部结算后显示总投入、总派彩、最终盈亏与 ROI，形成明确收尾。
- **急停详情结构（2026-07-17 定稿）**：急停事件展开后只展示阶段性的 Run Summary，不再把某一期注单表嵌进总结。急停当期的投注与后续结算继续作为独立单期事件存在，和普通期次使用同一套四列表格「投注项 / 回合 / 金额 / 可赢（或盈亏）」。
- **急停后的追加顺序**：待结算时顺序为 `急停阶段总结 → 原投注事件 → 历史`；全部开奖后顺序为 `本次运行最终总结 → 最后一期结算事件 → 原急停事件 → 原投注事件 → 历史`。原型最后一期固定为 3 注投入 `160 + 40 + 10 = 210`、命中 1 注、单期盈亏 `+158.4 − 40 − 10 = +108.4`。
- **最终总结核账**：Demo 急停前已结算盈亏为 `+118.2`，最后一期结算 `+108.4`，因此最终盈亏为 `+226.6`；本次总投入 `450`，总派彩 `676.6`，ROI `+50.36%`。自然完成 Demo 为总投入 `450`、总派彩 `358.2`、最终盈亏 `−91.8`、ROI `−20.40%`。
- **Run Summary 视觉层级（2026-07-17）**：内卡不再重复外层 Header 的「待开奖 / 全部结算」状态 Badge。急停待开奖先显示琥珀提示 `最终结果待定 / 1期·3注仍待开奖`，当前盈亏明确标注「不含待开奖注单」；全部结算使用 `最终盈亏 + ROI` 主结果、`本次投入 → 结算派彩` 核账关系和紧凑运行数据。自然完成额外显示完成原因，与手动急停后的结算区分。Run Summary 金额统一带 `¥` 并保留两位小数。
- **Feed 字体阶梯（2026-07-17）**：整个执行动态统一为有限的六档字号：`10px` 辅助说明、`10.5px` 时间/标签、`11.5px` 详情正文、`12.5px` 事件标题、`13px` 行级金额、`18px` 唯一主结果。取消 8.5–9.5px 的过小正文，也不允许多个普通统计值同时放大；18px 只用于 Run Summary 的当前/最终盈亏。Table Header、进程、异常原因、核账条、修改记录与终态总结均按此阶梯校正。
- **本次运行统计边界**：运行中显示「开始时间–至今」；急停后冻结为「开始时间–急停时间」；重新启用后开始一组新的本次运行时间与累计数据。即使选择「继续上一回合」，投注回合进度可以延续，但本次运行的投入/盈亏从重新启用时间重新统计。主页面不展示过去运行列表；若未来需要历史统计，再进入完整报告处理。
- **官方模板策略详情（2026-07-20 最新）**：未启用模板页的总标题使用具体策略名＋`策略详情`，例如 `小本试水策略详情`。详情顶部直接展示适合人群、风险、收益、稳定性画像，不再添加孤立的「策略概览」标题，也不重复策略卡已经显示的使用人数；下方 `策略设置` 展示触发规则、投注执行、风险控制、后续机制。四组规则继续使用靶心、额度堆叠、盾牌、循环线性 SVG 图标。底部保留小贴士；固定「编辑 / 启用」CTA 与 Preview 同屏互斥指令栏。
- **模板编辑后启用流程（2026-07-17 最终修正）**：无论直接启用还是先编辑，始终操作当前同一张模板卡，不复制、不新增、不换卡位，策略名称也保持「小本试水 / 反投策略」。参数一旦偏离官方默认值，卡片来源标签由「官方模板」改为「自定义模板」；若恢复后的全部参数与官方默认完全一致，标签自动回到「官方模板」。编辑设置 Drawer 右上角固定提供「恢复官方设置」，点击只恢复当前工作副本并提示“保存后生效”，避免误触立即覆盖。最后一步继续使用「保存修改 / 保存并启用」，首次启动 Feed 写入「策略已启用 · 监测中」。
- **聊天室分享定位（2026-07-21 client 最新定稿）**：分享对象为 **策略 + 当前这一轮运行状态**，不是历史累计表现、跨轮合并数据或静态版本快照。分享的核心价值是让群友快速判断当前这轮是否值得套用。每次重新启动都会生成新的 `runId`，盈亏、触发次数、最近结果和持续时间从零重新统计；同一策略同一轮在同一聊天室最多一张卡。
- **分享卡数据口径**：只展示当前盈利／本轮最终盈亏、本轮触发次数、最近实际触发且已结算的输赢结果，以及运行中才显示的持续时间。`本轮触发` 只计算满足条件并实际产生投注的次数；未触发期数不进入触发数与最近结果。保留使用／关注／查看人数，但不建立热度、星级或评分体系。卡片不展示 ROI、历史累计盈利、历史运行天数、多次运行合并成绩、详细参数、未触发期数或个人投入金额。
- **五种分享状态**：①运行中且已有触发；②运行中但本轮暂未触发（明确说明「持续监测中／暂未满足触发条件」）；③即将启动（展示预计开始和核心监测条件，不展示盈亏）；④急停（展示最终盈亏、触发次数、最近结果与停止原因）；⑤已结束（展示最终盈亏、触发次数、最近结果与结束方式）。平台不设置“暂停”状态。
- **分享生命周期**：运行中卡片随本轮结算实时更新原消息，不重复刷屏。急停或正常结束后冻结本轮最终数据并保留卡片，不再从聊天记录移除；仍可查看本轮报告、直接套用或编辑后使用。急停仅代表分享者这一轮结束，不代表策略不可用。重新启动属于新一轮分享，旧卡继续保留旧轮报告。
- **查看与 CTA**：底部操作顺序统一为 **左侧辅助入口、右侧主 CTA**。运行中为「查看实时动态／查看监测状态」＋「套用此策略」；即将启动为「查看策略设置」＋「提前套用」；急停和已结束为「查看本轮报告」＋「套用此策略」。点击卡片进入策略详情，详情可展示未触发期数以解释监测过程；分享卡本身不展示未触发过程。
- **分享卡高度规则（2026-07-21 修复）**：聊天室消息与策略分享卡必须保持内容自然高度（`flex-shrink:0`），超出可视区时由聊天室纵向滚动；禁止为了塞进当前屏幕压缩卡片后再由圆角容器裁切。五种状态的最近结果、运行说明及 CTA 都必须完整可见。
- **套用流程**：点击套用后先预览关键策略设置，再选择「直接套用」或「编辑后使用」。套用只复制规则，不继承分享者的盈亏、触发次数、最近结果或运行进度；接收者的数据从零开始。直接套用不能静默保存：先检查三张策略卡位，再进入最终确认，明确显示可编辑名称、策略来源、当前卡位及将占用的卡位，并由玩家选择「仅保存 / 保存并启用」；编辑后使用进入完整设置流程。修改核心设置时来源显示为「改编自」。
- **本轮报告**：急停或已结束报告展示本轮最终盈亏、本轮触发、已监测期数、最大连续亏损、最大回撤、停止／结束原因和最近触发结果，并保留「直接套用／编辑后使用」。报告用于解释风险，不阻止其他玩家采用。
- **套用卡位已满**：每位玩家最多三张策略卡。存在空位时进入名称/个人金额/风控确认，再选择「保存策略 / 保存并启用」。三张已满时进入卡位处理 Drawer：运行中、暂停中或仍有待开奖的策略不可替换；未启用、已急停且全部结算、已完成策略可以「归档并替换」。归档只移出当前卡位，历史成绩保留。若没有可替换卡，提供「返回群聊 / 前往自动投管理」，不得为了套用自动急停现有策略。
- **重复套用保护（2026-07-21）**：空卡位不代表允许重复运行。系统以「分享策略来源 ID + 核心规则指纹」识别已套用策略；若完全相同的策略已保存、运行、急停或完成，分享卡主 CTA 改为「查看我的策略」，不再允许直接重复套用。运行中需明确提示相同规则可能在同一期重复下注。玩家只能「查看我的策略」或「编辑后另存」；另存必须至少修改一项核心规则并使用不同名称，之后仍受三卡位规则约束。若已有同来源但规则不同的改编策略，则允许再次套用当前原规则，但最终确认必须提示已有同来源策略。
- **重新启用 Drawer（2026-07-16 已实装）**：职责收窄为重新启用前确认当前策略条件，不再混排上次运行账本、盈亏摘要和可编辑输入。设置按「什么时候开始 / 怎么投注 / 什么时候停止 / 停止以后」四组只读展示；底部为「修改设置 / 重新启用」，修改另进编辑流程，重新启用后再选择继续上一回合或重新开始。

### 钱包 v2 修正（2026-07-12 · 跑位/一致性 6 点）
- **删类型 tab**：额度记录去掉「全部/上分/下分/游戏盈利」类型 chips（跟成员详情额度记录一致，只留时间 popover）；`applyWF` 无 type chip 时默认 all，安全。
- **PK10 游戏盈利加「已完成」stag**（原先无 tag，跟其他行不一致——补上）。
- **去行尾 chevron**（钱包记录不进 drawer 导航层级，去掉多余 icon）。
- **pendbar 重做**：旧琥珀条 → 白卡 `.uw-pend`（`.stag pd` 处理中 tag + 文案 + chevron），点进申请记录；跟 admin 白卡+stag 语言一致。
- **上分 CTA 锁定**：有处理中上分时 `#uwUpBtn.lockd`（灰、`uplocked` toast「已有一笔上分待确认」），一次只允许一单 pending。`uwdemo` 演示切换仍可用。
- **新增「未结注单」stat**：hero 底部双列 `.uw-stats`——今日游戏输赢 +78 | 未结注单 3 笔，两个都 link 投注历史（`show bets`）。

### 钱包对齐管理中心设计语言（2026-07-12 · 内容不变只改 layout/style）
钱包（`views/wallet.js`）**内容/数据/动作全保留**，仅换视觉对齐 admin Figma Phase2 语言：
- **2026-07-16 当前覆盖口径**：个人钱包入口 Chip 由金色改为浅蓝底＋蓝色图标/金额；钱包页 Hero 改用群主管理面板额度卡同款蓝色渐变与白字。上分按钮显示 `↑ 上分`，下分按钮显示 `下分 ↓`。此条覆盖下方较早的蓝 tint 记录与历史金色方案。
- **Dashboard hero**（o:12）：旧 `.wallet-card` 白卡 → `.fg-hero`+`.uw-hero` 蓝 tint 卡（#EAF2FF）+ mono 蓝大数字 + admin 款眼睛 SVG（弃 emoji）；上分/下分按钮 + 今日输赢 sub 保留，样式对齐。
- **额度记录**：时间 `<select>` → `.dt-trigger`+`#uwPop` popover（`uwtpop/uwtpick` 驱动隐藏 wfsel + applyWF，选项全部/今日/近7天/本月不变）；类型 chips（全部/上分/下分/游戏盈利）保留；section 标题用 `.md-sec` admin 款；记录行加 `.mi-cv` chevron 对齐。
- **申请上/下分页**（o:14/17）：`.ap-hero` 加蓝 tint 卡 + 左对齐 + 蓝 mono 数字（CSS-only，markup 未动）。
- 旧 `.wallet-card/.wc-*/.rec-head` CSS 变 dead（markup 已不引用，留着无副作用）。pendbar/确认抽屉/交易详情抽屉未动。

### 聊天 Listing 文案（2026-07-16 · 已实装）
- 群组 Listing 使用「频道/专区·群名」的单行命名：`幸运组·游戏厅`、`极速专区·闲聊`、`VIP大厅·优惠群`。分隔符统一使用中文中点 `·`，不用英文句点。`views/groups.js` 与 `views/game-bet.js` 的重复入口已同步，进入游戏厅后的 PK10 标题与聊天室内部标题不因此改名。
- 群主入口在聊天 Listing 中命名为 `幸运组 · 管理面板`，明确其所属频道；待审批页右上角额度钱包使用浅蓝底＋蓝色图标/数字，不沿用历史金色资金 Chip。

### 时间格式全局统一（2026-07-12 · client 定 `2026/07/07 14:32`）
运营侧所有**绝对时间戳**统一为 `YYYY/MM/DD HH:MM`（零补位）。已改：交易记录/首页最新交易/申请记录/成员详情记录（admin.js + wallet.js，旧「2026年7月7日 09:48」「7月7日 09:48」全转斜杠；钱包额度记录本就是斜杠）。app.js 动态插入行本就是 `2026/07/07 14:32`。**保留相对时间**（语义不同不转）：待审批「已等待 3小时15分」、成员列表「今天投注/3天前投注」、成员详情「最后投注 40分钟前」。玩家投注历史（game-bet.js）属玩家域未动。

### ⚠ 视觉基准切换：Figma Phase 2 design system（2026-07-10 client 确认）
Client 确认**以后所有页面统一按 Figma「Phase 2」section 的规范做**（figma 文件 PJRscSiZbaAadxEMHhEmT1，节点 40000693-42229）。管理中心首页已先行套用，其余页面后续分批对齐。要点（对应 `shared/styles.css` 末尾 `fg-*`/`stag` 段）：
- 白卡**无边框**，靠 #F5F5F5 浅灰底分离；圆角 12。
- 内页 header 白底黑字（back ‹ + 18px 粗标题 + 右侧浅灰 pill），**不再用蓝底 header**；蓝色只留给强调元素。
- 灰阶 token：次要字 #9CA3AF / 辅助 #788192 / 分隔线 #ECEDEE / pill 底 #F4F4F4。
- Hero（收入总览）卡：浅蓝底 #EAF2FF + 蓝色加粗金额（client 拍板采用）。
- 状态 pill 三态（client 给的 reference，`.stag` 组件）：处理中=实心蓝白字+ⓘ、已完成=浅蓝底蓝字+✓圈、已拒绝=浅灰底灰字+✕圈+整行置灰；icon 用 CSS mask（`--stag-ico`）实现，HTML 里只写文字。tag 放在行标题前面。注意：这套蓝系状态与钱包侧旧的琥珀「处理中」不一致，钱包侧待后续对齐。
- 字号统一 Figma ramp：**10 / 12 / 14 / 18**（meta/标签=10、次要=12、行标题=14、页标题=18），不再用 10.5/11/13 之类中间值；新组件一律取 ramp 值。
- **字重规则（2026-07-10 对照 Figma 通知/设置页核实，client 指正）**：列表行标题（分配额度、抽成、成员等）= **Medium 500**，不是 600/700；描述/meta = Regular 400 灰 #9CA3AF；金额数字 = 600；大数字 display（hero 金额、统计数）= 700；页标题 = 18/700。section 标题（如「最近交易」）= 14/500/ink 深色，右侧「查看全部 ›」12/400 蓝。别再把行标题加粗到 600+。
- 管理中心 hero 精简（2026-07-10 追加）：标题改「我的额度」+ 眼睛开关（`ageye`，佣金跳动计时器已加隐藏态守卫）；「已分配/今日变动」从首页移除，「已分配 1,615」挪到待审批页顶部 poolbar（审批场景才需要它）。
- 灰色 icon 统一 `#788192`（comm-gear/eye/chevron/txid-copy）；hero 金额改 6 位数+2 位小数（`240,000.00`，与钱包同量级），旁边加刷新 icon（`agrefresh`，目前只 toast，无真实拉取）。
- **交易 listing 全局统一（2026-07-10，`.txlist` scope 类）**：`[stag 状态tag] 标题(14/500) / 日期(10 灰)`，右侧金额 14/600，只有钱进来是绿 #16A34A、其余全黑，已拒绝整行置灰。已套用：管理中心最近交易+交易记录页、钱包额度记录（`pl-wallet-flow`）、成员详情·申请与审批历史、申请记录（`pl-reqhistory`，原来右栏彩色状态字改为 tag 前置+右栏金额）。动态插入的「处理中」行（提交上下分后）同步换 `.stag`。**游戏盈利行不带 tag**（自动结算，无审批生命周期）；**投注历史没动**（是注单不是资金流水）。`txopen` 抽屉已兼容 `.stag`（标题剥离 tag 文字、ok/pd/no 映射）。抽成费率 client 拍板 **0.0008%**（rake 页警示行已撤）。首页 8/3 数字与标签同字号（14/600），不放大不变色。
- 抽成卡（2026-07-10 再简化）：去掉齿轮 icon + 费率文字（不再暗示可点/无入口），整卡不再链接任何页面（纯展示，不是导航）；今日/累计金额补 2 位小数（68.00 / 1,240.00，跟其他金额一致）。真实费率只在抽成设置页（`view-rake`）显示。
- 交易 listing 文案统一：**「分配额度」→「额度分配」**（管理中心最近交易 + 交易记录页两处的 listing 行，`.macts` 里的操作按钮「分配额度」不受影响——那是动词短语，语境不同）。
- 「+80」这类正向金额色**只在群主交易记录/最近交易范围**改成 `#16A34A`（client 给的参考图），**没有改全局 `--win`**——投注赢钱、钱包等其他地方仍是原来的 `#1FA971`，避免牵连未讨论过的画面。若要统一成一种绿，需要明确告知再改。
- ⚠ **发现一次 app.js 局部编辑被覆盖**（2026-07-10）：上一轮加的 `ageye` handler 和佣金跳动动画的隐藏态守卫，本轮打开文件时已经不在了，需要重新加一次。原因未知，可能是 Google Drive 多端同步/另一个编辑者覆盖了文件。**没有 git 的情况下这类静默丢失不会有任何提示**——下一位 agent 编辑前最好用 grep 复核一下上一轮报告过的改动是否还在，尤其是 `shared/app.js`。

### ⚠ 语义定稿：没有「回收」这个动作（2026-07-10 client 拍板）
- **额度回到群主手上 = 成员发起「下分」申请**，不存在群主主动回收。全部页面「回收」字样已清除（交易记录类型、成员详情按钮、审批 guard 文案）。
- **可分配额度不足 → 群主自行通过第三方渠道充值**（不是回收成员额度）。审批页 guard 文案「可分配额度不足 · 请先充值再审批」，poolbar 右侧「充值 ›」入口（目前 toast 示意）。
- 金额方向统一以「我的额度」记账：上分/分配 = 负（扣减），下分 = 正（返还）；交易记录页底部有一行说明。

### 成员详情 V3.1（2026-07-12 最新 · 覆盖 V2.3/V3）
o:21 现状（以此为准）：
- **Header**：`.md-id.tap` 整块可点 + 右 chevron → 进 `view-memberedit`（编辑页 o:26）；**无编辑按钮**、无右上冻结。只留 头像/昵称[状态]/ID 88213。
- **额度卡**：当前额度 19,000.00 大数（primary）→ 分隔线 → 累计已分配 260,000.00（financial 深）/ 最后投注 2026/07/05 / 加入 2025/07/05（activity 浅）。**删了今日已分配**（90% 为 0）、**删了可回收额度**。最后投注移进卡内改绝对日期，加入日期加回。
- **额度记录**：简单列表（`.md-hist`，无时间筛选/分页），状态 tag + 额度增加/减少 + 金额 + `2026/07/07 14:20` 格式。
- **编辑页 `view-memberedit`（o:26）**：头像/真实名称/备注昵称(仅群主可见)/管理区(冻结成员→`#fzSheet`盾牌 sheet / 复制ID / 举报) / 右上保存。低频 profile 动作全在这里。`mdSetFrozen` 同步详情 chip + 编辑页冻结行文字。
- ⚠ HANDOFF 被 Google Drive 同步覆盖过至少两次（V3 段、app.js 补丁都丢过）；无 git，下位 agent 编辑前 grep 复核上轮改动是否还在。

### 成员详情 V2.3（2026-07-12 · 6 点微调，覆盖 V2.2 的 ⋯ 菜单）
- **去 Credit 字**：额度卡数字纯数字（19,000，不带 Credit）。
- **⋯ 菜单整个拿掉**（我建议：已在详情页内，把唯一管理动作藏二级菜单增加摩擦）。取而代之：复制ID 内联在身份卡「ID 88213 [copy]」（`mdcopy` toast）；举报成员**删除**（无需求、低价值）；冻结移到**导航右上安静文字按钮**「冻结成员」（`.md-fz` 灰调 #788192，不红不抢眼，iOS 详情页管理动作惯例位；点开盾牌 bottom-sheet 确认）。所以 client 提的「竖排三点」需求随菜单移除而作废。
- **额度记录成组**：标题+筛选+列表+分页包进**一张白卡** `.md-histwrap`（筛选行带下划线做卡内 header），不再是「标题浮在 page 上、列表另一张卡」的割裂感；`.blist` 在 wrap 内去掉自身边框背景。
- **加分页**：`pl-member-hist` data-size=4，mock 5 条今天+3 条更早=8 条，今天筛选下 5 条→2 页可演示。`mhApply(days)` 抽出复用（mhpick + showView 进 member 时应用默认「今天」）；分页与时间筛选用 bfilter-hide 协作（复用 renderPage）。
- 冻结/解冻仍走 `#fzSheet` 盾牌 sheet；`mdSetFrozen` 改切右上 `.md-fz` 文字。

### 成员详情 V2.2（2026-07-12 · client「其他都跟图」，覆盖 V2.1 的两处取舍）
client 指定除额度记录外全部照 reference 图。相对 V2.1 的变更（回滚了我之前依 spec 文字做的删减，改以图为准）：
- **可回收额度回归**：额度卡底部改**双列** 累计已分配 260,000 | 可回收额度 19,000（`.md-cr-two`），两个 label 都带 ⓘ（`.mi-info` mask icon）。剩余额度也带 ⓘ。（注：跟早前 spec 文字「删可回收」矛盾，但本轮 client 明确跟图，以图为准。）
- **⋯ overflow 菜单启用**（这轮改要做了）：subhead 右侧 ••• 开 `#mdMenu` popover：冻结成员(红,盾勾icon)/复制成员ID/举报成员。冻结从底部静音红字**移进菜单**，底部红字删除。
- **冻结确认改 bottom-sheet + 盾牌**（`#fzSheet`，非 planModal）：粉圆盾牌 icon + 「确认冻结王哥？」+ bullet（下注或使用自动投／申请额度）+「现有额度会保留，您可随时解除冻结。」+ 红「确认冻结」+「取消」。已冻结时同一 sheet 切解冻文案+蓝按钮（`data-mode`）。planModal 的 freeze/unfreeze kind 不再用于此页（仍保留给别处）。
- `mdSetFrozen` 改为只切 chip + 菜单里冻结项文字（底部红字/旧 md-sheet 已不存在）。额度记录（`.md-hist`）保留 V2.1 版未动。

### 成员详情 V2.1 定稿（2026-07-12 · client reference 图，覆盖同日 V2）
基于 client 的 Final UX/UI Revision 参考图。相对 V2 的变更：
- **删「分配额度」按钮**——此页定性为**查看为主**，分配动作移到别处（reference 明确）。额度卡内不再有主 CTA。
- **额度卡只两个数**：剩余额度（19,000 Credit，主，25px；label 用「剩余额度」跟 reference 图一致，配 ⓘ 语义位）+ 累计已分配（260,000，次）。「可回收额度」确认删除（无回收限制，值=剩余额度，重复）。
- **历史整列展示非预览**：标题「申请与审批历史」→「**额度记录**」+「按时间倒序排列」副标；**删「查看全部」**（本页即全部），底部「没有更多记录」；行加 chevron `.mi-cv`；记录标题「上分/下分」→「**额度增加/额度减少**」（reference 用词）。
- **header meta 带小 icon**：⏱最后投注 今天 09:20 / 📅加入 3 个月（mask icon `.mi-clock/.mi-cal`），最后投注在上。
- **冻结确认改 bullet 列表**（`pm-ul`：无法下注/额度保留/可随时解冻 + 成员端提示），红色确认按钮。冻结留底部静音红字单动作。
- **⋯ overflow 菜单：client 说这轮先不做只预留**（未来放 冻结/复制ID/完整投注史/备注，Slack/Stripe 式扩展位）。所以本轮 subhead 右侧留空 `.rt` 占位，冻结暂放底部；将来低频功能多了再收进 ⋯。
- ⚠ 参考图卡片里画了「可回收额度」但图自己的批注写「删除可回收额度」——矛盾，按 spec 文字删。冻结确认参考图是 bottom-sheet+盾牌 icon，本原型复用居中 planModal（不改共享组件），只对齐文案 bullet，盾牌 icon 未加。

### 成员详情 V2 定稿（2026-07-12 · client spec：聚焦管理页，非 profile/分析盘）
o:21 重写。顺序：header → 身份卡 → 额度摘要 → 主操作 → 申请审批历史 → 冻结（次级）。
- **身份卡 `.md-id`**：圆头像 46px + 名字 + 状态 chip（活跃绿/不活跃灰/已冻结红，贴名字旁不竖排）+ 相对信息「加入 3 个月 · 最后投注 今天 09:20」（相对时长非长日期；无投注显示「尚无投注」）。**删掉** V1 里的信用/风险/新成员等标签（out of scope）。
- **额度摘要 `.md-credit`**：主数字「当前额度 19,000 Credit」25px mono 强调 + 次要「累计已分配 260,000」小字。**只用「当前额度」一个 label**（无 T&C/锁定余额，剩余额度=可回收额度，展示两个是假复杂度）；**删掉累计上分/累计下分/累计回收 三等大 KPI**（视觉竞争）。回收上限「最多可回收 X」只在回收流程内出现。
- **主操作**：整宽蓝色「分配额度」按钮贴在额度卡内（`allocask`）。回收未做独立入口（spec：只在流程已存在时才放，不发明限制）。
- **历史**：section header 右侧「查看全部 ›」（不放底部大按钮），预览 3 条，格式沿用 `.txlist`（状态 tag 前置/已拒绝置灰+保留原因/无 filter）。空态 `.md-hist.empty`「暂无申请与审批记录」不留空白卡。
- **冻结 Option B**：历史下方**静音红字**「冻结成员」（非大红实心按钮，spec 禁）。overflow ••• 一度加了又删——spec 说「二选一」，两个都放是冗余。点击走 planModal `freeze`（**文案改 spec 版**：确认冻结X？+ 说明段无下注/额度保留/成员端提示，去掉旧的冻结原因选项）；已冻结时切「解除冻结」蓝字走 `unfreeze` 确认。`mdSetFrozen(bool)` 同步 chip + 文字动作 + 动作色（app.js，含已删 md-sheet 的 null 守卫）。
- planModal 新增 kind `unfreeze`；handlers `pmunfreezedone`。**未加**行为时间线/风险分/统计（V1 out of scope）。

### 抽成设置 V2 定稿（2026-07-12 · client spec，覆盖同日早前的 stepper 版）
> **2026-07-16 V4 当前覆盖口径**：设置与试算彻底分离。主页面只展示抽成方式卡、比例 Preset/自定义、当前设置摘要，以及一行「试算工具」入口；点击「试算」后从底部打开独立 Drawer，Drawer 内输入金额并显示预计抽成，明确标注「仅供参考，不会保存到设置中」。试算金额不属于页面脏状态，也不会进入保存确认，避免被误解为设置项。
o:22 再重写。结构：subhead（back=`rkback` 带脏检查）→ `.rk-notice`「调整说明」banner（下一期生效/不重算/成员不可见/保存需确认，编辑前先看到）→ **单卡三段**：①抽成计算方式（seg2 按成员盈利/按成员**投注**——措辞替换「计算口径」「注额」）②抽成比例（**preset chips** 0.0005/0.0008/0.0010% + 「其它比例」数字输入；选 preset 填入输入框、手改输入自动取消 preset 高亮、值恰等于 preset 时回亮；**stepper 按 spec 禁用移除**，对齐产品既有 金额preset+自定义 模式）③预览计算（测试金额输入 10000，label 随口径切换「测试成员盈利/测试成员投注金额」；`预计抽成` 大字 + 完整算式行「成员盈利 10,000 × 0.0008% = 0.08 Credit」；全程实时无按钮）。
- Footer：**恢复原设置**（`rkreset` 回滚到 `rkSaved` 留在页内）+ **保存修改**（未变更 toast 拦截；有变更走 planModal 居中确认「确认修改抽成设置？」取消/确认保存，确认后 `rkSaved` 更新）。无取消按钮（back 已承担离开）。
- **Back 脏检查**：无改动直接回 owner；有改动弹「尚未保存修改」继续编辑/放弃修改（放弃=回滚+离开）。planModal 新增 kinds `rksave/rkleave`。
- 状态源：`rkSaved={mode,rate}`（app.js 变量），当前值从 DOM 读（`rkState/rkDirty/rkSyncChips/rkRender/rkRestore`）。

### 抽成设置 relayout（2026-07-12 · client feedback：口径与比例要看得出关联）
o:22 重写成**一条公式**：计算口径（seg2 按成员盈利/按成员注额）→ 抽成比例（stepper ±0.0001，`#rkVal` data-v 驱动）→ **实时示例行** `#rkPrev`「示例：单期成员盈利 10,000 → 抽成 0.08」——改口径或比例示例立即重算（`rkRender`），关联靠联动可见而不是靠文案解释。生效规则升级为顶部正式告示 `.rk-notice`（下一期生效/不追溯/成员不可见），一进页先看到。footer「取消」→「**重置**」（`rkreset` 拉回当前生效值留在页内）：back=离开不保存，取消与 back 语义重复所以砍；保存 `rksave` toast。成员 chip 跑位修正：已冻结 chip 移到名字旁（异常贴 title 既定规则），金额列对齐；讨论过是否为标签开中间列——**否**（8 人 1 冻结空置率太高、列是给维度不是给异常）。

### 成员 V2 定稿（2026-07-12 · client spec：发现与导航，管理动作全归成员详情）
o:25 重写。结构固定：header（成员 + 副标题「8 位成员」——总数只在这里，tab 不带计数；spec 示例 82/12 页为示意，按真实 8 人保持与首页断链一致）→ 全宽常驻搜索 → 状态 tab（**全部/活跃/已冻结** 三项，`live`=非冻结含不活跃；禁用「正常」措辞、无「不活跃」tab）+ 同排右侧**排序下拉**（`msPop`：最近投注/最久未投注/余额高低/加入新旧/按名称，单选，`memSort` 排 DOM）→ 列表 → 真分页（`pl-members` data-size=5，1/2 页，翻页/详情往返保留搜索+tab+排序+页码）。
- 行格式：头像 / 名字 / **相对投注时间**（今天投注/昨天投注/3天前投注/7天未投注/30天未投注/尚未投注，`data-bet` 天数驱动文案，列表不出现完整日期）/ 右侧**余额 15px/600**（`.qt2`，无「剩余额度」label）/ chevron。
- **删光**：活跃/不活跃 chip（投注时间已表达活跃度）、待审批红点（收过额度不是待办）、行内统计。**保留**冻结行的「已冻结」chip（spec 只禁活跃类 tag，冻结是可管理性信息）。
- 行数据属性：`data-bet/credit/join/name/st`，排序纯前端重排后回第 1 页。
- 空态文案更新：没有找到符合条件的成员 / 尝试修改搜索内容或筛选条件。

### ⚠ 交易 tag 格式定案（2026-07-12，来回两轮后 client 最终拍板）
- **标题统一用「额度 · 姓名」**（不用上分/下分/额度分配字样）——这条最终**保留**了当天更早的 V1 spec 规则，中途一度改成类型词又被 client 改回来，此为最终状态。钱包侧因是成员自己的记录，无需姓名后缀，就单独显示「额度」。
- **完成态显示 `.stag ok` pill**（这条推翻了同一版 V1 spec「完成不显示 tag」的规则，client 明确要看到）。
- `.stag.ok` 配色**归蓝色系**：`background:var(--tint); color:var(--blue-d);`（中途试过浅紫色被打回——「和主题蓝不同色系」）。
- 首页 section 标题「最近交易」→「**最新交易**」。
- 交易记录页（o:23）去掉 `.cicon` 统一额度圆 icon，`.rtag` 并入 `.stag`（不留两套组件）。
- **时间筛选按钮定宽 104px**（`.dt-trigger`），今天/近7天/本月/自定义日期文字长度不同，按钮不再跟着变宽变窄，超长用省略号截断。
- 三处（首页最新交易/交易记录/钱包）现共用同一套 `.stag pd/ok/no` 组件 + 「额度 · 姓名」标题公式。

### 交易记录 + 成员 V1 定稿（2026-07-12 · client 完整 spec，覆盖此前多项决策）
两页共用组件系统（tab/搜索/列表/分页/空态同语言）。**覆盖的旧决策**：icon 收起式搜索废弃（改常驻输入框）、「已完成」蓝 pill 废弃（完成=默认态无 tag）、「分配」tab 删除、行标题类型词废弃（统一「额度 · 成员名」，方向靠 ±/颜色/tab）、时间筛选 preset 不再走 bottom sheet（改紧凑 popover 即选即生效，sheet 只留给自定义日历）、底部「金额方向说明」删。
- **交易记录**：结构固定 header → 主 tab（全部/上分收入=+/下分支出=−，`data-t` in/out）→ 搜索(左·常驻·带清除)+时间下拉(右·紧凑) → 单一白容器列表 → 分页。时间选项 今天(默认)/近7/近30/本月/上月/自定义；上月走隐藏 wfdate 区间。状态：处理中/已拒绝=浅灰小 `.rtag`（已拒绝整行置灰），完成无 tag；统一 `.cicon` 额度圆 icon（禁上下箭头）；负数黑不用红。tab/搜索/时间任一变化 → `applyWF` 重置第 1 页（`renderPage` 已改为只对未筛除行分页，分页与筛选正式兼容）；空态文案见 `.lst-empty`。
- **成员**：状态 tab（全部/活跃/不活跃/已冻结，灰色 `.tcnt` 计数）+ 全宽常驻搜索（同一 `.psrch` 组件），`mtab`/`applyMem` 过滤；行内禁加统计字段；红点只给真实待办（吴/王/刘/杨）。
- 新 handlers：`dtpop/dtpick/sclr/mtab` + 全局 input 委托（实时过滤）；`txopen` 兼容 `.rtag`。
- ⚠ 首页「最近交易」预览行还是旧文案（上分·王哥 + 已完成 pill），spec 范围只限这两页没动——下轮该对齐「额度 · 名」+去完成 tag。钱包侧同理未动。

### 待审批 V1 定稿（2026-07-12 · client 给完整 spec，覆盖 v3 的部分决策）
按 client 的 V1 production spec 重写 `view-approvals`（o:24）。要点：
- **导航**：右上轻量「交易记录」链接（去掉底部已处理大卡）。
- **余额条压扁**：单行「可分配额度 | 240,000.00」，sticky，充值入口移进不足卡的 guard 行内（`充值 ›`）。
- **双 tab 保持**（上分 3 / 下分 1——spec 示例 50/10 是占位，为与首页「4 待审批」联动改小；首页卡 desc 改「最久已等待 3小时15分」，成员页杨姐补 pend-dot）。
- **等待时长制**：绝对时间全换相对（已等待 45 分钟…）；<1h 灰 / 1-3h 琥珀 `.w-amber` / >3h 红 `.w-red`，只染时间字+小时钟 icon 不染卡；队列按最久优先排序，tab 内顶部 `.apr-sortrow`（按等待时间排序 | 最长已等待 X）。
- **卡片层级**：名字+右上大金额(16 mono) → 类型+等待时长 → 剩余/本月次数/累计 → 拒绝(红描边)/通过(蓝) 50/50。头像 28px 弱化。
- **⚠ 交互改「即批即走」（覆盖旧双确认弹窗决策）**：点 通过/拒绝 → 立即 toast「已通过王哥的上分申请」→ 卡片 fade+collapse ~230ms 移除 → 下一张自动上移，viewport/tab/scroll 不动；tab 计数与 sortrow 实时刷新，清空后显示「全部处理完毕」。新 handler `aprok/aprno`（app.js），旧 `apok/apno`+planModal 流程保留未用。通过仍实时增减 `#apPoolNum`（data-pool）。
- **明确 out-of-scope（client 列的黑名单，别加回来）**：批量操作/信任标签/风险评分/头像 peek/滑动批复/高级筛选/凭证（上轮 mockup 的凭证+新成员标签 client 决定先不做）。

### 待审批 v3 + 成员页 + 交易记录（2026-07-10 三页联动走查后落地）
- **审批按钮回归文字 CTA**（拒绝 ghost 红 / 通过 pri2 蓝，复用 `.apc-btns/.abtn`）——圆形 ✓✕ 误触风险高（相邻 34px 资金操作），文字自标注 + 双确认更稳；圆钮样式 `.apr-btn` CSS 保留未用。
- **审批卡上下文行 `.ctx`**：上分卡「剩余 · 本月上分次数 · 累计」；下分卡「剩余 · 下分后剩」（校验取款不超余额）。
- **拒绝下分必填原因**：卡片 `data-reqr="1"`，`aprejectconfirm` 校验空原因 toast 拦截。
- **已处理不再驻留审批页**：批完原位变灰字状态，队列底部链接「已处理记录在交易记录查看 ›」直达 `ownerwallet`（审计链：审批通过后写入交易记录）。
- **交易记录类型改为 上分/下分/分配**（`data-t` up/down/alloc），去掉「处理中」（进行中的都在待审批页，此页纯已完成/已拒绝）；行加 `txopen` 开详情 drawer（复用钱包 `#txDrawer`）；加 icon 展开搜索。
- **时间筛选新组件 `#dtSheet`**（bottom sheet：preset chips 今日/近7天/本月/全部 + 2026年7月单月日历范围选择，>7 日禁用；参考 Mobiscroll/uxpatterns.dev 的 preset+calendar 同屏模式）。旧 `.wfsel` 下拉转隐藏元件由 sheet 驱动，`.wf-custom` 输入框弃用。`dt*` handlers 在 app.js；applyWF 的 range 逻辑复用隐藏 `.wfdate`。**钱包侧额度记录仍是旧下拉，待同步此组件**。
- **量级全线统一**（千位级，对齐 hero 240,000.00）：成员列表剩余额度（80,000/30,000/…）、成员详情（19,000/260,000/120,000）、交易记录与首页最近交易（±8,000～±80,000）、审批（20,000/300,000/80,000）。
- **成员列表**：按剩余额度降序；有待审批的成员名旁红点 `.pend-dot`（吴/王/刘）；底部一行灰字说明排序与红点含义。成员详情动作只剩 分配额度/冻结。
- 金额高低 filter（找高频用户）讨论过**不加**：属分析需求，控件堆叠不值；后续用成员维度统计/排序解决。
- 开放规则问题（记录待 client 定）：成员被冻结时其挂起申请如何处理（自动拒绝/冻结期挂起？现原型无此状态组合）。

### 管理中心 · 单页纵览改版（2026-07-10 · 推翻旧 3-tab，方向 C）
旧「管理中心」总览/成员管理/设置 3-tab 结构已废弃，改为 `管理中心_Redesign_v1/`（`IA_Flow_提案.md` 方向 C）方案：去 tab，首页单页滚动，待审批与成员列表拆成独立全屏页。改动全部在 `views/admin.js`（重写）+ `shared/app.js`（少量 handler）+ `shared/styles.css`（末尾新增段）。
- **`view-owner`（首页，o:20）**：额度池卡（可分配 240 + 已分配/今日变动 + 内嵌佣金行，沿用既有 `.admin-pool` 样式未改）→ 待办 `.pendbar`（与钱包上分 pending 同一组件，`data-act="show" data-arg="approvals"` 一步直达）→ 成员行（`.frow`，直达成员列表）→ 最近交易预览（点击直达 `ownerwallet`，**不再**误用 `txopen` 打开钱包专属抽屉——旧代码把群主的交易行也接到玩家钱包的 `#txDrawer`，语义不对，已修）→ 设置行（抽成设置）。
- **`view-approvals`（o:24，2026-07-10 v2 重做，client 图1「好友请求」参考）**：只审**上分/下分**（入群申请移除——client 确认不属于这里）；顶部 `.fg-btabs` 双 tab「上分申请/下分申请」+ 红点计数（结果相反：上分扣池、下分返池，分开防批错方向）；卡片 `.apr-card` = 圆头像 + 「名字 申请上分 金额」+ 时间，右侧**圆形 ✓/✕ 按钮**（`.apr-btn.yes/.no`，图1 样式），已处理 = 灰字状态 `.apr-state` + 卡片降透明度；额度不足卡 ✓ 置灰 + `.apr-guard` **通用文案**「可分配额度不足，回收成员未用额度后可继续审批」（不再点名谁谁谁，「回收后批准」按钮已删）；poolbar 重做成 `.apr-pool` 浅蓝双栏（我的额度 240,000.00 蓝 mono / 已分配 1,615,000.00），sticky，`#apPoolNum` 批准后按卡片 `data-pool`（上分负/下分正）实时增减。审批金额已改成与 hero 同量级（20,000/300,000/80,000）。头像圆形化 scoped：`.view-approvals/.view-members/.view-member .av { border-radius:50% }`（图2 参考，只动管理侧三页不动聊天/游戏）。「全部成员↔待审批」互切 tab：client 问过，回答**不做**（任务流 vs 名单两种心智，旧 3-tab 教训）。⚠ 成员列表/成员详情的剩余额度还是旧小量级（190/300），与审批页新量级不一致，mock 数据待统一。
- **`view-members`（新，o:25）**：纯成员名单，搜索改回既有的 icon 展开式 `.srchbox`（与钱包/成员搜索同一组件），状态 filter chips 复用 `.filterbar/.fchip` + `mfilter` handler；新增每行 `.qt` 剩余额度字段。
- **`view-member`（o:21，成员详情）**：字段改「剩余额度/累计分配/累计回收」，冻结/分配/回收改成 `.macts` 内联三按钮（分配/回收目前是占位 toast，未接真实输入流程——`allocask`/`recallask`，原型待补）；申请与审批历史改状态 chip 展示。
- **`view-rake`（o:22）**：新增「口径待确认」提示行，明确标注 0.0008% 疑似笔误但**未擅自改动数值**（IA 提案里的开放问题，待 client 确认）。
- **`view-ownerwallet`（o:23）**：filter 新增「佣金入账」；行去掉误接的 `txopen`（不再打开玩家钱包抽屉），改为纯展示行。
- **未做/已知缺口**：分配额度/回收额度的真实输入与二次确认流程未实现（IA 提案「开放问题 2/4」——额度不足能否部分批准、回收规则都待 client 拍板，先用占位 toast）；`.admin-quick-grid/.admin-quick-card` 旧 CSS 未清理（不再被引用，留着无副作用）。

### 自动投 · 策略中心 v0.8（2026-07-09 · 本轮重构，client 图一/图二方向）
整个「自动投」tab 按 client 提供的参考稿（`IM168 Old/IM168 Alex Version/ref.html` 的 abv6 策略中心 + 图一 5 步向导 + 图二业务规则）**复刻流程/IA/交互**，视觉沿用本项目设计系统（未抄 ref 配色）。代码：`views/game-autos.js`（骨架 #stgScroll/#stgSheet/#stgReport）+ `shared/app.js` 末尾独立 IIFE（只处理 `stg*` data-act）+ `shared/styles.css` 末尾 `stg-*` 样式段。

#### 2026-07-20 · 聊天室内容与执行动态筛选定稿
- **聊天室顶部是「搜索＋更多」组合**，不显示重复群名，也不用 emoji/异体系图标。搜索栏只搜索当前「幸运组 · 游戏厅」的公开群聊内容，placeholder 为 **「搜索群聊内容」**；搜索页可按消息正文、成员昵称、期数与策略名称匹配，不再混入成员目录。
- **群聊详情入口**：搜索栏右侧使用平台线性 `•••` 更多按钮，进入独立「群聊详情」页。详情包含群头像/名称/成员数/群主、群描述、成员预览与查看全部，以及消息通知、查找群聊内容、举报群聊、退出群聊；成员资料与设置不再占用搜索结果页。
- **群聊内容边界（2026-07-20 最新）**：聊天室不展示系统开奖结果卡、不展示公开投注项/跟单卡，也不展示底部长龙快捷 Section；消息流只保留成员讨论、实时策略分享与必要系统状态。底部输入框 placeholder 固定为 **「发送群消息」**。人物、期号、时间和策略状态必须前后一致，不能为了填满画面堆无关联消息。
- **官方模板预览去重**：策略卡已经显示「8,423 人用过」时，详情不再重复；详情内部取消孤立的「策略概览」标题，画像条与下方「策略设置」直接形成上下层级。
- **执行动态筛选**：本节已由上方「执行动态 Filter 合并（2026-07-20 最新）」完整覆盖；旧 `Total / Win / Loss` 固定统计与「投注执行 / 开奖结果 / 策略状态」系统分类均已废弃。

- **IA**：无策略 = 策略模板落地页（模板卡·盈利%·人数·标签 + 玩法说明 + ＋新建）；有策略 = 策略中心（我的策略横滑卡 + 执行动态 feed → 点行开执行报告）。点策略卡 = 详情抽屉（急停/继续/删除/保存修改/进入完整编辑）。底部 `/` 指令面板保留，快捷键改为直接执行（新建/报告/编辑/急停/说明）。
- **新建 = 5 步 bottom-sheet 向导**：玩法（名称·两面/定位·玩法多选）→ 触发条件（跟投/反投·长龙≥min≤max）→ 执行方式（每注·回合·固定投/倍投+尾数倍投，含爆仓查询双向同步）→ 风控（**单项**止盈止损·暂停/恢复·继续/重置·持续监测/只执行一次）→ 确认（规则摘要 + 风险预估 + 保存策略/保存并启动）。
- **⚠ 口径变更（覆盖 2026-07-03 Plan A）**：「自动投无回合数」决策已被 client 本轮方向推翻——**「买几回合 M」回归**：触发后固定执行 M 回合，长龙中断/中途输赢不提前停，仅止盈止损截停（图二）。
- **业务规则（图二，已在 UI 文案落实）**：系统扫描全部名次×已选玩法，任一投注项长龙落入 [最低S,最高S] 即触发、**可多项并发**；止盈止损**按投注项独立核算**；倍投前段按倍投倍数、最后「尾数回合数量」改用尾数倍率。术语定稿：跟投/反投（弃 追龙/斩龙）。
- **本轮设计修正（已实现）**：① 风险预估按「单项投入(取止损封顶) × 理论并发项上限」给出最坏敞口（旧稿只算 1 个玩法，严重低估）；② 止盈止损字段明确标注「单项」；③ 「触发后执行满 M 回合不提前停」在执行方式步与玩法说明双处露出；④ 删除与玩法多选重复的「排除玩法」字段；⑤ 新增「完成后：持续监测/只执行一次」选择（默认持续监测）。
- **待 client 确认**：① 「跳过回合」未进向导（图一没有；旧编辑页仍有该字段），是否要以「高级设置」折叠回归；② 模板卡「盈利 34%/41%」为 mock 社交证明，真实数据口径与合规话术待定；③ 策略级总止损（在单项止损之上再兜底）建议增加，未实现。
- **旧版去留**：旧 L1 仪表盘 + L2 计划助手已从 view-autos 移除（完整旧版在 `backup/index-presplit-2026-07-09.html`）；`view-formula`（整页编辑）与 `view-templates` 暂留代码但**无入口**；`view-plans`（全部计划）保留，「打开/＋新建」已改接策略中心（stgopen/stgnew）；`#bustModal` 爆仓查询继续服务向导第 3 步；首次引导 `#obDrawer`、`#planModal`（急停/删除居中确认）、`#dashToast` 均复用。app.js 里旧 dashPlans/renderDash 代码保留但因 `#dashbody` 不存在而全部惰性（安全，可后续清理）。
- **已浏览器实测**（2026-07-09，无 console 错误）：模板卡预填、5 步来回、两面/定位与固定投/倍投条件字段、风险计算（固定 10×10=单项100×10项=1,000 中风险；倍投 2×/尾1.5×=5,830 → 止损封顶 300×20项=6,000 高风险）、保存并启动→策略中心卡+动态、报告→编辑、急停（居中确认）→已急停→继续/删除、全部计划改接、投注/聊天室回归正常。

### 查爆仓 Tab v1（2026-07-11 · 新增第 4 个游戏厅 Tab，client 多轮走查定稿）
游戏厅 Tab 由 3 个增至 **4 个**：投注 / 自动投 / 聊天室 / **查爆仓**。完整产品口径、信息架构、交互规范、被否决方案与实现落点见独立文档 **`爆仓.md`**（体例同 `自动投_功能理解.md`）。此处仅记交接要点：
- **定位**：帮玩家决定自动投策略的数据决策工具，「结论优先、证据按需展开」。基于历史开奖倍投回测，仅适用倍投。
- **流程**：填三项条件（模式 / 方向 / 区间）→ 立即查询 → 结果页（吸顶时间筛选 + 分析报告三问三答 + 爆仓趋势 + 回合分布 + 风险排行）。候选回合数已取消，建议回合数由系统自动得出。
- **三条出口**：保存查询 / 行内快投（复用 `streak-drawer`）/ 生成跟投·反投策略（drawer 预填 → 确认启动 or 调整设置进 5 步向导）。
- **代码**：`views/game-bust.js`（骨架 #bqFormScr/#bqResScr/#bqGen/#bustGuide）+ `shared/app.js` 末尾独立 IIFE（只处理 `bq*` data-act）+ `shared/styles.css` 末尾 `bq-*` 样式段 + `index.html` chrome `data-mainviews` 追加 `bust` 及 Tab/script。与主模块零冲突。
- **复用**：Tab 切换/roundbar 隐藏走既有 showView；快投经隐藏 proxy 触发主模块 streakpick；「调整设置」触发 stgnew；首次引导口径同 obDrawer。
- **⚠ Tab 内不显示开奖历史**（roundbar 自动隐藏）；向导内旧 `#bustModal` 未改动，暂保留，将来视觉并入本规范。
- **已浏览器实测**（2026-07-11，无 console 错误）：引导 / 跟投⇄反投切换（长龙⇄单跳标签，反投不出现「长龙」）/ 查询 / 今日·3天·7天切换 / 分布 / 快投带入（冠军大→反投小）/ 生成策略 / 调整设置进向导 / 保存查询；投注 roundbar、Tab 高亮、自动投引导、旧 #bustModal 均回归正常。

### 已完成并确认
- `index.html` 是共享的唯一原型文件；本轮只更新本 Handoff，不复制或另建 V3 HTML。
- 群主管理入口已从频道/聊天列表彻底移除，固定在 `view-channel` 的 header 右上角，显示为 **「管理」+ 红色 badge 5**。不要改回皇冠：皇冠容易被理解成 VIP/身份标识，不像管理工具。
- User Wallet 已重构成严格的 **2-section 信息架构**：
  1. **Wallet Dashboard**：可用 Credit、待确认申请、申请 Credit、申请提款、累计 Credit 入账、累计提款。
  2. **Transaction History**：首页最多 5 条，`See more` 进入完整资金记录页。
- Wallet 不显示投注历史、游戏盈亏、自动投占用金额或待开注单金额。投注行为继续留在注单/自动投页面。
- 提款流程已具备金额页、快捷金额、¥100–¥240 mock 校验、居中确认 popup、成功 toast，以及向预览/完整资金记录插入「处理中」记录的 prototype 逻辑。
- 群主审批已具备通过/拒绝居中确认、拒绝原因可选且成员可见、完成后卡片原位状态替换。

### V3 Wallet 当前视觉与文案
- 顶部深色余额卡显示 `可用 Credit / ¥240.00`。
- 余额卡内的 2 个 CTA 等宽横排：绿色主按钮 `↓ 申请 Credit`，深色次按钮 `↑ 申请提款`；icon 与文字必须保持同一行。
- 余额卡不放 setting/menu 四点，也不显示「仅显示可申请与可提取余额」说明。
- 待确认状态融合进余额卡：`处理中 · 申请 ¥300 / 等待群主确认 ›`，点击进入申请记录。
- 两张累计卡属于同一个 Wallet Dashboard：金色 `累计 Credit 入账 ¥1,300`；绿色 `累计提款 ¥600`。
- Transaction History 是独立白色容器，预览固定最多 5 条，只包含 Credit 入账与提款（成功/退回/处理中）。
- 游戏厅 chrome 的 Wallet pill 已同步为 `¥240`。

### 最近验收结果
- 浏览器实测：Wallet 只有 `.wallet-dashboard` 与 `.wallet-history` 两个顶层信息区；四点、旧说明、外置待确认条均不存在。
- 两个 Wallet CTA 实测为横向排列、各约 148px；Transaction 预览为 5 条。
- 群主管理入口存在于频道 header；频道列表中没有 `data-arg="owner"` 的管理行。
- 提款确认 popup 实测可打开；浏览器 console 无错误。

## V2 规格整合摘要
- 产品结构：私域 IM + 游戏厅；游戏厅固定为「投注 / 自动投 / 聊天室」三 tab。
- 角色与资金：成员 Wallet 只看 Credit 与提款资金流；审批、佣金、分配与差额只在群主侧出现。
- 投注：PK10/SSC 切换、两面与号码盘、长龙快投、注单确认均在同一手机原型内。
- 自动投：L1 计划仪表盘 + L2 助手详情；计划只以止盈、止损或手动急停结束，不设置总期数上限。
- 群主侧：总览、成员、设置；成员工作流包含待审批、搜索、全部成员、成员详情与冻结。
- Overlay：下注/启动采用 bottom sheet；审批、急停、删除、冻结等短决策采用居中 popup。
- 设计系统：蓝 `#126BFF`、红 `#EF3939`、绿 `#1FA971`、金 `#C08C38` 均有明确语义，不合并为单色系统。

## What this is
IM168 = private chat app for lottery communities (replaces WeChat/Telegram, **not** in app stores). Phase B embeds betting. The special group is **游戏厅** (renamed from "Bet Room"). Client saw earlier prototypes; v0.2 (2026-06-29) **merged** the two earlier options (betting-UI vs command-only) into ONE product.

## Design system (confirmed by client)
- Primary blue `#126BFF`, alert/red `#EF3939`, win green `#1FA971`, gold `#C08C38`. These 4 are **functional** (win=green, loss=red, money=gold) — keep all four; do NOT collapse to one accent.
- Font Noto Sans SC (Chinese, required). **JetBrains Mono** loaded for numerals only — odds/money/counts/timers/balls use a tabular-mono treatment (`--mono`) so data columns align; Chinese never renders in mono. Clean light theme. **Avoid AI-generated look.**
- (Earlier sessions wrongly used navy `#253F71`/pink `#F75979` — do NOT.)
- A stitch-design-taste pass was applied selectively (mono numerals, tactile `:active` press, accent focus rings, one live-dot pulse, eased view-entrance). The skill's reskin rules (1-accent, ban-Noto/force-Geist, asymmetric layouts, no-emoji) were **deliberately rejected** as incompatible with this confirmed system.
- Figma source: `https://www.figma.com/design/PJRscSiZbaAadxEMHhEmT1/IM168-APP` (file key `PJRscSiZbaAadxEMHhEmT1`).

## Canonical files (in this folder)
- **`index.html`** — the prototype shell. OPEN THIS. Since 2026-07-09 the views live in `views/*.js` and all logic in `shared/app.js` (see 「文件结构」 above).
- **`shared/styles.css`** — ALL styling (the former inline `<style>` block was appended here 2026-07-09; cascade order unchanged).
- **`shared/app.js`** — ALL JS (former bottom inline `<script>`; event-delegation by `data-act`; injects `views/*.js` fragments into `.body` at boot).
- `IM168_PhaseB_Brief.md` / `.docx` — requirements brief v0.2.
- **`.claude/launch.json`** — preview server on port 4178. `node` is not on PATH and the sandboxed preview process cannot read this Google Drive folder, so it now runs `/bin/sh -c "cd <scratchpad>/im168srv && python3 -m http.server 4178"`. Workflow: copy `index.html` + `shared/` + `views/` to the scratchpad `im168srv/` dir, `preview_start name=im168`, re-copy after each edit before reloading. (`.claude/serve.js` is the old node server, kept for environments that have node.)
- **Retired / safe to delete** (superseded): `variant-A/`, `variant-B/`, `IM168_GameHall_*.html`, `IM168_BetRoom_*.html`, `IM168_BetRoom_Draft/Selection.html`.

## Architecture (how the prototype works)
- One phone mock. Screens are `<div class="view view-NAME">`; only `.view.on` is shown.
- `index.html` 底部 inline script 有一个 document click listener；elements carry `data-act="ACTION"` + `data-arg="VALUE"`.
  - Actions: `show`(→view), `game`(pk/ssc/soon), `gameshow`(set game + show bet), `menu`(cmd menu), `put`(insert command text), `clear`(clear bet selection), `plan`(switch 自动投 plan sub-tab), `follow`(跟单 → mark "已跟单"), `newauto`(new plan, hides running monitor via `.creating`), `detailauto`(open existing plan).
  - Generic toggles (no data-act): `.opt/.nb`(select→updateTotal), `.amtchip`(bet amount), `.pb`(play-type), `.ri`(legacy rail), `.seg2 div`, `.toggle`.
- **Chrome header** (`.ghead.chrome`, `data-mainviews="bet autos chat"`) shows only on those 3 tabs; hidden elsewhere. Order: gtop (circular back · **game-name title** `.gtitle` · wallet pill · ⋯) → roundbar (line1 `本期089 封盘[00:48]`, line2 `上期088 + balls`) → tabs.
  - **Title = current game name** (`.gname` swapped by `.phone[data-game]`: pk→`PK10`, ssc→`时时彩`), with `▾` caret; tapping `.gtitle` opens 全部游戏 lobby (`data-arg=lobby`). **幸运组** (channel) sits muted beside it. The old standalone `PK10▾` switcher in the roundbar was removed (title owns it now).
  - **Wallet pill** (`.bal`, `data-arg=wallet`): wallet SVG icon + `¥240` (the word "余额" was removed). Shows across all 3 tabs.
  - **Balls** = rounded squares (`.bb`, single row, nowrap). Status bar uses real signal/wifi/battery SVGs. Subtle radial glow on `.ghead`. Tabs have a short centered underline.

## 游戏厅 = 4 tabs（2026-07-11 起，原 3 tabs + 查爆仓）
1. **投注** — manual bet. Horizontal play-type bar (`两面/1-10名/冠亚和` PK10; `两面/定位胆/龙虎/总和/跨度` SSC; **快捷/长龙/遗漏 removed**). Options = label-forward, muted grey odds. **Selected state = light-blue tint + inset blue ring + blue text + corner ✓** (deliberately NOT solid-blue — solid blue is reserved for controls/CTA, so multiple selections don't read as buttons; `.opt.sel`/`.nb.sel`). On-demand slip with manual amount + quick chips + **分享下注** toggle. Game switch via game-name title→全部游戏 lobby.
2. **自动投** — **⚠ 本段已被 v0.8 策略中心取代（见上方「自动投 · 策略中心 v0.8」），以下为旧版记录仅供追溯。** two-level, dashboard-first (v0.3, 2026-07-02, client-approved). **L1 = 计划仪表盘** (`.autodash`, JS-rendered from `dashPlans[]` state): toolbar (我的计划 + running count/合计 + grid⇄list toggle + blue ＋新建) → grouped cards 运行中/已结束 → folded 「更多官方模板›」row (→view-templates). Card skeleton (identical for all states): dot+name+P&L → badge (gold 🔥连中N期 / green ✓已完成 / grey 止损·急停) → params line → progress bar+占用 → footer. **Toggle = 急停 only, only on running cards** (off = instant stop + undo toast; restart goes through 启动确认 sheet `#startModal` with budget-transparency rows). 分享 = one-tap button (posts play-only betmsg into 聊天室, toast, NO amounts, NO commission concept — client removed it). Ended cards: completed → 分享/再来一次/调整; loss-stopped → 调整参数/删除 only (deliberate: no re-run CTA after a loss). **First-entry flow (empty state v5, client-approved 2026-07-02)**: no 我的计划 title/＋, no icons (client: avoid AI-generated look). Typographic hero (subtitle in TWO lines: 「追长龙不用手点，定好规则后逐期自动下注，」/「实时追踪，随时急停。」) → FLAT 3-step explainer (numbered circles, benefit copy: 挑个打法·龙来了不错过 / 设好底线·止盈止损你说了算 / 交给计划·不盯盘也不漏一期; affordance rule: borders/white bg reserved for clickables, explainer stays flat) → single reccard 「小本试水」 with live-streak chip (🔥现在正有龙·冠军大已连开4期), params WITHOUT 期数 (自动投 has no round-count setting — client), safety line, social proof row (avatars + 128人用过·本周36人在用; hide if real count <20) + EQUAL-WIDTH button pair 自定义计划(ghost→customauto) / 试用这个计划(primary→startModal). Input placeholder in empty state: 「不会设？对助手说「帮我建个计划」」. Then start-confirm sheet → first running card gets a one-time coachmark. RESOLVED (Plan A, client-confirmed 2026-07-03): 自动投 has NO round-count setting product-wide — plans end ONLY by 止盈/止损/手动急停. Implemented everywhere: row cards + view-plans + search show 「已投 N 期」 (no denominator); view-formula 「重复轮次」 row DELETED; template descriptions dropped 「· N 期」; L2 planbars de-denominated; 「再加5期/还剩几期」 commands replaced (今天盈亏 / 距止盈多远); demo 小本试水 done-state re-based to 止盈+¥100达成 (pnl +102, demo 累计盈亏 now +¥252). Game-round numbering (第089期, 每期¥10) is unaffected — only the plan-level round cap was removed. **L2 = plan detail** (`.plandetail`, the original 投注助手 agent chat panels p1/p2, unchanged) reached by tapping a card; back bar `‹ 计划列表` returns to dashboard. `view-plans` (全部计划) is preserved and reachable via ⋯更多; `#planModal` moved to screen level (shared by view-plans + dashboard deletes). `新建`→view-formula unchanged. **Initial state = EMPTY** (`dashPlans=[]`, client direction 2026-07-02): the tab opens on the first-entry empty state. A **temporary `.demofab` "DEMO" floating button** (bottom-right, above the streak bar) toggles the 4-plan layout demo (`DEMO_PLANS`) for client preview — saves/restores the real state on enter/exit. Delete `.demofab` + `DEMO_PLANS` + the `dashdemo` handler before any real build. **Polish pass (v0.7, 2026-07-03, client-finalized)**: grid⇄list toggle REMOVED (list is the only form; `dashview`/`dashGridCard`/svg icons deleted); filter chips compacted (「★ N」, tighter padding — full bar fits 348px with sort); scrollbars hidden globally (`.dashscroll/.scroll/.scroll2/.tplsheet-list`); empty-state spacing tightened (hero 14px top) and a hero illustration `<img class="eart" src="shared/plan-hero.png">` added — asset DELIVERED 2026-07-03: `shared/plan-hero.png` 431×279, shown at 132px (`onerror` fallback hides it if the file is ever missing); 「更多官方模板」recrow removed from dashboard (templates reachable via ＋→`#tplModal` and view-formula→模板); templates RENAMED 斩龙稳健→反投策略, 跟龙激进→跟投策略 (user template 我的斩龙改→我的反投改), buttons 应用→试用, and each official template row (both `#tplModal` and `view-templates`) got a social-proof `.rusers` row (128/86/42 人用过 gradient; hide if real count <20).
3. **聊天室** — group chat (tab label is 聊天室; view is still `view-chat`). **Message-only (NO commands here — commands live in 自动投).** Shared bets show a **跟单** button; following only announces "已跟单" — **never shows amount**. Results are personal-only ("你 中奖…").
4. **查爆仓** — 数据决策工具（2026-07-11 新增；`view-bust`）。填三项条件→查询→结果（分析报告三问三答 + 爆仓趋势 + 回合分布 + 风险排行）。三条出口：保存查询 / 行内快投（复用 streak-drawer）/ 生成跟投·反投策略。**Tab 内不显示 roundbar（开奖历史）**。完整规范见 `爆仓.md`，交接要点见上方「查爆仓 Tab v1」。

## Money / roles（V3 current）
- **Player-facing Wallet 已在 V3 改为 Credit + 资金流模型：** `view-wallet` 显示可用 Credit `¥240.00`、申请 Credit、申请提款、待确认状态、累计入账/提款与最多 5 条资金记录。它不再是简单 relabel-only 版本。
- `view-request` 是 **申请 Credit** 的金额任务页；现实业务为用户私下付款，App 内只提交 Credit 申请，再由群主核对与审批。
- `view-withdraw` 是提款金额任务页，提交前必须经过居中确认 popup；`view-walletflow` 是完整 Transaction Record。
- Wallet 资金记录只显示 Credit 入账与提款，不显示投注、中奖、自动投预算或待开注单。
- Underlying model is unchanged behind the scenes: 额度 member **申请** → 群主 **审批**(view-approve), surfaced only on the **owner** side. NOT direct assign.
- **No Backoffice**: 抽成 set & shown **in-app, 群主 only** (view-rake).
- **群主面板** (`view-owner`) 从频道 header 右上角固定「管理」+ 红点进入，不参与聊天/群组列表排序。结构为总览、成员、设置；成员注单显示 **剩余 not 已花**。
- **Members never see** 抽成 / 分配 / 差额 anywhere.
- ⋯ menu (view-more): 搜索 / 我的战绩 / 钱包 / 群主面板. Search hidden in ⋯ per client.
- Rounds: **089 = current/betting, 088 = last drawn** (kept consistent across screens).

## Important caveats
- **Rendering is now possible** via the bundled preview server (see Canonical files) — verify visually with `preview_start name=im168`. The odds-grid renders fine (`.orow` flex rows confirmed in-browser).
- **Title relabels with the game** (pk↔ssc) — that part is now dynamic. But the round bar's **本期089 / 上期088 / balls / 封盘00:48 are still static** — switching games does NOT update them (real build must bind round/result/countdown to live game data). Title swap is CSS-only via `data-game`.
- Plan agent chats、Credit 申请、steppers/seg、下注确认与资金变动仍以 prototype mock 为主；群主审批与提款已有前端交互，但均未接后端持久化。Header/Wallet 的 `¥240` 不会随下注、申请或提款真正重算。

## 群主面板 V2.1 已确认并实装（2026-07-06）

### 固定入口
- 删除频道列表中的「管理 / 群主面板」行。
- 最终改为频道 header 右上角固定 **「管理」+ 红点**；`＋` 保留为 IM 层拉人入口。皇冠方案已淘汰，因为更像 VIP/身份而非管理操作。

### 总览
- 淡金 hero 是唯一情绪焦点：今日佣金使用 34px 金色等宽数字，趋势与金币动画只发生在 hero。
- 其他模块降噪；收支记录只显示 3 条。
- 待办采用单行红色状态条：`5 件申请待处理 · 最早 09:48 ›`，点击进入成员 tab。
- 不显示「仅你可见」，右上角暂留白，不为了填位新增功能。
- 删除邀请成员功能：拉人属于频道 header 的 IM `＋`。

### 成员与审批
- 主 tab 为等宽撑满：「总览｜成员 ⑤｜设置」。
- 成员内层只保留两段：「待审批 ⑤｜全部成员」；搜索位于 segmented 下方，两段都可搜。
- 已处理记录收进待审批底部的折叠链接；历史记录以「谁 + 金额」为主体，状态仅用小 chip。
- 全部成员显示 8 人列表；会员状态只在这里与成员详情中出现。
- 审批卡只有 `拒绝｜通过`，不允许调整申请金额。真实语义是成员已付款，Agent 只核对到账与否。
- 通过、拒绝都必须二次确认。通过文案明确「到账后立即可用」；拒绝原因可选、对成员可见，并提示更多详情联系 Agent。
- 完成审批后原卡原位显示 `✓ 已通过` 或 `已拒绝`，不跳转。

### 通知策略
- 同时保留总览待办状态条与成员 tab 红点：状态条回答「现在有什么要处理」，红点回答「去哪里处理」，职责不同。
- 总览不重复显示 5 行申请预览，继续遵守「总览负责看，成员 tab 负责做」。
- **待办状态条需按类型拆分数字**（2026-07-06 补充确认）：入群申请与额度申请合并计入同一个总数，但状态条文案要写出构成，例如 `7 件待处理 · 额度申请 5 · 入群申请 2`，不能只写总数。成员 tab 红点数字 = 两者相加后的总数（示例中为 7），与状态条总数保持一致。
- 入群申请与额度申请在「成员 › 待审批」内以两个小节呈现（先「入群申请」后「额度申请」），共用同一套 拒绝｜通过 二次确认交互；入群申请卡片展示邀请人与申请时间，不展示金额相关字段。

### 入口样式已核对（2026-07-06 复核）
- 实际打开 `index.html` 核对：`view-channel` 的 `.subhead` 右侧是 `.channel-actions`，内含 `.owner-entry`（文案「管理」+ `.badge` 红点 5）与 `.channel-plus`（IM 拉人 ＋）。列表内没有 `👑 群主面板` 行，`agentitem` 仅残留在 CSS 注释里，没有对应的可渲染标签。
- 结论：入口just 是方案 A（header 右上角「管理」+ 红点），与本文件「固定入口」一节一致，之前记录的冲突不成立，已消除疑虑。

## Open questions (client to confirm — brief §7)
1. 投注助手 = real AI agent or command parser? (drives 自动投 effort)
2. Max concurrent auto-plans per member + cumulative credit cap?
3. 抽成 口径 (注额/盈利/赔率差) & who can change it in-app?
4. 额度审批 limits / rejection flow?
5. 跟单 stake rule (fixed / %/ manual)?
6. Post-BO: where do odds come from; 抽成 vs platform odds?
7. "群主只看剩余不看已花" vs 代投 needing每笔 — display口径?
8. Account打通 (SSO/import) + distribution method (not in stores)?
9. Compliance/legal for 代投 / 抽成 / cross-platform funds.
10. 提款真实规则：可提余额口径、收款账户来源、人工/自动审核、手续费、到账时效与失败退回原因。
11. Wallet 的 `可用 Credit` 是否应扣除自动投/待开注单占用？V3 UI 明确不展示占用明细，但后台余额计算口径仍待产品确认。

## Likely next tasks
- 将 Wallet/Credit/提款/群主审批接入统一状态模型；当前数字与记录为 mock，页面间不会完整联动或持久化。
- 确认提款业务规则与可用 Credit 的计算口径，再补 loading、失败、余额不足、重复提交和无记录状态。
- Make steppers/segments/inputs interactive; wire plan state.
- Build the onboarding/registration flow (4.1, not yet designed).
- Bind round bar + result to live game/round; SSC result variant.
- Decide 投注助手 scope, then build the parser/agent properly.
