# 二つの天秤と行基本変形：教材監査

[CS2023 MSF-Linear 印字191–192頁](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf#page=191) の連立方程式・行基本変形の固定例。旧 `src/row-elimination.js` の依頼296にある３例を再利用し、現行の冒険へ接続する。現行のベクトル・射影教材とは操作対象が異なる。

実数 x,y に対し、x+y=5・x−y=1 は行を減算、非零倍し x=3・y=2 の１組。x+y=4・2x+2y=9 は２行から１行を２回引くと 0=1 となり解なし。x+y=4・2x+2y=8 は２行を半分にして１行を引くと 0=0 となり、残る x+y=4 の実数解は無数。0=0 の行だけから常に無数と判定するわけではない。各操作は行全体に適用し、非零倍と他行の加減は解集合を保つ。

行操作の順序は教材側が指定する固定模型であり、任意の行操作・一般の次元、証明や自由な計算、整数解、数値誤差を評価しない。旧模型の有限値・半分にできる条件も引き継ぐ。[行基本変形と解集合](https://math.libretexts.org/Courses/Canada_College/Linear_Algebra_and_Its_Application/01%3A_Solving_Systems_of_Linear_Equations/1.02%3A_Matrix_Notation_and_Row_Reduction) を参照。

2026-11-11、実装担当と別の `signed_review` が原典と [Fundamentals of Matrix Algebra の行基本変形](https://math.libretexts.org/Bookshelves/Linear_Algebra/Fundamentals_of_Matrix_Algebra_%28Hartman%29/01%3A_Systems_of_Linear_Equations/1.03%3A_Elementary_Row_Operations_and_Gaussian_Elimination) に照らし、固定３例の行変形・解集合と画面・保存・開放を独立レビューした。無数解の自由変数の説明と数値誤差の未評価を追記し、再確認した。親担当が準備済み記録から幅 213・390・1200 px の谷の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

公開確認：GitHub Pages の 8b8bcc3（Actions 42963037603 成功）で、集いと４地域の達成状態を用意した記録から、幅 213・390・1200 px のブラウザ検証スクリプトが成功。新規開始からの通し到達はこの確認に含めない。
