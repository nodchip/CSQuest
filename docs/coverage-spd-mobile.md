# SPD-Mobile：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.303–304。[既存調査](spd-mobile.md)と照合。子項目を記す行は集計時に親と重複させない。固定例は実端末・実アプリの実装や評価を証明しない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1a | KA Core | モバイルの言語 | 未照合 | 実言語・環境を用いた開発は未評価。 |
| 1b | KA Core | 開発環境 | 未照合 | 実開発環境の操作を要照合。 |
| 2a | KA Core | UI の制約 | 部分 | 394で対象の大きさと間隔の固定比較。実端末・利用者は未評価。 |
| 2b | KA Core | セキュリティの制約 | 部分 | 1323で架空の位置権限の拒否・精度・変更と手動代替を試す。実端末・OS・他のセキュリティ制約は未評価。 |
| 3a | KA Core | API によるデータへのアクセス | 部分 | 354でオフライン保留・再送の模型。実 API への接続は未評価。 |
| 3b | KA Core | モバイル向け API 設計上の注意 | 部分 | 354で同一識別子による再送と重複の固定例。一般の設計は未評価。 |
| 3c | KA Core | ネットワークと Web インターフェース | 部分 | 354で接続回復・応答喪失を仮定。実通信・設計は未評価。 |
| 4a | Non-core | ネイティブとクロスプラットフォーム | 部分 | 1325で別々の実装と処理の共有を条件付きで比較。実開発・網羅的評価は未実施。 |
| 4b | Non-core | モバイルの設計パターン | 未照合 | 実設計を要照合。 |
| 5a | Non-core | レスポンシブ UI | 部分 | 1326で固定２列と幅による１・２列の切替を２条件で比較。実端末・利用者の評価は未実施。 |
| 5b | Non-core | 端末の多様性と移動 | 部分 | 354で圏外と通信回復。多様な実端末は未評価。 |
| 5c | Non-core | モバイルと Web の利用体験の違い | 未照合 | 比較を要照合。 |
| 5d | Non-core | 電力と性能のトレードオフ | 部分 | 356で架空の資源と遅れを比較。実端末の電力・性能は未評価。 |
| 6a | Non-core | 位置情報を使うアプリ | 部分 | 393で位置の精度・時間・手動代替を選ぶ模型。実位置やアプリは未評価。 |
| 6b | Non-core | センサーを使う計算 | 部分 | 219〜222で測定・量子化等の固定模型。モバイル実センサーは未評価。 |
| 6c | Non-core | 電話と即時メッセージ | 部分 | 1327で保留・受付・配達・既読通知を操作。電話・実通信は未評価。 |
| 6d | Non-core | 拡張現実 | 部分 | 217・218で重ね合わせの固定模型。実モバイル端末は未評価。 |
| 7 | Non-core | 仕様と試験 | 部分 | 354で二つの再送方針を比較。実アプリの試験は未評価。 |
| 8a | Non-core | 同期処理との違い | 部分 | 1321で画面の処理が待つ場合と操作を受ける場合を比較。実端末・一般の並行処理は未評価。 |
| 8b | Non-core | コールバックによる成功処理 | 部分 | 1321で返事の到着と結果を扱う処理を分け、到着順を比較。実コードと一般の API は未評価。 |
| 8c | Non-core | 非同期エラー | 部分 | 354で返事の喪失を扱う固定例。一般の非同期エラーは未評価。 |
| 8d | Non-core | 非同期コードの試験 | 部分 | 1321で成功順２通り・失敗と遅延を固定模型で比較し、1322で制御した Promise の結果を待つ試験を実行。実端末・実アプリの試験は未評価。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 代替と限界 |
|---|---|---|---|---|
| 1 | KA Core | モバイルと汎用プログラミングの比較 | 未照合 | 一般的な比較を要照合。 |
| 2 | KA Core | 位置と API を使うアプリ | 部分 | 393で位置取得の選択。API 統合・実アプリ開発は未評価。 |
| 3 | KA Core | センサーデータの遠隔記録 | 部分 | 1324で固定の温度を圏外で記録し、模擬受付へ同一番号で再送。実センサー・通信・サーバーは未評価。 |
| 4 | KA Core | 電話・メッセージアプリ | 部分 | 1327で伝言アプリの一連の状態を模型で操作。電話や実アプリの設計・実装は未評価。 |
| 5 | KA Core | ネイティブと共通開発の長短 | 部分 | 1325でコード共有、端末固有機能、対応状況と試験を固定条件で比較。一般的・実測に基づく評価は未実施。 |

