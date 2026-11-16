import {GATHERING_DEBUG_ENABLED,gatheringDebugState} from './debug-gathering-state.js?v=disabled1';

const prepare=document.querySelector('#prepare');
if(GATHERING_DEBUG_ENABLED){prepare.disabled=false;document.querySelector('#status').textContent='';}
document.querySelector('#prepare').addEventListener('click',()=>{
 if(!GATHERING_DEBUG_ENABLED)return;
 try{
  localStorage.setItem('csquest-debug-gathering-v1',JSON.stringify(gatheringDebugState()));
  location.href='./index.html?debug=gathering';
 }catch{document.querySelector('#status').textContent='デバッグ記録を保存できませんでした。';}
});
