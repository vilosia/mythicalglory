# IM168 运营侧 Design System / UX Guideline（2026-07-12 v1）

> 目的：Wallet / Operator Dashboard / Pending Approval / Member List / Member Detail / Transaction History / Commission Settings 已全部定稿，本文件固化统一规范。**做任何新页面先读这里**，直接复用既有 class，不要另造样式。基准 = Figma Phase 2（file `PJRscSiZbaAadxEMHhEmT1`）。

---

## 1. 颜色 tokens（`shared/styles.css` `:root`）
| token | 值 | 用途 |
|---|---|---|
| `--blue` | #126BFF | 主色 / CTA / 链接 / 强调数字 |
| `--blue-d` | #0B52CC | 深蓝（tag 文字 / hover） |
| `--tint` | #E7F0FF | 浅蓝 chip 选中底 |
| hero 卡背景 | #fff 白 | hero 卡统一白底（钱包/管理中心，2026-07-12 由蓝 tint 改白）；蓝 tint #EAF2FF 只留给待审批 poolbar |
| `--red` | #EF3939 | 危险 / 拒绝 / 冻结 / 待办红点。**普通负数不用红** |
| `--win` | #1FA971 | 投注赢；金额入账绿用 **#16A34A**（交易类 listing） |
| `--ink` | #1B2330 | 主文字 |
| `--muted` #8A93A6 / #9CA3AF | 次要文字 / 日期 / 占位 |
| #5E7BA6 | 蓝 tint 卡内次要字 |
| `--line` #ECEFF4 / #F0F1F3 | 分隔线 |
| 灰 icon 统一 | #788192 | 齿轮/眼睛/复制/chevron 等功能 icon |

金额方向色：**入账/返还 = 绿 #16A34A；支出/负数 = 黑 `--ink`；已拒绝 = 整行灰 #9CA3AF**。红只留给错误/危险动作。

## 2. 字体 / 字重
- 中文 Noto Sans SC；数字/金额/时间用 `--mono`（JetBrains Mono）+ `font-variant-numeric:tabular-nums`。
- 字号 ramp：**10 / 12 / 14 / 18**（meta=10、次要=12、行标题/section=14、页标题=18）。大数字 display：hero 金额 25-28、统计数 17-20。
- 字重：行标题/section = **500**；描述/meta = 400 灰；金额数字 = 600；display 大数 = 700。**行标题别超 600**。

## 3. 时间表达（全局唯一规则）
- **绝对时间戳** = `2026/07/07 14:32`（零补位斜杠）。用于：交易记录、额度记录、pending、申请记录。
- **相对"等待时长"** = `已等待 23 分钟 / 1小时20分 / 3小时15分`。**只属于待审批（approval）工作流**，别处禁用。
- 待审批等待色：<1h 灰 / 1–3h 琥珀 #9A6C00 / >3h 红。
- 成员列表活跃度用相对词（今天投注/3天前投注/尚无投注）——这是活跃度语义，非时间戳。

## 4. 卡片 / 布局
- 白卡：`background:#fff; border-radius:12px;`（内容卡）。列表白卡用 `.blist`（1px border 或无边框靠灰底分离，二选一统一）。
- hero 卡：蓝 tint #EAF2FF + `border-radius:12px` + `padding` 上下都要留（别只留上）。
- 页面底色 `--page` #F5F7FA；卡间距 gap 10–14px。
- 弹层：低风险/选择 = bottom sheet（`.cf-sheet`/`.tpl-modal`）；金额/危险二次确认 = 居中 `planModal`；破坏性大动作（冻结）= bottom sheet + 盾牌（`.fz-sheet`）。

## 5. 状态标签 `.stag`（listing 行内，tag 前置于标题）
- `.stag.pd` 处理中 = 实心蓝白字；`.stag.ok` 已完成 = 浅蓝底 `--tint`/`--blue-d`；`.stag.no` 已拒绝 = 浅灰底灰字。
- **stag 前置小 icon 保留**：处理中=圆+i、已完成=圆+勾、已拒绝=圆+叉（`.stag::before` mask，跟随文字色）。（2026-07-12：曾误删，已恢复。此前删的是钱包额度记录行左侧那个大 `◎` 占位圈 `.credlist .q::before`，那个才该删。）
- 完成态**要显示** tag（client 定）。已拒绝 = 整行 `.rej` 置灰。
- 成员状态 chip `.stchip`：活跃 ok 绿 / 不活跃 idle 灰 / 已冻结 fz 红；贴名字旁，异常才显（正常态也显活跃是可接受的当前约定）。

## 6. CTA
- 主 = 实心蓝 `.cta`；次 = 描边 `.ghost`；危险确认 = 实心红 `.cta.danger`（只在最终确认按钮）。
- 一排两 CTA 等宽 50/50。
- 破坏性动作（冻结/删除）不给主 CTA 视觉权重——放次级位（编辑页管理区/底部安静文字）。

## 7. 列表行（交易/额度记录统一 `.txlist`）
- 结构：`[stag 状态] 标题(14/500) / 日期(10 灰)` 左；金额(14/600) 右。
- 标题公式：交易/额度类 = 「额度 · 成员名」或「额度增加/额度减少」；游戏盈利 = 「PK10 · 游戏盈利」。
- 分隔线行间；首行顶、末行底无线。
- **预览 vs 完整**：首页/详情给最新预览（5 条）+ 右上「查看全部 ›」→ 完整页（带时间筛选 + 分页）。

