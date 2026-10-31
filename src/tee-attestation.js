export const teeLevel={id:'castle-tee-attestation',number:'258',kind:'tee-attestation',name:'封印室の証明を確かめる',tag:'仮想マシンと構成証明',title:'秘密を渡す前に確かめよう',story:'城外の封印室に秘密の鍵を届ける前に、部屋から届いた証明を調べます。'};
export const teeReports=[
 {id:'valid',name:'正しい部屋の新しい証明',signature:true,measurement:true,fresh:true},
 {id:'forged',name:'署名が偽の証明',signature:false,measurement:true,fresh:true},
 {id:'changed',name:'起動状態が違う部屋の証明',signature:true,measurement:false,fresh:true},
 {id:'replay',name:'古い照会への証明',signature:true,measurement:true,fresh:false}
];
export const teeChecks=['signature','measurement','fresh'];
export function teeEvaluate(checks){return teeReports.map(report=>({id:report.id,release:teeChecks.every(key=>!checks[key]||report[key])}));}
export function createTee(){return {checks:{signature:false,measurement:false,fresh:false},history:[]};}
export function teeComplete(s){return s.history.some(c=>teeEvaluate(c).some((r,i)=>i>0&&r.release))&&s.history.some(c=>teeEvaluate(c).every((r,i)=>r.release===(i===0)));}
export function restoreTee(saved){if(!saved||!saved.checks||!Array.isArray(saved.history)||saved.history.length>20)throw new RangeError('途中記録が不正です。');const valid=c=>c&&teeChecks.every(k=>typeof c[k]==='boolean');if(!valid(saved.checks)||!saved.history.every(valid))throw new RangeError('途中記録が不正です。');const copy=c=>Object.fromEntries(teeChecks.map(k=>[k,c[k]]));return {checks:copy(saved.checks),history:saved.history.map(copy)};}
