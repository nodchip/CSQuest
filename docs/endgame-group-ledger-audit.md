# DM-Querying：群ごとの集計（部分対応）

[CS2023 原典](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 p.118、DM-Querying 1a の SQL 問い合わせに関連する固定例。現行の谷では内部結合・選択・射影と NULL の３値論理を扱う。旧教材には集約結果からの推測や NULL を含む更新があり、関連・重複を考慮する。今回の固定表は群別 COUNT・SUM と WHERE／HAVING の順を操作する。

地域Ａの数量は２・２・NULL、Ｂは３・３、Ｃは NULL。COUNT(*)／COUNT(数量)／SUM(数量) はＡ＝３／２／４、Ｂ＝２／２／６、Ｃ＝１／０／NULL。NULL はゼロや空文字ではない。WHERE 数量≧３を先に適用するとＢ合計６だけ、群に分けてから HAVING SUM(数量)≧３を適用するとＡ合計４・Ｂ合計６。Ｃの NULL との比較は不明で残らない。これは問い合わせの論理上の扱いであり、データベース内部の物理的な実行順を断定しない。`python scripts/check-group-ledger.py` は独立した SQLite の４問合せで結果を照合する。

参考：[SQLite の集約関数](https://www.sqlite.org/lang_aggfunc.html)、[SELECT と GROUP BY・HAVING](https://www.sqlite.org/lang_select.html)。固定６行・限られた式の模型であり、実SQLの作成・接続、空表・他の集約や一般の問い合わせを評価しない。

実装担当とは別の `review_candidate` が原典・SQLite と４問い合わせの固定結果、各画面の重複行・NULL・論理上の WHERE と HAVING、誤答・履歴、分類と開放、旧記録の既定値を確認した。関連６テストも成功した。任意 SQL の作成・実データを検証したものではなく、レビュー担当自身はブラウザを操作していない。SQLite 検算は Pages ワークフローでも実行する。

`scripts/endgame-group-ledger.playwright.js` は集いと４地域の達成状態を用意した検証用記録から、213・390・1200 px 幅で分類経由の到達、キーボード操作、誤答案内、途中保存・再開、段階開放と達成後の再開を確認した。新規開始からこの依頼への通し操作、実際のスクリーンリーダー音声や利用者による面白さの評価は未確認。
