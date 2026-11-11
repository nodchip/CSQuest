import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replaySharingShelves as replay} from '../src/endgame-sharing-shelves.js';
const alt=['alternate:A','alternate:B','alternate:A','alternate:B'],group=['grouped:A','grouped:A','grouped:B','grouped:B'];
test('packed alternating has three transfers; separate has zero; grouped packed has one',()=>{assert.equal(replay('packed',[...alt,'answer:3']).alternate.moves,3);assert.equal(replay('separate',[...alt,'answer:0']).alternate.moves,0);const c=replay('compare',[...alt,...group,'answer:1']);assert.equal(c.alternate.moves,3);assert.equal(c.grouped.moves,1);assert.equal(c.done,true);});
test('wrong order and counts, unfinished and post-completion rejected; resume and reset',()=>{assert.equal(replay('packed',['alternate:B']),null);assert.equal(replay('packed',[...alt,'answer:0']),null);assert.equal(replay('compare',[...alt,'answer:1']),null);assert.equal(replay('packed',[...alt,'answer:3','reset']),null);assert.equal(replay('compare',alt.slice(0,2)).alternate.moves,1);assert.equal(replay('compare',[...alt.slice(0,2),'reset']).alternate.moves,0);});
