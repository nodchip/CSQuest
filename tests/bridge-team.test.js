import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bridgeAgendaOrder,bridgePeople,bridgeRoles,createBridgeTeam,bridgeTeamReview,bridgeTeamComplete,restoreBridgeTeam} from '../src/bridge-team.js';

function prepared(){const s=createBridgeTeam();s.agenda=[...bridgeAgendaOrder];s.heard=Object.keys(bridgePeople);s.schedule='late';s.alternative='boat';s.roles={safety:'engineer',notice:'courier',ferry:'operator'};return s;}
test('時間帯と代替手段の４通りで当事者の制約を区別する',()=>{
 for(const schedule of ['early','late'])for(const alternative of ['none','boat']){const s=prepared();s.schedule=schedule;s.alternative=alternative;const r=bridgeTeamReview(s);assert.equal(r.issues.includes('courier'),schedule==='early');assert.equal(r.issues.includes('resident'),schedule==='late'&&alternative==='none');assert.equal(r.ready,schedule==='late'&&alternative==='boat');}
});
test('役割の全64通りと会議の順序・聞き取りを検査する',()=>{
 for(const safety of Object.keys(bridgeRoles))for(const notice of Object.keys(bridgeRoles))for(const ferry of Object.keys(bridgeRoles)){const s=prepared();s.roles={safety,notice,ferry};assert.equal(bridgeTeamReview(s).ready,safety==='engineer'&&notice==='courier'&&ferry==='operator');}
 const s=prepared();s.heard.pop();assert.ok(bridgeTeamReview(s).issues.includes('heard'));s.heard=Object.keys(bridgePeople);s.agenda.reverse();assert.ok(bridgeTeamReview(s).issues.includes('agenda'));s.agenda=[...bridgeAgendaOrder];assert.equal(bridgeTeamComplete(s),false);s.checked=true;assert.equal(bridgeTeamComplete(s),true);
});
test('途中記録を検証し配列と役割を複製する',()=>{
 const s=prepared(),r=restoreBridgeTeam(s);r.heard.pop();r.roles.safety='resident';assert.equal(s.heard.length,3);assert.equal(s.roles.safety,'engineer');
 for(const p of [{agenda:['hear','hear']},{heard:['unknown']},{schedule:'bad'},{alternative:'bad'},{roles:{...s.roles,safety:'bad'}},{checked:1}])assert.throws(()=>restoreBridgeTeam({...s,...p}),RangeError);
});
