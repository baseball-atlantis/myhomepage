/* 日記ページ共通の部品(通常は編集不要) */
const D = (() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const W = ["日","月","火","水","木","金","土"];
  const p2 = n => String(n).padStart(2, "0");
  function fmtDate(iso, withTime) {
    const d = new Date(iso); if (isNaN(d)) return "";
    let s = `${d.getFullYear()}.${p2(d.getMonth()+1)}.${p2(d.getDate())} (${W[d.getDay()]})`;
    if (withTime) s += ` ${p2(d.getHours())}:${p2(d.getMinutes())}`;
    return s;
  }
  const safeUrl = u => !/^\s*(javascript|data|vbscript):/i.test(u);
  function inline(t) {
    return t
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) => safeUrl(u) ? `<img src="${u}" alt="${a}" loading="lazy">` : m)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, u) => safeUrl(u) ? `<a href="${u}" target="_blank" rel="noopener">${a}</a>` : m)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  /* かんたんMarkdown: # 見出し / - リスト / > 引用 / ``` コード / **太字** / [リンク](URL) / ![画像](パス) */
  function md(src) {
    const lines = esc(src || "").replace(/\r/g, "").split("\n");
    let out = "", para = [], list = false, code = false, buf = [];
    const flushP = () => { if (para.length) { out += "<p>" + inline(para.join("<br>")) + "</p>"; para = []; } };
    const closeL = () => { if (list) { out += "</ul>"; list = false; } };
    for (const ln of lines) {
      if (ln.trim().startsWith("```")) {
        if (code) { out += "<pre><code>" + buf.join("\n") + "</code></pre>"; buf = []; code = false; }
        else { flushP(); closeL(); code = true; }
        continue;
      }
      if (code) { buf.push(ln); continue; }
      let m;
      if (!ln.trim()) { flushP(); closeL(); }
      else if ((m = ln.match(/^(#{1,3})\s+(.*)$/))) { flushP(); closeL(); const n = m[1].length + 1; out += `<h${n}>${inline(m[2])}</h${n}>`; }
      else if ((m = ln.match(/^[-*]\s+(.*)$/))) { flushP(); if (!list) { out += "<ul>"; list = true; } out += "<li>" + inline(m[1]) + "</li>"; }
      else if ((m = ln.match(/^&gt;\s?(.*)$/))) { flushP(); closeL(); out += "<blockquote>" + inline(m[1]) + "</blockquote>"; }
      else { closeL(); para.push(ln); }
    }
    if (code) out += "<pre><code>" + buf.join("\n") + "</code></pre>";
    flushP(); closeL();
    return out;
  }
  const excerpt = (body, n = 90) => String(body || "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/[#>*`\-\[\]()]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
  async function loadIndex() {
    const r = await fetch("index.json?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) throw new Error("index.json " + r.status);
    return (await r.json()).posts || [];
  }
  return { esc, fmtDate, md, excerpt, loadIndex };
})();
