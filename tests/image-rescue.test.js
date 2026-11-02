import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {imageCreate,imageAct,imageRestore,imageNeighbors} from '../src/image-rescue.js';

function run(s,...actions){for(const action of actions){const r=imageAct(s,action);assert.equal(r.ok,true,`${action}: ${r.message}`);s=r.state;}return s;}
function prepared(){let s=imageCreate();s=run(s,'move:observatory','rate:4','observe','rate:12','observe','record','move:camp','move:archive','format:png','pack','move:camp','move:display','channel:0','light','move:camp','move:press','cell:0','cell:3','print','move:camp');return s;}
test('adventure requires observation, valid media, display and print before the gate',()=>{
 let s=imageCreate();assert.equal(imageAct(s,'move:gate').ok,false);s=run(s,'move:display');assert.equal(imageAct(s,'light').ok,false);
 s=run(s,'move:camp','move:observatory','rate:12','observe');assert.equal(imageAct(s,'record').ok,false);
 s=run(s,'rate:4','observe','rate:8','record');assert.equal(s.sampleReady,false);
 s=run(s,'rate:12','record','move:camp','move:archive','pack');assert.equal(s.packageReady,false);
 s=run(s,'format:png','pack','move:camp','move:display','light');assert.equal(s.displayReady,false);
 s=run(s,'channel:0','light','move:camp','move:press','cell:0','cell:1','print');assert.equal(s.printReady,false);
 s=run(s,'cell:1','cell:3','print','move:camp','move:gate');assert.equal(s.place,'gate');
});
test('guardian failure returns to camp with preparations and a correct retry wins',()=>{
 let s=prepared();s=run(s,'move:gate','ward:eight','ward:any','ward:eight');assert.equal(s.place,'camp');assert.equal(s.health,3);assert.equal(s.round,0);assert.ok(s.sampleReady&&s.packageReady&&s.displayReady&&s.printReady);
 s=run(s,'move:gate','ward:fast','ward:two','move:festival');assert.equal(s.status,'won');
 assert.deepEqual(imageRestore(s),s);assert.equal(imageAct(s,'rest').ok,false);
 assert.throws(()=>imageRestore({history:['move:gate']}));
});
test('changing an assembled display or print invalidates that preparation',()=>{
 let s=prepared();s=run(s,'move:display','channel:0','move:camp');assert.equal(s.displayReady,false);assert.equal(imageAct(s,'move:gate').ok,false);
 s=run(s,'move:display','channel:0','light','move:camp','move:press','cell:0','move:camp');assert.equal(s.printReady,false);assert.equal(imageAct(s,'move:gate').ok,false);
 assert.deepEqual(imageNeighbors('gate'),['camp','festival']);
});
