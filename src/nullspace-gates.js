export const nullspaceLevel={id:'ruin-nullspace-gates',number:'1068',kind:'nullspace-gates',name:'三つの灯りと零の門',tag:'同次方程式と零空間',title:'二つの門を同時に静める',story:'３色の灯りが２つの門に信号を送っています。両方の信号を０にする組を探し、通れる道の広がりを調べましょう。'};
export const nullspaceCases=[
 {name:'異なる２つの門',rows:[[1,1,0],[0,1,1]],basis:'(1, −1, 1) の実数倍',rank:2,dimension:1,requirements:['fail','forward','reverse']},
 {name:'同じ条件の２つの門',rows:[[1,1,0],[2,2,0]],basis:'(1, −1, 0) と (0, 0, 1) の実数係数による和',rank:1,dimension:2,requirements:['fail','base-x','base-z','both']}
];
export function nullspaceOutput(index,vector){if(!Number.isInteger(index)||!nullspaceCases[index]||!Array.isArray(vector)||vector.length!==3||!vector.every(Number.isFinite))throw new RangeError('入力が不正です。');return nullspaceCases[index].rows.map(row=>row.reduce((sum,c,i)=>sum+c*vector[i],0));}
export function nullspaceMarker(index,v){const output=nullspaceOutput(index,v);if(output.some(x=>x!==0))return 'fail';const key=v.join(',');return index===0?({'1,-1,1':'forward','-1,1,-1':'reverse'}[key]??null):({'1,-1,0':'base-x','0,0,1':'base-z','1,-1,1':'both'}[key]??null);}
export function nullspaceCreate(){return {current:0,vector:[0,0,0],guess:null,seen:[[],[]],dimensions:[null,null],reflection:null};}
export function nullspaceDone(q){return nullspaceCases.every((c,i)=>c.requirements.every(x=>q.seen[i].includes(x))&&q.dimensions[i]===c.dimension)&&q.reflection==='orthogonal';}
export function nullspaceRestore(q){
 if(!q||![0,1].includes(q.current)||!Array.isArray(q.vector)||q.vector.length!==3||!q.vector.every(x=>[-1,0,1].includes(x))||![null,'open','closed'].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length!==2||!q.seen.every((s,i)=>Array.isArray(s)&&new Set(s).size===s.length&&s.every(x=>nullspaceCases[i].requirements.includes(x)))||!Array.isArray(q.dimensions)||q.dimensions.length!==2||!q.dimensions.every(x=>[null,1,2,3].includes(x))||![null,'orthogonal','parallel'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {...q,vector:[...q.vector],seen:q.seen.map(s=>[...s]),dimensions:[...q.dimensions]};
}
