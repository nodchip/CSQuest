import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {journeyProfile,journeyProfileCorrect,journeyNotes,journeyCategories,journeySteps,journeyOrder,journeyRouteCorrect,journeyCreate,journeyCheckNote,journeyComplete,journeyRestore} from '../src/journey-map-workshop.js';

function permutations(xs){return xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>j!==i)).map(rest=>[x,...rest])):[[]];}
test('profile evidence and all route orders are independently checked',()=>{
 const options=Object.keys(journeyProfile);for(let mask=0;mask<1<<options.length;mask++){const selected=options.filter((_,i)=>mask&(1<<i));assert.equal(journeyProfileCorrect(selected),mask===3);}
 const routes=permutations(Object.keys(journeySteps));assert.equal(routes.length,24);for(const route of routes)assert.equal(journeyRouteCorrect(route),route.join(',')===journeyOrder.join(','));
 assert.throws(()=>journeyRouteCorrect(['start','start']));
});
test('each note, checked profile, route, improvement and reflection are required',()=>{
 for(const [id,n] of Object.entries(journeyNotes))for(const category of Object.keys(journeyCategories)){const q=journeyCreate();q.note=id;q.category=category;journeyCheckNote(q);assert.equal(q.last.correct,category===n.category);assert.equal(Object.hasOwn(q.notes,id),category===n.category);}
 const q=journeyCreate();q.selected=['schedule','offline'];q.profileChecked=true;for(const [id,n] of Object.entries(journeyNotes)){q.note=id;q.category=n.category;journeyCheckNote(q);}q.route=[...journeyOrder];q.routeChecked=true;q.improvement='paper';q.reflection='everyone';assert.equal(journeyComplete(q),false);q.reflection='limited';assert.equal(journeyComplete(q),true);
 const copy=journeyRestore(q);copy.route.pop();assert.equal(q.route.length,4);assert.throws(()=>journeyRestore({...q,last:{...q.last,correct:false}}));
});
