export const twoStageMemoryLevel={id:'workshop-two-stage-memory',number:'756',kind:'two-stage-memory',name:'二重の地図と共有の宝箱',tag:'仮想機械の二段階アドレス変換',title:'二枚の地図で宝箱を探す',story:'二つの塔はそれぞれ独自の地図を持ちます。門番の地図と重ね、箱の置き場所と権限を確かめましょう。'};
export const twoStageFlags=['safeWrite','safeRead','guestDenied','hostDenied','aliasRead','aliasWrite','aliasCrossRead','restoredRead'];
export function twoStageTrial(){return {bMap:3,frames:[1,2,3,4],flags:[],history:[],message:''};}
export function twoStageCreate(){return {guest:'a',page:0,trial:twoStageTrial()};}
export function twoStageTranslate(guest,page,bMap,action){if(!['a','b'].includes(guest)||![0,1].includes(page)||![1,3].includes(bMap)||!['read','write'].includes(action))throw new RangeError('要求が不正です。');const gp=1-page,frame=guest==='a'?gp:gp===0?2:bMap,guestWrite=!(guest==='a'&&page===1),hostWrite=!(guest==='b'&&gp===0);return {gp,frame,blocked:action==='write'&&!guestWrite?'guest':action==='write'&&!hostWrite?'host':null};}
export function twoStageStep(t,event){
 if(!event||!['map','read','write'].includes(event.action)||t.history.length>=100)throw new RangeError('操作が不正です。');
 if(event.action==='map'){if(![1,3].includes(event.frame))throw new RangeError('対応先が不正です。');t.bMap=event.frame;t.message=event.frame===1?'塔Ｂのゲスト物理頁１を共通の枠１へ対応させました。':'塔Ｂのゲスト物理頁１を枠３へ戻しました。';t.history.push({action:'map',frame:event.frame});return;}
 const {guest,page,action}=event,r=twoStageTranslate(guest,page,t.bMap,action);let flag='';
 if(r.blocked){t.message=`ゲスト仮想頁${page} → ゲスト物理頁${r.gp} → 物理枠${r.frame}。${r.blocked==='guest'?'ゲスト':'門番'}の地図で書込みが拒まれました。`;flag=r.blocked==='guest'?'guestDenied':'hostDenied';}
 else if(action==='write'){const value=guest==='a'?7:9;t.frames[r.frame]=value;t.message=`ゲスト仮想頁${page} → ゲスト物理頁${r.gp} → 物理枠${r.frame}。値${value}を書きました。`;if(guest==='a'&&page===0&&t.bMap===3)flag='safeWrite';if(guest==='b'&&page===0&&t.bMap===1&&t.flags.includes('aliasRead'))flag='aliasWrite';}
 else {const value=t.frames[r.frame];t.message=`ゲスト仮想頁${page} → ゲスト物理頁${r.gp} → 物理枠${r.frame}。値${value}を読みました。`;if(guest==='b'&&page===0&&t.bMap===3&&value===4){if(t.flags.includes('aliasCrossRead'))flag='restoredRead';else if(t.flags.includes('safeWrite'))flag='safeRead';}if(guest==='b'&&page===0&&t.bMap===1&&value===7&&t.flags.includes('safeRead'))flag='aliasRead';if(guest==='a'&&page===0&&t.bMap===1&&value===9&&t.flags.includes('aliasWrite'))flag='aliasCrossRead';}
 if(flag&&!t.flags.includes(flag))t.flags.push(flag);t.history.push({action,guest,page});
}
export function twoStageComplete(s){return twoStageFlags.every(f=>s.trial.flags.includes(f));}
export function twoStageRestore(s){if(!s||!['a','b'].includes(s.guest)||![0,1].includes(s.page)||!s.trial||!Array.isArray(s.trial.history)||s.trial.history.length>100)throw new RangeError('途中記録が不正です。');const out=twoStageCreate();out.guest=s.guest;out.page=s.page;for(const e of s.trial.history)twoStageStep(out.trial,e);out.trial.message='';return out;}
