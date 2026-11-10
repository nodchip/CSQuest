// Grammar: expression = term ((+ | -) term)*; term = factor (* factor)*;
// factor = a single digit | '(' expression ')'. Trees omit parentheses.
export function parseExpression(tokens) {
 if(!Array.isArray(tokens))return null;
 let pos=0;
 function factor(){
  const t=tokens[pos++];
  if(typeof t==='string'&&/^[0-9]$/.test(t))return {number:Number(t)};
  if(t==='('){const x=expression();if(!x||tokens[pos++]!==')')return null;return x;}
  return null;
 }
 function term(){let left=factor();if(!left)return null;while(tokens[pos]==='*'){pos++;const right=factor();if(!right)return null;left={op:'*',left,right};}return left;}
 function expression(){let left=term();if(!left)return null;while(tokens[pos]==='+'||tokens[pos]==='-'){const op=tokens[pos++],right=term();if(!right)return null;left={op,left,right};}return left;}
 const tree=expression();return tree&&pos===tokens.length?tree:null;
}
export function evaluateExpression(tree){
 if(!tree||typeof tree!=='object')return null;
 if(Number.isInteger(tree.number)&&tree.number>=0&&tree.number<=9&&Object.keys(tree).length===1)return tree.number;
 if(!['+','-','*'].includes(tree.op)||Object.keys(tree).length!==3)return null;
 const a=evaluateExpression(tree.left),b=evaluateExpression(tree.right);
 if(a===null||b===null)return null;
 return tree.op==='+'?a+b:tree.op==='-'?a-b:a*b;
}

export const expressionCases={
 precedence:[['2','+','3','*','4'],['(','2','+','3',')','*','4']],
 association:[['7','-','2','-','1'],['7','-','(','2','-','1',')']],
 evaluate:[['2','+','3','*','4'],['(','2','+','3',')','*','4']],
};

// Merge adjacent number/subexpression cards, then reduce built subtrees.
export function replayExpression(kind,history){
 const cases=expressionCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,cards=[],ops=[],stage='build',done=false;
 const reset=()=>{const tokens=cases[scene];cards=tokens.filter(t=>/^[0-9]$/.test(t)).map(n=>({number:Number(n)}));ops=tokens.filter(t=>['+','-','*'].includes(t));stage='build';};
 reset();
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const target=parseExpression(cases[scene]);
  let m=/^merge:([0-9]+):([+*\-])$/.exec(action);
  if(stage==='build'&&m){const i=Number(m[1]),at=ops.indexOf(m[2]);if(i>=cards.length-1||at<0)return null;cards.splice(i,2,{op:m[2],left:cards[i],right:cards[i+1]});ops.splice(at,1);continue;}
  if(action==='check'&&stage==='build'&&cards.length===1&&JSON.stringify(cards[0])===JSON.stringify(target)){
   if(kind==='evaluate'){stage='evaluate';continue;}
   scene++;done=scene===cases.length;if(!done)reset();continue;
  }
  m=/^eval:(root|L|R)$/.exec(action);
  if(stage==='evaluate'&&m){const tree=cards[0],node=m[1]==='root'?tree:m[1]==='L'?tree.left:tree.right;if(!node?.op||node.left?.number===undefined||node.right?.number===undefined)return null;const a=node.left.number,b=node.right.number,value=node.op==='+'?a+b:node.op==='-'?a-b:a*b;if(m[1]==='root')cards[0]={number:value};else tree[m[1]==='L'?'left':'right']={number:value};continue;}
  if(action==='check'&&stage==='evaluate'&&cards[0]?.number===evaluateExpression(target)){scene++;done=scene===cases.length;if(!done)reset();continue;}
  return null;
 }
 return {scene,cards,ops,stage,done};
}
