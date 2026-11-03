# DM-Distributed：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 p.122。全て Non-core。[追跡方法](coverage-status.md)に従い、親項目がある場合は子を追跡し重複計上しない。原典に独立した例示学習成果はない。未照合は未実装の証拠ではない。固定模型は実際の分散システムの保証を評価しない。

| 番号 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|
| 1a | 分散 DBMS のデータ保存 | 部分 | 190・191で２複製の配送と２棚への分割を操作。実際の保存・障害時の振る舞いは未評価。 |
| 1b | 分散問い合わせ処理 | 部分 | 294で全行転送と半結合による絞込みを比較。一般の最適化や実装は未評価。 |
| 1c | 分散トランザクション | 部分 | 293で二相コミットの準備・決定・通知と停止を操作。一般の故障・実システムは未評価。 |
| 1d | 同種・異種の解決策 | 部分 | 1123で同じ台帳間の接続と異なる台帳向けの仲介を比較。実製品の変換・互換性は未評価。 |
| 1e | クライアント・サーバー型分散 DB | 部分 | 1123で依頼人・受付サーバー・遠隔サーバーの読取りを追う。実ネットワークと一般の構成は未評価。 |
| 2a | 共有メモリ・共有ディスク・共有なし | 部分 | 1122で２書記のメモリ・保存棚の共有と通信を比較。実構成・性能や障害時の挙動は未評価。 |
| 2b | 速度向上・規模拡大と MapReduce | 部分 | 130で固定の分担・集約、285で累積和を操作。実 DB の評価と規模拡大の一般分析は未評価。 |
| 2c | 複製と弱い整合性 | 部分 | 190・193で配送の遅れ・読み書きの重なりを比較。他の整合性モデルと実装の保証は未評価。 |

依頼293・294の前提と参考は [DM-Distributed](dm-distributed.md)、190・191・193は [DM-NoSQL](dm-nosql.md) を参照。`tests/two-phase-commit.test.js`、`tests/distributed-join.test.js`、`tests/replica-lag.test.js`、`tests/shard-routing.test.js`、`tests/quorum.test.js` は各固定模型を検査する。

依頼1122は [Oracle の並列構成](https://docs.oracle.com/cd/A57673_01/DOC/server/doc/SPS73/chap3.htm) と [DeWitt・Gray の論文](https://people.csail.mit.edu/tdanford/6830papers/dewitt-gray-parallel-databases.pdf) を参考に、共有メモリ、共有ディスク、共有なしの２書記の固定模型を比較する。「直接」は他の書記への依頼を介さない意味で、共有棚への物理的な接続方式や距離は限定しない。配置・競合・キャッシュ整合性や故障時の可用性、実機の性能は判定しない。`tests/parallel-db-architecture.test.js` は６条件・保存と達成を検査する。

依頼1123は [Oracle の分散データベース](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/admin/distributed-database-concepts.html) と[異種接続](https://docs.oracle.com/en/database/oracle/oracle-database/19/heter/address-synchronous-information-integration.html)を参考に、依頼人・受付・遠隔先を経由する２台帳の読取りを扱う。異種の仲介と遠隔停止を固定例で比較し、遠隔から値を得られなければ受付は合計を返さない。模型上の真値は学習者に示すが、受付には問い合わせ前の遠隔値がない。実製品の変換、同時更新、一貫性や実ネットワークは評価しない。`tests/federated-db.test.js` は成功・接続不一致・停止・途中復元を検査する。

遠征1124は1123の異種接続と294の疎な注文の分散結合を再利用し、接続、全行転送と番号による絞込み、結果の報告をつなぐ。２方式はともに３行を返し、番号１個とデータ１行を等しい費用とする仮定では転送数は６と４。`tests/distributed-data-journey.test.js` は誤った接続・選択からの修正、途中復元と結果を検査する。固定例であり、一般の通信量・実行時間、実 DB の接続や性能を示さない。データ管理の「二つの村の分散台帳」は、基礎から分割・複製・接続・結合と遠征をたどる任意の道であり、単位の全範囲を網羅するものではない。
