import test from 'node:test';
import assert from 'node:assert/strict';
import {replayStudyReview} from '../src/endgame-study-review.js';
test('participant information includes voluntary participation and omits coercion',()=>{
 const prefix=['toggle:purpose','toggle:voluntary','toggle:record','toggle:withdraw','toggle:risk'];
 assert.equal(replayStudyReview('explain',[...prefix,'check']),null);
 assert.equal(replayStudyReview('explain',[...prefix,'toggle:contact','toggle:force','check']),null);
 const done=[...prefix,'toggle:contact','check'];assert.equal(replayStudyReview('explain',done).done,true);assert.equal(replayStudyReview('explain',[...done,'check']),null);
});
test('individual records are not public and partial choices can be restored and corrected',()=>{
 const partial=['toggle:limit','toggle:public'];assert.deepEqual(replayStudyReview('protect',JSON.parse(JSON.stringify(partial))).selected,['limit','public']);
 assert.equal(replayStudyReview('protect',[...partial,'toggle:duration','toggle:separate','check']),null);
 assert.equal(replayStudyReview('protect',[...partial,'toggle:public','toggle:duration','toggle:separate','check']).done,true);
});
test('recruitment stays unavailable until correction, resubmission and approval notice',()=>{
 assert.equal(replayStudyReview('review',['recruit']),null);
 const partial=['submit','revise','resubmit'];assert.equal(replayStudyReview('review',[...partial,'recruit']),null);
 assert.equal(replayStudyReview('review',JSON.parse(JSON.stringify(partial))).step,3);
 const done=[...partial,'notice','recruit'];assert.equal(replayStudyReview('review',done).done,true);assert.equal(replayStudyReview('review',[...done,'recruit']),null);
 assert.equal(replayStudyReview('review',['submit','notice']),null);
});
