export const iteratorLevel={id:'archive-iterator-trail',number:'583',kind:'iterator-trail',name:'二人の巻物しおり',tag:'コレクションと反復子',title:'別々のしおりで依頼をたどろう',story:'書庫の依頼列を二人の精霊が確認します。別々のしおりを進め、取り消し後の読み直しを試しましょう。'};
export const iteratorActions={nextA:'A が次を読む',nextB:'B が次を読む',removeA:'A が最後に読んだ依頼を消す',removeB:'B が最後に読んだ依頼を消す',restartA:'A のしおりを作り直す',restartB:'B のしおりを作り直す'};
const itinerary=['nextA:A','nextA:B','nextB:A','removeA:B','nextA:C','nextB:stale','restartB:ok','nextB:A','nextB:C'];
export function createIteratorTrail(){return {items:['A','B','C'],version:0,iterators:{A:{cursor:0,last:null,version:0},B:{cursor:0,last:null,version:0}},stage:0,history:[],message:'A と B のしおりを、同じ依頼列の先頭に作りました。',answer:null,checked:false};}
export function iteratorTrailStep(s,action){
 if(!Object.hasOwn(iteratorActions,action)||s.stage>=itinerary.length||s.history.length>=100)throw new RangeError('操作できません。');
 const who=action.at(-1),n={...s,items:s.items.slice(),iterators:{A:{...s.iterators.A},B:{...s.iterators.B}},history:[...s.history,action],checked:false},it=n.iterators[who];let outcome;
 if(action.startsWith('restart')){it.cursor=0;it.last=null;it.version=n.version;outcome='ok';n.message=`${who} のしおりを、現在の列の先頭に作り直しました。`;}
 else if(it.version!==n.version){outcome='stale';n.message=`${who} のしおりを作った後に列が変わったため、この模型では操作できません。作り直してください。`;}
 else if(action.startsWith('next')){if(it.cursor>=n.items.length){outcome='end';n.message=`${who} は列の終わりです。`;}else{it.last=it.cursor;outcome=n.items[it.cursor++];n.message=`${who} が依頼 ${outcome} を読みました。`;}}
 else if(it.last===null){outcome='no-last';n.message=`${who} は次を読む前、または同じ読取りの削除後なので消せません。`;}
 else{outcome=n.items[it.last];n.items.splice(it.last,1);it.cursor--;it.last=null;n.version++;it.version=n.version;n.message=`${who} が最後に読んだ依頼 ${outcome} を消しました。他の古いしおりは作り直す必要があります。`;}
 if(`${action}:${outcome}`===itinerary[s.stage])n.stage++;return n;
}
export function iteratorTrailComplete(s){return s.stage===itinerary.length&&s.answer==='independent'&&s.checked;}
export function restoreIteratorTrail(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100||![null,'independent','one','guarantee'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');let s=createIteratorTrail();for(const action of saved.history)s=iteratorTrailStep(s,action);s.answer=saved.answer;s.checked=saved.checked;return s;}
