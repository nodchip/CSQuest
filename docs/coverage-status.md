# CS2023 対応の追跡方法

目標は全17分野の各トピックと例示学習成果の対応・検証であり、依頼数や自動テスト件数を完成率に換算しない。[知識単位の目録](knowledge-units.md)は原典の目次との一致を確認するためのもので、教材の網羅・深さ・正確性を証明しない。

2026-11-01 に公開原典の PDF を再取得し、`pdftotext -layout` と `scripts/check_knowledge_units.py` で目次を照合した結果、原典・目録とも166単位、差異０だった。この検査の対象は目次の ID・名称・ページであり、本文のトピックや学習成果ではない。

項目単位の新しい台帳は [AI-Robotics](coverage-ai-robotics.md)、[AI-Vision](coverage-ai-vision.md)、[AI-Agents](coverage-ai-agents.md)、[AI-NLP](coverage-ai-nlp.md)、[AI-KRR](coverage-ai-krr.md)、[AI-LRR](coverage-ai-lrr.md)、[DM-Data](coverage-dm-data.md)、[DM-Analytics](coverage-dm-analytics.md)、[DM-Distributed](coverage-dm-distributed.md)、[DM-Unstructured](coverage-dm-unstructured.md)、[DM-Internals](coverage-dm-internals.md)、[DM-NoSQL](coverage-dm-nosql.md)、[DM-Security](coverage-dm-security.md)、[DM-SEP](coverage-dm-sep.md)、[SEP-Privacy](coverage-sep-privacy.md)、[SEP-IP](coverage-sep-ip.md)、[AR-Logic](coverage-ar-logic.md)、[AR-Assembly](coverage-ar-assembly.md)、[AI-Introduction](coverage-ai-introduction.md)、[AI-Search](coverage-ai-search.md)、[AI-Planning](coverage-ai-planning.md)、[AI-Probability](coverage-ai-probability.md)、[SPD-Robot](coverage-spd-robot.md)、[PDC-Communication](coverage-pdc-communication.md)、[PDC-Programs](coverage-pdc-programs.md)、[PDC-Coordination](coverage-pdc-coordination.md)、[HCI-User](coverage-hci-user.md)、[NC-Routing](coverage-nc-routing.md)、[NC-Applications](coverage-nc-applications.md)、[NC-Reliability](coverage-nc-reliability.md)、[SE-Requirements](coverage-se-requirements.md)、[SE-Design](coverage-se-design.md)、[SEC-Foundations](coverage-sec-foundations.md)、[SEC-Engineering](coverage-sec-engineering.md)、[MSF-Linear](coverage-msf-linear.md)、[MSF-Calculus](coverage-msf-calculus.md)、[FPL-Scripting](coverage-fpl-scripting.md)、[FPL-Event-Driven](coverage-fpl-event-driven.md)、[DM-Core](coverage-dm-core.md)、[DM-Modeling](coverage-dm-modeling.md)、[DM-Relational](coverage-dm-relational.md)、[DM-Querying](coverage-dm-querying.md)、[DM-Processing](coverage-dm-processing.md)、[OS-Concurrency](coverage-os-concurrency.md)、[OS-Memory](coverage-os-memory.md)、[OS-Process](coverage-os-process.md)、[OS-Scheduling](coverage-os-scheduling.md)、[SDF-Fundamentals](coverage-sdf-fundamentals.md)、[SDF-Data-Structures・Algorithms・Practices](coverage-sdf-core.md)、[SF-Overview](coverage-sf-overview.md)、[SF-Foundations](coverage-sf-foundations.md)、[SF-Resource](coverage-sf-resource.md)、[SF-Performance](coverage-sf-performance.md)、[SF-Evaluation](coverage-sf-evaluation.md)、[SF-Reliability](coverage-sf-reliability.md)、[SF-Security](coverage-sf-security.md)、[SF-Design](coverage-sf-design.md)、[SF-SEP](coverage-sf-sep.md) から試行する。各原典項目について、区分、状態、具体的な依頼、残る範囲を記す。親項目とその子項目を数値上で重複計上しないため、集計時の単位を明記する。個別の Core 区分が原典にない成果に、推測で区分を付けない。

状態は「未照合」「部分」「完了」を区別する。未照合は未実装の証拠ではない。部分は教材例の存在を示し、項目全体の完成を意味しない。完了には原典の対象範囲、学習体験、根拠に基づく正答・解説の検証、必要な操作・再開、ゲーム内で直接評価できない成果の代替と限界を確認する。ユーザーが除外したコード・文章入力を実装していないこと自体は欠陥とせず、その能力を評価したとも主張しない。

