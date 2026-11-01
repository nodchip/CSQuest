export const fixedMultiplyLevel={id:'workshop-fixed-multiply',number:'711',kind:'fixed-multiply',name:'小数の灯りを掛け合わせる',tag:'固定小数点の乗算',title:'掛け算の途中を守ろう',story:'精霊は二つの小数の灯りを掛け合わせます。途中の桁を保ち、元の目盛りへ戻してから記録しましょう。'};
export const fixedMultiplyChoices=[-128,-24,-16,-8,1,8,24,32,48,127];
function fixedMultiplyRound(n){const lo=Math.floor(n/16),rem=n-lo*16;return (rem<8?lo:rem>8?lo+1:lo%2===0?lo:lo+1)||0;}
export function fixedMultiplyResult(a,b){
 if(!Number.isInteger(a)||!Number.isInteger(b)||a< -128||a>127||b< -128||b>127)throw new RangeError('入力が不正です。');
 const product=a*b,rounded=fixedMultiplyRound(product),inRange=rounded>=-128&&rounded<=127,low=(product&255),wrapped=low>=128?low-256:low,naive=fixedMultiplyRound(wrapped);
 return {a,b,product,productBits:(product&65535).toString(2).padStart(16,'0'),exact:product/256,rounded,tie:Math.abs(product)%16===8,inRange,value:inRange?rounded/16:null,byte:inRange?(rounded+256)%256:null,wrapped,naiveValue:naive/16};
}
export function createFixedMultiply(){return {a:48,b:32,observed:[],answer:null,checked:false};}
export function fixedMultiplyComplete(s){return s.checked&&['48,32','48,48','8,1','24,1','-24,24'].every(k=>s.observed.includes(k))&&s.answer==='wide';}
export function restoreFixedMultiply(s){if(!s||!fixedMultiplyChoices.includes(s.a)||!fixedMultiplyChoices.includes(s.b)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>{const m=/^(-?\d+),(-?\d+)$/.exec(k);return !m||!fixedMultiplyChoices.includes(Number(m[1]))||!fixedMultiplyChoices.includes(Number(m[2]))||`${Number(m[1])},${Number(m[2])}`!==k;})||![null,'wide','always','unchanged'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
