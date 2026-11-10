# 庭の事実・規則・文字合わせ：範囲と未完了

[CS2023 印字 133 ページ（PDF 133 ページ目）FPL-Logic](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) は、関係・事実・規則・目標と単一化を含み、KA Core の成果は論理言語での実装と実行の説明を求める。[SWI-Prolog の用語解説](https://www.swi-prolog.org/pldoc/man?section=glossary)は事実と規則を節として説明し、単一化が代入と異なり双方向であることを説明する。

既存の庭園依頼は関係、関係の合成、量化を扱う。今回の模型は別に、世話する（人、花）と咲く（花）から知らせる（人）を導く規則、同一文字が同じ値に合う例、二つの前提を一つの花でつなぐ例を操作する。表示された事実から導けないことを現実の偽と決めつけない。単一化の模型は一つの文字と定数の限られた対のみで、双方向の一般的な項、単一化アルゴリズム、失敗からの探索、論理言語の自由なプログラム作成は扱わない。FPL-Logic の広い成果を満たしたとは判断しない。

`garden-logic-derive` と `garden-logic-unify` の２件を終えると `garden-logic-combine` が開く。庭園の依頼分類から選び、地図の全達成判定にも含まれる。

実装担当とは別の `review_candidate` が原典、[Cornell の事実と規則の講義](https://www.cs.cornell.edu/courses/cs4110/2025fa/lectures/lecture34.pdf)、SWI-Prolog の説明、固定例の正答、規則の向き、同じ変数・中間の花の一致と未導出の説明を確認した。各事例の解は高々一つであり、一般の項、複数解の探索、バックトラック、occurs check や実言語の作成・説明は評価しない。レビュー担当自身はブラウザを操作していない。

`tests/endgame-logic.test.js` は関係の順序、中間の花の一致、同じ文字の一貫性、根拠なし、誤答からの修正を確認する。`tests/late-region-quest-groups.test.js` は分類と開放を確認する。`scripts/endgame-logic.playwright.js` は集いと４地域などの達成を用意した検証用記録から、213・390・1200 px 幅で分類からの到達、キーボードによる依頼と回答、誤答の案内、途中復元、段階開放、３依頼の達成と達成後の再開を確認した。新規開始からこの依頼群までの通し操作、実際のスクリーンリーダー音声、利用者による面白さの評価は未確認。
