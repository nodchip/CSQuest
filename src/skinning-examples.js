export const skinExamplesLevel={id:'ruin-skinning-examples',number:'1257',kind:'skinning-examples',name:'動きから重みを探す',tag:'例からのスキニング',title:'人形の動きの記録を合わせよう',story:'人形師は骨の動きと形の点の記録を残しました。記録から点の重みを推定し、複数の観測が一致しないときも考えましょう。'};
export const skinExampleWeights=[0,0.25,0.5,0.625,0.75,1];
export const skinExampleCases={ambiguous:{name:'記録１：両方の骨が同じ位置',samples:[{a:2,b:2,observed:2}]},distinct:{name:'記録２：骨の位置が異なる',samples:[{a:0,b:4,observed:3}]},noisy:{name:'記録２と３：同じ姿勢で観測が異なる',samples:[{a:0,b:4,observed:3},{a:0,b:4,observed:2}]}};
export function skinExampleFit(id,weight){if(!Object.hasOwn(skinExampleCases,id)||!skinExampleWeights.includes(weight))throw new RangeError('記録または重みが不正です。');const samples=skinExampleCases[id].samples.map(({a,b,observed})=>({a,b,observed,predicted:(1-weight)*a+weight*b}));return {samples,error:samples.reduce((sum,s)=>sum+(s.predicted-s.observed)**2,0)};}
export function skinExampleBest(id,weight){const score=skinExampleFit(id,weight).error;return skinExampleWeights.every(w=>score<=skinExampleFit(id,w).error);}
export function skinExampleCreate(){return {selected:'ambiguous',weight:0,seen:[],reflection:null};}
export function skinExampleCheck(q){const ok=skinExampleBest(q.selected,q.weight);if(ok&&!q.seen.includes(q.selected))q.seen.push(q.selected);return ok;}
export function skinExampleDone(q){return Object.keys(skinExampleCases).every(k=>q.seen.includes(k))&&q.reflection==='uncertain';}
export function skinExampleRestore(q){if(!q||!Object.hasOwn(skinExampleCases,q.selected)||!skinExampleWeights.includes(q.weight)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(skinExampleCases,k))||![null,'uncertain','exact'].includes(q.reflection))throw new RangeError('記録が不正です。');return {...q,seen:[...q.seen]};}
