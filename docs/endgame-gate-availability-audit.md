# 押し寄せる知らせと受付：教材監査

[CS2023 SEC-Foundations 印字257–258頁](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf#page=257) の可用性と DoS／DDoS を扱う固定模型。旧 `src/availability-attack.js` の依頼492にある６試行をそのまま再利用し、現行の関所に接続する。現行の署名・アクセス制御の依頼とは異なり、受付の混雑と制限に着目する。

各刻に妨害３通、村の依頼１通の順で到着。制限を先に適用し、通過したものを容量４の待合に到着順で入れ、満杯は拒否し、その後 FIFO で最大２通を処理。制限ありは送信元ごとに各刻先着１通のみ通過。４刻後の村の処理数は、制限なしはいずれも１、制限ありは単一送信元４・３送信元１・共有送信元０。送信元は人を一意に表さず、村／妨害は観察用の事前ラベルで制限が真偽を判別するわけではない。

固定の到着順・容量・処理・４刻と再送なしの模型。実ネットワーク、実際の攻撃や性能、多様な対策・制限方式、長時間の動作を評価せず、DDoS 全般を防げるとはしない。[CISA の DDoS 説明](https://www.cisa.gov/sites/default/files/2024-03/understanding-and-responding-to-distributed-denial-of-service-attacks_508c.pdf)、[Cloudflare の制限特性](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/)を参照。

2026-11-11、実装担当と別の `signed_review` が原典と [Cloudflare の送信元制限資料](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/) に照らし、到着・制限・待合・処理の順と６試行の固定結果、観察用ラベルの限界、画面・保存・開放を独立レビューした。親担当が準備済み記録から幅 213・390・1200 px の関所の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

公開確認：GitHub Pages の 8b8bcc3（Actions 42963037603 成功）で、集いと４地域の達成状態を用意した記録から、幅 213・390・1200 px のブラウザ検証スクリプトが成功。新規開始からの通し到達はこの確認に含めない。
