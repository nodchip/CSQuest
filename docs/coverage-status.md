# CS2023 対応の追跡方法

目標は全17分野の各トピックと例示学習成果の対応・検証であり、依頼数や自動テスト件数を完成率に換算しない。[知識単位の目録](knowledge-units.md)は原典の目次との一致を確認するためのもので、教材の網羅・深さ・正確性を証明しない。

2026-11-01 に公開原典の PDF を再取得し、`pdftotext -layout` と `scripts/check_knowledge_units.py` で目次を照合した結果、原典・目録とも166単位、差異０だった。この検査の対象は目次の ID・名称・ページであり、本文のトピックや学習成果ではない。

項目単位の新しい台帳は [AI-Robotics](coverage-ai-robotics.md)、[AI-Vision](coverage-ai-vision.md)、[AI-Agents](coverage-ai-agents.md)、[AI-NLP](coverage-ai-nlp.md)、[AI-KRR](coverage-ai-krr.md)、[AI-LRR](coverage-ai-lrr.md)、[DM-Data](coverage-dm-data.md)、[DM-Analytics](coverage-dm-analytics.md)、[DM-Distributed](coverage-dm-distributed.md)、[DM-Unstructured](coverage-dm-unstructured.md)、[DM-Internals](coverage-dm-internals.md)、[DM-NoSQL](coverage-dm-nosql.md)、[DM-Security](coverage-dm-security.md)、[DM-SEP](coverage-dm-sep.md)、[SEP-Privacy](coverage-sep-privacy.md)、[SEP-IP](coverage-sep-ip.md)、[AR-Logic](coverage-ar-logic.md)、[AR-Assembly](coverage-ar-assembly.md)、[AI-Introduction](coverage-ai-introduction.md)、[AI-Search](coverage-ai-search.md)、[AI-Planning](coverage-ai-planning.md)、[AI-Probability](coverage-ai-probability.md)、[SPD-Robot](coverage-spd-robot.md)、[PDC-Communication](coverage-pdc-communication.md)、[PDC-Programs](coverage-pdc-programs.md)、[PDC-Coordination](coverage-pdc-coordination.md)、[HCI-User](coverage-hci-user.md)、[NC-Routing](coverage-nc-routing.md)、[NC-Applications](coverage-nc-applications.md)、[NC-Reliability](coverage-nc-reliability.md)、[SE-Requirements](coverage-se-requirements.md)、[SE-Design](coverage-se-design.md)、[SEC-Foundations](coverage-sec-foundations.md)、[SEC-Engineering](coverage-sec-engineering.md)、[MSF-Linear](coverage-msf-linear.md)、[MSF-Calculus](coverage-msf-calculus.md)、[FPL-Scripting](coverage-fpl-scripting.md)、[FPL-Event-Driven](coverage-fpl-event-driven.md)、[DM-Core](coverage-dm-core.md)、[DM-Modeling](coverage-dm-modeling.md)、[DM-Relational](coverage-dm-relational.md)、[DM-Querying](coverage-dm-querying.md)、[DM-Processing](coverage-dm-processing.md)、[OS-Concurrency](coverage-os-concurrency.md)、[OS-Memory](coverage-os-memory.md)、[OS-Process](coverage-os-process.md)、[OS-Scheduling](coverage-os-scheduling.md)、[SDF-Fundamentals](coverage-sdf-fundamentals.md)、[SDF-Data-Structures・Algorithms・Practices](coverage-sdf-core.md)、[SF-Overview](coverage-sf-overview.md)、[SF-Foundations](coverage-sf-foundations.md)、[SF-Resource](coverage-sf-resource.md)、[SF-Performance](coverage-sf-performance.md)、[SF-Evaluation](coverage-sf-evaluation.md)、[SF-Reliability](coverage-sf-reliability.md)、[SF-Security](coverage-sf-security.md)、[SF-Design](coverage-sf-design.md)、[SF-SEP](coverage-sf-sep.md) から試行する。各原典項目について、区分、状態、具体的な依頼、残る範囲を記す。親項目とその子項目を数値上で重複計上しないため、集計時の単位を明記する。個別の Core 区分が原典にない成果に、推測で区分を付けない。

## 完成率に向けた分母の点検

2026-11-05 現在、原典と分母候補を照合したのは90／166知識単位、項目別評価の記録は43行。これは教材全体の完成率ではない。最新の値は下記スクリプトで確認する。

`scripts/coverage_inventory.py --csv docs/curriculum-inventory-draft.csv` は、台帳の各行を分野・知識単位・種別・区分・番号・根拠・台帳の行番号付きで書き出す。`--check docs/curriculum-inventory-draft.csv` は CSV と台帳が一致しない場合に失敗する。166単位の台帳の対応や表の形式も確認する。GitHub Actions はこの一致を検査する。

