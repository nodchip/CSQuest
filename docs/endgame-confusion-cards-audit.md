# 修理の予測を仕分ける：教材監査

- [CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字71〜75頁の AI-ML 7b・13a・13c（分類指標・混同行列）に関連する固定例。旧依頼118 `src/fairness.js` の真偽陽性・陰性と、現行の巻物検索の適合率・再現率を踏まえ、同じ８件の二つの予測を現行の観測所で仕分ける。
- [Google の分類指標解説](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall) は適合率 TP/(TP+FP) と再現率 TP/(TP+FN) を説明する。この教材では分母０を未定義とするが固定例はいずれも分母が正。
- 実際に必要なのは１〜４、不要は５〜８。予測Ａは１・２・３・５を必要とし、TP=3、FP=1、FN=1、TN=3、適合率3/4・再現率3/4。予測Ｂは１〜６を必要とし、TP=4、FP=2、FN=0、TN=2、適合率4/6・再現率4/4。この例はＡの適合率とＢの再現率が高い。
- 固定８件の入力であり、分母０の計算、一般に必ずトレードオフがあること、実際のモデル・母集団の性能、データ収集の誤り、集団の公平性や自由な分析は評価しない。旧教材や本教材の存在を原典全体の完成としない。

2026-11-11、実装担当と別の `signed_review` が原典と [Google の分類指標資料](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall) に照らし、固定８件の４区分・各指標・画面・保存・開放を独立レビューした。親担当が準備済み記録から幅 213・390・1200 px の観測所の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

2026-11-11、main `6b95fc1` の [GitHub Actions](https://github.com/nodchip/CSQuest/actions/runs/42949185380) 成功後、公開サイトでも準備済み記録から幅 213・390・1200 px の分類到達、操作、誤答、保存・再開、達成を確認した。新規開始からの通し到達と利用者による面白さはこの確認に含まれない。
