export const cryptoDesignLevel={id:'castle-crypto-design',number:'598',kind:'crypto-design',name:'鍵と仕組みを守るには',tag:'暗号の公開設計と鍵管理',title:'伝令の暗号を点検しよう',story:'王城では独自の秘密の仕組みで伝令を守っています。仕組みが知られた場合の鍵候補を調べ、これからの通信方法を選びましょう。'};
export const cryptoDesignCases={first:{name:'はじめの鍵',plain:2,cipher:5},rotated:{name:'鍵を変えた後',plain:2,cipher:1}};
export function shiftCipherValue(plain,key){if(!Number.isInteger(plain)||plain<0||plain>5||!Number.isInteger(key)||key<0||key>5)throw new RangeError('印か鍵が不正です。');return (plain+key)%6;}
export function candidateMatches(id,key){if(!Object.hasOwn(cryptoDesignCases,id))throw new RangeError('条件が不正です。');const c=cryptoDesignCases[id];return shiftCipherValue(c.plain,key)===c.cipher;}
const trial=()=>({tested:[],guess:null,checked:false});
export function createCryptoDesign(){return {selected:'first',trials:{first:trial(),rotated:trial()},choice:null,answer:null,checked:false};}
export function cryptoDesignTrialComplete(id,t){return t.checked&&t.guess!==null&&candidateMatches(id,t.guess)&&t.tested.some(k=>candidateMatches(id,k))&&t.tested.some(k=>!candidateMatches(id,k));}
export function cryptoDesignComplete(s){return Object.keys(cryptoDesignCases).every(id=>cryptoDesignTrialComplete(id,s.trials[id]))&&s.choice==='reviewed'&&s.answer==='keys'&&s.checked;}
export function restoreCryptoDesign(saved){
 if(!saved||!Object.hasOwn(cryptoDesignCases,saved.selected)||!saved.trials||![null,'reviewed','hidden','hardcoded'].includes(saved.choice)||![null,'keys','secretMethod','rotate'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const s=createCryptoDesign();s.selected=saved.selected;s.choice=saved.choice;s.answer=saved.answer;s.checked=saved.checked;
 for(const id of Object.keys(cryptoDesignCases)){const t=saved.trials[id];if(!t||!Array.isArray(t.tested)||new Set(t.tested).size!==t.tested.length||t.tested.some(n=>!Number.isInteger(n)||n<0||n>5)||!(t.guess===null||(Number.isInteger(t.guess)&&t.guess>=0&&t.guess<=5))||typeof t.checked!=='boolean')throw new RangeError('試行が不正です。');s.trials[id]={tested:[...t.tested],guess:t.guess,checked:t.checked};}
 return s;
}
