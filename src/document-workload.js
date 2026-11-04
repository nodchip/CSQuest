const original=[{id:'A',village:'北',delivery:{count:2}},{id:'B',village:'南',delivery:{count:3}},{id:'C',village:'北',delivery:{count:1}},{id:'D',village:'西',delivery:{count:4}}];
export const documentActions={update:'B の束数を４に更新',insert:'E に２束の記録を追加',remove:'C の記録を削除',refresh:'集計の控えを作り直す'};
export const documentScopes={all:'全村',north:'北村',south:'南村',west:'西村'};
export const documentGuesses=[0,1,2,3,4,5,9,10,11,12,13];
export function documentTotal(documents,scope='all'){
 if(!Object.hasOwn(documentScopes,scope))throw new RangeError('集計の範囲が不正です。');
 const villages={north:'北',south:'南',west:'西'};
 return documents.reduce((sum,d)=>sum+(scope==='all'||d.village===villages[scope]?d.delivery.count:0),0);
}
export function createDocumentWorkload(){return {documents:structuredClone(original),summary:10,history:[],scope:'all',guess:null,checked:false};}
export function documentWorkloadStep(state,action){
 if(!Object.hasOwn(documentActions,action)||state.history.length>=16)return {ok:false,message:'これ以上この操作はできません。'};
 const docs=structuredClone(state.documents);
 if(action==='update'){const b=docs.find(d=>d.id==='B');if(b.delivery.count===4)return {ok:false,message:'B はすでに４束です。'};b.delivery.count=4;}
 if(action==='insert'){if(docs.some(d=>d.id==='E'))return {ok:false,message:'E はすでにあります。'};docs.push({id:'E',village:'北',delivery:{count:2}});}
 if(action==='remove'){const i=docs.findIndex(d=>d.id==='C');if(i<0)return {ok:false,message:'C はすでにありません。'};docs.splice(i,1);}
 const summary=action==='refresh'?documentTotal(docs):state.summary;
 return {ok:true,state:{documents:docs,summary,history:[...state.history,action],scope:state.scope,guess:null,checked:false}};
}
export function restoreDocumentWorkload(saved){
 if(saved===undefined)return createDocumentWorkload();
 if(!saved||!Array.isArray(saved.history)||saved.history.length>16||!(saved.guess===null||documentGuesses.includes(saved.guess))||typeof saved.checked!=='boolean'||(saved.checked&&saved.guess===null)||!(saved.scope===undefined||Object.hasOwn(documentScopes,saved.scope)))throw new RangeError('台帳の記録が不正です。');
 let state=createDocumentWorkload();for(const action of saved.history){const r=documentWorkloadStep(state,action);if(!r.ok)throw new RangeError('台帳の履歴が不正です。');state=r.state;}
 state.scope=saved.scope??'all';state.guess=saved.guess;state.checked=saved.checked;return state;
}