[照合記録](curriculum-audits.json)は、原典と範囲を確認した単位の文書・日付・件数と、番号・区分・要約のハッシュを持つ。`--audit docs/curriculum-audits.json` で範囲の変更や照合文書の欠落を検出する。状態や証拠の変更は分母の変更ではないためハッシュに含めない。照合記録の正しさや教材の完成はこの検査だけで証明しない。

出力は既存台帳から機械的に起こした**候補**であり、原典と照合した確定目録ではない。候補 ID は原典番号・種別・台帳の区分から作る仮の識別子であり、番号や区分が修正されると変わり得る。区分の記載がない行、通常の番号と異なる行、同一候補 ID、番号から見つかる親子の重複候補を明示する。親子を自動削除せず、検出できない重複や原典からの漏れもあるため、各候補を原典と照らして確定する必要がある。

2026-11-04 時点の候補は3,624行（トピック2,322、学習成果1,302）、候補 ID 重複０行、親子重複候補78行。これは台帳の現状で、独立した対象数・完成率ではない。[SPD-Mobile](curriculum-audit-spd-mobile.md)、[SPD-Game](curriculum-audit-spd-game.md)、[SPD-Web](curriculum-audit-spd-web.md)、[SPD-Common](curriculum-audit-spd-common.md)、[DM-Distributed](curriculum-audit-dm-distributed.md)、[DM-Data](curriculum-audit-dm-data.md)、[DM-Core](curriculum-audit-dm-core.md)、[DM-Modeling](curriculum-audit-dm-modeling.md)、[DM-Relational](curriculum-audit-dm-relational.md)、[DM-Unstructured](curriculum-audit-dm-unstructured.md)、[DM-Querying](curriculum-audit-dm-querying.md)、[DM-Processing](curriculum-audit-dm-processing.md)、[DM-Internals](curriculum-audit-dm-internals.md)、[DM-NoSQL](curriculum-audit-dm-nosql.md)、[DM-Security](curriculum-audit-dm-security.md)、[DM-Analytics](curriculum-audit-dm-analytics.md)、[DM-SEP](curriculum-audit-dm-sep.md)、[SDF-Fundamentals](curriculum-audit-sdf-fundamentals.md)、[SDF-Data-Structures](curriculum-audit-sdf-data-structures.md)、[SDF-Algorithms](curriculum-audit-sdf-algorithms.md)、[SDF-Practices](curriculum-audit-sdf-practices.md)、[SDF-SEP](curriculum-audit-sdf-sep.md) の20単位は原典と分母候補を照合した。残り146単位も確認する。

[項目別評価](curriculum-assessment-dm-data-core.md)では DM-Data・DM-Core の４項目について、原典、教材、内容検証、操作検証と限界を区別して記録した。[機械可読な評価記録](curriculum-assessments.json)と `--assessments docs/curriculum-assessments.json` は、評価済み項目の台帳・実装・テストが変わった場合に再評価を促す。検査は資料と記録の一致を確かめるもので、評価内容の妥当性を自動判定するものではない。４項目以外は今回の項目別評価の対象外である。

分母確定後はトピックと成果を別集計し、各項目について「原典との一致」「教材の対応」「正答・解説と出典」「操作・保存・再挑戦」「代替と限界」を確認する。未確認、未対応、部分、完成を区別し、完成は全条件に根拠がある場合に限る。未確認を未対応や完成に自動変換せず、部分に恣意的な割合を与えない。原典と項目の対応が確定し、各項目の判定と証拠が揃うまで全体の完成率は出さない。項目数に基づく率は工数や深さの比率ではないので、分野別・教材／内容検証／操作検証の状況も併記する。

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

`python scripts/coverage_rows.py` は台帳の表見出しから状態列を探し、ファイルごとの記録行数を表示する。2026-11-04 時点では164ファイルに未照合435行・部分3186行・完了2行。３知識単位をまとめた台帳があるため、ファイル数と知識単位数は一致しない。親と子の重複、トピックと学習成果の両方を含むため、この数は独立した項目数や教材の完成率ではない。台帳に漏れた原典項目や、記載内容・検証の正しさも集計だけでは判定できない。形式が不正な状態行はエラーにするが、ファイルの不足を検出するものではない。

後から達成条件を拡張したことが記録されている依頼153・196・457・607・793・794・980・983・984・1066・1093・1094・1096については、従来の達成 ID を維持しつつ、現在の条件を満たした場合に別の確認用 ID を同じ保存領域に追加する。確認用 ID がない過去の達成は「追加条件は未確認」と表示する。新条件をこの仕組みの導入前に完了していた場合も、確認用 ID がないため未確認となる。達成数・物語・達成済みの絞り込みは過去の達成を含む。既存の未知 ID と複数タブの記録は保持し、未対応の拡張履歴が他にないとは主張しない。

依頼一覧の「追加条件が未確認」は上記13依頼のうち、過去の達成 ID があり現在の確認用 ID がないものを検索・地域と組み合わせて表示する。現行条件を終えるとこの一覧から外れる。未達成の依頼や、拡張履歴をまだ調査していない依頼を一覧化する機能ではない。
