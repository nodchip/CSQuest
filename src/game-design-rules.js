export const designRules={renew:'毎回、盾を補充',limited:'盾は全部で２回'};
export function designRulesCreate(){return {mode:'renew',histories:{renew:[],limited:[]},feel:null,answer:null};}
export function designRulesReplay(mode,history){
 if(!Object.hasOwn(designRules,mode)||!Array.isArray(history)||history.length>3||history.some(a=>!['guard','evade'].includes(a)))throw new RangeError('試練の記録が不正です。');
 let shields=2,blocked=0,evaded=0,hit=0;
 for(const action of history){if(action==='evade')evaded++;else if(mode==='renew'||shields>0){blocked++;if(mode==='limited')shields--;}else hit++;}
 return {steps:history.length,shields:mode==='limited'?shields:null,blocked,evaded,hit};
}
export function designRulesChallenge(q){const r=designRulesReplay('limited',q.histories.limited);return r.steps===3&&r.blocked===2&&r.evaded===1&&r.hit===0;}
export function designRulesDone(q){return Object.keys(designRules).every(k=>q.histories[k].length===3)&&designRulesChallenge(q)&&q.feel!==null&&q.answer==='options';}
export function designRulesRestore(q){if(!q||!Object.hasOwn(designRules,q.mode)||!q.histories||![null,'careful','free','other'].includes(q.feel)||![null,'options','same','everyone'].includes(q.answer))throw new RangeError('試練の記録が不正です。');const histories={};for(const mode of Object.keys(designRules)){designRulesReplay(mode,q.histories[mode]);histories[mode]=[...q.histories[mode]];}return {mode:q.mode,histories,feel:q.feel,answer:q.answer};}
