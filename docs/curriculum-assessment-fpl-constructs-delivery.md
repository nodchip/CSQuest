# FPL-Constructs：領域固有言語と表現の比較の教材評価

評価日：2026-11-05。[CS2023 印字 p.144](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) の Non-core トピック11・学習成果２と、[IBM Research の領域固有言語の研究](https://research.ibm.com/publications/software-design-using-uml-for-empowering-end-users-with-an-external-domain-specific-language)を参照し、依頼1245を確認した。両項目の判定は「部分」。

依頼では２種類の配達について、薬草と行き先を指定した専用命令が４操作に展開される模型と、細かい操作を直接選ぶ模型を比較する。専用命令は短く指定できる一方、この例では途中の点検を挟めない。プログラムの構造と表現の限定例であり、実言語の設計・構文解析、一般の表現力、品質・生産性の実測や自由な議論は評価しない。

`tests/delivery-language.test.js` の２テストは展開される操作、誤配達、２依頼・両方式・点検・途中記録を検査する。ローカル版の390px幅で２依頼の両方式と振り返りを操作し、達成を確認した。この固定例を解けることは、一般的な言語設計やプログラム記述の能力の証明ではない。
