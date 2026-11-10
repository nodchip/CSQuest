# AL-Foundational：片道の地図の２表現（部分対応）

[CS2023 原典](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.88–90、AL-Foundational 8a のグラフ表現に関連する入口。現行の塔は配送の手順や宛先の転送を扱う。旧依頼172 `adjacency.js` は有向グラフの行列・一覧を既に扱うため、その固定グラフと操作を再利用し、重複を新しい完成範囲として二重計上しない。

直接の片道はＡ→Ｂ、Ａ→Ｃ、Ｂ→Ｃ、Ｃ→Ｄ、Ｄ→Ａ。行列は行が出発・列が到着、一覧は出発地ごとに直接の行き先を記す。Ａ→Ｃは直接あり、Ａ→ＤはＡ→Ｃ→Ｄと経由すれば行けるが直接はなし、Ｄ→Ａは直接あり。逆向きの道を勝手に加えない。参考：[Open Data Structures, Adjacency Matrix](https://opendatastructures.org/ods-java/12_1_AdjacencyMatrix_Repres.html) と [Adjacency Lists](https://opendatastructures.org/ods-java/12_2_AdjacencyLists_Graph_a.html)。

４地点５本の固定例で、任意のグラフの実装・自己ループ・多重辺・重み・一般の空間計算量と実測や自由な説明は評価しない。直接の接続を調べる例であり、到達可能性全体を完成としない。

実装担当とは別の `review_candidate` が原典・Open Data Structures、固定例の全辺と方向・行列、直接と経由の区別、画面の前提、誤答・履歴、分類と開放、旧記録の既定値を確認した。関連８テストも成功した。任意グラフ・一般の実装を検証したものではなく、レビュー担当自身はブラウザを操作していない。

`scripts/endgame-adjacency-route.playwright.js` は集いと４地域の達成状態を用意した検証用記録から、213・390・1200 px 幅で分類経由の到達、キーボード操作、誤答案内、途中保存・再開、段階開放と達成後の再開を確認した。新規開始からこの依頼への通し操作、実際のスクリーンリーダー音声や利用者による面白さの評価は未確認。

公開確認：`d6d05b7` の Pages run 42871213342 が成功し、2026-11-11 に公開サイトで同 Playwright スクリプトを隔離したブラウザの 213・390・1200 px 幅で実行、分類からの操作、途中保存・再開と達成を確認した。検証用に進捗を用意した記録からの操作であり、新規開始からの通し確認や利用者評価ではない。
