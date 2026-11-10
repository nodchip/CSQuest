# 現行冒険の項目別評価を調べる

候補台帳と現行冒険の評価を候補IDで結び、未評価の候補を含めた CSV を生成する。評価が複数あればすべての行を残し、教材の状態、範囲・不足、到達、検証、レビューを評価元からそのまま出力する。旧教材の台帳状態や根拠は現行冒険の評価に転記しない。原典照合文書と旧台帳のパス・行番号も出力する。

```powershell
python scripts/coverage_inventory.py --check docs/curriculum-inventory-draft.csv --audit docs/curriculum-audits.json --assessments docs/curriculum-assessments.json
python scripts/adventure_coverage_join.py --output adventure-coverage-report.csv
python -m unittest discover -s tests -p adventure_coverage_join_test.py
```

最初の検査は入力の台帳・照合記録のハッシュを確認する。結合スクリプト自体はハッシュや評価内容の妥当性を検証しない。候補IDが重複する場合や評価が存在しない候補IDを参照する場合はエラーにする。出力先は任意の作業ファイルとし、生成結果を教材の正本として編集しない。

「評価未作成」は未実装や未到達を意味しない。「評価記録あり」も到達や完成を自動的に証明しない。検証用保存データから操作した記録と、新規開始から実際に到達した記録を区別する。公開版に含まれることもこの表だけでは分からない。

候補は親子や例示が重複し、複数評価により行が増える。原典にない便宜的分割として把握した GIT-Shading 2a〜2c、GIT-Simulation 1-応答、SEC-Crypto 12a〜15b を明示するが、これは網羅的な機械判定ではない。ほかの行も照合文書を確認する。原典照合記録の有無、台帳の「要確認」、文書に記載された未確認範囲を確認し、項目の行数を分母や完成率に使わない。

2026-11-11、実装担当と別の `review_candidate` が結合条件、評価未作成の扱い、親子・便宜的分割の注意、単体テストと実データを確認した。実データでは入力の評価の候補 ID・依頼 ID の組が重複を含めて出力に保持されていた。この確認は、個々の評価内容の正確性や完成を保証しない。
