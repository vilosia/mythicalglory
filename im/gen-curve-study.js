/* 「真实的资金曲线该长什么样」—— 用 hall-plans.html 的 v15 引擎<真跑一遍>，把结果写成
   一份可以单独打开的研究页 curve-study.html。
   ─────────────────────────────────────────────────────────────────────────
   为什么要有这个东西（2026-08-11 · Hector：Based on the 策略 logic, show me a realistic
   graph based on some actual data）：产品里那张卡上的小图只有 200×38，看不出曲线的形状
   到底是不是策略逻辑推出来的。这一页把同一份数据放大画，并把每一段标上它的成因
   （等进场 / 在追第几回 / 中了回零 / 追满没中＝爆仓），这样形状可以逐段拿逻辑核对。

   数据不是编的：引擎种子固定（DRAWS 是伪随机但确定的），所以每次跑出来一模一样。

   用法：node gen-curve-study.js [目录]
   产出：<目录>/curve-study.html
   ⚠ 与 gen-featured-cards.js 同一手法（抽 script 块 ＋ 最小 DOM 假体），
     引擎有变动时两支都要重跑。 */
const fs = require('fs');
const path = require('path');

const DIR = process.argv[2] || '.';
const src = fs.readFileSync(path.join(DIR, 'hall-plans.html'), 'utf8');
const blocks = [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let code = blocks.find(b => b.includes('function runLane'));
if (!code) { console.error('找不到引擎 script 块'); process.exit(2); }

/* 把要的东西抛到外面来 —— 引擎是一整块顶层脚本，直接挂 window 上取 */
code += `
;__OUT.LANES=LANES;__OUT.DAY=DAY;__OUT.TOTAL=TOTAL;__OUT.MULT=MULT;__OUT.PAYOUT=PAYOUT;
__OUT.runLane=runLane;__OUT.dayStats=dayStats;__OUT.amtAt=amtAt;__OUT.capPerLane=capPerLane;
__OUT.MINE=MINE;__OUT.PLANS=PLANS;__OUT.GAMES=GAMES;__OUT.minePlan=minePlan;
__OUT.mineTpl=mineTpl;__OUT.gameName=gameName;__OUT.ruleText=ruleText;__OUT.planSpec=planSpec;
__OUT.shareMarket=shareMarket;__OUT.planLanes=planLanes;
`;

/* ── 最小 DOM 假体（照抄 gen-featured-cards.js，只多了 style.setProperty）── */
function makeEl(id) {
  const el = {
    id, _h: '', textContent: '', className: '', value: '', hidden: false, disabled: false,
    style: { setProperty() {}, removeProperty() {}, getPropertyValue() { return ''; } },
    dataset: {}, children: [], tabIndex: 0, offsetWidth: 100, scrollWidth: 100,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, removeEventListener() {}, appendChild() {}, removeChild() {},
    remove() {}, setAttribute() {}, removeAttribute() {}, getAttribute() { return null; },
    focus() {}, click() {}, blur() {}, scrollIntoView() {}, insertAdjacentHTML() {},
    closest() { return null; }, contains() { return false; },
    querySelector() { return makeEl('q'); }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { top: 0, left: 0, right: 0, bottom: 0, width: 100, height: 20 }; },
    getContext() { return null; },
  };
  Object.defineProperty(el, 'innerHTML', { get() { return this._h; }, set(v) { this._h = v; } });
  return el;
}
const document = {
  body: makeEl('body'), documentElement: makeEl('html'), head: makeEl('head'),
  getElementById: () => makeEl('x'), querySelector: () => makeEl('q'), querySelectorAll: () => [],
  createElement: (t) => makeEl(t), addEventListener() {}, removeEventListener() {},
  createDocumentFragment: () => makeEl('frag'),
};
const storage = { getItem: () => null, setItem() {}, removeItem() {} };
const window = { document, location: { hash: '', href: '', pathname: '' },
  addEventListener() {}, removeEventListener() {}, sessionStorage: storage, localStorage: storage,
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  requestAnimationFrame: () => 0, getComputedStyle: () => ({ getPropertyValue: () => '' }),
  matchMedia: () => ({ matches: false, addListener() {}, addEventListener() {} }) };

