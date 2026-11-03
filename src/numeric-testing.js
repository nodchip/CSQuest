export const numericTestingLevel={id:'workshop-numeric-testing',number:'1050',kind:'numeric-testing',name:'揺れる数の鑑定',tag:'浮動小数点と数値の試験',title:'計測水晶の合否を決める',story:'工房の計測水晶はわずかに揺れる値を返します。異なる判定方法を試し、使い道に合う試験を選びましょう。'};
export const numericMethods={exact:'厳密一致',absolute:'差が10億分の１以下',combined:'相対・絶対の両方'};
export const numericCases=[
 {id:'sum',name:'小数の加算',actual:0.1+0.2,expected:0.3,description:'0.1 と 0.2 の和を 0.3 と比較'},
 {id:'zero',name:'ゼロ付近',actual:1e-10,expected:0,description:'測定値 0.0000000001 を 0 と比較'},
 {id:'large',name:'大きな値',actual:1e9+0.1,expected:1e9,description:'測定値 約10億と0.1 を 10億と比較'},
 {id:'nan',name:'数ではない結果',actual:NaN,expected:0,description:'数でない結果 NaN を 0 と比較'}
];
export function numericTest(method,item){
 if(!Object.hasOwn(numericMethods,method)||!numericCases.includes(item))throw new RangeError('試験が不正です。');
 const a=item.actual,b=item.expected;
 if(method==='exact')return a===b;
 if(!Number.isFinite(a)||!Number.isFinite(b))return false;
 const diff=Math.abs(a-b);
 return method==='absolute'?diff<=1e-9:diff<=Math.max(1e-12,1e-9*Math.max(Math.abs(a),Math.abs(b)));
}
export function numericCreate(){return {method:'exact',item:'sum',guess:null,passed:[],reflection:null};}
export function numericRestore(q){
 const ids=numericCases.map(x=>x.id),keys=Object.keys(numericMethods).flatMap(m=>ids.map(i=>`${m}:${i}`));
 if(!q||!Object.hasOwn(numericMethods,q.method)||!ids.includes(q.item)||![null,'pass','fail'].includes(q.guess)||!Array.isArray(q.passed)||new Set(q.passed).size!==q.passed.length||q.passed.some(x=>!keys.includes(x))||![null,'context','loose','exact'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 return {method:q.method,item:q.item,guess:q.guess,passed:[...q.passed],reflection:q.reflection};
}
export function numericDone(q){return q.passed.length===numericCases.length*Object.keys(numericMethods).length&&q.reflection==='context';}
