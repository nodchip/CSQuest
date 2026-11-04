import test from 'node:test';
import assert from 'node:assert/strict';
import {createIndexCommands,indexCommandCorrect,indexCommandSql,restoreIndexCommands} from '../src/index-command.js';
import {createIndexPlan,restoreIndexPlan} from '../src/index-plan.js';

test('the selected name, table and ordered columns form the requested command',()=>{
 const a={index:'idx_kind_price',table:'goods',columns:'kind_price',checked:true};
 assert.equal(indexCommandSql(a),'CREATE INDEX idx_kind_price ON goods (kind, price);');
 assert.equal(indexCommandCorrect('category',a),true);
 for(const changed of [{index:'idx_price_kind'},{table:'orders'},{columns:'price_kind'},{checked:false}])assert.equal(indexCommandCorrect('category',{...a,...changed}),false);
 const b={index:'idx_price_kind',table:'goods',columns:'price_kind',checked:true};
 assert.equal(indexCommandSql(b),'CREATE INDEX idx_price_kind ON goods (price, kind);');
 assert.equal(indexCommandCorrect('price',b),true);
 const c={index:'idx_kind',table:'goods',columns:'kind',checked:true};
 assert.equal(indexCommandSql(c),'CREATE INDEX idx_kind ON goods (kind);');
 assert.equal(indexCommandCorrect('single',c),true);
 assert.equal(indexCommandCorrect('single',{...c,columns:'kind_price'}),false);
});
test('old drafts initialize the activity and valid selections are copied',()=>{
 const old=createIndexPlan();delete old.commands;assert.deepEqual(restoreIndexPlan(old).commands,createIndexCommands());
 const s=createIndexCommands();s.answers.category={index:'idx_kind_price',table:'goods',columns:'kind_price',checked:true};old.commands=s;
 const restored=restoreIndexPlan(old);assert.deepEqual(restored.commands,s);restored.commands.answers.category.checked=false;assert.equal(s.answers.category.checked,true);
 const earlier=structuredClone(s);delete earlier.answers.single;assert.deepEqual(restoreIndexCommands(earlier).answers.single,{index:null,table:null,columns:null,checked:false});
 assert.throws(()=>restoreIndexCommands({...s,selected:'unknown'}));
 assert.throws(()=>restoreIndexCommands({...s,answers:{...s.answers,price:{index:null,table:null,columns:null,checked:true}}}));
});
