# Study Notes(勉強の成果ホームページ)

## 一番かんたんな使い方:ブラウザで投稿する
トップページ右上の **「✎ 投稿」** を押し、GitHubのトークンで本人確認すると投稿画面に進めます。
(確認済みの端末では、押すとそのまま投稿画面が開きます)
直接 `https://ユーザー名.github.io/(リポジトリ名/)write.html` を開いてもOKです。本人確認が済むまで編集画面は表示されません。
- **日記** … タイトルと本文を書いて「投稿する」
- **ノート** … ジャンル・一言説明・かけた時間も入力。トップの「成果物」に自動で並びます
- **画像** … 「🖼 画像を追加」で本文に入ります(自動で軽くして保存されます)
- **編集・削除** … 画面下の「これまでの投稿」から
- 投稿後、公開ページへの反映まで1〜2分かかります

### 最初の1回だけ:初期設定
`write.html` の「初期設定」を開き、GitHubのトークンを入れます。
1. https://github.com/settings/personal-access-tokens/new を開く
2. Repository access → **Only select repositories** → このサイトのリポジトリだけ選ぶ
3. Permissions → Repository permissions → **Contents** を **Read and write**
4. Generate token → 表示された文字列を貼る(他人には見せない)

トークンは使っている端末のブラウザにだけ保存されます。端末ごとに1回設定が必要です。

## フォルダ構成
```
├─ index.html        トップページ
├─ write.html        投稿画面(日記・ノートをブラウザで書く)
├─ data/content.js   サイト名・自己紹介・手動の成果物(PDF/作品など)
├─ diary/            日記(index.json=一覧、posts/=本文、img/=画像)
├─ notes/            ノート(同じ構成。view.html=表示ページ)
├─ files/            PDFなどの資料
├─ assets/           デザイン・動き
└─ _template/        手書きノート用のひな形(通常は不要)
```

## PDF・作品を載せるとき(従来の方法)
- PDFは `files/分野名/` に置き、`data/content.js` の `ITEMS` に1件足す
  `{ title: "試験対策", type: "資料", date: "2026.10", desc: "要点まとめ。", file: "exam/summary.pdf" },`
- 作品は `repo: "https://github.com/..."` を書く

## 公開方法(GitHub Pages)
1. このフォルダの中身をリポジトリのいちばん上にアップロード
2. Settings → Pages → Branch を `main` / `/ (root)`

## 注意
- 公開リポジトリのファイルは誰でも見られます(日記も)。個人情報・見られたくない内容は書かないでください。
- 日記・投稿画面は検索エンジンに載らない設定(noindex)にしてありますが、URLを知っていれば誰でも開けます。
- トークンは絶対に他人に渡さないでください。
