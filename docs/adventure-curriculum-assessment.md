# 現行の冒険と原典の照合

`adventure-curriculum-assessment.csv` は、`curriculum-inventory-draft.csv` の候補IDを参照し、現行の冒険から遊べる内容について個別に評価した記録です。原典の分類と位置は既存台帳で追跡し、この表では依頼、実際に扱う範囲、到達・検証・独立レビューと残る範囲を記します。

この表にない候補は**未評価**です。未実装と断定するものでも、対応済みとして数えるものでもありません。既存台帳には旧教材の評価と親子重複候補があるため、その件数を現行冒険の完成率に転用しません。部分対応は完成として数えません。原典本文の照合、依頼の到達性と操作の検証、分野別の独立レビューを行いながら項目ごとに追加します。

2026-11-11、実装・対応付け担当とは別の `review_candidate` が DM-Security 2、OS-Devices 2、AI-Search 1a、HCI-Evaluation 3 の４件について、原典と現行依頼の部分的な対応、開放条件、既存検証の範囲を文書・コード上で確認した。これは元教材の独立レビューとは別の対応付けレビューであり、今回ブラウザを再操作したこと、新規開始からの通し到達、各項目の完成を示さない。

表は開発中の作業コピーにおける状態であり、公開版に含まれることを示しません。原典：[CS2023 最終報告書](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf)。

対象依頼のブラウザ検証には、集いと４地域の達成状態を用意した記録を使うものがあります。導入からの到達を検証した意味ではありません。別の `scripts/story-climax-journey.playwright.js` は新規記録から集いと４地域を経て庭の `garden-shelter` まで操作し、開発時の確認は `docs/story-climax-audit.md` に記録しています。後に追加された各依頼までの通し操作を示すものではありません。４地域で各２件の達成と祭りを見たことは別の条件です。

2026-11-10 に確率の依頼を加えた開発ビルドでも、同スクリプトの通常順を新規記録から再実行し、集いと４地域を経て `garden-shelter` の達成まで確認しました。確率の依頼にはこの通し操作では入っていません。

地域画面を分類式に整理した後、2026-11-10 の再実行は工房で非表示の従来ボタンを直接押そうとして停止した。その後、分類と依頼を選ぶ操作へ更新し、通常順で新規開始から集いと４地域を経て `garden-shelter` の達成、および未達成の依頼への復帰を確認した（43件達成、実行時エラーなし）。この操作は観測所の分散の依頼までは到達していない。追加で初期３地域を逆順に訪れる通し操作も、新規記録から43件達成しエラーなく確認した。

2026-11-10、catalog が実装担当と別に既存の `forge-bits`・`tower-forward`・`gate-access` の問題と原典の該当項目を照合し、固定例の範囲と不足を確認しました。ブラウザ操作の根拠は以前の `world-finale-audit.md` の記録であり、このレビュー担当が今回ブラウザを再操作したことを意味しません。

2026-11-11、実装・対応付け担当とは別の `review_candidate` が MSF-Discrete 7、AL-Foundational 5、SF-Foundations 5、DM-Internals 4、PDC-Programs 3c と SPD-Embedded 3e・9 の対応を原典・教材・既存の検証記録に照らして確認した。いずれも固定例による部分対応で、SPD は入力側のみ。これは元教材のレビューとは別の対応付けレビューであり、今回のブラウザ再操作や新規開始からの通し到達、項目の完成を示さない。

2026-11-11、`review_candidate` が AI-Search 1b、AL-Foundational 6、DM-Security 学習成果 2、HCI-Evaluation 6b、MSF-Discrete 学習成果 1d・7a、PDC-Programs 3d、SF-Foundations 4 の８件について原典、固定例、開放条件と既存検証の対応を独立確認した。一般的な課題や実装・自由な説明は未評価。元教材のレビューと今回の対応付けレビューは別で、今回のブラウザ再操作や新規開始からの通し到達、完成を示さない。

2026-11-11、`review_candidate` が MSF-Linear 2、FPL-Event-Driven 7、OS-Principles 6、GIT-Image 5b、AI-ML 3・7、PDC-Coordination 1 の７件について原典、現行の固定例、開放条件と既存検証の対応を独立確認した。実装や一般化などは未評価。元教材のレビューと今回の対応付けレビューは別で、今回のブラウザ再操作や新規開始からの通し到達、完成を示さない。

