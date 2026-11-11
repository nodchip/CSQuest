# AL-Foundational：手紙のつながり

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.88–90、AL-Foundational 4a の単方向連結リスト。旧依頼171 `src/linked-list.js` の A→B→C と X の挿入・B の切離しを現行文庫に再利用し、独立した新規教材範囲として重複計上しない。現行のリストや山札は、次の参照の書換えと到達可能性の操作を扱っていない。

X は手元にあり、B を別に指す参照を保持していない固定模型。先に X→B、次に A→X とすると A→X→B→C をたどれる。先に A→X とすると A から B・C に到達できず、この模型では B を指定できない。別の B への参照を保持していれば回復できる場合があり、一般に回復不能とは断定しない。B を外す例では A→C の後も B→C 自体は残り、鎖からの切離しをメモリ解放と同一視しない。[CMU の連結リスト教材](https://www.cs.cmu.edu/~clo/www/CMU/DataStructures/Lessons/lesson1_3.htm) を参照。

固定された３手紙と X の例であり、任意長・双方向・番兵・循環の一般的操作、別の参照や所有権・メモリ管理・実言語の実装を評価しない。AL-Foundational 全体の完成を示さない。

2026-11-11、実装担当と別の `signed_review` が原典と [Open Data Structures の単方向リスト](https://opendatastructures.org/ods-java/3_1_SLList_Singly_Linked_Li.html) に照らし、付け替え順、別参照を保持しない前提、切離しと解放の区別、画面・保存・開放を独立レビューした。親担当が準備済み記録から幅 213・390・1200 px の文庫の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

2026-11-11、main `9ac0acf` の [GitHub Actions](https://github.com/nodchip/CSQuest/actions/runs/42933532643) 成功後、公開サイトでも準備済み記録から幅 213・390・1200 px の分類到達、操作、誤答、保存・再開、達成を確認した。新規開始からの通し到達と利用者による面白さはこの確認に含まれない。
