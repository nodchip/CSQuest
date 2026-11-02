# 手書き数字データの出典と加工

Alpaydin, E. & Kaynak, C. (1998), [Optical Recognition of Handwritten Digits](https://doi.org/10.24432/C50P49), UCI Machine Learning Repository。原データは [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) で提供されている。作者・出典・ライセンスを表示し、以下の加工を行った。

UCI の `optdigits.tra` と `optdigits.tes` から数字 0、1、8 に限り、各数字について元の順序で先頭20件を訓練、別ファイルの先頭10件を評価として抽出した。`scripts/import-uci-digits.py` で再取得・生成できる。ダウンロードした元ファイルの SHA-256 は以下の通り。

- `optdigits.tra`: `e1b683cc211604fe8fd8c4417e6a69f31380e0c61d4af22e93cc21e9257ffedd`
- `optdigits.tes`: `6ebb3d2fee246a4e99363262ddf8a00a3c41bee6014c373ed9d9216ba7f651b8`

元のデータは手書き文字を正規化した32×32画像について、４×４画素ごとの塗られた画素数を数えた８×８の値（0〜16）であり、写真そのものではない。教材ではさらに２×２ブロックの平均による４×４特徴を比較する。元の訓練・テストは異なる書き手で構成されるが、この選択した少数のデータから実用上の精度や一般的な優劣を主張できない。評価用データを繰り返し見て方法を選ぶと、独立した最終評価にもならない。
