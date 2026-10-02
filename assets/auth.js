/* トップページの「✎ 投稿」ボタン:GitHubトークンで本人確認してから投稿画面へ */
(function () {
  const btn = document.getElementById("postBtn");
  if (!btn) return;
  const load = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  function guess() {
    const m = location.hostname.match(/^(.+)\.github\.io$/);
    if (!m) return {};
    const segs = location.pathname.split("/").filter(Boolean).filter(s => !/\.html?$/.test(s));
    return { owner: m[1], repo: segs.length ? segs[0] : m[1] + ".github.io" };
  }
  async function verify(c) {
    if (!c.token || !c.owner || !c.repo) return "ユーザー名・リポジトリ名・トークンを入力してください。";
    try {
      const r = await fetch(`https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}`, { headers: { Authorization: "Bearer " + c.token } });
      if (r.status === 401) return "トークンが正しくないか、期限切れです。";
      if (r.status === 404) return "リポジトリが見つかりません(名前、またはトークンの対象リポジトリを確認してください)。";
      if (!r.ok) return "確認に失敗しました(" + r.status + ")";
      const j = await r.json();
      if (!(j.permissions && j.permissions.push)) return "書き込み権限がありません。トークンの Contents を Read and write にしてください。";
      return "";
    } catch (e) { return "通信に失敗しました。"; }
  }
  const go = () => { location.href = "write.html"; };

  let box;
  function modal(c) {
    if (box) { box.hidden = false; return; }
    const g = guess();
    box = document.createElement("div");
    box.className = "modal";
    box.innerHTML = `<div class="modal-card" role="dialog" aria-label="本人確認">
      <h3>投稿の本人確認</h3>
      <p class="help">GitHubのトークンで確認します。トークンを持っている本人だけが投稿画面に進めます。</p>
      <label class="field"><span>トークン</span><input id="aToken" type="password" autocomplete="off" placeholder="github_pat_..."></label>
      <details><summary class="help" style="cursor:pointer">ユーザー名・リポジトリ名を変更</summary>
        <div class="row">
          <label class="field"><span>ユーザー名</span><input id="aOwner" autocomplete="off"></label>
          <label class="field"><span>リポジトリ名</span><input id="aRepo" autocomplete="off"></label>
        </div></details>
      <div class="status" id="aStatus"></div>
      <div class="bar"><button class="btn p sm" id="aOk">確認して進む</button><button class="btn sm" id="aCancel">閉じる</button></div>
    </div>`;
    document.body.appendChild(box);
    box.querySelector("#aOwner").value = c.owner || g.owner || "";
    box.querySelector("#aRepo").value = c.repo || g.repo || "";
    const st = box.querySelector("#aStatus");
    const close = () => { box.hidden = true; };
    box.querySelector("#aCancel").onclick = close;
    box.addEventListener("click", e => { if (e.target === box) close(); });
    box.querySelector("#aOk").onclick = async () => {
      const nc = { ...c, owner: box.querySelector("#aOwner").value.trim(), repo: box.querySelector("#aRepo").value.trim(), token: box.querySelector("#aToken").value.trim() };
      st.textContent = "確認中…"; st.className = "status show info";
      const err = await verify(nc);
      if (err) { st.textContent = err; st.className = "status show err"; return; }
      save("ghcfg", JSON.stringify(nc)); go();
    };
    box.querySelector("#aToken").addEventListener("keydown", e => { if (e.key === "Enter") box.querySelector("#aOk").click(); });
    box.querySelector("#aToken").focus();
  }

  btn.addEventListener("click", async e => {
    e.preventDefault();
    let c = {}; try { c = JSON.parse(load("ghcfg") || "{}"); } catch (err) {}
    if (c.token) {  // 保存済みのトークンが有効なら、そのまま進む
      if (!c.owner || !c.repo) Object.assign(c, guess());
      if (!(await verify(c))) return go();
    }
    modal(c);
  });
})();
