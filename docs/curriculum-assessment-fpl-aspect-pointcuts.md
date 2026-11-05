# FPL-Aspect：ポイントカットの教材評価

評価日：2026-11-05。[CS2023 印字 p.136](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の Non-core トピック４・４a と [AspectJ Programming Guide](https://eclipse.dev/aspectj/doc/latest/progguide/progguide.html)を参照し、依頼323を確認した。両項目の判定は「部分」。

依頼では操作の実行を節目とし、預入と引出、または全操作を選ぶ条件を切り替えて共通記録の対象を比較する。記録の前・正常終了後・終了後を別に選ぶ。２種類の固定条件に限られ、一般のポイントカットや実言語の指定子・構文・実装能力は評価しない。

`tests/aspect-ledger.test.js` の２テストは、対象条件と記録時機、成功・失敗・対象外、達成条件と途中記録を検査する。ローカル版の390px幅で対象と時機を選び、４場面の予測と達成を確認した。選択肢を操作できることは、一般的なアスペクトの設計や AspectJ のコードを記述できる能力の証明ではない。
