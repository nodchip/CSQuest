# 谷の結合と発送札：範囲と未完了

[CS2023 印字 118 ページ（PDF 118 ページ目）DM-Querying](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の CS Core は SQL の問合せ作成を含み、学習成果１は選択・射影・結合を含む複数の演算を組み合わせた問合せの作成を求めている。

今回の３依頼は、既存の `valley-query-lab` に加えて、一つのキーに複数の行が一致する内部結合、条件での行の絞り込み、二つの列への射影を固定模型で扱う。SQL のように重複行を残す例、関係代数の集合としての射影では重複を除くこと、結合結果が空の例を示す。操作は札の選択であり、自由な SQL の作成や SQL の実行、演算の一般的な組み立てを確認するものではない。成果１の和・共通部分・差・除算を含めた全体、相関副問合せ、プログラムからの利用、NULL・外部結合・一般の重複処理は未対応のままである。

`valley-query-join` と `valley-query-select` は物語の一区切りと４地域の後に開き、両方を達成すると `valley-query-compose` が開く。地域の依頼分類から選び、地図の全達成判定にも含まれる。

実装担当と別の `review_candidate` が原典、PostgreSQL の[表の結合](https://www.postgresql.org/docs/current/queries-table-expressions.html)と[出力列・重複](https://www.postgresql.org/docs/current/queries-select-lists.html)、各固定例の正答、説明、分類・保存をコード上で確認した。旧教材との差と未対応範囲も確認した。レビュー担当自身のブラウザ操作は行っていない。

`tests/endgame-query-join.test.js` は複数一致・非一致と選択・射影・保存履歴・誤答を検査する。SQLite での独立照合は重複する最初の射影と不一致の例を対象とし、他の例は別の固定期待値と手計算で確認した。`tests/valley-quest-groups.test.js` は分類・開放と全達成判定を検査する。

`scripts/endgame-query-join.playwright.js` は集いと４地域などの達成を用意した検証用記録から、213・390・1200 px 幅で分類からの到達、キーボードによる依頼と選択、誤答の修正、途中復元、段階開放、３依頼の達成と達成後の再開を確認した。新規開始からこの依頼群までの通し操作、実際のスクリーンリーダー音声、利用者による面白さの評価は未確認。
