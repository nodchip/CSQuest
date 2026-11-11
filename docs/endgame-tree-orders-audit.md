# MSF-Discrete：枝の灯りと二分木の走査

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.187–188、MSF-Discrete 7b の木の走査。旧依頼716 `src/tree-traversal.js` の枝分かれした固定木を現行文庫に再利用し、独立した新規教材範囲として重複計上しない。現行文庫の二分探索木は検索・挿入・削除を扱い、全節点を先行・中間・後行の順に巡るものではない。

根 A の左 B・右 C、B の左 D・右 E、C の左は空・右は F。各部分木で左側を右側より先にたどり、根を左より前／左と右の間／右より後で訪ねると、先行 ABDECF、中間 DBEACF、後行 DEBFCA。空の子は飛ばす。[Cornell の二分木走査教材](https://courses.cs.cornell.edu/courses/cs2110/2026sp/lectures/lec16/) を参照。

固定木１つの操作であり、任意の木やグラフ、実言語による走査の実装、再帰の一般的な証明や性能を評価しない。MSF-Discrete 全体の完成を示さない。

2026-11-11、実装担当と別の `signed_review` が原典と [Open Data Structures の二分木資料](https://opendatastructures.org/newhtml/ods/latex2/binarytrees.html) に照らし、３つの順序・画面・保存・開放を独立レビューした。親担当の初回ブラウザ確認で幅 213・390 px に節点の重なりが見つかり、修正後に同じ幅と 1200 px で再確認した。修正後の線と親子関係は `signed_review` が独立再確認した。準備済み記録から分類到達、誤答、キーボード、保存・再開と達成を確認したが、新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。
