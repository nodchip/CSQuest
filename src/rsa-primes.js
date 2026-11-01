import {modularPower} from './homomorphic-product.js';
export const rsaPrimesLevel={id:'castle-rsa-primes',number:'599',kind:'rsa-primes',name:'素数で作る鍵の輪',tag:'素数と RSA の鍵',title:'公開の数と秘密の因数を調べよう',story:'城の公開の封には55と３が記されています。二つの素数から、封を閉じる手順と開く手順がどう結び付くか確かめましょう。'};
export const rsaPrimeAnswers=['factors:5,11','phi:40','exponent:3','inverse:27','encrypt:23','decrypt:12'];
export function rsaPrimeFacts(){return {n:5*11,phi:4*10,publicExponent:3,privateExponent:27,cipher:modularPower(12,3,55),opened:modularPower(23,27,55),badA:modularPower(2,5,55),badB:modularPower(7,5,55)};}
export function createRsaPrimes(){return {history:[],factors:[],badSeen:false,answer:null,checked:false,message:'55を二つの異なる素数に分けましょう。'};}
export function rsaPrimeStep(s,action){
 const stage=s.history.length;if(stage>=rsaPrimeAnswers.length)throw new RangeError('操作は完了しています。');
 if(stage===2&&action==='exponent:5')return {...s,badSeen:true,message:'５と40には５という共通の約数があり、５倍して余り１になる数はありません。しかも２と７はどちらも32に変わります。'};
 if(stage===2&&action==='exponent:3'&&!s.badSeen)return {...s,message:'先に５を試し、使えない理由を調べましょう。'};
 if(action!==rsaPrimeAnswers[stage])return {...s,message:['二つの異なる素数を掛けて55になるか確認しましょう。','５と11から４×10を計算しましょう。','40と共通の約数が１だけの指数を選びます。','３倍して40で割った余りが１になる数を探します。','12を３乗し、55で割った余りを選びましょう。','23を27乗し、55で割った余りを選びましょう。'][stage]};
 return {...s,history:[...s.history,action],factors:[],checked:false,message:['５×11＝55です。','５と11が異なる素数なので、40通りになります。','３は40と互いに素です。','３×27＝81、40で割ると余り１です。','12を封じると23です。','23を開くと12です。'][stage]};
}
export function rsaPrimesComplete(s){return s.history.length===rsaPrimeAnswers.length&&s.badSeen&&s.answer==='factors'&&s.checked;}
export function restoreRsaPrimes(saved){
 if(!saved||!Array.isArray(saved.history)||saved.history.length>rsaPrimeAnswers.length||!Array.isArray(saved.factors)||saved.factors.length>2||new Set(saved.factors).size!==saved.factors.length||saved.factors.some(n=>![3,5,7,11].includes(n))||typeof saved.badSeen!=='boolean'||![null,'factors','publicSafe','allPrime'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 if(saved.history.length>=3&&!saved.badSeen)throw new RangeError('指数の試行が不足しています。');let s=createRsaPrimes();if(saved.badSeen){s.badSeen=true;}for(const a of saved.history){const next=rsaPrimeStep(s,a);if(next.history.length!==s.history.length+1)throw new RangeError('履歴が不正です。');s=next;}
 return {...s,factors:[...saved.factors],answer:saved.answer,checked:saved.checked};
}
