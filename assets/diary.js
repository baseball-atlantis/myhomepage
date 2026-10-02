/* 日記・ノート共通の部品(通常は編集不要) */
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
  const SIZES = { small: "fs-s", large: "fs-l", xlarge: "fs-xl", xxlarge: "fs-xxl" };
  const HEX = "#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})";

  function inline(t) {
    // `コード` は中身を装飾しないよう、いったん退避する
    const codes = [];
    t = t.replace(/`([^`]+)`/g, (m, c) => { codes.push(c); return "\u0000" + (codes.length - 1) + "\u0000"; });
    t = t
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)(?:\{w=(\d{1,3})\})?/g, (m, a, u, w) =>
        safeUrl(u) ? `<img src="${u}" alt="${a}" loading="lazy"${w ? ` style="width:${Math.min(100, +w)}%"` : ""}>` : m)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, u) => safeUrl(u) ? `<a href="${u}" target="_blank" rel="noopener">${a}</a>` : m)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
      // 文字装飾: [b] [u] [s] [mark] [size=large] [color=#ff0000] [bg=#ffff00]
      .replace(/\[(b|u|s|mark)\]([\s\S]*?)\[\/\1\]/g, (m, k, c) => { const tag = { b: "strong", u: "u", s: "del", mark: "mark" }[k]; return `<${tag}>${c}</${tag}>`; })
      .replace(/\[size=(small|large|xlarge|xxlarge)\]([\s\S]*?)\[\/size\]/g, (m, s, c) => `<span class="${SIZES[s]}">${c}</span>`)
      .replace(new RegExp(`\\[color=(${HEX})\\]([\\s\\S]*?)\\[\\/color\\]`, "g"), (m, h, c) => `<span style="color:${h}">${c}</span>`)
      .replace(new RegExp(`\\[bg=(${HEX})\\]([\\s\\S]*?)\\[\\/bg\\]`, "g"), (m, h, c) => `<span style="background:${h};padding:0 .15em;border-radius:3px">${c}</span>`);
    return t.replace(/\u0000(\d+)\u0000/g, (m, i) => "<code>" + codes[+i] + "</code>");
  }

  /* かんたんMarkdown + 装飾タグ
     # 見出し / - リスト / 1. 番号リスト / > 引用 / --- 区切り線 / ``` コード / **太字** / *斜体* / [文字](URL) / ![画像](パス){w=50}
     [b][u][s][mark] / [size=small|large|xlarge|xxlarge] / [color=#ff0000] / [bg=#ffff00]
     行だけの [left] [center] [right] ... [/right] で、間の段落をまとめて寄せる */
  function md(src) {
    const lines = esc(src || "").replace(/\r/g, "").split("\n");
    let out = "", para = [], list = "", code = false, buf = [], depth = 0;
    const flushP = () => { if (para.length) { out += "<p>" + inline(para.join("<br>")) + "</p>"; para = []; } };
    const closeL = () => { if (list) { out += `</${list}>`; list = ""; } };
    const openL = tag => { if (list !== tag) { closeL(); out += `<${tag}>`; list = tag; } };
    for (const ln of lines) {
      if (ln.trim().startsWith("```")) {
        if (code) { out += "<pre><code>" + buf.join("\n") + "</code></pre>"; buf = []; code = false; }
        else { flushP(); closeL(); code = true; }
        continue;
      }
      if (code) { buf.push(ln); continue; }
      let m;
      if ((m = ln.trim().match(/^\[(\/?)(left|center|right)\]$/))) {
        flushP(); closeL();
        if (m[1]) { if (depth > 0) { out += "</div>"; depth--; } }
        else { out += `<div class="al-${m[2]}">`; depth++; }
      }
      else if (!ln.trim()) { flushP(); closeL(); }
      else if (/^(-{3,}|\*{3,})\s*$/.test(ln)) { flushP(); closeL(); out += "<hr>"; }
      else if ((m = ln.match(/^(#{1,3})\s+(.*)$/))) { flushP(); closeL(); const n = m[1].length + 1; out += `<h${n}>${inline(m[2])}</h${n}>`; }
      else if ((m = ln.match(/^[-*]\s+(.*)$/))) { flushP(); openL("ul"); out += "<li>" + inline(m[1]) + "</li>"; }
      else if ((m = ln.match(/^\d+[.)]\s+(.*)$/))) { flushP(); openL("ol"); out += "<li>" + inline(m[1]) + "</li>"; }
      else if ((m = ln.match(/^&gt;\s?(.*)$/))) { flushP(); closeL(); out += "<blockquote>" + inline(m[1]) + "</blockquote>"; }
      else { closeL(); para.push(ln); }
    }
    if (code) out += "<pre><code>" + buf.join("\n") + "</code></pre>";
    flushP(); closeL();
    while (depth-- > 0) out += "</div>";
    return out;
  }
  const excerpt = (body, n = 90) => String(body || "")
    .replace(/!\[[^\]]*\]\([^)]*\)(\{w=\d+\})?/g, "")
    .replace(/\[\/?(?:b|u|s|mark|size(?:=\w+)?|color(?:=#?\w+)?|bg(?:=#?\w+)?|left|center|right)\]/g, "")
    .replace(/[#>*`\-\[\]()]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
  async function loadIndex() {
    const r = await fetch("index.json?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) throw new Error("index.json " + r.status);
    return (await r.json()).posts || [];
  }
  return { esc, fmtDate, md, excerpt, loadIndex };
})();
