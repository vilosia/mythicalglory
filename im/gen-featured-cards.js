/* 大厅（hall.html）的精选卡是「跑」出来的，不手抄。
   ⚠ 2026-08-11：目标从 index.html 改成 <b>hall.html</b> —— index.html 已经变成
     一张转到策略页的转发页，旧大厅整屏搬去了 hall.html（导航上已退役，只留着对照）。
   ─────────────────────────────────────────────────────────────────────────
   为什么不手抄：卡上的曲线是 hall-plans.html 的 v15 引擎按固定种子模拟 1440 期算出来的
   （curvePath PTS=240 抽稀），手抄一次就死一次；跑一遍则两页永远同源同数。

   两种卡，各去各的地方：
     · 进行中卡（.bd-ocard，来自 MINE） → hall-plans.html#mine=代号 → 执行动态（进行中详情）
     · 模板卡  （.bd-card ，来自 PLANS）→ hall-plans.html#plan=代号 → L2 试算（模板详情）

   用法：node gen-featured-cards.js [目录] [进行中代号,…] [模板代号,…]
   默认：node gen-featured-cards.js .  C0404R5,C0506R5  B0404R10,C0303R12,B0505R10
   ⚠ hall.html 里 RUNNING/TEMPLATE 两对标记之间的内容会被整段覆盖，别手改。 */
const fs = require('fs');
const path = require('path');

const DIR = process.argv[2] || '.';
const WANT_MINE = (process.argv[3] || 'C0404R5,C0506R5').split(',').filter(Boolean);
const WANT_TPL = (process.argv[4] || 'B0404R10,C0303R12,B0505R10').split(',').filter(Boolean);
const src = fs.readFileSync(path.join(DIR, 'hall-plans.html'), 'utf8');

const blocks = [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let code = blocks.find(b => b.includes('function miniSpark'));
if (!code) { console.error('找不到引擎 script 块'); process.exit(2); }
/* 进行中卡在页面里第一张是展开的（露出线级明细）；大厅要收起态，
   所以跑完之后把 open 全关掉再渲染一次，捕获收起态的 HTML。 */
code += '\n;try{MINE.forEach(function(m){m.open=false;});renderMine();}catch(e){}';

/* ── 最小 DOM 假体：只为让引擎跑完 renderCards()/renderMine()，捕获它写出的 HTML ── */
const captured = {};
function makeEl(id) {
  const el = {
    id, _h: '', textContent: '', className: '', value: '', hidden: false, disabled: false,
    /* 2026-08-11：style 补上 CSSStyleDeclaration 的三个方法 —— 引擎的 syncStickyH()
       会调 documentElement.style.setProperty('--bd-stickyh',…)，之前是个裸对象，
       一调就抛，MINE 那两张进行中卡从此渲染不出来（本脚本已经坏了一阵子，不是这轮改坏的）。 */
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
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._h; },
    set(v) { this._h = v; captured[this.id] = v; },
  });
  return el;
}
const document = {
  body: makeEl('body'), documentElement: makeEl('html'), head: makeEl('head'),
  getElementById: (id) => makeEl(id),
  querySelector: () => makeEl('q'),
  querySelectorAll: () => [],
  createElement: (t) => makeEl(t),
  addEventListener() {}, removeEventListener() {},
  createDocumentFragment: () => makeEl('frag'),
};
const storage = { getItem: () => null, setItem() {}, removeItem() {} };
const window = {
  document, location: { hash: '', href: '', pathname: '' },
  addEventListener() {}, removeEventListener() {},
  sessionStorage: storage, localStorage: storage,
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  requestAnimationFrame: () => 0, getComputedStyle: () => ({ getPropertyValue: () => '' }),
  matchMedia: () => ({ matches: false, addListener() {}, addEventListener() {} }),
};

let err = null;
try {
  new Function('document', 'window', 'location', 'sessionStorage', 'localStorage',
    'setTimeout', 'setInterval', 'requestAnimationFrame', 'getComputedStyle', 'matchMedia', 'alert',
    code)(
    document, window, window.location, storage, storage,
    () => 0, () => 0, () => 0, window.getComputedStyle, window.matchMedia, () => {});
} catch (e) { err = e; }
if (err) console.error('（引擎抛错，若下面取到卡就不影响）：' + err.message);

