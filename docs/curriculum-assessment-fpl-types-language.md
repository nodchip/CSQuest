# FPL-Types：実言語の型検査時点の教材評価

2026-11-06 に [CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の CS Core 学習成果４・５と依頼1041を照合した。判定はどちらも「部分」。

整数１と文字列の加算を条件分岐に置く Rust と Python の固定例について、分岐を通る場合と通らない場合を比較する。Rust はどちらもコンパイルで拒否し、Python は分岐を通る場合に `TypeError`、通らない場合は `done` に到達する。Rust の不受理プログラムを実行したわけではなく、Python の結果は別言語による比較である。[Rust の型](https://doc.rust-lang.org/book/ch03-02-data-types.html)と [Python の TypeError](https://docs.python.org/3/library/exceptions.html#TypeError)を参照した。

`python scripts/check_type_language_examples.py` で rustc 1.99.1 と Python 3.13.15 の４結果を再確認。`tests/language-type-check.test.js` の２テストで４条件の全予想、達成、途中復元を検査し、公開版390px幅でも４条件と振り返りの達成を確認した。画面は固定結果を再現し、コンパイラを起動しない。

検査はこの１種類の不適合と２条件に限る。実際のプログラムの作成、任意の型規則、外部の静的解析、自由な説明や、すべての言語の性質を評価しない。成果５の一般的な説明も未評価である。
