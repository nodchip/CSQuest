# 左外部結合と右側条件：教材監査

[CS2023 DM-Querying 印字118頁](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf#page=118) の SQL による結合の固定例。旧 `src/outer-join.js` は内部・左結合の多対一と一致なしを操作し、現行の `endgame-records`・`endgame-query` は内部結合、`endgame-sql-null` は NULL 条件を扱う。今回の依頼は左結合と ON／WHERE の条件位置を結び付ける。

左表Ａ・Ｂ・Ｃ、右表Ａ赤・Ａ青・Ｂ青。番号で左結合はＡ赤・Ａ青・Ｂ青・Ｃ NULL。ON に赤も含めるとＡ赤・Ｂ NULL・Ｃ NULL。WHERE に赤を置くとＡ赤のみ。NULL と赤の比較は UNKNOWN となり WHERE が残す真ではない。Ｂは右表に青が存在しても、ON の赤条件には一致しない。SQLite の一時 DB で３結果を独立検算した（`tests/endgame-left-join-sqlite.py`）。表示順は説明用、SQL の順序を保証しない。

固定表には同一の重複行がなく多重度は未評価。任意の SQL 記述・実 DB 操作・一般の条件や NULL 演算は評価しない。物理的な実行順序は断定しない。[SQLite SELECT](https://www.sqlite.org/lang_select.html)、[PostgreSQL の結合表](https://www.postgresql.org/docs/current/queries-table-expressions.html) を参照。

2026-11-11、実装担当と別の `signed_review` が原典と SQLite・PostgreSQL の一次資料に照らし、３結果・NULL の UNKNOWN・ON 不一致と一対多、画面・保存・開放を独立レビューし、SQLite の一時 DB でも検算した。親担当が準備済み記録から幅 213・390・1200 px の谷の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。
