# AL-SEP：状況認識コンピューティングの評価

評価日：2026-11-05。[CS2023 印字 p.95](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の KA Core トピック８と、[Dartmouth の状況認識モバイル計算の調査](https://digitalcommons.dartmouth.edu/cs_tr/177/)に照らして依頼797を確認した。

判定は「部分」。現在地と通行状態によって経路を選び直し、現在の報告と道が変わった後の古い報告を比べる。確認は正確に行えると仮定しており、一般の観測誤差、情報の管理や個人情報保護は評価しない。道の状態は小さな固定例で、一般の状況認識システムの設計能力も評価しない。

`tests/road-replanning.test.js` の４テストは二度の再計画、報告の判断、以前の記録の復元を検査する。`scripts/road-replanning-smoke.playwright.js` は390px幅の画面で旅の達成後に報告を再確認し、再読み込み後に双方の状態が残ることを検査する。これらは学習者の一般的な理解を証明しない。
