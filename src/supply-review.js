export const supplyReviewLevel={id:'castle-supply-review',number:'1075',kind:'supply-review',name:'外部の道具と隠れた依存先',tag:'依存関係と安全な更新',title:'薬草台帳の道具を調べる',story:'台帳を作る道具が外部の部品に頼っています。使う版と依存先を確認し、安全な更新候補を探しましょう。'};
export const supplyCases={
 old:{name:'現在の版',parent:'1.0',dependency:'1.0',expected:'A1',received:'A1',advisory:true,compatible:true,decision:'hold',reason:'advisory'},
 altered:{name:'修正版の受取りに差異',parent:'1.1',dependency:'1.1',expected:'B2',received:'X9',advisory:false,compatible:true,decision:'hold',reason:'integrity'},
 fixed:{name:'互換のある修正版',parent:'1.1',dependency:'1.1',expected:'B2',received:'B2',advisory:false,compatible:true,decision:'stage',reason:'checks'},
 major:{name:'新しい主要版',parent:'2.0',dependency:'2.0',expected:'C3',received:'C3',advisory:false,compatible:false,decision:'hold',reason:'compatibility'}
};
export function supplyCreate(){return {current:'old',cases:Object.fromEntries(Object.keys(supplyCases).map(id=>[id,{path:false,integrity:false,advisory:false,tested:false,decision:null,reason:null,checked:false}])),reflection:null};}
export function supplyCanTest(id,state){const c=supplyCases[id];return !!c&&state.path&&state.integrity&&c.expected===c.received;}
export function supplyCaseDone(id,state){const c=supplyCases[id];return !!c&&state.path&&state.integrity&&state.advisory&&(c.expected!==c.received?!state.tested:state.tested)&&state.decision===c.decision&&state.reason===c.reason&&state.checked;}
export function supplyDone(q){return Object.keys(supplyCases).every(id=>supplyCaseDone(id,q.cases[id]))&&q.reflection==='limits';}
export function supplyRestore(q){
 if(!q||!Object.hasOwn(supplyCases,q.current)||![null,'limits','guarantee'].includes(q.reflection)||!q.cases)throw new RangeError('途中記録が不正です。');
 const result=supplyCreate();result.current=q.current;result.reflection=q.reflection;
 for(const id of Object.keys(supplyCases)){const s=q.cases[id];if(!s||!['path','integrity','advisory','tested','checked'].every(x=>typeof s[x]==='boolean')||![null,'hold','stage'].includes(s.decision)||![null,'advisory','integrity','checks','compatibility'].includes(s.reason)||(s.tested&&!supplyCanTest(id,s))||(s.checked&&!supplyCaseDone(id,s)))throw new RangeError('確認記録が不正です。');result.cases[id]={...s};}
 return result;
}
