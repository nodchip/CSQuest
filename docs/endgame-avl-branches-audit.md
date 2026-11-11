# 鍵の樹の回転：教材監査

- [CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字88頁の AL-Foundational 9b（平衡木）の入口。現行の文庫の探索木・削除・二分木の走査に加え、旧依頼348 `src/avl-rotations.js` の回転模型を現行冒険につないだ。
- [Cornell の AVL 解説](https://www.cs.cornell.edu/courses/cs312/2008sp/lectures/lec_avl.html) の「各節で左右の部分木の高さの差が１以下」と、回転で探索木の順序が保たれることを参照。本模型の高さは空０、葉１。
- 30,20,10 の挿入後に30の右回転、10,20,30 の挿入後に10の左回転、30,10,20 の挿入後に10の左回転と30の右回転を行う。３例とも根20、左10、右30となる。鍵の順序は10,20,30のまま。
- この３鍵の固定例は一般の AVL 挿入・削除、任意の部分木を含む回転、計算量や正当性の証明、実言語による実装・自由な説明の能力を評価しない。旧教材の存在や本教材の完了を範囲全体の完成としない。

2026-11-11、実装担当と別の `signed_review` が原典と [Virginia Tech OpenDSA の AVL 解説](https://opendsa-server.cs.vt.edu/ODSA/Books/pubbook/odsa-all/fall-2019/Public_Instance/html/AVL.html) に照らし、３例の回転・高さ・探索順序・画面・保存・開放を独立レビューした。親担当が準備済み記録から幅 213・390・1200 px の文庫の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

2026-11-11、main `13d76e8` の [GitHub Actions](https://github.com/nodchip/CSQuest/actions/runs/42938532454) 成功後、公開サイトでも準備済み記録から幅 213・390・1200 px の分類到達、操作、誤答、保存・再開、達成を確認した。新規開始からの通し到達と利用者による面白さはこの確認に含まれない。
