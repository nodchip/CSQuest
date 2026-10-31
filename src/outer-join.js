export const outerJoinLevel={id:'village-outer-join',number:'124',kind:'outerjoin',name:'薬草と棚の照らし合わせ',tag:'内部結合と左外部結合',title:'棚の見つからない薬草',story:'薬師が薬草の一覧と棚の記録を照らし合わせます。複数の棚がある薬草と、棚のない薬草を正しく伝えましょう。'};
export const herbRows={moon:{name:'月草'},star:{name:'星花'}};
export const shelfRows={a:{herb:'月草',shelf:'北の棚'},b:{herb:'月草',shelf:'南の棚'},c:{herb:'火花',shelf:'東の棚'}};
export const joinModes={inner:'内部結合',left:'左外部結合'};
export const joinPairs=Object.keys(herbRows).flatMap(herb=>[...Object.keys(shelfRows),'none'].map(shelf=>`${herb}:${shelf}`));
export function expectedPairs(mode){if(!Object.hasOwn(joinModes,mode))throw new RangeError('結合方法が不正です。');return Object.keys(herbRows).flatMap(herb=>{const matches=Object.keys(shelfRows).filter(shelf=>herbRows[herb].name===shelfRows[shelf].herb);return matches.length?matches.map(shelf=>`${herb}:${shelf}`):mode==='left'?[`${herb}:none`]:[];});}
export function joinCompleteCase(mode,c){const expected=expectedPairs(mode);return c.checked&&c.selected.length===expected.length&&expected.every(pair=>c.selected.includes(pair));}
export function createOuterJoin(){return {mode:'inner',choices:{inner:{selected:[],checked:false},left:{selected:[],checked:false}}};}
export function restoreOuterJoin(s){if(!s||!Object.hasOwn(joinModes,s.mode)||!s.choices)throw new RangeError('途中記録が不正です。');const state=createOuterJoin();state.mode=s.mode;for(const mode of Object.keys(joinModes)){const c=s.choices[mode];if(!c||!Array.isArray(c.selected)||new Set(c.selected).size!==c.selected.length||c.selected.some(pair=>!joinPairs.includes(pair))||typeof c.checked!=='boolean')throw new RangeError('結果が不正です。');state.choices[mode]={selected:c.selected.slice(),checked:c.checked};}return state;}
export function outerJoinComplete(state){return Object.keys(joinModes).every(mode=>joinCompleteCase(mode,state.choices[mode]));}
