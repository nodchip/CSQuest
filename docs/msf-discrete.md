# MSF-Discrete の対応状況

出典: [CS2023 MSF-Discrete](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp. 187–188。原典を要約した作業用一覧。KA Core は CS Core と同じトピックをより深く扱う。依頼46は有限集合の固定例であり、自由な数学的証明を評価しない。

## トピック

| 番号 | 分類 | 内容と現状 |
|---:|---|---|
| 1 | CS Core / KA Core | 集合、関係、関数、濃度 | 依頼46で有限集合の演算、依頼401・402で有限集合の関係、403で可算と対角線論法の例。一般の証明は未対応 |
| 2 | CS Core / KA Core | 再帰的な数学的定義 | 依頼33で並べ方の個数を小さい問題に帰着。一般の定義・漸化式は未対応 |
| 3 | CS Core / KA Core | 帰納法、背理法などの証明法 | 依頼95・407で帰納法、依頼400で鳩の巣原理の背理法の固定例。一般の証明は未対応 |
| 4 | CS Core / KA Core | 順列、組合せ、数え上げ、鳩の巣原理 | 依頼33で並べ方、46で包除、400で鳩の巣原理、404で順列と組合せの固定例。一般の数え上げと証明は未対応 |
| 5 | CS Core / KA Core | 合同算術 | 依頼19で３による余り、405で５・７を法とする加算と乗算の固定例。一般の計算は未対応 |
| 6 | CS Core / KA Core | 論理、真理値表、演算、推論規則、標準形、述語論理 | 依頼06の２入力の真理値表、依頼72のモーダスポネンス・反例、依頼126の有限集合上の全称条件、406の２入力の標準形の固定例。一般の論理式・述語・証明は未対応 |
| 7 | CS Core / KA Core | グラフの基本 | 依頼08・21・32などで固定グラフを操作。一般の定義や構成は未対応 |
| 8 | CS Core / KA Core | オーダー記法 | 未着手 |

## 例示学習成果

| 番号 | 分類 | 内容と現状 |
|---|---|---|
| 1a | CS Core | 集合・関係・関数の用語を例で説明 | 依頼46で有限集合、401で関係・関数の固定例。自由記述は未対応 |
| 1b | CS Core | 集合・関数・関係の操作 | 依頼46で集合操作、401で関係・関数の固定例。一般の操作は未対応 |
| 1c | CS Core | 具体例を適切なモデルに対応づけ解釈 | 依頼46で仲間と印を集合として解釈。一般のモデル化は未対応 |
| 1d | CS Core | 有限集合の大きさと和・積・包除 | 依頼46で２集合の包除の一例。一般の計算、積の法則は未対応 |
| 1e | CS Core | 有限・可算・非可算の区別 | 依頼403で自然数と偶数の対応、無限二進列の対角線論法の固定例。実数や一般の集合は未対応 |
| 2a | CS Core | 再帰的な定義を適用 | 依頼33で並べ方の固定例。他の構造は未対応 |
| 2b–2e | CS Core | 帰納法による証明、漸化式の解法・分析・閉形式 | 依頼95で奇数の和の帰納法を選択式で構成。一般の漸化式や証明は未対応 |
| 3a–3f | CS Core | 証明法の識別・構造・適用・選択、再帰と帰納法、弱い帰納法と強い帰納法 | 依頼95で基底と帰納段階、407で強い帰納法の固定例。他の証明法や一般の証明は未対応 |
| 4a | CS Core | 和・積・包除や数列による数え上げ | 依頼46で２集合の包除のみ |
| 4b | CS Core | 鳩の巣原理を証明に適用 | 依頼400で４羽と３つの巣の固定例。他の問題への応用は未対応 |
| 4c–4d | CS Core | 順列・組合せの計算と具体的な数え上げモデル | 依頼33で並べ方、404で３人から２人を選ぶ順列と組合せの固定例。一般の数え上げは未対応 |
| 5a | CS Core | 合同算術の計算 | 依頼19で３による余り、405で加算・乗算の固定例。負数や除算は未対応 |
| 5b | CS Core | 最大公約数とユークリッドの互除法 | 依頼96で二つの固定例。一般の場合や拡張互除法は未対応 |
| 6a–6g | CS Core | 命題・述語論理への変換、妥当性、標準形、推論、応用と限界 | 依頼06・07の論理条件、72の推論・反例、406の標準形の固定例。一般の論理式や証明は未対応 |
| 7a–7d | CS Core | グラフ用語、走査、モデル化、データ構造や証明・数え上げとの関連 | 依頼08・21・32などで固定グラフの操作。一般の説明やモデル化は未対応 |

原典にはトピック８に対応する独立した例示学習成果の列挙はないため、トピックとして未着手を追跡する。依頼46では薬草の集合４人、魔法の集合４人、両方２人で、和集合は６人。４種類の演算について７人の全128部分集合を判定テストする。

依頼72では２つの含意と一つの事実からモーダスポネンスを２回適用し、逆向きの推測に対して３命題の真理値による反例を構成する。全８割当てで推論と反例を検証。固定した２規則以外の推論や一般の証明構築は未対応。

依頼95は正の整数 n に対する最初の n 個の奇数の和が n² になる固定例。基底 n=1 と、k² に次の奇数 2k+1 を加えると (k+1)² になる任意の k の段階を選択する。図は k=3 の例であり、それ自体を一般の証明としない。自由な証明の記述や別の命題への適用は評価しない。

依頼400では３羽を３つの巣に別々に配置し、４羽目はどの巣でも重なることを確かめる。どの巣も１羽以下なら最大３羽という背理法を選ぶ。４羽の配置81通りをテストしたが、一般の証明を記述・評価するものではない。[MIT の講義ノート](https://math.mit.edu/~goemans/18310S15/pigeonholenotes.pdf)。

依頼401では３人と３つの紋章の関係を構築し、関数・単射・全射と、線が０本または２本のため関数でない例を比較する。全512関係を独立した定義で検査した。無限集合、異なる大きさの集合や一般の証明は未対応。[Discrete Mathematics for Computer Science](https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Discrete_Mathematics_for_Computer_Science_(Fitch)/03%3A_Functions/3.01%3A_Functions)。

依頼402は２人から３紋章への単射で非全射・単射でも全射でもない例、３人から２紋章への全射で非単射の例を構築する。２対３の全９関数と３対２の全８関数を検査。無限集合や一般の証明は未対応。[Discrete Mathematics for Computer Science](https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Discrete_Mathematics_for_Computer_Science_(Fitch)/03%3A_Functions/3.01%3A_Functions)。

依頼403は自然数と０以上の偶数を２倍で対応させ、４行４桁の模型で対角桁を反転する。画面の有限例とは別に、任意の無限一覧から各行と異なる無限列を構成する理由を示す。小数表記や実数への拡張、自由な証明は未対応。[Transition to Higher Mathematics](https://math.libretexts.org/Bookshelves/Mathematical_Logic_and_Proof/Transition_to_Higher_Mathematics_(Dumas_and_McCarthy)/06%3A_New_Page/6.03%3A_New_Page)。

依頼404は３人から異なる２人を選び、役割なしの３組と先導・見張りを区別する６通りを列挙する。各組に２通りの役割が対応することを比べる。一般の公式や重複選択は未対応。[Applied Discrete Structures](https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Applied_Discrete_Structures_(Doerr_and_Levasseur)/02%3A_Combinatorics/2.04%3A_Combinations_and_the_Binomial_Theorem)。

依頼405は８と９を５・７で割った余りから和と積の余りを求め、元の数を直接計算した場合と比べる。非負整数の固定例で、負数や除算、一般の証明は未対応。[A Spiral Workbook for Discrete Mathematics](https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/A_Spiral_Workbook_for_Discrete_Mathematics_(Kwong)/05%3A_Basic_Number_Theory/5.07%3A_Modular_Arithmetic)。

依頼406は２入力が異なる場合に真となる真理値表について、選言標準形と連言標準形を札で構築し全４入力を比較する。各形の全16選択を検査。一般の式の変換や証明は未対応。[Elementary Foundations](https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Foundations%3A_An_Introduction_to_Topics_in_Discrete_Mathematics_(Sylvestre)/03%3A_Boolean_algebra/3.02%3A_Disjunctive_Normal_Form)。

依頼407は長さ２と３の石板から４〜７を作り、２・３の基底と、２から k まで作れるという仮定から k−１ に２を足す強い帰納段階を選ぶ。有限の操作自体を一般の証明とはしない。自由記述や他の命題への適用は未対応。[Gentle Introduction to the Art of Mathematics](https://math.libretexts.org/Bookshelves/Mathematical_Logic_and_Proof/Gentle_Introduction_to_the_Art_of_Mathematics_(Fields)/05%3A_Proof_Techniques_II_-_Induction/5.04%3A_The_Strong_Form_of_Mathematical_Induction)。
