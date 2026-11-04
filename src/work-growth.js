export const workGrowthLevel={id:'archive-work-growth',number:'334',kind:'work-growth',name:'増える作業と六つの道具',tag:'作業の増え方',title:'石が増えたときの作業を予測しよう',story:'鑑定士は石を調べる六つの道具を比べています。石が増えたとき、それぞれ何回動くか予想しましょう。'};
export const workGrowthCases={linear:{name:'石を一つずつ調べる',description:'石１個につき１回調べます。',growth:'double'},pairs:{name:'二つの列を照合する',description:'同じ個数の二つの列で、左の各石と右の各石のすべての組を１回ずつ調べます。',growth:'fourfold'},halve:{name:'半分ずつ絞る',description:'候補を半分にし、１個になるまでの回数を数えます。個数は２のべきに限定します。',growth:'plusone'}};
export const workGrowthNumbers=[2,3,4,8,16,64];
export const extraGrowthCases={constant:{name:'決まった棚を一度見る',description:'石の個数によらず、指定された番号の棚を１回だけ参照します。'},subsets:{name:'石の組をすべて調べる',description:'石を使う・使わないを選び、空の組も含めた全部分集合を１回ずつ調べます。'},permutations:{name:'石の並べ方をすべて調べる',description:'異なる石を１列に並べるすべての順序を１回ずつ調べます。'}};
export const extraGrowthNumbers=[1,3,4,6,8,16,24];
export const growthScaleSizes=[4,8,16,32];
export function growthScale(n){
 if(!growthScaleSizes.includes(n))throw new RangeError('石の数が不正です。');
 let factorial=1n;for(let i=2n;i<=BigInt(n);i++)factorial*=i;
 return {constant:'1',halve:String(Math.log2(n)),linear:String(n),pairs:String(n*n),subsets:(2n**BigInt(n)).toString(),permutations:factorial.toString()};
}
export function extraWorkCount(id,n){if(!Object.hasOwn(extraGrowthCases,id)||![3,4].includes(n))throw new RangeError('場面が不正です');if(id==='constant')return 1;if(id==='subsets')return 2**n;let count=1;for(let i=2;i<=n;i++)count*=i;return count;}
export function createExtraGrowth(){return Object.fromEntries(Object.keys(extraGrowthCases).map(id=>[id,{three:null,four:null,checked:false}]));}
export function extraGrowthCorrect(id,c){return c.checked&&c.three===extraWorkCount(id,3)&&c.four===extraWorkCount(id,4);}
export function workCount(id,n){if(!Object.hasOwn(workGrowthCases,id)||![4,8].includes(n))throw new RangeError('場面が不正です');let count=0;if(id==='linear'){for(let i=0;i<n;i++)count++;}else if(id==='pairs'){for(let i=0;i<n;i++)for(let j=0;j<n;j++)count++;}else{for(let remaining=n;remaining>1;remaining/=2)count++;}return count;}
export function createWorkGrowth(){return {selected:'linear',choices:Object.fromEntries(Object.keys(workGrowthCases).map(id=>[id,{four:null,eight:null,checked:false,growth:null}])),checked:false,extra:createExtraGrowth(),scaleSize:4};}
export function workGrowthCorrect(id,c){return c.checked&&c.four===workCount(id,4)&&c.eight===workCount(id,8)&&c.growth===workGrowthCases[id].growth;}
export function workGrowthComplete(s){return s.checked&&Object.keys(workGrowthCases).every(id=>workGrowthCorrect(id,s.choices[id]))&&Object.keys(extraGrowthCases).every(id=>extraGrowthCorrect(id,s.extra[id]));}
export function restoreWorkGrowth(saved){if(!saved||!Object.hasOwn(workGrowthCases,saved.selected)||!saved.choices||typeof saved.checked!=='boolean'||saved.scaleSize!==undefined&&!growthScaleSizes.includes(saved.scaleSize))throw new RangeError('途中記録が不正です');const s=createWorkGrowth();s.selected=saved.selected;s.checked=saved.checked;s.scaleSize=saved.scaleSize??4;for(const id of Object.keys(workGrowthCases)){const c=saved.choices[id];if(!c||![null,...workGrowthNumbers].includes(c.four)||![null,...workGrowthNumbers].includes(c.eight)||![null,'double','fourfold','plusone'].includes(c.growth)||typeof c.checked!=='boolean')throw new RangeError('予想が不正です');s.choices[id]={four:c.four,eight:c.eight,checked:c.checked,growth:c.growth};}if(saved.extra!==undefined){for(const id of Object.keys(extraGrowthCases)){const c=saved.extra?.[id];if(!c||![null,...extraGrowthNumbers].includes(c.three)||![null,...extraGrowthNumbers].includes(c.four)||typeof c.checked!=='boolean')throw new RangeError('予想が不正です');s.extra[id]={three:c.three,four:c.four,checked:c.checked};}}return s;}
