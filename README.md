# Study Notes(勉強の成果ホームページ)

## フォルダ構成

```
study-site/
├─ index.html          トップページ(基本いじらない)
├─ data/
│   └─ content.js      ★サイト名・自己紹介・成果物の一覧(ここを編集)
├─ notes/              ノート置き場(1ノート = 1フォルダ)
│   └─ js-basics/
│       └─ index.html
├─ files/              PDFなど資料置き場(分野ごとにフォルダ分け)
│   └─ english/
│       └─ expressions.pdf
├─ assets/             デザイン・動きのファイル(基本いじらない)
└─ _template/
    └─ note.html       ノートのひな形
```

## 成果物を追加する手順

### ノートを追加する
1. `notes/好きな名前/index.html` を作る(フォルダ名は英数字とハイフン。例:`english-grammar`)
2. `data/content.js` の `ITEMS` に1件足す
   ```js
   { title: "英文法メモ", type: "ノート", date: "2026.10",
     desc: "時制のまとめ。", note: "english-grammar" },
   ```

### PDFなどの資料を追加する
1. `files/分野名/ファイル名.pdf` に置く
2. `ITEMS` に1件足す
   ```js
   { title: "試験対策", type: "資料", date: "2026.10",
     desc: "要点まとめ。", file: "exam/summary.pdf" },
   ```

### 作品・コード(GitHubなど)を追加する
```js
{ title: "自作ツール", type: "作品", date: "2026.10",
  desc: "説明。", repo: "https://github.com/ユーザー名/リポジトリ名" },
```

## 公開方法(GitHub Pages)
1. このフォルダの中身をリポジトリのいちばん上にアップロードする
2. Settings → Pages → Branch を `main` / `/ (root)` にして保存
3. 1〜2分で `https://ユーザー名.github.io/リポジトリ名/` に公開される

## 注意
- 公開リポジトリのファイルは誰でも見られます。個人情報は入れないでください。
- `content.js` のカンマ(,)や括弧の書き忘れがあると、トップページが空になります。
