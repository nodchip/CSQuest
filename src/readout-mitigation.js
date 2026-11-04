export const mitigationLevel={id:'workshop-readout-mitigation',number:'1217',kind:'readout-mitigation',name:'揺れる読取りの鏡',tag:'量子測定の読取り誤差',title:'較正して灯りの割合を見直そう',story:'工房の鏡は時々０と１を読み違えます。基準の札で鏡を較正し、届いた記録の割合を見直しましょう。'};
export const mitigationCases={low:{name:'青い記録',observed:275,answer:'250'},high:{name:'赤い記録',observed:625,answer:'750'},outside:{name:'揺らいだ記録',observed:50,answer:'outside'}};
export const mitigationAnswers={'250':'約25%','750':'約75%',outside:'この模型のままでは確率の範囲外'};
export function mitigationForward(trueOne){if(!Number.isFinite(trueOne)||trueOne<0||trueOne>1)throw new RangeError('確率が不正です。');return .1+.7*trueOne;}
export function mitigationInvert(observedOne){if(!Number.isFinite(observedOne)||observedOne<0||observedOne>1)throw new RangeError('割合が不正です。');return (observedOne-.1)/.7;}
export function mitigationCreate(){return {zeroError:null,oneError:null,calibrated:false,selected:'low',answer:null,seen:[],reflection:null};}
export function mitigationCalibrate(q){q.calibrated=q.zeroError===100&&q.oneError===200;return q.calibrated;}
export function mitigationCheck(q){const ok=q.calibrated&&q.answer===mitigationCases[q.selected].answer;if(ok&&!q.seen.includes(q.selected))q.seen.push(q.selected);return ok;}
export function mitigationDone(q){return q.calibrated&&q.zeroError===100&&q.oneError===200&&Object.keys(mitigationCases).every(k=>q.seen.includes(k))&&q.reflection==='distribution';}
export function mitigationRestore(q){
 if(!q||![null,100,200,800,900].includes(q.zeroError)||![null,100,200,800,900].includes(q.oneError)||typeof q.calibrated!=='boolean'||q.calibrated&&(q.zeroError!==100||q.oneError!==200)||!Object.hasOwn(mitigationCases,q.selected)||!(q.answer===null||Object.hasOwn(mitigationAnswers,q.answer))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(mitigationCases,k))||!q.calibrated&&q.seen.length||![null,'distribution','individual'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {zeroError:q.zeroError,oneError:q.oneError,calibrated:q.calibrated,selected:q.selected,answer:q.answer,seen:[...q.seen],reflection:q.reflection};
}
