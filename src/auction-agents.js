export const auctionAgentsLevel={id:'forest-agent-auction',number:'1078',kind:'agent-auction',name:'精霊たちの競り',tag:'複数主体と競売',title:'灯石の競りに挑む',story:'森の交易所で一つの灯石を二体の精霊が競ります。相手と競りの規則を変え、入札と利得を比べましょう。'};
export const auctionBids=[2,5,6,10];
export const auctionRivals=[4,6,8];
export const auctionModes={second:'２番目の額を支払う',first:'自分の入札額を支払う'};
export const auctionRequired=['second:4:2','second:4:5','second:4:6','second:4:10','second:6:2','second:6:5','second:6:6','second:6:10','second:8:2','second:8:5','second:8:6','second:8:10','first:4:5','first:4:6'];
export function auctionResult(mode,rival,bid){
 if(!Object.hasOwn(auctionModes,mode)||!auctionRivals.includes(rival)||!auctionBids.includes(bid))throw new RangeError('競りの条件が不正です');
 const win=bid>rival,payment=win?(mode==='second'?rival:bid):0;
 return {win,payment,utility:win?6-payment:0};
}
export function auctionCreate(){return {mode:'second',rival:4,bid:6,guess:null,seen:[],reflection:null,comparison:null};}
export function auctionRestore(q){
 if(!q||!Object.hasOwn(auctionModes,q.mode)||!auctionRivals.includes(q.rival)||!auctionBids.includes(q.bid)||![null,'-4','-2','0','1','2'].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>24||new Set(q.seen).size!==q.seen.length||q.seen.some(key=>typeof key!=='string'||!Object.keys(auctionModes).some(m=>auctionRivals.some(r=>auctionBids.some(b=>key===`${m}:${r}:${b}`))))||![null,'weak','always'].includes(q.reflection)||![null,'five','six'].includes(q.comparison))throw new RangeError('競りの記録が不正です');
 return {...q,seen:[...q.seen]};
}
export function auctionDone(q){return auctionRequired.every(key=>q.seen.includes(key))&&q.reflection==='weak'&&q.comparison==='five';}
