export const chipFlowLevel={id:'workshop-chip-flow',number:'929',kind:'chip-flow',name:'刻限に間に合う小さな回路',tag:'回路の設計フロー',title:'小さな回路を配置し直す',story:'工房の新しい回路は、正しい値を出しても刻限に間に合うとは限りません。試験から配置・再検査まで進めましょう。'};
export const chipFlowVariants={compact:{name:'小さな部品',area:2,gateDelay:3},fast:{name:'速い部品',area:4,gateDelay:2}};
export const chipFlowLayouts={near:{name:'短い配線',wireDelay:1},far:{name:'長い配線',wireDelay:3}};
export const chipFlowTruth=[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>({a,b,out:a&b}));
export function chipFlowState(history){
 if(!Array.isArray(history)||history.length>30)throw new RangeError('記録が不正です。');
 let variant='compact',layout='far',simulated=false,netlist=false,placed=false,routed=false,timing=null,seenTimingFailure=false,finished=false;
 for(const a of history){if(finished)throw new RangeError('試行は終了しています。');
  if(a==='variant:compact'||a==='variant:fast'){const v=a.slice(8);if(v===variant)throw new RangeError('既に選択されています。');variant=v;simulated=netlist=placed=routed=false;timing=null;}
  else if(a==='layout:near'||a==='layout:far'){const l=a.slice(7);if(l===layout)throw new RangeError('既に選択されています。');layout=l;placed=routed=false;timing=null;}
  else if(a==='simulate'&&!simulated){simulated=true;}
  else if(a==='synthesize'&&simulated&&!netlist){netlist=true;}
  else if(a==='place'&&netlist&&!placed){placed=true;}
  else if(a==='route'&&placed&&!routed){routed=true;}
  else if(a==='timing'&&routed&&timing===null){const v=chipFlowVariants[variant],l=chipFlowLayouts[layout],delay=v.gateDelay+l.wireDelay;timing={delay,area:v.area,delayOk:delay<=5,areaOk:v.area<=3};if(variant==='compact'&&layout==='far'&&!timing.delayOk)seenTimingFailure=true;}
  else if(a==='finish'&&timing&&timing.delayOk&&timing.areaOk&&seenTimingFailure){finished=true;}
  else throw new RangeError('今はその操作をできません。');
 }
 return {variant,layout,simulated,netlist,placed,routed,timing,seenTimingFailure,finished};
}
export function chipFlowCreate(){return {history:[],reflection:null};}
export function chipFlowStep(q,a){try{chipFlowState([...q.history,a]);q.history.push(a);return true;}catch{return false;}}
export function chipFlowComplete(q){return chipFlowState(q.history).finished&&q.reflection==='physical';}
export function chipFlowRestore(q){if(!q||![null,'physical','functional','guaranteed'].includes(q.reflection))throw new RangeError('記録が不正です。');chipFlowState(q.history);return {history:[...q.history],reflection:q.reflection};}
