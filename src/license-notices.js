export const licenseLevel={id:'guild-license-notices',number:'269',kind:'license-notices',name:'魔導書の利用条件',tag:'ソフトウェアライセンス',title:'配る前に条件を調べよう',story:'工房で改変した魔導書を配るため、二つの利用条件を読み比べます。'};
export const licenseCases={mit:'MIT',gpl:'GPL-3.0'};
export const licenseItems={notices:'元の著作権表示と許諾表示を残す',changes:'変更したことを明示する',same:'改変した全体を GPL-3.0 で許諾する'};
export const licenseExpected={mit:{notices:true,changes:false,same:false},gpl:{notices:true,changes:true,same:true}};
export function createLicense(){return {selected:'mit',answers:{mit:{notices:false,changes:false,same:false,checked:false},gpl:{notices:false,changes:false,same:false,checked:false}}};}
export function licenseCorrect(s,id){if(!Object.hasOwn(licenseCases,id))throw new RangeError('条件が不正です。');const answer=s.answers[id];return answer.checked&&Object.keys(licenseItems).every(k=>answer[k]===licenseExpected[id][k]);}
export function licenseComplete(s){return Object.keys(licenseCases).every(id=>licenseCorrect(s,id));}
export function restoreLicense(saved){if(!saved||!Object.hasOwn(licenseCases,saved.selected)||!saved.answers)throw new RangeError('途中記録が不正です。');const s=createLicense();s.selected=saved.selected;for(const id of Object.keys(licenseCases)){const a=saved.answers[id];if(!a||![...Object.keys(licenseItems),'checked'].every(k=>typeof a[k]==='boolean'))throw new RangeError('途中記録が不正です。');s.answers[id]=Object.fromEntries([...Object.keys(licenseItems),'checked'].map(k=>[k,a[k]]));}return s;}