const __OUT = {};
try {
  new Function('document', 'window', 'location', 'sessionStorage', 'localStorage',
    'setTimeout', 'setInterval', 'requestAnimationFrame', 'getComputedStyle', 'matchMedia', 'alert', '__OUT',
    code)(document, window, window.location, storage, storage,
    () => 0, () => 0, () => 0, window.getComputedStyle, window.matchMedia, () => {}, __OUT);
} catch (e) { console.error('（引擎抛错）：' + e.message); }
if (!__OUT.runLane) { console.error('引擎没跑起来'); process.exit(3); }

const { LANES, DAY, TOTAL, PAYOUT, runLane, dayStats, amtAt, capPerLane, MINE, GAMES, minePlan } = __OUT;

/* ── 挑一个策略：C0404R5（进行中那张）—— 连开 4 期入场 · 跟投 · 倍投 3× · 追 5 回 · ¥10/注
      挑它的理由：倍投 3× ＋ 追 5 回 是「爆一次很痛」的典型配置（梯 10/30/90/270/810，
      单线一梯最多押 ¥1,210），曲线上「追的时候往下扎、中了跳回来、追满没中掉一大截」
      这三种形状都看得见。 */
const m = MINE.filter(x => x.code === 'C0404R5')[0];
const plan = minePlan(m);            /* {S,M,dir,mode,stake,mult,R} —— 引擎吃的形状 */
const LANE_IX = 1;                    /* LANES[1] = 冠军·大小 */
const lane = LANES[LANE_IX];

/* ① 单线全天逐注 */
const r = runLane(lane.seq, plan, DAY);
const start = lane.seq.length - DAY;

/* 逐期净盈亏 → 累计曲线（与产品里 laneCurveHTML 完全同一套算法） */
const per = new Array(DAY).fill(0);
r.bets.forEach(b => { per[b.i - start] += b.pl; });
const curve = []; let c = 0;
for (let i = 0; i < DAY; i++) { c += per[i]; curve.push(+c.toFixed(2)); }

/* ② 挑一个「含爆仓」的放大窗口：以第一次爆仓为中心，前后各留一段 */
const firstBust = r.bets.filter(b => b.bust)[0];
const ZW = 150;
let z0 = Math.max(0, (firstBust ? firstBust.i - start : 0) - Math.round(ZW * 0.62));
z0 = Math.min(z0, DAY - ZW);
const zoom = {
  from: z0, to: z0 + ZW,
  curve: curve.slice(z0, z0 + ZW),
  bets: r.bets.filter(b => (b.i - start) >= z0 && (b.i - start) < z0 + ZW)
              .map(b => ({ p: b.i - start, round: b.round, amt: b.amt, win: b.win, bust: b.bust, pl: +b.pl.toFixed(2) })),
};

/* ③ 整套策略一整天 —— 产品卡上那张小图画的就是这一份。
      2026-08-11：线数跟着产品改成<b>全选</b>（planLanes 现在恒等于 LANES.length），
      不再传 lanes，免得研究页与产品页画的是两份不同的东西。 */
const q = Object.assign({}, plan, { id: 'study:' + m.code, game: m.game });
const d = dayStats(q);

const out = {
  code: m.code, game: GAMES[m.game] || GAMES.pk,
  rule: `连开 ${plan.S === plan.M ? plan.S : plan.S + '–' + plan.M} 期入场 · ${plan.dir === 'follow' ? '跟投' : '反投'}`,
  money: `每注 ¥${plan.stake} · ${plan.mode === 'flat' ? '固定投' : '倍投 ' + plan.mult + '×'} · 追 ${plan.R} 回`,
  ladder: Array.from({ length: plan.R }, (_, k) => amtAt(plan, k + 1)),
  capPerLane: capPerLane(plan), payout: PAYOUT, day: DAY,
  lane: { name: lane.n, a: lane.a, b: lane.b,
          trig: r.trig, hits: r.hits, busts: r.busts, deep: r.deep,
          stake: +r.stake.toFixed(2), pl: +r.pl.toFixed(2), curve, zoom },
  plan: { lanes: __OUT.planLanes(q), curve: d.curve, bl: d.bl.map(o => ({ i: o.i, l: o.l, r: o.r, amt: o.amt, pl: +o.pl.toFixed(2), n: (LANES[o.l] || {}).n })), pl: +d.pl.toFixed(2) },
};

