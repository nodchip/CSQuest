export const boundsLevel = {id:'castle-pointer-bounds',number:'255',kind:'pointer-bounds',name:'境界の鍵を調べる',tag:'ポインタの範囲と権限',title:'宝箱の境界を守ろう',story:'同じ棚に並ぶ宝箱を、二種類の鍵で守ります。'};
export const boundsCases = {
 inside:{name:'箱の中を読む',address:5,size:1,write:false},
 neighbor:{name:'隣の箱へ書く',address:8,size:1,write:true},
 crossing:{name:'境界をまたいで読む',address:7,size:2,write:false},
 readonly:{name:'箱の中へ書く',address:5,size:1,write:true}
};
// This toy page covers 0..15 and permits reads and writes. The capability
// covers 4..7, permits reads only, and applies to every byte accessed.
export function boundsResult(id) {
 const c=boundsCases[id]; if(!Object.hasOwn(boundsCases,id)) throw new RangeError('操作が不正です。');
 return {page:c.address>=0&&c.address+c.size<=16,capability:c.address>=4&&c.address+c.size<=8&&!c.write};
}
export function createBounds(){return {selected:'inside',choices:Object.fromEntries(Object.keys(boundsCases).map(id=>[id,{page:null,capability:null,checked:false}]))};}
export function boundsCorrect(s,id){const c=s.choices[id],r=boundsResult(id);return c.checked&&c.page===r.page&&c.capability===r.capability;}
export function boundsComplete(s){return Object.keys(boundsCases).every(id=>boundsCorrect(s,id));}
export function restoreBounds(saved){
 if(!saved||!Object.hasOwn(boundsCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
 const s=createBounds();s.selected=saved.selected;
 for(const id of Object.keys(boundsCases)){const c=saved.choices[id];if(!c||![null,true,false].includes(c.page)||![null,true,false].includes(c.capability)||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');s.choices[id]={page:c.page,capability:c.capability,checked:c.checked};}
 return s;
}
