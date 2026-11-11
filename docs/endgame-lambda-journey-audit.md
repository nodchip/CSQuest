# 工房のラムダ式：照合記録

[CS2023 印字131–133頁 FPL-Functional](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 1c は簡約順序やラムダ式を扱う。[Cornell のラムダ計算教材](https://www.cs.cornell.edu/courses/cs3110/2014sp/recitations/25/lambda-calculus.html)は β 置換と自由変数の捕捉を避ける α 変換を説明する。旧依頼283 `src/lambda-reduction.js` を現行冒険で再利用し、新たな範囲達成を主張しない。

(λx.x) a → a。 (λx.λy.x) y では引数の y は自由であり、内側の束縛 y を新鮮な z に変更して (λx.λz.x) y → λz.y とする。λy.y では元の自由 y を捕捉して意味が変わる。この固定例では内側 y の束縛された出現は本体にない。任意の式・自由な導出・一般の簡約器や実言語は未評価。

## 独立レビューと動作確認

実装担当と別の担当が β 簡約、自由変数の捕捉回避と α 変換、保存・開放・焦点を確認。ローカルで集いと４地域の達成状態を用意した記録から、幅 213・390・1200 px で誤答、キーボード、途中保存・再開と達成を確認した。冒険開始からの通し到達は含まない。