/* ④ 动态页那几张示例分享卡也要带曲线 —— 曲线不能手画，从引擎抽真的那一份下来。
      抽稀到 SPARKN 点：卡上那张图只有约 200px 宽，1440 点是浪费；爆仓位置按比例映射，
      「爆在哪一段」不会因为抽稀而挪位（但精确到期的下钻要看策略页，不在分享卡上）。 */
const SPARKN = 110;
/* ⚠ 口径必须与<策略页那张卡>一样：直接 dayStats(PLANS 里那一条)，不改 lanes、不改每注。
     第一版这里拿「进行中 ¥10/注 · 6 条线」跑，于是分享卡写 −¥574、而策略页卡上写 +¥128 ——
     同一个代号两个数，一屏之内自己打自己。模板一律按<b>每注 ¥1</b> 回测（货架的既定口径）。 */
function spark(code) {
  const tp = (__OUT.PLANS || []).filter(x => x.code === code)[0];
  if (!tp) return null;
  const dd = dayStats(tp);
  const n = dd.curve.length, step = (n - 1) / (SPARKN - 1);
  const cc = [];
  for (let k = 0; k < SPARKN; k++) cc.push(Math.round(dd.curve[Math.round(k * step)] * 100) / 100);
  const xx = [...new Set(dd.bx.map(i => Math.min(SPARKN - 1, Math.round(i / step))))];
  /* 分享卡上除了曲线，那七个字段也一起跑出来 —— 动态页就不必手抄任何一个数 */
  return { c: cc, x: xx, pl: Math.round(dd.pl * 100) / 100,
           busts: dd.bx.length,
           last: dd.bx.length ? (dd.curve.length - 1 - dd.bx[dd.bx.length - 1]) : null,
           lanes: __OUT.planLanes(tp),
           game: tp.game || 'pk', gameName: __OUT.gameName(tp),
           dir: (__OUT.mineTpl(tp).dir === 'break' ? '反投' : '跟投'),
           market: __OUT.shareMarket(tp),
           rule: __OUT.ruleText(tp).replace(/<\/?b>/g, ''),
           spec: __OUT.planSpec(tp) };
}
out.sparks = {};
['C0404R8', 'B0404R10', 'C0506R6', 'B0405R8', 'C0303R12', 'B0505R10'].forEach(cd => {
  const s = spark(cd); if (s) out.sparks[cd] = s;
});
Object.keys(out.sparks).forEach(k => {
  const s = out.sparks[k];
  console.log(`spark ${k}: 终值 ${s.pl} · 爆 ${s.busts} 次 · 距上次爆 ${s.last} 期 · 线 ${s.lanes}`);
});
/* 中间产物 curve-study.data.json 不再落盘 —— curve-study.html 是自包含的（数据内联），
   客户文件夹里不留一份没人开的 200KB JSON。要看原始数据就在这里加回这一行。 */
/* 动态页（hall-activity.html）读的那份 —— 与 gen-featured-cards.js 同一条原则：
   分享卡上的数与曲线是<b>跑出来的</b>，不手抄。引擎有变动就重跑这支。 */
fs.writeFileSync(path.join(DIR, 'shared', 'activity-sparks.js'),
  '/* 自动生成，别手改 —— node gen-curve-study.js . 会整档覆盖。\n'
  + '   来源：hall-plans.html 的 v15 引擎，按<货架卡口径>（每注 ¥1 · 今天一整天）跑 dayStats。\n'
  + '   动态页那几张示例分享卡的数字与曲线全部来自这里，所以与策略页卡上的数一定对得上。 */\n'
  + 'window.IM168_SPARKS=' + JSON.stringify(out.sparks) + ';\n');
