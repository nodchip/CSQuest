# FPL-Scripting：環境変数の教材評価

評価日：2026-11-05。[CS2023 印字 p.134](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の CS Core トピック４と、[Bash の環境](https://www.gnu.org/software/bash/manual/html_node/Environment.html)を参照し、依頼153を確認した。判定は「部分」。

依頼は新しく設定した親の値を子に渡すか、起動後の親子それぞれの変更、一度だけ別の値を渡す場合、親が受け継いだ値の除去を５つの固定条件で扱う。子の値は起動時の写しで、後の変更はもう一方を変えない。実際のシェル構文、全環境変数、起動済みプロセス間の他の通信は扱わない。

`tests/environment.test.js` の４テストは５条件の値、起動前後の変更、一時的な値、除去、旧記録と不正な操作の復元を検査する。ローカル版の390・1280px幅で５条件、途中復元とキーボード操作を確認した。この模型の達成は実シェルで環境変数を設定・使用できる能力の証明ではない。
