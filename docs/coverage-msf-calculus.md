# MSF-Calculus：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.192–194。[既存の調査](msf-calculus.md)と依頼・テストを照合。状態は[追跡方法](coverage-status.md)に従う。すべて KA Core。例示成果は親の見出しを数えず a 等の子項目を単位とする。一般の計算、証明、自由な説明は固定模型のクリアでは直接評価しない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 対応例と限界 |
| --- | --- | --- | --- | --- |
| 1 | KA Core | 数列・級数・極限 | 部分 | 116で４歩の近づきと往復。一般の極限や級数は未評価。 |
| 2 | KA Core | 一変数の導関数、計算規則と応用 | 部分 | 473で二次関数の差商を操作。一般の微分規則は未評価。 |
| 3 | KA Core | 一変数の積分 | 部分 | 474で速度の長方形近似と基本定理の固定例。一般の積分規則は未評価。 |
| 4 | KA Core | 媒介変数・極座標 | 部分 | 478で半径２の円を５角度で操作。一般の曲線は未評価。 |
| 5 | KA Core | テイラー級数 | 部分 | 476で指数関数を４次まで近似。一般の級数や誤差評価は未評価。 |
| 6 | KA Core | 多変数微積分・偏微分・勾配 | 部分 | 477で二変数の二次関数を操作。一般の関数やベクトル値関数は未評価。 |
| 7 | KA Core | 凸性・最適化・制約 | 部分 | 116で勾配降下、479で線形制約下の固定例。一般の凸性や制約は未評価。 |
| 8 | KA Core | 常微分方程式・オイラー法・応用 | 部分 | 475で初期値問題を３刻み幅で近似。一般の方程式と安定性は未評価。 |
| 9 | KA Core | 機械学習等への応用 | 部分 | 116で１データの誤差を最小化。一般の学習や多変数は未評価。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 対応例と限界 |
| --- | --- | --- | --- | --- |
| 1a | KA Core | 無限集合と数列の違い | 部分 | 依頼1210で同じ値の集合の異なる列、定数列と逆数列、項と極限を比較。一般の集合や自由な証明は未評価。 |
| 1b | KA Core | 極限の形式的定義 | 部分 | 1093で数列 1/n の３つの幅と開始番号を選び、任意の幅についての証明の札を並べる。一般の数列や関数の極限・自由な証明は未評価。 |
| 1c | KA Core | 数列・級数の極限を導出 | 部分 | 116で近づく数列の４歩を観察し、1093で 1/n → 0 の証明を並べる。一般の数列・級数の導出は未評価。 |
| 1d | KA Core | 収束と発散 | 部分 | 116で近づきと往復を比較し、1093で 1/n の収束と (−1)ⁿ が任意の実数に収束しない理由を比較。一般の数列の証明は未評価。 |
| 1e | KA Core | ロピタルの定理などを適用 | 部分 | 1099で０/０・∞/∞、直接適用できない形と、導関数の比から結論できない例を比較。一般の関数や自由な導出は未評価。 |
| 2a | KA Core | 導関数を極限として説明 | 部分 | 473で差商の両側の変化を操作。一般の定義と自由な説明は未評価。 |
| 2b | KA Core | 関数としての導関数 | 部分 | 116で二次誤差の各位置の傾きを扱う。一般の関数は未評価。 |
| 2c | KA Core | 極限から基本的な導関数を計算 | 部分 | 473で二次関数の固定点を扱う。任意の関数・点は未評価。 |
| 2d | KA Core | 和・積・商の微分規則 | 部分 | 473で２辺が伸びる長方形の面積を分け、積の変化率の固定例を操作。和・商や一般の規則の適用は未評価。 |
| 2e | KA Core | 重要な関数の例を扱う | 部分 | 473で二次関数の固定例。一般の関数は未評価。 |
| 3a | KA Core | 定積分と不定積分の定義 | 部分 | 474で区間の面積と位置の変化を比較。不定積分の一般の定義は未評価。 |
| 3b | KA Core | 積分規則を重要な関数に適用 | 部分 | 1100でべき・逆数・三角・指数の５固定例について原始関数と定積分を選択。一般の積分法や自由な計算は未評価。 |
| 3c | KA Core | 微積分の基本定理の利用 | 部分 | 474で速度と位置変化の固定例を比較。一般の証明は未評価。 |
| 3d | KA Core | 積分を問題に適用 | 部分 | 474で区間の移動距離を扱う。一般の問題は未評価。 |
| 4a | KA Core | 媒介変数による曲線 | 部分 | 478で円の固定例。一般の曲線は未評価。 |
| 4b | KA Core | 極座標を適用 | 部分 | 478で円の５角度を操作。一般の曲線は未評価。 |
| 5a | KA Core | 重要な関数のテイラー級数を導出 | 部分 | 476で指数関数の原点周りの固定近似。一般の導出は未評価。 |
| 5b | KA Core | テイラー級数を近似に適用 | 部分 | 476で４次までの近似を比較。一般の誤差評価は未評価。 |
| 6a | KA Core | 偏微分と勾配を計算 | 部分 | 477で二変数二次関数の固定例を操作。一般の関数は未評価。 |
| 6b | KA Core | ベクトル値関数と勾配表記 | 部分 | 1101で曲線の速度とスカラー関数の勾配、連鎖律の内積を３時刻で比較。一般のベクトル値関数、任意次元や自由な導出は未評価。 |
| 6c | KA Core | 最適化への応用 | 部分 | 116・477・479で固定条件の最小化を操作。一般の最適化は未評価。 |
| 7a | KA Core | 積分にオイラー法を適用 | 部分 | 475で増加率を用いた離散的な更新を操作。一般の積分への適用は未評価。 |
| 7b | KA Core | 一変数の微分方程式にオイラー法を適用 | 部分 | 475で初期値問題を３刻み幅で近似。一般の方程式は未評価。 |
| 7c | KA Core | 複数変数の微分方程式にオイラー法を適用 | 部分 | 1162の風を1163で２座標の同時更新に再利用し、３場・３刻みを厳密解と比較。一般の連立方程式・自由な導出は未評価。 |