/* ── 按 div 深度切出卡片 ── */
function splitCards(s, cls) {
  const out = [];
  const re = new RegExp('<div class="' + cls, 'g');
  let m;
  while ((m = re.exec(s))) {
    let depth = 0, end = m.index;
    const tag = /<\/?div\b/g; tag.lastIndex = m.index;
    let t;
    while ((t = tag.exec(s))) {
      depth += t[0] === '</div' ? -1 : 1;
      if (depth === 0) { end = t.index + 6; break; }
    }
    out.push(s.slice(m.index, end));
  }
  return out;
}
function indexByCode(cards, innerClass) {
  const map = {};
  cards.forEach(c => {
    const m = c.match(new RegExp('class="' + innerClass + '">([^<]+)<'));
    if (m) map[m[1].trim()] = c;
  });
  return map;
}
const tplCards = indexByCode(splitCards(captured['bdCards'] || '', 'bd-card"'), 'bd-code');
/* 2026-08-11：代号那一枚的类名早就从 bd-ohn 改成 "bd-code bd-ocode"（bd-ohn 只剩一条死 CSS），
   本脚本还在按旧类名找，于是两张进行中卡永远「没渲染出来」。一起修掉。 */
const mineCards = indexByCode(splitCards(captured['bdMine'] || '', 'bd-ocard'), 'bd-code bd-ocode');

const missing = [...WANT_MINE.filter(c => !mineCards[c]), ...WANT_TPL.filter(c => !tplCards[c])];
if (missing.length) { console.error('这些代号没渲染出来：' + missing.join(',')); process.exit(4); }

/* 大厅版的共同减法（结构/类名/数值一律不动）：
   ① 整卡包成链接 ② 去掉只有策略页才有脚本的假控件 ③ 去掉策略页的选中/展开钩子 */
function toLink(card, href) {
  let c = card;
  c = c.replace(/<i class="bd-vq bd-tipq"[^>]*>[\s\S]*?<\/i>/g, '');          // ⓘ 气泡触发点
  c = c.replace(/<u class="bd-term"[^>]*>([\s\S]*?)<\/u>/g, '$1');            // 术语虚线
  c = c.replace(/<div class="bd-ofoot">[\s\S]*?<\/div><\/div>$/, '</div>');   // 执行动态/急停按钮
  c = c.replace(/<span class="bd-ocv"[^>]*>[\s\S]*?<\/span>/g, '');           // 展开箭头
  c = c.replace(/ data-(p|m|tog|tipq|all)="[^"]*"/g, '')
       .replace(/ role="button"/g, '').replace(/ tabindex="0"/g, '');
  c = c.replace(/^<div class="([^"]+)"/, '<a class="$1" href="' + href + '" data-component="PlanCard"');
  c = c.replace(/<\/div>$/, '</a>');
  return c;
}
/* 模板卡：只加链接，不加类型标。
   2026-08-07（Hector）：卡上那枚「可套用」蓝标撤掉 —— 区块名已经叫「热门策略」，
   每张卡再重复一次是第二遍，而且它与 PK10 chip、倍投2× 药丸挤在同一行。
   ⚠ 这里必须一起改：否则重跑本脚本会把标签写回 hall.html。
   要恢复：把下面这行 replace 加回来
     .replace(/(<div class="bd-cardnm">[\s\S]*?)(<\/div>)/, '$1<span class="lob-tag lob-tpl">可套用</span>$2') */
function tplToLink(card, codeName) {
  return toLink(card, 'hall-plans.html#plan=' + codeName);
}
/* 进行中卡：「进行中」标紧跟代号 */
function mineToLink(card, codeName) {
  return toLink(card, 'hall-plans.html#mine=' + codeName)
    .replace(/(<span class="bd-ohn">[^<]*<\/span>(?:<span class="game-chip[^"]*">[^<]*<\/span>)?)/,
             '$1<span class="lob-tag lob-run">进行中</span>');
}

const INDENT = '              ';
function inject(page, startTag, endTag, htmls) {
  const a = page.indexOf(startTag), b = page.indexOf(endTag);
  if (a < 0 || b < 0) { console.error('hall.html 里找不到 ' + startTag); process.exit(5); }
  return page.slice(0, a + startTag.length) + '\n' +
    htmls.map(h => INDENT + h).join('\n') + '\n' + INDENT.slice(2) + page.slice(b);
}
const target = path.join(DIR, 'hall.html');
let page = fs.readFileSync(target, 'utf8');
page = inject(page, '<!-- RUNNING:START -->', '<!-- RUNNING:END -->',
  WANT_MINE.map(c => mineToLink(mineCards[c], c)));
page = inject(page, '<!-- TEMPLATE:START -->', '<!-- TEMPLATE:END -->',
  WANT_TPL.map(c => tplToLink(tplCards[c], c)));
fs.writeFileSync(target, page);
console.log('进行中卡：' + WANT_MINE.join(' / ') + '  → #mine=代号');
console.log('模板卡  ：' + WANT_TPL.join(' / ') + '  → #plan=代号');
