import test from 'node:test';
import assert from 'node:assert/strict';
import {createFieldValues,fieldValue,changeField,createFieldTrial,fieldStep,createClassField,classFieldComplete,restoreClassField} from '../src/class-field.js';

test('all six-operation sequences agree with independent class and instance models',()=>{
 const actions=[['a','charge'],['b','charge'],['a','clear'],['b','clear']];
 for(const mode of ['instance','shared']){function visit(values,a,b,depth){assert.equal(fieldValue(values,mode,'a'),a);assert.equal(fieldValue(values,mode,'b'),b);if(!depth)return;for(const [who,op] of actions){let nextA=a,nextB=b;if(mode==='shared'){nextA=nextB=op==='charge'?a+1:0;}else if(who==='a')nextA=op==='charge'?a+1:0;else nextB=op==='charge'?b+1:0;visit(changeField(values,mode,who,op),nextA,nextB,depth-1);}}visit(createFieldValues(mode),0,0,6);}
});
test('both modes require correct predictions and recorded history replays',()=>{
 const histories={instance:['chargeA','guessB:0','chargeB','guessA:1','clearA','guessB:1'],shared:['chargeA','guessB:1','chargeB','guessA:2','clearA','guessB:0']};
 for(const [mode,actions] of Object.entries(histories)){let t=createFieldTrial(mode);for(const action of actions)t=fieldStep(t,action);assert.equal(t.history.length,6);assert.throws(()=>fieldStep(t,'chargeA'));}
 const restored=restoreClassField({selected:'shared',histories,answer:'shared',checked:true});assert.equal(classFieldComplete(restored),true);assert.equal(classFieldComplete(createClassField()),false);assert.throws(()=>restoreClassField({selected:'instance',histories:{...histories,instance:['chargeA','guessB:1']},answer:null,checked:false}));
});
