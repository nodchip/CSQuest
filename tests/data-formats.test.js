import test from 'node:test';
import assert from 'node:assert/strict';
import {createDataFormats,dataFormatCorrect,dataFormatsComplete,restoreDataFormats} from '../src/data-formats.js';

test('three representations require their matching classification and reading method',()=>{
  const state=createDataFormats();
  for(const [id,kind,method] of [['table','structured','columns'],['documents','semi','fields'],['story','unstructured','interpret']]){
    assert.equal(dataFormatCorrect(id,{kind,method}),true);
    for(const wrongKind of ['structured','semi','unstructured'].filter(x=>x!==kind))assert.equal(dataFormatCorrect(id,{kind:wrongKind,method}),false);
    for(const wrongMethod of ['columns','fields','interpret'].filter(x=>x!==method))assert.equal(dataFormatCorrect(id,{kind,method:wrongMethod}),false);
    state.answers[id]={kind,method,checked:true};
  }
  assert.equal(dataFormatsComplete(state),true);
  state.answers.story.checked=false;assert.equal(dataFormatsComplete(state),false);
});
test('partial, incorrect and complete choices restore without trusting invalid records',()=>{
  const state=createDataFormats();state.selected='documents';state.answers.table={kind:'structured',method:null,checked:false};state.answers.documents={kind:'structured',method:'fields',checked:true};
  assert.deepEqual(restoreDataFormats(state),state);assert.equal(dataFormatsComplete(state),false);
  for(const invalid of [{...state,selected:'other'},{...state,answers:{...state.answers,table:{kind:'other',method:null,checked:false}}},{...state,answers:{...state.answers,table:{kind:null,method:null,checked:true}}}])assert.throws(()=>restoreDataFormats(invalid));
});
