export const arrayMachineLevel={id:'workshop-array-machine',number:'1086',kind:'array-machine',name:'薬草棚を巡る命令札',tag:'配列と機械の繰り返し',title:'棚の薬草を数え上げる',story:'棚に並ぶ薬草の合計を小さな機械に数えさせます。命令札を並べ替え、２種類の棚で確かめましょう。'};
export const arrayMachineCards={read:'現在の番地から値を読む',add:'読んだ値を合計に足す',advance:'番地を１進める',branch:'まだ棚の中なら先頭に戻る',halt:'停止する'};
export const arrayMachineCases={three:{name:'３つの棚',values:[3,1,2]},two:{name:'２つの棚',values:[4,0]}};
export const arrayMachineInitial=['advance','read','add','branch','halt'];
export function arrayMachineValid(order){return Array.isArray(order)&&order.length===5&&new Set(order).size===5&&order.every(k=>Object.hasOwn(arrayMachineCards,k));}
export function arrayMachineRun(order,id,steps){
 if(!arrayMachineValid(order)||!Object.hasOwn(arrayMachineCases,id)||!Number.isInteger(steps)||steps<0||steps>30)throw new RangeError('機械の条件が不正です');
 const a=arrayMachineCases[id].values;let pc=0,p=0,temp=0,sum=0,status='running',last=null;
 for(let i=0;i<steps;i++){
  if(status!=='running')throw new RangeError('停止後の操作はできません');
  const cmd=order[pc];last={pc,cmd};pc++;
  if(cmd==='read'){if(p>=a.length)status='fault';else temp=a[p];}else if(cmd==='add')sum+=temp;else if(cmd==='advance')p++;else if(cmd==='branch'){if(p<a.length)pc=0;}else status='halt';
  if(status==='running'&&pc>=order.length)status='fault';if(i===29&&status==='running')status='limit';
 }
 return {pc,p,temp,sum,status,last};
}
export function arrayMachineFull(order,id){let n=0,r=arrayMachineRun(order,id,0);while(r.status==='running'){n++;r=arrayMachineRun(order,id,n);}return {...r,steps:n};}
export function arrayMachineCreate(){return {order:[...arrayMachineInitial],case:'three',steps:0,passed:[],reflection:null};}
export function arrayMachinePassed(order,id){const r=arrayMachineFull(order,id),a=arrayMachineCases[id].values;return r.status==='halt'&&r.sum===a.reduce((x,y)=>x+y,0);}
export function arrayMachineDone(q){return Object.keys(arrayMachineCases).every(id=>q.passed.includes(id)&&arrayMachinePassed(q.order,id))&&q.reflection==='bounds';}
export function arrayMachineRestore(q){
 if(!q||!arrayMachineValid(q.order)||!Object.hasOwn(arrayMachineCases,q.case)||!Number.isInteger(q.steps)||q.steps<0||q.steps>30||!Array.isArray(q.passed)||q.passed.length>2||new Set(q.passed).size!==q.passed.length||q.passed.some(id=>!Object.hasOwn(arrayMachineCases,id)||!arrayMachinePassed(q.order,id))||![null,'bounds','forever','same'].includes(q.reflection))throw new RangeError('途中記録が不正です');arrayMachineRun(q.order,q.case,q.steps);return {...q,order:[...q.order],passed:[...q.passed]};
}
