import {otN,otValues} from './oblivious-transfer.js';
export const otPosteriorLevel={id:'castle-ot-posterior',number:'990',kind:'ot-posterior',name:'依頼から選択を推測する',tag:'条件付き確率・暗号',title:'秘密の選び方を比べよう',story:'記録係が依頼989の通信を調べ、送られた数字が旅人の選択について何を明かすか考えています。'};
export const posteriorCases={
 full:{name:'全55通り・依頼２',keys:'full',request:2,weights:[1,1]},
 overlap:{name:'３通り・依頼２',keys:'three',request:2,weights:[1,1]},
 zero:{name:'３通り・依頼１',keys:'three',request:1,weights:[1,1]},
 one:{name:'３通り・依頼３',keys:'three',request:3,weights:[1,1]},
 prior:{name:'全55通り・選択０が多い',keys:'full',request:2,weights:[3,1]},
 impossible:{name:'３通り・依頼４',keys:'three',request:4,weights:[1,1]}
};
export function posteriorData(id){const c=posteriorCases[id];if(!c)throw new RangeError('不正な場面');const keys=c.keys==='full'?Array.from({length:otN},(_,i)=>i):[0,1,2];const matches=[0,1].map(b=>keys.filter(k=>otValues(b,k).request===c.request));const weighted=matches.map((items,b)=>items.length*c.weights[b]);const total=weighted[0]+weighted[1];const answer=total===0?'impossible':weighted[0]===0?'zero':weighted[1]===0?'one':weighted[0]*2===total?'half':weighted[0]*4===total*3?'threequarters':null;return {keys,matches,weighted,total,answer};}
export function posteriorCreate(){return {selected:'full',trials:Object.fromEntries(Object.keys(posteriorCases).map(id=>[id,{answer:null,checked:false}])),reflection:null};}
export function posteriorDone(id,t){return !!posteriorCases[id]&&!!t&&t.checked&&t.answer===posteriorData(id).answer;}
export function posteriorComplete(s){return s.reflection==='prior'&&Object.keys(posteriorCases).every(id=>posteriorDone(id,s.trials[id]));}
export function posteriorRestore(saved){if(!saved||!Object.hasOwn(posteriorCases,saved.selected)||![null,'prior','certain','any'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=posteriorCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const id of Object.keys(posteriorCases)){const t=saved.trials?.[id];if(!t||![null,'zero','half','threequarters','one','impossible'].includes(t.answer)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です');s.trials[id]={answer:t.answer,checked:t.checked};}return s;}
