# 灯りの否定と言い換え：教材監査

[CS2023 MSF-Discrete 印字187–188頁](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf#page=187) の成果6b（論理式の否定・形式的操作）の固定例。旧 `logic-proof.js` は含意と反例、旧標準形教材は式の変形を扱う。現行の庭園の論理依頼は事実・規則と単一化を扱い、今回の２命題の否定の真理値比較とは異なる。

Ｐ・Ｑをそれぞれ灯りの点灯（真）とし、点灯／消灯の全４状態で ¬(Ｐ∧Ｑ)＝¬Ｐ∨¬Ｑ と ¬(Ｐ∨Ｑ)＝¬Ｐ∧¬Ｑ を比較。∨ は両方真の場合を含む。¬(Ｐ∧Ｑ) と ¬Ｐ∧¬Ｑ は片方だけ消灯の２状態で異なり、両方消灯または両方点灯では一致する。２つの命題について古典２値論理の全状態を検査している。

任意の式の変形、述語論理、非古典論理、自由な証明・説明は未評価。成果全体の完成を意味しない。[Discrete Mathematics: An Open Introduction の論理規則](https://discrete.openmathbooks.org/dmoi4/sec_logic-rules.html) を参照。

2026-11-11、実装担当と別の `signed_review` が原典と [Discrete Mathematics: An Open Introduction の命題論理](https://discrete.openmathbooks.org/dmoi4/sec_logic-statements.html) に照らし、２灯４状態の真偽・包含的 OR・片方消灯の２反例、画面・保存・開放を独立レビューした。親担当が準備済み記録から幅 213・390・1200 px の鍛冶街の分類に到達し、誤答、キーボード、途中保存・再開、開放条件、達成後の保存をブラウザ確認した。新規開始からの通し操作、スクリーンリーダー音声、利用者による面白さは未確認。

2026-11-11、main `d8bf967` の [GitHub Actions](https://github.com/nodchip/CSQuest/actions/runs/42958813430) 成功後、公開サイトでも準備済み記録から幅 213・390・1200 px の分類到達、操作、誤答、保存・再開、達成を確認した。新規開始からの通し到達と利用者による面白さはこの確認に含まれない。
