export const diagnosisMethodsLevel={id:'workshop-diagnosis-methods',number:'1056',kind:'diagnosis-methods',name:'灯と鈴の診断書',tag:'規則・事例・モデルによる推論',title:'原因の候補を絞る',story:'灯と鈴を持つ伝令装置が故障しました。複数の推論方法と追加の検査を使い、装置を復旧しましょう。'};
export const diagnosisParts={battery:'魔力石',lamp:'灯の導線',bell:'鈴の導線'};
export const diagnosisScenes={wire:{name:'灯だけが消えた装置',faults:['lamp']},double:{name:'灯も鈴も消えた装置',faults:['lamp','bell']}};
export const diagnosisMethods={rule:'規則を使う',case:'過去の事例を使う',model1:'模型：故障は最大１つ',model2:'模型：故障は最大２つ'};
export const diagnosisCases=[{observed:{lamp:false,bell:true},faults:['lamp']},{observed:{lamp:false,bell:false},faults:['battery']}];
export function diagnosisObserve(faults){if(!Array.isArray(faults)||faults.some(f=>!Object.hasOwn(diagnosisParts,f))||new Set(faults).size!==faults.length)throw new RangeError('故障の指定が不正です。');return {lamp:!faults.includes('battery')&&!faults.includes('lamp'),bell:!faults.includes('battery')&&!faults.includes('bell')};}
export function diagnosisModel(observed,limit){
 if(!observed||typeof observed.lamp!=='boolean'||typeof observed.bell!=='boolean'||![1,2].includes(limit))throw new RangeError('観測が不正です。');
 const parts=Object.keys(diagnosisParts),candidates=[];
 for(let mask=0;mask<8;mask++){const faults=parts.filter((_,i)=>mask&(1<<i));if(faults.length>limit)continue;const result=diagnosisObserve(faults);if(result.lamp===observed.lamp&&result.bell===observed.bell)candidates.push(faults);}
 return candidates.filter(a=>!candidates.some(b=>b.length<a.length&&b.every(x=>a.includes(x))));
}
export function diagnosisSuggest(scene,method){
 if(!Object.hasOwn(diagnosisScenes,scene)||!Object.hasOwn(diagnosisMethods,method))throw new RangeError('診断方法が不正です。');
 const observed=diagnosisObserve(diagnosisScenes[scene].faults);
 if(method==='rule')return observed.lamp?[]:observed.bell?[['lamp']]:[['battery']];
 if(method==='case'){const found=diagnosisCases.find(x=>x.observed.lamp===observed.lamp&&x.observed.bell===observed.bell);return found?[[...found.faults]]:[];}
 return diagnosisModel(observed,method==='model1'?1:2);
}
export function diagnosisMethodsCreate(){return {scene:'wire',method:'rule',seen:[],probed:[],repairs:{wire:[],double:[]},reflection:null};}
export function diagnosisMethodsDone(q){return Object.keys(diagnosisScenes).every(s=>Object.keys(diagnosisMethods).every(m=>q.seen.includes(`${s}:${m}`)))&&q.probed.includes('double')&&q.repairs.wire.includes('lamp')&&['battery','lamp','bell'].every(x=>q.repairs.double.includes(x))&&q.reflection==='limits';}
export function diagnosisMethodsRestore(q){
 const scenes=Object.keys(diagnosisScenes),methods=Object.keys(diagnosisMethods),parts=Object.keys(diagnosisParts),valid=scenes.flatMap(s=>methods.map(m=>`${s}:${m}`));
 const validList=(list,allowed)=>Array.isArray(list)&&new Set(list).size===list.length&&list.every(x=>allowed.includes(x));
 if(!q||!scenes.includes(q.scene)||!methods.includes(q.method)||!validList(q.seen,valid)||!validList(q.probed,scenes)||!q.repairs||scenes.some(s=>!validList(q.repairs[s],parts))||![null,'limits','case','single'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 return {scene:q.scene,method:q.method,seen:[...q.seen],probed:[...q.probed],repairs:{wire:[...q.repairs.wire],double:[...q.repairs.double]},reflection:q.reflection};
}
