# DM-Unstructured：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.122–123。全て Non-core。[追跡方法](coverage-status.md)に従い、親子を重複計上せず、２の半構造化 DB の概要と 2c の OLTP・OLAP 問合せ処理は、子項目にない範囲を別に追跡する。原典に独立した例示学習成果はない。関連する別文脈の例と、半構造データに直接適用する体験を区別する。

| 番号 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|
| 1 | 非構造データのベクトル化・ベクトル保存 | 部分 | 120で単語頻度と得点、121で隣接２語を比較。埋込みベクトルの保存や実データは未評価。 |
| 1a | N グラム付き TF-IDF | 部分 | 120で隣接２語の出現回数と文書頻度から TF-IDF を求める。一般の N グラム・分割・検索品質は未評価。 |
| 1b | Word2Vec | 部分 | 1037で全語 softmax、1038で１手本・１対比の負例サンプリングによる２次元ベクトルの更新を操作。実コーパスや一般の埋込み品質は未評価。 |
| 1c | 配列 DB・配列型 | 部分 | 依頼1212で日付ごとの２次元配列から矩形を切り出す固定模型。実 DB・一般の配列型や検索は未評価。 |
| 2-本体 | 半構造化データベースの概要 | 部分 | 189で名前付き項目・任意項目・検証規則と文書内検索を固定例で操作。一般の半構造 DB や実製品の操作は未評価。 |
| 2a-i | 入れ子データの符号化・圧縮 | 部分 | 189で境界・有効性と辞書の固定例を操作。実際のバイト表現、汎用圧縮や一般の入れ子構造は未評価。 |
| 2b-i | B 木・スキップ索引・Bloom filter | 部分 | 120で Bloom filter、662で B+ 木、189で入れ子の束数の区画範囲による読み飛ばしを操作。実 DB・一般の索引や性能は未評価。 |
| 2b-ii | 転置索引とビットマップ圧縮 | 部分 | 120で単語の転置索引と４冊のビット列・連続区間を操作。半構造データへの適用、実際の圧縮形式や性能は未評価。 |
| 2b-iii | 空間充填曲線による索引 | 部分 | 1169で位置と目印を持つ16札を Z 順に並べ、矩形の１区間・複数区間の候補を比較。実際の半構造 DB、連続座標や性能は未評価。 |
| 2c-本体 | OLTP・OLAP 用途での問い合わせ処理 | 部分 | 189で入れ子の配達札の個別更新・追加・削除と全件集計、控えの更新を操作。実 DB と一般の処理は未評価。 |
| 2c-i | 挿入・選択・更新・削除のトレードオフ | 部分 | 189で更新等に追随しない集計の控えと再集計を比較。一般の選択・更新費用や実性能は未評価。 |
| 2c-ii | 半構造データを扱う製品事例 | 部分 | 189で PostgreSQL の JSON 経路取得を３固定例で予測。実 PostgreSQL の実行、MongoDB・Snowflake や一般の製品比較は未評価。 |

依頼120の頻度・IDF の前提は [DM-Unstructured](dm-unstructured.md)、189の文書模型は [DM-NoSQL](dm-nosql.md) を参照。`tests/word-index.test.js` は固定した転置索引と得点を検査し、実データ・製品の機能を保証しない。

