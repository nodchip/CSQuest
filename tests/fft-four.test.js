import test from 'node:test';
import assert from 'node:assert/strict';
import {fftCases,fftPairs,createFftTrial,stepFft,fftExpectedPair,fftExpectedOutput,createFftSet,fftComplete,restoreFftSet} from '../src/fft-four.js';

test('four-point decomposition matches the direct Fourier sum',()=>{
  const all=createFftSet();for(const [id,{input}] of Object.entries(fftCases)){let s=createFftTrial(id);for(const group of ['even','odd','even','odd'])s=stepFft(s,['split',group]);for(const key of fftPairs)s=stepFft(s,['pair',key,fftExpectedPair(s,key)]);for(let k=0;k<4;k++){const [real,imag]=fftExpectedOutput(s,k);let directReal=0,directImag=0;for(let n=0;n<4;n++){directReal+=input[n]*Math.cos(2*Math.PI*k*n/4);directImag-=input[n]*Math.sin(2*Math.PI*k*n/4);}assert.ok(Math.abs(real-directReal)<1e-9);assert.ok(Math.abs(imag-directImag)<1e-9);s=stepFft(s,['output',k,real,imag]);}assert.equal(s.phase,'done');all.trials[id]=s;}assert.ok(fftComplete(all));
});
test('wrong grouping and calculations do not advance; saved work replays',()=>{
  let s=createFftTrial('ramp');assert.equal(stepFft(s,['split','odd']).history.length,0);for(const group of ['even','odd','even','odd'])s=stepFft(s,['split',group]);assert.equal(stepFft(s,['pair','E0',2]).history.length,s.history.length);s=stepFft(s,['pair','E0',4]);const trials={pulse:{history:[],choice:createFftTrial('pulse').choice},ramp:{history:s.history,choice:s.choice}};assert.equal(restoreFftSet({selected:'ramp',trials}).trials.ramp.parts.E0,4);assert.throws(()=>restoreFftSet({selected:'ramp',trials:{...trials,ramp:{...trials.ramp,history:[['split','odd']]}}}));
});
