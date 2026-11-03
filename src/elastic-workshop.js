export const elasticLevel={id:'forge-elastic-workshop',number:'1120',kind:'elastic-workshop',name:'知らせをさばく雲の工房',tag:'クラウドと水平伸縮',title:'忙しさに合わせて工房を増減する',story:'塔から届く知らせが祭りの間だけ急増します。二人を固定する工房と、人数を調整する工房を比べましょう。'};
export const elasticModes={fixed:'二人を固定',adjust:'人数を調整'};
export const elasticArrivals=[2,2,6,6,2,2];
export function elasticReplay(mode,requests){
 if(!Object.hasOwn(elasticModes,mode)||!Array.isArray(requests)||requests.length>elasticArrivals.length||requests.some(n=>!Number.isInteger(n)||n<1||n>4)||(mode==='fixed'&&requests.some(n=>n!==2)))throw new RangeError('工房の記録が不正です。');
 let available=mode==='fixed'?2:1,waiting=0,cost=0;const rows=[];
 for(let i=0;i<requests.length;i++){
  const arrival=elasticArrivals[i],before=waiting+arrival,served=Math.min(before,available*2);waiting=before-served;cost+=available;
  rows.push({period:i+1,arrival,available,served,waiting,cost,requested:requests[i]});available=requests[i];
 }
 return {rows,waiting,cost,available};
}
export function elasticCreate(){return {mode:'fixed',requests:{fixed:[],adjust:[]},desired:1,answer:null,checked:false};}
export function elasticStep(q){const requests=q.requests[q.mode],n=q.mode==='fixed'?2:q.desired;elasticReplay(q.mode,[...requests,n]);requests.push(n);}
export function elasticDone(q){const fixed=elasticReplay('fixed',q.requests.fixed),flex=elasticReplay('adjust',q.requests.adjust),n=flex.rows.map(row=>row.available);return fixed.rows.length===6&&flex.rows.length===6&&n.some((v,i)=>i>0&&v>n[i-1])&&n.some((v,i)=>i>0&&v<n[i-1])&&q.answer==='delay'&&q.checked;}
export function elasticRestore(q){if(!q||!Object.hasOwn(elasticModes,q.mode)||!q.requests||!Number.isInteger(q.desired)||q.desired<1||q.desired>4||![null,'delay','instant','free'].includes(q.answer)||typeof q.checked!=='boolean')throw new RangeError('工房の記録が不正です。');const r=elasticCreate();r.mode=q.mode;r.desired=q.desired;r.answer=q.answer;r.checked=q.checked;for(const mode of Object.keys(elasticModes)){elasticReplay(mode,q.requests[mode]);r.requests[mode]=[...q.requests[mode]];}return r;}
