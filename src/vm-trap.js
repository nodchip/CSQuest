export const vmTrapLevel={id:'workshop-vm-trap',number:'754',kind:'vm-trap',name:'二つの塔と守りの門番',tag:'仮想機械とハードウェア支援',title:'共有装置の設定を守る',story:'二つの塔が一つの装置を使います。設定の変更を門番が受け取る方法と、直接変更する方法を比べましょう。'};
export const vmTrapModes=['direct','guarded'];
export function vmTrapTrial(){return {stage:'a-write',physical:0,virtual:{a:0,b:0},pending:null,seen:{a:null,b:null},history:[]};}
export function vmTrapCreate(){return {mode:'direct',trials:{direct:vmTrapTrial(),guarded:vmTrapTrial()},answer:'',checked:false};}
export function vmTrapStep(t,mode,action){
 if(!vmTrapModes.includes(mode)||!['write','handle','switch','read'].includes(action))throw new RangeError('操作が不正です。');
 const stage=t.stage;
 if(action==='write'&&(stage==='a-write'||stage==='b-write')){const guest=stage[0],value=guest==='a'?7:9;if(mode==='guarded'){t.pending={guest,value};t.stage=guest+'-handle';}else{t.physical=value;t.stage=guest==='a'?'b-switch':'a-switch';}}
 else if(action==='handle'&&(stage==='a-handle'||stage==='b-handle')){const {guest,value}=t.pending;t.virtual[guest]=value;t.physical=value;t.pending=null;t.stage=guest==='a'?'b-switch':'a-switch';}
 else if(action==='switch'&&(stage==='b-switch'||stage==='a-switch')){const guest=stage[0];if(mode==='guarded')t.physical=t.virtual[guest];t.stage=guest+'-read';}
 else if(action==='read'&&(stage==='a-read'||stage==='b-read')){const guest=stage[0];t.seen[guest]=t.physical;t.stage=guest==='b'?'b-write':'done';}
 else return false;
 t.history.push(action);return true;
}
export function vmTrapComplete(s){return s.trials.direct.stage==='done'&&s.trials.guarded.stage==='done'&&s.answer==='trap'&&s.checked;}
export function vmTrapRestore(s){if(!s||!vmTrapModes.includes(s.mode)||!s.trials||!['','trap','all','never'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=vmTrapCreate();out.mode=s.mode;out.answer=s.answer;out.checked=s.checked;for(const mode of vmTrapModes){const saved=s.trials[mode];if(!saved||!Array.isArray(saved.history)||saved.history.length>8)throw new RangeError('途中記録が不正です。');for(const a of saved.history)if(!vmTrapStep(out.trials[mode],mode,a))throw new RangeError('途中記録が不正です。');}return out;}
