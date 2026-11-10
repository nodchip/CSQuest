# DM-Relational：村の台帳の分解と結合

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.117–118、DM-Relational 2・6a の固定例。旧依頼67 `src/decomposition.js` と同じ元表と分解・結合を現行の谷で再利用するため、旧教材と独立の範囲として重複計上しない。現行の問合せ教材は複数一致・選択・射影を扱うが、分解後の元表復元と余分な組合せ、更新時の不整合をこの例で比較する。

元表は (O1,V1,森)、(O2,V1,森)、(O3,V2,森)。O1 だけ V1 の村名を更新すると、O2 の V1 と食い違う。射影で同じ行は１行にまとめる。注文側と村側を村番号で結ぶと元の３行、村名で結ぶと６行で O1/V2、O2/V2、O3/V1 が余分になる。SQLite の一時データベースで同じ表・`DISTINCT` 射影と内部結合を実行して独立に確認した。[PostgreSQL の結合の説明](https://www.postgresql.org/docs/current/tutorial-join.html) も参照。

３行の固定例における結果であり、任意の関係についての無損失性、関数従属性、依存性保存、一般の分解設計や実際の SQL 記述能力は評価しない。DM-Relational 全体の完成は示さない。

2026-11-11、実装担当と別の `review_candidate` が原典、[Stanford の分解と結合の講義](https://cs.stanford.edu/~ullman/fcdb/spr99/lec14.pdf)、SQLite による独立検算と画面・保存・開放条件を確認した。親担当が準備済み記録から幅 213・390・1200 px の現行谷の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。
