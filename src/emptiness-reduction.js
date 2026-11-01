export const emptinessReductionLevel={id:'archive-emptiness-reduction',number:'648',kind:'emptiness-reduction',name:'空の書庫への帰着',tag:'停止問題と空言語の決定不能性',title:'受け取る手紙のない門を調べよう',story:'書庫には、どんな手紙を受け取るかを決める門があります。停止するか分からない機械から門を作り、受理する手紙が存在するかを考えましょう。'};
export const reductionCases={early:{name:'２手で停止',haltAt:2},late:{name:'５手で停止',haltAt:5},loop:{name:'同じ状態を繰り返す',haltAt:null}};
export const reductionModes=['full','cutoff'];
export const reductionRequired=['full,early,0,2','full,early,1,2','full,late,0,2','cutoff,late,0,2','full,late,0,5','full,loop,0,2'];
export function reductionTrace(mode,program,probe,steps){
 if(!reductionModes.includes(mode)||!Object.hasOwn(reductionCases,program)||!['0','1'].includes(probe)||!Number.isInteger(steps)||steps<0||steps>5)throw new RangeError('門の設定が不正です。');
 const stop=reductionCases[program].haltAt,terminal=Math.min(stop??Infinity,mode==='cutoff'?2:Infinity);
 if(steps>terminal)throw new RangeError('判定後に進めません。');
 let status='running';if(stop!==null&&steps>=stop)status='accept';else if(mode==='cutoff'&&steps>=2)status='reject';
 return {status,steps,probe,program,mode};
}
export function createEmptinessReduction(){return {mode:'full',program:'early',probe:'0',steps:0,observed:[],empty:null,nonempty:null,direction:null,checked:false};}
export function emptinessReductionComplete(s){return reductionRequired.every(k=>s.observed.includes(k))&&s.empty==='not-halt'&&s.nonempty==='halt'&&s.direction==='construct'&&s.checked;}
export function restoreEmptinessReduction(s){
 if(!s||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||![null,'not-halt','halt','unknown'].includes(s.empty)||![null,'halt','not-halt','unknown'].includes(s.nonempty)||![null,'construct','reverse','sample'].includes(s.direction)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 reductionTrace(s.mode,s.program,s.probe,s.steps);
 for(const k of s.observed){if(typeof k!=='string')throw new RangeError('観察が不正です。');const parts=k.split(',');if(parts.length!==4||!/^[0-5]$/.test(parts[3]))throw new RangeError('観察が不正です。');reductionTrace(parts[0],parts[1],parts[2],Number(parts[3]));}
 return {...s,observed:[...s.observed]};
}
