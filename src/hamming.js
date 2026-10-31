export const hammingLevel={id:'hamming-lanterns',number:'106',kind:'hamming',name:'七つの灯りの通信',tag:'誤り訂正符号',title:'乱れた灯りを直そう',story:'遠くの塔から届いた七つの灯りが乱れています。確認用の灯りを使って、違いを調べましょう。'};
export const hammingCases={single:{name:'１つ変わった灯り',errors:[6]},double:{name:'２つ変わった灯り',errors:[3,5]}};
export const parityGroups={1:[1,3,5,7],2:[2,3,6,7],4:[4,5,6,7]};
export function hammingEncode(data){if(!Array.isArray(data)||data.length!==4||data.some(x=>x!==0&&x!==1))throw new RangeError('データは４つのビットです。');const bits=[0,0,data[0],0,data[1],data[2],data[3]];for(const [key,group] of Object.entries(parityGroups))bits[Number(key)-1]=group.reduce((n,pos)=>n^bits[pos-1],0);return bits;}
export function hammingSyndrome(bits){if(!Array.isArray(bits)||bits.length!==7||bits.some(x=>x!==0&&x!==1))throw new RangeError('灯りは７つのビットです。');return Object.entries(parityGroups).reduce((sum,[key,group])=>sum+Number(key)*group.reduce((n,pos)=>n^bits[pos-1],0),0);}
export function flipHamming(bits,pos){hammingSyndrome(bits);if(!Number.isInteger(pos)||pos<1||pos>7)throw new RangeError('灯りの位置が不正です。');const next=bits.slice();next[pos-1]^=1;return next;}
export const original=hammingEncode([1,0,1,1]);
export function receivedHamming(id){if(!Object.hasOwn(hammingCases,id))throw new RangeError('未知の試練です。');return hammingCases[id].errors.reduce(flipHamming,original.slice());}
export function hammingTarget(id){const received=receivedHamming(id),syndrome=hammingSyndrome(received);return flipHamming(received,syndrome);}
export function hammingCorrect(id,choice){return choice.tested&&choice.bits.every((bit,i)=>bit===hammingTarget(id)[i])&&(id!=='double'||choice.answer==='uncertain');}
export function createHamming(){return {selected:'single',choices:Object.fromEntries(Object.keys(hammingCases).map(id=>[id,{bits:receivedHamming(id),tested:false,answer:''}]))};}
export function restoreHamming(saved){if(!saved||!Object.hasOwn(hammingCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');const result=createHamming();result.selected=saved.selected;for(const id of Object.keys(hammingCases)){const c=saved.choices[id];if(!c||typeof c.tested!=='boolean'||!['','uncertain','certain'].includes(c.answer))throw new RangeError('途中記録が不正です。');hammingSyndrome(c.bits);result.choices[id]={bits:c.bits.slice(),tested:c.tested,answer:c.answer};}return result;}
export function hammingComplete(state){return Object.keys(hammingCases).every(id=>hammingCorrect(id,state.choices[id]));}
