export const branchWorkshopLevel={id:'guild-release-branches',number:'1014',kind:'release-branches',name:'工房の二つの巻物',tag:'版管理・分岐・リリース',title:'修正を二つの巻物に届けよう',story:'ギルドは新しい機能を作りながら、公開中の巻物の不具合を直します。版の分岐と目印をたどりましょう。'};
export const branchWorkshopActions={branch:'公開保守の枝を作る',oldTag:'元の版に v1.0 の目印を付ける',feature:'本流に新機能 B を追加',fix:'保守の枝に修正 R を追加',patchTag:'修正に v1.1 の目印を付ける',test:'修正 R を試験する','predict:old':'v1.0 は修正を含まない','predict:oldwrong':'v1.0 は修正を含む','predict:patch':'v1.1 は修正を含む','predict:patchwrong':'v1.1 は修正を含まない',inspectOld:'v1.0 の内容を確認',inspectPatch:'v1.1 の内容を確認',inspectBefore:'統合前の本流を確認',merge:'修正の枝を本流へ統合',inspectAfter:'統合後の本流を確認'};
export function branchWorkshopInitial(){return {main:'A',release:null,oldTag:null,patchTag:null,parents:{A:[]},tested:null,predictions:{old:false,patch:false},inspected:{old:false,patch:false,before:false,after:false},message:'まず公開保守の枝を作りましょう。'};}
export function branchWorkshopContains(s,commit,ancestor){if(!Object.hasOwn(s.parents,commit)||!Object.hasOwn(s.parents,ancestor))throw new RangeError('未知の版');const todo=[commit],seen=new Set();while(todo.length){const node=todo.pop();if(node===ancestor)return true;if(seen.has(node))continue;seen.add(node);todo.push(...s.parents[node]);}return false;}
export function branchWorkshopSummary(s,commit){return {commit,feature:Object.hasOwn(s.parents,'B')&&branchWorkshopContains(s,commit,'B'),fix:Object.hasOwn(s.parents,'R')&&branchWorkshopContains(s,commit,'R')};}
function apply(s,a){if(a==='branch'&&s.release===null&&s.main==='A'){s.release='A';s.message='公開保守の枝を A から作りました。';}
 else if(a==='oldTag'&&s.release==='A'&&!s.oldTag){s.oldTag='A';s.message='v1.0 は版 A を指します。';}
 else if(a==='feature'&&s.oldTag&&s.main==='A'){s.parents.B=['A'];s.main='B';s.message='本流が新機能 B へ進みました。';}
 else if(a==='fix'&&s.oldTag&&s.release==='A'){s.parents.R=['A'];s.release='R';s.message='保守の枝が修正 R へ進みました。v1.0 は A のままです。';}
 else if(a==='patchTag'&&s.release==='R'&&!s.patchTag){s.patchTag='R';s.message='v1.1 は修正 R を指します。';}
 else if(a==='test'&&s.release==='R'&&!s.tested){s.tested='R';s.message='この模型の試験は版 R に対して成功しました。';}
 else if(a==='predict:old'&&s.patchTag&&!s.predictions.old){s.predictions.old=true;s.message='元の目印を確かめましょう。';}
 else if(a==='predict:patch'&&s.patchTag&&!s.predictions.patch){s.predictions.patch=true;s.message='修正の目印を確かめましょう。';}
 else if(a==='inspectOld'&&s.predictions.old&&!s.inspected.old){s.inspected.old=true;s.message='v1.0 は A を指し、修正 R を含みません。';}
 else if(a==='inspectPatch'&&s.predictions.patch&&!s.inspected.patch){s.inspected.patch=true;s.message='v1.1 は R を指し、修正を含みます。試験した版かも確認しましょう。';}
 else if(a==='inspectBefore'&&s.main==='B'&&s.release==='R'&&!s.inspected.before){s.inspected.before=true;s.message='統合前の本流 B には新機能がありますが、修正 R はありません。';}
 else if(a==='merge'&&s.inspected.before&&s.main==='B'&&s.release==='R'){s.parents.M=['B','R'];s.main='M';s.message='本流 B と保守の枝 R を統合し、新しい版 M を作りました。';}
 else if(a==='inspectAfter'&&s.main==='M'&&!s.inspected.after){s.inspected.after=true;s.message='統合後 M は B と R の両方を先祖に持ちます。';}
 else throw new RangeError('操作の順序が不正です');return s;}
export function branchWorkshopReplay(history){if(!Array.isArray(history)||history.length>13)throw new RangeError('記録が不正です');const s=branchWorkshopInitial();for(const action of history){if(typeof action!=='string')throw new RangeError('操作が不正です');apply(s,action);}return s;}
export function branchWorkshopStep(history,action){const s=branchWorkshopReplay(history);if(action==='predict:oldwrong'||action==='predict:patchwrong')return {ok:false,history:[...history],message:'目印が指す版と、その版の先祖を確認しましょう。'};try{apply(s,action);return {ok:true,history:[...history,action],message:s.message};}catch{return {ok:false,history:[...history],message:'枝と目印を用意し、各版の確認を済ませてから次の操作へ進みましょう。'};}}
export function branchWorkshopCreate(){return {history:[],reflection:null};}
export function branchWorkshopComplete(q){const s=branchWorkshopReplay(q.history);return Object.values(s.inspected).every(Boolean)&&s.tested==='R'&&q.reflection==='trace';}
export function branchWorkshopRestore(saved){if(!saved||![null,'trace','branch','tag'].includes(saved.reflection))throw new RangeError('記録が不正です');branchWorkshopReplay(saved.history);return {history:[...saved.history],reflection:saved.reflection};}
