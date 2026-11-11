# 薬草の組合せとパスカルの三角形：教材監査

[CS2023 MSF-Discrete 印字187–188頁](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf#page=187) の再帰定義・組合せの固定例。旧教材は `docs/msf-discrete.md` の依頼33等で数え上げを扱うが、現行の冒険で４種類から２種類を選ぶ全組と、指定した１種類を含む・含まない場合分けを結びつける依頼は見当たらない。

異なるＡ・Ｂ・Ｃ・Ｄから２種類を順序を区別せず選ぶとＡＢ、ＡＣ、ＡＤ、ＢＣ、ＢＤ、ＣＤの６組。Ｄを含む３組はＡＤ・ＢＤ・ＣＤで、Ｄ以外の３種類から１種類を選ぶ場合に対応。含まない３組はＡＢ・ＡＣ・ＢＣで３種類から２種類を選ぶ場合に対応する。両群は重ならず全６組を尽くすため、C(4,2)=C(3,1)+C(3,2)=3+3=6。両端の C(n,0)=C(n,n)=1 は空集合・全集合それぞれ１通り。

例は３段目 1,3,3,1 と４段目 1,4,6,4,1 の中央に限定。任意の n,k の証明、重複を許す組合せ、順列、一般の二項定理、自由な説明は評価しない。原典の成果全体の完成を主張しない。

一次教育資料：[Discrete Mathematics: An Open Introduction — Binomial Coefficients](https://discrete.openmathbooks.org/dmoi2/sec_counting-binom.html)。

2026-11-11、実装担当と別の `signed_review` が原典と [Discrete Mathematics: An Open Introduction](https://discrete.openmathbooks.org/dmoi2/sec_counting-binom.html) に照らし、６組・Ｄの有無の３＋３・三角形の値・境界、画面・保存・開放を独立レビューした。親担当が準備済み記録から幅 213・390・1200 px の水辺の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

2026-11-11、main `d8bf967` の [GitHub Actions](https://github.com/nodchip/CSQuest/actions/runs/42958813430) 成功後、公開サイトでも準備済み記録から幅 213・390・1200 px の分類到達、操作、誤答、保存・再開、達成を確認した。新規開始からの通し到達と利用者による面白さはこの確認に含まれない。