## 8. Section 标题 + 查看全部
- `.md-sec` / `.admin-sec-title`：标题 14/500 深色；右侧「查看全部 ›」12/400 蓝（`.admin-sec-more`）。
- **查看全部永远在 section 标题右侧，不在列表底部**。

## 9. 搜索（`.psrch`）
- 常驻全宽输入框，内嵌放大镜 + 清除 ×，即输即筛。**不用 icon 收起式**、不做独立搜索模式。
- 交易记录：搜索左 ~68% + 时间筛选右并存。

## 10. 时间筛选（`.dt-trigger` + `.dt-pop`）
- 紧凑触发器 `按钮文字 ▾`（定宽 104px）→ 点开 popover 即选即生效，无应用键。
- 预设：今天 / 最近 7 天 / 本月 / 自定义日期（自定义才开日历 sheet）。**preset 不走 bottom drawer**。
- 选项按页裁剪，别堆一长条。

## 11. 分页（`.pager`）
- 移动端 `‹  1 / N  ›`；首页禁 prev、末页禁 next（`.dis`）。
- tab/搜索/筛选任一变化 → 回第 1 页。翻页/返回详情保留 tab+搜索+筛选+页码。
- **禁用**：桌面数字分页 / 页码跳转 / 每页数量选择器 / 无限滚动。

## 12. Info / 待办条
- pending/待办用白卡 + `.stag` tag + chevron，整卡可点（弃旧琥珀条）。
- 待审批任务卡 `.apr-card`：圆头像 + 名字+金额 + 等待时长 + 拒绝(红描边)/通过(蓝) 文字 CTA + 即批即走（fade-collapse 230ms auto-next）。

## 13. 头像
- 圆形 `border-radius:50%`（管理侧成员相关页）；首字母 + 柔和底色。

---

## 13.5 统一性大修定案（2026-07-13 · client 标注图逐色执行）
- **字眼**：产品内一律「**额度**」，禁 Credit/余额/金额指代余额（当前余额→当前额度；0.08 Credit→0.08 额度）。
- **紫·上下分措辞**：记录行标题统一 **上分/下分**（群主侧带姓名「上分 · 王哥」，成员侧不带「上分」）；申请流程用「申请上分/申请下分」；游戏行「游戏盈利 · PK10 / 12 注」。交易记录 tabs 简化为 全部/上分/下分（去收入/支出后缀，方向靠 ± 表达）。「额度 · 姓名」公式废弃。
- **橘·换字**：钱包 stats →「今日盈亏 | 今日未结」单行灰底条（移到 CTA 上方）；成员详情 → 最后投注时间 / 游戏加入时间。
- **灰·UX**：钱包上分/下分 CTA **同级**（都描边 secondary，无主次）；申请金额加「清空」；待审批**删排序行**、可分配额度改 header 右上钱包 chip（`#apPoolNum` 保留实时扣减）、ctx **去累计**（防 100 单时太占位）；管理中心齿轮移 header 右上、抽成行改纯三列展示（今日/累计/比例，不可点，设置走齿轮）；抽成设置「预览计算」→「模拟计算·仅供预览不会保存」（消除"输入会被存"误解）。
- **红·时间**：全部 `2026/07/07 14:32`；成员列表活跃度保留相对词（语义不同）。

## 13.6 统一性二修（2026-07-13 · client 逐条纠正）
- 钱包 hero 顺序定稿：金额 → 上分/下分 CTA → 盈亏行（fg-comm 式 border-top 两列，同管理中心）。CTA = **灰底 secondary pill**（#EEF1F6/#3D4A63，同级无主次）。「清空」是按钮样式参考不是功能——已移除申请页清空。
- 「查看全部」全线：蓝色、**无 › 箭头**、右对齐（`.md-sec .admin-sec-more{margin-left:auto}`）。
- **时间筛选全产品统一一套**：今天(默认)/最近 7 天/本月/自定义日期，popover 即选即生效；`#dtSheet` 日历改**通用组件**（`data-list` 指定目标：pl-owner-tx / pl-wallet-flow / pl-member-hist）。「全部时间」选项废弃。
- **自定义日历规格**（2026-07-13 定稿）：标题行 `« ‹ 2026年7月▾ › »`——« » 切年、‹ › 切月；**点标题「2026年7月▾」开年月快选面板**（‹ 年 › + 12 月 grid，未来月置灰，点月直达）；超过当前月（mock 基准 2026-07）clamp 且前进钮置灰；格子 JS 动态生成；日期 ISO 存储支持跨月/跨年范围。**`#dtSheet` 必须是独立 screen 级 block（o:28），不能嵌在任何 view 内**——嵌在 view 里其他页面打开时会随父 view 隐藏（已踩坑：额度记录/成员详情曾弹不出日历）。交易记录/钱包额度记录/成员详情共用同一实例。
- **等待时长制废弃**（连待审批也不用了，覆盖 §3 旧规）：待审批卡 = 「{玩家名} 申请上分/下分」+ 绝对时间戳灰字；首页待审批 desc = 最早申请时间戳。w-amber/w-red 不再使用。
- 成员列表活跃度改绝对：「2026/07/07 09:20 开始投注」（相对词废弃）；「尚无投注」保留。
- 管理中心 hero：**去 refresh icon 和自动跳动**，改**下拉刷新**（touch 下拉 >70px 或点金额，余额+最新交易一次更新——额度与交易关联，必须同帧更新，异步跳数字会造成对不上）；齿轮移「我的额度」label 右侧。
- 游戏盈利行 desc 只留日期（注数删）。
- section 标题与列表 padding 统一 `margin-bottom:10px`。

