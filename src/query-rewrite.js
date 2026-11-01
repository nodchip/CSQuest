export const rewriteLevel={id:'village-query-rewrite',number:'664',kind:'query-rewrite',name:'ふたつの台帳の順番',tag:'問合せ変換と外部結合',title:'条件を動かして台帳を調べよう',story:'村の台帳と薬の依頼を照らし合わせます。条件を適用する順序を変え、仕事の量と結果を比べましょう。'};
export const rewritePeople=[{id:'A',active:true},{id:'B',active:false},{id:'C',active:true},{id:'D',active:false}];
export const rewriteOrders=[{id:'甲',person:'A',ready:true},{id:'乙',person:'A',ready:false},{id:'丙',person:'B',ready:false},{id:'丁',person:'D',ready:true},{id:'戊',person:'D',ready:false}];
export const rewriteModes={innerEarly:'内部：先に利用中の人を絞る',innerLate:'内部：結合してから利用中の人を絞る',outerBefore:'左外部：先に準備済み依頼を絞る',outerOn:'左外部：結合時に準備済みを条件にする',outerWhere:'左外部：結合後に準備済みを絞る'};
function join(people,orders,outer,filterOn){let comparisons=0;const rows=[];for(const p of people){let matches=0;for(const o of orders){comparisons++;if(p.id===o.person&&(!filterOn||o.ready)){rows.push({person:p.id,order:o.id,active:p.active,ready:o.ready});matches++;}}if(outer&&!matches)rows.push({person:p.id,order:null,active:p.active,ready:null});}return {rows,comparisons};}
export function rewritePlan(mode){
 if(!Object.hasOwn(rewriteModes,mode))throw new RangeError('計画が不正です。');
 if(mode==='innerEarly'){const people=rewritePeople.filter(p=>p.active),result=join(people,rewriteOrders,false,false);return [{name:'利用中の人を先に絞る',rows:people.map(p=>p.id),comparisons:0},{name:'残った人と依頼を内部結合',rows:result.rows.map(r=>`${r.person}・${r.order}`),comparisons:result.comparisons},{name:'依頼番号だけを取り出す',rows:result.rows.map(r=>r.order),comparisons:result.comparisons}];}
 if(mode==='innerLate'){const result=join(rewritePeople,rewriteOrders,false,false),selected=result.rows.filter(r=>r.active);return [{name:'全員と依頼を内部結合',rows:result.rows.map(r=>`${r.person}・${r.order}`),comparisons:result.comparisons},{name:'利用中の人だけを残す',rows:selected.map(r=>`${r.person}・${r.order}`),comparisons:result.comparisons},{name:'依頼番号だけを取り出す',rows:selected.map(r=>r.order),comparisons:result.comparisons}];}
 if(mode==='outerBefore'){const orders=rewriteOrders.filter(o=>o.ready),result=join(rewritePeople,orders,true,false);return [{name:'準備済みの依頼を先に絞る',rows:orders.map(o=>o.id),comparisons:0},{name:'全員を残す左外部結合',rows:result.rows.map(r=>`${r.person}・${r.order??'なし'}`),comparisons:result.comparisons}];}
 if(mode==='outerOn'){const result=join(rewritePeople,rewriteOrders,true,true);return [{name:'準備済みを結合の条件にする',rows:result.rows.map(r=>`${r.person}・${r.order??'なし'}`),comparisons:result.comparisons},{name:'結合結果をそのまま使う',rows:result.rows.map(r=>`${r.person}・${r.order??'なし'}`),comparisons:result.comparisons}];}
 const result=join(rewritePeople,rewriteOrders,true,false);return [{name:'番号だけで左外部結合',rows:result.rows.map(r=>`${r.person}・${r.order??'なし'}`),comparisons:result.comparisons},{name:'結合後に準備済みだけを残す',rows:result.rows.filter(r=>r.ready===true).map(r=>`${r.person}・${r.order??'なし'}`),comparisons:result.comparisons}];
}
export function createRewriteQuest(){return {mode:'innerEarly',run:null,results:{},answerInner:null,answerOuter:null,checked:false,history:[]};}
export function rewriteAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=128)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,results:{...s.results},history:[...s.history],run:s.run?{...s.run}:null,checked:false};let message='';
 if(action.startsWith('mode:')&&Object.hasOwn(rewriteModes,action.slice(5))){n.mode=action.slice(5);message='調べる計画を選びました。実行中の計画は変わりません。';}
 else if(action==='start'){n.run={mode:s.mode,step:0};message='選んだ計画を始めます。';}
 else if(action==='step'&&s.run&&s.run.step<rewritePlan(s.run.mode).length){n.run.step++;const plan=rewritePlan(s.run.mode),part=plan[n.run.step-1];message=`${part.name}：${part.rows.length} 行、照合 ${part.comparisons} 回。`;if(n.run.step===plan.length)n.results[s.run.mode]=part;}
 else if(['inner:same','inner:different','inner:always'].includes(action)){n.answerInner=action.slice(6);message='内部結合の比較を選びました。';}
 else if(['outer:missing','outer:same','outer:all'].includes(action)){n.answerOuter=action.slice(6);message='左外部結合の比較を選びました。';}
 else if(action==='check'){n.checked=true;message='記録と答えを確認しました。';}
 else return {ok:false,message:'計画を開始し、示された段階を順に進めましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreRewriteQuest(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>128)throw new RangeError('途中記録が不正です。');let s=createRewriteQuest();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=rewriteAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function rewriteComplete(s){return Object.keys(rewriteModes).every(k=>Object.hasOwn(s.results,k))&&s.answerInner==='same'&&s.answerOuter==='missing'&&s.checked;}
