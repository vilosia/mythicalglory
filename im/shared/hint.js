/* ══════════════════════════════════════════════════════════════════════════
   IM168 · 说明气泡（ⓘ）· 2026-08-07
   ─────────────────────────────────────────────────────────────────────────
   Hector：各屏那些小字说明太占地方 —— 一律收进一个 ⓘ，点了才出来。

   用法（说明文字仍然写在 HTML 里，不是 JS 拼的 —— 前端要能直接提字做 i18n）：

     <span class="info-wrap">
       <button type="button" class="info-i" aria-label="说明" aria-expanded="false">i</button>
       <span class="info-pop" hidden>这里是原来那段小字…</span>
     </span>

   把 class 加成 "info-pop to-right" 可让气泡右对齐（图标靠屏幕右缘时用）。
   ⚠ 演示用脚本，不进交接：真实现里这应该是一个 Tooltip 组件。
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  function closeAll(except) {
    [].forEach.call(document.querySelectorAll('.info-wrap.open'), function (w) {
      if (w === except) return;
      w.classList.remove('open');
      var b = w.querySelector('.info-i'), p = w.querySelector('.info-pop');
      if (b) b.setAttribute('aria-expanded', 'false');
      if (p) p.hidden = true;
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.info-i') : null;
    if (!btn) {
      /* 点气泡里面不关（里面可能有链接）；点别处全关 */
      if (!(e.target.closest && e.target.closest('.info-pop'))) closeAll(null);
      return;
    }
    var wrap = btn.closest('.info-wrap'), pop = wrap.querySelector('.info-pop');
    var willOpen = !wrap.classList.contains('open');
    closeAll(wrap);
    wrap.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (pop) pop.hidden = !willOpen;
    e.stopPropagation();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
