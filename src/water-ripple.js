export const rippleLevel={id:'ruin-water-ripple',number:'852',kind:'water-ripple',name:'水鏡を渡る波紋',tag:'高さ場と波の伝播',title:'水面の次の高さを探ろう',story:'遺跡の水鏡に落ちた雫が波紋を広げます。前と今の水面から、次の刻みの高さを予想しましょう。'};
export const rippleCases={center:{name:'中央に雫',initial:[0,0,4,0,0]},left:{name:'左に雫',initial:[0,4,0,0,0]}};
export const rippleValues=[-4,-3,-2,-1,0,1,2,3,4];
function validRow(row){return Array.isArray(row)&&row.length===5&&row.every(Number.isFinite)&&row[0]===0&&row[4]===0;}
// Central differences for h_tt = c² h_xx, with (c dt/dx)² = 1/2 and fixed endpoints.
export function rippleNext(previous,current){if(!validRow(previous)||!validRow(current))throw new RangeError('水面が不正です。');return [0,...[1,2,3].map(i=>2*current[i]-previous[i]+(current[i-1]-2*current[i]+current[i+1])/2),0];}
export function rippleReplay(id,history){
 if(!Object.hasOwn(rippleCases,id)||!Array.isArray(history)||history.length>3)throw new RangeError('記録が不正です。');
 let previous=[...rippleCases[id].initial],current=[...previous];const rows=[current];
 for(const row of history){const next=rippleNext(previous,current);if(!validRow(row)||!row.every((v,i)=>v===next[i]))throw new RangeError('水面の記録が不正です。');previous=current;current=next;rows.push(current);}
 return {previous,current,rows};
}
export function rippleCreate(){return {selected:'center',trials:Object.fromEntries(Object.keys(rippleCases).map(id=>[id,{history:[],guess:[null,null,null]}])),answer:null};}
export function rippleStep(q){const t=q.trials[q.selected];if(t.history.length>=3||!t.guess.every(v=>rippleValues.includes(v)))return false;const s=rippleReplay(q.selected,t.history),next=rippleNext(s.previous,s.current);if(!t.guess.every((v,i)=>v===next[i+1]))return false;t.history.push(next);t.guess=[null,null,null];return true;}
export function rippleComplete(q){return Object.keys(rippleCases).every(id=>q.trials[id].history.length===3)&&q.answer==='both';}
export function rippleRestore(q){if(!q||!Object.hasOwn(rippleCases,q.selected)||!q.trials||![null,'both','now','water'].includes(q.answer))throw new RangeError('記録が不正です。');const n=rippleCreate();n.selected=q.selected;n.answer=q.answer;for(const id of Object.keys(rippleCases)){const t=q.trials[id];if(!t||!Array.isArray(t.guess)||t.guess.length!==3||!t.guess.every(v=>v===null||rippleValues.includes(v)))throw new RangeError('予想が不正です。');rippleReplay(id,t.history);if(t.history.length===3&&t.guess.some(v=>v!==null))throw new RangeError('予想が不正です。');n.trials[id]={history:t.history.map(row=>[...row]),guess:[...t.guess]};}return n;}