354の再送は固定された受付の重複抑止を仮定し、実 API や認証は扱わない。393・394は実位置・実端末・利用者の評価ではない。根拠と前提は[既存調査](spd-mobile.md)、[社会・倫理の調査](spd-sep.md)、`tests/mobile-retry.test.js`、`tests/mobile-location.test.js`、`tests/touch-targets.test.js` を参照。

依頼1321は [MDN の非同期処理とコールバック](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing) を参考に、架空の２要求について返事の到着と処理を分け、古い返事の上書きと依頼番号の確認を比較する。画面処理が待つ模型と待機中に操作を受ける模型も比較するが、非同期なら常に快適・別スレッドと主張しない。`tests/mobile-callback-race.test.js` は成功・失敗と２方式の６通り、段階・保存を検査。実端末、実 API・コールバック実装やコードの試験は評価しない。

依頼1322は [Node.js のテストランナー](https://nodejs.org/api/test.html) と [MDN の Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) を参考に、1321と同じ６条件で手動完了する練習用 Promise の成功・失敗を制御し、処理の完了を待って期待表示と比較する。`tests/mobile-async-harness.test.js` は実際の Promise による６結果を独立期待値・1321の模型と照合し、期待表示と保存を検査する。実端末や実通信、任意の例外・競合のテストは評価しない。

依頼1323は [Android の位置権限](https://developer.android.com/develop/sensors-and-location/location/permissions) と [拒否時の対応](https://developer.android.com/training/permissions/requesting) を参考に、架空の許可・固定位置・手動代替を操作する。取得中に許可が変わっても結果が届くという模型で、使う前の再確認を示す。実 OS の全挙動を再現せず、詳しい位置からおおよその位置に変更時のプロセス再起動等も画面に明記。`tests/mobile-permission-journey.test.js` は開始時と返事時の６組合せ、拒否・代替と保存を検査。実位置・端末・個人情報の削除は評価しない。

依頼1324は [Android のオフライン時の書込み](https://developer.android.com/topic/architecture/data-layer/offline-first) と [センサーの概要](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview) を参考に、２つの架空の温度・時刻・番号を保存し、圏外・通信回復・初回の返事喪失・同一番号の再送を模型で操作する。`tests/mobile-sensor-queue.test.js` は送信順２通り、重複抑止と保存を検査。実センサー・ネットワーク・サーバー、全失敗や耐障害性は評価しない。

依頼1325は [Android の Kotlin Multiplatform 事例](https://developer.android.com/codelabs/kmp-get-started) と [環境の準備](https://developer.android.com/kotlin/multiplatform/setup) を参考に、共通の計算と端末ごとの画面を組み合わせる方式、および端末ごとに別々に作る方式を三つの固定条件で比較する。共通化の可否や費用は前提次第であり、実機・実開発・性能・費用の評価ではない。`tests/mobile-platform-choice.test.js` は各条件の正誤と保存状態を検査する。

依頼1326は [MDN のレスポンシブデザイン](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) と [グリッドのアクセシビリティ](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Accessibility) を参考に、２幅と２配置ではみ出しを予測し、文字拡大や操作順も考える。札幅280・間隔16・２列に必要な幅576は教材固有の条件で、実端末や利用者全般の評価ではない。`tests/responsive-notice.test.js` で４組合せと途中記録を検査する。

依頼1327は [Signal の送信・配達・既読表示](https://support.signal.org/hc/en-us/articles/360007320751-How-do-I-know-if-my-message-was-delivered-or-read) と [Firebase の受付と配達](https://firebase.google.com/docs/cloud-messaging/customize-messages/setting-message-lifespan) を参考に、架空の伝言の保留・受付・配達・既読通知の有無を操作する。通知の設定と表示は模型の仮定であり、実通信・電話・通知の遅延や暗号化は扱わない。`tests/mobile-message-journey.test.js` は段階の順序、通知の有無、途中記録を検査する。
