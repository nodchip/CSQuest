export const anomalyLevel={id:'village-ledger-anomalies',number:'1227',kind:'ledger-anomalies',name:'講座台帳の三つの困りごと',tag:'正規化と更新異常',title:'講座と登録の台帳を守ろう',story:'ギルドの講座と登録者を記した台帳を整理し、名前の変更や最後の登録の削除に備えます。'};
export const anomalyCases={update:{name:'講座名を変える',prompt:'星の講座の名前を「星読み」に変更。１行だけを更新します。',answer:'inconsistent'},insert:{name:'新講座を追加',prompt:'登録者がまだいない月の講座を追加します。登録者欄は必須です。',answer:'blocked'},delete:{name:'最後の登録を削除',prompt:'太陽の講座で唯一の登録者カイの登録を消します。',answer:'lost'}};
export const anomalyModes={combined:'一枚の台帳',split:'講座台帳と登録台帳'};
export function anomalyRun(mode,id){
 if(!Object.hasOwn(anomalyModes,mode)||!Object.hasOwn(anomalyCases,id))throw new RangeError('条件が不正です。');
 let courses=[{id:'S',name:'星'},{id:'T',name:'太陽'}],enroll=[{course:'S',student:'アオ'},{course:'S',student:'リナ'},{course:'T',student:'カイ'}];
 let rows=enroll.map(e=>({...e,name:courses.find(c=>c.id===e.course).name})),outcome='safe';
 if(mode==='combined'){
  if(id==='update'){rows[0].name='星読み';outcome='inconsistent';}
  if(id==='insert')outcome='blocked';
  if(id==='delete'){rows=rows.filter(r=>r.student!=='カイ');outcome='lost';}
  return {outcome,rows:rows.map(r=>`${r.course} ${r.name} / ${r.student}`),courses:null,enroll:null};
 }
 if(id==='update')courses.find(c=>c.id==='S').name='星読み';
 if(id==='insert')courses.push({id:'M',name:'月'});
 if(id==='delete')enroll=enroll.filter(e=>e.student!=='カイ');
 rows=enroll.map(e=>({...e,name:courses.find(c=>c.id===e.course).name}));
 return {outcome,rows:rows.map(r=>`${r.course} ${r.name} / ${r.student}`),courses:courses.map(c=>`${c.id} ${c.name}`),enroll:enroll.map(e=>`${e.course} / ${e.student}`)};
}
export function anomalyCreate(){return {mode:'combined',selected:'update',prediction:null,seen:[],reflection:null};}
export function anomalyCheck(q){const r=anomalyRun(q.mode,q.selected),correct=q.prediction===r.outcome,key=`${q.mode}:${q.selected}`;if(correct&&!q.seen.includes(key))q.seen.push(key);return {...r,correct};}
export function anomalyDone(q){return Object.keys(anomalyModes).every(m=>Object.keys(anomalyCases).every(c=>q.seen.includes(`${m}:${c}`)))&&q.reflection==='keys';}
export function anomalyRestore(q){const valid=Object.keys(anomalyModes).flatMap(m=>Object.keys(anomalyCases).map(c=>`${m}:${c}`));if(!q||!Object.hasOwn(anomalyModes,q.mode)||!Object.hasOwn(anomalyCases,q.selected)||![null,'safe','inconsistent','blocked','lost'].includes(q.prediction)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!valid.includes(x))||![null,'keys','any'].includes(q.reflection))throw new RangeError('記録が不正です。');return {...q,seen:[...q.seen]};}
