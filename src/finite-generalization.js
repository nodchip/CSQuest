export const finiteGeneralizationLevel={id:'archive-finite-generalization',number:'1026',kind:'finite-generalization',name:'鑑定士の候補と手本',tag:'有限仮説と汎化境界',title:'見落としの上限を考える',story:'鑑定士は複数の鑑定法から、手本をすべて正しく見分ける方法を選びます。手本と候補の数で、見落としの上限がどう変わるか調べましょう。'};
export const finiteSizes=[4,16];
export const finiteSamples=[10,20,40];
export function finiteBound(size,samples){if(!finiteSizes.includes(size)||!finiteSamples.includes(samples))throw new RangeError('条件が不正です。');return Math.min(1,size*Math.pow(0.75,samples));}
// Four equally likely cards, of which card 4 is classified incorrectly.
export function finiteSampling(mode){
 if(!['independent','repeated'].includes(mode))throw new RangeError('手本の引き方が不正です。');
 const pairs=[1,2,3,4].flatMap(a=>(mode==='independent'?[1,2,3,4]:[a]).map(b=>[a,b]));
 return {pairs,missed:pairs.filter(pair=>pair.every(card=>card!==4)).length,total:pairs.length};
}
export function finiteCreate(){return {size:4,samples:10,guess:null,seen:[],reflection:null,compareMode:null,compareGuess:null,compareChecked:false};}
export function finiteCheck(q){if(!['within','not-within'].includes(q.guess))throw new RangeError('予測を選びましょう。');const bound=finiteBound(q.size,q.samples),expected=bound<=0.05?'within':'not-within',ok=q.guess===expected,key=`${q.size}:${q.samples}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return {ok,bound,message:ok?'上限と予測が一致しました。':'上限と５％を比べて、もう一度選びましょう。'};}
export function finiteComplete(q){return finiteSizes.every(size=>finiteSamples.every(n=>q.seen.includes(`${size}:${n}`)))&&q.reflection==='assumptions';}
export function finiteRestore(q){const keys=finiteSizes.flatMap(size=>finiteSamples.map(n=>`${size}:${n}`));if(!q||!finiteSizes.includes(q.size)||!finiteSamples.includes(q.samples)||![null,'within','not-within'].includes(q.guess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'assumptions','conditional','any'].includes(q.reflection)||![undefined,null,'independent','repeated'].includes(q.compareMode)||![undefined,null,'independent','repeated','same'].includes(q.compareGuess)||![undefined,true,false].includes(q.compareChecked)||q.compareChecked&&!q.compareGuess)throw new RangeError('途中記録が不正です。');return {...q,compareMode:q.compareMode??null,compareGuess:q.compareGuess??null,compareChecked:q.compareChecked??false,seen:[...q.seen]};}
