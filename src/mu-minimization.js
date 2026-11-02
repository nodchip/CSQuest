export const muLevel={id:'archive-mu-minimization',number:'864',kind:'mu-minimization',name:'最初に光る印の探索',tag:'μ 演算と部分関数',title:'最も小さい光の番号を探そう',story:'鑑定士は巻物ごとに、光る印の最も小さい番号を求めています。０から順に印を調べ、見つからない場合も考えましょう。'};
export const muCases={moon:{name:'月の巻物',zeros:[2,5]},star:{name:'星の巻物',zeros:[6]},mist:{name:'霧の巻物',zeros:[]}};
export function muReplay(id,steps){
 if(!Object.hasOwn(muCases,id)||!Number.isInteger(steps)||steps<0||steps>8)throw new RangeError('記録が不正です。');
 const first=muCases[id].zeros[0];if(first!==undefined&&steps>first+1)throw new RangeError('発見後は調べられません。');
 const observations=Array.from({length:steps},(_,y)=>({y,value:muCases[id].zeros.includes(y)?0:1}));const found=first!==undefined&&steps===first+1?first:null;
 return {observations,found,finished:found!==null||steps===8};
}
export function muCreate(){return {selected:'moon',steps:{moon:0,star:0,mist:0},answers:{moon:null,star:null,mist:null},reflection:null};}
export function muStep(q){if(muReplay(q.selected,q.steps[q.selected]).finished)throw new RangeError('この観察は終了しました。');q.steps[q.selected]++;}
export function muComplete(q){return Object.keys(muCases).every(id=>muReplay(id,q.steps[id]).finished&&q.answers[id]===({moon:'2',star:'6',mist:'unknown'})[id])&&q.reflection==='partial';}
export function muRestore(q){
 if(!q||!Object.hasOwn(muCases,q.selected)||!q.steps||!q.answers||![null,'partial','always','bounded'].includes(q.reflection))throw new RangeError('記録が不正です。');const copy=muCreate();copy.selected=q.selected;copy.reflection=q.reflection;
 for(const id of Object.keys(muCases)){muReplay(id,q.steps[id]);if(![null,'2','5','6','unknown'].includes(q.answers[id]))throw new RangeError('回答が不正です。');copy.steps[id]=q.steps[id];copy.answers[id]=q.answers[id];}
 return copy;
}
