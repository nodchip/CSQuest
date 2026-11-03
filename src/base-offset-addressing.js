export const baseOffsetLevel={id:'workshop-base-offset',number:'1087',kind:'base-offset',name:'動かせる薬草棚の番地',tag:'基底とオフセット',title:'移動した棚を探す',story:'薬草棚が移動しました。基準の番地と差を組み合わせ、必要な札を探しましょう。'};
export const baseChoices=[100,104,200,204];
export const offsetChoices=[-4,0,2,4,8,12];
export const baseMemory={100:11,104:22,108:33,200:44,204:55,208:66};
export const baseRequired=['100:4','200:4','104:-4','204:-4','100:2','100:12'];
export function baseOffsetResult(base,offset){if(!baseChoices.includes(base)||!offsetChoices.includes(offset))throw new RangeError('番地の条件が不正です');const address=base+offset;if(address%4!==0)return {address,kind:'unaligned',value:null};if(!Object.hasOwn(baseMemory,address))return {address,kind:'unmapped',value:null};return {address,kind:'value',value:baseMemory[address]};}
export function baseOffsetCreate(){return {base:100,offset:0,guess:null,seen:[],reflection:null,alignment:null};}
export function baseOffsetRestore(q){
 const keys=baseChoices.flatMap(b=>offsetChoices.map(o=>`${b}:${o}`));if(!q||!baseChoices.includes(q.base)||!offsetChoices.includes(q.offset)||![null,'11','22','33','44','55','66','unaligned','unmapped'].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>24||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'byte','element'].includes(q.reflection)||![null,'model','always'].includes(q.alignment))throw new RangeError('番地の記録が不正です');return {...q,seen:[...q.seen]};
}
export function baseOffsetDone(q){return baseRequired.every(k=>q.seen.includes(k))&&q.reflection==='byte'&&q.alignment==='model';}
