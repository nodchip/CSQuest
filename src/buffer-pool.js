export function createBufferPool(){return {page2:true,dirty:true,loaded:false,pinBlocked:false,dirtyBlocked:false,history:[],message:'３頁目を置く場所を作りましょう。'};}
export function bufferPoolStep(s,action){
 if(!['evict1','evict2','write2','load3'].includes(action))throw new RangeError('操作が不正です。');
 const n={...s,history:[...s.history]};
 if(action==='evict1'&&!s.pinBlocked){n.pinBlocked=true;n.message='頁１は使用中なので外せません。';}
 else if(action==='evict2'&&s.page2&&s.dirty&&!s.dirtyBlocked){n.dirtyBlocked=true;n.message='頁２の変更を先に保存する必要があります。';}
 else if(action==='write2'&&s.page2&&s.dirty){n.dirty=false;n.message='頁２の変更を記録装置へ書き戻しました。';}
 else if(action==='evict2'&&s.page2&&!s.dirty){n.page2=false;n.message='頁２を外して枠を空けました。';}
 else if(action==='load3'&&!s.page2&&!s.loaded){n.loaded=true;n.message='空いた枠に頁３を読み込みました。';}
 else return {...s,message:'この操作は今できません。'};
 n.history.push(action);return n;
}
export function bufferPoolComplete(s){return s.pinBlocked&&s.dirtyBlocked&&!s.dirty&&!s.page2&&s.loaded;}
export function restoreBufferPool(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>5)throw new RangeError('履歴が不正です。');let s=createBufferPool();for(const action of saved.history){const n=bufferPoolStep(s,action);if(n.history.length!==s.history.length+1)throw new RangeError('履歴が不正です。');s=n;}return s;}
