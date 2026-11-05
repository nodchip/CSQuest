// A finite undirected map; G is deliberately unreachable from S.
export const cycleRoads={S:['A'],A:['S','B'],B:['A'],G:[]};
export const cycleMethods={marked:'発見済みを記録する',unmarked:'発見済みを記録しない'};
export function cycleSearchTrace(method){
 if(!Object.hasOwn(cycleMethods,method))throw new RangeError('探索方法が不正です。');
 let queue=['S'],seen=['S'],visited=[],trace=[];
 for(let step=0;step<=8;step++){
  trace.push({queue:[...queue],seen:[...seen],visited:[...visited]});
  if(!queue.length||step===8)break;
  const current=queue.shift();visited.push(current);
  for(const next of cycleRoads[current]){
   if(method==='marked'&&seen.includes(next))continue;
   if(method==='marked')seen.push(next);
   queue.push(next);
  }
 }
 return trace;
}
export const cycleSearchTraces=Object.fromEntries(Object.keys(cycleMethods).map(k=>[k,cycleSearchTrace(k)]));
