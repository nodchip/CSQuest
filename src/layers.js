export const layersLevel={id:'layered-message',number:'78',kind:'layers',name:'四重の封をした伝言',tag:'通信の階層とカプセル化',title:'伝言を中継塔へ届けよう',story:'ギルドから遠い村へ伝言を送ります。階層ごとに封を重ね、中継塔で区間の宛先を付け替えて届けましょう。'};
export const layerAddresses={S:'ギルドの端末',W:'中継塔の西口',E:'中継塔の東口',D:'村の端末'};
export const layerActions={transport:'配送の封を重ねる',network:'目的地の封を重ねる',send:'この区間に送る',link:'区間の封を外す',networkOpen:'目的地の封を外す',transportOpen:'配送の封を外す',deliver:'伝言を読む'};
export function createLayers(){return {phase:'transport',source:null,destination:null,history:[],message:'伝言に配送の封を重ねましょう。'};}
export function stepLayers(state,action){
  if(state.phase==='done'||state.history.length>=80||typeof action!=='string')throw new RangeError('操作できません。');
  if(action.startsWith('source:')||action.startsWith('destination:')){
    const [field,value]=action.split(':');if(!['first','second'].includes(state.phase)||!Object.hasOwn(layerAddresses,value))throw new RangeError('宛先を選べません。');
    return {...state,[field]:value,history:[...state.history,action],message:'区間の送り元と送り先を選んでください。'};
  }
  if(!Object.hasOwn(layerActions,action))throw new RangeError('未知の操作です。');
  const expected={transport:'transport',network:'network',first:'send',second:'send',link:'link',networkOpen:'networkOpen',transportOpen:'transportOpen',deliver:'deliver'}[state.phase];
  if(action!==expected)return {...state,message:'外側の封と現在の場所を確認して、次の操作を選びましょう。'};
  if(state.phase==='first'||state.phase==='second'){
    const pair=state.phase==='first'?['S','W']:['E','D'];
    if(state.source!==pair[0]||state.destination!==pair[1])return {...state,message:'この区間の送り元と次の受け手を確かめましょう。目的地の封の宛先は最後の村のままです。'};
  }
  const phases={transport:'network',network:'first',first:'second',second:'link',link:'networkOpen',networkOpen:'transportOpen',transportOpen:'deliver',deliver:'done'};
  const messages={transport:'配送の封を重ねました。次は目的地の封です。',network:'ギルドから村までを示す目的地の封を重ねました。',first:'中継塔が区間の封を外し、次の区間を選びます。目的地の封は残ります。',second:'村の端末に届きました。外側の区間の封から外しましょう。',link:'区間の封を外しました。',networkOpen:'目的地の封を外しました。',transportOpen:'配送の封を外しました。',deliver:'村が伝言を読みました！'};
  return {...state,phase:phases[state.phase],source:null,destination:null,history:[...state.history,action],message:messages[state.phase]};
}
export function restoreLayers(saved){if(!Array.isArray(saved)||saved.length>80)throw new RangeError('途中記録が不正です。');let state=createLayers();for(const action of saved){const next=stepLayers(state,action);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}return state;}
