export const mediumLevel={id:'forest-shared-medium',number:'275',kind:'shared-medium',name:'二人で使う伝令路',tag:'共有媒体と衝突',title:'同じ刻の伝令を調べよう',story:'二人の伝令が同じ道を使い、村へ知らせを届けます。'};
export function mediumRun(history){
 if(!Array.isArray(history)||history.length>20)throw new RangeError('記録が不正です。');
 const pending={a:true,b:true},events=[];
 for(const action of history){if(!action||typeof action.a!=='boolean'||typeof action.b!=='boolean'||action.a&&!pending.a||action.b&&!pending.b)throw new RangeError('送る伝令がありません。');
  const result=action.a&&action.b?'collision':action.a?'a':action.b?'b':'idle';if(result==='a'||result==='b')pending[result]=false;
  events.push({a:action.a,b:action.b,result,pending:{...pending}});
 }
 return {pending,events};
}
export function createMedium(){return {history:[],a:false,b:false};}
export function mediumComplete(s){const r=mediumRun(s.history);return !r.pending.a&&!r.pending.b&&r.events.some(e=>e.result==='collision');}
export function restoreMedium(saved){if(!saved||typeof saved.a!=='boolean'||typeof saved.b!=='boolean')throw new RangeError('途中記録が不正です。');const r=mediumRun(saved.history);if(saved.a&&!r.pending.a||saved.b&&!r.pending.b)throw new RangeError('途中記録が不正です。');return {history:saved.history.map(a=>({a:a.a,b:a.b})),a:saved.a,b:saved.b};}
