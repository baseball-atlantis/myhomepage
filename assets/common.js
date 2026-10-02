/* 全ページ共通: テーマ切り替え + スクロール表示 */
(function () {
  const root = document.documentElement;
  try { const s = localStorage.getItem("theme"); if (s) root.dataset.theme = s; } catch (e) {}
  const btn = document.getElementById("theme");
  if (btn) btn.onclick = () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll(".rv").forEach(el => io.observe(el));
})();
