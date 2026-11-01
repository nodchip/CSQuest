import {test} from 'node:test';
import assert from 'node:assert/strict';
import {formalCases,formalGroups,formalRepeats,formalTails,regularSamples,formalExpression,formalMatch,formalTarget,formalCorrect,backrefWords,backrefRequired,backrefMatch,createRegularExtensions,regularExtensionsComplete,restoreRegularExtensions} from '../src/regular-extensions.js';

test('すべての札の組合せを独立した正規表現と目標条件で照合する',()=>{
 let words=[''];for(let n=0;n<7;n++)words.push(...words.filter(w=>w.length===n).flatMap(w=>[w+'a',w+'b']));
 for(const group of formalGroups)for(const repeat of formalRepeats)for(const tail of formalTails){const t={group,repeat,tail},re=new RegExp(`^(?:${formalExpression(t)})$`,'u');for(const word of words)assert.equal(formalMatch(t,word),re.test(word));for(const id of Object.keys(formalCases))assert.equal(words.every(word=>formalMatch(t,word)===formalTarget(id,word)),formalCorrect(id,t));}
 assert.deepEqual(regularSamples.map(w=>formalTarget('endB',w)),[false,false,true,false,true,false,true]);
});
test('後方参照の一致を同じ長さの前半と後半の比較と照合する',()=>{
 for(const word of backrefWords){const half=word.length/2;assert.equal(backrefMatch(word),Number.isInteger(half)&&word.slice(0,half)===word.slice(half));}
 for(let i=0;i<6;i++)for(let j=0;j<6;j++){const prefix='a'.repeat(i)+'b',other='a'.repeat(j)+'b',same=prefix+prefix,different=other+prefix;const isSquare=w=>w.length%2===0&&w.slice(0,w.length/2)===w.slice(w.length/2);assert.equal(isSquare(same),true);assert.equal(isSquare(different),i===j);}
});
test('３条件と４観察と振り返りを検査して復元する',()=>{
 const s=createRegularExtensions();for(const id of Object.keys(formalCases))s.trials[id]={group:'either',repeat:'star',tail:formalCases[id].suffix,checked:true};s.seen=[...backrefRequired];s.answer='extension';assert.equal(regularExtensionsComplete(s),false);s.checked=true;assert.equal(regularExtensionsComplete(s),true);
 const r=restoreRegularExtensions(s);r.trials.all.tail='a';assert.equal(s.trials.all.tail,'none');
 for(const p of [{selected:'bad'},{word:6},{seen:[0,0]},{answer:'bad'},{checked:1},{trials:{...s.trials,all:{group:'bad',repeat:'one',tail:'none',checked:true}}}])assert.throws(()=>restoreRegularExtensions({...s,...p}),RangeError);
});
