export const switchLevel={id:'forest-switch-learning',number:'273',kind:'switch-learning',name:'道を覚える中継器',tag:'スイッチの学習と転送',title:'宛先の場所を覚えよう',story:'三つの口を持つ中継器が、伝令の送り元から行き先を覚えます。'};
export const switchActions={ab:'ＡからＢへ送る',ba:'ＢからＡへ送る',move:'Ａを口３へ移動'};
export function switchRun(history){
 if(!Array.isArray(history)||history.length>40||!history.every(a=>Object.hasOwn(switchActions,a)))throw new RangeError('操作が不正です。');
 let location={A:1,B:2},table={A:null,B:null},stage=0;const events=[];
 for(const action of history){if(action==='move'){location={...location,A:3};if(stage===2)stage=3;events.push({action,location:{...location},table:{...table}});continue;}
  const src=action==='ab'?'A':'B',dst=src==='A'?'B':'A',ingress=location[src];table[src]=ingress;
  const known=table[dst],ports=known===null?[1,2,3].filter(p=>p!==ingress):known===ingress?[]:[known],delivered=ports.includes(location[dst]);
  const event={action,ingress,known,ports,delivered,location:{...location},table:{...table}};events.push(event);
  if(stage===0&&action==='ab'&&known===null&&delivered)stage=1;
  else if(stage===1&&action==='ba'&&known===1&&delivered)stage=2;
  else if(stage===3&&action==='ba'&&known===1&&!delivered)stage=4;
  else if(stage===4&&action==='ab'&&ingress===3&&known===2&&delivered)stage=5;
  else if(stage===5&&action==='ba'&&known===3&&delivered)stage=6;
 }
 return {location,table,stage,events};
}
export function createSwitch(){return {history:[]};}
export function switchComplete(s){return switchRun(s.history).stage===6;}
export function restoreSwitch(saved){if(!saved)throw new RangeError('途中記録が不正です。');switchRun(saved.history);return {history:[...saved.history]};}
