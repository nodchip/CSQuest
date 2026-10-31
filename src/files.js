export const filesLevel={id:'archive-file-links',number:'77',kind:'files',name:'消えない魔導書の謎',tag:'ファイル名と開いた参照',title:'書庫の名前と本を調べよう',story:'鑑定士が魔導書の名前を整理します。別名と、読み続ける精霊の手元を確かめてから、不要な名前を消しましょう。'};
export const fileActions={link:'別名「月」を作る',open:'本を開く',removeSun:'名前「太陽」を消す',removeMoon:'名前「月」を消す',read:'開いた本を読む',close:'本を閉じる'};
export function createFiles(){return {sun:true,moon:false,opened:false,linked:false,oneRemoved:false,anonymous:false,readAnonymous:false,done:false,history:[],message:'名前と本の実体を見ながら、操作を選びましょう。'};}
export function availableFileActions(state){
  if(state.done||state.history.length>=40)return [];
  return [state.sun&&!state.moon&&'link',(state.sun||state.moon)&&!state.opened&&'open',state.sun&&'removeSun',state.moon&&'removeMoon',state.opened&&'read',state.opened&&'close'].filter(Boolean);
}
export function stepFiles(state,action){
  if(!availableFileActions(state).includes(action))throw new RangeError('その操作はできません。');
  const next={...state,history:[...state.history,action]};
  if(action==='link'){next.moon=true;next.linked=true;next.message='「太陽」と「月」は同じ本を指します。内容の複製ではありません。';}
  if(action==='open'){next.opened=true;next.message='精霊が本を開き、名前とは別に読み続けるための参照を持ちました。';}
  if(action==='removeSun'){next.sun=false;if(next.linked&&next.moon)next.oneRemoved=true;next.message=next.moon?'「太陽」は消えましたが、「月」から同じ本を探せます。':'「太陽」の名前を消しました。';}
  if(action==='removeMoon'){next.moon=false;if(!next.sun&&next.opened&&next.oneRemoved)next.anonymous=true;next.message=!next.sun&&next.opened?'名前はなくなりましたが、開いている精霊は本を参照できます。':'「月」の名前を消しました。';}
  if(action==='read'){if(!next.sun&&!next.moon&&next.anonymous)next.readAnonymous=true;next.message='精霊は開いた本から「星の地図」を読みました。';}
  if(action==='close'){next.opened=false;next.done=!next.sun&&!next.moon&&next.readAnonymous;next.message=next.done?'最後の参照を閉じました。本の領域は再利用できる状態です。':'精霊は本を閉じました。';}
  return next;
}
export function restoreFiles(saved){
  if(!Array.isArray(saved)||saved.length>40)throw new RangeError('途中記録が不正です。');
  let state=createFiles();for(const action of saved)state=stepFiles(state,action);return state;
}
