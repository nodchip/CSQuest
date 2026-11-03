# SF-Design：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 p.297。[追跡方法](coverage-status.md)の「部分」は限定例、「未照合」は既存教材の有無・十分性が未確認であることを示す。原典はこの単位に Non-core を列挙していない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | CS Core | 活性、安全性、堅牢性、拡張性、セキュリティなどの設計基準 | 部分 | 依頼242で排他の約束違反、244で行き止まりを固定モデル上で探索。各基準の一般的な定義、拡張性や堅牢性の体系的比較は未評価。 |
| 2 | KA Core | 代表的なシステムの設計 | 部分 | 1190で Linux VFS の共通窓口、名前探索、記述子と種類ごとの処理を２例でたどる。Linux 全体や Apache・Spark は未評価。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | CS Core | 一般的な設計基準を説明 | 部分 | 依頼242・244で排他違反と行き止まりを比べる。活性の一般的な保証や自由な説明は評価しない。 |
| 2 | CS Core | 機能要件と基準から高水準設計を提示 | 部分 | 依頼1189で受付・同時更新・記録・確定の４選択を組み合わせ、通常と４つの品質場面を試す。一般の要件から自由に設計を提示する力は評価しない。 |
| 3 | KA Core | 代表的なシステムの設計を説明 | 部分 | 1190で Linux VFS の共通窓口と種類ごとの処理を２例で比較。Linux 全体や自由な説明は未評価。 |

対応する実装と検証は `src/model-checking.js`・`tests/model-checking.test.js`、`src/deadlock-checking.js`・`tests/deadlock-checking.test.js`、`src/contract-exhaustive.js`・`tests/contract-exhaustive.test.js` を参照。有限モデルの網羅は実システム一般の性質を証明しない。

依頼1189は [CMU の設計と品質要件](https://www.cs.cmu.edu/~schmerl/courses/15-413/deliverables.html) と [SQLite の原子的な確定](https://www.sqlite.org/atomiccommit.html)を参考に、受付・同時更新・保存・確定の４選択を組み、通常受取り・再起動・同時依頼・確定前停止・権限の５場面を試す。各仕組みの振る舞いは教材用の仮定で、実システムの可用性、保管装置の故障、性能や一般の安全性を保証しない。`tests/warehouse-architecture.test.js` で16設計と全場面・途中復元を検査する。

依頼1190は [Linux カーネルの VFS 解説](https://docs.kernel.org/filesystems/vfs.html) と [Linux の open](https://man7.org/linux/man-pages/man2/open.2.html) を参考に、既存の ext4 通常ファイルと procfs 疑似ファイルについて、パス・キャッシュ外れ時の種類別探索・ファイル記述子・読取り処理を固定の５段階で追う。実カーネルの実行トレースではなく、権限やキャッシュ詳細、すべての呼び出しや種類は省略。`tests/linux-vfs-trail.test.js` で両例の段階・誤操作・復元を検査する。
