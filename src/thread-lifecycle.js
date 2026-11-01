export const threadLifecycleLevel={id:'forge-thread-lifecycle',number:'628',kind:'thread-lifecycle',name:'精霊の仕事と合流',tag:'スレッドの生成と終了待ち',title:'仲間の仕事を待とう',story:'精霊 A が精霊 B に宝石を数えてもらいます。B の終了をいつ待つか、記録がどう片付くか比べましょう。'};
export const lifecycleCases={early:{name:'終了前に合流を待つ'},late:{name:'終了後に合流する'},detached:{name:'合流しない設定にする'}};
export const lifecycleActions={create:'B の仕事を作る',join:'A が B の終了を待つ',finish:'B が仕事を終える',detach:'B を合流しない設定にする',inspect:'B に合流できるか確認する'};
export function lifecycleSequence(id){if(!Object.hasOwn(lifecycleCases,id))throw new RangeError('場面が不正です。');return {early:['create','join','finish'],late:['create','finish','join'],detached:['create','detach','finish','inspect']}[id];}
export function lifecycleReplay(id,history){
 const seq=lifecycleSequence(id);if(!Array.isArray(history)||history.length>seq.length||history.some((a,i)=>a!==seq[i]))throw new RangeError('操作履歴が不正です。');
 const s={parent:'実行可能',child:'未作成',joinable:false,record:'なし',result:null,inspection:null};
 for(const action of history){if(action==='create'){s.child='作業中';s.joinable=true;s.record='保持中';}else if(action==='join'){if(s.child==='作業中')s.parent='終了待ち';else{s.parent='実行可能';s.result=7;s.record='解放済み';s.joinable=false;}}else if(action==='finish'){s.child='終了';if(s.parent==='終了待ち'){s.parent='実行可能';s.result=7;s.record='解放済み';s.joinable=false;}else if(!s.joinable)s.record='解放済み';}else if(action==='detach')s.joinable=false;else if(action==='inspect')s.inspection='合流できない';}
 return s;
}
export function createThreadLifecycle(){return {selected:'early',histories:{early:[],late:[],detached:[]},answer:null,checked:false};}
export function threadLifecycleComplete(s){return Object.keys(lifecycleCases).every(id=>s.histories[id].length===lifecycleSequence(id).length)&&s.answer==='limits'&&s.checked;}
export function restoreThreadLifecycle(s){if(!s||!Object.hasOwn(lifecycleCases,s.selected)||!s.histories||![null,'limits','cancel','result'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const r=createThreadLifecycle();r.selected=s.selected;r.answer=s.answer;r.checked=s.checked;for(const id of Object.keys(lifecycleCases)){lifecycleReplay(id,s.histories[id]);r.histories[id]=[...s.histories[id]];}return r;}
