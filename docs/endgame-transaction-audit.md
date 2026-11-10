# 谷の記録所のトランザクション

[CS2023 DM-Internals（印字120ページ）](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の KA Core 2b と学習成果 2 に関連する固定模型。[PostgreSQL のトランザクション解説](https://www.postgresql.org/docs/current/tutorial-transactions.html)を参照し、二つの村の更新を作業中の帳面に分け、確定または取消しし、別の人の新しい読み取りを確かめる。

原子性は実行されなかった更新を補わないため、片側の更新のみを確定できるが移動の依頼は達成しない。別の読み手に未確定変更が見えないのは本模型の規則であり、すべての分離水準を表さない。耐久性や障害後の復旧、制約一般、実 DB・SQL、４性質の自由な説明は未評価であり部分対応である。

実装担当と別の coverage_next が原典と一次資料、確定・取消し・新しい読み取り、誤答、表示、保存と開放をコード上で独立確認した。応用の取消し段階と達成条件が一致しない指摘を修正し、独立担当が再確認した。独立担当自身は実ブラウザーを操作していない。`tests/endgame-transaction.test.js` は片側のみの確定、取消し、読み取りと段階の境界を検証する。`scripts/endgame-transaction.playwright.js` は物語と４地域の達成状態を用意した別ブラウザー記録から誤答、途中保存、再挑戦、開放と達成を確認する。実際のスクリーンリーダー音声は未確認。
