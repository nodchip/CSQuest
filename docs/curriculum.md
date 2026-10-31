# CS2023 対応状況

原典: [Computer Science Curricula 2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf)、知識領域一覧 pp. 29–30。現段階では分野の目録であり、各トピックの網羅や学習成果の達成を示さない。

| 略号 | 分野 | 状況 |
|---|---|---|
| AI | 人工知能 | 一部試作：最近傍分類と過学習、A*・見積もり、鍵を含む状態での計画、小規模な対戦と制約充足、条件付き確率の固定例。他の手法や実データの評価は未対応。[探索](ai-search.md)・[計画](ai-planning.md)・[確率](ai-probability.md) |
| AL | アルゴリズムの基礎 | 一部試作：整列・探索と比較回数の増加、最短路・最小全域木、ハッシュ表、有限状態とスタック付きの機械、動的計画法と貪欲法の固定例。一般的な証明や計算量の導出などは未対応 |
| AR | アーキテクチャと構成 | 一部試作：論理ゲート、加算器、数値と UTF-8 の表現、架空の命令実行、単一量子ビットの干渉と観測。実機の数値形式や命令セットなどは未対応。[データ表現](ar-representation.md)・[量子](ar-quantum.md) |
| DM | データ管理 | 一部試作：行の選択・結合、複合索引の候補範囲、更新異常と分解、送金の原子性・永続性と分離の固定例。SQL の記述や DBMS の復旧機構などは未対応。[索引](dm-processing.md)・[内部](dm-internals.md) |
| FPL | プログラミング言語の基礎 | 一部試作：型、個体の状態、列処理、クロージャ、構文木、イベントの処理登録。実言語の型や関数定義は未対応。[関数](fpl-functional.md)・[構文](fpl-syntax.md)・[イベント](fpl-event-driven.md) |
| GIT | グラフィックスと対話技術 | 一部試作：２次元図形の変換、２点の投影、三角形の画素標本化。３次元物体や実際の描画 API は未対応。[基礎](git-fundamentals.md)・[描画](git-rendering.md) |
| HCI | ヒューマンコンピュータインタラクション | 一部試作：案内板の色以外の手がかり、キーボード操作、読み上げ用の名前と、架空の試用記録の評価。実利用者や規格に基づく評価は未対応 |
| MSF | 数学と統計の基礎 | 一部試作：有限集合、命題の推論と帰納法、確率・期待値・分散、平均と中央値、２次元の内積と行列変換。一般の証明、連続分布や連立方程式などは未対応。[離散数学](msf-discrete.md)・[確率](msf-probability.md)・[線形代数](msf-linear.md) |
| NC | ネットワークと通信 | 一部試作：階層と区間ごとの宛先、固定転送表、最長接頭辞照合、消失・再送と重複抑止。実 IP や TCP の実装は未対応。[基礎](nc-fundamentals.md)・[経路](nc-routing.md) |
| OS | オペレーティングシステム | 一部試作：仕事の状態、保護とシステムコール、ページ置換と住所変換、ファイルの名前と開いた参照。スレッドや実 OS の詳細などは未対応。[ファイル](os-files.md) |
| PDC | 並列・分散コンピューティング | 一部試作：並行する読み書き、排他・循環待ち・バリア、固定量の並列化と逐次部分の限界。実際のプログラムや分散処理は未対応 |
| SDF | ソフトウェア開発の基礎 | 一部試作：順序、条件分岐、繰り返し、再帰と待ち行列・スタックの固定例。実際の言語でプログラムを書く学習成果は直接評価しない。[データ構造](sdf-data-structures.md) |
| SE | ソフトウェア工学 | 一部試作：架空の要件整理、仕様に基づく有限の試験選択、共通の元から分かれた変更の統合。実際の関係者との合意やコードなどは未対応。[要件](se-requirements.md) |
| SEC | セキュリティ | 一部試作：本人確認の結果と役割別の許可、最小権限、XOR と鍵再利用、検索条件への入力の扱い。実システムの設計や認証・暗号の実装は未対応。[安全なコーディング](sec-coding.md) |
| SEP | 社会・倫理・専門職 | 一部試作：台帳の収集・閲覧範囲、架空の関係者の声と選択肢、装置の負荷を期間・集計範囲別に比較。法令、文化差、倫理理論の体系的分析は未対応。[持続可能性](sep-sustainability.md) |
| SF | システムの基礎 | 一部試作：容量２のキャッシュと時間的局所性、固定量の並列化による完了時間。実システムの階層、一貫性、仮想化は未対応 |
| SPD | 専門プラットフォームの開発 | 一部試作：自動人形の観測・移動・充電、Web 受付の再送、ゲームの一次元衝突判定。実機や実アプリの開発、安全性は未対応。[ゲーム](spd-game.md) |

知識単位の目録は [knowledge-units.md](knowledge-units.md)、詳細対応は [ai-ml.md](ai-ml.md)、[spd-robot.md](spd-robot.md)、[spd-web.md](spd-web.md)、[sep-privacy.md](sep-privacy.md)、[sep-ethical-analysis.md](sep-ethical-analysis.md)、[git-rendering.md](git-rendering.md)、[sf-performance.md](sf-performance.md)、[sf-evaluation.md](sf-evaluation.md)、[fpl-types.md](fpl-types.md)、[fpl-oop.md](fpl-oop.md)、[se-validation.md](se-validation.md)、[se-tools.md](se-tools.md)、[se-teamwork.md](se-teamwork.md)、[hci-accessibility.md](hci-accessibility.md)、[hci-evaluation.md](hci-evaluation.md)、[msf-probability.md](msf-probability.md)、[sdf-fundamentals.md](sdf-fundamentals.md)、[ar-logic.md](ar-logic.md)、[ar-assembly.md](ar-assembly.md)、[al-foundational.md](al-foundational.md)、[al-other-units.md](al-other-units.md)、[nc-reliability.md](nc-reliability.md)、[nc-applications.md](nc-applications.md)、[sec-foundations.md](sec-foundations.md)、[sec-crypto.md](sec-crypto.md)、[dm-querying.md](dm-querying.md)、[dm-relational.md](dm-relational.md)、[os-principles.md](os-principles.md)、[os-scheduling.md](os-scheduling.md)、[os-process.md](os-process.md)、[os-memory.md](os-memory.md)、[pdc-coordination.md](pdc-coordination.md)、[pdc-evaluation.md](pdc-evaluation.md) を参照。次の作業: 残りの知識単位についても CS Core、KA Core、Non-core のトピックと学習成果を原典から抽出し、各項目に状態、具体的な体験、検証証拠、ゲーム操作の限界を記録する。
