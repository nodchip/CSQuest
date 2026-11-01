# OS-Devices：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.211–212。[追跡方法](coverage-status.md)に従い、原典の６トピックと６例示学習成果をそれぞれ１項目として記録する。固定模型は実機の操作やドライバー開発能力を直接評価しない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | KA Core | バッファリング戦略 | 部分 | 129で通信路の容量、746で一重・二重の受取りと処理。可変の速度や実装は未評価。 |
| 2 | KA Core | DMA、ポーリング、メモリマップド I/O | 部分 | 105・132で待機と DMA、454で手順、747で装置番地、748で依頼の環状管理を操作。実機 MMIO、DMA 実装・一般のプロトコルは未評価。 |
| 3 | KA Core | 記憶装置の管理と歴史的背景 | 部分 | 749で磁気の位置決めと SSD の固定費用、750でフラッシュの頁更新・退避・消去を操作。実機管理や歴史全般は未評価。 |
| 4 | Non-core | 装置インターフェースと抽象化層 | 部分 | 674で共通窓口と２装置の変換。一般のハードウェア抽象化層は未評価。 |
| 5 | Non-core | ドライバーの目的、抽象、実装、試験の課題 | 部分 | 674で装置ごとの担当と未対応装置。実装・試験の課題は未評価。 |
| 6 | Non-core | 装置通信の高水準の耐障害性 | 未照合 | 装置通信の障害と復旧の教材は未確認。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | KA Core | 装置制御の構造と OS の仕組み・方針 | 部分 | 105・132・674・746・747で通知、転送、仲介、バッファと装置の番地の固定例。実機構と自由な説明は未評価。 |
| 2 | KA Core | 装置管理の層とアーキテクチャ | 部分 | 674で共通窓口、権限、装置担当。実際の制御層は未評価。 |
| 3 | KA Core | 物理ハードウェアと OS の仮想装置 | 部分 | 751で１つの元のブロック装置に二つの非重複の線形仮想装置を対応づける。ほかの装置や実際の設定は未評価。 |
| 4 | KA Core | I/O のバッファリングと実装戦略 | 部分 | 746で固定の１・２皿と重なりを比較。一般の戦略や実装は未評価。 |
| 5 | KA Core | DMA の利点・欠点と適用場面 | 部分 | 132で準備・転送・他の仕事・完了確認。一般の費用と実機は未評価。 |
| 6 | Non-core | ドライバー作成の複雑さと実践 | 未照合 | 実装・試験の実践は未確認。 |

依頼746は [UIC I/O Systems](https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/13_IOSystems.html) の二重バッファを参考に、３組を受け取る装置２刻・処理３刻、切替費用０の固定模型を比較。１皿15刻、２皿11刻で、`tests/io-double-buffer.test.js` は各刻の装置・CPU の動きを独立した期待列と照合する。実機速度、DMA の詳細、競合や一般の性能は評価しない。

依頼747は [Linux のデバイス I/O](https://docs.kernel.org/driver-api/device-io.html) と [OSTEP の I/O Devices](https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf) を参考に、制御・状態・データを架空の番地に割り当て、３枚の受取りと普通のメモリを比較する模型。データ読取り時の消費はこの装置固有の約束で、実機のレジスタ、順序、アクセス幅、権限やドライバー実装は評価しない。`tests/mmio-registers.test.js` で状態遷移・不正な操作・途中履歴を検査する。

依頼748は [Linux の descriptor ring の例](https://docs.kernel.org/5.10/networking/device_drivers/ethernet/toshiba/spider_net.html) と [DMA mapping](https://docs.kernel.org/core-api/dma-api-howto.html) を参考に、３枠の依頼・装置処理・回収と４件目の折返しを操作する。単一の CPU 側と装置、順序どおりの成功と即時に見える状態変更を仮定し、実 DMA、アドレス変換、キャッシュ、メモリバリア、失敗と並行競合は扱わない。`tests/dma-descriptor-ring.test.js` は到達可能な操作順序の全探索で順序と所有状態を検査する。

依頼749は [OSTEP の磁気ディスク](https://pages.cs.wisc.edu/~remzi/OSTEP/file-disks.pdf) と [Linux のブロック I/O](https://www.kernel.org/doc/html/v5.15/block/blk-mq.html) を参考に、４つの同時依頼について到着順と番号の近い順を、移動距離を費用に加える磁気の模型と一律費用の SSD の模型で比較する。各回の基本費用10・初期位置50とし、磁気は254・144、SSD は40・40。回転待ち、SSD の内部処理、並列性や実機性能は扱わず、`tests/storage-scheduling.test.js` で独立した手計算と履歴を照合する。

依頼750は [OSTEP の Flash-based SSDs](https://pages.cs.wisc.edu/~remzi/OSTEP/file-ssd.pdf) を参考に、２ブロック各３頁の更新・対応変更・有効頁の移動・消去と書込み回数を操作する。更新と対応変更は原子的に成功し、消去前に有効頁を移す模型で、実際の SSD の物理配置、障害時の復旧、摩耗分散や寿命は未評価。`tests/flash-translation.test.js` は短い全操作列で各論理記録の有効頁が一つに保たれることを検査する。

依頼751は [Linux device-mapper の linear target](https://docs.kernel.org/admin-guide/device-mapper/linear.html) を参考に、元の８区画をそれぞれ４区画の二つの仮想装置へ非重複で対応づける。範囲と開始位置、同じ番号の別の位置、元装置からの観察と共通障害を比較する。実装設定・権限・並行処理・実際の故障は扱わない。`tests/virtual-block-devices.test.js` で全区画の対応と境界、書込み・読取り・履歴を検査する。
