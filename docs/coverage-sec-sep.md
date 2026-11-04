# SEC-SEP：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.258–259。[既存調査](sec-society.md)と教材を照合した。実際の調査・法令適合・システム構築は固定例で評価しない。

## トピック

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | CS Core | プライバシーの原則と実践 | 部分 | 194・352で架空の収集範囲を比較。一般の原則・実装は未評価。 |
| 2 | CS Core | 安全性・プライバシーの破綻による社会的影響 | 部分 | 362で架空の窓口停止と申請予定を比較。実社会への影響は未評価。 |
| 3 | CS Core | セキュリティ・プライバシーの法令・規制 | 部分 | 1113で GDPR 適用を仮定したデータ最小化と初期設定、1191で３原則を比較。適用判断、法令全体と他法域は未評価。 |
| 4 | CS Core | 安全設計・プライバシーと職業倫理、倫理的な調査 | 部分 | 360で欠陥の確認と報告を操作。実際の設計や調査は未評価。 |
| 5 | KA Core | 設計段階からのセキュリティ | 部分 | 328で固定の脅威と対策、1316で固定業務に必要な権限と目的判別の限界を比較。一般の設計は未評価。 |
| 6 | KA Core | 設計段階からのプライバシー | 部分 | 194・352で収集範囲を比較。一般の実装は未評価。 |
| 7 | KA Core | 悪意ある AI・機械学習と安全・プライバシー | 部分 | 1196で架空の声と画像について来歴・別経路・文脈を比較。実際の合成検出やプライバシー影響の網羅は未評価。 |
| 8 | KA Core | IoT 等の新技術が社会の安全・プライバシーに与える影響 | 部分 | 352で室内情報収集の固定例。実社会と技術全般は未評価。 |

## 例示学習成果

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | CS Core | システムの安全性破綻による影響を計算 | 部分 | 362で停止した２窓口の申請予定20件を集計。原因や被害人数は未確定。 |
| 2 | CS Core | 安全に関する法に適合するシステムを構築 | 部分 | 1319で FDA の対象医療機器に関する一部要件を参考に、架空の部品一覧・更新・監視・連絡を操作。実システム構築・法令適合や全要件は未評価。 |
| 3 | CS Core | プライバシー規制を適用して設計 | 部分 | 1113で GDPR 適用を仮定し、２目的に必要な受付項目を選択。実システムの設計・実装や法令全体への適合は未評価。 |
| 4 | KA Core | 法令に適合しないシステムの法的影響を評価 | 未照合 | 対応教材を要照合。 |
| 5 | KA Core | 利用者のプライバシーへの害を避けるシステムを構築 | 部分 | 194・352の固定の選択。実システムの構築は評価しない。 |

362の20件は停止窓口の申請予定数であり、原因・流出・被害人数を示さない。[NIST のインシデント対応](https://csrc.nist.gov/projects/incident-response)への参照と模型の前提は[既存調査](sec-society.md)を参照。

2026-11-04 に原典の SEC-SEP 項目と依頼1113の画面・模型・検証を照合した。1113は [EDPB の設計・初期設定による保護](https://www.edpb.europa.eu/topics/ai-and-technology/privacy-by-design-and-by-default_en)と [GDPR の原則の解説](https://www.edpb.europa.eu/sme/learn-the-basics/data-protection-basics_en)を参考に、２つの架空の目的に必要な項目の不足・過剰・適切な組合せを比較する。GDPR が適用されるという仮定の下でのデータ最小化の一部であり、法域の適用条件、処理の法的根拠、保存・アクセス・組織措置の実装や適法性は確認しない。`tests/privacy-design-law.test.js` は問題文と別に固定した必要項目と全32組合せを照合し、保存と達成条件を検査する。1191は３原則と架空の影響の比較で、全法域や個別の法的判断を評価しない。

依頼1196は [NIST の合成コンテンツの透明性とリスクに関する報告](https://www.nist.gov/publications/reducing-risks-posed-synthetic-content-overview-technical-approaches-digital-content) を参考に、架空の声と２画像で、本人に似た印象、来歴の欠如、署名の検証結果と文脈を別経路の記録と比較する。署名・別経路の結果は模型の仮定で、実際のメディア解析、署名検証、検出精度や安全性は評価しない。`tests/synthetic-evidence.test.js` は全選択肢と資料確認・途中保存を検査する。

依頼1319は [FDA の医療機器サイバーセキュリティ FAQ](https://www.fda.gov/medical-devices/digital-health-center-excellence/cybersecurity-medical-devices-frequently-asked-questions-faqs) と [2026年ガイダンス](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-management-system-considerations-and-content-premarket) を参考に、３部品の架空の版一覧、弱点を知らせる条件、修正、継続的な対応と連絡を操作する。524B の適用対象と実際の法令要件・ガイダンスを区別し、模型の一覧を完全な SBOM や法令適合と主張しない。`tests/device-security-plan.test.js` は８一覧、更新後の一覧無効化と復元を検査。実機・医療安全・実際の構築と法令全体の適合は未評価。
