import test from 'node:test';
import assert from 'node:assert/strict';
import {createVerifyMessage,verifyMessageCorrect,verifyMessageComplete,restoreVerifyMessage} from '../src/independent-verification.js';
test('each case needs both observations and the response supported by its own evidence',()=>{const s=createVerifyMessage();s.trials.forged={read:true,verified:true,choice:'report',checked:true};s.trials.genuine={read:true,verified:false,choice:'visit',checked:true};assert.equal(verifyMessageComplete(s),false);s.trials.genuine.verified=true;assert.equal(verifyMessageComplete(s),true);assert.equal(verifyMessageCorrect('forged',{...s.trials.forged,choice:'visit'}),false);assert.deepEqual(restoreVerifyMessage(s),s);});
test('invalid saved choices are rejected',()=>{const s=createVerifyMessage();s.trials.forged.choice='unknown';assert.throws(()=>restoreVerifyMessage(s));});
