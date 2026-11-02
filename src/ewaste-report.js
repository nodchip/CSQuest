export const ewasteLevel={id:'workshop-ewaste-report',number:'860',kind:'ewaste-report',name:'世界の廃棄物と記録の行方',tag:'電子廃棄物と統計',title:'世界の記録を読み解こう',story:'工房の水晶や道具が使えなくなった後、どこへ行くのでしょう。鑑定士と世界の報告書を調べ、ギルドへ正確に伝えましょう。'};
// ITU/UNITAR Global E-waste Monitor 2024; rounded published masses, in million tonnes.
export const ewasteYears={'2010':{generated:34,documented:8},'2022':{generated:62,documented:13.8}};
export const ewasteAnswers={growth:['generated','documented','equal'],unknown:['uncertain','discarded','safe'],health:['risk','certain','none']};
export function ewasteStats(year){if(!Object.hasOwn(ewasteYears,year))throw new RangeError('年が不正です。');const {generated,documented}=ewasteYears[year];return {generated,documented,other:Math.round((generated-documented)*10)/10,rate:Math.round(documented/generated*1000)/10};}
export function ewasteCreate(){return {selected:'2010',viewed:[],answers:{growth:null,unknown:null,health:null}};}
export function ewasteView(q){ewasteStats(q.selected);if(!q.viewed.includes(q.selected))q.viewed.push(q.selected);}
export function ewasteComplete(q){return Object.keys(ewasteYears).every(year=>q.viewed.includes(year))&&q.answers.growth==='generated'&&q.answers.unknown==='uncertain'&&q.answers.health==='risk';}
export function ewasteRestore(q){
 if(!q||!Object.hasOwn(ewasteYears,q.selected)||!Array.isArray(q.viewed)||new Set(q.viewed).size!==q.viewed.length||q.viewed.some(year=>!Object.hasOwn(ewasteYears,year))||!q.answers)throw new RangeError('記録が不正です。');
 const answers={};for(const [key,choices] of Object.entries(ewasteAnswers)){if(q.answers[key]!==null&&!choices.includes(q.answers[key]))throw new RangeError('回答が不正です。');answers[key]=q.answers[key];}
 return {selected:q.selected,viewed:[...q.viewed],answers};
}