`tests/gradient.test.js`、`tests/derivative-limit.test.js`、`tests/product-growth.test.js`、`tests/integral-area.test.js`、`tests/polar-circle.test.js`、`tests/taylor-growth.test.js`、`tests/partial-gradient.test.js`、`tests/euler-growth.test.js` 等は各固定模型の一部を検査する。前提と出典は[既存の調査](msf-calculus.md)を参照。未照合は未実装の証拠ではない。

依頼1093は [Morris and Morris の数列の収束](https://math.libretexts.org/Bookshelves/Mathematical_Logic_and_Proof/Proofs_and_Concepts_-_The_Fundamentals_of_Abstract_Mathematics_(Morris_and_Morris)/05%3A_Sample_Topics/5.03%3A_Real_analysis-_convergent_sequences) を参考とし、n ≥ N の同値な定義を用いる。３つの幅の厳密な境界と以降の項の不等式、保存を `tests/sequence-limit.test.js` で検査。有限例の試行自体は任意の幅に対する証明ではない。

依頼1093の追加場面は [Dumas and McCarthy の数列と発散の例](https://math.libretexts.org/Bookshelves/Mathematical_Logic_and_Proof/Transition_to_Higher_Mathematics_(Dumas_and_McCarthy)/00%3A_Front_Matter/Source) を参考に、1/n の証明の順序と、(−1)ⁿ の３候補に対する反例を操作する。任意の実数候補に対する論拠を選択肢で扱うが、任意の数列や自由な証明は直接評価しない。旧達成は保持し、追加条件の確認は別に記録する。

依頼1099は [OpenStax のロピタルの定理](https://openstax.org/books/calculus-volume-1/pages/4-8-lhopitals-rule) と [CLP の結論できない例](https://math.libretexts.org/Bookshelves/Calculus/CLP-1_Differential_Calculus_(Feldman_Rechnitzer_and_Yeager)/04%3A_Applications_of_derivatives/4.07%3A_L%27Hopital%27s_Rule_and_Indeterminate_Forms)を参照。４つの固定例で不定形、微分可能性等の条件、導関数の比と元の比の区別を扱う。`tests/hopital-gates.test.js` で選択・途中記録と、振動する導関数の比の２部分列を検査。一般の証明や任意の関数の処理は未評価。

依頼1100は [OpenStax の原始関数](https://openstax.org/books/calculus-volume-1/pages/4-10-antiderivatives) と [広義積分](https://openstax.org/books/calculus-volume-2/pages/3-7-improper-integrals) を参照。５関数の原始関数・端点の差と、1/x を０で分けた広義積分の発散を比較する。`tests/integral-rules.test.js` は独立した数値微分・Simpson 積分および選択・途中記録を検査。固定例であり一般の積分法・自由な証明は未評価。

依頼1101は [OpenStax のベクトル値関数の微分](https://openstax.org/books/calculus-volume-3/pages/3-2-calculus-of-vector-valued-functions) と [多変数の連鎖律](https://openstax.org/books/calculus-volume-3/pages/4-5-the-chain-rule) を参照。r(t)=(t,t²) と f(x,y)=x²+y² の３時刻で速度、勾配、内積を比較し、確認後に２矢印を同倍率で図示する。`tests/curve-gradient.test.js` は独立した中心差分・内積・復元を検査。固定例で一般の関数や自由な証明は未評価。

依頼1163は [MIT の数値解法](https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/a9d2bd9be098f0ada172af40379a17cc_MIT18_330S12_Chapter5.pdf)を参考に、1162の３つの線形の風を再利用し、２座標をオイラー法で同時に更新する。時刻１で４・８・16分割の近似と既知の厳密解を比較する。`tests/euler-vector.test.js` は手計算・閉形式、誤差の比較と保存・達成を検査。一般の方程式や誤差・安定性の保証は未評価。

依頼1210は [OpenStax の数列](https://openstax.org/books/calculus-volume-2/pages/5-1-sequences)を参考に、番号を持つ列と異なる値の集合を区別する。有限の３番号の観察と全番号を定める規則を区別し、定数列・1/n・交互の列を比較する。`tests/sequence-set-lab.test.js` は表示用の項、判断と保存を検査。任意の集合・数列や自由な証明は未評価。