console.log('动态页数据 → shared/activity-sparks.js');
console.log(`单线 ${lane.n}：触发 ${r.trig} 注 · 中 ${r.hits} · 爆 ${r.busts} · 最深 R${r.deep} · 合计 ${r.pl.toFixed(2)}`);
console.log(`整套 ${m.code}（${__OUT.planLanes(q)} 条线）：爆 ${d.bl.length} 次 · 一天合计 ${d.pl.toFixed(2)}`);
console.log(`放大窗口：第 ${z0 + 1}–${z0 + ZW} 期，含 ${zoom.bets.filter(b => b.bust).length} 次爆仓、${zoom.bets.length} 注`);


/* ══════════════════════════════════════════════════════════════════════════
   ⑤ 出页面：curve-study.html —— 单档自包含（数据内联，双击就能开，不用起服务）
   ══════════════════════════════════════════════════════════════════════════ */
function chart(curve, opts) {
  const o = Object.assign({ w: 1100, h: 300, pad: 26, marks: [], dots: [], labels: [] }, opts || {});
  const n = curve.length;
  const mn = Math.min(0, ...curve), mx = Math.max(0, ...curve), rg = (mx - mn) || 1;
  const X = k => o.pad + (n < 2 ? 0 : k / (n - 1) * (o.w - o.pad * 2));
  const Y = v => o.h - o.pad - ((v - mn) / rg) * (o.h - o.pad * 2);
  let d = '';
  for (let i = 0; i < n; i++) d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(curve[i]).toFixed(1) + ' ';
  const up = curve[n - 1] >= 0;
  const zero = Y(0);
  /* ✕ 打在<掉下来之前>那一点（峰），与产品同一条口径 */
  const marks = o.marks.map(k => {
    const x = X(k), y = Y(curve[k > 0 ? k - 1 : 0]), r = 5;
    return `<g class="x"><line x1="${(x - r).toFixed(1)}" y1="${(y - r).toFixed(1)}" x2="${(x + r).toFixed(1)}" y2="${(y + r).toFixed(1)}"/>`
         + `<line x1="${(x + r).toFixed(1)}" y1="${(y - r).toFixed(1)}" x2="${(x - r).toFixed(1)}" y2="${(y + r).toFixed(1)}"/></g>`;
  }).join('');
  const dots = o.dots.map(k => `<circle class="dot" cx="${X(k).toFixed(1)}" cy="${Y(curve[k]).toFixed(1)}" r="3.4"/>`).join('');
  const labels = o.labels.map(l => `<text class="lb" x="${X(l.k).toFixed(1)}" y="${(Y(curve[Math.max(0, l.k - 1)]) - 12).toFixed(1)}">${l.t}</text>`).join('');
  return `<svg class="ch" width="${o.w}" height="${o.h}" viewBox="0 0 ${o.w} ${o.h}">
    <line class="zero" x1="${o.pad}" y1="${zero.toFixed(1)}" x2="${o.w - o.pad}" y2="${zero.toFixed(1)}"/>
    <path class="fill ${up ? 'up' : 'dn'}" d="${d}L ${o.w - o.pad} ${zero.toFixed(1)} L ${o.pad} ${zero.toFixed(1)} Z"/>
    <path class="line ${up ? 'up' : 'dn'}" d="${d}"/>
    ${dots}${marks}${labels}
    <text class="ax" x="${o.pad}" y="14">最高 ${Math.round(mx)}</text>
    <text class="ax" x="${o.pad}" y="${o.h - 6}">最低 ${Math.round(mn)}</text>
  </svg>`;
}

const z = out.lane.zoom;
const zBust = z.bets.filter(b => b.bust).map(b => b.p - z.from);
const zRestart = zBust.map(k => k + 1).filter(k => k < z.curve.length);
const zLabels = z.bets.map(b => ({ k: b.p - z.from, t: (b.bust ? '爆' : 'R' + b.round) }));
const planBust = [...new Set(out.plan.bl.map(o2 => o2.i))];

