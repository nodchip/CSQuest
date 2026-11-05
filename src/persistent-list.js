import {createIdentityLab,restoreIdentityLab} from './identity-values.js';
export const persistentListLevel={id:'archive-persistent-list',number:'590',kind:'persistent-list',name:'枝分かれする記録の鎖',tag:'永続データ構造と共有',title:'古い巻物を残して鎖を変えよう',story:'書庫の二人が同じ記録を使っています。別の版を作ると、古い記録と共有された石はどうなるでしょう？'};
export const listModes=['mutable','persistent'];
export function listState(mode,stage){
 if(!listModes.includes(mode)||!Number.isInteger(stage)||stage<0||stage>2)throw new RangeError('状態が不正です。');
 const nodes={A:{value:1,next:'B'},B:{value:2,next:'C'},C:{value:3,next:null}},heads={old:'A'};
 if(stage>=1){nodes.X={value:0,next:'A'};heads.front='X';}
 if(stage>=2){if(mode==='mutable'){nodes.B.value=9;heads.changed='A';}else{nodes.D={value:9,next:'C'};nodes.P={value:1,next:'D'};heads.changed='P';}}
 const read=head=>{const result=[];for(let n=head;n!==null;n=nodes[n].next)result.push({id:n,value:nodes[n].value});return result;};
 return {nodes,heads,lists:Object.fromEntries(Object.entries(heads).map(([name,head])=>[name,read(head)])),newForChange:stage<2?null:mode==='mutable'?0:2};
}
export function createPersistentList(){return {mode:'persistent',trials:{persistent:{stage:0,guess:null,verified:false},mutable:{stage:0,guess:null,verified:false}},answer:null,checked:false,identity:createIdentityLab()};}
export function persistentListComplete(s){return listModes.every(mode=>s.trials[mode].verified)&&s.answer==='share'&&s.checked;}
export function restorePersistentList(saved){
 if(!saved||!listModes.includes(saved.mode)||!saved.trials||![null,'share','copyall','same'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('記録が不正です。');
 const result=createPersistentList();result.mode=saved.mode;result.answer=saved.answer;result.checked=saved.checked;
 for(const mode of listModes){const t=saved.trials[mode];if(!t||!Number.isInteger(t.stage)||t.stage<0||t.stage>2||![null,0,1,2,3].includes(t.guess)||typeof t.verified!=='boolean'||(t.verified&&(t.stage!==2||t.guess!==(mode==='mutable'?0:2))))throw new RangeError('試行の記録が不正です。');result.trials[mode]={stage:t.stage,guess:t.guess,verified:t.verified};}
 result.identity=saved.identity===undefined?createIdentityLab():restoreIdentityLab(saved.identity);return result;
}
