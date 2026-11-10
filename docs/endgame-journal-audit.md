# 谷の台帳復旧：範囲と未完了

[CS2023 印字 296 ページ（PDF 296 ページ目）SF-Reliability](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の復旧・ジャーナリングの入口。[IBM Db2 のクラッシュ復旧説明](https://www.ibm.com/docs/en/db2/11.5.x?topic=recover-crash-recovery)は、未完了の作業を戻し、確定済みでまだ書き出されていない変更を反映する必要を説明する。[PostgreSQL の WAL 解説](https://www.postgresql.org/docs/current/wal-intro.html)は、対応する変更記録をデータより先に永続化する原則と復旧時の再適用を説明する。

既存の風車の依頼は信頼できる控えからの復元、谷の取引依頼は停止前の確定・取消しを扱う。今回の固定模型は、１件の作業について変更前・変更後・確定の記録が停止後も欠けず正確に残ると仮定し、未確定の一部反映を戻し、確定済みの未反映を適用する。これは唯一の WAL 方式でも特定の DB の実装手順でもない。

記録の永続化順序、確定通知の扱い、複数取引、復旧中の再停止と再復旧、ログや台帳の破損、実際の DB・ファイルシステムを検証していない。必要条件のない状況での復旧を保証せず、関連項目は部分対応である。

`valley-journal-undo` と `valley-journal-redo` の２件を終えると `valley-journal-decide` が開く。谷の依頼分類から選び、地図の全達成判定にも含まれる。

実装担当とは別の `review_candidate` が原典、上記 PostgreSQL・IBM の資料、記録が正確に残る模型の前提と未確定・確定済みの固定例、説明、分類と保存をコード上で確認した。この例を一般的な WAL 実装や SF-Reliability 全体の完成とは扱わない。レビュー担当自身はブラウザを操作していない。

`tests/endgame-journal.test.js` は未確定・確定済み・同じ停止時台帳で異なる復旧先、誤答修正と履歴再開を確認する。`tests/valley-quest-groups.test.js` は分類と開放を確認する。`scripts/endgame-journal.playwright.js` は集いと４地域などの達成を用意した検証用記録から、213・390・1200 px 幅で分類からの到達、キーボードによる依頼と回答、誤答の案内、途中復元、段階開放、３依頼の達成と達成後の再開を確認した。新規開始からこの依頼群までの通し操作、実際のスクリーンリーダー音声、利用者による面白さの評価は未確認。

2026-11-10、GitHub Pages に反映された `bf49ae7` でも同スクリプトを独立した検証用記録で再実行し、３幅すべて成功した。
