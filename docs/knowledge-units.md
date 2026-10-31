# CS2023 知識単位の目録

出典: CS2023 目次（PDF 印字ページ番号）。トピック・学習成果単位への分解と照合は一部のみ実施済みで、全単位分は未完了。分野や単位が列挙されていることは、対応済みを意味しない。

目次の単位 ID・名称・印字ページは、PDF から `pdftotext -layout CS2023.pdf cs2023.txt` で抽出後、`python scripts/check_knowledge_units.py cs2023.txt` で照合できる。2026-10-31 の照合では目次とこの表は各166行で一致した。目次に名称がない単位は ID とページのみ比較する。この検査は教材、各トピック・学習成果、原典の本文の正確性を確認するものではない。

| 分野 | 単位 | 名称 | 印字ページ | 状態 |
|---|---|---|---:|---|
| AI | AI-Introduction | Fundamental Issues | 67 | 依頼109で部分観測と記憶に基づく行動の固定例。他は未対応。[詳細](ai-introduction.md) |
| AI | AI-Search | Search | 68 | 依頼08・21・42〜45・49・97で探索、負の辺の緩和、対戦、枝刈りと制約充足の固定例。他は未対応。[詳細](ai-search.md) |
| AI | AI-KRR | Fundamental Knowledge Representation and Reasoning | 70 | 依頼81・98・99で条件付き頻度、期待損失とマルコフ連鎖の固定例。他は未対応。[詳細](ai-krr.md) |
| AI | AI-ML | Machine Learning | 71 | 一部試作：１近傍分類、回帰、勾配降下、依頼118の集団別指標と過学習の固定例 |
| AI | AI-SEP | Applications and Societal Impact | 75 | 依頼118で架空の公平性指標の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-LRR | Logical Representation and Reasoning | 76 | 依頼72で固定の命題から前向き推論。他は未対応。[詳細](ai-additional.md) |
| AI | AI-Probability | Probabilistic Representation and Reasoning | 77 | 依頼81で３変数の有限分布から条件付き確率と条件付き独立の固定例。他は未対応。[詳細](ai-probability.md) |
| AI | AI-Planning | Planning | 78 | 依頼85・100で道具・仕掛け・残り時間を持つ状態と移動の固定例。他は未対応。[詳細](ai-planning.md) |
| AI | AI-Agents | Agents and Cognitive Systems | 79 | 依頼109で記憶を持つ主体の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-NLP | Natural Language Processing | 79 | 依頼119〜121で検索評価、転置索引、TF-IDF と単語の並びの固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-Robotics | Robotics | 80 | 依頼28・71で格子上の観測と移動の固定例。他は未対応。[詳細](ai-additional.md) |
| AI | AI-Vision | Perception and Computer Vision | 82 | 依頼17・118で画像以外の分類と指標の固定例。視覚は未対応。[詳細](ai-additional.md) |
| AL | AL-Foundational | Foundational Data Structures and Algorithms | 88 | 一部試作：辞書、各種整列、最長共通部分列、４点 FFT、多次元配列、連結リスト、二分探索木、最小ヒープ、グラフ表現・探索、最短路、最小全域木、推移閉包など |
| AL | AL-Strategies | Algorithmic Strategies | 90 | 依頼09・32・110で貪欲法、依頼55で分割統治、依頼76で動的計画法と貪欲法の比較。一般的分析などは未対応 |
| AL | AL-Complexity | Complexity | 91 | 依頼88で冊数別の逐次・二分探索の比較回数と最大値。一般の分析は未対応 |
| AL | AL-Models | Computational Models and Formal Languages | 93 | 依頼31の有限状態、依頼80のスタック付きの括弧判定、依頼69の不変条件、依頼154の正規表現の固定例。他のモデルや一般の証明は未対応 |
| AL | AL-SEP | Society, Ethics, and the Profession | 95 | 依頼118で集団別の分類指標の固定例。他は未対応。[詳細](al-other-units.md) |
| AR | AR-Logic | Digital Logic and Digital Systems | 102 | 一部試作：組合せ回路の初歩と一桁の加算器 |
| AR | AR-Representation | Machine-Level Data Representation | 103 | 一部試作：４ビット整数と加算器、小数の丸め、依頼93の UTF-8 固定例 |
| AR | AR-Assembly | Assembly Level Machine Organization | 103 | 一部試作：依頼73で架空の命令の取出し・解読・実行 |
| AR | AR-Memory | Memory Hierarchy | 104 | 依頼25・103・104・106・107・110でキャッシュ、誤り訂正と圧縮の固定例。他は未対応。[詳細](ar-memory.md) |
| AR | AR-IO | Interfacing and Communication | 105 | 依頼105でポーリングと割込み通知の固定例。他は未対応。[詳細](ar-io.md) |
| AR | AR-Organization | Functional Organization | 106 | 依頼158で３段階パイプラインのデータ依存、待機と転送の固定例。他は未対応。[詳細](ar-organization.md) |
| AR | AR-Performance-Energy | Performance and Energy Efficiency | 106 | 依頼159〜161で分岐予測、投機実行、時間・電力・エネルギー比較の固定例。他は未対応。[詳細](ar-performance-energy.md) |
| AR | AR-Heterogeneity | Heterogeneous Architectures | 107 | 依頼162・163で SIMD・MIMD と専用機械の費用比較の固定例。他は未対応。[詳細](ar-heterogeneity.md) |
| AR | AR-Security | Secure Processor Architectures | 107 | 未着手 |
| AR | AR-Quantum | Quantum Architectures | 108 | 依頼74で一量子ビットの重ね合わせ、H・Z と途中観測の固定例。他の範囲は未対応。[詳細](ar-quantum.md) |
| AR | AR-SEP | Sustainability Issues | 109 | 依頼91で装置の修理・製造と利用期間の架空モデル。他は未対応。[詳細](sep-sustainability.md) |
| DM | DM-Data | The Role of Data and the Data Life Cycle | 115 | 依頼122でライフサイクルの５段階の固定例。[詳細](dm-data.md) |
| DM | DM-Core | Core Database System Concepts | 115 | 依頼123で列の変更とビューの固定例。問い合わせ・トランザクション等は別の固定例のみ。[詳細](dm-core.md) |
| DM | DM-Modeling | Data Modeling | 116 | 依頼101・102で多対多、１対多、１対１の高々の制約とキーの固定例。他は未対応。[詳細](dm-modeling.md) |
| DM | DM-Relational | Relational Databases | 117 | 一部試作：依頼67で更新異常と分解後の結合を比較 |
| DM | DM-Querying | Query Construction | 118 | 一部試作：複数条件による選択、内部・左外部結合、集合演算と全称条件の固定例 |
| DM | DM-Processing | Query Processing | 118 | 依頼89で複合索引の列順と候補範囲の固定例。他は未対応。[詳細](dm-processing.md) |
| DM | DM-Internals | DBMS Internals | 119 | 一部試作：依頼35・38・39で原子性・永続性・分離と競合直列化の固定例 |
| DM | DM-NoSQL | NoSQL Systems | 120 | 未着手 |
| DM | DM-Security | Data Security and Privacy | 121 | 未着手 |
| DM | DM-Analytics | Data Analytics | 121 | 依頼127で名寄せの固定例。可視化・分類・回帰・公平性などは別の固定例のみ。[詳細](dm-analytics.md) |
| DM | DM-Distributed | Distributed Databases/Cloud Computing | 122 | 未着手 |
| DM | DM-Unstructured | Semi-structured and Unstructured Databases | 122 | 依頼120で転置索引と TF-IDF の固定例。他は未対応。[詳細](dm-unstructured.md) |
| DM | DM-SEP | Society, Ethics, and the Profession | 123 | 未着手 |
| FPL | FPL-OOP | Object-Oriented Programming | 130 | 一部試作：依頼65で個体ごとの状態と種類別の動的な振る舞い |
| FPL | FPL-Functional | Functional Programming | 131 | 一部試作：依頼51・52で列処理とクロージャの固定例 |
| FPL | FPL-Logic | Logic Programming | 133 | 依頼146〜150で有限の項の単一化、事実・規則・問い合わせ、探索と戻り、再帰的な関係、カットの固定例。他は未対応。[詳細](fpl-logic.md) |
| FPL | FPL-Scripting | Shell Scripting | 133 | 依頼151〜154で処理の受け渡し、失敗、終了状態、環境変数、正規表現の固定例。他は未対応。[詳細](fpl-scripting.md) |
| FPL | FPL-Event-Driven | Event-Driven and Reactive Programming | 134 | 依頼92で印・待ち行列・登録された処理と状態遷移の固定例。他は未対応。[詳細](fpl-event-driven.md) |
| FPL | FPL-Parallel | Parallel and Distributed Computing | 135 | 依頼15・16・90・129〜131・156・157等で順序、同期、通信、分割集約、非同期の結果待ちの固定例。他は未対応。[詳細](fpl-parallel.md) |
| FPL | FPL-Aspect | Aspect-Oriented Programming | 136 | 未着手 |
| FPL | FPL-Types | Type Systems | 136 | 一部試作：依頼24で入力・出力の型と検査 |
| FPL | FPL-Systems | Systems Execution and Memory Model | 138 | 未着手 |
| FPL | FPL-Translation | Language Translation and Execution | 139 | 依頼75で優先順位・括弧・左結合による式の構造の固定例。他は未対応。[詳細](fpl-syntax.md) |
| FPL | FPL-Abstraction | Program Abstraction and Representation | 140 | 未着手 |
| FPL | FPL-Syntax | Syntax Analysis | 141 | 依頼75で優先順位と結合による構造の固定例。他は未対応。[詳細](fpl-syntax.md) |
| FPL | FPL-Semantics | Compiler Semantic Analysis | 141 | 依頼75で小さな抽象構文木を操作。他は未対応。[詳細](fpl-syntax.md) |
| FPL | FPL-Analysis | Program Analysis and Analyzers | 142 | 未着手 |
| FPL | FPL-Code | Code Generation | 142 | 未着手 |
| FPL | FPL-Run-Time | Run-time Behavior and Systems | 143 | 未着手 |
| FPL | FPL-Constructs | Advanced Programming Constructs | 144 | 未着手 |
| FPL | FPL-Pragmatics | Language Pragmatics | 144 | 未着手 |
| FPL | FPL-Formalism | Formal Semantics | 145 | 未着手 |
| FPL | FPL-Methodologies | Formal Development Methodologies | 146 | 未着手 |
| FPL | FPL-Design | Design Principles of Programming Languages | 146 | 未着手 |
| FPL | FPL-SEP | Society, Ethics, and the Profession | 147 | 未着手 |
| GIT | GIT-Fundamentals | Fundamental Concepts | 155 | 依頼83で三角形の中心標本と画素内４標本の固定例。他は未対応。[詳細](git-fundamentals.md) |
| GIT | GIT-Visualization | Visualization | 156 | 依頼111〜113で棒・点、軸範囲、条件別集計とヒストグラムの固定例。他は未対応。[詳細](git-visualization.md) |
| GIT | GIT-Rendering | Applied Rendering and Techniques | 157 | 一部試作：依頼26の２次元変換と依頼64の平行・透視投影 |
| GIT | GIT-Modeling | Geometric Modeling | 158 | 依頼142・143・145で２次ベジェ曲線、形状の集合演算と平面多角形の三角形分割の固定例。他は未対応。[詳細](git-modeling.md) |
| GIT | GIT-Shading | Shading and Advanced Rendering | 159 | 未着手 |
| GIT | GIT-Animation | Computer Animation | 160 | 未着手 |
| GIT | GIT-Simulation | Simulation | 161 | 未着手 |
| GIT | GIT-Immersion | Immersion | 161 | 未着手 |
| GIT | GIT-Interaction | Interaction | 162 | 未着手 |
| GIT | GIT-Image | Image Processing | 163 | 依頼139〜141・144で膨張・収縮、高域フィルタ、連結成分の固定例。他は未対応。[詳細](git-image.md) |
| GIT | GIT-Physical | Tangible/Physical Computing | 164 | 未着手 |
| GIT | GIT-SEP | Society, Ethics, and the Profession | 165 | 未着手 |
| HCI | HCI-User | Understanding the User: Individual goals and interactions with others | 174 | 未着手 |
| HCI | HCI-Accountability | Accountability and Responsibility in Design | 176 | 未着手 |
| HCI | HCI-Accessibility | Accessibility and Inclusive Design | 177 | 一部試作：依頼22で三つの利用条件 |
| HCI | HCI-Evaluation | Evaluating the Design | 178 | 一部試作：依頼60で架空４人の時間・観察と限定的な結論 |
| HCI | HCI-Design | System Design | 179 | 未着手 |
| HCI | HCI-SEP | Society, Ethics, and the Profession | 181 | 未着手 |
| MSF | MSF-Discrete | Discrete Mathematics | 187 | 一部試作：有限集合、命題推論・反例、依頼95の数学的帰納法の固定例 |
| MSF | MSF-Probability | Probability | 188 | 一部試作：条件付き確率、期待値と、依頼84で等確率の４札の分散 |
| MSF | MSF-Statistics | Statistics | 190 | 依頼47・84・112〜115で代表値、条件別集計、度数、四分位範囲と回帰の固定例。他は未対応。[詳細](msf-statistics.md) |
| MSF | MSF-Linear | Linear Algebra | 191 | 一部試作：２次元の内積と向き、依頼86で２×２行列による線形変換 |
| MSF | MSF-Calculus | Calculus | 192 | 依頼116で一変数の導関数と勾配降下の固定例。他は未対応。[詳細](msf-calculus.md) |
| NC | NC-Fundamentals | Fundamentals | 198 | 依頼78で階層、カプセル化と中継時の区間別アドレスの固定例。他は未対応。[詳細](nc-fundamentals.md) |
| NC | NC-Applications | Networked Applications | 199 | 一部試作：依頼62で POST の受付後の応答消失と再送 |
| NC | NC-Reliability | Reliability Support | 199 | 一部試作：消失、再送、重複排除 |
| NC | NC-Routing | Routing and Forwarding | 199 | 一部試作：依頼48の固定転送表と依頼61の最長接頭辞照合 |
| NC | NC-SingleHop | Single Hop Communication | 200 | 未着手 |
| NC | NC-Security | Network Security | 200 | 未着手 |
| NC | NC-Mobility | Mobility | 201 | 未着手 |
| NC | NC-Emerging | Emerging Topics | 201 | 未着手 |
| OS | OS-Purpose | Role and Purpose of Operating Systems | 206 | 依頼176で仕事の切り替えと完了時刻の比較、53・54・77・105・133・151〜153に関連する固定例。OS の目的や機能の全体像と設計の体系的比較は未対応。[詳細](os-purpose.md) |
| OS | OS-Principles | Principles of Operating System | 207 | 一部試作：依頼54で保護された装置とシステムコールの固定例 |
| OS | OS-Concurrency | Concurrency | 208 | 依頼15・16・30・177〜179で更新喪失、排他、循環待ち、飢餓、セマフォとプロセス・スレッドの記録共有の固定例。実 OS の同期は未対応。[詳細](os-concurrency.md) |
| OS | OS-Protection | Protection and Safety | 209 | 依頼11・54・180・181で権限、媒体・起動・受付の保護とバックアップの固定模型。実 OS の脆弱性や保護機構は未対応。[詳細](os-protection.md) |
| OS | OS-Scheduling | Scheduling | 209 | 一部試作：先着順とラウンドロビン |
| OS | OS-Process | Process Model | 210 | 一部試作：依頼53で単一の計算装置と入出力待ちの状態を操作 |
| OS | OS-Memory | Memory Management | 210 | 一部試作：依頼34・40・137でページ置換、住所変換と枠数の固定例 |
| OS | OS-Devices | Device management | 211 | 依頼105・132で通知と DMA の固定模型。他は未対応。[詳細](os-devices.md) |
| OS | OS-Files | File Systems API and Implementation | 212 | 依頼77でファイルの名前・実体・ハードリンクと開いた参照の固定例。他は未対応。[詳細](os-files.md) |
| OS | OS-Advanced-Files | Advanced File systems | 212 | 未着手 |
| OS | OS-Virtualization | Virtualization | 213 | 依頼135でコンテナと仮想マシンのカーネルの固定模型。他は未対応。[詳細](os-virtualization.md) |
| OS | OS-Real-time | Real-time and Embedded Systems | 214 | 依頼133で２仕事の期限と順序の固定例。他は未対応。[詳細](os-real-time.md) |
| OS | OS-Faults | Fault tolerance | 214 | 依頼136で DB の先行ログ、181でバックアップ復元の固定模型。実 OS の障害耐性は未対応。[詳細](os-faults.md) |
| OS | OS-SEP | Society, Ethics, and the Profession | 215 | 未着手 |
| PDC | PDC-Programs | Programs | 219 | 依頼130・162で分割集約と SIMD・MIMD の固定例。他は未対応。[詳細](pdc-programs.md) |
| PDC | PDC-Communication | Communication | 220 | 依頼129・131で容量０・１の通信路と送信待ちの循環の固定例。他は未対応。[詳細](pdc-communication.md) |
| PDC | PDC-Coordination | Coordination | 222 | 一部試作：更新喪失、排他と循環待ち、依頼90で二人のバリア同期 |
| PDC | PDC-Evaluation | Evaluation | 224 | 一部試作：依頼66で固定量の並列化と逐次部分の限界 |
| PDC | PDC-Algorithms | Algorithms | 225 | 未着手 |
| SDF | SDF-Fundamentals | Fundamental Programming Concepts and Practices | 230 | 一部試作：順序・条件・反復と依頼33の再帰 |
| SDF | SDF-Data-Structures | Fundamental Data Structures | 231 | 依頼79で待ち行列とスタックの選択・操作の固定例。他は未対応。[詳細](sdf-data-structures.md) |
| SDF | SDF-Algorithms | Algorithms | 232 | 未着手 |
| SDF | SDF-Practices | Software Development Practices | 232 | 未着手 |
| SDF | SDF-SEP | Society, Ethics, and the Profession | 233 | 未着手 |
| SE | SE-Teamwork | Teamwork | 240 | 一部試作：依頼59で提示された関係者の希望を確認。実際の協働は未対応 |
| SE | SE-Tools | Tools and Environments | 241 | 一部試作：依頼59で共通の元と２版の変更を比較 |
| SE | SE-Requirements | Product Requirements | 242 | 依頼87で架空の聞き取り、機能・品質・曖昧さと振る舞いの分類。他は未対応。[詳細](se-requirements.md) |
| SE | SE-Design | Software Design | 243 | 未着手 |
| SE | SE-Construction | Software Construction | 245 | 未着手 |
| SE | SE-Validation | Software Verification and Validation | 246 | 一部試作：依頼23で仕様に基づく有限の試験選択 |
| SE | SE-Refactoring | Refactoring and Code Evolution | 249 | 未着手 |
| SE | SE-Reliability | Software Reliability | 250 | 未着手 |
| SE | SE-Formal | Formal Methods | 251 | 未着手 |
| SEC | SEC-Foundations | Foundational Security | 257 | 一部試作：認証結果、役割別の認可と最小権限 |
| SEC | SEC-SEP | Society, Ethics, and the Profession | 258 | 未着手 |
| SEC | SEC-Coding | Secure Coding | 259 | 依頼82で文字列連結と値のパラメータ化による検索の固定例。他は未対応。[詳細](sec-coding.md) |
| SEC | SEC-Crypto | Cryptography | 260 | 一部試作：依頼58で XOR と鍵の再利用、依頼128で署名検証の固定模型 |
| SEC | SEC-Engineering | Security Analysis, Design, and Engineering | 261 | 未着手 |
| SEC | SEC-Forensics | Digital Forensics | 262 | 未着手 |
| SEC | SEC-Governance | Security Governance | 263 | 未着手 |
| SEP | SEP-Context | Social Context | 273 | 未着手 |
| SEP | SEP-Ethical-Analysis | Methods for Ethical Analysis | 274 | 一部試作：依頼63で架空の関係者の声と３案の影響を比較 |
| SEP | SEP-Professional-Ethics | Professional Ethics | 276 | 未着手 |
| SEP | SEP-IP | Intellectual Property | 277 | 未着手 |
| SEP | SEP-Privacy | Privacy and Civil Liberties | 278 | 一部試作：依頼27で収集と閲覧の範囲、番号による結び付き |
| SEP | SEP-Communication | Communication | 279 | 未着手 |
| SEP | SEP-Sustainability | Sustainability | 281 | 依頼91で修理・製造・使用の集計範囲と期間の架空比較。他は未対応。[詳細](sep-sustainability.md) |
| SEP | SEP-History | Computing History | 282 | 未着手 |
| SEP | SEP-Economies | Economies of Computing | 283 | 未着手 |
| SEP | SEP-Security | Security Policies, Laws and Computer Crimes | 284 | 未着手 |
| SEP | SEP-DEIA | Diversity, Equity, Inclusion, and Accessibility | 285 | 未着手 |
| SF | SF-Overview | Overview of Computer Systems | 292 | 未着手 |
| SF | SF-Foundations | Basic Concepts | 293 | 未着手 |
| SF | SF-Resource | Resource Management | 294 | 未着手 |
| SF | SF-Performance | System Performance | 294 | 一部試作：依頼25でキャッシュと時間的局所性 |
| SF | SF-Evaluation | Performance Evaluation | 295 | 一部試作：依頼66で理想化した並列作業の時間を比較 |
| SF | SF-Reliability | System Reliability | 296 | 依頼10・35・62・106〜108で再送、途中停止、冗長符号と稼働記録の固定例。他は未対応。[詳細](sf-reliability.md) |
| SF | SF-Security | System Security | 297 | 未着手 |
| SF | SF-Design | System Design | 297 | 未着手 |
| SF | SF-SEP | Society, Ethics, and the Profession | 297 | 未着手 |
| SPD | SPD-Common | Common Aspects/Shared Concerns | 302 | 未着手 |
| SPD | SPD-Web | Web Platforms | 303 | 一部試作：依頼62で受付 API と再送の固定例 |
| SPD | SPD-Mobile | Mobile Platforms | 303 | 未着手 |
| SPD | SPD-Robot | Robot Platforms | 304 | 一部試作：依頼28の観測・移動と依頼71の地形・充電を考慮した移動 |
| SPD | SPD-Embedded | Embedded Platforms | 305 | 未着手 |
| SPD | SPD-Game | Game Platforms | 306 | 依頼94で一次元の点と壁の衝突・トンネリングの固定例。他は未対応。[詳細](spd-game.md) |
| SPD | SPD-Interactive | Interactive Computing Platforms | 308 | 未着手 |
| SPD | SPD-SEP/Mobile | Mobile の社会・倫理（作業用名） | 309 | 項目一覧化。教材は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Web | Web の社会・倫理（作業用名） | 310 | 項目一覧化。教材は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Game | Game の社会・倫理（作業用名） | 310 | 依頼117で音を使えない条件の字幕の固定例。他は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Robotics | Robotics の社会・倫理（作業用名） | 311 | 項目一覧化。教材は未対応。[詳細](spd-sep.md) |
| SPD | SPD-SEP/Interactive | Interactive の社会・倫理（作業用名） | 312 | 項目一覧化。教材は未対応。[詳細](spd-sep.md) |
