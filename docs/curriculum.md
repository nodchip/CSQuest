# CS2023 対応状況

原典: [Computer Science Curricula 2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf)、知識領域一覧 pp. 29–30。現段階では分野の目録であり、各トピックの網羅や学習成果の達成を示さない。

| 略号 | 分野 | 状況 |
|---|---|---|
| AI | 人工知能 | 一部試作：架空データの最近傍分類と既知・未使用の例での評価比較。他の手法や実データの評価は未対応 |
| AL | アルゴリズムの基礎 | 一部試作：隣接交換による整列、線形・二分・幅優先・深さ優先探索、重み付き最短路・最小全域木、ハッシュ表の連鎖法による衝突処理、二状態の有限状態機械。特定の整列手法や一般的な計算量などは未対応 |
| AR | アーキテクチャと構成 | 一部試作：論理ゲートの組合せ、加算器、４ビットの整数表現と範囲超過。順序回路・計算機構成などは未対応。[AR-Representation の対応](ar-representation.md) |
| DM | データ管理 | 一部試作：複数条件による行の選択、内部結合、送金の中断における原子性と永続性の固定例。SQL の記述や DBMS の復旧機構などは未対応。[DM-Internals の対応](dm-internals.md) |
| FPL | プログラミング言語の基礎 | 一部試作：数と灯りの二種類の型で、道具の入力・出力を検査。実際の言語の型システム全般は未対応 |
| GIT | グラフィックスと対話技術 | 一部試作：２次元図形の固定された平行移動と回転の順序。３次元、投影、描画技術は未対応 |
| HCI | ヒューマンコンピュータインタラクション | 一部試作：案内板の色以外の手がかり、キーボード操作、読み上げ用の名前。実利用者や規格に基づく評価は未対応 |
| MSF | 数学と統計の基礎 | 一部試作：固定された有限集団での条件付き確率とベイズ的な割合の比較。分布、期待値、線形代数などは未対応 |
| NC | ネットワークと通信 | 一部試作：データ・応答の消失、再送、重複排除。ネットワーク全体や TCP の実装は未対応 |
| OS | オペレーティングシステム | 一部試作：先着順とラウンドロビンによる仕事の順番、FIFO と LRU によるページ置換。プロセス、アドレス変換などは未対応 |
| PDC | 並列・分散コンピューティング | 一部試作：並行する読み書き、単一の鍵による排他、２鍵の循環待ち。実際のプログラムや分散処理は未対応 |
| SDF | ソフトウェア開発の基礎 | 一部試作：順序、条件分岐、固定回数の繰り返し、再帰の固定例。SDF-Fundamentals pp. 230–231 の一部に関連。実際の言語でプログラムを書く学習成果は直接評価しない。 |
| SE | ソフトウェア工学 | 一部試作：仕様と異なる動作を発見する有限の試験選択。試験計画、開発、実際のコードなどは未対応 |
| SEC | セキュリティ | 一部試作：本人確認の結果と役割別の許可、最小権限。認証の実装や他の保護技術は未対応 |
| SEP | 社会・倫理・専門職 | 一部試作：架空の受取台帳で収集項目と閲覧範囲を選び、番号による記録の結び付きを考える。法令、文化差、他の倫理課題は未対応 |
| SF | システムの基礎 | 一部試作：架空の容量２のキャッシュで時間的局所性と順序の影響を比較。実システムの階層、一貫性、仮想化は未対応 |
| SPD | 専門プラットフォームの開発 | 一部試作：固定格子の自動人形で前方の観測と移動を操作。実機、プラットフォーム固有の開発、安全性は未対応 |

知識単位の目録は [knowledge-units.md](knowledge-units.md)、詳細対応は [ai-ml.md](ai-ml.md)、[spd-robot.md](spd-robot.md)、[sep-privacy.md](sep-privacy.md)、[git-rendering.md](git-rendering.md)、[sf-performance.md](sf-performance.md)、[fpl-types.md](fpl-types.md)、[se-validation.md](se-validation.md)、[hci-accessibility.md](hci-accessibility.md)、[msf-probability.md](msf-probability.md)、[sdf-fundamentals.md](sdf-fundamentals.md)、[ar-logic.md](ar-logic.md)、[al-foundational.md](al-foundational.md)、[al-other-units.md](al-other-units.md)、[nc-reliability.md](nc-reliability.md)、[sec-foundations.md](sec-foundations.md)、[dm-querying.md](dm-querying.md)、[os-scheduling.md](os-scheduling.md)、[os-memory.md](os-memory.md)、[pdc-coordination.md](pdc-coordination.md) を参照。次の作業: 残りの知識単位についても CS Core、KA Core、Non-core のトピックと学習成果を原典から抽出し、各項目に状態、具体的な体験、検証証拠、ゲーム操作の限界を記録する。
