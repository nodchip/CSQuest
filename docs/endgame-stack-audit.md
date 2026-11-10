# 文庫の山札と編集履歴：範囲と未完了

[CS2023 印字 231–232 ページ（PDF 231–232 ページ目）SDF-Data-Structures](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) は、スタックを含む抽象データ型の操作と適切な選択、実際の言語でそれらを使うプログラムを含む。[NIST のスタックの定義](https://xlinux.nist.gov/dads/HTML/stack.html)は最後に入れた要素を先に出す構造と push・pop を説明する。

旧 `language-stacks.js` と `stack-heap.js` は現行冒険への到達を示さない。現行文庫の収集道具はリスト・辞書・待ち行列・集合を扱い、今回の３依頼は別に山札の上への追加・上からの取り出し・上を見て残す操作、同じ A・B・C を入れた待ち列との取り出し順、編集前の文章を積む undo を扱う。同名の札も別枚数として保持し、空の peek・pop と空の編集履歴はこの模型では状態を変えない。

undo は各編集前の文章を保存する固定例で、再実行や外部への送信、他者の編集を戻す機能を扱わない。空操作の結果は実際のライブラリによって異なる。任意の操作列・実言語での実装、計算量や一般の適切なデータ構造の選択は未評価であり、関連項目は部分対応である。

`archive-stack-stack` と `archive-stack-compare` の２件を終えると `archive-stack-undo` が開く。文庫の依頼分類から選び、地図の全達成判定にも含まれる。

実装担当とは別の `review_candidate` が原典、上記 NIST と [Python のデータ構造の解説](https://docs.python.org/3/tutorial/datastructures.html)、固定例の操作結果、空・同名別札、同じ入力の FIFO との比較、編集前の状態を記録する前提、分類と保存をコード上で確認した。指定順の操作体験であり、自由な実装や操作設計の能力を確認したものではない。レビュー担当自身はブラウザを操作していない。

`tests/endgame-stack.test.js` は空、peek の非破壊、同名の別札、FIFO との違い、履歴再開と undo を確認する。`tests/archive-quest-groups.test.js` は分類と開放を確認する。`scripts/endgame-stack.playwright.js` は集いと４地域などの達成を用意した検証用記録から、213・390・1200 px 幅で分類からの到達、キーボードによる依頼と回答、誤答の案内、途中復元、段階開放、３依頼の達成と達成後の再開を確認した。新規開始からこの依頼群までの通し操作、実際のスクリーンリーダー音声、利用者による面白さの評価は未確認。

2026-11-11、GitHub Pages に反映された `e65099f` でも同スクリプトを独立した検証用記録で再実行し、３幅すべて成功した。
