export const jointMapLevel={id:'forest-joint-map',number:'1283',kind:'joint-map',name:'二つの記憶の地図',tag:'位置と地図の同時推定',title:'場所と印を一緒に考える',story:'霧の中で人形は、自分の位置と赤い印の場所の組を二通り覚えています。道を渡り、灯りを観測して両方の見込みを更新しましょう。'};
export const jointActions=['observe','move','observe'];
export function jointReplay(history){if(!Array.isArray(history)||history.length>3||history.some((a,i)=>a!==jointActions[i]))throw new RangeError('操作の順序が不正です。');let a=1,b=1,moved=false;for(const action of history){if(action==='move')moved=true;else{a*=moved?1:3;b*=moved?3:1;}}const total=a+b,poseA=moved?'right':'left',poseB=moved?'left':'right',leftWeight=poseA==='left'?a:b;return {a,b,total,poseA,poseB,left:leftWeight/total,redRight:a/total,joint:poseA==='left'?a/total:0,product:leftWeight*a/(total*total)};}
export function jointCreate(){return {history:[],answer:null,limit:null};}
export function jointAct(q,action){const next=[...q.history,action];try{const state=jointReplay(next);q.history=next;return state;}catch{return null;}}
export function jointDone(q){return q.history.length===3&&q.answer==='impossible'&&q.limit==='model';}
export function jointRestore(q){if(!q||![null,'impossible','independent'].includes(q.answer)||![null,'model','exact'].includes(q.limit))throw new RangeError('記録が不正です。');jointReplay(q.history);return {history:[...q.history],answer:q.answer,limit:q.limit};}
