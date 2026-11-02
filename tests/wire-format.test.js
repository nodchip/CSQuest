import {test} from 'node:test';
import assert from 'node:assert/strict';
import {wireValues,wireModes,wireResult,wireCreate,wireRecord,wireComplete,wireRestore} from '../src/wire-format.js';

test('the two representations are independently checked against DataView', () => {
  for (const value of wireValues) for (const mode of wireModes) {
    const b=new ArrayBuffer(2), view=new DataView(b);
    view.setUint16(0,value,mode==='native');
    const expected=[view.getUint8(0),view.getUint8(1)];
    assert.deepEqual(wireResult(value,mode),{bytes:expected,received:view.getUint16(0,false)});
    assert.equal(view.getUint16(0,false)===value,mode==='agreed');
  }
});
test('each value and path must be checked with correct bytes and decoding, including restoration', () => {
  const q=wireCreate();
  for (const value of wireValues) for(const mode of wireModes) {
    q.value=value; q.mode=mode; const {bytes,received}=wireResult(value,mode);
    assert.throws(()=>wireRecord(q,[...bytes].reverse(),received));
    assert.throws(()=>wireRecord(q,bytes,received+1));
    wireRecord(q,bytes,received); assert.deepEqual(wireRestore(q),q);
  }
  assert.equal(wireComplete(q),false); q.answer='agreed'; assert.equal(wireComplete(q),true);
  const bad=structuredClone(q); bad.trials['native:1']=true; assert.throws(()=>wireRestore(bad));
});
