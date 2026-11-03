# DM-Unstructured：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.122–123。全て Non-core。[追跡方法](coverage-status.md)に従い、親子を重複計上しない。原典に独立した例示学習成果はない。関連する別文脈の例と、半構造データに直接適用する体験を区別する。

| 番号 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|
| 1 | 非構造データのベクトル化・ベクトル保存 | 部分 | 120で単語頻度と得点、121で隣接２語を比較。埋込みベクトルの保存や実データは未評価。 |
| 1a | N グラム付き TF-IDF | 部分 | 120で隣接２語の出現回数と文書頻度から TF-IDF を求める。一般の N グラム・分割・検索品質は未評価。 |
| 1b | Word2Vec | 部分 | 1037で全語 softmax、1038で１手本・１対比の負例サンプリングによる２次元ベクトルの更新を操作。実コーパスや一般の埋込み品質は未評価。 |
| 1c | 配列 DB・配列型 | 部分 | 依頼1212で日付ごとの２次元配列から矩形を切り出す固定模型。実 DB・一般の配列型や検索は未評価。 |
| 2a-i | 入れ子データの符号化・圧縮 | 未照合 | 189に文書の固定例はあるが、入れ子の符号化や圧縮は未確認。 |
| 2b-i | B 木・スキップ索引・Bloom filter | 部分 | 120で固定語の Bloom filter、662で固定キーの B+ 木を操作。半構造データの索引やスキップ索引は未評価。 |
| 2b-ii | 転置索引とビットマップ圧縮 | 部分 | 120で単語から巻物への転置索引を操作。半構造データとビットマップ圧縮は未評価。 |
| 2b-iii | 空間充填曲線による索引 | 部分 | 1169で位置と目印を持つ16札を Z 順に並べ、矩形の１区間・複数区間の候補を比較。実際の半構造 DB、連続座標や性能は未評価。 |
| 2c-i | 挿入・選択・更新・削除のトレードオフ | 未照合 | 半構造 DB の OLTP・OLAP における比較は未確認。 |
| 2c-ii | 半構造データを扱う製品事例 | 未照合 | Postgres/JSON、MongoDB、Snowflake/JSON の事例は未確認。 |

依頼120の頻度・IDF の前提は [DM-Unstructured](dm-unstructured.md)、189の文書模型は [DM-NoSQL](dm-nosql.md) を参照。`tests/word-index.test.js` は固定した転置索引と得点を検査し、実データ・製品の機能を保証しない。

依頼1037は [Mikolov らの Word2Vec 論文](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/)と [Stanford の単語ベクトル講義](https://web.stanford.edu/class/cs224n/readings/cs224n-2019-notes01-wordvecs1.pdf)を参考に、中心語１個、周囲語３候補、２次元の全語 softmax で１組の手本を３回学習する。２手本は同じ初期値から独立に学習する。中心と出力の８座標の勾配を数値微分と照合し、確率の和と各更新の損失を `tests/skipgram-embedding.test.js` で確認。実コーパス、単語の分割、負例サンプリング、一般の意味や性能は評価しない。

依頼1038は [Mikolov らの負例サンプリング](https://arxiv.org/abs/1310.4546)を参考に、１手本・１対比の二値損失で中心と２語の出力を同時に更新する。対比語２種類は固定選択し、３語のシグモイドは正規化された分布と扱わない。選ばれていない出力ベクトルは直接更新されないが、共有中心の変更により内積は変わり得る。`tests/negative-sampling.test.js` は８座標を数値微分と照合し、未選択出力、損失、保存と達成を検査。実際の雑音分布からの抽出、複数負例、実コーパスや一般の性能は未評価。

依頼1169は [CMU の空間充填曲線と位置データの論文](https://www.cs.cmu.edu/~christos/PUBLICATIONS.OLDER/qbism-tkde.pdf)を参考に、２ビットの座標を x・y の順で交互に並べる Z 順と３矩形を比較する。分割区間は全16点を列挙して作る模型で、実装性能を示さない。`tests/morton-index.test.js` は全100矩形の一致・候補の包含・分割時の範囲外なしと保存・達成を検査する。

依頼1212は [PostgreSQL の配列型と部分配列](https://www.postgresql.org/docs/current/arrays.html)を参考に、２日分の３×３配列から指定した範囲を選び、形と欠測を保つ固定模型。`tests/array-record-slice.test.js` は両配列の範囲内矩形全72通り、欠測と０、保存を検査。実 DBMS、範囲外や SQL 記述は未評価。
