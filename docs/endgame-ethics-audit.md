# 案内所の混雑案内と関係者への影響

[CS2023 SEP-Ethical-Analysis、印字274〜275ページ](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf#page=274) の倫理的判断に関連する架空の固定例。予約人数や名前の掲示によって誰に何が見えるか、本人の希望や観察者が持つ他の情報を確認する必要を考える。二つの相談では、それぞれ二つの案を受け付け、選んだ案に対応する理由と残る不利益を組み合わせる。

１人の例での推測には、見る人がその村の該当者を別情報から知っているという条件を明示する。30人の例も人数だけで安全とは判断せず、掲示を希望する架空の予約者と未確認の照合可能性を分ける。本人の理解や目的と影響に関する [ACM 倫理規範](https://www.acm.org/binaries/content/assets/about/acm-code-of-ethics-booklet.pdf)、他の情報との照合を考慮する [NIST SP 800-188](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-188.pdf) を参照した。

二択の整合を確かめる限定的な練習で、倫理的に唯一の正答や安全性を保証するものではない。現実の関係者との対話、自由な論証、文化・法域ごとの判断や一般の匿名化評価は未実施で、関連項目は部分対応である。

実装担当と別の coverage_next が原典と上記資料、推測の条件、本人の希望と未確認事項、両案の理由・不利益、誤答と保存・開放をコード上で確認した。独立担当自身のブラウザー操作は行っていない。`tests/endgame-ethics.test.js` は両場面の両案と不整合の拒否を検証し、`scripts/endgame-ethics.playwright.js` は集いと４地域の達成状態を用意した記録から誤答、途中保存、再挑戦、開放と達成を確認する。実スクリーンリーダー音声は未検証。
