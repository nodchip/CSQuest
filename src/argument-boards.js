export const argumentBoardLevel={id:'village-argument-boards',number:'1058',kind:'argument-boards',name:'反論のある評議会',tag:'抽象的議論と受理',title:'反論の矢印をたどる',story:'評議会では３つの主張が対立しています。反論の関係をたどり、どの主張の組を受け入れられるか調べましょう。'};
export const argumentNames=['A','B','C'];
export const argumentGraphs={chain:{name:'一方向の議論',attacks:[[0,1],[1,2]]},cycle:{name:'相互に反論する議論',attacks:[[0,1],[1,0],[1,2]]}};
const has=(mask,i)=>(mask&(1<<i))!==0;
export function argumentDefended(attacks,mask){
 let result=0;for(let a=0;a<3;a++){const attackers=attacks.filter(([,to])=>to===a).map(([from])=>from);if(attackers.every(from=>attacks.some(([x,y])=>has(mask,x)&&y===from)))result|=1<<a;}return result;
}
export function argumentGrounded(attacks){let mask=0;for(let i=0;i<4;i++){const next=argumentDefended(attacks,mask);if(next===mask)return mask;mask=next;}throw new RangeError('議論の収束を確認できません。');}
export function argumentAnalyze(graph,mask){
 if(!Object.hasOwn(argumentGraphs,graph)||!Number.isInteger(mask)||mask<0||mask>7)throw new RangeError('主張の組が不正です。');
 const attacks=argumentGraphs[graph].attacks,conflicts=attacks.filter(([a,b])=>has(mask,a)&&has(mask,b)),unattacked=argumentNames.filter((_,i)=>!has(mask,i)&&!attacks.some(([a,b])=>has(mask,a)&&b===i)),defended=argumentDefended(attacks,mask);
 return {conflicts,unattacked,conflictFree:conflicts.length===0,admissible:conflicts.length===0&&(mask&defended)===mask,grounded:argumentGrounded(attacks)===mask,stable:conflicts.length===0&&unattacked.length===0};
}
export function argumentCreate(){return {graph:'chain',mask:0,seen:{chain:[],cycle:[]},reflection:null};}
export function argumentDone(q){
 const c=q.seen.cycle;
 return q.seen.chain.includes(5)&&c.includes(0)&&c.includes(2)&&c.includes(5)&&c.some(m=>!argumentAnalyze('cycle',m).conflictFree)&&c.some(m=>{const r=argumentAnalyze('cycle',m);return m!==0&&r.conflictFree&&!r.stable;})&&q.reflection==='models';
}
export function argumentRestore(q){
 if(!q||!Object.hasOwn(argumentGraphs,q.graph)||!Number.isInteger(q.mask)||q.mask<0||q.mask>7||!q.seen||![null,'models','truth','one'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 for(const graph of Object.keys(argumentGraphs)){const seen=q.seen[graph];if(!Array.isArray(seen)||new Set(seen).size!==seen.length||seen.some(m=>!Number.isInteger(m)||m<0||m>7))throw new RangeError('途中記録が不正です。');}
 return {graph:q.graph,mask:q.mask,seen:{chain:[...q.seen.chain],cycle:[...q.seen.cycle]},reflection:q.reflection};
}
