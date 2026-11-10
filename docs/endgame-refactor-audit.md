# 工房のリファクタリング：範囲と未完了

[CS2023 印字 249–250 ページ（PDF 249–250 ページ目）SE-Refactoring](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) は、暗黙のインターフェース、後方互換性、標準的な整理、利用者への影響を含む。[Martin Fowler の定義](https://martinfowler.com/bliki/DefinitionOfRefactoring.html)は、外から見える振る舞いを保ちながら内部構造を整えることを説明する。[公開インターフェースに関する説明](https://martinfowler.com/bliki/IsChangingInterfacesRefactoring.html)は、呼び出し元をすべて変更できない場合の注意を示す。

固定模型の３依頼では、限られた入力で内部の整理、公開済みの名前と順序、旧名を残した新名追加を比較する。最後の例は、順序は約束に書かれていないが特定の利用者が依存していると設定する。未保証の振る舞いに必ず利用者が依存すると主張しない。試した例の一致は他の入力や未知の利用者を含む安全性を証明しない。自由なコード編集・実際の呼び出し元の調査・未知の利用者を含む互換性の実証・版管理方針に従った評価は未対応であり、SE-Refactoring は部分対応にとどまる。

`workshop-refactor-structure` と `workshop-refactor-interface` の２件を終えると `workshop-refactor-migration` が開く。工房の依頼分類から選び、地図の全達成判定にも含まれる。

実装担当とは別の `review_candidate` が原典、Fowler の定義と [Hyrum の法則の説明](https://abseil.io/resources/swe-book/html/ch01.html)、固定例の出力と説明、既存のデバッグ依頼との差、分類・開放・保存をコード上で確認した。試験成功は一般の等価性や未知の利用者との互換性を証明しない。レビュー担当自身のブラウザ操作は行っていない。

`tests/endgame-refactor.test.js` は空の入力・順序が異なる入力・旧名と新名・誤答とやり直し・保存履歴を検証する。`tests/workshop-quest-groups.test.js` は分類と開放を確認する。`scripts/endgame-refactor.playwright.js` は集いと４地域などの達成を用意した検証用記録から、213・390・1200 px 幅で分類からの到達、キーボードによる依頼と回答、誤答の案内、途中復元、段階開放、３依頼の達成と達成後の再開を確認した。新規開始からこの依頼群までの通し操作、実際のスクリーンリーダー音声、利用者による面白さの評価は未確認。
