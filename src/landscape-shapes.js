export const landscapeCases={ridge:'第一の地形',saddle:'第二の地形'};
export const landscapeMoves={east:{name:'東',x:1,y:0},west:{name:'西',x:-1,y:0},north:{name:'北',x:0,y:1},south:{name:'南',x:0,y:-1},diagonal:{name:'北東',x:1,y:1}};
export function landscapeScore(id,x,y){if(!Object.hasOwn(landscapeCases,id)||!Number.isFinite(x)||!Number.isFinite(y))throw new RangeError('地形か位置が不正です。');return id==='ridge'?8-2*(x-y)**2+x+y:8+x*x-y*y;}
export function createLandscape(){return {selected:'ridge',seen:{ridge:[],saddle:[]},answer:{ridge:null,saddle:null},checked:{ridge:false,saddle:false},last:null,history:[]};}
export function landscapeAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'記録がいっぱいです。この試験を最初からやり直してください。'};
 const n={...s,seen:{ridge:[...s.seen.ridge],saddle:[...s.seen.saddle]},answer:{...s.answer},checked:{...s.checked},history:[...s.history]};let message='';
 if(action.startsWith('case:')&&Object.hasOwn(landscapeCases,action.slice(5))){n.selected=action.slice(5);n.last=null;message='地形を選びました。';}
 else if(action.startsWith('look:')&&Object.hasOwn(landscapeMoves,action.slice(5))){const move=action.slice(5),p=landscapeMoves[move];if(!n.seen[s.selected].includes(move))n.seen[s.selected].push(move);n.last={id:s.selected,move,score:landscapeScore(s.selected,p.x,p.y)};n.checked[s.selected]=false;message='隣の見晴らしを調べました。';}
 else if(['answer:ridge','answer:saddle','answer:peak'].includes(action)){n.answer[s.selected]=action.slice(7);n.checked[s.selected]=false;message='地形の特徴を選びました。';}
 else if(action==='check'){n.checked[s.selected]=true;message='観察と答えを確かめました。';}
 else return {ok:false,message:'観察する方向を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function landscapeCorrect(s,id){return s.checked[id]&&s.answer[id]===id&&Object.keys(landscapeMoves).every(m=>s.seen[id].includes(m));}
export function landscapeComplete(s){return Object.keys(landscapeCases).every(id=>landscapeCorrect(s,id));}
export function restoreLandscape(s){if(!s||!Array.isArray(s.history)||s.history.length>100)throw new RangeError('途中記録が不正です。');let n=createLandscape();for(const action of s.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=landscapeAct(n,action);if(!r.ok)throw new RangeError('途中記録が不正です。');n=r.state;}return n;}
