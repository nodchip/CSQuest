export const fanoutBranchLevel={id:'workshop-fanout-branch',number:'926',kind:'fanout-branch',name:'六つの灯りをつなぐ',tag:'ファンインとファンアウト',title:'信号の負荷を分ける',story:'一つの信号で工房の灯りを動かします。出力の負荷を調べ、必要なら中継器に分けましょう。'};
export const fanoutBranchCases={four:{name:'４つの灯り',count:4},six:{name:'６つの灯り',count:6}};
export function fanoutBranchEvaluate(id,branches){
 if(!Object.hasOwn(fanoutBranchCases,id)||!Array.isArray(branches)||branches.length!==6||branches.some(x=>typeof x!=='boolean'))throw new RangeError('設定が不正です。');
 const count=fanoutBranchCases[id].count,bufferLoad=branches.slice(0,count).filter(Boolean).length,direct=count-bufferLoad,rootLoad=direct+(bufferLoad?1:0);
 return {direct,bufferLoad,rootLoad,rootOk:rootLoad<=4,bufferOk:bufferLoad<=4,ok:rootLoad<=4&&bufferLoad<=4};
}
export function fanoutBranchCreate(){return {selected:'four',branches:[false,false,false,false,false,false],seen:[],last:null,reflection:null};}
export function fanoutBranchCheck(q){const r=fanoutBranchEvaluate(q.selected,q.branches),key=q.selected==='four'&&r.direct===4?'four':q.selected==='six'&&r.direct===6?'overload':q.selected==='six'&&r.bufferLoad>0&&r.ok?'buffered':null;q.last={selected:q.selected,branches:[...q.branches],...r};if(key&&!q.seen.includes(key))q.seen.push(key);}
export function fanoutBranchComplete(q){return ['four','overload','buffered'].every(k=>q.seen.includes(k))&&q.reflection==='loads';}
export function fanoutBranchRestore(q){if(!q||!Object.hasOwn(fanoutBranchCases,q.selected)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!['four','overload','buffered'].includes(k))||![null,'loads','fanin','perfect'].includes(q.reflection))throw new RangeError('記録が不正です。');fanoutBranchEvaluate(q.selected,q.branches);let last=null;if(q.last!==null){if(!q.last)throw new RangeError('記録が不正です。');const r=fanoutBranchEvaluate(q.last.selected,q.last.branches);if(Object.keys(r).some(k=>q.last[k]!==r[k]))throw new RangeError('記録が不正です。');last={selected:q.last.selected,branches:[...q.last.branches],...r};}return {selected:q.selected,branches:[...q.branches],seen:[...q.seen],last,reflection:q.reflection};}
