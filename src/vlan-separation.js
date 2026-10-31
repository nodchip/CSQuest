export const vlanLevel={id:'forest-vlan-separation',number:'274',kind:'vlan-separation',name:'二色に分ける中継器',tag:'VLAN と転送範囲',title:'伝令の届く範囲を分けよう',story:'一台の中継器の口を二つの組に分け、伝令の届く範囲を調べます。'};
export const vlanActions={ac:'ＡからＣへ送る',ba:'ＢからＡへ送る',toggle:'Ｃの組を切り替える'};
export function vlanRun(history){
 if(!Array.isArray(history)||history.length>40||!history.every(a=>Object.hasOwn(vlanActions,a)))throw new RangeError('操作が不正です。');
 let cGroup='blue',table={blue:{},red:{}},stage=0;const events=[];
 for(const action of history){if(action==='toggle'){cGroup=cGroup==='blue'?'red':'blue';delete table.blue.C;delete table.red.C;if(stage===1&&cGroup==='red')stage=2;events.push({action,cGroup});continue;}
  const src=action==='ac'?'A':'B',dst=action==='ac'?'C':'A',ports={A:1,B:2,C:3},groups={A:'blue',B:'blue',C:cGroup},group=groups[src],ingress=ports[src];table[group][src]=ingress;
  const known=table[group][dst]??null,out=known===null?Object.keys(ports).filter(k=>groups[k]===group&&ports[k]!==ingress).map(k=>ports[k]):known===ingress?[]:[known];
  const delivered=out.includes(ports[dst]);events.push({action,group,known,out,delivered,cGroup});
  if(stage===0&&action==='ac'&&delivered)stage=1;else if(stage===2&&action==='ac'&&!delivered&&cGroup==='red')stage=3;else if(stage===3&&action==='ba'&&delivered&&cGroup==='red')stage=4;
 }
 return {cGroup,table,stage,events};
}
export function createVlan(){return {history:[]};}
export function vlanComplete(s){return vlanRun(s.history).stage===4;}
export function restoreVlan(saved){if(!saved)throw new RangeError('途中記録が不正です。');vlanRun(saved.history);return {history:[...saved.history]};}
