# SF-Design：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 p.297。[追跡方法](coverage-status.md)の「部分」は限定例、「未照合」は既存教材の有無・十分性が未確認であることを示す。原典はこの単位に Non-core を列挙していない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | CS Core | 活性、安全性、堅牢性、拡張性、セキュリティなどの設計基準 | 部分 | 依頼242で排他の約束違反、244で行き止まりを固定モデル上で探索。各基準の一般的な定義、拡張性や堅牢性の体系的比較は未評価。 |
| 2 | KA Core | 代表的なシステムの設計 | 未照合 | 原典が例示する Apache、Spark、Linux の設計を扱う教材と検証を確認できていない。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | CS Core | 一般的な設計基準を説明 | 部分 | 依頼242・244で排他違反と行き止まりを比べる。活性の一般的な保証や自由な説明は評価しない。 |
| 2 | CS Core | 機能要件と基準から高水準設計を提示 | 未照合 | 依頼243は与えられた倉庫の約束を有限範囲で検査する例。一般の要件から高水準設計を提示する体験は確認できていない。 |
| 3 | KA Core | 代表的なシステムの設計を説明 | 未照合 | 実在システムの設計の説明・検証を確認できていない。 |

対応する実装と検証は `src/model-checking.js`・`tests/model-checking.test.js`、`src/deadlock-checking.js`・`tests/deadlock-checking.test.js`、`src/contract-exhaustive.js`・`tests/contract-exhaustive.test.js` を参照。有限モデルの網羅は実システム一般の性質を証明しない。
