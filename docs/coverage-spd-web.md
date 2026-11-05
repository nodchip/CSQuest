# SPD-Web：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 p.303。[既存調査](spd-web.md)と依頼を照合。状態は[追跡方法](coverage-status.md)に従い、「未照合」は未実装の証拠ではない。子項目を記載した箇所は集計時に親と重複させない。実際の Web アプリの開発・運用や自由な説明は、固定例の達成だけでは評価しない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | KA Core | Web の言語 | 部分 | 1289で HTML の見出し、CSS の装飾、JavaScript の操作への反応を固定例で比較。PHP や実際の言語記述・他の使い方は未評価。 |
| 2-本体 | KA Core | Web プラットフォーム・フレームワーク | 未照合 | フレームワークやメタフレームワークの役割を要照合。 |
| 2a | KA Core | プラットフォームとクラウド | 未照合 | 実サービス・フレームワークとの対応を要照合。 |
| 2b | KA Core | API と Web Components | 部分 | 62で受付と再送、803で画面・受付・台帳の役割を操作。実 API と Web Components は未評価。 |
| 3 | KA Core | SaaS | 部分 | 1290で遠隔の共有サービスと端末導入型の固定条件を比較し、1292で通信断時の村の要件に適用。実サービス、契約・料金や多様な提供方式は未評価。 |
| 4 | KA Core | DOM・アクセシビリティ等の Web 標準 | 部分 | 806で形・読み上げ名・キーボードの固定例。実 Web アプリの標準適合は未評価。 |
| 5 | KA Core | セキュリティとプライバシー | 部分 | 805でセッション固定・番号交換・失効の模型。実装やプライバシー全般は未評価。 |
| 6 | Non-core | Web アプリの要件分析 | 未照合 | Web 固有の要件分析との対応を要照合。 |
| 7a | Non-core | クラウドホスティング | 未照合 | 実サービスの運用を含め要照合。 |
| 7b | Non-core | 拡張性と自動スケーリング | 部分 | 1292で固定人数と自動調整、受付係と共通の門の上限を比較。待ち行列や実サービスは未評価。 |
| 7c | Non-core | サービス費用の見積り | 部分 | 1292で人数と時間から架空の費用を比較。実料金や複数の料金項目は未評価。 |
| 8a | Non-core | データ所在・アクセス経路 | 未照合 | 保存地とアクセス経路の検討を要照合。 |
| 8b | Non-core | データのアクセスと必要時の削除 | 未照合 | 原典の記載を追跡。完全性と可用性・削除の概念は一般には区別し、実運用を要照合。 |
| 9a | Non-core | モノリスとマイクロサービス | 部分 | 1291で一体型と２作業場の停止・共通の門の固定例を比較し、1292で受付の要件に適用。実サービスの設計・性能と他の依存は未評価。 |
| 9b | Non-core | マイクロフロントエンド | 未照合 | 対応例を要照合。 |
| 9c | Non-core | イベント駆動と REST の構成 | 未照合 | 長所・短所の比較を要照合。 |
| 9d | Non-core | サーバーレスとオンデマンド | 未照合 | 対応例を要照合。 |
| 10a | Non-core | 関係データベース | 部分 | 13で結合の固定例。Web アプリへの実接続は未評価。 |
| 10b | Non-core | NoSQL | 部分 | 189で鍵と文書の固定例。Web アプリへの実接続は未評価。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 代替と限界 |
|---|---|---|---|---|
| 1 | KA Core | マイクロサービスの Web アプリ設計・実装 | 部分 | 1291で分割した作業場と共通の入口の障害を比較。設計・実装の能力や実 Web アプリは直接評価しない。 |
| 2 | KA Core | ホスティング・サービス・拡張の制約 | 部分 | 1292で負荷への反応遅れ・処理漏れ・費用の固定例を比較。実際のホスティングや体系的な比較は未評価。 |
| 3 | KA Core | Web と汎用プログラミングの比較 | 未照合 | 比較を要照合。 |
| 4 | KA Core | SaaS と従来製品の比較 | 部分 | 1290で記録の場所・通信断・更新担当を固定例で比較。実際の製品、費用や自由な説明は未評価。 |
| 5 | KA Core | Web 標準が開発に与える影響 | 部分 | 806で３つの利用条件と改善策の固定例。Web 標準全般の議論は未評価。 |
| 6 | KA Core | Web アプリを標準に照らし評価 | 未照合 | 実アプリへの評価・適合は未確認。 |

803・804・805は画面と受付、状態、認証の模型で、実ネットワーク・サーバー・本人認証を再現しない。対象の前提と検査は[既存調査](spd-web.md)および `tests/web-three-tier.test.js`、`tests/web-session.test.js`、`tests/session-fixation.test.js` を参照。

依頼1289では見出し追加、色と枠、ボタンによる灯りの切替えに対応する札を選び、実際に見本を操作する。言語ごとにできることは重なるため、HTML の操作要素・CSS の状態による表現・JavaScript による内容変更もあると明示する。`tests/web-layers.test.js` は各札の選択・試行・操作・判定と保存の検証を行う。見本は固定されており、実際のコードの読み書き、PHP や他の技術を評価しない。参考：[MDN HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content)、[CSS](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Styling_the_content)、[JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Adding_interactivity)。

依頼1290は [NIST の SaaS の定義](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf)と [CISA の SaaS での役割分担](https://www.cisa.gov/sites/default/files/2024-05/Software%20Transparency%20in%20SaaS%20Environments.pdf)を参考に、遠隔の共有記録と同期しない端末内の記録を、通信あり・なしの４条件で比べる。遠隔側はオフラインの控えがなく、端末側は常に利用可能という仮定。提供者の本体更新と、利用者による権限や復元の確認を区別する。`tests/software-service.test.js` は４条件、誤答、達成と復元を検査。実際の SaaS や導入型製品の機能・料金・契約、通信以外の障害、実サービスの責任分担は評価しない。

依頼1291は [Microsoft のマイクロサービス設計](https://learn.microsoft.com/en-us/azure/architecture/microservices/)と[サービスのデータと依存関係](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/data-considerations)を参考に、１作業場と別々の２作業場について、故障なし・注文の作業場停止・共通の門の停止を比較する。両方とも共通の門を使い、分割した報告は注文側に問い合わせないという固定の仮定。`tests/service-boundaries.test.js` は６条件の正答・誤答・保存と達成を検査する。実サービスやネットワーク、一般の障害伝播、運用費用・性能・可用性、自由な設計やプログラミング能力は評価しない。

遠征1292は依頼1290の通信あり・なしと、1291の故障なし・注文側停止・共通入口停止の判定を再利用する。南村では通信断でも端末内の記録を開ける方式、受付では注文側の停止中も独立した報告を続ける構成を、各条件の試行後に選ぶ。共通入口停止の影響を最後に報告する。`tests/communications-expedition.test.js` は試験不足・不適合・方式変更による再試験・再開と報告を検査。依頼1290・1291と同じ固定前提であり、任意の製品・設計、同期・実ネットワークや実装能力は評価しない。
