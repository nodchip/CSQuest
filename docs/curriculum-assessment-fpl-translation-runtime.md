# FPL-Translation：メソッド表とクロージャの教材評価

2026-11-06 に [CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の KA Core トピック９と依頼774・1204を照合した。判定は「部分」。

依頼774は、作成役が２を覚えた関数を返し、呼出し元の同名の９と区別しながら３を加える固定模型。作成役が戻っても関数から届く環境を保持し、関数を手放してから回収する。依頼1204は２種類の実体と２つのメソッドを、実体の表と番号で解決し、上書きされた動作と継承された動作を比較する。[Cornell のクロージャと環境](https://courses.cs.cornell.edu/cs4120/2023sp/notes/functional/index.html)と [Itanium C++ ABI の例](https://itanium-cxx-abi.github.io/cxx-abi/abi-examples.html)を参考にした。

`tests/closure-machine.test.js` と `tests/virtual-dispatch.test.js` の４テストで、固定の到達可能性、操作順、全16の実体・合図・表・番号の組合せと復元を検査。公開版390px幅で２依頼の達成を確認した。

いずれも架空の抽象機械であり、実処理系のレイアウト、複数継承、任意のキャプチャや関数の受渡し、実 ABI、自由な説明や実装は評価しない。
