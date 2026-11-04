export const swapLevel={id:'forest-entanglement-swap',number:'1220',kind:'entanglement-swap',name:'三つの塔を結ぶ水晶',tag:'量子ネットワークともつれ交換',title:'中継塔を使って離れた水晶を結ぼう',story:'谷を挟んだ二つの塔は直接結べません。中継塔に二組の水晶を集め、離れた塔どうしの結びを作りましょう。'};
export const swapOutcomes=['00','01','10','11'];
const h=1/Math.sqrt(2);
export function swapBranch(bits){
 if(!swapOutcomes.includes(bits))throw new RangeError('測定結果が不正です。');
 // Qubit order is A, middle-left, middle-right, C.
 let v=Array.from({length:16},(_,i)=>[0,3,12,15].includes(i)?0.5:0);
 v=v.map((_,i)=>v[i^((i&4)?2:0)]);
 const after=v.slice();for(let i=0;i<16;i++)if(!(i&4)){after[i]=(v[i]+v[i|4])*h;after[i|4]=(v[i]-v[i|4])*h;}
 const b=parseInt(bits,2),raw=[0,1,2,3].map(k=>after[((k>>1)<<3)|(b<<1)|(k&1)]),probability=raw.reduce((a,x)=>a+x*x,0);
 return {probability,vector:raw.map(x=>x/Math.sqrt(probability))};
}
export function swapCorrect(vector,x,z){
 if(!Array.isArray(vector)||vector.length!==4||!vector.every(Number.isFinite)||typeof x!=='boolean'||typeof z!=='boolean')throw new RangeError('修正が不正です。');
 let v=vector.slice();if(x)v=[v[1],v[0],v[3],v[2]];if(z)v=[v[0],-v[1],v[2],-v[3]];return v;
}
export function swapCorrelations(v){if(!Array.isArray(v)||v.length!==4||!v.every(Number.isFinite))throw new RangeError('状態が不正です。');return {zz:v[0]**2-v[1]**2-v[2]**2+v[3]**2,xx:2*(v[0]*v[3]+v[1]*v[2])};}
export function swapCreate(){return {selected:'00',phase:'ready',x:false,z:false,solved:[],reflection:null};}
export function swapCheck(q){
 if(q.phase!=='delivered')throw new RangeError('先に測定結果を届けてください。');
 const before=swapBranch(q.selected),after=swapCorrect(before.vector,q.x,q.z),c=swapCorrelations(after),correct=Math.abs(c.zz-1)<1e-9&&Math.abs(c.xx-1)<1e-9;
 if(correct&&!q.solved.includes(q.selected))q.solved.push(q.selected);
 return {before:swapCorrelations(before.vector),after:c,correct};
}
export function swapDone(q){return swapOutcomes.every(x=>q.solved.includes(x))&&q.reflection==='classical';}
export function swapRestore(q){
 if(!q||!swapOutcomes.includes(q.selected)||!['ready','paired','measured','delivered'].includes(q.phase)||typeof q.x!=='boolean'||typeof q.z!=='boolean'||q.phase!=='delivered'&&(q.x||q.z)||!Array.isArray(q.solved)||new Set(q.solved).size!==q.solved.length||q.solved.some(x=>!swapOutcomes.includes(x))||![null,'classical','faster'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {selected:q.selected,phase:q.phase,x:q.x,z:q.z,solved:[...q.solved],reflection:q.reflection};
}
