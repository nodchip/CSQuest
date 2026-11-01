export const bfsLabNodes=['S','A','B','C','D','T'];
export const bfsLabEdges=bfsLabNodes.flatMap((a,i)=>bfsLabNodes.slice(i+1).map(b=>[a,b]));
export const bfsLabDefault=bfsLabEdges.reduce((mask,[a,b],i)=>['SA','SB','AC','BC','BD','CT','DT'].includes(a+b)?mask|(1<<i):mask,0);
export function bfsLabGraph(mask){if(!Number.isInteger(mask)||mask<0||mask>=1<<bfsLabEdges.length)throw new RangeError('道の選択が不正です');const graph=Object.fromEntries(bfsLabNodes.map(v=>[v,[]]));bfsLabEdges.forEach(([a,b],i)=>{if(mask&(1<<i)){graph[a].push(b);graph[b].push(a);}});return graph;}
export function bfsLabInitial(){return {levels:[['S']],done:false,found:false};}
export function bfsLabStep(mask,state){if(state.done)throw new RangeError('探索は終わっています');const graph=bfsLabGraph(mask),visited=state.levels.flat(),frontier=state.levels.at(-1),next=bfsLabNodes.filter(v=>!visited.includes(v)&&frontier.some(u=>graph[u].includes(v)));return next.length?{levels:[...state.levels,next],done:next.includes('T'),found:next.includes('T')}:{levels:state.levels.map(x=>[...x]),done:true,found:false};}
export function bfsLabReplay(mask,steps){bfsLabGraph(mask);if(!Number.isInteger(steps)||steps<0||steps>6)throw new RangeError('探索回数が不正です');let r=bfsLabInitial();for(let i=0;i<steps;i++)r=bfsLabStep(mask,r);return r;}
