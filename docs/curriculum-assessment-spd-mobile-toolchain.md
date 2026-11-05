# SPD-Mobile の言語・開発環境教材の個別評価

[原典の範囲照合](curriculum-audit-spd-mobile.md)を踏まえ、2026-11-05 に [SPD-Mobile 台帳](coverage-spd-mobile.md)の 1a・1b を依頼1325の画面、実装、テストと公式資料に照らして評価した。両項目とも **部分** とする。

- **1a モバイルの言語**：Android に Kotlin、iOS に Swift を指定する２つの依頼で言語と開発環境を区別して選ぶ。[Android Studio](https://developer.android.com/studio/) と [Apple の iOS 開発](https://developer.apple.com/ios/get-started/)を参考にした例であり、他の言語・方法を排除しない。言語の構文、設計、実際のコード作成や言語間の十分な比較は評価しない。
- **1b 開発環境**：指定された Android Studio・Xcode を選び、ビルド、仮想端末での確認、実機確認の計画を順に進める。開発環境は起動せず、実際のビルドや端末での試験・デバッグ技能は評価しない。

`tests/mobile-toolchain.test.js` は２依頼×２言語×２環境の選択、手順と従来記録の復元を検査する。`tests/mobile-virtual-sensor.test.js` は仮想値０・９・10・12における閾値の判定、境界の振り返りと記録復元を検査する。仮想値は架空で、実際のセンサーを読まない。画面、途中記録と元の依頼を達成した後の記録保持は `src/app.js` と `src/mobile-platform-choice.js` を確認し、[進捗記録](progress.md)のローカル・公開版の操作結果を参照する。９・10の境界の追加は今回の公開候補であり、公開後の確認は別途必要。

これらは元の依頼の達成条件には含まれず、その達成だけでは追加課題の完了を示さない。固定例やテストは、実端末・実開発環境を使った能力、すべての環境の対応や技能の網羅を保証しない。
