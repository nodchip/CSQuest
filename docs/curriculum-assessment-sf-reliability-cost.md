# SF-Reliability：検査方式の処理量の評価

評価日：2026-11-05。[CS2023 印字 p.296](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の KA Core 学習成果５を、依頼107の固定模型と照合した。検査の考え方は[CMU の剰余による検査](https://www.cs.cmu.edu/~15451-f22/recis/reci12.pdf)と[ミシガン大学の拡張ハミング符号](https://www.eecs.umich.edu/courses/eecs373.w05/lecture/hamming.html)を参照。

判定は「部分」。４データビットに対する CRC の７ビットと拡張符号の８ビットを比べ、受信時の検査におけるモデル上の１ビット XOR 回数を表示する。CRC は実行した４ビット XOR の個数で変化し、拡張符号は３組各４回と全体７回の計19回と数える。両方式は提供する検出・訂正能力が異なる。実時間、条件分岐や訂正の処理量、符号化、実装全体の複雑さは評価しない。

`tests/crc-lab.test.js` は７ビット入力128通りの XOR 回数を独立した整数の割り算と照合し、`tests/secded.test.js` は拡張符号の１・２ビット誤りを検査する。ローカル版の390px幅で入力変更による回数の変化と再開を確認した。これらは実システムの性能や一般の比較能力を証明しない。
