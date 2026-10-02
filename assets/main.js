/* トップページの表示処理(通常は編集不要) */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

$("pill").textContent = SITE.pill;
$("h1").innerHTML = esc(SITE.title[0]) + '<br><span class="g">' + esc(SITE.title[1]) + '</span>';
$("lead").textContent = SITE.lead;
$("owner").textContent = SITE.owner;
$("y").textContent = new Date().getFullYear();
$("aboutTitle").textContent = SITE.aboutTitle;
$("aboutText").innerHTML = SITE.about.map(t => `<p>${esc(t)}</p>`).join("");
$("skills").innerHTML = SITE.topics.map(t => `<span class="skill">${esc(t)}</span>`).join("");
$("ctaText").textContent = SITE.contactText;
$("ctaBtn").href = SITE.contactLink;
$("tl").innerHTML = JOURNEY.map(j => `<div class="tl-i"><time>${esc(j.date)}</time><h4>${esc(j.title)}</h4><p>${esc(j.text)}</p></div>`).join("");

/* 数字のカウントアップ */
const autoN = s => {
  const a = s.auto;
  if (a === "items") return ITEMS.length;
  if (a === "types") return new Set(ITEMS.map(i => i.type)).size;
  if (a === "hours") return Math.round(ITEMS.reduce((t, i) => t + (+i.hours || 0), 0));
  if (a && a.startsWith("type:")) return ITEMS.filter(i => i.type === a.slice(5)).length;
  return s.n;
};
$("stats").innerHTML = SITE.stats.map(s =>
  `<div class="stat"><b><span data-n="${autoN(s)}">0</span>${esc(s.suffix)}</b><span class="lbl">${esc(s.label)}</span></div>`).join("");
document.querySelectorAll("[data-n]").forEach(el => {
  const end = +el.dataset.n, t0 = performance.now(), dur = 1400;
  const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
});

/* 成果物: リンクを組み立て、新しい順に並べる */
function linksOf(i) {
  const out = [];
  if (i.note) out.push(["読む", `notes/${i.note}/`, false]);
  if (i.file) out.push(["PDFを開く", `files/${i.file}`, true]);
  if (i.repo) out.push(["GitHub", i.repo, true]);
  (i.links || []).forEach(l => out.push([l[0], l[1], true]));
  return out;
}
const items = [...ITEMS].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

let current = "すべて";
["すべて", ...new Set(items.map(i => i.type))].forEach(t => {
  const b = document.createElement("button");
  b.className = "chip" + (t === current ? " on" : "");
  b.textContent = t;
  b.onclick = () => { current = t; [...$("chips").children].forEach(c => c.classList.toggle("on", c === b)); render(); };
  $("chips").appendChild(b);
});
function render() {
  const kw = $("q").value.trim().toLowerCase();
  const shown = items.filter(i => (current === "すべて" || i.type === current) &&
    (!kw || (i.title + i.desc + i.type).toLowerCase().includes(kw)));
  $("list").innerHTML = shown.length ? shown.map(i => `
    <article class="card">
      <div class="meta"><span class="tag">${esc(i.type)}</span><span>${esc(i.date || "")}</span></div>
      <h3>${esc(i.title)}</h3>
      <p>${esc(i.desc)}</p>
      <div class="links">${linksOf(i).map(l => `<a href="${esc(l[1])}"${l[2] ? ' target="_blank" rel="noopener"' : ""}>${esc(l[0])} →</a>`).join("")}</div>
    </article>`).join("") : '<div class="empty">見つかりませんでした</div>';
}
$("q").addEventListener("input", render);
render();
