export const deviceLevel={id:'workshop-qubit-devices',number:'1216',kind:'qubit-devices',name:'三つの量子工房',tag:'量子ビットの物理方式',title:'三つの装置の道具をそろえよう',story:'精霊が量子の灯りを扱う三つの工房を修理しています。それぞれの台材に合う準備、制御、読取りをそろえましょう。'};
export const deviceCases={
 circuit:{name:'超伝導回路の工房',carrier:'チップ上の超伝導回路の２つのエネルギー状態',setup:'cold',control:'microwave',readout:'resonator'},
 ion:{name:'捕捉イオンの工房',carrier:'真空中に閉じ込めたイオンの２つの内部状態',setup:'trap',control:'laser',readout:'fluorescence'},
 photon:{name:'光子の工房',carrier:'１個の光子の２つの偏光状態',setup:'optics',control:'polarization',readout:'photon'}
};
export const deviceChoices={
 setup:{cold:'極低温の冷却器',trap:'真空容器と電磁場の罠',optics:'光を導く光学系'},
 control:{microwave:'マイクロ波の制御信号',laser:'レーザーによる状態操作',polarization:'偏光を変える光学素子'},
 readout:{resonator:'共振器からのマイクロ波の応答',fluorescence:'状態に応じた蛍光の検出',photon:'偏光を分けて単一光子を検出'}
};
export function deviceCreate(){return {selected:'circuit',choices:Object.fromEntries(Object.keys(deviceCases).map(k=>[k,{setup:null,control:null,readout:null}])),seen:[],reflection:null};}
export function deviceCorrect(q,id=q.selected){return Object.keys(deviceChoices).every(k=>q.choices[id][k]===deviceCases[id][k]);}
export function deviceCheck(q){const ok=deviceCorrect(q);if(ok&&!q.seen.includes(q.selected))q.seen.push(q.selected);return ok;}
export function deviceDone(q){return Object.keys(deviceCases).every(k=>q.seen.includes(k)&&deviceCorrect(q,k))&&q.reflection==='examples';}
export function deviceRestore(q){
 if(!q||!Object.hasOwn(deviceCases,q.selected)||!q.choices||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(deviceCases,k))||![null,'examples','exclusive'].includes(q.reflection))throw new RangeError('記録が不正です。');
 const out=deviceCreate();out.selected=q.selected;out.seen=[...q.seen];out.reflection=q.reflection;
 for(const id of Object.keys(deviceCases))for(const field of Object.keys(deviceChoices)){const value=q.choices[id]?.[field];if(!(value===null||Object.hasOwn(deviceChoices[field],value)))throw new RangeError('記録が不正です。');out.choices[id][field]=value;}
 return out;
}
