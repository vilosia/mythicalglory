# IM168 · 游戏厅 v0.2（合并原型）— Design Specification

A comprehensive rebuild spec extracted from the HTML/CSS/JS prototype `index.html` (2467 lines) and its shared stylesheet `shared/styles.css`. Written so a designer/developer can reconstruct the UI pixel-for-pixel in another tool (Figma, React Native, Flutter, etc.) without reading the original code.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design Tokens](#2-design-tokens)
3. [Global Chrome (Status Bar, Header, Round Bar)](#3-global-chrome)
4. [Screen-by-Screen Breakdown](#4-screen-by-screen-breakdown)
   - 4.1 [首页 / 消息 (Home / Inbox)](#41-首页--消息-home--inbox)
   - 4.2 [频道 (Channel)](#42-频道-channel)
   - 4.3 [投注 (Betting Board)](#43-投注-betting-board)
   - 4.4 [自动投 · 计划仪表盘 L1 (Autodash)](#44-自动投--计划仪表盘-l1-autodash)
   - 4.5 [自动投 · 计划详情 L2 (Plandetail)](#45-自动投--计划详情-l2-plandetail)
   - 4.6 [聊天室 (Chat)](#46-聊天室-chat)
   - 4.7 [更多 (More)](#47-更多-more)
   - 4.8 [搜索 (Search / Chat Search)](#48-搜索-search--chat-search)
   - 4.9 [投注历史 (Bet History)](#49-投注历史-bet-history)
   - 4.10 [钱包 (Wallet)](#410-钱包-wallet)
   - 4.11 [流水 (Wallet Flow)](#411-流水-wallet-flow)
   - 4.12 [申请额度 / 申请记录 (Credit Request)](#412-申请额度--申请记录-credit-request)
   - 4.13 [群主面板 (Owner / Agent Panel)](#413-群主面板-owner--agent-panel)
   - 4.14 [成员详情 (Member Detail)](#414-成员详情-member-detail)
   - 4.15 [成员注单 (Member Orders)](#415-成员注单-member-orders)
   - 4.16 [抽成设置 (Rake Settings)](#416-抽成设置-rake-settings)
   - 4.17 [群主钱包 (Owner Wallet)](#417-群主钱包-owner-wallet)
   - 4.18 [新建/编辑计划 (Formula Editor)](#418-新建编辑计划-formula-editor)
   - 4.19 [全部计划 (All Plans)](#419-全部计划-all-plans)
   - 4.20 [模板 (Templates)](#420-模板-templates)
   - 4.21 [全部游戏 (Game Lobby)](#421-全部游戏-game-lobby)
5. [Overlays: Modals, Drawers, Toasts](#5-overlays-modals-drawers-toasts)
6. [Reusable Components](#6-reusable-components)
7. [Major User Flows](#7-major-user-flows)

---

## 1. Overview

### App purpose
IM168 is a **mobile chat-embedded lottery/betting "game hall"** prototype. It simulates a messaging-app-like group (channel → game room) where members place bets on number-guessing lottery games (SG飞艇 "极速赛车" and SSC "时时彩"), can delegate repeat betting to rule-based **auto-bet plans** ("自动投") driven by a conversational command interface, chat and follow other members' bets, and manage a credit-based wallet. A **group owner ("群主") panel** provides an agent-style back office for commission tracking, member credit approval, and freezing abusive members. The product frames itself as chat-first: betting, automation, and social/approval flows are all reachable from inside a "room" that behaves like a group chat.

### Target platform / viewport
- **Mobile-first, single hand-held device frame.** The prototype renders one phone shell:
  - `.phone` width: `100%`, `max-width: 374px`
  - `.screen` fixed height: `780px` (simulates a device viewport, portrait)
  - Rounded device corners: `36px` border-radius, 1px border `#DCE2EE`, soft blue drop shadow
  - A fake iOS-style status bar (`9:41`, signal/wifi/battery glyphs) sits at the top, `28px` tall, on brand blue.
- Everything below the status bar is app content: header chrome → tab bar → round-info bar → scrollable body → sticky bottom bars (bet slip / input bar / streak rail).
- No tablet or desktop layout is defined — this is exclusively a phone-sized single-column layout.

### Visual style
- **Typography:** `Noto Sans SC` (weights 400/500/700) loaded from Google Fonts, falling back to `-apple-system, "PingFang SC", sans-serif`. All numeric/monetary values (odds, amounts, ball numbers, P&L) use **tabular figures** (`font-variant-numeric: tabular-nums`, `font-feature-settings: "tnum" 1`, `letter-spacing: -0.2px`) so digits align in columns — applied via a long shared selector list rather than a utility class.
- **Color language:** Primary brand blue with a deep-blue gradient for hero/credit cards; semantic green for wins, red for losses/danger, gold for owner-earnings and highlights. Neutral grays for surfaces, borders, and muted text. See full token table below.
- **Corner radii:** Generous, consistently rounded — buttons/chips ~8–20px, cards ~10–16px, bottom sheets 18px (top corners only), avatars/icons 7–12px, pills/circular controls 50%.
- **Spacing conventions:** Content padding is tight and consistent — outer screen gutters ~12–14px, card internal padding ~9–14px, vertical rhythm between stacked rows ~6–10px. Lists use hairline `1px solid var(--line)` dividers rather than heavy shadows.
- **Elevation:** Flat design with minimal shadow use — shadows appear only on bottom sheets/modals (soft, large-blur, dark, upward) and on floating elements (FAB, phone frame itself). Selected/active states use **tint fills**, not borders or shadows (explicit CSS comment: "selected = soft tint only, no glow").
- **Motion:** Short, consistent easing curve `cubic-bezier(.22,1,.36,1)` used everywhere (buttons pressed-state translate, view fade/slide-in, sheet slide-up, dashed "coin fly" micro-animation, pulsing live-indicator dot). Buttons get a `translateY(1px)` press effect instead of glow/scale on most controls; popup modals scale in from 0.92→1.

### Button system (explicit design rule found in code comments)
> Primary 主 = blue fill / white text · Secondary 次 = white fill / gray text with outline · Tertiary 三级 = white fill / dark-gray text with outline · Danger 危险 = red

This is the canonical hierarchy referenced throughout (see §6 Components → Buttons).

---

## 2. Design Tokens

All tokens are declared as CSS custom properties on `:root` in `shared/styles.css`.

| Token | Value | Semantic meaning |
|---|---|---|
| `--blue` | `#126BFF` | Primary brand blue — primary buttons, active tab underline, links, selected-state text, headers/hero backgrounds |
| `--blue-d` | `#0B52CC` | "Blue dark" — deeper blue for text-on-tint (e.g. selected chip label, headings inside blue-tint cards), and gradient end-stop |
| `--tint` | `#E7F0FF` | Pale blue tint fill for selected chips/pills, info banners, badges |
| `--red` | `#EF3939` | Danger/loss — stop/reject buttons, loss amounts, alert badges, frozen-status chip |
| `--muted` | `#8A93A6` | Secondary/caption text — labels, sub-text, timestamps, placeholders |
| `--line` | `#ECEFF4` | Hairline border/divider color used across cards, lists, inputs |
| `--page` | `#F5F7FA` | App/page background (behind cards) |
| `--ink` | `#1B2330` | Primary text/heading color |
| `--win` | `#1FA971` | Success/win green — profit amounts, "running" live-dot, success banners |
| `--gold` | `#C08C38` | Gold accent — owner/agent earnings figures, favorited/starred items, template "official" badges |
| `--font` | `"Noto Sans SC", -apple-system, "PingFang SC", sans-serif` | Base typeface |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | Standard motion easing for transitions/animations |

### Derived / inline colors used consistently but not tokenized
(These recur often enough to be treated as de-facto secondary tokens — recommend promoting them if rebuilding a design system.)

| Color | Hex/RGBA | Used for |
|---|---|---|
| Body text secondary | `#5a6480` | Row labels, secondary copy inside cards/messages (darker than `--muted`) |
| Owner gold-warn background | `#FFF8E0` / border `#FFE08A` / text `#9A6C00` | Pending-request banners, guard warnings, risk notes |
| Danger-soft background | `#FDECEC` / `#F5C9C9` | Frozen-status chip bg, danger-outline buttons |
| Success-soft background | `#E6F6EE` / `#B7E6CF` / `#EEFBF4` | Approved-status chip, winning bet-message bubble |
| Follow/against red variant | `#EF3939` fill for "反投" toggle button | Streak-drawer "bet against" selected state |
| Card border light | `#DDE2EF` / `#C9D3E3` / `#BBD4FF` | Assorted outlined chip/button borders (varies by component, all blue-neutral family) |
| Ball colors `c1`–`c10` | `#E0322B #F5821F #3FA9F5 #27AE60 #9B59B6 #16A085 #E67E22 #34495E #C0392B #2C3E50` | Per-position lottery ball background colors (10-ball SG飞艇 result display) |

### Radii scale (observed, not tokenized)
- **7–9px:** small chips, icon buttons, stat cards, list-item icons
- **10–13px:** standard cards (autocard, frow, pcardx, blist container)
- **14–16px:** hero/credit cards, lobby tiles, popup modal sheet
- **18px (top corners only):** bottom sheets/drawers
- **50% / pill:** avatars, dots, round icon buttons, streak chips (some), toggle switches

### Spacing scale (observed)
- **4px** — tight gaps between inline icons/badges
- **6–8px** — gaps between chips, list-row internal gaps
- **9–14px** — card padding, standard row padding
- **12–16px** — screen-level horizontal gutters, sheet padding

---

## 3. Global Chrome

Present on every screen at the very top:

### Status bar
Fake OS status bar, blue background, white text/icons: time (`9:41`), signal bars, wifi icon, battery icon. Height 28px. Purely decorative/static.

### Game header (`.ghead.chrome`) — shown only on 投注/自动投/聊天室 tabs
- **Top row:** back chevron (‹) → returns to channel; game switcher title (game name + small "▾" caret + room name subtitle, e.g. **"SG飞艇 ▾ 幸运组"**) → opens game lobby; spacer; **balance pill** (wallet icon + "¥400") → opens wallet; **"⋮" more menu** → opens More screen.
- **Tab row (3 tabs):** **投注** (Bet) / **自动投** (Auto-bet) / **聊天室** (Chat room). Active tab: white bold text + 26px white underline bar. Inactive: light blue `#CFE0FF`.
- **Round info bar** (only visible on 投注 tab):
  - Line 1: current period number (e.g. **"00089期"**), and a countdown pill showing a small pie-chart SVG timer + "投注时间还剩" (betting time remaining) + live countdown text (e.g. "0分48秒"). The pie fills clockwise and the text/stroke color interpolates green→red as time runs out (HSL hue animate, 1s tick).
  - Line 2 (tappable, expands/collapses a results panel): last period label (e.g. **"00088期"**) + row of 10 small colored number balls (result) + a caret (rotates 180° when expanded).
  - Expanded **result panel**: two more historical period rows (period + balls), then a **"当前长龙" (current streak)** section title and streak chips, e.g. *"冠军 大 · 4期"*, *"冠亚和 单 · 3期"*, *"第5名 小 · 3期"*.

### Bottom "长龙" (streak) rail
A horizontally scrollable strip pinned above the input/slip area on Bet, Auto-bet Dashboard, and Chat screens: label **"长龙"** + streak chips (e.g. "冠军大(4期)"). Tapping a chip opens the **Streak Quick-Bet Drawer** (§5). A chip gets a small blue checkmark badge in its top-right corner once a matching selection exists in the current bet slip ("已加入注单" indicator).

---

## 4. Screen-by-Screen Breakdown

### 4.1 首页 / 消息 (Home / Inbox)
**Purpose:** Entry screen — a chat-app-style inbox listing the user's joined channels/groups.

**Layout:**
- App header: **"IM168 · 消息"** + 🔍 search icon (opens outer Search screen).
- Section label: **"我的频道"** (My Channels).
- List of channel rows (icon + name + last-message preview + timestamp + optional unread badge):
  - 🎲 **幸运组** — "游戏厅 · 087 期群中奖" · 09:41 · badge "12" → opens Channel screen
  - 👑 **VIP 大厅** — "群主：今晚加场" · 09:20
  - ⚡ **极速专区** — "李姐：这把稳了" · 昨天 · badge "2"

**Interaction:** Tapping the primary channel row (幸运组) navigates to the Channel screen.

---

### 4.2 频道 (Channel)
**Purpose:** Mid-level hub — shows sub-groups within a channel (announcement, game room, general chat, red-envelope/lucky-draw group, and owner-only admin entry).

**Layout:**
- Subhead: back (‹) · **"幸运组 · 频道"** · "＋" (add, non-functional in prototype).
- Section "频道内群组" (In-channel groups):
  - 📢 **公告** (Announcements) — "群主：今晚 8 点开盘"
  - 🎮 **游戏厅** (Game Hall, blue-tinted channel-tag row with left accent bar) — "投注 · 自动投 · 聊天" · badge "12" → opens Bet screen (this is the entry point into the whole game room chrome)
  - 💬 **闲聊** (Chit-chat) — "王哥：今天手气不错" · badge "3"
  - 🧧 **红包雨** (Red Envelope Rain) — "李姐 发了一个红包"
- Section "管理" (Management):
  - 👑 **群主面板** (Owner Panel, gold-accented "agentitem" row) — "收益 · 审批 · 会员管理 · 仅你可见" · badge "5" → opens Owner Panel (only meaningful to the group owner persona)

---

### 4.3 投注 (Betting Board)
**Purpose:** The core betting screen — pick outcomes across markets for the current lottery period, stake an amount, and submit.

**Layout (top to bottom within the "body"):**
1. **Playbar** — horizontally scrollable market-category pills specific to the active game:
   - SG飞艇: **两面** (Two-Sided) / **1-10名** (Position 1–10) / **冠亚和** (Champion+Runner-up Sum), plus a **紧凑/宽松** (Compact/Loose) view-mode segmented toggle, plus a "🧾 我的注单" (my bets) shortcut icon.
   - SSC: **两面** / **定位胆** / **龙虎** / **总和** / **跨度** (only "两面" wired with content in the prototype; others are placeholder pills).
2. **Odds list** (scrollable), grouped by position/market (`.grp`), each group has a header (e.g. **冠军 / 亚军 / 第三名 … 第十名 / 冠亚和**) and rows of two-way option pairs: **大/小** (Big/Small), **单/双** (Odd/Even), **龙/虎** (Dragon/Tiger) — each option shows name + odds (all "1.99" in the mock). Position-number markets (1-10名, 和值) render as a **5-column number grid** (`.nb` cells 1–10, or 3–19 for 冠亚和值) instead of two-way pairs.
   - Two visual "skins" exist for the same data: **Compact (紧凑)** = 2-column dense grid layout; **Loose (宽松)** = larger single-column stacked rows with bigger type. Toggled via the playbar view-mode switch.
   - Selecting an option/number toggles a `.sel` (selected) state — soft blue tint fill (`#F1F6FF`) with blue-dark text, no border/shadow change.
3. **"该游戏即将开放" empty state** (🕒 icon) — shown instead of the board when the active game is `soon` (not yet launched).
4. **Bottom 长龙 (streak) rail** — see §3.
5. **Bet slip** (`.slip`, slides up from bottom when ≥1 selection made):
   - Row: "已选 **N** 注" (N bets selected)
   - Amount row: "每注 ¥" + numeric input (placeholder "最低30 - 360最高") + **⚙ gear icon** (opens the "custom stake presets" modal)
   - Quick-amount chip row: **最低** (min) / 30 / 60 / 90 / 180 / 360 / **最高** (max) — chips are user-configurable (see Limit-Set modal)
   - Footer: **合计 ¥0** (total) / **可赢 ¥0** (potential win) left-aligned; **清空** (Clear, secondary) and **确认下注** (Confirm Bet, primary) buttons right-aligned.
6. **FAB** — floating "🧾" my-bets shortcut button (bottom-right, only visible on this screen), with a small red badge count; repositions its `bottom` offset dynamically to sit above the slip/streak rail.

**Interactive behavior:**
- Tapping any `.opt`/`.nb` toggles selection; slip auto-shows/hides based on selection count; total/win recompute live.
- Amount chips are mutually exclusive; typing in the input deselects all chips.
- "清空" clears all selections and streak-chip "picked" highlighting.
- "确认下注" opens the **Confirm Bet modal** (only if ≥1 selection).
- Tapping a "长龙" streak chip opens the **Streak Quick-Bet Drawer**.

---

### 4.4 自动投 · 计划仪表盘 L1 (Autodash)
**Purpose:** Dashboard listing all of the user's auto-bet ("auto-invest") plans, entirely JS-rendered (no static HTML rows — all cards generated from a `dashPlans` JS array). This is the "L1" (list) level of the auto-bet feature; tapping into a plan opens "L2" (detail).

**Empty state (no plans yet):**
- Hero illustration + heading **"「自动投」让计划替你盯盘"** (Let "Auto-bet" plans watch the market for you) with body copy: **"追长龙不用手点，定好规则后逐期自动下注，实时追踪，随时急停。"** (No manual tapping to chase streaks — set the rules once, bets fire every round automatically; track live, stop anytime.)
- 3-step explainer row: **① 挑个打法** "龙来了不错过" → **② 设好底线** "止盈止损你说了算" → **③ 交给计划** "不盯盘也不漏一期"
- "新手推荐" (Recommended for beginners) section with a **recommendation card**: official template badge, **"小本试水"** (Small-Stakes Trial) name, live streak alert "🔥 现在正有龙 · 冠军大 已连开 4 期", stake summary "每期 ¥10 · 倍投 2×（上限3）", safety copy "亏到 −¥100 自动停 · 赚到 +¥100 自动停", social-proof avatars ("128 人用过 · 本周 36 人在用"), and two buttons: **自定义计划** (Customize, secondary) / **试用这个计划** (Try This Plan, primary).

**Populated state:**
- **Dashboard bar:** "我的计划" (My Plans) title + running summary "累计盈亏 +¥190" + **收起⌃** (Collapse) toggle + **＋** add button.
- **Collapsed state:** bar condenses to a single summary line with an inline "展开⌄" (expand) toggle.
- **Filter/sort bar** (only appears once ≥4 plans exist): chips **全部/运行中/已结束/★ (favorited)** counts + a sort toggle cycling through **运行中优先 (running-first) / 盈亏↓ (P&L desc) / 最近更新↓ (recently updated)**.
- **Plan rows** (`.prow`), grouped into "运行中" (Running) and "已结束" (Ended) sub-sections when sort mode is "group":
  - Line 1: status dot (green=running / gold=done / gray=stopped) · mode tag chip (**跟龙** blue / **反龙** orange / **固定** gray) · plan display name (mode prefix stripped) · optional 🔥 streak-count flame badge (when streak ≥2) · optional ★ favorited star · right-aligned P&L (colored green/red/gray).
  - Line 2: progress text (e.g. "已投 3 期 · 占用 ¥240" or a stop/win reason) + (if running) inline **急停** (Emergency Stop) mini-button.
  - Tapping a row expands it in place (`.pxpand`) to reveal: optional "live" status line (e.g. "本期 00090 · 已投 ¥10 · 待开奖"), full parameter description text, and an actions row: icon buttons for **分享** (Share), **修改** (Edit), **收藏** (Favorite/star toggle — fills gold when active), plus either **"进入查看 ›"** (Open, running plans) or **"重启"** (Restart) + **"删除"** (Delete, ended plans).
  - A first-run **coach tooltip** ("急停在这里 —— 点「急停」立即停止下注，未用预算马上退回。点卡片可看每期明细。" + "知道了" dismiss button) appears attached to the newest plan until dismissed once, globally.
- **"近期动态" (Recent Activity) feed** below the plan list: chat-style bot messages —
  - A **period-result card**: "第 088 期结果" header, one row per plan with its outcome and P&L, and a summed total.
  - A **running-plan alert card**: "⚙ 计划运行中" + mode tag + description of the live streak trigger, e.g. "冠军「大」连开 4 期 → 本期跟投 大 ¥40（倍投后）· 已连中 N 期".
  - A **completed-plan card** (green-tinted, "ok-msg"): "✓ 已完成" + mode tag + stop reason + refund note.
  - Feed items are clickable and cross-highlight with their matching plan row (selecting a plan dims unrelated feed items to 40% opacity — "instruction targeting" visual link).
- **Targeting bar** (`#dashTarget`): appears above the input bar once a plan row is expanded/"targeted" — reads "指令挂靶：[mode tag] [plan name] —— 对助手说的话只作用于它" (Command targeting: instructions you type only affect this plan), with an ✕ to untarget.
- **Command drawer** (`/` icon opens `.cmddrawer`): intro copy **"怎么用指令"** / "直接说你要改什么，助手会先确认，再从下一期生效。" (Say what you want changed; the assistant confirms before it takes effect next round.) Grouped example commands:
  - 查状态 (Check status): "查看当前计划" / "今天赚了多少"
  - 改风控 (Adjust risk controls): "止盈改成 300" / "止损改成 200"
  - 改投注 (Adjust stakes): "基础注额改成 50" / "倍投改成 2 倍"
  - 控制计划 (Control plan): "暂停本计划" / "急停本计划"
  - Plus an 8-button quick-command grid: 查看计划 / 暂停 / 急停 / 止盈 300 / 止损 200 / 倍投 2倍 / 注额 50 / 今天盈亏.
- **Input bar:** "/" slash button (opens command drawer) · placeholder field **"对助手说：帮我建个小额计划…"** (Tell the assistant: help me set up a small plan…) · send (➤) icon.
- A temporary **"DEMO" floating button** loads 4 mock plans for client preview purposes (explicitly marked in code as removable before production).

---

### 4.5 自动投 · 计划详情 L2 (Plandetail)
**Purpose:** Deep-dive assistant chat view for one specific plan — shows a running commentary thread and lets the user issue natural-language commands scoped to that plan.

**Layout:**
- Detail bar: back (‹) · plan name title · **"计划列表"** (Plan List) link (also returns to dashboard).
- **Plan status bar:** e.g. "运行中 · 跟龙 冠军大小 · 已投 3 期 · +¥120" + **历史** (History) link + **急停** (Emergency Stop) button.
- **History drawer** (toggled by "历史"): paginated bet-history list (`.blist.pagelist`) — each row shows period+pick and stake/odds, with win/loss amount; includes a page navigator (‹ 1/2 ›).
- **Chat-style scroll area:**
  - System note: "本计划助手 · 按你的设定逐期下注,变更可直接对我说"
  - Bot message cards (`.botcard`): "⚙ 计划运行中" status card with live parameters and P&L.
  - User command bubbles (`.cmd`, right-aligned, blue): e.g. "止盈改成 300".
  - Confirmation bot cards (green "ok-msg"): "✅ 已更新" — echoes old→new value and "下期生效" (effective next period).
  - Result bot cards: "第 088 期结果" — outcome + updated P&L, "已重置基数" (base reset) note.
- Bottom streak rail (same component as Bet screen).
- Command drawer identical in structure to the dashboard's (§4.4), scoped to this plan.
- Input bar: "/" · placeholder **"对助手说：改倍投 / 暂停 / 问进度…"** · send icon.

Two example plan panels are hard-coded (`p1` 跟龙冠军大小, `p2` 固定亚军单) demonstrating both a "跟龙" (follow-streak) and "固定" (fixed) plan narrative.

---

### 4.6 聊天室 (Chat)
**Purpose:** Social chat room tied to the game room — general messages plus bet-sharing/follow mechanics and live draw results.

**Layout:**
- Chat-top bar: **"幸运组 · 聊天室"** + 🔍 search icon (opens Chat Search screen).
- Scrollable message thread:
  - System divider: "今天 09:38 · 仅显示你与他人公开的内容" (Today 09:38 · only showing content you and others made public)
  - Regular chat bubble: avatar initial + name + text, e.g. 王哥: "这期车头看大，跟一手"
  - **Bet-share card** (`.betmsg`): "分享" tag + "王哥 · 冠军大" + **跟单** (Follow/Copy-bet) button; sub-line "公开了玩法（金额不显示）· 本期 089" (Shared the pick, amount hidden).
  - Another example: 李姐 · 冠亚和大, with its own 跟单 button.
  - System note: "陈生 已跟单 王哥（不显示金额）" (Chen has copied Wang's bet, amount hidden).
  - **Draw-result card** (`.draw`, blue block, centered): "上期开奖 · 第 088 期" + 5 result balls + outcome text "冠军 6 · 大 · 虎　你 中奖 +¥78 ✓".
  - Closing system note: "— 088 期已结算 · 仅显示你的结果 · 下注请到「投注 / 自动投」—"
- Bottom streak rail.
- Input bar: placeholder **"发消息…（指令请到「自动投」）"** (Send a message… commands belong in "Auto-bet") — reinforces that betting commands don't work here, only in Auto-bet.

**Interaction:** Tapping **跟单** on a bet-share card marks it "已跟单 ✓" and disables further taps (adds `.done` state, grays out).

---

### 4.7 更多 (More)
**Purpose:** Overflow menu accessed via "⋮" in the header.

**Layout:** Subhead "更多" + list rows:
- 📊 **投注历史** (Bet History) — "注单与盈亏"
- 🗂 **全部计划** (All Plans) — "自动投计划管理 · 搜索"
- 👛 **钱包** (Wallet) — "余额、额度申请、流水"

---

### 4.8 搜索 (Search / Chat Search)
Two related screens:

**外层消息搜索 (Global search, from Home 🔍):** subhead "搜索" + searchbar placeholder **"🔍 搜索消息 / 注单 / 成员 / 计划…"** + "最近搜索" (recent searches) chips ("冠军大", "王哥") + tab bar **消息/注单/成员/计划** (Messages/Bets/Members/Plans) each with its own paginated result list (`.blist.pagelist`).

**聊天室搜索 (Chat-room search, from Chat 🔍):** subhead "搜索聊天" + searchbar **"🔍 搜索聊天记录 / 成员…"** + tab bar **消息/成员** with paginated lists.

Both use the shared **btabs/btabpanel** tab component and **pagelist/pager** pagination component (see §6).

---

### 4.9 投注历史 (Bet History)
**Purpose:** Personal wager ledger.

**Layout:**
- Subhead: back · "投注历史" · "游戏厅"
- Two stat rows: 今日投注/今日盈亏 (today's stake/P&L), 本周投注/本周盈亏 (this week's stake/P&L) — each stat is a 2-up card row.
- Tab bar: **未结** (Open) / **已结** (Settled).
- Filter chip bar: **全部** (All) / **只看赢** (Wins only) / **只看输** (Losses only) / **自动投** (Auto-bet only).
- Paginated bet-history list (`.blist.pagelist`), each row: period+pick label & stake/odds sub-text, right-aligned result (win amount green / "待开" pending gray / loss amount red).

---

### 4.10 钱包 (Wallet)
**Purpose:** Member's personal wallet — balance, allocations, quick actions, recent flow.

**Layout:**
- Subhead: back · "钱包"
- **Credit hero card** (blue gradient): "可用余额" (Available Balance) label + big amount "¥240"; below a divider, an **占用明细 (allocation breakdown)** list: "自动投占用 ¥130 ›" and "待开注单 ¥30 ›" (both tappable, jump to Auto-bet / Bets).
- Primary CTA: **"＋ 申请额度"** (Request Credit) full-width button.
- **Pending request banner** (gold): "⏳ 申请 ¥300 · 待群主确认 ›" (tappable → Request History).
- Stat row: 今日盈亏 / 今日投注.
- Section "流水" (Flow) with "查看更多 ›" link → Wallet Flow screen.
- Recent transaction list (`.blist`) — plan-stop refunds, credit top-ups, bets, wins, shown as +/− colored rows.

---

### 4.11 流水 (Wallet Flow)
**Purpose:** Full transaction history for the wallet.

**Layout:** Subhead "流水" + filter chip bar **全部/额度/下注/中奖/退回** (All/Credit/Bet/Win/Refund) + paginated transaction list tagged by type (`data-t`).

---

### 4.12 申请额度 / 申请记录 (Credit Request)

**申请额度 (Request Credit):**
- Subhead: back · "申请额度" · "记录" link (→ history)
- Section "金额" (Amount): large right-aligned amount input "申请 ¥500", quick chips **100/300/500(selected)/1000/2000**, helper text "单次最低 ¥100 · 最高 ¥5,000（以群主设置为准）" (min/max, subject to owner's config), and an info banner: "💡 提交后由群主确认，到账会显示在钱包与流水" (Submitted for owner approval; once granted it shows in wallet/flow).
- Footer: **取消** (Cancel, secondary) / **提交申请** (Submit Request, primary).

**申请记录 (Request History):**
- Filter chips **全部/待确认/已到账/已拒绝** (All/Pending/Granted/Rejected)
- Paginated list, each row: amount + timestamp (+ optional note) and a right-aligned status label colored gold (pending), green (granted), or red (rejected).

---

### 4.13 群主面板 (Owner / Agent Panel)
**Purpose:** The group-owner's back-office — commission tracking, member approvals, and settings. Explicitly "仅你可见" (owner-only visibility) throughout.

**Layout:**
- **Agent header** (blue): back · "群主面板" · group-name pill "幸运组 ▾" · three tabs: **总览** (Overview) / **成员 (with red count badge "7")** (Members) / **设置** (Settings).

**Tab 总览 (Overview):**
- **Hero commission card** (gold-accented, white bg): "今日收益（仅你可见）" (Today's earnings, owner-only) label; big gold amount "+68" that **animates/increments live** (every 6s, random +3–9, with a bump-scale animation and a floating "🪙 +N" coin particle) simulating real-time commission accrual; trend text "▲ 较昨日 +12%"; sub-row of 今日群投 (today's group stake) 850 / 佣金比例 (commission rate) 8.0% / 明细 (details) link.
- **Pending strip:** "7 件待处理 · 额度申请 5 · 入群申请 2 ›" (7 items pending: 5 credit requests, 2 join requests) — tappable, jumps to Members tab.
- **2×2 stat grid:** 玩家输赢（今日） +320 / 总胜率 38% / 累计收益 +1,240 / 主钱包 1,000 (可分配 240 sub-label).
- **收支记录 (transactions) preview card** with 3 rows + "查看更多 ›" link.

**Tab 成员 (Members):**
- Sub-tabs: **待审批 (with count "7")** / **已处理** / **全部成员**.
- Search bar: "🔍 搜索成员名…" placeholder.
- **待审批 (Pending)** panel:
  - "入群申请 · 2" section: **approval cards** (`.apcard`) — avatar + "林仔 申请进群" + "由 王哥 邀请 · 10:20" meta, with **拒绝** (Reject, danger outline) / **通过** (Approve, primary blue) button pair.
  - "额度申请 · 5" section: approval cards showing "王哥 申请 200 额度" + context ("剩 190 · 今日 −60 · 上次申请 3 天前") with Reject/Approve buttons. **Guard state:** when the owner's distributable balance is insufficient, the Approve button is disabled (grayed, `.dis`) and a warning strip appears: "⚠ 可分配仅 240，不足批 600" (Only 240 distributable, insufficient for 600) — this repeats per-card based on requested amount vs. available balance.
  - Paginated (5 example requests, page size 3).
- **已处理 (Done)** panel: list of resolved requests with a colored status chip **已通过** (Approved, green) or **已拒绝** (Rejected, red).
- **全部成员 (All members)** panel: tappable rows → Member Detail screen; each shows name + status chip + remaining credit / today's P&L summary.

**Tab 设置 (Settings):**
- Section "收益" (Earnings): **抽成设置** (Commission Rate Settings) row "当前 8% · 按玩家盈利" → Rake screen; **收益与流水** (Earnings & Flow) row → Owner Wallet screen.
- Section "成员" (Members): **成员注单** (Member Orders) row "本期 5 笔 · 含未公开" (5 bets this round, including private ones) → Orders screen.
- Section "通知" (Notifications): three toggle rows — 新申请提醒 (New request alerts, on), 大额下注提醒 (Large-bet alerts, on), 异常提醒 (Anomaly alerts, off).

---

### 4.14 成员详情 (Member Detail)
**Purpose:** Single-member profile for the owner.

**Layout:**
- Subhead: back · "成员详情"
- Member header card: large avatar + name "王哥" + status chip "已通过" + "加入 32 天" (joined 32 days ago).
- 3-up stat row: 剩余额度 (remaining credit) 190 / 今日输赢 (today's P&L) −60 / 总注单 (total bets) 142.
- "最近记录" (Recent records) list — bets and a pending credit request.
- Info banner: "冻结后：他将无法下注与自动投，已下注单照常开奖结算，余额保留，可随时解冻。他端只显示「请联系群主」。" (Explains freeze consequences: no new bets/auto-bet, existing bets still settle, balance retained, reversible; their app just shows "please contact the owner".)
- Footer: **返回** (Back, secondary) / **冻结此成员** (Freeze This Member, danger red).

**Interaction:** Tapping "冻结此成员" opens the **Freeze confirmation modal** (§5) with a required reason picker (异常投注/协商处理中/其他原因) before the confirm button activates.

---

### 4.15 成员注单 (Member Orders)
**Purpose:** Owner's live view of all bets placed this round across all members (including those individual members marked "不公开"/private in chat).

**Layout:** Subhead "成员注单 · 089" + "本期 ▾" period selector; member search bar; note "可见全部注单（含未公开）· 额度只显示剩余" (owner sees everything, but credit shown only as remaining balance — not full allocation); paginated list of bets tagged with member name, pick, stake/odds, visibility (公开/未公开), and remaining credit.

---

### 4.16 抽成设置 (Rake Settings)
**Purpose:** Owner-only commission configuration.

**Layout:**
- Row: **抽成比例** (Commission Rate) — stepper control showing "8%" with −/+ buttons.
- Row: **计算口径** (Calculation Basis) — 2-way segmented control: **赔率差** (Odds Spread, selected) / **盈利** (Player Profit).
- Info row (tint background): "成员不可见 — 抽成比例与收益对成员完全隐藏" (Members cannot see commission rate or owner earnings at all).
- Footer: 取消 / 保存 (Cancel / Save).

---

### 4.17 群主钱包 (Owner Wallet)
**Purpose:** Owner's earnings & fund-flow ledger, separate from personal member wallet.

**Layout:**
- Credit hero card: "主钱包" (Master Wallet) 1,000.
- Stat row: Total Win 累计收益 +1,240 / Total 提款 (withdrawals) 900.
- "分类" (Categories) breakdown rows: 已分配给成员 (Allocated to members) 760 with per-member sub-text; 待审批占用 (Pending-approval exposure) 800; 本期收益 (This round's earnings) +68; 当前可用 (Currently available) 240.
- "Transactions" section: filter chips **全部/收益/审批/提款/回收** (All/Earnings/Approvals/Withdrawals/Recalls) + paginated transaction list.

---

### 4.18 新建/编辑计划 (Formula Editor)
**Purpose:** The configuration form for creating or editing an auto-bet plan — the "recipe" behind a plan card. Title switches between **"新建自动投计划"** (new) and **"计划设置"** (edit) based on a `.creating` state class.

**Layout:**
- **Live monitor card** (blue gradient, hidden while `.creating`): "● 运行中" pulsing live badge + mode label ("跟龙模式"); big P&L "+¥120 当前盈亏"; 3-up mini-stats "已进行3期 / 累计投注¥240 / 距止盈¥80"; progress bar; **"急停 · 停止本计划"** full-width button.
- **计划名称** (Plan Name) row — text input, e.g. "跟龙 · 冠军大小".
- Section "投注模式" (Betting Mode):
  - **模式** row — 3-way segment: 固定 (Fixed) / 跟龙 (Follow-streak, selected) / 反龙 (Against-streak).
  - **监测盘口** (Monitored market) — read-only value chip "冠军 大小".
  - **触发长龙** (Streak trigger threshold) — stepper "连开 ≥ N 期", value "3 期".
- Section "基础 / 倍投" (Base / Martingale):
  - **基础注额** (Base stake) stepper — "¥10", step ¥10.
  - **倍投倍率** (Multiplier) stepper — "2×", step 1, min 1.
  - **倍投上限** (Multiplier cap) stepper — "5 次".
- Section "风控" (Risk Controls):
  - **止盈** (Take-profit) — value chip "+¥200" (green).
  - **止损** (Stop-loss) — value chip "−¥300" (red).
  - **单期注额上限** (Per-round stake cap) — value chip "¥500".
- Footer: **取消** (Cancel) / primary button labeled **"启动计划"** (Start Plan) when creating, **"保存修改"** (Save Changes) when editing.

**Interactive behavior:** Steppers increment/decrement by contextual step size inferred from suffix (¥ → step 10; %, × → step 1; 期/次 → step 1). Editing an existing plan snapshots the "before" values on entry; saving diffs old vs. new values and shows them in the **Save-Changes confirmation modal** (§5).

---

### 4.19 全部计划 (All Plans)
**Purpose:** Full plan management list (separate from the chat-embedded Autodash — this is the "More → 全部计划" destination), with running/stopped tabs and search.

**Layout:**
- Subhead: back · "全部计划" · "＋" add.
- Stat row: 运行中 (Running count) 2 / 合计盈亏 (Total P&L) +¥190.
- Search bar: "搜索计划名 / 指令记录…" placeholder.
- **Sharebar** (tint card): "分享我的下注" (Share my bets) toggle — "开启后，你的下注会公开到聊天室（不显示金额）" (When on, your bets are shared to chat, amount hidden). Toggle default: on.
- Tab bar: **进行中 (count "2")** / **已停止** (Running / Stopped).
- **进行中 (Running)** panel: `.autocard` cards — live-dot "● 运行中" + plan name + P&L; params sub-line; progress line "已投 N 期 · 占用 ¥N"; action buttons **打开** (Open, secondary) / **急停** (Stop, danger).
- **已停止 (Stopped)** panel: `.autocard.paused` cards (currently full-opacity per an override comment — "not dimming the whole card, only fading text") — stop reason instead of progress; action buttons **重启** (Restart) / **删除** (Delete, danger).
- **"＋ 新建计划"** (New Plan) dashed-border button at the bottom.

---

### 4.20 模板 (Templates)
**Purpose:** Template picker — the first step of creating a new plan (also reachable as a bottom-sheet modal from the dashboard's "＋").

**Layout:**
- Subhead: back · "新建计划 · 选模板"
- Section "官方模板 · 点「试用」载入后可微调" (Official templates — tap "Try" to load, then fine-tune):
  - **小本试水** (Small-Stakes Trial) — "基础 ¥10 · 倍投 2×（上限3）· 止盈+¥100/止损−¥100"; meta "官方推荐 · 适合新手" (Officially recommended, beginner-friendly); social proof avatars "128 人用过 · 本周 36 人在用".
  - **反投策略** (Contrarian Strategy) — "反龙 · 冠军大小 · 倍投 2×（上限5）· 止盈+¥200/止损−¥300"; meta "稳健 · 近 7 日命中 62%" (Steady, 62% hit rate last 7 days); "86 人用过 · 本周 21 人在用".
  - **跟投策略** (Follow Strategy) — "跟龙 · 冠军大小 · 倍投 3×（上限7）· 止盈+¥500/止损−¥800"; meta "高风险 · 适合老手" (High risk, for veterans); "42 人用过 · 本周 9 人在用".
- Section "我的模板" (My Templates): user-saved template, e.g. **我的反投改** — "反龙 · 冠军大小 · 倍投 2× · 止盈+¥300/止损−¥300", meta "上次使用 今天".
- **"＋ 不用模板，自定义新计划"** (Skip templates, build custom) dashed button — leads straight to the Formula Editor in "creating" mode.

Each template row has a **"试用"** (Try) button that (in the dashboard-embedded modal variant) opens the Formula Editor pre-filled.

---

### 4.21 全部游戏 (Game Lobby)
**Purpose:** Game switcher / catalog.

**Layout:**
- Subhead: back · "全部游戏" · 🔍
- Section "已开放" (Available): 2-column tile grid (`.lobgrid`) — **极速赛车 SG飞艇** ("已开放" tag, 🏎 icon, "每 80 秒一期" every-80-seconds subtitle) and **时时彩 SSC** ("已开放" tag, 🎰 icon, "每 5 分钟一期").
- Section "即将上线" (Coming Soon): dimmed tiles (62% opacity) — **快3** and **六合彩**, both "敬请期待" (Stay tuned), non-interactive.

**Interaction:** Tapping a live tile sets the active game and jumps straight to the Bet screen.

---

## 5. Overlays: Modals, Drawers, Toasts

All overlays are absolutely positioned within the `.screen` container (`position:absolute; inset:0`) and toggle visibility via an `.open` class, so they always cover the full phone viewport with a dark scrim behind a foreground sheet/panel.

### 5.1 确认下注 Confirm-Bet Modal (`.confirm-modal`)
Bottom sheet (rounded top corners, slide-up animation). Content: "确认下注" heading; meta "第 00089 期"; scrollable list of selected picks — each row shows market+pick name, odds (e.g. "@1.99"), and stake amount; summary row "共 N 注 / 合计 ¥N"; two full-width buttons **再想想** (Think again / Cancel, secondary) and **确认提交** (Confirm Submit, primary).

### 5.2 自定义常用额度 Limit-Set Modal (`.limitset-modal`)
Centered popup (not a bottom sheet). "自定义常用额度" heading + "清空" (Clear) link; helper text "最多 5 档，留空视为不启用，保存后立即生效" (up to 5 presets, blank = disabled, saves instantly); 5 labeled numeric inputs (额度1–5) each right-aligned bold blue; range note "每档额度介于 10–100000"; footer 取消/保存并启用 (Cancel / Save & Enable).

### 5.3 长龙快投 Drawer (Streak Quick-Bet, `.streak-drawer`)
Bottom sheet with drag handle. Content: "长龙快投" title; sub "确认后加入注单 · 第 00089 期"; a **badge** summarizing the streak (blue dot + text, e.g. "冠军大 · 连开 4 期"); **投注 (Direction)** section — two large toggle buttons **跟投「X」@1.99** (Follow, blue when selected) vs. **反投「Y」@1.99** (Against/opposite pick, red when selected — opposite value auto-computed via a 大↔小/单↔双/龙↔虎 map); **金额 (Amount)** section — numeric input + 7 pill chips (最低/30/60/90/180/360/最高); footer showing "共 1 注 / 可赢 ¥N" plus **取消**/**加入注单** (Cancel / Add to Slip) buttons. Submitting selects the matching option in the underlying bet board and prefills the slip amount.

### 5.4 计划操作二次确认 Plan Action Modal (`.plan-modal`, id `planModal`)
Centered popup, shared by multiple flows (all render into the same title/body/buttons slots):
- **急停确认 (kind="stop"):** "确认急停？" + body "急停后「计划名」将立即停止，本期未执行的下注不再进行，未用预算马上退回余额。" + 取消/**确认急停** (danger).
- **重启（旧版，无上下文）(kind="restart"):** "重启计划" + two radio-style option cards **继续上一回合** vs **重置设置并重新开始**; confirm button starts disabled until an option is picked.
- **重启（新版，带上回合概要）(kind="restart2")：** same two options, but preceded by a **`.pm-ctx`** context box summarizing the last round ("上回合：已投 N 期 · [stop reason] · 盈亏 +/−¥N"), with a note when re-continuing a loss ("该亏损将延续计入统计"). Default-selected option is smart: "已完成" plans default to 重置 (fresh), interrupted ones default to 继续 (resume).
- **删除确认 (kind="delete"):** "确认删除？" + "删除「计划名」后无法恢复，历史记录一并移除。" + 取消/**删除** (danger).
- **保存修改 (kind="savechange"):** shows a **diff box** ("本次修改" — old→new value rows for each changed parameter, or "未检测到参数变更" if nothing changed) + timing choice **马上执行** (Apply immediately) vs **下一期才套用** (Apply next round); confirm disabled until a timing option is chosen.
- **冻结成员 (kind="freeze"):** "冻结「王哥」？" + consequences copy + 3 reason-option cards (异常投注/协商处理中/其他原因); confirm button (danger, disabled until a reason is picked) reads **确认冻结**.

### 5.5 启动确认 Start-Plan Sheet (`.start-modal`, id `startModal`)
Bottom sheet titled **"启动「计划名」"** + sub "启动后每期自动下注，你随时可以急停"; a stack of label/value rows (`.srow`) transparently laying out the budget: 玩法 (market/pick), 每期投入 (per-round stake incl. max after multiplier), 最坏情况 (worst case — red, auto-stop amount), 达到止盈 (best case — green, auto-stop amount), 占用预算 (reserved budget vs. current balance); footnote "ⓘ 预算从余额中预留，计划结束后未用部分自动退回。" (Budget is reserved from balance; unused portion auto-refunds when the plan ends); footer **再想想**/**确认启动** (Think again / Confirm Start).

### 5.6 新建计划模板弹层 Template Bottom Sheet (`.tpl-modal`, id `tplModal`)
Same 3 official templates + "不用模板，自定义" option as the full Templates screen (§4.20), presented as an in-context bottom sheet from the dashboard's "＋" button, capped at 72% viewport height with internal scroll.

### 5.7 Toasts
- **全局轻提示 Global toast** (`#gToast`): centered pill near the bottom, dark background, white text, auto-dismiss ~3.2s. Used for e.g. "已冻结「王哥」· 他端将显示「请联系群主」" and "邀请链接已复制，发给玩家即可加入".
- **仪表盘 Toast** (`#dashToast`): wider inline banner (dark, rounded, positioned above the input bar) used specifically inside Auto-bet dashboard actions (stop/restart/favorite/share confirmations), auto-dismiss ~4.2s, and can include an **"撤销" (Undo)** action link (e.g. after an emergency stop, offering to undo it).

---

## 6. Reusable Components

### 6.1 Buttons
| Variant | Visual | Example usage |
|---|---|---|
| **Primary (`.cta`)** | Solid blue fill, white text, `10–11px` radius | 确认下注, 确认提交, 提交申请, 保存, 确认启动 — the single "commit" action per screen |
| **Primary — danger (`.cta.danger` / `.danger2`)** | Solid red fill, white text | 确认急停, 冻结此成员, delete confirmations |
| **Secondary / ghost (`.ghost`, `.cancel`)** | White fill, gray text, `1px` neutral border | 取消, 再想想, 返回 — always paired opposite a primary CTA |
| **Tertiary (`.abtn`)** | White fill, dark-gray text (updated from blue per explicit design-system comment), outlined | 打开 (Open plan), 重启 (Restart) |
| **Tertiary — danger (`.abtn.stop`)** | White fill, red text, red-tinted outline | 急停, 拒绝, 删除 |
| **Tertiary — prominent (`.abtn.pri2`)** | Blue fill, white text (elevated tertiary for the "positive" choice in a paired approval action) | 通过 (Approve) in owner approval cards; has a `.dis` disabled state (gray, non-interactive) when a guard condition fails |
| **Dashed / "add new" (`.tplnew`, `.recrow`)** | White fill, dashed blue border, blue text | ＋ 不用模板自定义新计划, ＋ 新建计划 |
| **Icon button (`.icobtn`)** | Square-ish rounded outline button holding an SVG glyph | share/edit/favorite actions on plan-row expand; favorited state fills gold |
| **Chip/pill toggle (`.amtchip`, `.qamtchip`, `.sd-pill`, `.gchip2`, `.pb`, `.ptab`, `.fchip`, `.btab`)** | Rounded pill, gray default / blue-tint when `.on` (selected) | Amount presets, game filters, market tabs, plan filters — all share the same on/off visual language: `#F1F4F9` gray bg → `var(--tint)` blue bg + blue-dark text + light blue border when active |

### 6.2 Cards
| Component | Structure |
|---|---|
| **Credit / hero card (`.credit`, `.herocard`)** | Blue gradient or white surface, large label+amount pair, optional progress bar, optional CTA button embedded |
| **Stat card (`.stat`)** | Small bordered card, tiny muted label on top, bold value below (colorizable win/lose) |
| **List row card (`.frow`)** | White card, left label+sublabel, right-aligned control (value, stepper, toggle, or chevron) |
| **Plan summary card (`.autocard`)** | White card: status dot/live label + name + P&L on top row, params sub-line, progress line, action-button row at bottom; `.paused` variant for stopped plans |
| **Compact plan row (`.prow` + `.pxpand`)** | Two-line collapsed row that expands in place to show full detail + actions (dashboard-specific, denser than `.autocard`) |
| **Approval card (`.apcard`)** | Avatar + request description + Reject/Approve button pair; optional guard-warning strip below |
| **Bet-history row (`.bi`)** | Two-column row: left = title+meta, right = colored result/status |
| **Template card (`.tpl`)** | Name + "试用" action top row, summary line, meta line, optional social-proof avatar row |
| **Recommendation card (`.reccard`)** | Bordered "official" card combining a live-streak alert, params, safety copy, social proof, and two CTAs |
| **Lobby tile (`.lobtile`)** | 2-col grid tile: icon block, name, subtitle, status tag in the corner; dimmed for "coming soon" |

### 6.3 Chips / Tags / Badges
- **Streak chip** (`.streakchips span`, `.bottom-streak span`) — pill showing e.g. "冠军大 · 4期"; gains a small blue checkmark badge when a matching bet is already in the slip; turns solid blue ("picked") when actively selected.
- **Mode tag (`.mtag`)** — tiny colored label: 跟龙(blue-tint) / 反龙(orange-tint) / 固定(gray-tint).
- **Status chip (`.stchip`)** — 已通过(green)/已冻结(red) member-status labels.
- **Notification badge (`.badge`, `.ctpill`)** — small red (or blue-when-active) rounded count pill on tabs/list rows.
- **Live/running indicator (`.live`, `.live2`, `.pdot`)** — colored dot (pulsing animation) + label, green=running, gold=done, gray=off.
- **Odds/ball display (`.bb`, `.rb .b`)** — small colored circular/rounded-square chips numbered per lottery-position color scheme (`c1`–`c10`).

### 6.4 Modals / Bottom Sheets
Two structural patterns recur:
1. **Bottom sheet** (`.cf-sheet`, `.sd-sheet`, `.sm-sheet`, `.tpl-modal .cf-sheet`) — anchored to the bottom edge, rounded top corners only (18px), slides up, dark scrim behind.
2. **Centered popup** (`.pm-sheet`, `.ls-sheet`) — centered card with all corners rounded (16px), scale-in animation, dark scrim behind, used for short yes/no-style confirmations rather than data-entry sheets.

### 6.5 Form Inputs
- **Numeric stake input (`.amtin`, `.sd-amt-input`, `.qamtin`)** — bordered rounded box, right- or center-aligned bold blue numeral, placeholder describing min/max range.
- **Stepper (`.stepper`)** — segmented control: [−] value [+], value shows unit suffix (¥/%/×/期/次) and steps contextually.
- **Segmented control (`.seg2`)** — 2–3 way exclusive choice pills inside a bordered pill container, active segment filled blue.
- **Toggle switch (`.toggle`)** — iOS-style pill switch, blue=on/gray=off, `.sm` compact variant used in settings rows.
- **Text field (`.plname`, `.plansearch-in`, `.msearch-in`)** — plain bordered/borderless text input depending on context (form field vs. inline search).
- **Search bar (`.searchbar`, `.plansearch`)** — icon + placeholder text, white card with border.

---

## 7. Major User Flows

### 7.1 Place a Bet → Confirm → Toast
1. User is on **投注 (Bet)** screen; taps a market pill (playbar) to filter, optionally taps 紧凑/宽松 to change density.
2. Taps one or more `.opt`/`.nb` outcomes → each toggles selected (tint fill); the **bet slip** slides up from the bottom automatically once ≥1 selection exists.
3. Sets a stake either by tapping a preset chip (30/60/90/180/360/min/max) or typing a custom amount in the input; slip's **合计 (total)** and **可赢 (potential win)** recompute live (`total = n × amount`, `win ≈ amount × 1.995`, rounded).
4. Taps **确认下注** → opens the **Confirm-Bet bottom sheet**, listing every selection with its odds and stake, plus a grand total.
5. Taps **确认提交** → sheet closes, all selections clear, slip collapses (no persistent toast is fired in this exact path in the current prototype logic — settlement/toasts appear later via the Chat draw-result card or Auto-bet feed).
   - Alternative: taps **再想想** to cancel and return to the board with selections intact.

### 7.2 Streak-Chip Quick Bet
1. From the **bottom 长龙 (streak) rail** (visible on Bet/Auto-bet/Chat), user taps a streak chip, e.g. "冠军大(4期)".
2. **Streak Quick-Bet Drawer** opens, pre-populated with a badge summarizing the streak and the current period number.
3. User chooses direction — **跟投 (follow the streak)** or **反投 (bet against it)** — the "against" option auto-resolves to the opposite face (大↔小 etc.).
4. User sets an amount via chips or input; footer live-updates "共 1 注 / 可赢 ¥N".
5. Taps **加入注单** → drawer closes, the matching option on the underlying bet board gets `.sel` applied and the main bet-slip amount syncs, and the streak chip itself gains a checkmark badge. From here the flow rejoins **7.1** (user still needs to hit 确认下注 → 确认提交 on the main slip).

### 7.3 Create Auto-Bet Plan → Template Sheet → Plan Detail → Start Confirmation
1. From the **Auto-bet Dashboard** empty or populated state, user taps **＋** (or the recommendation card's "试用这个计划").
2. **Template bottom sheet** (or full Templates screen via "全部计划 → ＋新建计划") opens, listing 3 official templates + any saved personal templates.
3a. **Path A — use a template:** tap **试用** on a template card → jumps directly into the **Formula Editor** in "creating" mode with all fields pre-filled from the template; user may adjust any stepper/segment/input.
3b. **Path B — start from scratch:** tap **"＋ 不用模板，自定义新计划"** → same Formula Editor, blank/default values.
4. In the Formula Editor, user configures: mode (固定/跟龙/反龙), monitored market, streak trigger threshold, base stake, multiplier & cap, take-profit, stop-loss, per-round cap, and names the plan.
5. Taps **启动计划** → because this is a *new* plan (creating state), the app returns straight to the dashboard (no diff/confirmation needed for brand-new plans) — **or**, per the richer flow modeled via `tplconfirm`, opens the **Start-Plan budget sheet** showing worst-case/best-case auto-stop amounts and the reserved budget vs. available balance.
6. User confirms **确认启动** → a new running plan card appears at the top of the dashboard list, live-status text shows the first round already staked and awaiting the draw ("本期 00090 · 已投 ¥10 · 待开奖"). First plan ever created also attaches the **onboarding coach tooltip** pointing at the 急停 button.
7. Tapping the new plan's **"进入查看 ›"** action opens **Plan Detail (L2)** — the assistant-chat view — where the user can review the running commentary or type/​tap natural-language commands (e.g. "止盈改成 300"), each of which is echoed as a user bubble followed by a bot confirmation card stating what changed and when it takes effect ("下期生效").

### 7.4 Edit an Existing Plan → Diff → Timing Choice
1. From a dashboard plan row's expanded actions, tap **修改 (Edit)** → opens Formula Editor in "edit" mode (title "计划设置"), and the app snapshots current field values.
2. User changes one or more parameters.
3. Taps **保存修改** → **Save-Changes popup** opens showing a computed diff (old → new) for every changed field, or a "no changes detected" placeholder if nothing changed.
4. User must pick a timing option — **马上执行** (apply immediately, only affects not-yet-executed bets) or **下一期才套用** (apply starting next round) — which enables the confirm button.
5. Confirms → popup closes, returns to dashboard, and a **dashboard toast** confirms: "✅ 修改已保存 · [立即生效 / 下期起生效]".

### 7.5 Emergency Stop / Restart / Delete a Plan
1. **Stop:** tap 急停 on any running plan (dashboard row, full-plan-list card, or plan-detail bar) → confirmation popup warns that unexecuted bets stop immediately and unused budget refunds instantly → confirm marks the plan "已停止" and shows an **undo-able toast**.
2. **Restart:** tap 重启 on a stopped/completed plan → popup shows a **last-round summary context box** (rounds played, stop reason, final P&L, with a warning if restarting will carry forward a loss) and offers **继续上一回合** (resume, keep stats) vs **重置设置并重新开始** (fresh restart, stats zeroed) — smart-defaulted based on whether the plan finished naturally (defaults to fresh) or was interrupted (defaults to resume). Choosing "reset & restart" routes through the **Start-Plan budget sheet** again; choosing "resume" instantly reactivates the plan with a toast.
3. **Delete:** tap 删除 on a stopped plan → confirmation popup warns deletion is irreversible and removes history → confirm removes the card and shows a toast.

### 7.6 Wallet Top-Up / Credit Request (Member Side)
1. From **Wallet**, tap **＋ 申请额度** → **Request Credit** screen.
2. Enter/select an amount (chips 100/300/500/1000/2000 or custom input); min/max constraints shown as a footnote (owner-configurable).
3. Tap **提交申请** → request is submitted for owner approval; user is routed back to Wallet where a **pending-request banner** now appears ("⏳ 申请 ¥300 · 待群主确认").
4. Tapping the banner (or the "记录" link on the Request screen) opens **Request History**, filterable by 待确认/已到账/已拒绝, to track outcome.
5. Once approved (owner-side, see 7.7), the amount appears as a credit-in row in **Wallet Flow** and increases the available balance shown on the Wallet hero card.

### 7.7 Group-Owner Approval (Credit / Join Requests)
1. Owner opens **群主面板 → 成员 → 待审批**, or taps the dashboard "N 件待处理" pending strip / a notification badge to land there directly.
2. Reviews **入群申请** (join requests) cards — approve/reject each with one tap; no further modal (immediate action in this prototype).
3. Reviews **额度申请** (credit-request) cards — each shows the requester's remaining balance and recent activity for context. If the owner's currently distributable balance (shown on the Overview hero/stat grid) is less than the requested amount, the **通过 (Approve)** button is disabled and a guard warning ("⚠ 可分配仅 240，不足批 600") is shown inline, forcing the owner to reject, wait for more distributable funds, or handle it manually elsewhere.
4. Approved/rejected items move to the **已处理 (Done)** sub-tab with a colored outcome chip, and the requester's own **Request History** updates correspondingly.
5. Separately, from **成员 → 全部成员**, the owner can drill into any member's **Member Detail** and, if needed, **冻结 (freeze)** them — required to pick a reason first — which blocks further betting/auto-bet for that member while preserving balance and in-flight bet settlement.

---

*End of specification. Source: `index.html` (2467 lines) + `shared/styles.css`, read in full.*
