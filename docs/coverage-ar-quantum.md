# AR-Quantum：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.108–109。[既存の調査](ar-quantum.md)と依頼を照合した。状態は[追跡方法](coverage-status.md)を参照。1・6・7・8 は子項目で追う。

## トピック

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1a | KA Core | 波動と粒子の二重性 | 部分 | 74 の二つの道の干渉と光子の個々の検出・反復した割合を対応づける理想模型。一般の波動・粒子の性質や物理実験は未評価。 |
| 1b | KA Core | 二重スリット実験と不確定性 | 部分 | 1214 で４区画の検出確率と経路を区別する印、位相反転を比較。1215 で最小不確定性ガウス波束の位置と運動量の幅を比較。二重スリットの連続分布、一般の波束や実験装置は未評価。 |
| 1c | KA Core | 量子ビット、重ね合わせ・干渉・測定、光子 | 部分 | 74 は単一量子ビットの干渉と途中測定。光子の実現等は未評価。 |
| 1d | KA Core | 二量子ビット、もつれ、ベル状態、通信不能定理 | 部分 | 676・677 は固定の相関、周辺分布、３種類のベル状態。一般の定理や残りの状態は未評価。 |
| 2 | KA Core | 重ね合わせ・測定・ユニタリー発展の公準 | 部分 | 74・676 は固定例。公準全般は未評価。 |
| 3 | KA Core | 一量子ビットゲート X・Z・H | 部分 | 74・676・677 でゲートを操作。一般の複素状態は未評価。 |
| 4 | KA Core | 二量子ビットゲート、テンソル積、行列 | 部分 | 677 で制御 NOT とゲートを操作。一般の行列と複素状態は未評価。 |
| 5 | KA Core | 複製不能定理と量子テレポーテーション | 部分 | 678 の４入力・４測定と 679 の複製の固定例。一般の証明や実機は未評価。 |
| 6a | KA Core | Bernstein–Vazirani と Simon のアルゴリズム | 部分 | 821 で２ビットの Bernstein–Vazirani 問題、822 で Simon の測定結果から３ビットの非ゼロ周期を絞る固定例。Simon の量子回路、ゼロ周期、一般入力、オラクルの実装費用や実機は未評価。 |
| 6b | KA Core | Mach–Zehnder 干渉計での Deutsch–Jozsa | 部分 | 1221 で２経路の理想干渉計と位相問い合わせを使う１ビットの Deutsch 問題。一般の入力数、補助量子ビット、実機は未評価。 |
| 6c | KA Core | Shor の因数分解 | 部分 | 610 は固定の測定結果と古典的後処理。1222 は周期２・４の逆 QFT と測定値からの候補を比較。一般の周期・量子回路と因数分解は未評価。 |
| 6d | KA Core | Grover の探索 | 部分 | 820 で４候補の符号反転と拡散、861で４・８・16候補の反復回数と確率を比較。一般の候補数・正解数、オラクルの構築費用、実機や計算量の証明は未評価。 |
| 7a | KA Core | 量子ビットの物理的実装 | 部分 | 1216 で超伝導回路・捕捉イオン・光子の構成例を比較。半導体・中性原子など他方式、実機の構築や性能は未評価。 |
| 7b | KA Core | QPU の古典制御 | 部分 | 1218 で補助測定の古典結果に応じて X を選ぶ条件付き制御の固定模型。制御装置、遅延、制御信号や実機は未評価。 |
| 7c | KA Core | 誤りの緩和・制御、NISQ とその先 | 部分 | 1217 で読取り誤差を較正・補正し、1218 で３量子ビット反復符号の１個の X と限界を比較。一般の誤り訂正・NISQ 全般や実機は未評価。 |
| 7d | KA Core | 測定手法 | 部分 | 74・676 は理想的な測定確率。1216 は３方式の読取り例、1217 は１ビットの読取り誤差の固定模型。詳細な測定理論と実機は未評価。 |
| 8a | KA Core | 耐量子暗号 | 部分 | 依頼839で LWE の小模型の復元と改変を操作し、関連する ML-KEM と模型の違いを確認。実用方式の実装、安全性や量子攻撃への証明は未評価。 |
| 8b | KA Core | 量子インターネット | 部分 | 1220 で三地点のもつれ交換と測定結果の古典通信を操作。損失・メモリー・接続、一般のネットワークや実機は未評価。 |
| 8c | KA Core | 断熱量子計算と量子アニーリング | 部分 | 1219 で１量子ビットの基底状態とエネルギー差の変化を比較。時間発展、一般の最適化問題、雑音や実機は未評価。 |

## 例示学習成果

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | KA Core | 粒子として生成・検出され波として伝わる対象と確率分布を論じる | 部分 | 74 の二つの道と光子検出の理想例。生成の仕組み、一般の空間分布と自由記述は未評価。 |
| 2 | KA Core | 量子の確率的性質を論じる | 部分 | 74・676 の固定された測定確率。一般的説明と自由記述は未評価。 |
| 3 | KA Core | 非古典的相関と超光速通信不能について考察 | 部分 | 676 は固定の相関と１局所操作後の周辺分布。一般の証明と自由記述は未評価。 |
| 4 | KA Core | 量子並列性と建設的・破壊的干渉の役割を説明 | 部分 | 74 の干渉、820 の探索、1221 の Deutsch 問題で振幅を比較。アルゴリズム全般と自由な説明は未評価。 |
| 5 | KA Core | Shor の QFT の役割をコードから分析 | 部分 | 1222 で周期的状態から逆 QFT の測定分布と周期候補を操作して比較。一般の周期、回路構成、実際のコード分析は未評価。 |
| 6 | KA Core | シミュレーターで Shor のプログラムを作り古典部分を示す | 部分 | 610 は後処理の固定例。プログラム作成能力は直接評価しない。 |
| 7 | KA Core | 各種量子ビットの物理方式の特徴を列挙 | 部分 | 1216 で３方式の媒体・準備・操作・読取りの構成例を選ぶ。他方式、一般的な性能比較や自由記述は未評価。 |
| 8 | KA Core | 断熱方式とゲート方式及び適する問題を比較 | 部分 | 1219 で２方式の操作と２候補のエネルギー最小化を比較。問題全般の適性、実装、自由な説明は未評価。 |