## 13.7 统一性三修（2026-07-13）
- **dt-trigger 全局规则**：定宽 104px，文字**左**、▾ **右**（`justify-content:space-between; padding:7px 12px`），不居中。
- 管理中心 header：`‹ 管理中心 幸运组▾ ……… ⚙`（幸运组贴标题，齿轮右端=抽成设置入口）。
- 待审批卡：r1 = 头像 + 名字 + **申请上分/下分**（12px 灰）+ 右侧金额；r2 只剩时间戳。
- 不足 guard：`ⓘ 可分配额度不足`（info icon 前置，充值链接删——充值走平台外，页内不给入口）。
- 成员详情额度记录：措辞统一**上分/下分**（额度增加/减少废弃），行**无 chevron**，padding 同 txlist 标准。
- 举报成员：确认走 bottom sheet（`#rpSheet`，红圈 ⓘ + 说明 + 红确认/取消），与冻结同一 sheet 语言。

## 13.8 统一性四修（2026-07-13）
- **金额全线 2 位小数**：所有额度金额（listing/审批/成员余额/确认页/drawer/动态插入行）统一 `X,XXX.00`。例外：注数/笔数/次数/百分比/测试输入框。JS 动态生成处 `toLocaleString()+'.00'`。
- **Sheet/Drawer CTA 规则**：双按钮 = 左右一排等宽（取消 ghost 左 + 主动作右，同 apConfirm）；单按钮 = 居中同尺寸（48% 宽，`.fz-btns.solo`）。冻结/举报确认竖排改横排，**确认冻结/确认举报 = 红 CTA**。
- 钱包盈亏行 `.uw-comm` 去 padding-bottom；「查看全部」强制蓝 12px。

