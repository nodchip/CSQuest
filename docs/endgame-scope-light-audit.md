# FPL-Abstraction：二つの光とスコープ

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.140–141、FPL-Abstraction 8 の静的・動的スコープ。旧依頼308 `src/scope-resolution.js` と同じ二つの箱・同じ４条件を現行の工房から操作するため、旧教材と独立の範囲として重複計上しない。現行の再帰や箱の教材はこの二つの名前解決の違いを扱っていない。

工房に光１、作業部屋に光２。読み取り自体には光の局所変数がなく、工房に定義される。工房から直接呼ぶと両方式とも工房１。工房から作業部屋を呼び、その中から読み取りを呼ぶと、静的方式は定義位置の工房１、動的方式は直近の実行中の呼び出し元の作業部屋２。静的スコープについて [MDN の JavaScript の説明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)、動的束縛について [GNU Emacs Lisp の説明](https://www.gnu.org/software/emacs/manual/html_node/elisp/Dynamic-Binding.html) を参照。

固定した呼出し２通りと名前１つのみ。実言語における全スコープ規則、クロージャの寿命や変更、実プログラムの作成、一般の意味論や自由な説明を評価しない。FPL-Abstraction 8 全体が完成したとは扱わない。

実装担当とは別の `review_candidate` が原典・MDN・GNU Emacs Lisp、固定例の名前解決と呼出し環境、各画面の前提、誤答・履歴、分類と開放、旧記録の既定値を確認した。関連６テストも成功した。任意の実言語・クロージャを検証したものではなく、レビュー担当自身はブラウザを操作していない。

`scripts/endgame-scope-light.playwright.js` は集いと４地域の達成状態を用意した検証用記録から、213・390・1200 px 幅で分類経由の到達、キーボード操作、誤答案内、途中保存・再開、段階開放と達成後の再開を確認した。新規開始からこの依頼への通し操作、実際のスクリーンリーダー音声や利用者による面白さの評価は未確認。
