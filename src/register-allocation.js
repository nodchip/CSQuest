export const allocationLevel={id:'workshop-register-allocation',number:'833',kind:'register-allocation',name:'四つの値と二つの小箱',tag:'レジスタ割当て',title:'重なる値に小箱を分けよう',story:'塔の機関には速い小箱が二つだけあります。四つの値を小箱や棚へ置き、同時に必要な値がぶつからないようにしましょう。'};
export const allocationNames=['A','B','C','D'];
export const allocationPlaces={r1:'小箱１',r2:'小箱２',spill:'棚へ退避'};
export const allocationPairs=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
export const allocationCases={chain:{name:'順につながる仕事',live:[[0,1],[1,2],[2,3]],edges:[[0,1],[1,2],[2,3]],minimum:0},triangle:{name:'三つが重なる仕事',live:[[0,1,2],[2,3]],edges:[[0,1],[1,2],[0,2],[2,3]],minimum:1}};
export function allocationCheck(id,placements){
 const c=allocationCases[id];if(!Object.hasOwn(allocationCases,id)||!Array.isArray(placements)||placements.length!==4||placements.some(p=>p!==null&&!Object.hasOwn(allocationPlaces,p)))throw new RangeError('配置が不正です。');
 if(placements.includes(null))return {ok:false,reason:'missing'};
 if(c.edges.some(([a,b])=>placements[a]!=='spill'&&placements[a]===placements[b]))return {ok:false,reason:'conflict'};
 const spills=placements.filter(p=>p==='spill').length;
 if(spills!==c.minimum)return {ok:false,reason:'spills',spills};
 return {ok:true,reason:'ok',spills};
}
export function allocationCreate(){return {selected:'chain',trials:Object.fromEntries(Object.keys(allocationCases).map(id=>[id,{placements:[null,null,null,null],verified:false,pairs:[],graphVerified:false}])),answer:null};}
export function allocationTogglePair(q,index){if(!Number.isInteger(index)||index<0||index>=allocationPairs.length)throw new RangeError('組が不正です。');const t=q.trials[q.selected];t.pairs=t.pairs.includes(index)?t.pairs.filter(i=>i!==index):[...t.pairs,index];t.graphVerified=false;}
export function allocationGraphCheck(id,pairs){if(!Object.hasOwn(allocationCases,id)||!Array.isArray(pairs)||pairs.some(i=>!Number.isInteger(i)||i<0||i>=allocationPairs.length)||new Set(pairs).size!==pairs.length)throw new RangeError('組の記録が不正です。');const live=allocationCases[id].live;return allocationPairs.every(([a,b],i)=>pairs.includes(i)===live.some(set=>set.includes(a)&&set.includes(b)));}
export function allocationGraphVerify(q){const t=q.trials[q.selected];t.graphVerified=allocationGraphCheck(q.selected,t.pairs);return t.graphVerified;}
export function allocationAssign(q,index,place){if(!Number.isInteger(index)||index<0||index>=4||!Object.hasOwn(allocationPlaces,place))throw new RangeError('配置が不正です。');const t=q.trials[q.selected];if(t.placements[index]!==place){t.placements[index]=place;t.verified=false;}}
export function allocationVerify(q){const t=q.trials[q.selected],r=allocationCheck(q.selected,t.placements);t.verified=r.ok;return r;}
export function allocationComplete(q){return Object.keys(allocationCases).every(id=>q.trials[id].graphVerified&&allocationGraphCheck(id,q.trials[id].pairs)&&q.trials[id].verified&&allocationCheck(id,q.trials[id].placements).ok)&&q.answer==='live';}
export function allocationRestore(q){
 if(!q||!Object.hasOwn(allocationCases,q.selected)||!q.trials||![null,'live','always','same'].includes(q.answer))throw new RangeError('記録が不正です。');
 const n=allocationCreate();n.selected=q.selected;n.answer=q.answer;
 for(const id of Object.keys(allocationCases)){const t=q.trials[id];if(!t||typeof t.verified!=='boolean')throw new RangeError('記録が不正です。');const result=allocationCheck(id,t.placements);if(t.verified&&!result.ok)throw new RangeError('確認記録が不正です。');const old=t.pairs===undefined&&t.graphVerified===undefined,pairs=old?[]:t.pairs,graphVerified=old?false:t.graphVerified;if(typeof graphVerified!=='boolean'||(graphVerified&&!allocationGraphCheck(id,pairs)))throw new RangeError('確認記録が不正です。');allocationGraphCheck(id,pairs);n.trials[id]={placements:[...t.placements],verified:t.verified,pairs:[...pairs],graphVerified};}
 return n;
}