依頼検索の専門用語・略語は `src/quest-keywords.js` に個別に記録する。17分野の代表例を含む一部の依頼を探しやすくするための別名であり、原典項目との網羅対応や学習の完成を示すものではない。新しい別名は対象依頼の内容を確認し、`tests/world.test.js` で参照先と検索・地域・達成状況を検査する。

追加の項目別台帳：[AR-Representation](coverage-ar-representation.md)、[AI-ML](coverage-ai-ml.md)、[AI-SEP](coverage-ai-sep.md)、[AL-SEP](coverage-al-sep.md)、[AL-Strategies](coverage-al-strategies.md)、[AL-Complexity](coverage-al-complexity.md)、[AL-Models](coverage-al-models.md)。

追加の項目別台帳：[AL-Foundational](coverage-al-foundational.md)、[PDC-Algorithms](coverage-pdc-algorithms.md)、[PDC-Evaluation](coverage-pdc-evaluation.md)、[MSF-Discrete](coverage-msf-discrete.md)、[MSF-Probability](coverage-msf-probability.md)、[MSF-Statistics](coverage-msf-statistics.md)、[GIT-Fundamentals](coverage-git-fundamentals.md)、[GIT-Rendering](coverage-git-rendering.md)、[GIT-Visualization](coverage-git-visualization.md)、[GIT-Modeling](coverage-git-modeling.md)。

追加の項目別台帳：[GIT-Image](coverage-git-image.md)、[GIT-Animation](coverage-git-animation.md)、[GIT-Shading](coverage-git-shading.md)、[OS-Advanced-Files](coverage-os-advanced-files.md)、[OS-Files](coverage-os-files.md)、[OS-Devices](coverage-os-devices.md)。

追加の項目別台帳：[OS-Virtualization](coverage-os-virtualization.md)、[OS-Real-time](coverage-os-real-time.md)、[OS-Faults](coverage-os-faults.md)、[OS-Protection](coverage-os-protection.md)。

追加の項目別台帳：[FPL-Types](coverage-fpl-types.md)、[FPL-Formalism](coverage-fpl-formalism.md)、[FPL-Functional](coverage-fpl-functional.md)、[FPL-Logic](coverage-fpl-logic.md)、[FPL-OOP](coverage-fpl-oop.md)、[FPL-Systems](coverage-fpl-systems.md)、[FPL-Translation](coverage-fpl-translation.md)、[FPL-Abstraction](coverage-fpl-abstraction.md)、[FPL-Syntax](coverage-fpl-syntax.md)。

追加の項目別台帳：[HCI-Accessibility](coverage-hci-accessibility.md)、[AR-Memory](coverage-ar-memory.md)、[SPD-Game](coverage-spd-game.md)、[SE-Validation](coverage-se-validation.md)、[SEP-Sustainability](coverage-sep-sustainability.md)、[SPD-Common](coverage-spd-common.md)。

追加の項目別台帳：[GIT-Interaction](coverage-git-interaction.md)、[GIT-Physical](coverage-git-physical.md)、[GIT-Immersion](coverage-git-immersion.md)、[SPD-Interactive](coverage-spd-interactive.md)。

追加の項目別台帳：[AR-IO](coverage-ar-io.md)、[AR-Organization](coverage-ar-organization.md)、[AR-Performance-Energy](coverage-ar-performance-energy.md)、[AR-Heterogeneity](coverage-ar-heterogeneity.md)。

追加の項目別台帳：[AR-Security](coverage-ar-security.md)、[AR-Quantum](coverage-ar-quantum.md)。

追加の項目別台帳：[HCI-Evaluation](coverage-hci-evaluation.md)、[HCI-Design](coverage-hci-design.md)。

追加の項目別台帳：[HCI-Accountability](coverage-hci-accountability.md)、[HCI-SEP](coverage-hci-sep.md)。

追加の項目別台帳：[NC-Fundamentals](coverage-nc-fundamentals.md)、[NC-SingleHop](coverage-nc-single-hop.md)、[NC-Security](coverage-nc-security.md)、[NC-Mobility](coverage-nc-mobility.md)、[NC-Emerging](coverage-nc-emerging.md)。

追加の項目別台帳：[OS-Purpose](coverage-os-purpose.md)、[OS-Principles](coverage-os-principles.md)。

追加の項目別台帳：[FPL-Parallel](coverage-fpl-parallel.md)、[FPL-Methodologies](coverage-fpl-methodologies.md)、[FPL-Design](coverage-fpl-design.md)。

