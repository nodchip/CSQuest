import {test} from 'node:test';
import assert from 'node:assert/strict';
import {diagnosticLogs,diagnosticQuality,createDiagnostic,stepDiagnostic,diagnosticComplete,restoreDiagnostic} from '../src/diagnostic-logging.js';
test('both event orders and all field combinations retain only selected fields',()=>{
 for(let mask=0;mask<8;mask++){const fields={id:!!(mask&1),reason:!!(mask&2),name:!!(mask&4)},quality=diagnosticQuality(fields);for(const order of ['forward','reverse']){const logs=diagnosticLogs(fields,order);assert.equal(logs.length,2);for(const row of logs)for(const key of ['id','reason','name'])assert.equal(Object.hasOwn(row,key),fields[key]);assert.equal(quality.diagnosable,fields.id&&fields.reason);assert.equal(quality.minimal,!fields.name);}}assert.throws(()=>diagnosticLogs({id:true,reason:true,name:false},'bad'),RangeError);
});
test('ambiguous observation, both orders, minimal fields and a checked cause are required',()=>{
 let s=createDiagnostic();for(const action of ['test:forward','field:id','field:reason','test:forward','test:reverse','choice:delivery','check'])s=stepDiagnostic(s,action);assert.equal(diagnosticComplete(s),true);const copy=restoreDiagnostic({...s,fields:{id:false,reason:false,name:true}});assert.equal(diagnosticComplete(copy),true);s=stepDiagnostic(s,'field:name');assert.equal(diagnosticComplete(s),false);assert.throws(()=>restoreDiagnostic({history:['field:bad']}),RangeError);
});
