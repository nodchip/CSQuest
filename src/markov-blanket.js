export const blanketGraphs={
 parent:{name:'親と共通の子',edges:[['P','X'],['X','C'],['Z','C'],['P','G']],nodes:['P','C','Z','G']},
 children:{name:'二つの子とその先',edges:[['X','A'],['X','B'],['W','B'],['B','D']],nodes:['A','B','W','D']}
};
export function blanketNodes(id){
 if(!Object.hasOwn(blanketGraphs,id))throw new RangeError('図が不正です。');
 const edges=blanketGraphs[id].edges,parents=edges.filter(([,b])=>b==='X').map(([a])=>a),children=edges.filter(([a])=>a==='X').map(([,b])=>b),others=edges.filter(([a,b])=>a!=='X'&&children.includes(b)).map(([a])=>a);
 return new Set([...parents,...children,...others]);
}
export function createBlanket(){return {selected:'parent',masks:{parent:0,children:0},checked:{parent:false,children:false}};}
export function blanketCorrect(s,id){const nodes=blanketGraphs[id].nodes,expected=blanketNodes(id);return s.checked[id]&&nodes.every((node,i)=>!!(s.masks[id]&(1<<i))===expected.has(node));}
export function blanketComplete(s){return Object.keys(blanketGraphs).every(id=>blanketCorrect(s,id));}
export function restoreBlanket(s){
 if(!s||!Object.hasOwn(blanketGraphs,s.selected)||!s.masks||!s.checked)throw new RangeError('記録が不正です。');const n=createBlanket();n.selected=s.selected;
 for(const id of Object.keys(blanketGraphs)){const mask=s.masks[id],checked=s.checked[id];if(!Number.isInteger(mask)||mask<0||mask>=1<<blanketGraphs[id].nodes.length||typeof checked!=='boolean')throw new RangeError('記録が不正です。');n.masks[id]=mask;n.checked[id]=checked;}return n;
}
