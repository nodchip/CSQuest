export const infiniteListsLevel={id:'archive-infinite-lists',number:'403',kind:'infinite-lists',name:'終わらない巻物の列',tag:'可算と対角線論法',title:'無限の巻物を並べよう',story:'書庫には終わりのない巻物があります。番号と偶数を対応させ、どんな一覧にも載らない列を作る方法を考えましょう。'};
export const diagonalRows=[[0,0,1,0],[1,1,0,1],[1,0,0,0],[1,1,1,1]];
export function createInfiniteLists(){return {paired:0,digits:[null,null,null,null],diagonalChecked:false,answer:null,checked:false};}
export function infinitePair(s,value){if(!Number.isInteger(value)||s.paired>=4||value!==s.paired*2)return null;return {...s,paired:s.paired+1,checked:false};}
export function diagonalValid(digits){return Array.isArray(digits)&&digits.length===4&&digits.every((v,i)=>[0,1].includes(v)&&v!==diagonalRows[i][i]);}
export function infiniteListsComplete(s){return s.paired===4&&s.diagonalChecked&&diagonalValid(s.digits)&&s.answer==='diagonal'&&s.checked;}
export function restoreInfiniteLists(s){if(!s||!Number.isInteger(s.paired)||s.paired<0||s.paired>4||!Array.isArray(s.digits)||s.digits.length!==4||!s.digits.every(v=>[null,0,1].includes(v))||typeof s.diagonalChecked!=='boolean'||(s.diagonalChecked&&!diagonalValid(s.digits))||![null,'diagonal','finite','prefix'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');return {paired:s.paired,digits:[...s.digits],diagonalChecked:s.diagonalChecked,answer:s.answer,checked:s.checked};}
