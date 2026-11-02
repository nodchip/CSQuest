# CS2023 知識単位の目録

出典: CS2023 目次（PDF 印字ページ番号）。トピック・学習成果単位への分解と照合は一部のみ実施済みで、全単位分は未完了。分野や単位が列挙されていることは、対応済みを意味しない。

目次の単位 ID・名称・印字ページは、PDF から `pdftotext -layout CS2023.pdf cs2023.txt` で抽出後、`python scripts/check_knowledge_units.py cs2023.txt` で照合できる。2026-10-31 の照合では目次とこの表は各166行で一致した。目次に名称がない単位は ID とページのみ比較する。この検査は教材、各トピック・学習成果、原典の本文の正確性を確認するものではない。

項目別の追跡方法と新しい台帳の整備状況は [coverage-status.md](coverage-status.md) を参照。

| 分野 | 単位 | 名称 | 印字ページ | 状態 |
|---|---|---|---:|---|
| AI | AI-Introduction | Fundamental Issues | 67 | 依頼109・687で環境、688で主体の方針、689で人と自動化の役割分担、368・685で不確実性下の判断、375で AI の分類、686で模倣ゲームと中国語の部屋の固定例。他は未対応。[詳細](ai-introduction.md) |
| AI | AI-Search | Search | 68 | 依頼08・21・42〜45・49・97・369〜374で探索、反復深化、ビーム探索、双方向探索、山登り、焼きなまし、遺伝的探索、対戦、枝刈りと制約充足の固定例。負の辺の緩和は依頼138。他は未対応。[詳細](ai-search.md) |
| AI | AI-KRR | Fundamental Knowledge Representation and Reasoning | 70 | 依頼81・98・99で条件付き頻度など、456で共起による表現、682で論理式、683でベイズ則、684で２状態の定常分布と周期の例。他は未対応。[詳細](ai-krr.md) |
| AI | AI-ML | Machine Learning | 71 | 一部試作：１近傍分類、回帰、勾配降下、依頼118の集団別指標、過学習、依頼375〜380の多層ネットワーク、前処理、評価分割、特徴表現、強化学習、クラスタリング、依頼549〜551・553・554の実測 Iris の比較、漏洩と未学習の種類、552の小さなネットワークの逆伝播と更新、661の１次元の畳み込みと最大プーリングの例。[詳細](ai-ml.md) |
| AI | AI-SEP | Applications and Societal Impact | 75 | 依頼118で架空の公平性指標の固定例。依頼457で文章生成と根拠照合、458で乱れた像と条件付き復元、459で attention の重み付き和の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-LRR | Logical Representation and Reasoning | 76 | 依頼72・537〜540で命題、知識の種類、開世界、非単調推論、量化と推論方向の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-Probability | Probabilistic Representation and Reasoning | 77 | 依頼81で３変数の有限分布から条件付き確率、562で観測による d 分離、563で共通結果を条件とする確率、564で変数消去の固定例。他は未対応。[詳細](ai-probability.md) |
| AI | AI-Planning | Planning | 78 | 依頼85・100・541〜548で状態を含む移動、半順序、因果リンク、計画グラフ、操作の前提と効果、階層分解、観測と再計画、有限期間 MDP、複数主体の経路、797で２回の道の変化と再計画の固定例。他は未対応。[詳細](ai-planning.md) |
| AI | AI-Agents | Agents and Cognitive Systems | 79 | 依頼109で記憶を持つ主体、依頼379で行動価値を更新する主体の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-NLP | Natural Language Processing | 79 | 依頼119〜121で検索評価、転置索引と単語の並び、587で文法の表による認識、588で確率付き文法、589で HMM の品詞推定の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-Robotics | Robotics | 80 | 依頼28・71で格子上の観測と移動、584・585で機体の大きさと向きを考慮した経路、586で不確かな観測と移動による位置推定の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-Vision | Perception and Computer Vision | 82 | 依頼17・118で分類指標、依頼230〜233で固定画像の分割、形の特徴と動きの対応付けの比較。他は未対応。[詳細](ai-additional.md) |
| AL | AL-Foundational | Foundational Data Structures and Algorithms | 88 | 一部試作：辞書、依頼559の両端キュー、依頼345〜347の線形探索法によるハッシュ表、各種整列、最長共通部分列、４点 FFT、多次元配列、連結リスト、二分探索木、依頼794の削除、依頼348の AVL 回転、最小ヒープ、グラフ表現・探索、最短路、最小全域木、推移閉包など |
| AL | AL-Strategies | Algorithmic Strategies | 90 | 依頼09・32・110で貪欲法、55・342で分割統治、76・337・338・341で動的計画法と解の復元、415で４塔の道を変えられる頂点被覆の近似、566で反復と再帰の固定例。一般的分析などは未対応 |
| AL | AL-Complexity | Complexity | 91 | 依頼88・334〜344で探索と実測、漸近記法、部分和、償却費用、409・410で再帰木とマスター定理、411で独立集合と頂点被覆の帰着、412で SAT の証拠、413で部分和から等分割への帰着、414で計算量クラスの固定例。一般の分析は未対応 |
| AL | AL-Models | Computational Models and Formal Languages | 93 | 依頼31の有限状態、80のスタック付き括弧判定、69の不変条件、154の正規表現、416の停止問題の対角化、417のチューリング機械、561の NFA から DFA への部分集合構成、565の ε 閉包の固定例。他のモデルや自由な証明は未対応 |
| AL | AL-SEP | Society, Ethics, and the Profession | 95 | 依頼118で集団別の分類指標の固定例。他は未対応。[詳細](al-other-units.md) |
| AR | AR-Logic | Digital Logic and Digital Systems | 102 | 依頼06・37で組合せ回路、265〜268で記憶、シフト、カウンター、伝搬遅延の固定例。他は未対応。[詳細](ar-logic.md) |
| AR | AR-Representation | Machine-Level Data Representation | 103 | 一部試作：４ビット整数と加算器、小数の丸め、依頼93の UTF-8、依頼460のバイト順、461の符号付き表現の固定例 |
| AR | AR-Assembly | Assembly Level Machine Organization | 103 | 一部試作：依頼73で架空の命令の取出し・解読・実行、560で入れ子の呼出しと復帰 |
| AR | AR-Memory | Memory Hierarchy | 104 | 依頼25・103・104・106・107・110でキャッシュ、誤り訂正と圧縮の固定例。依頼455で番地の読書きと保存・電源断、574でキャッシュの書込み方針、795で直接対応と２ウェイ、796で先読みと転送を比較。他は未対応。[項目別台帳](coverage-ar-memory.md)と[詳細](ar-memory.md) |
| AR | AR-IO | Interfacing and Communication | 105 | 依頼105でポーリングと割込み通知、454で１枠のハンドシェイクの固定例。他は未対応。[詳細](ar-io.md) |
| AR | AR-Organization | Functional Organization | 106 | 依頼158で３段階パイプラインのデータ依存、待機と転送の固定例。他は未対応。[詳細](ar-organization.md) |
| AR | AR-Performance-Energy | Performance and Energy Efficiency | 106 | 依頼159〜161で分岐予測、投機実行、時間・電力・エネルギー比較の固定例。他は未対応。[詳細](ar-performance-energy.md) |
| AR | AR-Heterogeneity | Heterogeneous Architectures | 107 | 依頼162・163で SIMD・MIMD と専用機械の費用比較の固定例。他は未対応。[詳細](ar-heterogeneity.md) |
| AR | AR-Security | Secure Processor Architectures | 107 | 依頼255〜259で範囲と権限、乱数、個体差、構成証明、暗号文での乗算、依頼383で信頼の起点を仮定した起動検証の固定例。他は未対応。[詳細](ar-security.md) |
| AR | AR-Quantum | Quantum Architectures | 108 | 依頼74で一量子ビットの干渉、610で周期探索後処理、677でベル状態の構築、676で古典混合との相関、678で量子テレポーテーション、679で複製と転送の固定例。各トピックと成果の不足は[詳細](ar-quantum.md)を参照。 |
| AR | AR-SEP | Sustainability Issues | 109 | 依頼91で装置の修理・製造と利用期間の架空モデル。他は未対応。[詳細](sep-sustainability.md) |
| DM | DM-Data | The Role of Data and the Data Life Cycle | 115 | 依頼122でライフサイクルの５段階の固定例。[詳細](dm-data.md) |
| DM | DM-Core | Core Database System Concepts | 115 | 依頼123で列の変更とビューの固定例。問い合わせ・トランザクション等は別の固定例のみ。[詳細](dm-core.md) |
| DM | DM-Modeling | Data Modeling | 116 | 依頼101・102で多対多、１対多、１対１の高々の制約とキーの固定例。他は未対応。[詳細](dm-modeling.md) |
| DM | DM-Relational | Relational Databases | 117 | 依頼466〜472で属性閉包、正規形、二・三分解、多値従属性、物理配置、非正規化と制約の固定例。一般の設計・証明は未対応。[詳細](dm-relational.md) |
| DM | DM-Querying | Query Construction | 118 | 一部試作：複数条件による選択、内部・左外部結合、集合演算、全称条件、依頼462の相関する存在判定と463の結果の反復、465の NULL と制約の固定例 |
| DM | DM-Processing | Query Processing | 118 | 依頼89で複合索引の列順と候補範囲、662で B+ 木の挿入と範囲走査、663で拡張可能ハッシュ、664で結合と条件の順序、665で外部併合整列、666でハッシュ結合の固定例。他は未対応。[詳細](dm-processing.md) |
| DM | DM-Internals | DBMS Internals | 119 | 一部試作：依頼35・38・39で原子性・永続性・分離と競合直列化の固定例 |
| DM | DM-NoSQL | NoSQL Systems | 120 | 依頼189〜193で鍵と文書、複製・分割・グラフと読み書きの重なりの固定模型。実製品や一般的な分散・整合性は未対応。[詳細](dm-nosql.md) |
| DM | DM-Security | Data Security and Privacy | 121 | 依頼194〜196で不要な収集、通信・閲覧、監査記録と集計からの推論の固定模型。実際の法令や DB の安全性は未対応。[詳細](dm-security.md) |
| DM | DM-Analytics | Data Analytics | 121 | 依頼127で名寄せの固定例。可視化・分類・回帰・公平性などは別の固定例のみ。[詳細](dm-analytics.md) |
| DM | DM-Distributed | Distributed Databases/Cloud Computing | 122 | 依頼190・191・193・293・294で複製、分割、クォーラム、分散取引と結合の固定模型。他は未対応。[詳細](dm-distributed.md) |
| DM | DM-Unstructured | Semi-structured and Unstructured Databases | 122 | 依頼120で転置索引と TF-IDF の固定例。他は未対応。[詳細](dm-unstructured.md) |
| DM | DM-SEP | Society, Ethics, and the Profession | 123 | 依頼194・196・330〜333で収集、推論、来歴、管理責任と準識別子の固定例。他は未対応。[詳細](dm-society.md) |
| FPL | FPL-OOP | Object-Oriented Programming | 130 | 依頼65で個体ごとの状態と種類別の動的な振る舞い、579で非公開状態と操作による範囲検査、580で継承と合成、581で静的な候補選択と動的な呼出し、582でクラス変数と個体の変数、583で反復子と削除、778で多重継承の探索順序、779で公開操作情報と札の生成、780で抽象基底とミックスイン、781で袋と精霊の応用例。[項目別台帳](coverage-fpl-oop.md)と[詳細](fpl-oop.md) |
| FPL | FPL-Functional | Functional Programming | 131 | 51・52で列処理とクロージャ、590で永続的な鎖、325・326で遅延・共有、773で木の集約、774で環境と回収、775で共有節の簡約を扱う。[項目別台帳](coverage-fpl-functional.md)と[詳細](fpl-functional.md)を参照。 |
| FPL | FPL-Logic | Logic Programming | 133 | 146〜150で単一化・事実・規則・探索・再帰・カット、776で待機と規則に基づく未知値の探索、777で部分計算の記録と再利用を扱う。[項目別台帳](coverage-fpl-logic.md)と[詳細](fpl-logic.md)を参照。 |
| FPL | FPL-Scripting | Shell Scripting | 133 | 依頼151〜154で処理の受け渡し、失敗、終了状態、環境変数、正規表現の固定例。他は未対応。[詳細](fpl-scripting.md) |
| FPL | FPL-Event-Driven | Event-Driven and Reactive Programming | 134 | 依頼92で印・待ち行列・登録された処理と状態遷移の固定例。他は未対応。[詳細](fpl-event-driven.md) |
| FPL | FPL-Parallel | Parallel and Distributed Computing | 135 | 依頼15・16・90・129〜131・156・157等で順序、同期、通信、分割集約、非同期の結果待ちの固定例。他は未対応。[詳細](fpl-parallel.md) |
| FPL | FPL-Aspect | Aspect-Oriented Programming | 136 | 依頼323・324で操作の節目を選び、共通の記録と元の処理へ進む判断を行う固定模型。他は未対応。[詳細](fpl-execution-analysis.md#fpl-aspectnon-core) |
| FPL | FPL-Types | Type Systems | 136 | 依頼24・772で型検査と正しさ、764・765で型推論、766・767で進行と保存、768で命題と型、769で長さに依存する型を扱う。[項目別台帳](coverage-fpl-types.md)と[詳細](fpl-types.md)を参照。 |
| FPL | FPL-Systems | Systems Execution and Memory Model | 138 | リスト・配列・再帰・呼出し、201〜203の回収・別名、782の直接・間接・添字アクセス、783の制御フローから分岐・ジャンプ、784の末尾呼出しと枠、785の再帰とメモリ領域、786の棚再利用と世代付きキーの固定例。[項目別台帳](coverage-fpl-systems.md)と[詳細](fpl-execution-analysis.md#fpl-systemscs-core) |
| FPL | FPL-Translation | Language Translation and Execution | 139 | 依頼75・311・312・315で式と翻訳段階、787でクロスコンパイルと中間コード、788で構文図と規則札、789で最適化の意味保存、790で名前解決と配置の固定例。[項目別台帳](coverage-fpl-translation.md)と[詳細](fpl-syntax.md) |
| FPL | FPL-Abstraction | Program Abstraction and Representation | 140 | 75・154・199・306〜312の構文木やスコープ、791の環境とストアの固定例。[項目別台帳](coverage-fpl-abstraction.md)と[詳細](fpl-abstraction.md) |
| FPL | FPL-Syntax | Syntax Analysis | 141 | 75・313・314で式の構造、字句解析と先読み、792で区切りを使う誤り回復の固定例。[項目別台帳](coverage-fpl-syntax.md)と[詳細](fpl-syntax.md) |
| FPL | FPL-Semantics | Compiler Semantic Analysis | 141 | 依頼75・315・326・327で構文木、型確認と引数評価の固定例。他は未対応。[詳細](fpl-syntax.md) |
| FPL | FPL-Analysis | Program Analysis and Analyzers | 142 | 依頼204〜208で制御フロー、到達定義・固定点、不要な書込みと別の効果の固定例。一般の解析は未対応。[詳細](fpl-execution-analysis.md#fpl-analysisnon-core) |
| FPL | FPL-Code | Code Generation | 142 | 命令・呼出し等と依頼207・208の書込み除去と効果保持の固定例。一般のコード生成は未対応。[詳細](fpl-execution-analysis.md#fpl-codenon-core) |
| FPL | FPL-Run-Time | Run-time Behavior and Systems | 143 | 呼出し・配列配置、依頼201・202の回収方式の固定例。実際の実行時機構は未対応。[詳細](fpl-execution-analysis.md#fpl-run-timenon-core) |
| FPL | FPL-Constructs | Advanced Programming Constructs | 144 | 依頼325〜327で遅延評価、無限列と引数の共有の固定模型。他は未対応。[詳細](fpl-constructs-pragmatics.md#fpl-constructs) |
| FPL | FPL-Pragmatics | Language Pragmatics | 144 | 依頼325〜327で遅延評価と先行評価の固定模型。他は未対応。[詳細](fpl-constructs-pragmatics.md#fpl-pragmatics) |
| FPL | FPL-Formalism | Formal Semantics | 145 | 依頼281〜284で操作的意味論・記号実行・ラムダ簡約・帰納法、766〜770で型安全性・命題と型・依存型・パラメトリシティ、771で３種の意味論を固定例で扱う。[項目別台帳](coverage-fpl-formalism.md)と[詳細](fpl-formalism.md)を参照。 |
| FPL | FPL-Methodologies | Formal Development Methodologies | 146 | 依頼242〜244・282・284・349で固定例の契約、模型探索、記号経路と入力変異。他は未対応。[詳細](fpl-methodologies.md) |
| FPL | FPL-Design | Design Principles of Programming Languages | 146 | 依頼355で値と構成の組み合わせを比較。他は未対応。[詳細](fpl-design.md) |
| FPL | FPL-SEP | Society, Ethics, and the Profession | 147 | 依頼93・350で UTF-8 と言語・操作・日付の固定例。他は未対応。[詳細](fpl-society.md) |
| GIT | GIT-Fundamentals | Fundamental Concepts | 155 | 依頼83で三角形の標本、依頼221・222で光の値の量子化と時間方向の読み取りの固定例。他は未対応。[詳細](git-fundamentals.md) |
| GIT | GIT-Visualization | Visualization | 156 | 依頼111〜113で棒・点、軸範囲、条件別集計とヒストグラムの固定例。他は未対応。[詳細](git-visualization.md) |
| GIT | GIT-Rendering | Applied Rendering and Techniques | 157 | 一部試作：依頼26の２次元変換と依頼64の平行・透視投影 |
| GIT | GIT-Modeling | Geometric Modeling | 158 | 依頼142・143・145で２次ベジェ曲線、形状の集合演算と平面多角形の三角形分割の固定例。他は未対応。[詳細](git-modeling.md) |
| GIT | GIT-Shading | Shading and Advanced Rendering | 159 | 依頼186・187で拡散光の段階化と光からの深さによる影の固定模型。他の手法や描画 API は未対応。[詳細](git-shading.md) |
| GIT | GIT-Animation | Computer Animation | 160 | 依頼182〜185・633〜635・729で緩急、関節、スキニング、回転や架空の動作記録を操作。３次元回転・実際のリグ制作や収録は未評価。[詳細](git-animation.md) |
| GIT | GIT-Simulation | Simulation | 161 | 依頼209〜215で粒子・ばね、接触と衝突応答、ライフゲーム、濃度移流と高さ場の固定例。流体全体や一般の衝突応答等は未対応。[詳細](git-simulation.md) |
| GIT | GIT-Immersion | Immersion | 161 | 依頼216〜218で２視点の視差、古い視点情報によるずれ、現実物体の遮蔽の固定例。実際の立体表示・追跡・安全性等は未対応。[項目別台帳](coverage-git-immersion.md)と[詳細](git-immersion.md) |
| GIT | GIT-Interaction | Interaction | 162 | 依頼92・351で固定イベントと画面操作、427で複数手段の選択、806でアクセシビリティの固定例。[項目別台帳](coverage-git-interaction.md)と[詳細](git-interaction.md) |
| GIT | GIT-Image | Image Processing | 163 | 依頼139〜141・144で膨張・収縮、高域フィルタ、連結成分の固定例。808で２×２、809で４×４画像の周波数選択、810で雑音と倍率、811で DCT と量子化、812で差分と連長、813で最下位ビットの透かしの固定例を操作。他は未対応。[詳細](git-image.md) |
| GIT | GIT-Physical | Tangible/Physical Computing | 164 | 依頼219〜222で光の読み取り、サーボの目標・移動、閾値・量子化・標本化、807で積層・切削・成形の固定例。実際の回路や製作等は未対応。[項目別台帳](coverage-git-physical.md)と[詳細](git-physical.md) |
| GIT | GIT-SEP | Society, Ethics, and the Profession | 165 | 依頼352で室内情報の収集を比較。他は未対応。[詳細](git-society.md) |
| HCI | HCI-User | Understanding the User: Individual goals and interactions with others | 174 | 依頼188で架空の旅人・維持担当の声と案内所の固定模型。実際の利用者調査や協働は未対応。[詳細](hci-user.md) |
| HCI | HCI-Accountability | Accountability and Responsibility in Design | 176 | 依頼63・289で関係者と選択画面の固定例。他は未対応。[詳細](hci-accountability.md) |
| HCI | HCI-Accessibility | Accessibility and Inclusive Design | 177 | 依頼22で三つの利用条件、575で確認窓のフォーカスと操作名、793で参加型設計と評価の固定例。[項目別台帳](coverage-hci-accessibility.md)と[詳細](hci-accessibility.md) |
| HCI | HCI-Evaluation | Evaluating the Design | 178 | 一部試作：依頼60で架空４人の時間・観察と限定的な結論 |
| HCI | HCI-Design | System Design | 179 | 依頼287・288で反復設計と同期表示、427で利用条件と予算の固定比較。他は未対応。[詳細](hci-design.md) |
| HCI | HCI-SEP | Society, Ethics, and the Profession | 181 | 依頼359で架空の参加者と試作品を比較。他は未対応。[詳細](hci-society.md) |
| MSF | MSF-Discrete | Discrete Mathematics | 187 | 一部試作：有限集合、命題推論・反例、依頼95の帰納法、依頼400の鳩の巣原理、401・402の関係と関数、403の可算と対角線論法、404の順列・組合せ、405の合同算術、406の論理標準形、407の強い帰納法、408の再帰的な数え上げ、409の再帰木の固定例 |
| MSF | MSF-Probability | Probability | 188 | 条件付き確率、期待値、依頼84で分散、428で連続一様分布、429で条件付き期待値、430で独立性の固定例。他は未対応。[詳細](msf-probability.md) |
| MSF | MSF-Statistics | Statistics | 190 | 依頼47・84・112〜115で代表値、条件別集計、度数と回帰、431で二値観測の最尤推定、432で正規誤差の最尤推定と最小二乗、433で有限標本、434で既知の母標準偏差を使う正規母集団の信頼区間、435で最大事後推定と正則化、436で厳密な二項検定の固定例。他は未対応。[詳細](msf-statistics.md) |
| MSF | MSF-Linear | Linear Algebra | 191 | 依頼50・86・142・296〜305で内積、行基本変形、線形結合、基底と座標、固有方向、対角化、射影、直交化、主成分分析、PageRank、SVDと２次ベジェ曲線の固定例。他は未対応。[詳細](msf-linear.md) |
| MSF | MSF-Calculus | Calculus | 192 | 依頼473〜479で導関数、定積分、オイラー法、テイラー近似、勾配、極座標と制約付き最適化の固定例。一般の計算・証明は未対応。[詳細](msf-calculus.md) |
| NC | NC-Fundamentals | Fundamentals | 198 | 依頼78で階層とアドレス、271・272で待ち行列と蓄積転送、556でハブ・スイッチ・ルータ、557で ARP による次の受け手の解決、558で IP の砂時計型の固定例。他は未対応。[詳細](nc-fundamentals.md) |
| NC | NC-Applications | Networked Applications | 199 | 依頼62で POST の再送、421で DNS、425で HTTPS の証明確認と GET、667で中央と仲間からの受信・複製、668で用途と転送方式、669で URI、670で条件付き GET を比較する固定模型。他は未対応。[詳細](nc-applications.md) |
| NC | NC-Reliability | Reliability Support | 199 | 依頼10・649で消失・再送、422で送信窓・累積確認、423で混雑と AIMD、424で TCP 接続開始、798で受信箱の容量に合わせる固定例。他は未対応。[詳細](nc-reliability.md) |
| NC | NC-Routing | Routing and Forwarding | 199 | 依頼480〜484で集約、距離ベクトル、リンクステート、AS 経路と IP 版の固定例。実網の経路制御は未対応。[詳細](nc-routing.md) |
| NC | NC-SingleHop | Single Hop Communication | 200 | 依頼273〜278でスイッチ、VLAN、衝突、フレーム化と変調、570で冗長経路とループ、571で STP の根とポート役割の固定例。実際の媒体アクセス制御などは未対応。[詳細](nc-single-hop.md) |
| NC | NC-Security | Network Security | 200 | 依頼261〜263・274・279・280で差し替え、認証、分離、門番と警報の固定例。他の攻撃・対策は未対応。[詳細](nc-security.md) |
| NC | NC-Mobility | Mobility | 201 | 依頼316〜318で保存・中継、無線 LAN の再接続とセルラー登録区域の固定例。他は未対応。[詳細](nc-mobility.md) |
| NC | NC-Emerging | Emerging Topics | 201 | 依頼319〜322で SDN、NAT、負荷分散と CDN の固定模型。他は未対応。[詳細](nc-emerging.md) |
| OS | OS-Purpose | Role and Purpose of Operating Systems | 206 | 依頼176で切替え、依頼381で保護境界、依頼382で記録の仲介・同期・権限、依頼383で起動検証の固定例。OS の機能の全体像と体系的比較は未対応。依頼673で進化と旧窓口の互換性、674で装置仲介を比較。[詳細](os-purpose.md) |
| OS | OS-Principles | Principles of Operating System | 207 | 依頼54で保護とシステムコール、依頼381で保護境界と切替え、依頼384でファイル操作の引数と返り値の固定例。他は未対応。依頼671で受付と依頼者の権限、672でタイマーと特権を比較。[詳細](os-principles.md) |
| OS | OS-Concurrency | Concurrency | 208 | 依頼15・16・30・177〜179で競合・排他・待機・記録共有、567で原子的なスピンロック、568で再入と作業状態の固定例。実 OS の同期は未対応。[詳細](os-concurrency.md) |
| OS | OS-Protection | Protection and Safety | 209 | 依頼11・54・180・181・490・491で権限、保護とバックアップ、架空の競合模型。[項目別台帳](coverage-os-protection.md) |
| OS | OS-Scheduling | Scheduling | 209 | 依頼14の先着順・ラウンドロビン、569の最短ジョブ・最短残り時間の固定例。[詳細](os-scheduling.md) |
| OS | OS-Process | Process Model | 210 | 依頼53で状態、依頼179でスレッド、依頼385で頁の分離・共有、依頼386で親子プロセス、依頼388で局所・動的領域の寿命、依頼389でパイプ、依頼390で割込みと切替え、依頼391で実行待ち列、依頼392で共有部品の読込みの固定例。他は未対応。[詳細](os-process.md) |
| OS | OS-Memory | Memory Management | 210 | 依頼34・40・137でページ置換と住所変換、依頼385で頁の分離・共有、依頼387で確保方式と断片化の固定例。他は未対応。[詳細](os-memory.md) |
| OS | OS-Devices | Device management | 211 | 依頼105・132で通知と DMA、674で装置の仲介、746でバッファ、747で装置番地、748で環状管理、749で処理順、750で SSD の頁更新、751で仮想装置、752で装置の障害後の読取り、753で切断時の非同期の完了と参照の寿命を比較。残る範囲は[項目別台帳](coverage-os-devices.md)を参照。 |
| OS | OS-Files | File Systems API and Implementation | 212 | 依頼77で名前と実体、384で開く操作、576・577で領域割当て、739で遠隔共有、740で権限、741で空き領域管理、742でディレクトリの名前解決を操作。残る範囲は[項目別台帳](coverage-os-files.md)を参照。 |
| OS | OS-Advanced-Files | Advanced File systems | 212 | 依頼290〜292で共有ブロック・マウント・メモリ対応、736〜739で復旧と遠隔共有、743で応用冒険、744で保存時暗号化、745で特殊目的の書庫を比較。残る範囲は[項目別台帳](coverage-os-advanced-files.md)を参照。 |
| OS | OS-Virtualization | Virtualization | 213 | 依頼135でコンテナと VM、754で門番と設定の切替え、755で符の読み替えとアクセス制限、756で二段階変換と共有の固定模型。残る範囲は[項目別台帳](coverage-os-virtualization.md)を参照。 |
| OS | OS-Real-time | Real-time and Embedded Systems | 214 | 依頼133・134で期限と優先度、420で周期、395で停止距離、757で周期仕事、758で頁の固定、759で進捗監視、760で平均と期限要件、761で FreeRTOS の切替え、762で応答時間解析、763で切替えと頁準備を組み合わせる固定例。[項目別台帳](coverage-os-real-time.md) |
| OS | OS-Faults | Fault tolerance | 214 | 依頼136・181・229・736〜738・752で記録・復元・装置復旧の固定例。[項目別台帳](coverage-os-faults.md) |
| OS | OS-SEP | Society, Ethics, and the Profession | 215 | 依頼361でサポート終了と移行の固定例。他は未対応。[詳細](os-society.md) |
| PDC | PDC-Programs | Programs | 219 | 依頼130・162で分割集約と SIMD・MIMD、418で計算の依存関係、419で選択・写像・平均、442で生産者・消費者の流れ作業の固定例。他は未対応。[詳細](pdc-programs.md) |
| PDC | PDC-Communication | Communication | 220 | 依頼129・131で容量０・１の通信路と送信待ちの循環の固定例。他は未対応。[詳細](pdc-communication.md) |
| PDC | PDC-Coordination | Coordination | 222 | 一部試作：更新喪失、排他と循環待ち、依頼90で二人のバリア同期 |
| PDC | PDC-Evaluation | Evaluation | 224 | 依頼66で固定量の並列化、437で固定量・一人あたり固定の仕事量と効率、438で安全性と活性、439で時相論理の循環記録、440で線形化可能性、441で分担と小計の不変条件の固定例。他は未対応。[詳細](pdc-evaluation.md) |
| PDC | PDC-Algorithms | Algorithms | 225 | 依頼130・285で集約と並列累積和、443で行列積の並列分担、444で倍精度加算の順序と丸め、445で並列幅優先探索、446で並列整列、447で領域分割と境界共有、448で SAT 探索、449で画素ごとの視線、450で仕事の負荷を分担、451で共有在庫の条件付き更新、452で知らせから活動、453で条件に応じた計算場所を選ぶ固定例。他は未対応。[詳細](pdc-algorithms.md) |
| SDF | SDF-Fundamentals | Fundamental Programming Concepts and Practices | 230 | 一部試作：順序・条件・反復と依頼33の再帰 |
| SDF | SDF-Data-Structures | Fundamental Data Structures | 231 | 依頼79で待ち行列とスタックの選択・操作の固定例。他は未対応。[詳細](sdf-data-structures.md) |
| SDF | SDF-Algorithms | Algorithms | 232 | 依頼29・88などで探索や比較回数の固定例。一般的な時間・空間解析は未対応。[詳細](sdf-algorithms.md) |
| SDF | SDF-Practices | Software Development Practices | 232 | 依頼23・198で試験選択と状態追跡、555で名前・注釈・字下げを振る舞いと照合。実際の開発環境やプログラムの記述は未対応。[詳細](sdf-practices.md) |
| SDF | SDF-SEP | Society, Ethics, and the Profession | 233 | 依頼269・270・360で利用条件・出典・不具合対応の固定例。他は未対応。[詳細](sdf-society.md) |
| SE | SE-Teamwork | Teamwork | 240 | 依頼59で関係者の希望、650で事情の聞取り・対立する制約・役割分担の固定例。実際の協働は未対応。[詳細](se-teamwork.md) |
| SE | SE-Tools | Tools and Environments | 241 | 依頼59で３版の変更、655で集中・分散型と公開版、656で検査対象の版と依存物、657で静的規則と実行試験の固定例を比較。実ツールや一般のリリースは未対応。[詳細](se-tools.md) |
| SE | SE-Requirements | Product Requirements | 242 | 依頼87で架空の聞き取り、機能・品質・曖昧さと振る舞いの分類。他は未対応。[詳細](se-requirements.md) |
| SE | SE-Design | Software Design | 243 | 依頼223〜228で契約・依存など、680で重複と仕様変更、681で部品変更と利用者の移行をつなぐ固定例。設計全般は未対応。[詳細](se-design.md) |
| SE | SE-Construction | Software Construction | 245 | 依頼245〜250で試験先行、代役、診断記録、統合と例外後の後片付けの固定例。他は未対応。[詳細](se-construction.md) |
| SE | SE-Validation | Software Verification and Validation | 246 | 依頼23・251〜254・658・660で試験選択、検証、試験の種類、性能指標、並行実行の順序と製品・試験の役割、801で試験環境の組合せの固定例 |
| SE | SE-Refactoring | Refactoring and Code Evolution | 249 | 依頼234〜237で暗黙の依存、重複整理、版番号と段階的移行、680で重複と変更の影響を比較する固定例。他は未対応。[詳細](se-refactoring.md) |
| SE | SE-Reliability | Software Reliability | 250 | 依頼238〜241で単一障害点、失敗枠、多数決と故障の依存の固定例。他は未対応。[詳細](se-reliability.md) |
| SE | SE-Formal | Formal Methods | 251 | 依頼242〜244で有限状態の安全性・デッドロックと有限範囲の契約検査。他は未対応。[詳細](se-formal.md) |
| SEC | SEC-Foundations | Foundational Security | 257 | 一部試作：認証結果、役割別の認可と最小権限 |
| SEC | SEC-SEP | Society, Ethics, and the Profession | 258 | 依頼362で窓口停止の影響と不明点の固定例。他は未対応。[詳細](sec-society.md) |
| SEC | SEC-Coding | Secure Coding | 259 | 依頼82で文字列連結とパラメータ化、578で容量計算の桁あふれと範囲外書込みの固定例。他は未対応。[詳細](sec-coding.md) |
| SEC | SEC-Crypto | Cryptography | 260 | 依頼58・128・259〜264で鍵の再利用、署名、教材用 RSA、鍵交換、認証と衝突確率、425で HTTPS の証明確認、426でシフト暗号の固定例。他は未対応。[詳細](sec-crypto.md) |
| SEC | SEC-Engineering | Security Analysis, Design, and Engineering | 261 | 依頼328・329で脅威経路、対策の選択と修正前後の試験の固定模型。他は未対応。[詳細](sec-engineering.md) |
| SEC | SEC-Forensics | Digital Forensics | 262 | 依頼195・286で監査、受け渡しと照合の固定例。他は未対応。[詳細](sec-forensics.md) |
| SEC | SEC-Governance | Security Governance | 263 | 依頼353で復旧方針・保管・訓練の固定例。他は未対応。[詳細](sec-governance.md) |
| SEP | SEP-Context | Social Context | 273 | 依頼358で申請経路と利用条件の固定例。他は未対応。[詳細](sep-context.md) |
| SEP | SEP-Ethical-Analysis | Methods for Ethical Analysis | 274 | 一部試作：依頼63で架空の関係者の声と３案の影響を比較 |
| SEP | SEP-Professional-Ethics | Professional Ethics | 276 | 依頼360・367で報告とレビューの固定例。他は未対応。[詳細](sep-professional-ethics.md) |
| SEP | SEP-IP | Intellectual Property | 277 | 依頼269・270でライセンスと出典・著作者の固定例。法的基礎、権利の種類などは未対応。[詳細](sep-ip.md) |
| SEP | SEP-Privacy | Privacy and Civil Liberties | 278 | 一部試作：依頼27で収集と閲覧の範囲、番号による結び付き |
| SEP | SEP-Communication | Communication | 279 | 依頼295で相手に合わせた架空の報告と未確認事項の固定例。他は未対応。[詳細](sep-communication.md) |
| SEP | SEP-Sustainability | Sustainability | 281 | 依頼91で修理・製造・使用の比較、802で利用回数と製造の架空比較。他は未対応。[項目別台帳](coverage-sep-sustainability.md)と[詳細](sep-sustainability.md) |
| SEP | SEP-History | Computing History | 282 | 依頼363で三つの出来事と人々の役割を紹介。他は未対応。[詳細](sep-history.md) |
| SEP | SEP-Economies | Economies of Computing | 283 | 依頼364で伝令網の接続と相互運用を比較。他は未対応。[詳細](sep-economies.md) |
| SEP | SEP-Security | Security Policies, Laws and Computer Crimes | 284 | 依頼365で偽・正規の伝令と別経路確認の固定例。他は未対応。[詳細](sep-security.md) |
| SEP | SEP-DEIA | Diversity, Equity, Inclusion, and Accessibility | 285 | 依頼366で平等な配分と条件を踏まえた支援の固定例。他は未対応。[詳細](sep-deia.md) |
| SF | SF-Overview | Overview of Computer Systems | 292 | 回路、OS、パイプライン等に固定例。歴史や層間の一般的な構築は未対応。[詳細](sf-overview.md) |
| SF | SF-Foundations | Basic Concepts | 293 | 状態、回路、逐次・並列処理等に固定例。一般的な構築と説明は未対応。[詳細](sf-foundations.md) |
| SF | SF-Resource | Resource Management | 294 | スケジューリングや資源の固定例。実装・実測や一般的比較は未対応。[詳細](sf-resource.md) |
| SF | SF-Performance | System Performance | 294 | 一部試作：依頼25でキャッシュと時間的局所性 |
| SF | SF-Evaluation | Performance Evaluation | 295 | 依頼66で理想化した並列作業、572で CPI・クロックと仕事の構成比、573でキャッシュ競合と待ち時間の固定例。[詳細](sf-evaluation.md) |
| SF | SF-Reliability | System Reliability | 296 | 依頼10・35・62・106〜108・229で再送、途中停止、冗長符号、稼働記録と複製の固定例。他は未対応。[詳細](sf-reliability.md) |
| SF | SF-Security | System Security | 297 | 依頼180・258・280などで攻撃、対策と警報の固定例。一般的な侵入検知などは未対応。[詳細](sf-security-design.md) |
| SF | SF-Design | System Design | 297 | 設計基準に関連する固定例。代表的システムの設計は未対応。[詳細](sf-security-design.md) |
| SF | SF-SEP | Society, Ethics, and the Profession | 297 | 依頼269で２ライセンスの限定的な比較。権利と犯罪などは未対応。[詳細](sf-security-design.md) |
| SPD | SPD-Common | Common Aspects/Shared Concerns | 302 | 依頼356で通信量・資源・遅れ、803で Web の３層の固定例。他は未対応。[項目別台帳](coverage-spd-common.md)と[詳細](spd-common.md) |
| SPD | SPD-Web | Web Platforms | 303 | 依頼62で受付 API と再送、803で３層、804で状態維持、805でセッション固定と失効の固定例。実 Web アプリの開発・運用は未評価。[詳細](spd-web.md) |
| SPD | SPD-Mobile | Mobile Platforms | 303 | 依頼354で圏外の保留と再送の固定例。他は未対応。[詳細](spd-mobile.md) |
| SPD | SPD-Robot | Robot Platforms | 304 | 依頼28の観測・移動、71の地形・充電、690のトピック・受信待ち、691の機体・観測器選択の固定模型。実機や ROS の実行は未対応。[詳細](spd-robot.md) |
| SPD | SPD-Embedded | Embedded Platforms | 305 | 依頼219〜222のセンサーと駆動、133・134・420の期限・優先度・周期、395の安全性などの固定模型。実機や一般的な設計・検証は未対応。[詳細](spd-embedded.md) |
| SPD | SPD-Game | Game Platforms | 306 | 依頼94で一次元の衝突・トンネリング、799で描画と固定時間の更新、800で区画による描画候補の固定例。他は未対応。[項目別台帳](coverage-spd-game.md)と[詳細](spd-game.md) |
| SPD | SPD-Interactive | Interactive Computing Platforms | 308 | 依頼357で対話型ノートの固定例。他は未対応。[項目別台帳](coverage-spd-interactive.md)と[詳細](spd-interactive.md) |
| SPD | SPD-SEP/Mobile | Mobile の社会・倫理（作業用名） | 309 | 依頼393で位置取得と手動の代替、394で操作対象の大きさ・間隔を比較。他は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Web | Web の社会・倫理（作業用名） | 310 | 原典にある mobile のプライバシーに関し依頼393、通知と中断の選択に依頼398の固定例。他は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Game | Game の社会・倫理（作業用名） | 310 | 依頼117で字幕、398で休憩と通知、399で素材の利用条件、806でゲームの門の手がかりと操作方式の固定例。他は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Robotics | Robotics の社会・倫理（作業用名） | 311 | 依頼395で停止距離と検知遮蔽、396で条件別の見落としと改良案を比較。他は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Interactive | Interactive の社会・倫理（作業用名） | 312 | 依頼397で生成下書きの照合と編集上の記録を操作。他は未対応。[詳細](spd-sep.md) |
