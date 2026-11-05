# SPD-Mobile の位置と窓口の教材の個別評価

[原典の範囲照合](curriculum-audit-spd-mobile.md)を踏まえ、2026-11-05 に [SPD-Mobile 台帳](coverage-spd-mobile.md)のトピック 3a・3c と例示学習成果２を依頼393の実装、テスト、画面に照らして評価した。３項目とも **部分** とする。

- **3a API によるデータへのアクセス**：地区名を架空の窓口に送り、固定の配達予定を受け取る流れを操作する。実 API の要求形式・認証・実通信は扱わず、台帳のもう一つの例である依頼354を今回再評価したわけではない。
- **3c ネットワークと Web インターフェース**：圏外で応答を受け取らない場合と、通信可能時に 503 のエラー応答を受け取る場合を比較する。[MDN の Fetch の解説](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)はネットワークエラーと HTTP のエラー応答を区別している。この模型は Fetch を実行せず、ネットワークやエラーの全体を扱わない。
- **学習成果２ 位置と API を使うアプリ**：位置の許可・手動地区・窓口の返事を組み合わせる代替体験がある。[Android の位置許可](https://developer.android.com/develop/sensors-and-location/location/permissions)の参考資料を示すが、位置は架空であり、実際のセンサー・API の統合やアプリ開発は直接評価しない。

`tests/mobile-location-api.test.js` は許可・地区決定方法・手動地区・通信・窓口状態の全32組合せ、３条件の観察、圏外とエラー応答の区別、旧記録の復元を検査する。`tests/mobile-location.test.js` は元の位置設定の比較と復元を検査する。画面上の操作や元の依頼の達成後の記録保持は `src/app.js`、`src/mobile-location.js` と[進捗記録](progress.md)に記したローカル・公開版の確認を参照する。

これらの追加課題は元の依頼の達成条件に含まれず、依頼達成だけで追加課題の完了や実機での開発能力を示すものではない。モデルの入力と結果は固定され、位置の誤差、サーバーの認証・保存、多様なエラー、情報保護の全体も評価しない。
