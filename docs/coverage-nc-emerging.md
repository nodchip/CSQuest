# NC-Emerging：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 p.201。[既存の調査](nc-emerging.md)と依頼を照合した。状態は[追跡方法](coverage-status.md)を参照。

## トピック

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | KA Core | ミドルボックス | 部分 | 279・280・320〜322 はフィルタ、検知、NAT、負荷分散、CDN の固定模型。AI や一般の配置・運用は未評価。 |
| 2 | KA Core | ネットワーク仮想化、SDN、データセンターネットワーク | 部分 | 319 は制御側の規則設定と転送。仮想化や実運用は未評価。 |
| 3 | KA Core | 量子ネットワーク | 部分 | 678 の量子テレポーテーション、1220 の三地点のもつれ交換と古典通信の固定例。損失、安全性、一般のネットワークや実機は未評価。 |
| 4 | KA Core | 衛星、ミリ波、可視光 | 部分 | 1161で衛星高度の伝搬下限とミリ波・可視光の遮蔽・反射の固定模型を比較。実機・一般の通信設計は未評価。 |

## 例示学習成果

| 番号 | 区分 | 内容 | 状態 | 対応例と限界 |
|---|---|---|---|---|
| 1 | KA Core | ミドルボックスの進歩の価値を説明 | 部分 | 279・280・320〜322 の固定模型。一般の価値と自由な説明は未評価。 |
| 2 | KA Core | SDN の重要性を説明 | 部分 | 319 の制御と転送の固定例。一般の設計・運用と自由な説明は未評価。 |
| 3 | KA Core | 量子ネットワークの付加価値を説明 | 部分 | 678 は量子状態の転送と古典通信の固定例。ネットワークの付加価値全般と自由な説明は未評価。 |

依頼1161は [NASA の軌道解説](https://science.nasa.gov/earth/earth-observatory/catalog-of-earth-satellite-orbits/)、[NIST の遮蔽測定](https://www.nist.gov/ctl/wireless-networks-division/millimeter-wave-channel-sounding-and-modeling)、[IEEE 802.11 の光通信資料](https://mentor.ieee.org/802.11/dcn/17/11-17-1048-02-00lc-lc-for-802-11-pdf.pdf)を参考にした比較用模型。衛星は高度の２倍を伝搬距離の下限とし、ミリ波・光の経路強度は架空の仮定。反射や遮蔽の普遍的な効果、実機の速度や接続は評価しない。`tests/emerging-links.test.js` は８条件の計算・復元・達成を検査する。
