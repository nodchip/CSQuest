# AR-Security：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.107–108。[既存の調査](ar-security.md)と依頼を照合した。状態は[追跡方法](coverage-status.md)を参照。1・4・5 は子項目で追う。

## トピック

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1a | KA Core | ハードウェアのリスク分析、資産保護、脅威モデル | 部分 | 180 は固定の脅威と対策の比較。ハードウェア固有の分析は未評価。 |
| 1b | KA Core | 暗号処理のハードウェア加速 | 部分 | 1088で専用命令と外付け装置の仮の準備・処理時間を比較。実装・実機の性能や安全性は未評価。 |
| 1c | KA Core | 仮想化支援と OS 隔離 | 部分 | 135 は仮想マシンとコンテナのカーネル共有を比較。ハードウェア支援と隔離の安全性は未評価。 |
| 2 | KA Core | 信頼の起点と PUF | 部分 | 257 で個体差と揺らぎ、383 で信頼された検証器を仮定した起動検証。実装と構築は未評価。 |
| 3 | KA Core | ハードウェア乱数生成器 | 部分 | 256 は決定的な数列と外部雑音の比較。実際の雑音源や健全性検査は未評価。 |
| 4a | KA Core | 実行時のポインタ範囲検査 | 部分 | 255 は範囲付きの鍵で固定アクセスを比較。実機の例外とバッファ操作は未評価。 |
| 4b | KA Core | マイクロアーキテクチャ水準の保護 | 部分 | 494 は投機取消し後のキャッシュの模型。実機や一般の保護は未評価。 |
| 4c | KA Core | ISA 水準の保護 | 部分 | 255 は範囲と許可の模型。タグ、導出、命令と実装は未評価。 |
| 5a | KA Core | TEE の信頼基盤の保護 | 部分 | 258 は証明検証器と署名への信頼を仮定。信頼基盤の構成・保護は未評価。 |
| 5b | KA Core | TEE による仮想マシンの保護 | 部分 | 258 は構成証明と鍵の受渡しの模型。実際の隔離と実機は未評価。 |
| 5c | KA Core | TEE によるコンテナの保護 | 部分 | 1090で署名と容器の識別値等を確認し秘密の受渡しを選ぶ。実際の隔離・検証・鍵管理は未評価。 |
| 5d | KA Core | 信頼されたソフトウェアモジュール | 部分 | 1091で理想化した封印室の入口の再読取と内部の写し、出口の情報を比較。実 TEE・実装や一般の攻撃は未評価。 |
| 6 | KA Core | プライバシーを保つ処理と準同型暗号 | 部分 | 259 は教科書的 RSA の乗算の模型。安全な方式、加算や実用費用は未評価。 |

## 例示学習成果

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | KA Core | 安全なハードウェアの原則とリスク分析・資産保護を論じる | 部分 | 180 は固定の攻撃経路と対策。ハードウェア固有の分析と自由な議論は未評価。 |
| 2 | KA Core | PUF による装置固有識別を要約 | 部分 | 257 は登録・再測定と誤判定の固定例。実装、攻撃耐性、自由な要約は未評価。 |
| 3 | KA Core | 専用ハードウェアのある乱数生成器とないものを区別 | 部分 | 256 は物理的雑音源と決定的規則を比較。実生成器の構成と検証は未評価。 |
| 4 | KA Core | ISA 水準のメモリ保護の利点・欠点を列挙 | 部分 | 255 は範囲外検出とその限界。一般の比較と自由な列挙は未評価。 |
| 5 | KA Core | 仮想マシン向け TEE の設計課題を説明 | 部分 | 258 は構成証明の固定例。実装全体と自由な説明は未評価。 |

依頼1088は [Intel の AES 専用命令](https://www.intel.com/content/www/us/en/developer/articles/technical/advanced-encryption-standard-instructions-aes-ni.html)と [Arm の暗号アクセラレータ](https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/PSA/DEN0083_PSA_TBSA-M_1.0-bet2.pdf)を参考に、汎用命令・CPU の専用命令・外付け装置の仮の時間を比較する。`tests/crypto-acceleration.test.js` で９条件、保存と達成を検査。時間は架空であり、実際の暗号実行、性能、電力や安全性は未評価。

依頼1089は暗号加速の比較に加え、暗号化のみと改ざん検出を備える保護を選ぶ。鍵の安全な共有と認証付き暗号の正しい実行を仮定し、実暗号・鍵管理・実装の安全性は評価しない。`tests/compute-rescue-journey.test.js` は順序と選択を検査する。

依頼1090は [Google Cloud の保護された容器と構成証明](https://docs.cloud.google.com/docs/security/confidential-space)および [Confidential Containers の方針](https://confidentialcontainers.org/docs/attestation/policies/)を参考に、署名を確認した後、照会・容器の識別値・信頼基盤・宛先の固定結果と方針を照合する。`tests/confidential-container.test.js` は６証拠と24通りの項目確認順、署名無効、途中復元と達成を検査する。検証器・鍵・基準は正しいと仮定し、実装、TEE の隔離、容器の脆弱性や出力は未評価。

依頼1091は [Intel のエンクレーブ境界](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sgx-web-based-training.html)と [境界を越えるデータの説明](https://www.intel.com/content/www/us/en/developer/articles/code-sample/intel-software-guard-extensions-developing-a-sample-enclave-application.html)を参考に、外側の値の検査後の変更と内部の写し、外への出力を比較する。`tests/enclave-boundary.test.js` は４操作列・順序・保存と達成を検査。単一値の写しが安定する理想模型で、実 TEE のコピー中の競合やサイドチャネルは未評価。
