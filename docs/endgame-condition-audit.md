# 港の待機と通知：範囲と未完了

[CS2023 印字 208 ページ（PDF 208 ページ目）OS-Concurrency](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の KA Core 9 は、条件変数・mutex 等を使ったスレッド安全なコードの実装を扱う。[POSIX Programmer's Manual の pthread_cond_wait](https://man7.org/linux/man-pages/man3/pthread_cond_wait.3p.html) は鍵の解放と待機の原子性、正常復帰時の再取得、条件の再評価を説明する。[pthread_cond_broadcast](https://man7.org/linux/man-pages/man3/pthread_cond_broadcast.3p.html) は待機者の起床と鍵の競合を説明し、通知時に鍵の保持を必須とはしていない。

この固定模型では届け役が鍵を持って品を入れ、待機中の全員に通知してから鍵を返す。通知は品の予約ではなく、二人が鍵を取る順もこの例だけの順序である。ビーが戻る前にアオが品を取り、ビーが鍵を取り直して空を確認する例を扱う。表示は疑似起床の可能性にも触れるが、実際の疑似起床・取り消し・タイムアウトは操作しない。任意の実行順や公平性を保証せず、実 API やスレッド安全な実コードの記述能力も評価しない。OS-Concurrency の成果は部分対応のままである。

`harbor-condition-wait` と `harbor-condition-notify` を終えると `harbor-condition-recheck` が開く。港の依頼分類から選び、地図の全達成判定にも含まれる。

実装担当とは別の `review_candidate` が原典と上記 POSIX 文書、固定順の状態・正答、説明、分類と保存を確認した。通知が予約ではないこと、起床後の鍵再取得と条件の再確認は示した固定順において正しい。疑似起床は説明のみであり、signal・待機者がいない場合の通知・取り消し・タイムアウト・公平性・任意の実行順や実 API の操作は対象外である。レビュー担当自身のブラウザ操作は行っていない。

`tests/endgame-condition.test.js` は空箱での待機に伴う鍵の解放、通知後の再取得、空の再確認、二度目の品の受領を確認する。不正な操作順の拒否は固定手順への不一致でも成立し、一般的な状態遷移の網羅的検証ではない。`tests/harbor-quest-groups.test.js` は分類と開放を確認する。

`scripts/endgame-condition.playwright.js` は集いと４地域などの達成を用意した検証用記録から、213・390・1200 px 幅で分類からの到達、キーボードによる依頼と回答、誤答の案内、途中復元、段階開放、３依頼の達成と達成後の再開を確認した。新規開始からこの依頼群までの通し操作、実際のスクリーンリーダー音声、利用者による面白さの評価は未確認。
