export const closureMachineLevel={id:'workshop-closure-machine',number:'774',kind:'closure-machine',name:'封印の記憶と帰り道',tag:'クロージャの環境と回収',title:'封印を呼び、記憶を守ろう',story:'精霊が作る加算の封印は、作成時の数を覚えています。呼出し元に同じ名前の別の数があるとき、どの箱が使われ、いつ片付けられるか調べましょう。'};
const actions=['enter','close','leave','outer-gc','call','compute','return','inner-gc','drop','outer-gc'];
export const closureMachineActions={enter:'作成役に２を渡す',close:'封印を作る',leave:'作成役から戻る','outer-gc':'作成時の箱を回収してみる',call:'封印に３を渡す',compute:'封印の結果を決める',return:'封印から戻る','inner-gc':'呼出し時の箱を回収する',drop:'封印を手放す'};
export function closureMachineState(history){
 if(!Array.isArray(history)||history.length>actions.length)throw new RangeError('履歴が不正です。');
 history.forEach((entry,i)=>{if(!entry||entry.action!==actions[i]||(entry.action==='compute'&&(entry.captured!==2||entry.result!==5)))throw new RangeError('履歴が不正です。');});
 const phase=history.length,outer=phase>=1&&phase<10,closure=phase>=2&&phase<10,inner=phase>=5&&phase<8,roots=['caller'];
 if(phase>=1&&phase<3)roots.push('outer');
 if(phase>=2&&phase<9)roots.push('closure');
 if(phase>=5&&phase<7)roots.push('inner');
 const edges={caller:[]};if(outer)edges.outer=[];if(closure)edges.closure=outer?['outer']:[];if(inner)edges.inner=outer?['outer']:[];
 const reached=new Set(),pending=[...roots];while(pending.length){const node=pending.pop();if(reached.has(node))continue;reached.add(node);pending.push(...(edges[node]||[]));}
 return {phase,outer,closure,inner,roots,reached:[...reached],frames:phase<1?['呼出し元']:phase<3?['呼出し元','作成役']:phase<5?['呼出し元']:phase<7?['呼出し元','封印の呼出し']:['呼出し元'],output:phase>=6?5:null};
}
export function closureMachineCreate(){return {history:[],captured:null,result:null,answer:'',checked:false};}
export function closureMachineStep(s,action){
 const state=closureMachineState(s.history),expected=actions[state.phase];if(!expected)return {ok:false,message:'この機械の操作は完了しています。'};if(action!==expected)return {ok:false,message:'今の枠、封印と箱の参照を確かめ、次にできる操作を選びましょう。'};
 if(action==='compute'&&(s.captured!==2||s.result!==5))return {ok:false,message:'封印の呼出しの箱から、封印が覚えている箱へたどってください。呼出し元の同名の箱ではありません。'};
 if(action==='outer-gc'&&state.phase===3&&!state.reached.includes('outer'))throw new Error('保持される箱に到達できません。');
 if(action==='inner-gc'&&state.reached.includes('inner'))throw new Error('使用中の箱は回収できません。');
 if(action==='outer-gc'&&state.phase===9&&state.reached.includes('outer'))throw new Error('使用中の箱は回収できません。');
 s.history.push(action==='compute'?{action,captured:s.captured,result:s.result}:{action});
 const messages={enter:'作成役の枠と、数２の箱を用意しました。',close:'封印に作成時の箱への参照を記録しました。',leave:'作成役は戻りましたが、返された封印が箱を参照しています。','outer-gc':state.phase===3?'封印から届く箱なので回収しません。':'封印も箱も根から届かないため、一緒に回収しました。',call:'封印が覚えた箱につながる呼出し時の箱に３を入れました。',compute:'作成時の２と引数３を足し、５を得ました。',return:'封印の呼出しは戻り、結果５を渡しました。','inner-gc':'呼出し時の箱は根から届かないため回収しました。',drop:'返された封印を手放しました。'};
 return {ok:true,message:messages[action]};
}
export function closureMachineComplete(s){return closureMachineState(s.history).phase===actions.length&&s.answer==='reachable'&&s.checked;}
export function closureMachineRestore(s){if(!s||![null,2,3,9].includes(s.captured)||![null,5,11,12].includes(s.result)||!['','reachable','stack','caller'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');closureMachineState(s.history);return {...closureMachineCreate(),...s,history:s.history.map(x=>({...x}))};}
