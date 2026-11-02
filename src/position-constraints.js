export const pbdLevel={id:'ruin-position-constraints',number:'851',kind:'position-constraints',name:'二本の光の糸を整える',tag:'位置ベースの制約',title:'粒の間隔をそろえよう',story:'遺跡の三つの光の粒を二本の糸がつないでいます。糸の長さを順に直し、直し方と繰り返しによる違いを調べましょう。'};
export const pbdCases={left:{name:'左の糸から',order:['left','right']},right:{name:'右の糸から',order:['right','left']}};
export const pbdLabels={left:'左の糸 A–B',right:'右の糸 B–C'};
export function pbdReplay(id,history){
 if(!Object.hasOwn(pbdCases,id)||!Array.isArray(history)||history.length>6)throw new RangeError('記録が不正です。');
 let positions=[0,3,6];const trace=[positions.slice()];
 for(const [i,action] of history.entries()){
  if(action!==pbdCases[id].order[i%2])throw new RangeError('糸の順序が不正です。');
  const [a,b,c]=positions;
  if(action==='left')positions=[a,a+2,c];
  else {const correction=(c-b-2)/2;positions=[a,b+correction,c-correction];}
  trace.push(positions.slice());
 }
 return {positions,lengths:[positions[1]-positions[0],positions[2]-positions[1]],trace};
}
export function pbdCreate(){return {selected:'left',histories:{left:[],right:[]},answer:null};}
export function pbdStep(q,action){const history=q.histories[q.selected];if(history.length>=6||action!==pbdCases[q.selected].order[history.length%2])return false;history.push(action);return true;}
export function pbdComplete(q){return Object.keys(pbdCases).every(id=>q.histories[id].length===6)&&q.answer==='interact';}
export function pbdRestore(q){if(!q||!Object.hasOwn(pbdCases,q.selected)||!q.histories||![null,'interact','independent','exact'].includes(q.answer))throw new RangeError('記録が不正です。');const n=pbdCreate();n.selected=q.selected;n.answer=q.answer;for(const id of Object.keys(pbdCases)){pbdReplay(id,q.histories[id]);n.histories[id]=[...q.histories[id]];}return n;}
