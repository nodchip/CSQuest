# CS2023 対応の追跡方法

目標は全17分野の各トピックと例示学習成果の対応・検証であり、依頼数や自動テスト件数を完成率に換算しない。[知識単位の目録](knowledge-units.md)は原典の目次との一致を確認するためのもので、教材の網羅・深さ・正確性を証明しない。

2026-11-01 に公開原典の PDF を再取得し、`pdftotext -layout` と `scripts/check_knowledge_units.py` で目次を照合した結果、原典・目録とも166単位、差異０だった。この検査の対象は目次の ID・名称・ページであり、本文のトピックや学習成果ではない。

項目単位の新しい台帳は [AI-Introduction](coverage-ai-introduction.md)、[AI-Search](coverage-ai-search.md)、[AI-Planning](coverage-ai-planning.md)、[AI-Probability](coverage-ai-probability.md)、[SPD-Robot](coverage-spd-robot.md)、[PDC-Communication](coverage-pdc-communication.md)、[SF-Overview](coverage-sf-overview.md)、[SF-Foundations](coverage-sf-foundations.md)、[SF-Resource](coverage-sf-resource.md)、[SF-Performance](coverage-sf-performance.md)、[SF-Evaluation](coverage-sf-evaluation.md)、[SF-Reliability](coverage-sf-reliability.md)、[SF-Security](coverage-sf-security.md)、[SF-Design](coverage-sf-design.md)、[SF-SEP](coverage-sf-sep.md) から試行する。各原典項目について、区分、状態、具体的な依頼、残る範囲を記す。親項目とその子項目を数値上で重複計上しないため、集計時の単位を明記する。個別の Core 区分が原典にない成果に、推測で区分を付けない。

状態は「未照合」「部分」「完了」を区別する。未照合は未実装の証拠ではない。部分は教材例の存在を示し、項目全体の完成を意味しない。完了には原典の対象範囲、学習体験、根拠に基づく正答・解説の検証、必要な操作・再開、ゲーム内で直接評価できない成果の代替と限界を確認する。ユーザーが除外したコード・文章入力を実装していないこと自体は欠陥とせず、その能力を評価したとも主張しない。

現時点ではこの形式で見直したのは15単位。他の151単位には既存の個別文書や部分的な照合があるが、新しい台帳と同じ粒度での確認はまだ行っていない。この15/166 は台帳の整備状況であり、CS2023 全体の教材完成率ではない。今後は原典と既存の実装・検証を照合し、未照合を根拠なく未対応や完了に変えず、単位ごとに台帳へ追加する。
