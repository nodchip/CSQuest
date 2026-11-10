# 四地域の教材対応（作業中）

参照：[Computer Science Curricula 2023 最終報告書](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm)、数学の基礎、AI-ML、SE-Requirements・SE-Design・SE-Validation、HCI-User・HCI-Accessibility・HCI-Evaluation・HCI-Design。以下は大学教育の各分野の導入例であり、単独で分野の習得を示すものではない。

| 依頼 ID | 今回の概念 | 今回扱わない範囲 |
|---|---|---|
| garden-combinations | 色と形を組み合わせる | 積の法則の一般的な証明 |
| garden-sets | 共通部分 | 集合演算の一般則と証明 |
| garden-logic | 論理積と包含的論理和 | 真理値表全体と論理式変形 |
| garden-counterexample | 全称命題の反例 | 量化子の形式的な証明 |
| observatory-classify | 特徴による分類 | 分類器の学習と精度評価 |
| observatory-predict | 過去の例に基づく予想 | 統計推定と汎化誤差 |
| observatory-uncertainty | 根拠不足を認める | 確率の数値化と校正 |
| observatory-evaluate | 学習に未使用の事例での確認 | 標本の代表性、交差検証、評価指標 |
| tailor-needs | 利用状況と要望の聞き取り | 要件の交渉と仕様化 |
| tailor-design | 要望に合う部品の選択 | ソフトウェア構造の設計とトレードオフ |
| tailor-testing | 異なる状況における検証 | テスト設計技法、網羅率、限界 |
| tailor-debug | 観察された原因の修正と再確認 | 系統的なデバッグや回帰試験 |
| guide-needs | 利用者の困りごとの聞き取り | 利用者調査の設計と分析 |
| guide-signs | 行き先と操作の分かりやすい表示 | 文化・文脈による解釈差と評価 |
| guide-access | 色以外の手がかりと操作の違い | 支援技術、詳細な適合基準、全ての障害 |
| guide-observe | 観察と改善後の再評価 | 調査倫理、被験者選定、評価分析 |

回答と助言を下記の資料と照合し、複数選択や作業の並べ替えを実装した。プレイヤーの理解や面白さは、実際に遊んだ人の意見も踏まえて引き続き改善する。

## 参照と正確さの確認

- 庭園：CS2023「Mathematical and Statistical Foundations」の離散数学、論理・集合・数え上げに対応する導入。論理和は両方を含み、全称命題の反例は対象の条件を満たし結論を満たさない例とする。内容は各依頼の具体例に限定され、一般的な証明能力の測定ではない。
- 観測所：CS2023「AI-ML」の分類、学習と評価、モデルの限界に対応する導入。分類の規則は人が決めた例で、分類操作そのものを機械学習と呼ばない。予測の例は確率を計算せず、過去の例は保証ではない。[Google Machine Learning Crash Course: Dividing datasets](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets) は学習例と異なる例での評価、および代表性や重複の注意を説明している。本教材は評価の入口だけで、分割後の調整やデータ漏洩の全問題は扱わない。
- 仕立て屋：CS2023「SE-Requirements」「SE-Design」「SE-Validation」の、要望の把握、設計、検証に関連する導入。裁縫は比喩であり、現実の開発手順を完全に表すものではない。
- 案内所：CS2023「HCI-User」「HCI-Accessibility」「HCI-Evaluation」「HCI-Design」に関連する導入。[W3C WCAG 2.2: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) は色だけに依存せず文字や形などを併用する考え方を説明している。一つの工夫で全員が利用できるとはしない。色以外の視覚的手がかりだけでは、支援技術や非視覚的な利用のすべてを満たすものではない。

確認日：2026-11-08。各状況の正解と助言を読み合わせ、包含的論理和、反例の条件、分類の特徴、未使用事例、要望の聞き取り、観察と再評価、色以外の手がかりについて上記資料の考え方と突き合わせた。追加の授業内容や評価規準の完全性を確認したものではない。

2026-11-11、実装・対応付け担当とは別の `review_candidate` が案内所の guide-observe・guide-needs・guide-access を CS2023 と [W3C の色の使用](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)・[操作対象の大きさ](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) に照らして独立レビューした。固定場面の正答・ヒント・保存と分類をコード上で確認し、関連13テストが成功。新規開始から四地域に到達した記録と検証用記録で各場面を操作した記録は別であり、今回ブラウザは再操作していない。実際の利用者調査や WCAG 適合は未評価。
