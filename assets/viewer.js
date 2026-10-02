/* 日記・ノートの個別ページ表示(posts/<id>.json を読み込む) */
(async function () {
  const app = document.getElementById("app");
  const id = new URLSearchParams(location.search).get("id");
  if (!id || !/^[\w-]+$/.test(id)) { app.innerHTML = '<p class="sec-lead">投稿が指定されていません。</p>'; return; }
  try {
    const r = await fetch(`posts/${id}.json?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    const p = await r.json();
    document.title = `${p.title} | Study Notes`;
    const tag = p.type ? `<span class="tag">${D.esc(p.type)}</span>` : "";
    app.innerHTML = `
      <div class="meta" style="justify-content:flex-start;gap:12px">${tag}<span>${D.fmtDate(p.date, true)}</span></div>
      <h1>${D.esc(p.title)}</h1>
      ${p.desc ? `<p class="sec-lead">${D.esc(p.desc)}</p>` : ""}
      <div class="article ${/^[a-z]+$/.test(p.spacing || "") ? "lh-" + p.spacing : ""}">${D.md(p.body)}</div>`;
  } catch (e) {
    app.innerHTML = '<p class="sec-lead">見つかりませんでした。投稿直後は、反映まで1〜2分かかることがあります。</p>';
  }
})();
