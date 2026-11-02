export const fpgaLutLevel={id:'forge-fpga-lut',number:'923',kind:'fpga-lut',name:'書き換えられる門',tag:'FPGA とルックアップ表',title:'二つの表で門を組み立てる',story:'鍛冶場の門には、出力を書き換えられる二つの小さな表があります。三つの印を組み合わせて門を動かしましょう。'};
export function fpgaLutEvaluate(tables,input){
 if(!Array.isArray(tables)||tables.length!==2||tables.some(t=>!Array.isArray(t)||t.length!==4||t.some(x=>x!==0&&x!==1))||!Array.isArray(input)||input.length!==3||input.some(x=>x!==0&&x!==1))throw new RangeError('設定が不正です。');
 const [a,b,c]=input,mid=tables[0][2*a+b],out=tables[1][2*mid+c],expectedMid=a^b,expectedOut=expectedMid&c;
 return {mid,out,expectedMid,expectedOut,correct:mid===expectedMid&&out===expectedOut};
}
export function fpgaLutCreate(){return {tables:[[0,0,0,0],[0,0,0,0]],input:[0,0,0],seen:[],last:null,reflection:null};}
export function fpgaLutToggle(q,table,index){if(![0,1].includes(table)||![0,1,2,3].includes(index))throw new RangeError('位置が不正です。');q.tables[table][index]^=1;q.seen=[];q.last=null;}
export function fpgaLutCheck(q){const r=fpgaLutEvaluate(q.tables,q.input),key=q.input.join('');q.last={key,...r};if(r.correct&&!q.seen.includes(key))q.seen.push(key);}
export function fpgaLutComplete(q){return q.seen.length===8&&q.reflection==='config';}
export function fpgaLutRestore(q){if(!q||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||![null,'config','cpu','guarantee'].includes(q.reflection))throw new RangeError('記録が不正です。');fpgaLutEvaluate(q.tables,q.input);for(const key of q.seen){if(typeof key!=='string'||!/^[01]{3}$/.test(key)||!fpgaLutEvaluate(q.tables,[...key].map(Number)).correct)throw new RangeError('記録が不正です。');}if(q.last!==null){if(!q.last||typeof q.last.key!=='string'||!/^[01]{3}$/.test(q.last.key))throw new RangeError('記録が不正です。');const r=fpgaLutEvaluate(q.tables,[...q.last.key].map(Number));if(Object.keys(r).some(k=>q.last[k]!==r[k]))throw new RangeError('記録が不正です。');}return {tables:q.tables.map(t=>[...t]),input:[...q.input],seen:[...q.seen],last:q.last&&{...q.last},reflection:q.reflection};}
