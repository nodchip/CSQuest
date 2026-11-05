# FPL-Event-Driven：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.134–135。[既存の調査](fpl-event-driven.md)と依頼・テストを照合。状態は[追跡方法](coverage-status.md)に従う。トピック５は a〜c を記録し、親子を重複して数えない。固定模型は実言語やフレームワークの実装能力を直接評価しない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | CS Core | 手続き型と反応型の比較 | 部分 | 1102で固定時刻の状態確認と通知の保存・処理を比較。両方式の体系的な比較や実装は未評価。 |
| 2 | CS Core | 発生源・信号・リスナー・ディスパッチ・イベント・アダプタ・処理 | 部分 | 92で２種類の信号・待ち行列・処理、594で登録した処理の参照を比較。一般のイベントオブジェクトやアダプタは未評価。 |
| 3 | CS Core | 無状態と状態遷移のモデル | 部分 | 92で灯りの値の状態遷移を操作。無状態方式との一般的比較は未評価。 |
| 4 | CS Core | GUI・モバイル端末・ロボット・サーバ等の利用 | 部分 | 1102で案内板・携帯地図・人形・受付の固定イベントを比較。実装・実環境の詳細は未評価。 |
| 5a | KA Core | フレームワークでの処理・リスナー定義 | 部分 | 92で固定の処理を選択・登録。実フレームワークでの定義は未評価。 |
| 5b | KA Core | 送信元とイベント引数のパラメータ化 | 部分 | 1092で送信元・対象・増分を含む固定イベントを処理。実言語での定義・一般の引数は未評価。 |
| 5c | KA Core | 外部・プログラム生成のイベント | 部分 | 1092で板の印と処理中に予約した知らせを比較。実際の API・複数タスク源の順序は未評価。 |
| 6 | KA Core | モデル・ビュー・コントローラーの分離 | 部分 | 92で入力係・記録係・２枚の表示を順に操作。一般の実装・通知方式は未評価。 |
| 7 | KA Core | イベント駆動プログラムの状態遷移 | 部分 | 92でイベントと灯りの固定遷移を操作。一般の状態機械や実プログラムは未評価。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | CS Core | イベント処理を実装 | 部分 | 92で処理を選択・登録する代替体験。実言語での実装は直接評価しない。 |
| 2 | CS Core | 外部イベントに反応する分野での自然さを検討 | 部分 | 92で印の到着に応じた処理、1102で短い信号を見回りと保存された通知で比較。一般の比較や自由な説明は未評価。 |
| 3 | KA Core | 反応型フレームワークを定義・利用 | 未照合 | 実フレームワークに関する対応は未確認。 |
| 4 | KA Core | 対話システムを MVC で説明 | 部分 | 92で入力・記録・表示の固定模型を操作。一般の設計と自由な説明は未評価。 |

`tests/events.test.js`、`tests/mvc-lantern.test.js`、`tests/callback-signs.test.js` は各固定模型の一部を検査する。前提と出典は[既存の調査](fpl-event-driven.md)を参照。未照合は未実装の証拠ではない。

依頼1092は [MDN のタイマー](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)と [実行モデル](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)を参考に、外部の板の印と処理中に予約した知らせの送信元・対象・増分を１つの FIFO 行列で扱う。`tests/event-origin-arguments.test.js` で２順序、処理値、送信元と引数、途中記録を検査。実ブラウザーの複数タスク源・マイクロタスク・正確なタイマー順序や API 実装は評価しない。

依頼1102は [MDN のイベント](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events)、[ポインターの押下](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event) と [Node.js のイベント処理](https://nodejs.org/learn/asynchronous-work/the-nodejs-event-emitter)を参考に、案内板・携帯地図・人形・受付で１つの係を登録・解除し２つの知らせを処理する。処理時に登録を確認する単一 FIFO の仮定は教材独自で、各 API・ジェスチャー・ロボットやサーバーの挙動を再現しない。`tests/event-worlds.test.js` は待機中の解除、FIFO、誤登録と復元を検査する。

依頼1102の比較は、[Linux カーネルの入力イベント](https://docs.kernel.org/input/event-codes.html)に見られる状態変化の通知を手がかりにした固定模型。状態を時刻０・２で読む場合と、時刻１の変化を必ず保存して時刻２に処理する場合を比較する。どちらも特定の言語や実 API の挙動全体を表さず、状態確認での履歴保存や通知の損失もあり得る。`tests/event-polling-comparison.test.js` は４条件と途中復元を検査する。
