# MSF-Probability：晴れと鐘の独立性

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.188–189、MSF-Probability 1c。旧依頼430 `src/event-independence.js` の同じ８札・３配置を現行観測所に再利用し、旧教材と独立の範囲として重複計上しない。現行の確率依頼は条件付き割合を扱うが、事象の独立性の判定や排反との比較は扱わない。

８札は等確率で、各配置とも晴れ４枚、鐘４枚。両方の印はＡが２枚、Ｂが３枚、Ｃが０枚。鐘の全体割合4/8に対し、晴れの中の鐘はそれぞれ2/4、3/4、0/4。Ａは独立、ＢとＣは独立ではない。Ｃでは両方の確率が正で重なりが０なので、同時に起きないが独立でもない。[Penn State の確率教材](https://online.stat.psu.edu/stat414/Lesson05) にある独立性の定義と照合。

固定された等確率の有限模型であり、確率０の事象を条件にした条件付き確率、一般分布や一般の証明・自由な説明は評価しない。現実の天気と鐘がこの分布に従うという主張ではなく、MSF-Probability 全体の完成を示さない。

2026-11-11、実装担当と別の `review_candidate` が原典と Penn State および [OpenStax](https://openstax.org/books/statistics/pages/3-2-independent-and-mutually-exclusive-events) の定義に照らして固定例と依頼の対応を独立レビューし、関連９テストを確認した。親担当が準備済み記録を用いて現行の観測所の分類から到達し、幅 213・390・1200 px で誤答、キーボード操作、途中保存・再開、解放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、実際のスクリーンリーダー音声、利用者による面白さは未確認。
