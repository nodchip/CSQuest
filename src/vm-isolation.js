export const isolationModes={shared:'共用・Ｂを先に処理',capped:'各２個までに制限'};
export const isolationLoads={idle:'Ｂは休み',busy:'Ｂは３個を依頼'};
export function isolationResult(mode,load){
 if(!Object.hasOwn(isolationModes,mode)||!Object.hasOwn(isolationLoads,load))throw new RangeError('条件が不正です。');
 const demandB=load==='busy'?3:0,capacity=4;
 if(mode==='shared'){const b=Math.min(capacity,demandB);return {a:Math.min(4,capacity-b),b};}
 return {a:2,b:Math.min(2,demandB)};
}
export function createIsolation(){return {mode:'shared',load:'idle',choices:Object.fromEntries(Object.keys(isolationModes).map(m=>[m,Object.fromEntries(Object.keys(isolationLoads).map(l=>[l,{a:null,checked:false}]))])),answer:null,confirmed:false};}
export function isolationCorrect(s,mode,load){return s.choices[mode][load].checked&&s.choices[mode][load].a===isolationResult(mode,load).a;}
export function isolationComplete(s){return Object.keys(isolationModes).every(m=>Object.keys(isolationLoads).every(l=>isolationCorrect(s,m,l)))&&s.answer==='tradeoff'&&s.confirmed;}
export function restoreIsolation(s){if(!s||!Object.hasOwn(isolationModes,s.mode)||!Object.hasOwn(isolationLoads,s.load)||!s.choices||![null,'tradeoff','always','protects'].includes(s.answer)||typeof s.confirmed!=='boolean')throw new RangeError('途中記録が不正です。');const n=createIsolation();n.mode=s.mode;n.load=s.load;n.answer=s.answer;n.confirmed=s.confirmed;for(const m of Object.keys(isolationModes))for(const l of Object.keys(isolationLoads)){const c=s.choices[m]?.[l];if(!c||![null,0,1,2,3,4].includes(c.a)||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');n.choices[m][l]={a:c.a,checked:c.checked};}return n;}
