export const ipcOptions={pipe:'親子が引き継ぐ一方向パイプ',shared:'同一端末の共有メモリ',socket:'別端末への TCP 接続'};
export const ipcPrecautions={ends:'不要な書込み口を閉じ、終端まで読む',sync:'共有領域を読む・更新する順序を同期する',framing:'接続の失敗とバイト列の区切りを扱う'};
export const ipcChoiceCases={
  child:{name:'親から子への伝令',goal:'親が起動した子へ、一方向のバイト列を、引き継いだ口から送り終端を知らせる。',method:'pipe',precaution:'ends',detail:'書込み口が残ると空でも終端になりません。'},
  local:{name:'同じ棚を使う工房',goal:'同じ端末の２つの工房が、同じ記憶領域を直接読み書きする。',method:'shared',precaution:'sync',detail:'共有領域への同時アクセスは、適切な同期なしには安全になりません。'},
  remote:{name:'遠方の工房との接続',goal:'別端末の工房へ、接続型のバイト列として依頼と返事を届ける。',method:'socket',precaution:'framing',detail:'TCP のバイト列にはメッセージの境界がなく、接続エラーも扱います。'}
};
export function createIpcChoices(){return {selected:'child',trials:Object.fromEntries(Object.keys(ipcChoiceCases).map(id=>[id,{method:null,precaution:null,checked:false}]))};}
export function ipcChoiceCorrect(id,t){return t.checked&&t.method===ipcChoiceCases[id].method&&t.precaution===ipcChoiceCases[id].precaution;}
export function ipcChoicesComplete(s){return Object.keys(ipcChoiceCases).every(id=>ipcChoiceCorrect(id,s.trials[id]));}
export function restoreIpcChoices(saved){if(!saved||!Object.hasOwn(ipcChoiceCases,saved.selected)||!saved.trials)throw new RangeError('通信の記録が不正です。');const s=createIpcChoices();s.selected=saved.selected;for(const id of Object.keys(ipcChoiceCases)){const t=saved.trials[id];if(!t||!(t.method===null||Object.hasOwn(ipcOptions,t.method))||!(t.precaution===null||Object.hasOwn(ipcPrecautions,t.precaution))||typeof t.checked!=='boolean')throw new RangeError('通信の選択が不正です。');s.trials[id]={method:t.method,precaution:t.precaution,checked:t.checked};}return s;}
