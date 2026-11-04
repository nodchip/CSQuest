export const autonomyEthicsLevel={id:'guild-autonomy-ethics',number:'1280',kind:'autonomy-ethics',name:'自動人形と人の判断',tag:'自律兵器と倫理',title:'誰が何を決める？',story:'ギルドの評議会は、力を使う装置に判断を任せることについて資料を集めています。役割と、提案されている制限を読み分けましょう。'};
export const autonomyCards={
 remote:{name:'遠隔操作の例',text:'人が個々の対象を見定め、力を使うかを決め、遠くから装置を操作します。',answer:'human'},
 automatic:{name:'起動後に自動選択する例',text:'人が装置を起動した後、装置がセンサー情報に応じて個々の対象を選び、人の個別介入なしに力を使います。',answer:'machine'},
 unpredictable:{name:'予測できない影響',text:'赤十字国際委員会（ICRC）の2021年の見解は、影響を十分に理解・予測・説明できない自律兵器について、どうするよう提案していますか？',answer:'prohibit'},
 persons:{name:'人を対象とする使用',text:'ICRC の2021年の見解は、人に対して力を使うよう設計・使用される自律兵器について、どうするよう提案していますか？',answer:'prohibit'},
 other:{name:'それ以外の自律兵器',text:'ICRC の2021年の見解は、提案する禁止の対象ではない自律兵器について、どうするよう提案していますか？',answer:'regulate'}
};
export const autonomyChoices={human:'人が個々の対象と使用を決める遠隔操作',machine:'起動後に装置が対象を選んで力を使う',prohibit:'新たな禁止を提案する',regulate:'制限と人の監督を含む規制を提案する'};
export function autonomyCreate(){return {selected:'remote',opened:[],matched:[],choice:null,reflection:null};}
export function autonomyOpen(q,id){if(!Object.hasOwn(autonomyCards,id))return false;q.selected=id;q.choice=null;if(!q.opened.includes(id))q.opened.push(id);return true;}
export function autonomyCheck(q){if(!q.opened.includes(q.selected)||!Object.hasOwn(autonomyChoices,q.choice))return null;const ok=autonomyCards[q.selected].answer===q.choice;if(ok&&!q.matched.includes(q.selected))q.matched.push(q.selected);return ok;}
export function autonomyDone(q){return Object.keys(autonomyCards).every(k=>q.matched.includes(k))&&q.reflection==='position';}
export function autonomyRestore(q){if(!q||!Object.hasOwn(autonomyCards,q.selected)||![null,...Object.keys(autonomyChoices)].includes(q.choice)||![null,'position','law'].includes(q.reflection)||!Array.isArray(q.opened)||!Array.isArray(q.matched)||new Set(q.opened).size!==q.opened.length||new Set(q.matched).size!==q.matched.length||q.opened.some(k=>!Object.hasOwn(autonomyCards,k))||q.matched.some(k=>!q.opened.includes(k)))throw new RangeError('記録が不正です。');return {selected:q.selected,opened:[...q.opened],matched:[...q.matched],choice:q.choice,reflection:q.reflection};}
