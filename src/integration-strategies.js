export const integrationLevel={id:'village-integration-strategies',number:'249',kind:'integration-strategies',name:'三つの部品をつなぐ',tag:'統合戦略と試験の代役',title:'受取の仕組みを組み合わせよう',story:'薬草の受取には画面、受付、倉庫が必要です。三つの組み合わせ方で、途中の試験に何が必要か確かめましょう。'};
export const integrationModes={top:'上から順に統合',bottom:'下から順に統合',sandwich:'両端から統合'};
export const integrationParts={ui:'画面',service:'受付',store:'倉庫'};
export function runIntegration(built){if(!Array.isArray(built)||!built.length||new Set(built).size!==built.length||!built.every(id=>Object.hasOwn(integrationParts,id)))throw new RangeError('部品が不正です。');const trace=[],outputs=[],has=id=>built.includes(id);
 const store=amount=>{trace.push('倉庫');return 3-amount;},storeStub=amount=>{trace.push('倉庫の代役');return 1;};
 const service=(amount,repository)=>{trace.push('受付');return amount>0?repository(amount):null;},serviceStub=amount=>{trace.push('受付の代役');return 1;};
 const ui=handler=>{trace.push('画面');outputs.push(handler(2));};
 if(has('ui')){ui(has('service')?amount=>service(amount,has('store')?store:storeStub):serviceStub);if(has('store')&&!has('service')){trace.push('倉庫を呼ぶ試験役');outputs.push(store(2));}}
 else if(has('service')){trace.push('受付を呼ぶ試験役');outputs.push(service(2,has('store')?store:storeStub));}
 else{trace.push('倉庫を呼ぶ試験役');outputs.push(store(2));}return {trace,outputs};}
export function createIntegrationTrial(mode){if(!Object.hasOwn(integrationModes,mode))throw new RangeError('戦略が不正です。');return {mode,built:[],tested:false,history:[],message:'最初の部品を選びましょう。'};}
export function stepIntegration(s,action){if(s.history.length>=30||typeof action!=='string')throw new RangeError('操作が不正です。');const n={...s,built:[...s.built],history:[...s.history,action]},size=s.built.length;
 if(action==='test'){if(!size)n.message='先に部品を選びましょう。';else if(s.mode==='sandwich'&&size===1)n.message='両端の画面と倉庫をそろえてから試しましょう。';else{n.tested=true;n.message='この段階の部品を試しました。';}}
 else if(action.startsWith('build:')){const part=action.slice(6);if(!Object.hasOwn(integrationParts,part))throw new RangeError('部品が不正です。');const expected=s.mode==='top'?['ui','service','store'][size]:s.mode==='bottom'?['store','service','ui'][size]:size<2?(['ui','store'].find(id=>id===part&&!s.built.includes(id))||null):'service';if(size===3||s.built.includes(part))n.message='その部品はすでに組み込まれています。';else if(size>0&&!s.tested&&!(s.mode==='sandwich'&&size===1))n.message='先にこの段階を試しましょう。';else if(part!==expected)n.message='選んだ戦略の順序を確認しましょう。';else{n.built.push(part);n.tested=false;n.message=`${integrationParts[part]}を組み込みました。`;}}
 else throw new RangeError('操作が不正です。');return n;}
export function createIntegration(){return {selected:'top',trials:Object.fromEntries(Object.keys(integrationModes).map(mode=>[mode,createIntegrationTrial(mode)]))};}
export function integrationComplete(s){return Object.keys(integrationModes).every(mode=>s.trials[mode].built.length===3&&s.trials[mode].tested);}
export function restoreIntegration(saved){if(!saved||!Object.hasOwn(integrationModes,saved.selected)||!saved.trials)throw new RangeError('途中記録が不正です。');const n=createIntegration();n.selected=saved.selected;for(const mode of Object.keys(integrationModes)){const history=saved.trials[mode]?.history;if(!Array.isArray(history)||history.length>30)throw new RangeError('途中記録が不正です。');for(const action of history)n.trials[mode]=stepIntegration(n.trials[mode],action);}return n;}