const html = `<!DOCTYPE html>
<html lang="zh"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>策略逻辑 → 真实曲线长什么样 · IM168</title>
<!--
  这一页是<b>研究稿</b>，不是产品界面。2026-08-11（Hector：Based on the 策略 logic,
  show me a realistic graph based on some actual data）。
  数据全部由 hall-plans.html 的 v15 引擎真跑出来（node gen-curve-study.js .），一个数没手填；
  引擎种子固定，所以每次重跑都一样。要改就改生成脚本，别手改这一档 —— 会被整档覆盖。
-->
<style>
:root{--ink:#1c2534;--muted:#66738a;--faint:#94a1b5;--line:#e6eaf0;--page:#f5f7fa;
  --win:#16a34a;--red:#ef3939;--blue:#126bff;--tint:#eef4ff;--gold:#c08c38;}
*{margin:0;padding:0;box-sizing:border-box}
/* 2026-08-11（Hector：全站不要斜体）—— 这一页是自包含的，不加载 shared/styles.css，自己补 */
em,i,cite,dfn,var,address{font-style:normal}
body{font:14px/1.75 "Noto Sans SC",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  background:var(--page);color:var(--ink);padding:0 0 60px}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
header{background:linear-gradient(180deg,#3d93ff,#2278f5);color:#fff;padding:30px 0 26px;margin-bottom:22px}
header h1{font-size:23px;font-weight:800;letter-spacing:-.3px}
header p{font-size:13px;opacity:.94;margin-top:6px;max-width:820px}
h2{font-size:17px;font-weight:800;margin:30px 0 4px}
h2 small{display:block;font-size:12px;font-weight:400;color:var(--muted);margin-top:3px}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;margin-top:12px}
.scroll{overflow-x:auto}
.ch{display:block}
.ch .zero{stroke:#c9d2de;stroke-width:1;stroke-dasharray:4 4}
.ch .line{fill:none;stroke-width:1.6}
.ch .line.up{stroke:var(--win)}.ch .line.dn{stroke:var(--red)}
.ch .fill.up{fill:rgba(22,163,74,.10)}.ch .fill.dn{fill:rgba(239,57,57,.10)}
.ch .x line{stroke:var(--red);stroke-width:2.1;stroke-linecap:round}
.ch .dot{fill:var(--blue)}
.ch .lb{fill:var(--faint);font-size:9.5px;text-anchor:middle}
.ch .ax{fill:var(--faint);font-size:10px}
.kv{display:flex;flex-wrap:wrap;gap:0}
.kv>div{flex:1;min-width:120px;padding:8px 12px;border-left:1px solid var(--line)}
.kv>div:first-child{border-left:0}
.kv i{display:block;font-style:normal;font-size:11px;color:var(--muted)}
.kv b{display:block;font-size:17px;font-variant-numeric:tabular-nums;margin-top:2px}
.kv b.up{color:var(--win)}.kv b.dn{color:var(--red)}
table{width:100%;border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums}
th,td{padding:6px 8px;border-bottom:1px solid var(--line);text-align:right;white-space:nowrap}
th:first-child,td:first-child{text-align:left}
th{color:var(--muted);font-weight:600;font-size:11.5px;background:#fafbfd}
tr.bust td{background:rgba(239,57,57,.06)}
tr.win td{background:rgba(22,163,74,.05)}
.tag{display:inline-block;padding:1px 7px;border-radius:99px;font-size:11px;font-weight:700}
.tag.w{background:rgba(22,163,74,.12);color:var(--win)}
.tag.l{background:#eef1f5;color:var(--muted)}
.tag.b{background:rgba(239,57,57,.12);color:var(--red)}
.note{background:#fff;border:1px solid var(--line);border-left:4px solid var(--blue);
  border-radius:10px;padding:12px 14px;margin-top:12px;font-size:13px;color:var(--muted)}
.note b{color:var(--ink)}
.note.amber{border-left-color:var(--gold);background:#fffdf6}
.lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--muted);margin-top:10px}
.lg span{display:flex;align-items:center;gap:5px}
.sw{width:12px;height:12px;border-radius:3px;flex:none}
code{background:#eef1f5;border-radius:4px;padding:1px 5px;font-size:12px;color:#0b5adc}
</style></head><body>

<header><div class="wrap">
  <h1>策略逻辑 → 真实的资金曲线长什么样</h1>
  <p>数据是 <code>hall-plans.html</code> 的 v15 引擎<b>真跑出来的</b>（固定种子，可重现）：
     <b>${out.code}</b> · ${out.game} · ${out.rule} · ${out.money}。
     这一页把产品里那张 200×38 的小图放大，并把每一段标上它的成因，
     这样「形状对不对」可以逐段拿逻辑核对。</p>
</div></header>

<div class="wrap">

  <div class="card">
    <div class="kv">
      <div><i>倍投梯（每回合押多少）</i><b>${out.ladder.map(v => '¥' + v).join(' → ')}</b></div>
      <div><i>单线一梯最多押</i><b>¥${out.capPerLane.toLocaleString('en-US')}</b></div>
      <div><i>赔率</i><b>${out.payout}</b></div>
      <div><i>一天几期</i><b>${out.day}</b></div>
    </div>
  </div>
  <div class="note">
    <b>逻辑一句话</b>：某条线连开 ${out.rule.replace(/连开 | 期入场.*/g, '')} 期同一边 → 进场按梯子押；
    <b>中了就回第 1 回</b>（梯子清零）；<b>没中就升一回</b>；
    升到第 ${out.ladder.length} 回还没中 → <b>爆仓</b>，这一梯的钱全亏，回到第 1 回重新等。
    所以曲线只有三种形状：<b>横着走</b>（没到进场条件）、<b>小步上下</b>（前几回合进出）、
    <b>一根深坑</b>（追到后段，坑深＝那一梯累计押进去的钱）。
  </div>

  <h2>① 一条线，放大看<small>${out.lane.name} · 第 ${z.from + 1}–${z.to} 期 · 每个点标着它是第几回合（爆 ＝ 追满没中）</small></h2>
  <div class="card scroll">
    ${chart(z.curve, { w: 1120, h: 300, marks: zBust, dots: zRestart, labels: zLabels })}
    <div class="lg">
      <span><i class="sw" style="background:var(--win)"></i>累计盈亏（这条线自己的）</span>
      <span><i class="sw" style="background:var(--red)"></i>✕ ＝ 爆仓，打在<b>掉下来之前</b>那一点（峰）</span>
      <span><i class="sw" style="background:var(--blue)"></i>● ＝ 爆完之后重新开始的那一点</span>
    </div>
  </div>
  <div class="note">
    看第一段：连着几个 <b>R1</b> 都是小幅上下 —— 进场就中，梯子没爬起来。
    真正让曲线掉一大块的是 <b>R${out.ladder.length} 那根</b>：前面 R1→R${out.ladder.length - 1} 一路加码，
    最后一回还是没中，一梯 ¥${out.capPerLane.toLocaleString('en-US')} 全亏。
    <b>✕ 在坑口不在坑底</b> —— 爆的那一刻你还站在最高点，钱是在结算之后才掉下去的。
  </div>

  <div class="card scroll">
    <table><thead><tr><th>期</th><th>回合</th><th>押</th><th>结果</th><th>这一注盈亏</th></tr></thead><tbody>
    ${z.bets.map(b => `<tr class="${b.bust ? 'bust' : (b.win ? 'win' : '')}">
      <td>第 ${b.p + 1} 期</td><td>R${b.round}</td><td>¥${b.amt}</td>
      <td><span class="tag ${b.bust ? 'b' : (b.win ? 'w' : 'l')}">${b.bust ? '爆' : (b.win ? '中' : '没中')}</span></td>
      <td style="color:${b.pl >= 0 ? 'var(--win)' : 'var(--red)'}">${b.pl >= 0 ? '+' : '−'}¥${Math.abs(b.pl).toFixed(2)}</td></tr>`).join('')}
    </tbody></table>
  </div>

  <h2>② 同一条线，一整天<small>${out.day} 期 · 触发 ${out.lane.trig} 注 · 中 ${out.lane.hits} · 爆 ${out.lane.busts} · 最深追到 R${out.lane.deep}</small></h2>
  <div class="card scroll">
    ${chart(out.lane.curve, { w: 1400, h: 240, marks: (function () { const s2 = []; let last = -99; out.lane.curve.forEach(() => {}); return s2; })() })}
    <div class="kv" style="margin-top:10px">
      <div><i>这条线一天合计</i><b class="${out.lane.pl >= 0 ? 'up' : 'dn'}">${out.lane.pl >= 0 ? '+' : '−'}¥${Math.abs(out.lane.pl).toFixed(2)}</b></div>
      <div><i>一天押出去</i><b>¥${out.lane.stake.toLocaleString('en-US')}</b></div>
      <div><i>命中率</i><b>${Math.round(out.lane.hits / out.lane.trig * 100)}%</b></div>
      <div><i>爆仓</i><b class="${out.lane.busts ? 'dn' : ''}">${out.lane.busts} 次</b></div>
    </div>
  </div>
  <div class="note">
    一整天看：单条线的曲线是<b>一串小台阶 ＋ 偶尔一根深坑</b>。命中率 ${Math.round(out.lane.hits / out.lane.trig * 100)}% 看着不低，
    但赔率 ${out.payout} 意味着<b>每中一注只赚回 ${(out.payout - 1).toFixed(2)} 倍</b>，
    所以「中得多」不等于赚 —— 决定输赢的是<b>爆几次</b>。
  </div>

  <h2>③ 整套策略（${out.plan.lanes} 条线合起来），一整天<small>产品里卡片上那张小图画的就是这一份 —— 爆 ${planBust.length} 次</small></h2>
  <div class="card scroll">
    ${chart(out.plan.curve, { w: 1400, h: 260, marks: planBust })}
  </div>
  <div class="note">
    <b>为什么整套的图看起来「毛」得多</b>：${out.plan.lanes} 条线各自在追各自的梯子，
    每一期都有好几条线同时在动，所以曲线是 ${out.plan.lanes} 条独立台阶叠加的结果 ——
    单看一条线是「台阶＋深坑」，叠起来就成了连续抖动的走势。
    <b>✕ 密</b>也是同一个原因：一条线一天爆 ${out.lane.busts} 次，${out.plan.lanes} 条线一天就爆 ${planBust.length} 次。
    这正是 Alex 要的口径 ——「不管哪一条线爆，都要标出来」。
  </div>
  <div class="card scroll">
    <table><thead><tr><th>第几次</th><th>线路</th><th>期</th><th>回合</th><th>那一注</th><th>亏</th></tr></thead><tbody>
    ${out.plan.bl.slice(0, 40).map((o2, i2) => `<tr class="bust"><td>${i2 + 1}</td><td>${o2.n || '?'}</td>
      <td>第 ${o2.i + 1} 期</td><td>R${o2.r}</td><td>¥${Math.round(o2.amt)}</td>
      <td style="color:var(--red)">−¥${Math.abs(o2.pl).toFixed(2)}</td></tr>`).join('')}
    </tbody></table>
    ${out.plan.bl.length > 40 ? `<p style="margin-top:8px;color:var(--faint);font-size:12px">只列前 40 次，共 ${out.plan.bl.length} 次。</p>` : ''}
  </div>

  <div class="note amber">
    <b>这一页是研究稿，不是产品界面</b>：数据来自固定种子的形态样本，不是真实开奖；
    赔率取 ${out.payout}（接真数据时要统一口径）。
    重跑：<code>node gen-curve-study.js .</code> —— 会整档覆盖这一页。
  </div>

</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'curve-study.html'), html);
console.log('研究页 → curve-study.html');
