/* トップページの表示処理(通常は編集不要) */
(async function () {
  const $ = id => document.getElementById(id);
  const esc = D.esc;

  /* 管理画面で保存したサイト設定(data/site.json)があれば上書きする */
  try {
    const r = await fetch("data/site.json?t=" + Date.now(), { cache: "no-store" });
    if (r.ok) {
      const c = await r.json();
      ["pill", "lead", "owner", "aboutTitle", "contactText", "contactLink", "counter"].forEach(k => { if (c[k]) SITE[k] = c[k]; });
      if (Array.isArray(c.title) && c.title[0]) SITE.title = c.title;
      if (Array.isArray(c.about) && c.about.length) SITE.about = c.about;
      if (Array.isArray(c.topics) && c.topics.length) SITE.topics = c.topics;
      if (Array.isArray(c.journey) && c.journey.length) JOURNEY.splice(0, JOURNEY.length, ...c.journey);
    }
  } catch (e) {}

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

  /* 管理画面で追加したノート・資料・作品を読み込んで、成果物に合流させる */
  const dot = iso => { const d = new Date(iso); const p = n => String(n).padStart(2, "0"); return isNaN(d) ? "" : `${d.getFullYear()}.${p(d.getMonth()+1)}.${p(d.getDate())}`; };
  const loadList = async dir => {
    try { const r = await fetch(dir + "/index.json?t=" + Date.now(), { cache: "no-store" }); return r.ok ? ((await r.json()).posts || []) : []; }
    catch (e) { return []; }
  };
  const [nt, fl, wk] = await Promise.all(["notes", "files", "works"].map(loadList));
  const base = p => ({ title: p.title, date: dot(p.date), desc: p.desc || "", });
  const dyn = [
    ...nt.map(p => ({ ...base(p), type: p.type || "ノート", view: "notes/view.html?id=" + encodeURIComponent(p.id) })),
    ...fl.map(p => ({ ...base(p), type: p.type || "資料", upload: p.path })),
    ...wk.map(p => ({ ...base(p), type: p.type || "作品", url: p.url }))
  ];
  const ALL = [...ITEMS, ...dyn];
  const diaryPosts = await loadList("diary");

  /* 数字のカウントアップ */
  const autoN = s => {
    const a = s.auto;
    if (a === "items") return ALL.length;
    if (a === "types") return new Set(ALL.map(i => i.type)).size;
    if (a === "diary") return diaryPosts.length;
    if (a && a.startsWith("type:")) return ALL.filter(i => i.type === a.slice(5)).length;
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
    if (i.view) out.push(["読む", i.view, false]);
    if (i.note) out.push(["読む", `notes/${i.note}/index.html`, false]);
    if (i.file) out.push(["PDFを開く", `files/${i.file}`, true]);
    if (i.upload) out.push([/\.pdf$/i.test(i.upload) ? "PDFを開く" : "ファイルを開く", i.upload, true]);
    if (i.url) out.push(["開く", i.url, true]);
    if (i.repo) out.push(["GitHub", i.repo, true]);
    (i.links || []).forEach(l => out.push([l[0], l[1], true]));
    return out;
  }
  const items = [...ALL].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

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

  /* 日記: 最新3件 */
  const latest = [...diaryPosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  if (latest.length) {
    $("diaryList").innerHTML = latest.map(p => `
      <a class="card" href="diary/post.html?id=${encodeURIComponent(p.id)}">
        <div class="meta"><span>${D.fmtDate(p.date)}</span></div>
        <h3>${esc(p.title)}</h3><p>${esc(p.excerpt || "")}</p>
      </a>`).join("");
    $("diary").hidden = false;
  }

  /* 累計アクセス数(GoatCounter) */
  const code = String(SITE.counter || "").trim();
  if (/^[a-z0-9-]+$/i.test(code)) {
    try {
      const r = await fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`);
      if (r.ok) {
        const n = parseInt(String((await r.json()).count).replace(/[^\d]/g, ""), 10);
        if (!isNaN(n)) {
          $("visitPill").hidden = false;
          const el = $("visitNum"), t0 = performance.now(), dur = 1400;
          const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))).toLocaleString("ja-JP"); if (p < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        }
      }
    } catch (e) {}
  }
})();
