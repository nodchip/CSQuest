export const indexCommandCases={
  category:{name:'種類を先に探す索引',index:'idx_kind_price',columns:'kind_price'},
  price:{name:'値段を先に探す索引',index:'idx_price_kind',columns:'price_kind'}
};
export const indexCommandColumns={kind_price:['kind','price'],price_kind:['price','kind']};
export function createIndexCommands(){return {selected:'category',answers:Object.fromEntries(Object.keys(indexCommandCases).map(id=>[id,{index:null,table:null,columns:null,checked:false}]))};}
export function indexCommandCorrect(id,a){const c=indexCommandCases[id];return !!c&&a.checked&&a.index===c.index&&a.table==='goods'&&a.columns===c.columns;}
export function indexCommandSql(a){if(!a.index||!a.table||!a.columns)return null;return `CREATE INDEX ${a.index} ON ${a.table} (${indexCommandColumns[a.columns].join(', ')});`;}
export function restoreIndexCommands(saved){
 if(saved===undefined)return createIndexCommands();
 if(!saved||!Object.hasOwn(indexCommandCases,saved.selected)||!saved.answers)throw new RangeError('索引の記録が不正です。');
 const s=createIndexCommands();s.selected=saved.selected;
 for(const id of Object.keys(indexCommandCases)){const a=saved.answers[id];if(!a||![null,'idx_kind_price','idx_price_kind'].includes(a.index)||![null,'goods','orders'].includes(a.table)||![null,'kind_price','price_kind'].includes(a.columns)||typeof a.checked!=='boolean'||(a.checked&&(!a.index||!a.table||!a.columns)))throw new RangeError('索引の記録が不正です。');s.answers[id]={index:a.index,table:a.table,columns:a.columns,checked:a.checked};}
 return s;
}
