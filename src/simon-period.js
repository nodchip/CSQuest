export const simonLevel={id:'ruin-simon-period',number:'822',kind:'simon-period',name:'霧に隠れた周期',tag:'Simon のアルゴリズム',title:'測定の手がかりから周期を見つけよう',story:'遺跡の扉は、秘密の三つの紋章を反転すると同じ色に光ります。水晶の測定を重ねて、隠れた周期を見つけましょう。'};
export const simonCases={A:{secret:'101',samples:['000','010','101']},B:{secret:'011',samples:['000','100','011']}};
export const simonBits=Array.from({length:8},(_,i)=>i.toString(2).padStart(3,'0'));
export function simonDot(a,b){if(!simonBits.includes(a)||!simonBits.includes(b))throw new RangeError('紋章が不正です。');return [...a].reduce((n,c,i)=>n+Number(c)*Number(b[i]),0)%2;}
export function simonDistribution(secret){if(!simonBits.includes(secret)||secret==='000')throw new RangeError('周期が不正です。');return Object.fromEntries(simonBits.map(y=>[y,simonDot(secret,y)===0?.25:0]));}
export function simonCandidates(samples){return simonBits.filter(s=>s!=='000'&&samples.every(y=>simonDot(s,y)===0));}
export function simonReplay(id,history){
 if(!Object.hasOwn(simonCases,id)||!Array.isArray(history)||history.length>7)throw new RangeError('記録が不正です。');
 const {secret,samples}=simonCases[id],steps=[`sample:${samples[0]}`,'judge:none',`sample:${samples[1]}`,'judge:partial',`sample:${samples[2]}`,'judge:unique',`guess:${secret}`];
 const seen=[];for(let i=0;i<history.length;i++){if(history[i]!==steps[i])throw new RangeError('測定結果と残る周期候補を確かめましょう。');if(history[i].startsWith('sample:'))seen.push(history[i].slice(7));}
 return {seen,candidates:simonCandidates(seen),distribution:simonDistribution(secret),next:steps[history.length]??null};
}
export function simonCreate(){return {caseId:'A',histories:{A:[],B:[]},answer:null};}
export function simonStep(q,action){const h=q.histories[q.caseId];simonReplay(q.caseId,[...h,action]);h.push(action);}
export function simonComplete(q){return Object.keys(simonCases).every(id=>q.histories[id].length===7&&simonReplay(id,q.histories[id]).next===null)&&q.answer==='independent';}
export function simonRestore(q){if(!q||!Object.hasOwn(simonCases,q.caseId)||!q.histories||![null,'independent','once','all'].includes(q.answer))throw new RangeError('記録が不正です。');const n=simonCreate();n.caseId=q.caseId;n.answer=q.answer;for(const id of Object.keys(simonCases)){simonReplay(id,q.histories[id]);n.histories[id]=[...q.histories[id]];}return n;}
