export const dmaLevel={id:'workshop-dma',number:'132',kind:'dma',name:'宝石を運ぶ装置',tag:'入出力と DMA',title:'転送と別の仕事を進める',story:'工房の装置から宝石を４つ受け取ります。精霊が直接運ぶ方法と、運搬装置に任せる方法を比べましょう。'};
export const dmaModes={cpu:{name:'精霊が１つずつ転送'},dma:{name:'DMA に転送を任せる'}};
export const DMA_LIMIT=40;
export function createDmaTrial(mode){if(!Object.hasOwn(dmaModes,mode))throw new RangeError('方式が不正です。');return {mode,time:0,transferred:0,work:0,started:false,serviced:false,history:[],message:'宝石４つと、別の仕事３つがあります。'};}
export function dmaDone(s){return s.transferred===4&&s.work===3&&(s.mode==='cpu'||s.serviced);}
export function dmaStep(s,action){
 if(!['copy','setup','work','wait','finish'].includes(action))throw new RangeError('操作が不正です。');
 if(dmaDone(s)||s.history.length>=DMA_LIMIT)return {...s,message:'この試行は進められません。必要ならやり直しましょう。'};
 let reason='';if(action==='copy'&&(s.mode!=='cpu'||s.transferred===4))reason='直接転送できる宝石はありません。';
 if(action==='setup'&&(s.mode!=='dma'||s.started))reason='DMA はこの状態では開始できません。';
 if(action==='work'&&s.work===3)reason='別の仕事はすべて終わっています。';
 if(action==='wait'&&s.mode!=='dma')reason='この方式では待機操作を使いません。';
 if(action==='finish'&&(s.mode!=='dma'||!s.started||s.transferred!==4||s.serviced))reason='DMA の転送が終わってから完了を確認します。';
 if(reason)return {...s,message:reason};
 const n={...s,time:s.time+1,history:[...s.history,action]};
 if(action==='copy'){n.transferred++;n.message='精霊が宝石を１つ運びました。';}
 else if(action==='setup'){n.started=true;n.message='DMA を準備しました。次の刻から転送します。';}
 else if(action==='work'){n.work++;n.message='精霊が別の仕事を１つ終えました。';}
 else if(action==='wait')n.message='１刻待ちました。';
 else{n.serviced=true;n.message='DMA の完了を確認しました。';}
 if(s.mode==='dma'&&s.started&&!s.serviced&&s.transferred<4){n.transferred++;n.message+=' DMA が宝石を１つ運びました。';}
 if(dmaDone(n))n.message='転送と別の仕事がすべて終わりました！';return n;
}
export function createDma(){return {selected:'cpu',trials:{cpu:createDmaTrial('cpu'),dma:createDmaTrial('dma')}};}
export function dmaComplete(s){return Object.keys(dmaModes).every(mode=>dmaDone(s.trials[mode]));}
export function restoreDma(saved){if(!saved||!Object.hasOwn(dmaModes,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const r=createDma();r.selected=saved.selected;for(const mode of Object.keys(dmaModes)){const history=saved.histories[mode];if(!Array.isArray(history)||history.length>DMA_LIMIT)throw new RangeError('履歴が不正です。');for(const action of history){const before=r.trials[mode],after=dmaStep(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('履歴が不正です。');r.trials[mode]=after;}}return r;}