依頼839の公開札３枚と秘密・誤差の関係、小さい合同算術での復元、改変による読取りの変化を [NIST FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) と [Regev の LWE 解説](https://www.cs.columbia.edu/~tal/4261/Regev_lwesurvey.pdf)に照らして確認。模型は ML-KEM ではなく、実用上の安全性を示さない。`tests/lwe-courier.test.js` は全28条件の復元と、誤差を −1・0・1 に限る公開札からの17²候補の全探索を検査する。３候補が残り、少数の札から秘密が一意に定まるとも主張しない。

依頼74の光子と二つの道の説明は [MIT の干渉計の解説](https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/ef731c1b91d77a6db003f6c27e300d25_MIT8_03SCF16_Textbook.pdf) 8.3.3 節を参照。H による確率は `tests/qubit.test.js` で検査する。二重スリットの空間分布や実機の実験は扱わない。

依頼1214の二重スリットと経路情報は [MIT の講義資料](https://ocw.mit.edu/courses/sts-042-einstein-oppenheimer-feynman-physics-in-the-20th-century-fall-2020/mitsts_042j_f20_lecnote_doubleslit.pdf) を参照。４区画に限った振幅の和と経路を区別する場合の確率の和、位相反転を `tests/double-slit.test.js` で検査する。実際の空間分布を再現するものではない。

依頼1215の位置と運動量の不確定性とガウス波束は [MIT 量子力学の講義資料](https://ocw.mit.edu/courses/8-321-quantum-theory-i-fall-2017/2ecc07c095d8ae56600f7145c6fb4a6a_MIT8_321F17_lec5.pdf) を参照。位置・運動量の正規密度を数値積分して規格化と分散を `tests/wave-packet.test.js` で照合。最小不確定性を持つ固定例であり、一般の量子状態や時間発展は未評価。

依頼1216は [NIST の方式比較](https://www.nist.gov/quantum-information-science/quantum-computing-explained)、[IBM の共振器読取り](https://quantum.cloud.ibm.com/docs/en/tutorials/readout-error-mitigation-sampler)、[NIST のイオン蛍光読取り](https://www.nist.gov/publications/state-readout-trapped-ion-qubit-using-trap-integrated-superconducting-photon-detector)を参照。`tests/qubit-devices.test.js` は各工房の27組合せと保存・達成条件を検査する。指定された例以外の組合せを不可能と主張しない。

依頼1217の読取り誤差の較正・分布の補正・負の推定値は [IBM の解説](https://quantum.cloud.ibm.com/docs/en/tutorials/readout-error-mitigation-sampler)を参照。`tests/readout-mitigation.test.js` は非対称な読み違い率、順方向・逆方向と範囲外、保存・達成条件を検査。誤り率の変動、有限回の統計モデル、他の誤りや実機は扱わない。

依頼1218は [IBM の反復符号](https://quantum.cloud.ibm.com/learning/en/courses/foundations-of-quantum-error-correction/correcting-quantum-errors/repetition-codes)と[古典フィードフォワード](https://quantum.cloud.ibm.com/docs/en/guides/execute-dynamic-circuits)を参照。`tests/syndrome-control.test.js` は８種類の X 反転マスクの合図、２つの反転と位相反転の限界、保存・達成を検査。測定と制御に誤りのない固定模型で、実機・一般の誤り訂正を評価しない。

依頼1219は [Farhi らの断熱量子計算](https://arxiv.org/abs/quant-ph/0001106)と [D-Wave の解説](https://docs.dwavequantum.com/en/latest/quantum_research/quantum_annealing_intro.html)を参照。模型は H(s)=−(1−s)X∓sZ の基底状態で、`tests/adiabatic-lantern.test.js` が固有値、確率、エネルギー差と保存・達成を検査する。実時間発展や一般問題の効率を評価しない。

依頼1220は [NIST の量子中継と通信](https://www.nist.gov/programs-projects/quantum-communications-and-networks)を参照。`tests/entanglement-swap.test.js` で４量子ビットの４測定結果の確率・２種類の相関・補正と、結果を無視したときの両端の混合状態を検査。理想的な単一の中継であり、実機の損失や安全性は未評価。

依頼1221は [IBM の Deutsch 問題](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-algorithm)と [MIT の Deutsch–Jozsa 講義](https://ocw.mit.edu/courses/22-51-quantum-theory-of-radiation-interactions-fall-2012/693972cea9cf9da5e4e9e86fbc72c9e7_MIT22_51F12_Notes.pdf)を参照。`tests/deutsch-interferometer.test.js` は全４関数の干渉、全体位相と分類、保存・達成を検査する。理想的な１ビットの位相問い合わせで、一般の入力や補助量子ビットは未評価。

依頼1222は [IBM の Shor のアルゴリズム](https://quantum.cloud.ibm.com/docs/en/tutorials/shors-algorithm)と [MIT の量子フーリエ変換](https://ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2016/766eb82809dd269944b11e838ed1814b_MIT8_06S16_chap5.pdf)を参照。`tests/period-qft.test.js` は周期２・４の条件付き状態６種の逆 QFT の確率と複素位相を照合し、依頼610の後処理を再利用する。周期が16を割る固定例であり、一般の位相推定、ゲート回路、プログラム作成とコード分析は評価しない。
