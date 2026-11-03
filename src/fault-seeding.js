export const faultSeedLevel={id:'guild-fault-seeding',number:'1096',kind:'fault-seeding',name:'仕掛けを隠した試験場',tag:'欠陥埋め込みと推定',title:'見つからない仕掛けを推定しよう',story:'ギルドの試験場には元からの仕掛けと、試験のために加えた仕掛けがあります。いくつ見つかったかから、残りを推定しましょう。'};
export const seedScenes={balanced:{name:'似た見つけやすさ',planted:[0,0,2,2]},easy:{name:'加えた仕掛けが見つけやすい',planted:[0,0,0,0]},missed:{name:'加えた仕掛けを見つけられない',planted:[2,2,3,3]}};
export const seedDoors=['太陽','月','星','風'];
const original=[1,1,3,3];
export function seedExperiment(scene,mask){if(!Object.hasOwn(seedScenes,scene)||!Number.isInteger(mask)||mask<0||mask>15)throw new RangeError('試験条件が不正です');const found=xs=>xs.filter(i=>(mask&(1<<i))!==0).length,planted=found(seedScenes[scene].planted),natural=found(original);return {planted,natural,totalSeeded:4,estimatedTotal:planted?natural*4/planted:null,estimatedRemaining:planted?natural*4/planted-natural:null};}
// The assessment uses the same two doors in every scene; exploratory masks have their own results.
export function seedAnswerFeedback(scene,answer){
 if(!Object.hasOwn(seedScenes,scene)||![null,'four','two','unknown'].includes(answer))throw new RangeError('回答が不正です');
 if(answer===null)return '見積もりを選びましょう。';
 const r=seedExperiment(scene,3),correct=r.estimatedTotal===null?'unknown':r.estimatedTotal===4?'four':'two';
 if(r.estimatedTotal===null)return `${answer===correct?'その通りです。':'見直しましょう。'} 追加分の発見数が０件なので、０では割れず、この比率では推定できません。`;
 return `${answer===correct?'その通りです。':'見直しましょう。'} 追加分 ${r.planted}/4 と同じ割合だと仮定すると、元の発見 ${r.natural} × 4 ÷ ${r.planted} = ${r.estimatedTotal} 件です。`;
}
export const densityBaselines={low:{name:'過去の工房Ａ',defects:2,thousands:1},high:{name:'過去の工房Ｂ',defects:12,thousands:2}};
export function densityEstimate(id){if(!Object.hasOwn(densityBaselines,id))throw new RangeError('比較する記録が不正です');const c=densityBaselines[id],density=c.defects/c.thousands,total=density*3;return {density,total,remaining:total-3};}
export function seedCreate(){return {scene:'balanced',mask:3,results:{balanced:null,easy:null,missed:null},answers:{balanced:null,easy:null,missed:null},reflection:null,density:{selected:'low',answers:{low:null,high:null},reflection:null}};}
export function seedRun(q){return {...q,results:{...q.results,[q.scene]:q.mask}};}
export function seedDone(q){return Object.keys(seedScenes).every(id=>q.results[id]===3)&&q.answers.balanced==='four'&&q.answers.easy==='two'&&q.answers.missed==='unknown'&&q.reflection==='biased'&&q.density?.answers.low===6&&q.density?.answers.high===18&&q.density?.reflection==='context';}
export function seedRestore(q){if(!q||!Object.hasOwn(seedScenes,q.scene)||!Number.isInteger(q.mask)||q.mask<0||q.mask>15||!q.results||!q.answers||![null,'biased','guaranteed'].includes(q.reflection))throw new RangeError('途中記録が不正です');const s=seedCreate();s.scene=q.scene;s.mask=q.mask;s.reflection=q.reflection;for(const id of Object.keys(seedScenes)){const m=q.results[id],a=q.answers[id];if(!(m===null||Number.isInteger(m)&&m>=0&&m<=15)||![null,'four','two','unknown'].includes(a))throw new RangeError('途中記録が不正です');s.results[id]=m;s.answers[id]=a;}if(q.density!==undefined){const d=q.density;if(!d||!Object.hasOwn(densityBaselines,d.selected)||!d.answers||![null,'context','guaranteed'].includes(d.reflection))throw new RangeError('途中記録が不正です');s.density.selected=d.selected;s.density.reflection=d.reflection;for(const id of Object.keys(densityBaselines)){if(![null,6,12,18].includes(d.answers[id]))throw new RangeError('途中記録が不正です');s.density.answers[id]=d.answers[id];}}return s;}
