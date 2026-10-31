export const structuralLevel={id:'workshop-structural-induction',number:'284',kind:'structural-induction',name:'式の樹を守る証明',tag:'構造的帰納法',title:'すべての式について考えよう',story:'精霊の式の樹が増えていきます。どんな大きさの樹でも灯りが消えないことを確かめましょう。'};
export const structuralStages=[
 {title:'土台：数の葉',prompt:'任意の０以上の整数 n だけからなる式の場合、なぜ性質が成り立つでしょうか。',choices:[{text:'値は n 自身で、n は０以上だから。',correct:true,why:'数の葉を評価するとその数自身になり、定義により０以上です。'},{text:'数を何個か試して０以上だったから、すべてに成り立つ。',correct:false,why:'有限個の例だけでは、任意の数の場合を示せません。'},{text:'足し算の左右が０以上だと仮定したから。',correct:false,why:'数の葉には左右の部分式がありません。'}]},
 {title:'仮定：二つの小さな樹',prompt:'任意の式 A + B の場合、構造的帰納法で何を仮定できるでしょうか。',choices:[{text:'結論である A + B の値が０以上だと仮定する。',correct:false,why:'示したい結論そのものを仮定すると循環してしまいます。'},{text:'直接の部分式 A と B の値がそれぞれ０以上だと仮定する。',correct:true,why:'A と B は元の樹より小さい部分式で、それぞれに帰納法の仮定を使えます。'},{text:'A だけが０以上と仮定し、B の値は無条件に正とする。',correct:false,why:'B にも仮定を適用しなければ、B が０以上だといえません。'}]},
 {title:'つなぐ：足し算の樹',prompt:'A と B がどちらも０以上なら、A + B の値について何がいえるでしょうか。',choices:[{text:'和が０になる場合は性質が成り立たない。',correct:false,why:'０も０以上なので、和が０でも性質は成り立ちます。'},{text:'一部の樹で試せば、残りは証明しなくてよい。',correct:false,why:'任意の部分式に使える仮定から和の性質を導く必要があります。'},{text:'０以上の整数の和も０以上だから、A + B にも成り立つ。',correct:true,why:'評価規則により値は二つの値の和で、０以上の整数の和は０以上です。'}]}
];
export function createStructural(){return {stage:0,choice:null,message:''};}
export function structuralTry(s){const stage=structuralStages[s.stage];if(!stage)return {...s,message:'証明は完成しています。'};if(s.choice===null)return {...s,message:'札を一つ選びましょう。'};const option=stage.choices[s.choice];if(!option.correct)return {...s,message:option.why};return {...s,stage:s.stage+1,choice:null,message:option.why};}
export function structuralComplete(s){return s.stage===structuralStages.length;}
export function restoreStructural(saved){if(!saved||!Number.isInteger(saved.stage)||saved.stage<0||saved.stage>structuralStages.length||![null,0,1,2].includes(saved.choice))throw new RangeError('途中記録が不正です');return {stage:saved.stage,choice:saved.choice,message:''};}
