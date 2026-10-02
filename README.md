# Study Notes(勉強の成果ホームページ)

## 一番かんたんな使い方:全部ブラウザの管理画面でできます
トップページ右上の **「✎ 投稿」** を押し、GitHubのトークンで本人確認すると管理画面(`write.html`)に進めます。
(確認済みの端末では、押すとそのまま開きます。`write.html` を直接開いてもOK。本人確認が済むまで編集画面は出ません)

タブで種類を切り替えます。
- **日記** … タイトルと本文。画像も追加できます
- **ノート** … ジャンル・一言説明・本文・画像。トップの「成果物」に並びます
- **資料(ファイル)** … PDF・Word・画像・ZIPなどをアップロード(20MBまで)。トップの「成果物」に並びます
- **作品(リンク)** … GitHubや公開ページのURLを登録。トップの「成果物」に並びます
- **サイト設定** … 名前・キャッチコピー・自己紹介・学んでいること・連絡先・学習の歩み・アクセスカウンターを変更
- 各タブの下の一覧から、**編集・削除**もできます
- 保存してから公開ページに反映されるまで1〜2分かかります

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
├─ data/content.js   サイトの初期内容(管理画面で変更すると data/site.json が優先される)
├─ diary/            日記(index.json=一覧、posts/=本文、img/=画像)
├─ notes/            ノート(同じ構成。view.html=表示ページ)
├─ files/            資料(index.json=一覧、up/=アップロードしたファイル)
├─ works/            作品リンク(index.json)
├─ assets/           デザイン・動き
└─ _template/        手書きノート用のひな形(通常は不要)
```

## アクセスカウンター(累計アクセス数)
トップの上部に「累計アクセス 1,234」と表示されます。無料のアクセス解析サービス GoatCounter を使います。
1. https://www.goatcounter.com/signup で登録(Code = 好きな英数字。例: my-study-notes)
2. GoatCounter にログイン → Settings → **「Allow adding visitor counts on your website」** にチェックして保存
3. 管理画面 →「サイト設定」→「アクセスカウンターのコード」に、1のCodeを入力して保存
- 数字の更新は最大4時間ほど遅れることがあります(GoatCounter側の仕様)
- 自分のアクセスを数えたくないときは、GoatCounterの管理画面のヘルプ「Prevent tracking my own pageviews」を参照
- 日記・ノート・トップの全ページが計測されます(管理画面は計測しません)

## 手書きで載せたいとき(任意)
`data/content.js` の `ITEMS` に書いた成果物も、一覧に表示されます(管理画面からは編集できません)。

## 公開方法(GitHub Pages)
1. このフォルダの中身をリポジトリのいちばん上にアップロード
2. Settings → Pages → Branch を `main` / `/ (root)`

## 注意
- 公開リポジトリのファイルは誰でも見られます(日記も)。個人情報・見られたくない内容は書かないでください。
- 日記・投稿画面は検索エンジンに載らない設定(noindex)にしてありますが、URLを知っていれば誰でも開けます。
- トークンは絶対に他人に渡さないでください。
