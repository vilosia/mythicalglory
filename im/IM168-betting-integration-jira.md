# IM168 · Bet Integration (Phase B) — Jira

## Description

IM168 is a private chat platform for lottery-player communities (a WeChat/Telegram replacement),
structured as Channels containing Chat Groups, and deliberately not distributed through app stores.

Phase B embeds betting into that chat experience via a special group type — the **游戏厅** — where members
place bets, run automated strategies, and talk in the same room. Betting depends entirely on the client's
existing lottery platform for accounts, credit, odds and draw data.

Commercially, members' bets are merged behind the scenes into a single **群投 (group bet)** placed by the
group owner's platform account; the owner earns a configured margin on the odds difference. This is settled
server-side and must remain completely invisible to members.

Manual betting accounts for roughly 10% of turnover, so **策略投注 (strategy betting) is the landing
experience** and manual betting sits in a secondary tab.

## Scope & constraints

- Mobile-first; no app store distribution. Web may need lazy-loading/code-splitting.
- Hard dependency on the client's existing lottery platform (accounts, credit, odds, draws).
- **No Backoffice** — commission settings live in the app, owner-side.
- First lottery types: SG飞艇 and SSC (时时彩); architecture must extend to more.
- Design system: Noto Sans SC, primary `#126BFF`, alert `#EF3939`, light theme.

## Roles

- **Owner (群主)** — converted from an existing lottery-platform player. Creates channels/groups, holds the
  master credit, approves member credit requests, bets on members' behalf, sets commission %, views member bets.
- **Member** — invited. Bets manually, runs strategies, chats/shares/follows, requests credit, sees own wallet.

## Requirements

**Structure & navigation**
- 游戏厅 bottom nav: 策略 / 动态 / 彩票 / 开奖 / 明细
- 策略 is the landing screen — entering the game hall from chat lands here
- Manual betting lives in 彩票; there is no standalone game hall landing page

**策略投注 (primary)**
- Dashboard-first: the first screen lists all strategies with status, P/L and latest execution — not horizontal
  plan tabs, which hide later plans once the count grows
- Creating a plan shows Templates/Presets first, then Customize
- Templates need: title, external preview, preview word limit, risk/mode tags
- Per-plan detail: entry rule (跟投/反投, streak threshold), base stake, multiplier and cap, take-profit /
  stop-loss, per-period and cumulative caps
- Command-driven operation (`/amt`, `/rnd`, `/mul`, `/tp`, `/sl`, plus stop/resume) — parse and confirm before
  anything takes effect; minimise manual clicking
- Plan controls: **急停** (with confirmation) and **重启** only — no general 暂停. Restart must ask: continue the
  previous round, or reset and start fresh
- Editing a running plan must confirm "apply now" vs "apply next period"
- Multiple concurrent plans; warn on cumulative credit exposure and on opposing bets in the same market
- Strategy overview shows one row per plan: code · this period's stake and bet count · cumulative P/L ·
  current round. Running plans pinned above stopped. Round warning: amber at 2/3 of course, red on the final round
- Bust (爆仓) markers: mark every bust, on the curve peak, undistorted at any width, tappable for
  lane · period · round · stake · loss

**彩票 (manual betting)**
- Number selection within approved credit, with a per-bet 分享下注 toggle
- Timer and status merged into one line (e.g. 投注时间还剩 11分11秒); 单注回报 wording becomes 可赢
- Streak (长龙) chips open a sheet to set amount and 跟投/反投 before entering the betslip — never bet on tap
- Left play-type column excludes 快捷 / 长龙 / 遗漏

**动态 (broadcast feed)**
- Read-only channel — no posting or replies
- Strategy share cards (primary) and system notices (secondary)
- Official/expert accounts get a gold frame; card contents otherwise identical. Mute action included
- Shares are frozen snapshots, labelled as such — live updating is ruled out on cost and connection stability

**Chat & follow**
- Full-page chat; header carries pinned message, announcements and search. No draw results strip
- **跟单**: following a shared bet notifies "X followed" only — never the amount. Follower's stake is their own
- Draw results are shown from the individual's perspective only — no group totals, no commission

**Credit: request → approval**
- Member requests an amount; owner approves, adjusts or rejects; credit lands only on approval
- Owner has a pending-approval queue; member can see their request status

**Commission & owner wallet**
- Owner sets and views commission % in-app
- Owner wallet is the primary dashboard, not a balance page: main wallet, earnings, total win, total withdrawn,
  pending approvals and amounts, transactions, member activity, plus settings and a time filter
- Owner sees members' **remaining** credit only, never amount spent

**Search**
- Available in 策略 and chat, not buried inside a listing
- Settled/unsettled lists need pagination

## Critical rule — permission visibility

Owner-side commercial operations (commission %, earnings, credit allocation and approval actions, group-bet
merging, margin) are **never visible to members** under any circumstance. Members see only their own activity
and what others have deliberately shared. Any screen or state that leaks this breaks the product's trust model.

## Open questions

1. Commission basis — stake, profit, or odds difference? Who can change it, and when?
2. Max concurrent strategies per member, and how cumulative credit exposure is capped
3. Follow-bet default stake — fixed, proportional, or entered each time?
4. Owner "sees remaining credit only" vs. owner needing per-bet visibility to place the group bet — how are
   these reconciled on screen?
5. Account linking method (SSO vs. imported registration) and distribution without app stores
6. Legal position on proxy betting, commission, and cross-platform funds — highest risk, worth clearing early
7. Naming collision: the strategy page's inner detail view and the main feed tab are both called 「动态」