2026-11-11、`review_candidate` が MSF-Discrete 学習成果 2a、AL-Foundational 11、PDC-Coordination 3d、GIT-Image 5a、PDC-Algorithms 3b、SE-Validation 3c の６件について原典・固定例・既存検証の対応を独立確認し、後の２件の原典ページ番号の誤りを指摘した。指摘に沿って226頁と246頁に修正した。今回ブラウザは再操作しておらず、固定例で一般の設計・実装・証明や新規開始からの通し到達を評価したものではない。

上記２件の修正後のページ番号は、同じ `review_candidate` が原典と照らして再確認した。

2026-11-11、`review_candidate` が AI-Search 11、MSF-Discrete 2・学習成果 7d、DM-Core 5、AL-Foundational 12、SF-Reliability 3a の６件の固定例と原典との対応を独立確認した。DM-Core 5 の原典ページ番号を117頁から116頁へ修正した。一般的な実装・保証などは未評価であり、今回のブラウザ再操作や新規開始からの通し到達、完成を示さない。

DM-Core 5 の原典ページ修正は `review_candidate` が再確認した。

2026-11-11、`review_candidate` が AL-Foundational 10、SF-Reliability 3、AI-Search 3c.i、SF-Foundations 2・10、GIT-Rendering 1b・4 の７件について原典、固定例、開放と既存検証を独立確認した。一般の設計・実装や証明などは未評価。今回の対応付けレビューは元教材のレビューとは別で、ブラウザ再操作や新規開始からの通し到達、完成を意味しない。

2026-11-11、`review_candidate` が AL-Foundational 1a・3、FPL-Functional 3a、AI-Search 10d、SF-Foundations 8 の５件について原典、固定例、開放と既存検証を独立確認した。一般の設計・実装や証明などは未評価。今回の対応付けレビューは元教材のレビューとは別で、ブラウザ再操作や新規開始からの通し到達、完成を意味しない。

2026-11-11、`review_candidate` が AL-Foundational 13・13a、AI-Search 1c、SDF-Algorithms 1、FPL-Functional 2 の５件について原典と固定例の対応を独立確認した。山の元教材自体の独立レビューは未確認で、今回の対応レビューとは別に扱う。過去の `four-regions-journey.playwright.js` の新規コンテキストからの通し記録を照合したが、今回ブラウザやテストは再実行していない。親子の重複、一般の実装・証明などの不足を残す。

2026-11-11、`review_candidate` が AL-Foundational 1、AI-ML 1、PDC-Evaluation 2 の３件について原典、固定例、開放と既存検証を独立確認した。子項目との重複や一般の設計・実装・終了性などは未評価。今回の対応付けレビューは元教材のレビューとは別で、テストやブラウザの再実行、新規開始からの通し到達、完成を意味しない。

山の３依頼の元教材について、上記とは別に `review_candidate` が独立レビューを実施した。範囲と未評価は `mountain-curriculum.md` に記載する。

2026-11-11、`review_candidate` が GIT-Visualization 2・3b、MSF-Statistics 3、AI-ML 13、SDF-Practices 3 の５件を独立照合した。散布図は相関の方向・強さ自体を問わないとの指摘を受け、MSF の行を二変数の組の可視化という前提練習に限定した。一般の設計・実装や実データ分析は未評価。今回の対応付けレビューは元教材レビューやテスト・ブラウザの再実行、完成を意味しない。

MSF-Statistics 3 の相関の前提練習への限定は、`review_candidate` が修正後に再確認した。

2026-11-11、`review_candidate` が AL-Foundational 15、PDC-Coordination 1b、SE-Construction 9a、MSF-Statistics 学習成果 4f を独立照合した。循環の回避、未知の依存の発見、相関の方向・強さの理解を教材が問わないとの指摘を受け、後３件を前提練習に限定した。今回の対応付けレビューは元教材レビューやブラウザ再実行、完成を意味しない。

循環回避・依存特定・相関の前提練習への限定は `review_candidate` が修正後に再確認した。
