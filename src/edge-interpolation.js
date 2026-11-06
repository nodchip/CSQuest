export const edgeValues=[-3,-2,-1,1,2,3];
export const edgeAnswers=['none','1/4','1/3','2/5','1/2','3/5','2/3','3/4'];

export function edgeIntersection(a,b){
 if(!edgeValues.includes(a)||!edgeValues.includes(b))throw new RangeError('端点の値が不正です。');
 if(Math.sign(a)===Math.sign(b))return 'none';
 let numerator=Math.abs(a),denominator=Math.abs(a)+Math.abs(b),x=numerator,y=denominator;
 while(y){const t=x%y;x=y;y=t;}
 return `${numerator/x}/${denominator/x}`;
}
export function edgeCreate(){return {a:-1,b:3,guess:null,checked:[],feedback:false};}
export function edgeSetValue(s,side,value){
 if(!['a','b'].includes(side)||!edgeValues.includes(value))throw new RangeError('端点の値が不正です。');
 s[side]=value;s.guess=null;s.feedback=false;
}
export function edgeChoose(s,guess){if(!edgeAnswers.includes(guess))throw new RangeError('選択が不正です。');s.guess=guess;s.feedback=false;}
export function edgeCorrect(s){return s.feedback&&s.guess!==null&&s.guess===edgeIntersection(s.a,s.b);}
export function edgeCheck(s){
 if(s.guess===null)throw new RangeError('交点の位置を選びましょう。');
 s.feedback=true;const ok=edgeCorrect(s),key=`${s.a}:${s.b}`;
 if(ok&&!s.checked.includes(key))s.checked.push(key);
 return ok;
}
export function edgeRestore(s){
 if(!s||!edgeValues.includes(s.a)||!edgeValues.includes(s.b)||![null,...edgeAnswers].includes(s.guess)||!Array.isArray(s.checked)||typeof s.feedback!=='boolean'||(s.feedback&&s.guess===null))throw new RangeError('途中記録が不正です。');
 const validKeys=new Set(edgeValues.flatMap(a=>edgeValues.map(b=>`${a}:${b}`)));
 if(new Set(s.checked).size!==s.checked.length||s.checked.some(k=>!validKeys.has(k)))throw new RangeError('途中記録が不正です。');
 return {a:s.a,b:s.b,guess:s.guess,checked:[...s.checked],feedback:s.feedback};
}
