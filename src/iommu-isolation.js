export const iommuLevel={id:'workshop-dma-isolation',number:'828',kind:'iommu-isolation',name:'荷車の通れる記憶の門',tag:'DMA と仮想機械の隔離',title:'装置が読める記憶の範囲を確かめよう',story:'二つの仮想工房が別々の記憶を使っています。A の工房に渡した荷車がどの記憶を読めるか、門の設定を比べましょう。'};
export const iommuModes={none:'装置用の門なし',wide:'門はあるが広く許可',narrow:'門で A の記憶だけ許可'};
export const iommuAddresses={x:'装置の番地 X',y:'装置の番地 Y'};
export function iommuResult(mode,address){if(!Object.hasOwn(iommuModes,mode)||!Object.hasOwn(iommuAddresses,address))throw new RangeError('場面が不正です。');if(address==='x')return 'A';return mode==='narrow'?'blocked':'B';}
export function iommuCreate(){return {mode:'none',address:'x',done:[],answer:null};}
export function iommuStep(q,guess){const result=iommuResult(q.mode,q.address),key=`${q.mode}:${q.address}`;if(!['A','B','blocked'].includes(guess))throw new RangeError('読める記憶または拒否を予想しましょう。');if(guess!==result)throw new RangeError('装置の番地と門の対応表を確かめましょう。');if(!q.done.includes(key))q.done.push(key);}
export function iommuComplete(q){return Object.keys(iommuModes).every(m=>Object.keys(iommuAddresses).every(a=>q.done.includes(`${m}:${a}`)))&&q.answer==='mapping';}
export function iommuRestore(q){const keys=Object.keys(iommuModes).flatMap(m=>Object.keys(iommuAddresses).map(a=>`${m}:${a}`));if(!q||!Object.hasOwn(iommuModes,q.mode)||!Object.hasOwn(iommuAddresses,q.address)||!Array.isArray(q.done)||new Set(q.done).size!==q.done.length||q.done.some(x=>!keys.includes(x))||![null,'mapping','always','cpu'].includes(q.answer))throw new RangeError('記録が不正です。');return {mode:q.mode,address:q.address,done:[...q.done],answer:q.answer};}