## 13.9 统一性五修（2026-07-13 · 四色标注）
- ~~Drawer 顶部把手线~~ **已反转（六修）：所有 drawer 一律无把手线**（`.cf-sheet::before` 删除、`.fz-handle` display:none）。新 sheet 不要加把手。
- **危险确认 CTA（橙）**：`.cta.danger` **全局**红底白字（此前只在 `.pm-btns` 作用域生效，导致冻结/举报 sheet 里显示成蓝——已修）。确认冻结/确认举报/确认拒绝类终点按钮一律红。
- **主 Tab 样式（紫）**：所有页面一级 tab 统一 `fg-btabs`（蓝字+下划线）：交易记录/待审批/成员/**投注历史（未结/已结）**。胶囊式 btab 只留给次级筛选。
- **钱包余额 chip（绿）**：header 右上余额 chip 全产品统一 = **灰底 #F1F4F9 + 金色字 --gold + 金额 2 位小数**（`.bal` 游戏厅/投注历史、`.apr-balchip` 待审批）。金=钱的既有语义。

## 13.10 统一性六修（2026-07-13）
- **Drawer 无把手线**（反转五修）：全部 sheet 顶部干净无灰条。
- **交易详情 drawer**：右上 ✕ 删除，底部全宽蓝「关闭」CTA（`.txd-close`）。
- **「投注历史」→「历史投注」**全局改名（页面标题+入口文案）。钱包盈亏行行尾 › 恢复（旧 absolute 定位把它飞出视野——`.uw-comm .uws-cv` 改 static+margin-left:auto，蓝色示意可点）。
- **预览/完整列表同步规则**：动态插入行必须两边同帧插**首位**（曾有 preview 插第 2 位的残留逻辑导致顺序错开断链）。
- **dt-pop/dtp/dtym 选项字色统一 `#1b2330`**，选中态 `--blue-d`。

## 13.11 统一性七修（2026-07-13）
- **Header 全局统一**（图1 subhead 基准）：白底、‹ back、标题 **17px/600**。`.subhead`/`.fg-head` 都对齐；申请上/下分页的大号 amount-page__header 废弃换 subhead。
- **申请上/下分页精简**：删「记录」入口、删「申请金额（额度）」label、删「遇到付款问题？联系代理」；金额在 header 与快捷金额之间**垂直居中**（`.amount-entry{margin:auto 0}`），presets+键盘+CTA 贴底。
- **申请确认 drawer**：标题「确认申请上分」→「**上分申请确认**」（下分同构）；金额下方「额度」单位字删除。

## 13.12 List Page Template 定稿（2026-07-13 · client spec）
**列表页固定结构**：Header → 主 Tabs → **Utility Row** → 列表 → 分页。搜索禁止放 tabs 上方、排序禁止混进 tabs 行。
**Utility Row 双槽组件**（`.ctl-row` min-height 44 / gap 12）：左槽 = 搜索（有用时）或 **动态计数「共 N 笔记录」**（搜索无意义时，如用户自己的记录）；右槽 = 排序 或 时间筛选（dt-trigger 定宽）。禁止为对称硬塞控件、禁止「全部记录」类填空文案、禁止左槽留白。
- 成员页：tabs 全部/活跃/**不活跃**/已冻结（4 tab 回归）；Utility = 搜索 + 排序（选项精简 4：最近投注/额度从高到低/额度从低到高/加入时间）。无时间筛选。
- 交易记录：tabs 全部/**上分/下分**（⚠ 字眼三改：上分/下分 → 上分收入/下分支出 → 2026-07-14 定稿回「上分/下分」，勿再加后缀）；Utility = 搜索 + 时间。
- 钱包额度记录：tabs 全部/上分/下分/游戏盈利；**无搜索**（自己的记录）；Utility = 「共 N 笔记录」动态计数（随 tab+时间联动，applyWF 自动更新 `.util-cnt`）+ 时间。
**时间筛选选项定稿 4 项**：今天(默认)/最近 7 天/本月/自定义日期。（⚠ 2026-07-13 曾加「最近 30 天/上月」成 6 项，2026-07-14 client 反转删除——勿再加回。三处 popover：dtPop/uwPop/mhPop 同步。）
原则：一致性 = 用户总知道去哪找搜索/排序/时间，≠ 每页塞同样控件。

## 13.13 统一性八修（2026-07-13）
- **金额输入实时格式化**：申请上/下分输入框（含数字键盘/快捷chip/最高/手打）实时显示 `X,XXX.00`（千分位+2 小数）；解析用 `parseAmt`（先剥 `.00` 再剥非数字——直接 strip 全部非数字会把 1,000.00 读成 100000，勿用旧 cleanNumber）。
- **「共 N 笔记录」真动态**：进入额度记录/交易记录页时初跑 applyWF（showView hook），计数随 tab+时间实时同步。
- **交易详情 drawer 结构定稿**：hero 只留大金额；`类型`（上分/下分）与`状态`（stag pill，同 listing 图1 样式）降入 ac-rows 第 1/2 行；旧 stch 状态样式弃用。
- **成员详情额度记录加类型 tabs**（图2 layout）：胶囊 chips 全部/上分/下分（左）+ 时间下拉（右）同一 Utility Row；与时间/自定义范围组合过滤（`mhType()`）。

## 13.14 统一性九修（2026-07-14）
- **钱包双 pend 条**：`.uw-pend { margin-bottom:2px }`——两条相邻近贴无 padding；`.view-wallet .md-sec { margin-top:12px }` 保住与下节距离。
- **三页 tabs/utility 紧凑**：`.fg-btabs`、`.ctl-row` margin-bottom 归 0（!important，全局：成员/交易记录/额度记录同吃）。
- **时间筛选回 4 项**（见 13.12 修订）。
- **自定义日历打开流程**（⚠ 2026-07-14 二次修订）：初版两段式（先年月面板）当天即被 client 反转——**定稿 = 打开直接日历态，默认选中今天**（DT_BASE 单日 start=end，格子高亮，footer label 显今天日期）；年月快选面板改为点标题「2026年7月▾」（dtymtoggle）进入，选完月回日历态。入口统一走 `dtOpenSheet(targetListId)`（app.js），三处 popover 不再各自拼开启逻辑。标题 `#dtYm` 样式：flex:1 占满 dt-cal-h 中间 + 灰底 #F1F4F9 圆角 9px（示可点击），与 dt-nav 箭头同色系。

## 13.15 十修（2026-07-14）
- **成员详情额度记录**：`.view-member .md-sec`、`.view-member .ctl-row` margin-bottom 归 0，tabs/utility 紧贴列表。
- **日历年月面板年行**：`.dt-ym-yr` 改 `justify-content:space-between; padding:0 4px`——‹ › 箭头（dt-nav 同款）拉到两端占满 sheet 宽度，对齐 dt-cal-h。
- **待审批卡重排（定稿，参考 client 图）**：删 `typ2` 独立元素与 `apr-r2` 独立时间行；结构改「头像左（40px）+ 右侧两行列 `.apr-who`（上行粗体『杨姐申请上分』15px / 下行时间 12px 灰）+ 金额右端」。审批 handler 不受影响（读 data-nm/data-typ）。

## 13.16 上下分申请全链路联动（2026-07-14 · bug fix）
> 浏览器实测全链路通过（Chrome 自动化：提交后首页 4→5 / apup 出卡 / 通过后回落+钱包解锁+stag 已完成）。「没收到申请」实为浏览器缓存旧 app.js——index.html 所有 css/js 引用已加 `?v=YYYYMMDDx` 版本参数（11 处），**以后每次改 shared/views 同步预览时 bump 版本号**，用户普通刷新即拿新文件。
用户 apsubmit 后群主侧原本无感知（各页 mock 独立）——现打通单机 demo 闭环：
- **提交**：apsubmit 注入 apr-card 到待审批对应 panel（apup/apdown，删 apr-empty），玩家名固定 mock「王志明」（蓝 av），时间 2026/07/07 14:32，data-pool 上分=-金额/下分=+金额；tab cnt +1；管理中心「待审批」计数 `#apHomeCnt` +1（apHomeBump，0 时隐红点）。
- **审批**：aprok/aprno 移卡后 apHomeBump(-1)（拒绝同样消数）；若卡是王志明（用户自己）→ 解锁对应 uwPend 方向 + uwSync（钱包 CTA 恢复、pend 条消失），钱包预览与额度记录里该笔「处理中」stag 改「已完成」(ok) 或「已拒绝」(no)。

## 13.17 抽成设置改版（2026-07-14）
- **调整说明 banner 删除**：页面顶部不再常驻；三条说明（下一期生效/历史不重算/成员不可见）移入「保存修改」确认 drawer（pm-ul 列表）。「保存时需要再次确认」一条随场景消灭（drawer 本身即确认）。
- **抽成计算方式**：seg2 分段控件换 `.rk-ftabs`（fchip sub-tab，两枚各 flex:1 均分整行、文字居中），与列表页筛选 chip 同语言。JS 兼容不变（#rkSeg .on / data-arg）。
- **模拟计算区独立卡 `.rk-sim`**：移出主设置卡，浅蓝底 #EAF2FF 圆角 12（与原调整说明同色系），标题行「模拟计算 + 仅供预览，不会保存」，公式行白 60% 半透明底——视觉与底部保存 CTA 解耦，明确「这块不参与保存」。

## 13.18 待审批/钱包联动补全 + 抽成设置二修（2026-07-14）
**待审批/联动**（浏览器实测全绿）：
- 列表排序定稿：**最新申请永远在最上**（mock 卡反转 + apsubmit 注入 insertBefore firstChild）。
- 通过王志明（用户）申请后：用户钱包 `#uwAmt`、顶部 chrome `.bal` chip、申请页余额行同步增减（上分+/下分−）；apnext 余额校验改读 `#uwAmt` 真值（原硬码 240000）。
- 首次上分通过 = 入群：成员 roster 插「王志明·尚未投注」行 + 首页成员计数 `#memHomeCnt` +1（幂等：roster 已有王志明不重复插）。
- 管理中心下拉刷新升级**全页数据**：余额 + 最新交易 + 今日抽成/抽成累计（`#rkToday`/`#rkTotal`）同帧更新，toast「页面已刷新」。
**抽成设置**：
- rk-lab 定稿 12px 主黑（sub 说明 11px 灰）；方式 sub-tab（.rk-ftabs .fchip）圆角矩形 10px 同 rkp。
- presets 第 4 枚「**其它**」chip：点击才展开 rk-custom 输入行（default 隐藏）并 focus；输入非 preset 值自动高亮「其它」。
- **preset MRU**：确认保存自定义比例后写回 presets——新值置第一位，旧值顺移，末位挤出（rkPresetMRU）；管理中心首页「抽成比例」`#rkRateShow` 同步。
- 保存 CTA 状态机：default `.dim`（opacity .3）＝无改动；rkDirty 时亮起；保存/恢复后回灰（rkCtaSync 挂全部改动入口）。
- stake 模式测试输入 label 定稿「预计额度」。

## 13.19 管理中心 header 对齐 + 模拟计算回收（2026-07-14）
- **fg-head 标题定稿 = 游戏厅 gtitle 同款**：19px/700 + `.tcaret ▾`（muted 12px）+「幸运组」12px 灰（覆盖此前 17/600 统一——fg-head 仅管理中心用，其余页 subhead 维持 17/600）。
- **模拟计算 = 独立蓝底卡 rk-sim（⚠ 当天两反转，此为定稿）**：#EAF2FF 圆角 12 独立 box；result 行「抽成比例」数值 13px/600 右对齐（去大字、去「额度」）；input 值右对齐；公式行定稿（再修订）：**纯数字居中**「10,000 × 0.0008% = **0.08** 预计抽成额度」——答案加粗主黑、尾缀「预计抽成额度」11px 灰 regular（em）；result 行值带 %（0.08%）15px/700，input 值同 15px/700 白底无边框圆角 12。stake 模式测试 label =「预计额度」。
- rk-ftabs 补 `flex:1 1 0; min-width:0`——两枚恒一行均分、文字居中。

## 13.20 模拟计算终版 + o:23 抢救（2026-07-14）
- **模拟输入 label**：win =「成员盈利」/ stake =「成员投注」（「测试」「预计额度」字眼全废）。
- **公式条 redesign（rk-explain 定稿）**：蓝卡内白底圆角条、居中 flex baseline——`10,000 × 0.0008% =`（12px 灰）+ **结果数字 19px/700 主题蓝 mono** + 「预计抽成额度」11px 灰。结果 = 视觉焦点。
- ⚠ **Drive 吞块升级**：o:23（交易记录 view）整块被同步吞掉、且预览副本被覆盖——靠运行中 Chrome 页面 DOM 抢救回写（fetch POST 到本地接收器）。教训：**编辑 views 前先 `grep -c 'h:\`'` 核对 block 数**（admin.js=8 / wallet.js=8），数字不对立即停手从预览服务器或运行页面找回。

## 13.21 禁用态/次级钮全局统一（2026-07-14）
- **禁用态（grayout）全线定稿 = 主题蓝底白字 + opacity .3**：保存修改 `.cta.dim`、待审批通过 `.abtn.pri2.dis`（原灰底灰字废）、钱包锁定 CTA、drawer `.pm-btns/.cf-btns .cta.dis`（原 .4/.45 归一 .3）、分页钮 `.pgbtn.dis`。
- **次级钮（ghost）定稿**：白底 + 1px var(--line) 边框 + 灰字 #5a6480（恢复原设置为准，全 drawer ghost 同款）。
- `.rk-sim .rk-explain` 改 `align-items:center`（公式条大小字垂直居中）。
- ⚠ Drive 回滚再犯：o:23 补回后又被吞一次，靠预览服务器副本拷回。已建立灾备：每轮结束 `cp -r views shared index.html DESIGN_SYSTEM.md → scratchpad/im168-backup/`。

## 13.22 抽成设置 · client 截图对版定稿（2026-07-14）
- Header「抽成设置」19px/700（scoped view-rake，覆盖 subhead 17/600）。
- 区块 label 13px/500 主黑；「抽成比例 **(%)**」带百分号后缀。
- 方式 sub-tab 与 preset chip 统一版式：**未选 = 白底 + 1px var(--line) 边框灰字；选中 = tint 蓝底 + BBD4FF 边 + 主题蓝 600**；padding 13px 0（高 ~44px）、radius 12。
- preset 数字**不带 %**（0.0005 / 0.0008 / 0.0010 / 其它），MRU 回写同步无 %。
- 模拟计算卡标题 14px/700 主题蓝；公式条 15px/600 黑算式 + 20px/700 蓝结果 + 12px 灰尾注，padding 15px、radius 12、垂直居中。
- footer 两钮 flex:1 等宽（scoped view-rake）。
- 浏览器截图对版通过。

## 13.23 确认 drawer 统一模板（2026-07-14 · client 截图定稿）
适用：冻结成员 / 举报成员 / 修改抽成设置（原 planModal 居中 pop 废弃，改 bottom drawer）。
**模板（fz-sheet 系）**：无把手线、无 icon、无二级标题——`fz-title` 18px/700 左对齐「动作 - 对象名」（如「冻结成员 - 王哥」）→ `fz-body` 13px 左对齐（引导句 + disc bullet + 收尾句）→ `fz-btns` 双钮 50/50（ghost 取消 + 动作钮：危险红 / 常规蓝，文字用短动词「冻结/举报/保存」，不带「确认」前缀）。panel padding 22/20/20，钮 padding 15px 0。
- 抽成保存确认 = `#rkSheet`（内容三条 bullet），rksave 打开、rkconfirm/rkclose 关闭。
- freezeask 动态：冻结成员 - 王哥 / 解除冻结 - 王哥，钮「冻结」（红）/「解除」（蓝）。
- ⚠ Drive 又吞 o:23（第 3 次）——从 im168-backup 提块回插。规则重申：**每次编辑 views/admin.js 前 grep block 数 = 8，不对先从灾备恢复再动手**。

## 13.24 List 全线新版（2026-07-14 · client 截图定稿 · 五处统一）
**新 List 模板**（管理中心交易记录 section 为基准）：
- 行：`.bi` 内 `.q`（左：可选 `.dtag` 类型 chip + 主体名 + `.txtm` 相对时间）+ `.r`（右：金额 mono，正数 .win 绿/负数黑 + `.txst` 状态：pd 处理中蓝 / no 已拒绝灰+整行 .rej 减淡；已完成不显示状态）。
- 行属性：data-t 方向 / data-days 距今天数 / data-st ok|pd|no / **data-time 绝对时间**（列表显示相对、txDrawer 详情显示绝对）。
- **时间格式定稿：列表一律相对**——今天 HH:MM / 昨天 HH:MM / MM-DD HH:MM（绝对 2026/07/07 只留 drawer 详情与 data-time）。
- **时间筛选定稿 5 项**：**今天（默认，2026-07-15 反转回）** / 最近 7 天 / 最近 30 天 / 全部时间 / 自定义日期（「本月」「上月」废；此前 4 项版作废）。
- **分页废弃 → 「查看更多（+N）」**递增载入（otx 6/批，钱包 6/批，成员详情 5/批；筛选变化重置回首批）。通用实现 lmState+renderLM+data-act="lmore"。
**应用五处**：① 钱包首页「最新额度记录」section 内联全套（4 类型 chip + 时间 + 载入更多；o:13 独立额度记录页与 walletPreview 预览废弃合一，「查看全部」删）② 管理中心待审批卡 desc「今天 09:12」③ 成员列表 mrow「今天 09:20 开始投注」④ 成员详情额度记录全套（stag 前缀移右列 txst）⑤ 待审批 apr-wait 相对化。动态注入（apsubmit/withdrawconfirm/ownerRefresh/aprok）全部输出新格式。
⚠ **协作警告**：本日发现 Drive 云端存在并行编辑方（管理中心 section 内联即其产出）——本地写入会被云端版本覆盖。工作流已改为：预览目录（scratchpad im168srv）为权威工作区，完成后单向推回 Drive；两边编辑前先 diff。

## 13.25 List 细节对版 + 成员详情资料区（2026-07-14）
- **额度记录行（钱包 + 成员详情）统一交易记录 layout**：容器必须 `blist txlist tx-quiet tx-tag`（缺 tx-tag 时 dtag 会掉行、txst 无圆点样式——已踩坑）；行 = dtag 类型 chip［上分/下分/游戏盈利］+ 主体字：**上分/下分 → 「额度」，游戏盈利 · PK10 → 「PK10」**；已拒绝 = 圆点灰 txst + 整行减淡（拒绝原因留在时间行）。动态注入行（申请/提款）同格式。
- **成员列表投注时间格式定稿**：今天/昨天 HH:MM 投注 → N 天前投注（2~30 天，不带时刻）→ 超过 30 天未投注 → 尚无投注（「开始投注」「尚未投注」字眼废）。
- **管理中心待审批卡 desc**：「今天 08:56」（最新一笔申请时间；「最早 …」字样废）。
- **成员详情资料区（md-cr-rows）**：border-top 删；三行 label+值全部 12px/400 #9CA3AF（fin 加粗特例废）；「最后投注时间」→「**最新投注时间**」；日期分隔符统一连字符 2026-07-05。

## 13.26 交易详情 drawer 对版 + 成员活跃度（2026-07-14）
- **txDrawer 字段定稿**：灰底 hero（#F5F7FA 圆角 12，仅金额）→ 类型（dtag chip 上分/下分/游戏盈利）→ **对象**（额度 / PK10 / 成员名）→ 状态（已完成 = 普通文字；处理中/已拒绝 = **列表同款 ● 圆点+色**，txst pd 蓝 / no 灰）→ 时间（连字符 2026-07-05 13:00）→ 交易编号 → 处理方 → 备注；**右列值统一 12.5px/400 主黑常规字体**（mono/600 与编号缩小 inline 全废，tabular-nums 保对齐）（**已拒绝时显示拒绝原因**，行上带 data-note；无则通用文案）。
- **拒绝原因收进 drawer**：列表 txtm 不再拼「· 原因：xxx」，行加 data-note。
- txopen 时间 fallback 修正：无 data-time 时取 .txtm（原 querySelector('span') 会抓到 dtag——已踩坑）。
- **成员活跃度定稿**：超过 14 天未投注 = 不活跃（data-st="idle"，含尚无投注）；成员列表默认序 = 最近投注升序（今天…昨天…3 天前…22 天前…超过 30 天…尚无）。
- 钱包列表尾部 crop 修复：.view-wallet .scroll2 padding-bottom 28。

## 13.27 字体规则（2026-07-14 · 抽成设置字怪根因）
- **中文字重只能用 400 / 500 / 700**——index.html 只载入 Noto Sans SC 这三档，写 600 浏览器合成假粗体（渲染发虚发怪）。抽成设置 chips/CTA 曾用 600 即此症状，已全改 500。
- **数字一律 var(--mono)**（preset 比例、金额输入、模拟结果、公式）——与管理中心金额同族，杜绝 Noto 数字与 mono 数字混排。

## 13.28 交易详情 / 申请确认 drawer 对版定稿（2026-07-14 · client 图）
- 两 drawer 标题行统一：标题左 + `.cf-x` ✕ 右（muted，点击关闭）。
- **交易详情**：对象为成员时带 ID——「王哥 (ID 88213)」（NID map 在 txopen，mock 十人）；其余（额度/PK10）不带。
- **申请确认（apConfirm）**：白底大绿金额 hero → 灰卡三行［当前可用额度（真值，读 #uwAmt）/ 申请额度 / **分隔线** / 通过后可用额度（蓝 mono）］→ 白底两行［申请时间（连字符绝对）/ 申请编号 + ⧉ 复制］→ 取消 + 确认提交横排。「申请金额」字眼改「**申请额度**」。

## 13.29 钱包 pend 卡改版 + scroll2 根因修复（2026-07-15）
- **pend 卡改用列表行样式**：与「最新额度记录」同语言——左 dtag(上分/下分)+标题「额度申请」+时间；右 金额(mono)+状态「待审核」(蓝圆点，非「处理中」)。删「等待群主确认」冗字；卡片 cursor:default（非可点击项）。
- **眼睛 icon 金色**：.uw-hero .cap .fg-eye 旧规则 specificity（3 层）压过后加的 2 层金色规则——同 specificity 下用同选择器覆盖修正，非「颜色没生效」而是「被更具体的旧规则吃掉」，改动前务必用 DevTools computed 而非只看源码判断生效值。
- **PK10 游戏盈利行**：标题加「(共10注)」，时间从纯日期补全为「今天 14:32」等完整时间戳，与其他行一致。
- 重大 bug 修复：.scroll2 内容超高时不滚动，而是被压扁——根因是 .scroll2{display:flex;flex-direction:column} 的直接子项默认 flex-shrink:1 + min-height:auto，当子项总高度超过容器固定高度（flex:1 撑出的定高）时，浏览器会按比例收缩所有子项以塞进容器，而不是让内容溢出触发 overflow:auto 滚动——视觉上像「加了新卡片后页面就死了不能滚」。修复：.scroll2 > * { flex-shrink:0; } 全局规则，强制子项保持自然高度、超出部分正常滚动。此规则应视为所有 .scroll2 容器的必备 baseline，以后新增任何直接子块都自动受益、无需逐个补 flex-shrink。

## 13.30 管理中心/成员页七修（2026-07-15）
- **fg-comm 描述字号统一**：.fg-comm .g span（今日抽成/抽成累计/抽成比例 label）10px→12px，对齐钱包 .uw-comm .uws2 label 字号（12px），管理中心与钱包 hero 描述行视觉统一。
- **成员详情去举报**：群主不需要举报自己管理的成员——删「举报成员」frow2 行 + rpSheet drawer + mdreport/rpclose/rpdone 三个 handler。管理动作仅剩「复制成员 ID / 冻结成员」。
- **抽成比例 info icon**：蓝色 dashboard 「抽成比例」label 旁加 .rk-info（13px 圆点 i，纯 CSS hover tooltip，无 JS），文案「抽成比例是按成员投注计算」——静态文案，若日后抽成模式支持成员切换需改为动态。
- **抽成设置默认值反转**：方式 tab 顺序换成「按成员投注」在前，且默认选中 stake（原「按成员盈利」default）。rkSaved 初始态同步改 mode:'stake'。
- **管理中心交易记录 preview 加到 10 条**：OTX_BATCH 6→10（首屏与每次「查看更多」批次一致）。
- **成员列表**：① 去掉右侧金额列（qt2，字段含义不明确，data-credit 属性保留供排序用）；② 分页器废弃，改「查看更多」load-more（memMore，批次 5），复用 lmState/renderLM 机制。
- ⚠ **renderLM 通用化 bug 修复**：该函数原硬编码只认 `.bi` class 作为行标记（服务钱包/成员详情两处 `.bi` 列表），成员列表行是 `.mrow`——直接套用导致 matched 永远算 0，「查看更多」按钮文案/显示状态计算错误（尽管点击后仍等价于揭示全部，因为 rest 计算在别处兜底）。改成同时认 `.bi` 或 `.mrow`。另外补上 `if(v==='members'){applyMem();}` 视图钩子确保每次进入成员页都重新计算一次批次状态，不依赖历史交互残留。

## 13.31 info icon 对版 + 群组导航改版（2026-07-15）
- **rk-info 定稿（client 图）**：圆圈描边 ? （14px，蓝 hero 上白 65% 描边/85% ? 字），点击 toggle（data-act=rkinfo）+ hover 双通道；tooltip 白底黑字白卡（阴影），**向下弹 + 右对齐 right:-6px**——原「向上弹 + 左右居中」在 hero 右列会被 screen 右缘裁切。
- **其他比例行改上下排**：#rkCustomRow flex-direction:column，label 上、input 全宽在下。
- **侧栏（drawer）群组行加 ⋮**（.dw-dots，data-act=grpmenu，demo toast）——事件委托 closest 先命中 ⋮ 不会误触行跳转。
- **「最近」横条加入群组 tabs**：siterow = ☰ + 最近 + 幸运组 + VIP 大厅 + 极速专区（data-act=sgrp 互斥高亮，横向可滚 scrollbar 隐藏）。
- **管理入口最终位（⚠ 侧栏方案当天被否）**：侧栏不行——每个组有自己的管理，入口必须组内。定稿 = **组内群组列表置顶卡「群主管理面板」**（公告之上）：左蓝竖条置顶指示 + 方形灰底「管」av + 蓝色「置顶」小标 + 蓝粗标题 + 副行「仅群主可见 · N 件待处理」+ 红 badge。计数与待审批全联动（apHomeBump 同步 #pinApCnt/#pinApTxt，实测申请后 4→5）。列表上方加「频道内群组」分区标题。

## 14. 组件库（新页面用「组合」不要「重设计」）
> 做新页面的正确写法：**Build the page by composing existing components**，不是 "Design a X page"。以下组件已定稿，直接复用其视觉语言。

| # | 组件 | class / 位置 | 规格 |
|---|---|---|---|
| 1 | **Wallet Hero / 额度汇总** | `.fg-hero`(白底12圆角) + `.big`(mono 蓝 25-28) + `.fg-eye` + `.uw-btns`(两 CTA) + `.uw-stats`(双列 icon+标签+ⓘ+值) | 大数字为视觉锚点；白底；分隔线 #F0F1F3 |
| 2 | **Amount Input / 金额输入** | `.ap-flow`：`.ap-amt`(白卡 label+`.ap-heroin` 蓝 mono+当前余额) → `.ap-qa-lab` → `.apchips`(3列快捷金额, 选中=实心蓝, 含「最高」`apmax`) → `.npad`(数字键盘) → footer `.ap-ft`(CTA 全宽 + 联系代理在下) | 一条连续输入流，金额=锚点；键盘紧贴快捷金额；次要信息(联系代理)永远在 CTA 之下 |
| 3 | **Pending Card / 待处理条** | `.uw-pend` 白卡 + `.stag pd` + 文案 + chevron | 整卡可点；弃旧琥珀条 |
| 4 | **Record List / 记录列表** | `.blist.txlist` + `.bi`(`.q` [stag]标题/日期 + `.r` 金额) | 见 §7；预览5条+查看全部→完整页 |
| 5 | **Search + Filter** | `.psrch`(常驻全宽) + `.filterbar/.fchip` 或 `.fg-btabs` | 见 §9 |
| 6 | **Time Filter** | `.dt-trigger` + `.dt-pop` popover | 见 §10，定宽 104 |
| 7 | **Status Badge** | `.stag pd/ok/no`（listing 内，带小 icon）; `.stchip`（成员状态） | 见 §5 |
| 8 | **Member Card / 成员行** | `.mrow`（头像圆+名+相对活跃+右余额+chevron） | 见成员列表 V2 |
| 9 | **Section Header** | `.md-sec`/`.admin-sec-title` + 右 `.admin-sec-more`「查看全部 ›」 | 见 §8 |
| 10 | **确认弹层** | 居中 `planModal`（金额/危险）; bottom `.fz-sheet`+盾牌（冻结） | 见 §4 |

新页面示例写法：「申请下分页 = Wallet Hero 数字样式 + Amount Input 组件 + 复用 CTA/divider/typography」——不要「设计一个下分页」。

## ⚠ 协作 / 文件风险
- **无 git**（client 要求 Google Drive 协作）。HANDOFF.md 与 shared/styles.css 的 append 已被同步**吞过 ≥4 次**。下位 agent 编辑前务必 grep 复核上轮改动是否还在，尤其 `shared/app.js` 末尾 handler 和 `shared/styles.css` 末尾 append。
- 视图内容在 `views/*.js`（模板字符串，**禁反引号/`${}`**）；逻辑在 `shared/app.js`（data-act 事件委托）；样式在 `shared/styles.css`。
- 预览：拷 index.html+shared+views 到 scratchpad `im168srv/`，`python3 -m http.server 4178`。
