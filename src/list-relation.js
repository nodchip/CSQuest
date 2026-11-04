export const listRelationLevel={id:'ruins-list-relation',number:'1236',kind:'list-relation',name:'つながる荷札と戻る道',tag:'再帰的な関係と探索',title:'荷札をつなぎ、分け方を探そう',story:'荷札の列をつなぐ約束を使い、荷車を組み立てます。同じ約束を逆に使い、すべての分け方も探しましょう。'};
export const listRelationCases={join:'荷札をつなぐ',split:'分け方を探す'};
const left=['星','月'],right=['太陽'];
export function listRelationReplay(id,history){if(!Object.hasOwn(listRelationCases,id)||!Array.isArray(history)||history.length>12)throw new RangeError('記録が不正です。');let depth=0,phase='goal',result=null,frames=[],solutions=[],finished=false;const trace=[];for(const action of history){if(finished)throw new RangeError('完了後は操作できません。');if(id==='join'){
 if(action==='recurse'&&phase==='goal'&&depth<left.length){frames.push(left[depth]);depth++;}
 else if(action==='base'&&phase==='goal'&&depth===left.length){result=[...right];phase='return';}
 else if(action==='return'&&phase==='return'&&frames.length){result=[frames.pop(),...result];if(!frames.length)finished=true;}
 else throw new RangeError('つなぐ規則の順序が不正です。');
 }else{
 if(action==='base'&&phase==='goal'){solutions.push({first:left.slice(0,depth),second:left.slice(depth)});phase='answer';}
 else if(action==='backtrack'&&phase==='answer'){if(depth<left.length){depth++;phase='goal';}else finished=true;}
 else throw new RangeError('探索の順序が不正です。');
 }trace.push({action,depth,phase,frames:[...frames],result:result?[...result]:null,solutions:solutions.map(x=>({first:[...x.first],second:[...x.second]})),finished});}return {depth,phase,result,frames,solutions,finished,trace};}
export function listRelationCreate(){return {selected:'join',histories:{join:[],split:[]},reflection:null};}
export function listRelationStep(q,action){const h=q.histories[q.selected];try{listRelationReplay(q.selected,[...h,action]);h.push(action);return true;}catch{return false;}}
export function listRelationDone(q){return Object.keys(listRelationCases).every(k=>listRelationReplay(k,q.histories[k]).finished)&&q.reflection==='relation';}
export function listRelationRestore(q){if(!q||!Object.hasOwn(listRelationCases,q.selected)||!q.histories||![null,'relation','oneway'].includes(q.reflection))throw new RangeError('記録が不正です。');const histories={};for(const id of Object.keys(listRelationCases)){listRelationReplay(id,q.histories[id]);histories[id]=[...q.histories[id]];}return {selected:q.selected,histories,reflection:q.reflection};}