依頼189の追加例は４つのリスト `[赤・青]`・`[]`・`null`・`[緑]` を、値の列、５個の境界、４個の有効性から復元する。[Apache Arrow のリスト形式](https://arrow.apache.org/docs/format/Columnar.html#list-layout)を参考にした固定模型で、`tests/nested-offsets.test.js` は９組のうち一致する１組と空・null の違い、旧記録の復元を検査する。Arrow の実装や圧縮は評価しない。

別の４リストの例では、同じ赤・青を辞書順と番号を変えて表し、境界で復元する。[Arrow の辞書符号化](https://arrow.apache.org/docs/format/Columnar.html#dictionary-encoded-layout)を参考に、値２バイト・番号１バイトという仮定で値部分10バイトと辞書込み９バイトを比較する。`tests/nested-dictionary.test.js` は６組と旧記録の復元を検査する。実データの符号化や圧縮率は評価しない。

依頼120では月草と解毒の４冊に対するビット列の AND・OR を比較し、結果の連続する同値を値と個数の組で表す。`tests/bitmap-postings.test.js` は４冊の２集合の全256組で AND・OR と集合の一致、連続区間の展開を検査する。[Berkeley Lab の索引圧縮研究](https://escholarship.org/uc/item/0ks802t8)を参考にした単純模型で、WAH 実装、半構造 DB、実際の大きさや性能は評価しない。

依頼189の配達札は入れ子の束数を持つ４記録から始め、１記録の更新・追加・削除と全記録の合計を操作する。控えは手動で作り直すまで古くなり得るという固定方針で、即時維持が不可能という意味ではない。`tests/document-workload.test.js` は３変更の全６順序、控えと再集計、旧記録と履歴を検査する。[AWS の処理用途の説明](https://docs.aws.amazon.com/redshift/latest/dg/c_redshift-and-postgres-sql.html)を参照。実 DB、一般の索引や処理費用、同時実行・障害・性能は未評価。

同じ依頼では [PostgreSQL の JSON 演算子](https://www.postgresql.org/docs/current/functions-json.html)の `#>>` を参考に、３つの固定経路について文字列または経路不在の SQL NULL を予測する。`tests/json-path-case.test.js` は３経路と旧記録を検査する。実 PostgreSQL に接続せず、JSON null や一般の式・製品比較は評価しない。

集計範囲は全村または北・南・西から選び、選択した村の札だけを足す。更新・追加・削除の後も範囲を保ち、全村の控えとの一致は全村の集計時だけ比較する。一般の問い合わせ言語や実行計画は扱わない。

同じ依頼で巻物順を A・B・C・D と A・C・B・D に変えると、月草の印はそれぞれ `1100` と `1010`、同値の連続は２組と４組になる。印の各位置はその順の巻物に対応する。実際の符号化サイズは数えていない。

依頼189では６枚の文書を２枚ずつ３区画に分け、入れ子の束数の区画別最小・最大から「指定値以上」に一致し得ない区画を除く。残る区画の札も個別に確認する。`tests/document-skip-index.test.js` は境界０〜10で全走査との一致・候補の包含と旧記録を検査する。[ClickHouse のスキップ索引](https://clickhouse.com/docs/optimize/skipping-indexes)を参考にした固定模型で、要約は正確と仮定し、実 DB・更新の保守・性能は評価しない。

依頼1037は [Mikolov らの Word2Vec 論文](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/)と [Stanford の単語ベクトル講義](https://web.stanford.edu/class/cs224n/readings/cs224n-2019-notes01-wordvecs1.pdf)を参考に、中心語１個、周囲語３候補、２次元の全語 softmax で１組の手本を３回学習する。２手本は同じ初期値から独立に学習する。中心と出力の８座標の勾配を数値微分と照合し、確率の和と各更新の損失を `tests/skipgram-embedding.test.js` で確認。実コーパス、単語の分割、負例サンプリング、一般の意味や性能は評価しない。

依頼1038は [Mikolov らの負例サンプリング](https://arxiv.org/abs/1310.4546)を参考に、１手本・１対比の二値損失で中心と２語の出力を同時に更新する。対比語２種類は固定選択し、３語のシグモイドは正規化された分布と扱わない。選ばれていない出力ベクトルは直接更新されないが、共有中心の変更により内積は変わり得る。`tests/negative-sampling.test.js` は８座標を数値微分と照合し、未選択出力、損失、保存と達成を検査。実際の雑音分布からの抽出、複数負例、実コーパスや一般の性能は未評価。

依頼1169は [CMU の空間充填曲線と位置データの論文](https://www.cs.cmu.edu/~christos/PUBLICATIONS.OLDER/qbism-tkde.pdf)を参考に、２ビットの座標を x・y の順で交互に並べる Z 順と３矩形を比較する。分割区間は全16点を列挙して作る模型で、実装性能を示さない。`tests/morton-index.test.js` は全100矩形の一致・候補の包含・分割時の範囲外なしと保存・達成を検査する。

依頼1212は [PostgreSQL の配列型と部分配列](https://www.postgresql.org/docs/current/arrays.html)を参考に、２日分の３×３配列から指定した範囲を選び、形と欠測を保つ固定模型。`tests/array-record-slice.test.js` は両配列の範囲内矩形全72通り、欠測と０、保存を検査。実 DBMS、範囲外や SQL 記述は未評価。
