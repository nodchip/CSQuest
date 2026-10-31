export const recoveryLevel={id:'workshop-read-recovery',number:'200',kind:'read-recovery',name:'破れた巻物と後片付け',tag:'実行時エラーと後片付け',title:'読めないときも巻物を閉じる',story:'精霊は巻物を開いて数を読みます。印が破れて読めない場合も、知らせを残し、開いた巻物を閉じましょう。'};
export const recoveryCases={valid:{name:'読める巻物',readable:true},damaged:{name:'破れた巻物',readable:false}};
export const recoveryActions={open:'巻物を開く',read:'数を読む',use:'読んだ数を使う',handle:'読めないことを知らせる',close:'巻物を閉じる'};
export function createRecoveryTrial(id){if(!Object.hasOwn(recoveryCases,id))throw new RangeError('巻物が不正です。');return {id,phase:'open',opened:false,value:null,outcome:null,history:[],message:'まず巻物を開きましょう。'};}
export function recoveryStep(s,action){if(!Object.hasOwn(recoveryActions,action))throw new RangeError('操作が不正です。');if(s.phase==='done')return {...s,message:'この試行は終わっています。'};if(action!==s.phase)return {...s,message:s.phase==='handle'?'読み取りに失敗しました。数を使わず、失敗を知らせましょう。':s.phase==='close'?'処理の後は、開いた巻物を閉じましょう。':'今の段階で必要な操作を選びましょう。'};const n={...s,history:[...s.history,action]};
 if(action==='open'){n.opened=true;n.phase='read';n.message='巻物を開きました。次に数を読みます。';}
 else if(action==='read'){if(recoveryCases[s.id].readable){n.value=7;n.phase='use';n.message='数７を読みました。';}else{n.phase='handle';n.message='印が破れていて読めません。エラーを受け取りました。';}}
 else if(action==='use'){n.outcome='used';n.phase='close';n.message='読み取った数を使いました。';}
 else if(action==='handle'){n.outcome='reported';n.phase='close';n.message='読めないことを知らせました。';}
 else if(action==='close'){n.opened=false;n.phase='done';n.message='巻物を閉じ、処理を終えました。';}return n;}
export function createRecoverySet(){return {selected:'valid',trials:{valid:createRecoveryTrial('valid'),damaged:createRecoveryTrial('damaged')}};}
export function recoveryComplete(s){return Object.keys(recoveryCases).every(id=>s.trials[id].phase==='done'&&!s.trials[id].opened);}
export function restoreRecoverySet(saved){if(!saved||!Object.hasOwn(recoveryCases,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const s=createRecoverySet();s.selected=saved.selected;for(const id of Object.keys(recoveryCases)){const history=saved.histories[id];if(!Array.isArray(history)||history.length>4)throw new RangeError('履歴が不正です。');for(const action of history){const n=recoveryStep(s.trials[id],action);if(n.history.length!==s.trials[id].history.length+1)throw new RangeError('履歴が不正です。');s.trials[id]=n;}}return s;}
