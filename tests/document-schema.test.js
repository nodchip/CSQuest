import test from 'node:test';
import assert from 'node:assert/strict';
import {schemaSamples,validateDocument,createDocumentSchema,schemaComplete,restoreDocumentSchema} from '../src/document-schema.js';

test('all rule combinations independently match required and type constraints',()=>{
  for(let mask=0;mask<16;mask++){
    const rules={village:!!(mask&1),count:!!(mask&2),number:!!(mask&4),note:!!(mask&8)};
    for(const sample of Object.values(schemaSamples)){
      const d=sample.value;
      const expected=(!rules.village||'village' in d)&&(!rules.count||'count' in d)&&(!rules.note||'note' in d)&&(!('note' in d)||typeof d.note==='string')&&(!rules.number||!('count' in d)||(Number.isInteger(d.count)&&d.count>=0));
      assert.equal(validateDocument(rules,d).length===0,expected);
    }
  }
});
test('the desired schema and seven checked predictions are needed and restore safely',()=>{
  const s=createDocumentSchema();s.rules={village:true,count:true,number:true,note:false};
  const predictions={full:'accept',noNote:'accept',noVillage:'reject',noCount:'reject',negative:'reject',fraction:'reject',badNote:'reject'};
  for(const [id,prediction] of Object.entries(predictions))s.answers[id]={prediction,checked:true};
  assert.equal(schemaComplete(s),true);const copy=restoreDocumentSchema(s);copy.rules.note=true;assert.equal(schemaComplete(copy),false);assert.equal(s.rules.note,false);
  copy.rules.note=false;copy.answers.noNote.prediction='reject';assert.equal(schemaComplete(copy),false);
  assert.throws(()=>restoreDocumentSchema({...s,rules:{...s.rules,count:'yes'}}));
  assert.throws(()=>restoreDocumentSchema({...s,answers:{...s.answers,full:{prediction:null,checked:true}}}));
});
