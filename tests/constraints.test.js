import test from 'node:test';
import assert from 'node:assert/strict';
import {connections,colors,available,deadEnd,createConstraints,assignColor,undoColor,restoreConstraints,constraintsComplete,reviseArc,arcSaturated,constraintArcs,domainProduct} from '../src/constraints.js';

test('a locally legal red A empties the future fixed-red tower and can be undone',()=>{
  let state=assignColor(createConstraints(),'red');assert.deepEqual(available(state.assigned,'D'),[]);assert.equal(deadEnd(state.assigned),true);
  state=undoColor(state);assert.equal(state.backtracked,true);
  for(const color of ['blue','red','green','red'])state=assignColor(state,color);
  assert.equal(constraintsComplete(state),false);for(const arc of ['AD','CD'])state=reviseArc(state,arc);state.arcAnswer='local';state.arcChecked=true;assert.equal(constraintsComplete(state),true);
});
test('arc consistency removes unsupported values but does not prove global support',()=>{
 let state=createConstraints();assert.equal(domainProduct(state.arcDomains),27);assert.equal(arcSaturated(state.arcDomains),false);state=reviseArc(state,'DA');assert.deepEqual(state.arcDomains.D,['red']);state=reviseArc(state,'AD');assert.equal(domainProduct(state.arcDomains),18);state=reviseArc(state,'CD');assert.equal(domainProduct(state.arcDomains),12);assert.equal(arcSaturated(state.arcDomains),true);
 assert.deepEqual(state.arcDomains.A,['blue','green']);assert.deepEqual(state.arcDomains.C,['blue','green']);assert.deepEqual(state.arcDomains.B,['red','blue','green']);
 for(const arc of constraintArcs){const [from,to]=arc;for(const color of state.arcDomains[from])assert.ok(state.arcDomains[to].some(other=>other!==color));}
 const values=Object.keys(colors);let withBlue=0;for(const a of values)for(const c of values)for(const d of values){const assignment={A:a,B:'blue',C:c,D:d};if(d==='red'&&connections.every(([x,y])=>assignment[x]!==assignment[y]))withBlue++;}assert.equal(withBlue,0);
 const saved=restoreConstraints({...state,arcAnswer:'local',arcChecked:true});assert.deepEqual(saved.arcDomains,state.arcDomains);assert.throws(()=>restoreConstraints({...state,arcHistory:['AB','ZZ']}));
});
test('old drafts retain their placements and start arc exploration afresh',()=>{const old={assigned:['blue'],witness:['red'],backtracked:true},state=restoreConstraints(old);assert.deepEqual(state.assigned,['blue']);assert.deepEqual(state.arcHistory,[]);assert.equal(arcSaturated(state.arcDomains),false);});
test('all complete assignments agree with independent edge and domain constraints',()=>{
  const names=['A','B','C','D'],valid=[];
  for(const a of Object.keys(colors))for(const b of Object.keys(colors))for(const c of Object.keys(colors))for(const d of Object.keys(colors)){
    const input=[a,b,c,d],expected=d==='red'&&connections.every(([x,y])=>input[names.indexOf(x)]!==input[names.indexOf(y)]);
    let state=createConstraints(),accepted=true;try{for(const color of input){const next=assignColor(state,color);if(next.assigned.length===state.assigned.length){accepted=false;break;}state=next;}}catch{accepted=false;}
    assert.equal(accepted&&state.assigned.length===4,expected);if(expected)valid.push(input);
  }
  assert.deepEqual(valid,[['blue','red','green','red'],['green','red','blue','red']]);
});
test('restoration validates dead-end evidence and copies choices',()=>{
  const state=undoColor(assignColor(createConstraints(),'red'));state.assigned=['blue'];const restored=restoreConstraints(state);
  state.assigned[0]='red';assert.deepEqual(restored.assigned,['blue']);assert.equal(restored.backtracked,true);
  assert.throws(()=>restoreConstraints({assigned:[],witness:['blue'],backtracked:true}),RangeError);
  assert.throws(()=>restoreConstraints({assigned:['blue','blue'],witness:null,backtracked:false}),RangeError);
});
