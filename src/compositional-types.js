export const ruleParts={number:{name:'数の石',options:{number:'数の石は数型',light:'数の石は灯り型'}},light:{name:'灯り',options:{light:'灯りは灯り型',number:'灯りは数型'}},plus:{name:'１を足す',options:{number:'数型の中身に１を足し、結果は数型',light:'灯り型の中身に１を足し、結果は灯り型'}},branch:{name:'分岐',options:{light:'条件は灯り型、両方の道は同じ型、結果はその型',number:'条件は数型、両方の道は同じ型、結果はその型'}}};
export const ruleExamples={number:{name:'数の石',term:['number']},light:{name:'灯り',term:['light']},nested:{name:'１を足す（１を足す（数の石））',term:['plus',['plus',['number']]]},badPlus:{name:'１を足す（灯り）',term:['plus',['light']]},branch:{name:'灯りなら１を足す（数の石）、そうでなければ数の石',term:['branch',['light'],['plus',['number']],['number']]},different:{name:'灯りなら数の石、そうでなければ灯り',term:['branch',['light'],['number'],['light']]}};
export const ruleAnswers={number:'数型',light:'灯り型',error:'型が付かない'};
// Each conclusion depends only on its immediate subterms and the selected local rule.
export function ruleDerivation(term,rules){
 const steps=[];
 function visit(node,path){
  const [kind,...children]=node;let result,reason;
  if(kind==='number'||kind==='light'){
   result=rules[kind];reason=`${ruleParts[kind].name}の規則で${ruleAnswers[result]}`;
  }else if(kind==='plus'){
   const inner=visit(children[0],`${path}の中身`), required=rules.plus;
   result=inner===required?required:'error';
   reason=inner==='error'?'中身に型が付かない':inner!==required?`中身は${ruleAnswers[inner]}だが、規則は${ruleAnswers[required]}を要求`:`中身が${ruleAnswers[required]}なので、規則の結果も${ruleAnswers[required]}`;
  }else if(kind==='branch'){
   const condition=visit(children[0],`${path}の条件`), left=visit(children[1],`${path}の点灯の道`), right=visit(children[2],`${path}の消灯の道`), required=rules.branch;
   if(condition==='error'||left==='error'||right==='error'){result='error';reason='型が付かない部分式がある';}
   else if(condition!==required){result='error';reason=`条件は${ruleAnswers[condition]}だが、規則は${ruleAnswers[required]}を要求`;}
   else if(left!==right){result='error';reason=`道の型が${ruleAnswers[left]}と${ruleAnswers[right]}で異なる`;}
   else{result=left;reason=`条件は${ruleAnswers[required]}、両方の道は${ruleAnswers[left]}なので、結果も${ruleAnswers[left]}`;}
  }else throw new RangeError('式が不正です');
  steps.push({path,result,reason});return result;
 }
 const result=visit(term,'式全体');return {result,steps};
}
export function ruleType(term,rules){return ruleDerivation(term,rules).result;}
export function ruleCreate(){return {rules:{number:null,light:null,plus:null,branch:null},example:'number',guess:null,checked:false,seen:[],rulesChecked:false};}
export function ruleCorrect(rules){return rules.number==='number'&&rules.light==='light'&&rules.plus==='number'&&rules.branch==='light';}
export function ruleRestore(s){if(!s||!s.rules||!Object.entries(ruleParts).every(([k,v])=>s.rules[k]===null||Object.hasOwn(v.options,s.rules[k]))||!Object.hasOwn(ruleExamples,s.example)||![null,...Object.keys(ruleAnswers)].includes(s.guess)||typeof s.checked!=='boolean'||s.checked&&(s.guess===null||Object.values(s.rules).includes(null))||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||!s.seen.every(k=>Object.hasOwn(ruleExamples,k))||typeof s.rulesChecked!=='boolean')throw new RangeError('規則の記録が不正です');return {...s,rules:{...s.rules},seen:[...s.seen]};}
