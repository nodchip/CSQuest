# 山と谷の追加教材：範囲・出典・検証

## 参照資料

- [Computer Science Curricula 2023, 最終報告書](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm)：AL-Foundational のグラフ探索・最短経路、および DM-Modeling / DM-Relational / DM-Querying のデータモデル・関係・問い合わせ。
- [MIT 6.006 Breadth-First Search](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf)：幅優先探索と道の数による最短経路。
- [MIT 6.006 Dijkstra 講義](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/071bb95535e7370893e27146d1287111_NSHizBK9JD8.pdf)：重み付き最短経路と非負の重みの条件。
- [PostgreSQL Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)：選択条件と同じ値に基づく結合の具体例。

## この教材が扱う範囲

５頂点・５本の有向道路を例に、幅優先探索の待ち列、ダイクストラ法の仮の時間の更新と確定、および道数と所要時間の比較を操作する。探索の隣接頂点の発見・距離更新は自動で行い、調べる頂点の順序をプレイヤーが選択する。尾根経由は２本11分、森と小川経由は３本６分。集落の仮時間は11分から６分に更新される。

谷では、隣り合う記録の入れ替えと番号検索、２条件の論理積による選択、番号の等しさに基づく荷物と届け先の結合を操作する。名前が同じでも番号の違う届け先を含める。扱うデータは架空の小さな固定例。

一般のグラフでの計算量・正しさの証明、負の重みや到達不能・同値候補の体系的な学習、SQL の構文、外部結合、NULL、集約、トランザクション、並行性、索引、データベース設計の全範囲は扱わない。この６件だけで CS2023 の当該分野を修了したとはしない。

## 検証

独立に計算した２経路の道数・所要時間と、待ち列・仮時間の推移を tests/adventure-expansion.test.js で確認する。誤った取り出し・誤った結合・部分履歴の復元と、データ選択の不足・過剰も検査する。表示と操作、再開は実画面で確認する。
