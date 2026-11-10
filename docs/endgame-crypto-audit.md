# 中継塔の暗号と摘要

[CS2023 SEC-Crypto、印字260〜261ページ](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf#page=260) の暗号基礎に関連する例。[W3C Web Cryptography Level 2](https://www.w3.org/TR/webcrypto/) の API と [NIST SP 800-38D](https://csrc.nist.gov/pubs/sp/800/38/d/final) に基づき、ブラウザで AES-GCM の暗号化・認証付き復号と SHA-256 を実行する。鍵と 96 bit nonce は教材用に乱数から生成し、１つの生成鍵での暗号化は１回。元の例を復元する際は保存した暗号文の復号だけを行う。認証タグは 128 bit。

固定された教材用の知らせと鍵を扱い、実際の秘密を入力させない。公開鍵、鍵の共有や相手の本人確認、耐リプレイ、実運用の安全性と自由な説明は評価しない。摘要の一致は内容一致や送信者を保証せず、認証付き暗号でも改変検出の失敗を絶対には排除できない。関連項目は部分対応である。

実装担当と別の coverage_next が CS2023・W3C・NIST、鍵・nonce・認証タグ、失敗処理、保存と開放を確認し、SHA-256 の３例を別の実装で照合した。改変検出の説明に修正を指摘し、修正後に再確認した。独立担当によるブラウザ操作は行っていない。`tests/endgame-crypto.test.js` は実際の暗号化・復号・誤鍵・改変・摘要を検証し、`scripts/endgame-crypto.playwright.js` は集いと４地域の達成状態を用意した記録から、３画面幅の実操作・途中復元・再挑戦・開放と暗号機能が使えない場合を確認する。実スクリーンリーダー音声は未検証。
