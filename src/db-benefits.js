export const benefitCases={
 unique:{name:'同じ番号の村',prompt:'番号11の村が既にある台帳に、同じ番号の別の村を登録します。',on:'一意性制約あり',off:'一意性制約なし',good:'登録は拒否される',issue:'同じ番号の２行が残る'},
 access:{name:'許可のない読み取り',prompt:'許可されていない配達係が、非公開の台帳を読もうとします。',on:'読み取り権限を制限',off:'全員に読み取りを許可',good:'読み取りは拒否される',issue:'台帳が読める'},
 atomic:{name:'途中で止まる受け渡し',prompt:'10束の倉庫から２束の倉庫へ３束を移します。差引きの後、追加と取引全体の確定の前に故障します。別々の保存では差引きを保存済みとします。',on:'２更新を原子的な取引にまとめる',off:'２更新を別々に保存',good:'復旧後は10束と２束',issue:'復旧後は７束と２束'},
 concurrent:{name:'二人で増やす数',prompt:'初期値０を二人がそれぞれ１増やします。保護なしでは二人とも０を読んでから１を書きます。',on:'二人の更新を順に実行',off:'読み書きが重なり更新が失われる順序',good:'最後は２',issue:'最後は１'}
};
export function createDbBenefits(){return {selected:'unique',mode:'off',answers:Object.fromEntries(Object.keys(benefitCases).map(k=>[k,{off:null,on:null}])),checked:Object.fromEntries(Object.keys(benefitCases).map(k=>[k,{off:false,on:false}]))};}
export function benefitCorrect(s,id,mode){return s.checked[id][mode]&&s.answers[id][mode]===(mode==='on'?'good':'issue');}
export function benefitsComplete(s){return Object.keys(benefitCases).every(id=>['off','on'].every(mode=>benefitCorrect(s,id,mode)));}
export function restoreDbBenefits(s){
 if(!s||!Object.hasOwn(benefitCases,s.selected)||!['on','off'].includes(s.mode)||!s.answers||!s.checked)throw new RangeError('記録が不正です。');
 const n=createDbBenefits();n.selected=s.selected;n.mode=s.mode;
 for(const id of Object.keys(benefitCases))for(const mode of ['off','on']){const a=s.answers[id]?.[mode],c=s.checked[id]?.[mode];if(![null,'good','issue'].includes(a)||typeof c!=='boolean'||(c&&a===null))throw new RangeError('記録が不正です。');n.answers[id][mode]=a;n.checked[id][mode]=c;}return n;
}
