/* アクセス解析(GoatCounter)の計測タグを、設定があるときだけ読み込む。公開ページ用。 */
(function () {
  const me = document.currentScript;
  if (!me) return;
  const base = me.src.replace(/assets\/counter\.js.*$/, "");
  fetch(base + "data/site.json?t=" + Date.now(), { cache: "no-store" })
    .then(r => r.ok ? r.json() : null)
    .then(c => {
      const code = c && String(c.counter || "").trim();
      if (!code || !/^[a-z0-9-]+$/i.test(code)) return;
      const s = document.createElement("script");
      s.async = true; s.src = "//gc.zgo.at/count.js";
      s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
      document.head.appendChild(s);
    }).catch(() => {});
})();
