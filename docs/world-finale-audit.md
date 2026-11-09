# 全分野の入口：調査と実装の記録

公開版の調査基準：2026-11-09 に GitHub `nodchip/CSQuest` の main と Pages のデプロイを確認したコミット `81af39bc1edd1884473b42aed41b67c70026647b`。本表はその公開版と今回の追加を対象とする。旧サイトの教材データや対応文書が存在するだけでは、この冒険で遊べるものとして数えない。

[CS2023 最終報告書 pp. 29–30（PDF 28–29 ページ）](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の17知識分野をすべて列挙し、冒険の対応する入口を示す。各依頼は分野の一部の概念にとどまり、分野の修得を意味しない。

| 知識分野 | 現行冒険の候補 | 状態と注意 |
|---|---|---|
| AI — Artificial Intelligence | 夢見の観測所 `observatory-evaluate` | ２状況で学習に使わない事例を選ぶ。モデルの作成や評価指標・代表性は扱わない。 |
| AL — Algorithmic Foundations | 森の文庫 `archive-searches` | ２状況で順序づけられた棚の探索範囲を絞る。一般の二分探索の実装や計算量は扱わない。 |
| AR — Architecture and Organization | 鍛冶街 `forge-bits` | ５と３を３ビットの灯りで表す２場面。負数や実機での演算は扱わない。 |
| DM — Data Management | 谷 `valley-records` | ２状況で２条件に合う記録を選ぶ。SQL・結合・更新や一般的な問合せは扱わない。 |
| FPL — Foundations of Programming Languages | 水辺の村 `river-signals` | ２状況で記号の意味と実行順を考える。構文の形式・型・実言語は扱わない。 |
| GIT — Graphics and Interactive Techniques | 庭園 `garden-mosaic` | ２状況で画素状の升と色の位置に触れる。実際の画像処理・描画・解像度の評価は扱わない。 |
| HCI — Human-Computer Interaction | 旅人の案内所 `guide-access` | 色以外の手がかりと操作への配慮を２状況で考える。支援技術や全利用者のニーズは扱わない。 |
| MSF — Mathematical and Statistical Foundations | 星読みの庭園 `garden-sets` | 二つの集合の共通部分を２状況で選ぶ。集合論全体や証明は扱わない。 |
| NC — Networking and Communication | 空の中継塔 `tower-forward` | 行き先の異なる３通を固定表で中継する。実アドレス・経路更新・プロトコルは扱わない。 |
| OS — Operating Systems | 風待ちの駅 `station-sharing` | 先着順の処理を２状況で考える。実 OS のスケジューラ・待ち時間の分析は扱わない。 |
| PDC — Parallel and Distributed Computing | 港 `harbor-parallel` | 共有台車を二人が使い、返す順番を２状況で並べる。実装・公平性・デッドロックや分散通信は扱わない。 |
| SDF — Software Development Fundamentals | 工房 `workshop-steps` | ２状況で指示の実行順と状態を追う。実言語の文法や一般のプログラム作成は扱わない。 |
| SE — Software Engineering | 仕立て屋 `tailor-testing` | 用途に合わせた２状況の検証を考える。網羅率など体系的なテスト設計は扱わない。 |
| SEC — Security | 霧の関所 `gate-access` | 三人の異なる役割に必要な権限を選ぶ。実際の ACL や認証基盤は扱わない。 |
| SEP — Society, Ethics, and the Profession | 案内所 `guide-privacy` | 目的と本人の希望を考える２状況。法的要件やプライバシー全般は扱わない。 |
| SF — Systems Fundamentals | 風車の里 `windmill-signals` | 二つの入力による出力を２状況で考える。複雑な回路や状態遷移は扱わない。 |
| SPD — Specialized Platform Development | 観測所 `observatory-devices` | 携帯端末向けに位置情報の許可と通信がない間の保存を考える。実際の端末 API・実装・電力制御は扱わない。 |

## 教材の照合先

一次資料は冒頭の CS2023 報告書。各依頼は次の知識単位の入り口に限る。CS2023 では知識単位を小さな一例だけで修得したと判断しない。

| 知識分野 | 参照する知識単位・今回の関係 |
|---|---|
| AI | AI-ML：予測に使った例と評価例の区別 |
| AL | AL-Foundational / AL-Strategies：順序づけられたデータの探索 |
| AR | AR-Representation：２進数による表現 |
| DM | DM-Querying：条件に合う記録の選択 |
| FPL | FPL-Formalism：表記と意味、逐次的な動作のごく小さな例。形式的意味論の構築は行わない。 |
| GIT | GIT-Fundamentals：画素による画像表現 |
| HCI | HCI-Accessibility：異なる利用者への配慮。色以外の手がかりは [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) も参照する。 |
| MSF | MSF-Discrete：集合とその共通部分 |
| NC | NC-Routing：行き先に基づく転送の固定例 |
| OS | OS-Scheduling：先着順の仕事の処理 |
| PDC | PDC-Coordination：共有資源を使う仕事の調整 |
| SDF | SDF-Fundamentals：命令の順序と実行に伴う状態変化 |
| SE | SE-Validation：用途に応じた検証 |
| SEC | SEC-Foundations：仕事に必要な権限の制限 |
| SEP | SEP-Privacy：情報の収集・利用とプライバシー |
| SF | SF-Foundations：二つの入力に対する論理積 |
| SPD | SPD-Mobile：携帯端末の位置情報・通信に関係する設計上の配慮。実装は扱わない。 |

AI の評価例については、学習に用いない事例での確認と、その限界を説明する [Google Machine Learning Crash Course: Dividing datasets](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets) も参照する。新設の携帯道具の例は、本人の許可なく位置を公開しないこと、通信がない間も端末に保存することを条件とする。実際の端末・権限・法域の全てを扱うものではない。

## 既存の進行で変更が必要な点

以前の公開版 `src/travel-map.js` は依頼・イベントによる長い直列の開放で、港も水辺の依頼達成を必要としていた。今回の版では初期３地点と地域ごとの段階的開放を追加し、保存検証も調整した。工房から港を先に訪問し、水辺へ移動してそれぞれ再読込するケースを独立ブラウザで確認した。

既存の四地域は、鍛冶街と駅のイベント後に開き、各２件で四地域の祭りを見られる。今回の６地域の物語とは別の既存イベントなので、元の祭りや依頼を壊さず、混同しないようにする。庭園の集合・論理・組み合わせの既存依頼を基礎として使う場合も、入口と区切り後の基礎の関係をプレイヤーに説明する必要がある。

## 検証の記録

新設10件は独立ブラウザの進行済みデータで、誤答、途中選択の再読込、達成表示、結果画面の再読込、各地域への復帰を確認した。上記の一次資料と照合し、各例で扱う範囲と限界を表に記録した。

６地域の条件と集い、庭園の基礎案内は作業版に追加した。集いで１地点選択後の再読込、２地点選択と再読込、冒険への復帰を進行済みデータで確認した。新規記録で工房・水辺・港・街・文庫・風車の里を実際に巡り、集いの後、残る土地を訪ねて17分野の代表依頼をすべて達成し、庭園で基礎の一区切りを見る経路を確認した。集いを後回しにして17分野の代表依頼をすべて達成した後に集いを行う経路も確認した。集い後の進行済みデータで庭園の０件から２件まで進め、祝福と応用準備中の表示、再読込を確認した。

旧版で開放したが未訪問の地点を保持する移行処理を追加した。旧形式の進行済みデータ、壊れた記録、保存容量不足、地図で現在地を選んだ場合と移動取消しをブラウザで確認した。４地域16件と AR・NC・SEC の代表依頼は、誤答後の再試行、途中の再読込、達成を実際に操作して確認した。地図は４・５・11・16地点の開放状態、320・375・768・1280px、標準・大きい文字、等倍・1.5倍の64通りで、地点の重なりと地図外へのはみ出しがないことを確認した。キーボードによる地点詳細の開閉と拡大も確認した。

新設10件の依頼画面は320pxと1280pxで、大きい文字・高コントラスト・動きなしの設定における横方向のはみ出しと選択肢の表示を確認したが、これだけで全画面のアクセシビリティを証明するものではない。公開先のデプロイと公開後検証は、コミット後に別途確認する。
