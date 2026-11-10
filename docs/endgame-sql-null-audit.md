# DM-Querying：NULL と条件（部分対応）

[CS2023 原典](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 p.118 の DM-Querying 1a の SQL 選択条件に関わる固定条件の体験。現行の谷では内部結合・選択・射影を扱うが NULL の３値論理を扱わない。旧依頼1073 は NULL を含む条件更新を既に扱うため、関連・重複を独立した完了範囲として数えない。

数量５・７・NULL の３行。数量＝５は真・偽・不明、IS NULL は偽・偽・真、NOT (数量＝５) は偽・真・不明、数量＝５ OR 数量 IS NULL は真・偽・真。WHERE は真の行のみ残す。NULL と比較した等号は不明であり、NULL をゼロや空文字と同一視しない。[SQLite の式](https://www.sqlite.org/lang_expr.html)を参照し `python scripts/check-sql-null.py` で独立した SQLite の CASE と WHERE の結果を照合する。

固定された４条件と３行で、実際の SQL 記述・接続、他の演算子、制約・集計・結合における NULL、任意の式や実用データは評価しない。SQL 全般や DM 全体を完成したとは扱わない。

実装担当とは別の `review_candidate` が原典と SQLite の式、４条件の真偽と選択を SQLite で確認し、SQL の３値論理を関係代数そのものと対応させないよう指摘した。原典への対応を SQL 条件の固定例に限定した修正後、画面・誤答・保存履歴・分類と開放を再確認し、関連６テストも成功した。実 SQL の作成などを検証したものではなく、レビュー担当自身はブラウザを操作していない。SQLite 検算は Pages ワークフローでも実行する。

`scripts/endgame-sql-null.playwright.js` は集いと４地域の達成状態を用意した検証用記録から、213・390・1200 px 幅で分類経由の到達、キーボード操作、誤答案内、途中保存・再開、段階開放と達成後の再開を確認した。新規開始からこの依頼への通し操作、実際のスクリーンリーダー音声や利用者による面白さの評価は未確認。