追加の項目別台帳：[FPL-Semantics](coverage-fpl-semantics.md)、[FPL-Constructs](coverage-fpl-constructs.md)、[FPL-Pragmatics](coverage-fpl-pragmatics.md)、[FPL-SEP](coverage-fpl-sep.md)。

追加の項目別台帳：[FPL-Aspect](coverage-fpl-aspect.md)、[FPL-Analysis](coverage-fpl-analysis.md)、[FPL-Code](coverage-fpl-code.md)、[FPL-Run-Time](coverage-fpl-run-time.md)。

追加の項目別台帳：[SEC-Coding](coverage-sec-coding.md)、[SEC-Forensics](coverage-sec-forensics.md)、[SEC-Governance](coverage-sec-governance.md)、[SEC-SEP](coverage-sec-sep.md)。

追加の項目別台帳：[SEC-Crypto](coverage-sec-crypto.md)。

追加の項目別台帳：[SPD-Web](coverage-spd-web.md)、[SPD-Mobile](coverage-spd-mobile.md)、[SPD-Embedded](coverage-spd-embedded.md)、[SPD-SEP/Mobile](coverage-spd-sep-mobile.md)、[SPD-SEP/Web](coverage-spd-sep-web.md)、[SPD-SEP/Game](coverage-spd-sep-game.md)、[SPD-SEP/Robotics](coverage-spd-sep-robotics.md)、[SPD-SEP/Interactive](coverage-spd-sep-interactive.md)。

追加の項目別台帳：[SEP-Context](coverage-sep-context.md)、[SEP-Ethical-Analysis](coverage-sep-ethical-analysis.md)、[SEP-Professional-Ethics](coverage-sep-professional-ethics.md)、[SEP-Communication](coverage-sep-communication.md)、[SEP-History](coverage-sep-history.md)、[SEP-Economies](coverage-sep-economies.md)、[SEP-Security](coverage-sep-security.md)、[SEP-DEIA](coverage-sep-deia.md)。

追加の項目別台帳：[SE-Teamwork](coverage-se-teamwork.md)、[SE-Tools](coverage-se-tools.md)、[SE-Construction](coverage-se-construction.md)、[SE-Refactoring](coverage-se-refactoring.md)、[SE-Reliability](coverage-se-reliability.md)、[SE-Formal](coverage-se-formal.md)。

追加の項目別台帳：[AR-SEP](coverage-ar-sep.md)、[GIT-Simulation](coverage-git-simulation.md)、[GIT-SEP](coverage-git-sep.md)、[OS-SEP](coverage-os-sep.md)、[SDF-SEP](coverage-sdf-sep.md)。

現時点では166単位すべてにこの形式の台帳がある。ただし、台帳には「未照合」と「部分」の項目が多数残り、原典との対応漏れや内容の正確性の最終検証も終わっていない。166/166 は台帳の整備状況であり、CS2023 全体の教材・検証の完成率ではない。今後は原典と既存の実装・検証を照合し、未照合を根拠なく未対応や完了に変えず、単位ごとに台帳を更新する。

`python scripts/coverage_rows.py` は台帳の表見出しから状態列を探し、ファイルごとの記録行数を表示する。2026-11-04 時点では164ファイルに未照合561行・部分3059行・完了0行。３知識単位をまとめた台帳があるため、ファイル数と知識単位数は一致しない。親と子の重複、トピックと学習成果の両方を含むため、この数は独立した項目数や教材の完成率ではない。台帳に漏れた原典項目や、記載内容・検証の正しさも集計だけでは判定できない。形式が不正な状態行はエラーにするが、ファイルの不足を検出するものではない。

後から達成条件を拡張したことが記録されている依頼153・196・457・607・793・794・980・983・984・1066・1093・1094・1096については、従来の達成 ID を維持しつつ、現在の条件を満たした場合に別の確認用 ID を同じ保存領域に追加する。確認用 ID がない過去の達成は「追加条件は未確認」と表示する。新条件をこの仕組みの導入前に完了していた場合も、確認用 ID がないため未確認となる。達成数・物語・達成済みの絞り込みは過去の達成を含む。既存の未知 ID と複数タブの記録は保持し、未対応の拡張履歴が他にないとは主張しない。

依頼一覧の「追加条件が未確認」は上記13依頼のうち、過去の達成 ID があり現在の確認用 ID がないものを検索・地域と組み合わせて表示する。現行条件を終えるとこの一覧から外れる。未達成の依頼や、拡張履歴をまだ調査していない依頼を一覧化する機能ではない。
