export const ovenFeedbackLevel={id:'workshop-oven-feedback',number:'921',kind:'oven-feedback',name:'冷たい風と薬窯',tag:'閉ループ制御',title:'薬窯の温度を見守る',story:'温度計をつないだ薬窯に冷たい風が吹き込みます。二つの運転方針で温度の変化を追いましょう。'};
export const ovenFeedbackModes={fixed:'加熱し続ける',feedback:'温度を見て切り替える'};
export function ovenFeedbackState(mode,history){
 if(!Object.hasOwn(ovenFeedbackModes,mode)||!Array.isArray(history)||history.length>6)throw new RangeError('記録が不正です。');
 let temperature=18;const rows=[];
 for(const action of history){const correct=mode==='fixed'?'heat':temperature<20?'heat':'off';if(action!==correct)throw new RangeError('方針に合わない操作です。');const before=temperature,step=rows.length+1,disturbance=step===3?-2:0;temperature+=action==='heat'?2:-1;temperature+=disturbance;rows.push({step,before,raw:2*before+10,action,disturbance,after:temperature});}
 return {temperature,raw:2*temperature+10,rows,done:rows.length===6};
}
export function ovenFeedbackCreate(){return {selected:'fixed',histories:{fixed:[],feedback:[]},reflection:null};}
export function ovenFeedbackStep(q,action){if(!['heat','off'].includes(action))throw new RangeError('操作が不正です。');const h=q.histories[q.selected];try{ovenFeedbackState(q.selected,[...h,action]);h.push(action);return true;}catch{return false;}}
export function ovenFeedbackComplete(q){return Object.keys(ovenFeedbackModes).every(mode=>ovenFeedbackState(mode,q.histories[mode]).done)&&q.reflection==='measured';}
export function ovenFeedbackRestore(q){if(!q||!Object.hasOwn(ovenFeedbackModes,q.selected)||!q.histories||![null,'measured','perfect','no-effect'].includes(q.reflection))throw new RangeError('記録が不正です。');const histories={};for(const mode of Object.keys(ovenFeedbackModes)){ovenFeedbackState(mode,q.histories[mode]);histories[mode]=[...q.histories[mode]];}return {selected:q.selected,histories,reflection:q.reflection};}
