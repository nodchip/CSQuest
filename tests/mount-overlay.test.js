import test from 'node:test';
import assert from 'node:assert/strict';
import {createMount,mountStep,mountComplete,restoreMount} from '../src/mount-overlay.js';
test('path lookup follows the mount while an existing reference still reads the original object',()=>{let s=createMount();for(const action of ['readPath','open','mount','readPath'])s=mountStep(s,action);assert.match(s.message,/新しい案内/);s=mountStep(s,'readHandle');assert.match(s.message,/古い案内/);s=mountStep(s,'unmount');s=mountStep(s,'readPath');assert.match(s.message,/古い案内/);assert.equal(mountComplete(s),true);assert.deepEqual(restoreMount(s),s);});
test('opening only after mounting cannot establish the earlier reference and invalid history is rejected',()=>{let s=createMount();s=mountStep(s,'mount');assert.equal(mountStep(s,'open').opened,false);assert.equal(mountComplete(s),false);assert.throws(()=>restoreMount({history:['mount','open']}));});
