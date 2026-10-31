# CS2023 対応状況

原典: [Computer Science Curricula 2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf)、知識領域一覧 pp. 29–30。現段階では分野の目録であり、各トピックの網羅や学習成果の達成を示さない。

| 略号 | 分野 | 状況 |
|---|---|---|
| AI | 人工知能 | 一部試作：架空データの最近傍分類と評価比較、固定グラフでの A*・見積もりの比較、小規模なミニマックス対戦と制約充足。他の手法や実データの評価は未対応。[AI-Search の対応](ai-search.md) |
| AL | アルゴリズムの基礎 | 一部試作：安定なマージソート、二分探索木と探索、最短路・最小全域木、トポロジカル順序と閉路、ハッシュ表の連鎖法、二状態の有限状態機械。他の整列手法や一般的な計算量の導出などは未対応 |
| AR | アーキテクチャと構成 | 一部試作：論理ゲートの組合せ、加算器、４ビットの整数表現と範囲超過。順序回路・計算機構成などは未対応。[AR-Representation の対応](ar-representation.md) |
| DM | データ管理 | 一部試作：複数条件による行の選択、内部結合、送金の中断における原子性と永続性、未確定値の読み取りと競合直列化の固定例。SQL の記述や DBMS の復旧機構などは未対応。[DM-Internals の対応](dm-internals.md) |
| FPL | プログラミング言語の基礎 | 一部試作：型の接続検査、個体の状態と動的ディスパッチ、列処理とクロージャの固定例。実言語の型やクラス・関数定義は未対応。[FPL-Functional の対応](fpl-functional.md) |
| GIT | グラフィックスと対話技術 | 一部試作：２次元図形の平行移動と回転、２点の平行・透視投影。３次元物体や描画技術は未対応 |
| HCI | ヒューマンコンピュータインタラクション | 一部試作：案内板の色以外の手がかり、キーボード操作、読み上げ用の名前と、架空の試用記録の評価。実利用者や規格に基づく評価は未対応 |
| MSF | 数学と統計の基礎 | 一部試作：有限集合の操作と包除、条件付き確率、期待値、平均と中央値、２次元の内積の固定例。一般の証明、分布、分散、行列などは未対応。[MSF-Discrete の対応](msf-discrete.md) |
| NC | ネットワークと通信 | 一部試作：固定転送表、最長接頭辞照合、データ・応答の消失と再送、受付の重複抑止。実 IP や TCP の実装は未対応。[NC-Routing の対応](nc-routing.md) |
| OS | オペレーティングシステム | 一部試作：仕事の順番と状態、保護とシステムコール、FIFO と LRU によるページ置換、固定ページ表による住所変換。スレッドや実 OS の仕組みなどは未対応 |
| PDC | 並列・分散コンピューティング | 一部試作：並行する読み書き、排他と循環待ち、固定量の並列化と逐次部分の限界。実際のプログラムや分散処理は未対応 |
| SDF | ソフトウェア開発の基礎 | 一部試作：順序、条件分岐、固定回数の繰り返し、再帰の固定例。SDF-Fundamentals pp. 230–231 の一部に関連。実際の言語でプログラムを書く学習成果は直接評価しない。 |
| SE | ソフトウェア工学 | 一部試作：仕様と異なる動作を発見する有限の試験選択、共通の元から分かれた変更の統合。実際のチーム作業やコードなどは未対応 |
| SEC | セキュリティ | 一部試作：本人確認の結果と役割別の許可、最小権限、XOR と鍵再利用の固定例。認証や暗号の実装、他の保護技術は未対応 |
| SEP | 社会・倫理・専門職 | 一部試作：受取台帳の収集・閲覧範囲と、架空の関係者の声・３案の影響を比較。法令、文化差、倫理理論の体系的分析は未対応 |
| SF | システムの基礎 | 一部試作：容量２のキャッシュと時間的局所性、固定量の並列化による完了時間。実システムの階層、一貫性、仮想化は未対応 |
| SPD | 専門プラットフォームの開発 | 一部試作：固定格子の自動人形と Web 受付の再送の例。実機、実 Web アプリの開発、安全性は未対応 |

知識単位の目録は [knowledge-units.md](knowledge-units.md)、詳細対応は [ai-ml.md](ai-ml.md)、[spd-robot.md](spd-robot.md)、[spd-web.md](spd-web.md)、[sep-privacy.md](sep-privacy.md)、[sep-ethical-analysis.md](sep-ethical-analysis.md)、[git-rendering.md](git-rendering.md)、[sf-performance.md](sf-performance.md)、[sf-evaluation.md](sf-evaluation.md)、[fpl-types.md](fpl-types.md)、[fpl-oop.md](fpl-oop.md)、[se-validation.md](se-validation.md)、[se-tools.md](se-tools.md)、[se-teamwork.md](se-teamwork.md)、[hci-accessibility.md](hci-accessibility.md)、[hci-evaluation.md](hci-evaluation.md)、[msf-probability.md](msf-probability.md)、[sdf-fundamentals.md](sdf-fundamentals.md)、[ar-logic.md](ar-logic.md)、[al-foundational.md](al-foundational.md)、[al-other-units.md](al-other-units.md)、[nc-reliability.md](nc-reliability.md)、[nc-applications.md](nc-applications.md)、[sec-foundations.md](sec-foundations.md)、[sec-crypto.md](sec-crypto.md)、[dm-querying.md](dm-querying.md)、[os-principles.md](os-principles.md)、[os-scheduling.md](os-scheduling.md)、[os-process.md](os-process.md)、[os-memory.md](os-memory.md)、[pdc-coordination.md](pdc-coordination.md)、[pdc-evaluation.md](pdc-evaluation.md) を参照。次の作業: 残りの知識単位についても CS Core、KA Core、Non-core のトピックと学習成果を原典から抽出し、各項目に状態、具体的な体験、検証証拠、ゲーム操作の限界を記録する。
