export const vertexApproximationLevel={id:'forest-vertex-approximation',number:'415',kind:'vertex-approximation',name:'見張りの二倍の約束',tag:'頂点被覆の近似',title:'道を選んで見張りを置こう',story:'塔の間の道を見張ります。道を一つ選ぶたび、その両端に見張りを置きます。'};
export const approximationCases={middle:{name:'中央の道から',required:'BC'},outer:{name:'端の道から',required:'AB'}};
export const approximationEdges={AB:['A','B'],BC:['B','C'],CD:['C','D']};
export const labEdges={AB:['A','B'],AC:['A','C'],AD:['A','D'],BC:['B','C'],BD:['B','D'],CD:['C','D']};
export function createApproximationLab(){return {graph:['AB','BC','CD'],chosen:[]};}
export function labSelected(lab){return [...new Set(lab.chosen.flatMap(e=>labEdges[e]))];}
export function labRemaining(lab){const selected=labSelected(lab);return lab.graph.filter(e=>labEdges[e].every(v=>!selected.includes(v)));}
export function labChoose(lab,e){if(!labRemaining(lab).includes(e))throw new RangeError('未防衛の道を選んでください');return {...lab,chosen:[...lab.chosen,e]};}
export function labToggle(lab,e){if(!Object.hasOwn(labEdges,e))throw new RangeError('道が不正です');return {graph:lab.graph.includes(e)?lab.graph.filter(x=>x!==e):[...lab.graph,e],chosen:[]};}
export function labMinimum(lab){const vertices=['A','B','C','D'];let min=4;for(let mask=0;mask<16;mask++){if(lab.graph.every(e=>labEdges[e].some(v=>mask&(1<<vertices.indexOf(v)))))min=Math.min(min,vertices.filter((_,i)=>mask&(1<<i)).length);}return min;}
export function restoreApproximationLab(lab){if(!lab||!Array.isArray(lab.graph)||lab.graph.length>6||new Set(lab.graph).size!==lab.graph.length||!lab.graph.every(e=>Object.hasOwn(labEdges,e))||!Array.isArray(lab.chosen)||lab.chosen.length>2)throw new RangeError('途中記録が不正です');let current={graph:[...lab.graph],chosen:[]};for(const e of lab.chosen)current=labChoose(current,e);return current;}
export function createApproximationTrial(){return {edges:[],done:false};}
export function approximationSelected(t){return [...new Set(t.edges.flatMap(e=>approximationEdges[e]))];}
export function approximationRemaining(t){const selected=approximationSelected(t);return Object.keys(approximationEdges).filter(e=>approximationEdges[e].every(v=>!selected.includes(v)));}
export function approximationStep(t,e){if(!Object.hasOwn(approximationEdges,e)||!approximationRemaining(t).includes(e))throw new RangeError('まだ見張られていない道を選んでください');return {edges:[...t.edges,e],done:false};}
export function approximationTrialValid(id,t){return Object.hasOwn(approximationCases,id)&&t.edges[0]===approximationCases[id].required&&approximationRemaining(t).length===0;}
export function createVertexApproximation(){return {selected:'middle',trials:{middle:createApproximationTrial(),outer:createApproximationTrial()},answer:null,checked:false,lab:createApproximationLab()};}
export function vertexApproximationComplete(s){return Object.keys(approximationCases).every(id=>s.trials[id].done&&approximationTrialValid(id,s.trials[id]))&&s.answer==='matching'&&s.checked;}
export function restoreVertexApproximation(s){if(!s||!Object.hasOwn(approximationCases,s.selected)||!s.trials||![null,'matching','optimal','shared'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');const n=createVertexApproximation();n.selected=s.selected;n.answer=s.answer;n.checked=s.checked;if(s.lab!==undefined)n.lab=restoreApproximationLab(s.lab);for(const id of Object.keys(approximationCases)){const t=s.trials[id];if(!t||!Array.isArray(t.edges)||t.edges.length>2||typeof t.done!=='boolean')throw new RangeError('途中記録が不正です');let trial=createApproximationTrial();for(const e of t.edges)trial=approximationStep(trial,e);trial.done=t.done;if(t.done&&!approximationTrialValid(id,trial))throw new RangeError('途中記録が不正です');n.trials[id]=trial;}return n;}
