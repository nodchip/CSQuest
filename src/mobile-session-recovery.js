export const recoveryDevices={mobile:'携帯端末',desktop:'据置端末'};
export const recoveryModes={memory:'メモリーだけ',saved:'終了前に保存'};
export function recoveryCreate(){return {device:'mobile',mode:'memory',phases:{mobile:{memory:0,saved:0},desktop:{memory:0,saved:0}},reflection:null};}
export function recoveryResult(mode,phase){if(!Object.hasOwn(recoveryModes,mode)||!Number.isInteger(phase)||phase<0||phase>3)throw new RangeError('試行の状態が不正です。');return {phase,inMemory:phase===1||phase===3&&mode==='saved',saved:mode==='saved'&&phase>=1,recovered:phase===3&&mode==='saved'};}
export function recoveryStep(q){const phase=q.phases[q.device]?.[q.mode];recoveryResult(q.mode,phase);if(phase>=3)throw new RangeError('試行は終了しています。');q.phases[q.device][q.mode]++;}
export function recoveryDone(q){return Object.keys(recoveryDevices).every(d=>Object.keys(recoveryModes).every(m=>q.phases[d][m]===3))&&q.reflection==='both';}
export function recoveryRestore(q){if(!q||!Object.hasOwn(recoveryDevices,q.device)||!Object.hasOwn(recoveryModes,q.mode)||!q.phases||![null,'both','mobile','always'].includes(q.reflection))throw new RangeError('試行の記録が不正です。');const phases={};for(const d of Object.keys(recoveryDevices)){phases[d]={};for(const m of Object.keys(recoveryModes)){recoveryResult(m,q.phases[d]?.[m]);phases[d][m]=q.phases[d][m];}}return {device:q.device,mode:q.mode,phases,reflection:q.reflection};}
