export const workloadCases={frontHeavy:{name:'先頭追加が多い',front:3,tail:1},tailHeavy:{name:'末尾参照が多い',front:1,tail:3}};
// Independent four-item examples; each counted step has equal assumed cost.
export function workloadCost(id,mode){
 if(!Object.hasOwn(workloadCases,id)||!['array','linked'].includes(mode))throw new RangeError('条件が不正です。');
 const c=workloadCases[id];return mode==='array'?c.front*5+c.tail:c.front*2+c.tail*4;
}
export function createWorkloads(){return {selected:'frontHeavy',answers:{frontHeavy:null,tailHeavy:null},checked:{frontHeavy:false,tailHeavy:false}};}
export function workloadCorrect(s,id){return s.checked[id]&&s.answers[id]===(workloadCost(id,'array')<workloadCost(id,'linked')?'array':'linked');}
export function workloadsComplete(s){return Object.keys(workloadCases).every(id=>workloadCorrect(s,id));}
export function restoreWorkloads(s){
 if(!s||!Object.hasOwn(workloadCases,s.selected)||!s.answers||!s.checked)throw new RangeError('記録が不正です。');const n=createWorkloads();n.selected=s.selected;
 for(const id of Object.keys(workloadCases)){const a=s.answers[id],c=s.checked[id];if(![null,'array','linked'].includes(a)||typeof c!=='boolean'||(c&&a===null))throw new RangeError('記録が不正です。');n.answers[id]=a;n.checked[id]=c;}return n;
}
