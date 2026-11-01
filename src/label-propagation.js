export const propagationLevel={id:'forest-label-propagation',number:'501',kind:'label-propagation',name:'森の道を伝う印',tag:'グラフと半教師あり学習',title:'少ない手本から印を広げよう',story:'森の六つの石のうち、両端の印だけが確認されています。道と手本を変え、印の見込みがどう伝わるか調べましょう。'};
export const propagationLinks={joined:'中央の道がある',split:'中央の道がない'};
export const propagationSeeds={opposite:'右端は青',same:'右端も赤'};
export const stoneNames=['Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ'];
export function propagationState(link,seed,round){
 if(!Object.hasOwn(propagationLinks,link)||!Object.hasOwn(propagationSeeds,seed)||!Number.isInteger(round)||round<0||round>4)throw new RangeError('条件または手順が不正です。');
 const edges=[[0,1],[1,2],...(link==='joined'?[[2,3]]:[]),[3,4],[4,5]];let values=[1,0,0,0,0,seed==='same'?1:-1];
 for(let r=0;r<round;r++){const prev=values;values=prev.map((value,i)=>{if(i===0||i===5)return value;const neighbors=edges.flatMap(([a,b])=>a===i?[b]:b===i?[a]:[]);return neighbors.reduce((sum,j)=>sum+prev[j],0)/neighbors.length;});}
 return {values,edges};
}
export function createPropagation(){return {link:'joined',seed:'opposite',trials:Object.fromEntries(Object.keys(propagationLinks).map(l=>[l,Object.fromEntries(Object.keys(propagationSeeds).map(k=>[k,{round:0,guess:null,checked:false}]))])),answer:null,checked:false};}
export function propagationTrialComplete(link,seed,t){if(t.round!==4||!t.checked)return false;const value=propagationState(link,seed,4).values[3],expected=value>0?'red':value<0?'blue':'zero';return t.guess===expected;}
export function propagationComplete(s){return Object.keys(propagationLinks).every(l=>Object.keys(propagationSeeds).every(k=>propagationTrialComplete(l,k,s.trials[l][k])))&&s.answer==='depend'&&s.checked;}
export function restorePropagation(s){if(!s||!Object.hasOwn(propagationLinks,s.link)||!Object.hasOwn(propagationSeeds,s.seed)||!s.trials||![null,'depend','certain','graph'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createPropagation();n.link=s.link;n.seed=s.seed;n.answer=s.answer;n.checked=s.checked;for(const l of Object.keys(propagationLinks))for(const k of Object.keys(propagationSeeds)){const t=s.trials[l]?.[k];if(!t||![null,'red','blue','zero'].includes(t.guess)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');propagationState(l,k,t.round);n.trials[l][k]={round:t.round,guess:t.guess,checked:t.checked};}return n;}
