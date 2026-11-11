# 綱と最大公約数：教材監査

- [CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字187〜188頁の MSF-Discrete 5b（最大公約数とユークリッドの互除法）に関連する固定例。旧依頼96 `src/euclid.js` の正の整数の２例に加え、現行の山の中継所で別の１例も操作する。
- [Cornell の Euclid 解説](https://pi.math.cornell.edu/~gautam/ContinuedFractions.pdf) は正の２整数について、余りを求め割る数と余りに替え、余りが０になった直前の割る数を求める手順を説明する。
- 48,18 は 48=18×2+12、18=12×1+6、12=6×2+0 より６。35,12 は 35=12×2+11、12=11×1+1、11=1×11+0 より１。54,24 は 54=24×2+6、24=6×4+0 より６。単体テストは正の共通約数を独立に列挙し、最大値を検証する。
- 画面の数字の候補は固定された一部であり、すべての正数・共通約数の列挙ではない。正の整数の小例であり、０・負数の入力、一般の停止・正当性の自由な証明や実言語の実装は評価しない。旧教材・本教材の存在を原典全体の完成とはしない。

2026-11-11、実装担当と別の `signed_review` が原典と [Elementary Number Theory の互除法](https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Elementary_Number_Theory_%28Barrus_and_Clark%29/01%3A_Chapters/1.08%3A_The_Euclidean_Algorithm) に照らし、固定３例の除算・共通約数・画面・保存・開放を独立レビューした。親担当が準備済み記録から幅 213・390・1200 px の山の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

2026-11-11、main `6b95fc1` の [GitHub Actions](https://github.com/nodchip/CSQuest/actions/runs/42949185380) 成功後、公開サイトでも準備済み記録から幅 213・390・1200 px の分類到達、操作、誤答、保存・再開、達成を確認した。新規開始からの通し到達と利用者による面白さはこの確認に含まれない。
