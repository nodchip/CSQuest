# 灯花の街の依頼：学習内容と検証範囲

2026-11-07 確認。一次資料は ACM・IEEE-CS・AAAI の [Computer Science Curricula 2023 最終報告書](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm) の AL-Foundational 項目６（キューと両端キュー）・12（整列）と SDF-Algorithms。キューの順序が FIFO とは限らず優先度付きのものもあることを [Oracle Java Queue 文書](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Queue.html) で確認した。Princeton の整列の資料は今回 HTTP 403 となり、内容は確認できなかった。

| 依頼 | 実際の操作 | 対応する内容・限界 |
| --- | --- | --- |
| 市場の品札 | 固定された４個 `[4,2,3,1]` の隣接した品札を自由に交換し、左から昇順にする。既存 `swapAdjacent` と `isSorted` を使用。 | CS2023 AL-Foundational 12 / SDF-Algorithms の整列への導入。決まったアルゴリズムの実行、安定性、計算量、任意の長さ、一般的な証明は評価しない。 |
| ギルドの荷物 | A・B・C を受け付け A を届け、D を受け付け、B・C・D の順に届ける。既存 `containerStep` の FIFO モードを使用し、間違った選択では進めない。 | AL-Foundational 6 / SDF-Data-Structures の FIFO キューの限定例。スタックの比較、優先度付きキューの操作、容量、空からの取出し、一般的実装・性能は扱わない。 |

プレイヤーの選択する隣接交換自体を、特定の整列アルゴリズムの実行とはみなさない。FIFO は先に入ったものから取り出す順序で、他の取り出し規則も存在する。正解・不正入力・順番の維持と保存からの再生は自動テストおよびブラウザ操作で確認する。これらは CS2023 の学習成果全体の習得や、実際の言語でのプログラムの作成能力を証明しない。実際のコード・数式・文章を入力する演習はユーザー方針により設けない。
