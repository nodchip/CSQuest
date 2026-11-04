# DM-NoSQL：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.120–121。[追跡方法](coverage-status.md)に従う。未照合は未実装の証拠ではない。固定模型は実製品の機能・性能や一般の分散保証を示さない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | KA Core | NoSQL の動機 | 部分 | 189で鍵取得と構造化された文書検索を比較。実アプリケーションと関係 DB の総合選択は未評価。 |
| 2 | KA Core | キー・バリューと文書モデル | 部分 | 189で鍵取得と札・索引の更新を操作。一般のモデルと製品差は未評価。 |
| 3 | Non-core | 保存方式 | 部分 | 189で鍵による固定模型と S3 を参照したオブジェクトの鍵・接頭辞を操作。データレイクや実装・運用は未評価。 |
| 4 | Non-core | 分割と複製 | 部分 | 190で２複製への配送、191で２棚の分割を操作。実際の方式や運用は未評価。 |
| 5 | Non-core | グラフ DB | 部分 | 192で有向ラベル付き関係を２段階たどる。問合せ言語と実 DB は未評価。 |
| 6 | Non-core | 更新・読取り、クォーラムと CAP | 部分 | 190で分断中の古い応答・待機、193で書込みと読取りの重なりを比較。一般の証明・同時更新は未評価。 |
| 7 | Non-core | MapReduce と段階的処理 | 部分 | 130で分担した小計を集約。実基盤と増分処理は未評価。 |
| 8 | Non-core | クラウド保存等の事例と NoSQL が不適な場合 | 部分 | 189で架空の箱を比較し、S3 の鍵と DynamoDB の複数項目取引を参照。実サービスの操作や実際の要件に基づく製品選択は未評価。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | KA Core | 関係 DB より NoSQL を使う用途を設計 | 部分 | 189で検索方法と２つの架空用途を比較。実際の要件に基づく用途の設計は未評価。 |
| 2 | KA Core | キー・バリューと文書モデルの特徴を説明 | 部分 | 189で鍵取得と札の構造・索引を操作。一般的な特徴の自由な説明は未評価。 |

依頼189〜193の前提は [DM-NoSQL](dm-nosql.md) を参照。`tests/nosql-models.test.js`、`tests/replica-lag.test.js`、`tests/shard-routing.test.js`、`tests/graph-records.test.js`、`tests/quorum.test.js` は各固定模型を検査する。

依頼189の追加比較では、単一鍵の読書きのみを要する用途と、複数記録の一括確定・結合を要する用途について、機能を明示した２つの架空の箱を選ぶ。後者では例の鍵の箱は条件を満たさないが、NoSQL 全般の制約ではない。例えば [DynamoDB の複数項目取引](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html)がある。`tests/storage-choice.test.js` は選択肢と旧形式の保存・復元を検査する。実製品の比較や一般の設計は未評価。

同じ依頼では４個の架空オブジェクトについて、`north/` の接頭辞と鍵全体の違いを操作する。[Amazon S3 の鍵](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html)に基づく固定例で、`tests/object-archive.test.js` は接頭辞と旧記録の復元を検査する。実際のバケット操作やアクセス管理は未評価。
