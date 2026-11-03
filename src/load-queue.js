export const loadQueueLevel={id:'forest-load-queue',number:'1094',kind:'load-queue',name:'混み合う伝令所',tag:'負荷と FIFO・LIFO',title:'手紙の待ち時間を比べよう',story:'森の伝令所に手紙が届きます。到着の混み具合と手紙を選ぶ順を変え、誰がどれくらい待つか調べましょう。'};
export const loadQueueCases={spaced:{name:'間隔を空けて到着・先着順',arrivals:[0,2,4,6],policy:'fifo'},fifo:{name:'４通が続けて到着・先着順 FIFO',arrivals:[0,1,2,3],policy:'fifo'},lifo:{name:'４通が続けて到着・後着順 LIFO',arrivals:[0,1,2,3],policy:'lifo'},fifo8:{name:'８通が続けて到着・先着順 FIFO',arrivals:[0,1,2,3,4,5,6,7],policy:'fifo'},lifo8:{name:'８通が続けて到着・後着順 LIFO',arrivals:[0,1,2,3,4,5,6,7],policy:'lifo'}};
export const loadQueueNames=['甲','乙','丙','丁','戊','己','庚','辛'];
export function loadQueueReplay(id,history){
 const c=loadQueueCases[id];if(!Object.hasOwn(loadQueueCases,id)||!Array.isArray(history)||history.length>c.arrivals.length)throw new RangeError('記録が不正です');
 let time=0;const remaining=c.arrivals.map((arrival,i)=>({name:loadQueueNames[i],arrival})),finished=[];
 function waiting(){return remaining.filter(x=>x.arrival<=time);}
 for(const name of history){if(!waiting().length)time=Math.min(...remaining.map(x=>x.arrival));const q=waiting(),expected=c.policy==='fifo'?q[0]:q.at(-1);if(!expected||expected.name!==name)throw new RangeError('決められた順序で待ち列から選びましょう');const start=time;time+=2;finished.push({...expected,start,finish:time,wait:start-expected.arrival,latency:time-expected.arrival});remaining.splice(remaining.indexOf(expected),1);}
 if(remaining.length&&!waiting().length)time=Math.min(...remaining.map(x=>x.arrival));
 return {time,waiting:waiting().map(x=>x.name),future:remaining.filter(x=>x.arrival>time).map(x=>x.name),finished,done:!remaining.length,averageWait:finished.length===c.arrivals.length?finished.reduce((a,x)=>a+x.wait,0)/c.arrivals.length:null};
}
export function loadQueueCreate(){return {case:'spaced',histories:{spaced:[],fifo:[],lifo:[],fifo8:[],lifo8:[]},load:null,average:null,older:null,growth:null};}
export function loadQueueRestore(q){if(!q||!Object.hasOwn(loadQueueCases,q.case)||!q.histories||![null,'burst','same'].includes(q.load)||![null,'equal','fifo','lifo'].includes(q.average)||![null,'longer','shorter'].includes(q.older)||![null,'longer','same'].includes(q.growth??null))throw new RangeError('途中記録が不正です');const histories={};for(const id of Object.keys(loadQueueCases)){const history=q.histories[id]??(id==='fifo8'||id==='lifo8'?[]:null);loadQueueReplay(id,history);histories[id]=[...history];}return {case:q.case,histories,load:q.load,average:q.average,older:q.older,growth:q.growth??null};}
export function loadQueueDone(q){return Object.keys(loadQueueCases).every(id=>loadQueueReplay(id,q.histories[id]).done)&&q.load==='burst'&&q.average==='equal'&&q.older==='longer'&&q.growth==='longer';}
