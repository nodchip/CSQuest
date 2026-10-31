export const mapRidgeLevel={id:'crystal-map-ridge',number:'435',kind:'map-ridge',name:'水晶の推定と事前の重み',tag:'最大事後推定・正則化',title:'記録と事前の重みを比べよう',story:'鑑定士は２回の測定値から、水晶の未知の係数を推定します。'};
export const ridgeLambdas=[0,2,6];
export const ridgeCandidates=[0,0.5,1,2];
export function ridgeScore(lambda,theta){if(!ridgeLambdas.includes(lambda)||!ridgeCandidates.includes(theta))throw new RangeError('重みか候補が不正です');const residual=2*(2-theta)**2,penalty=lambda*theta**2;return {residual,penalty,total:residual+penalty};}
export function ridgeBest(lambda){if(!ridgeLambdas.includes(lambda))throw new RangeError('重みが不正です');return 4/(2+lambda);}
export function createRidgeTrial(){return {candidate:0,tested:[],done:false};}
export function ridgeTrialValid(lambda,t){return t.tested.length===4&&new Set(t.tested).size===4&&t.candidate===ridgeBest(lambda);}
export function createMapRidge(){return {lambda:0,trials:{0:createRidgeTrial(),2:createRidgeTrial(),6:createRidgeTrial()},answer:null,checked:false};}
export function mapRidgeComplete(s){return ridgeLambdas.every(l=>s.trials[l].done&&ridgeTrialValid(l,s.trials[l]))&&s.answer==='map'&&s.checked;}
export function restoreMapRidge(s){if(!s||!ridgeLambdas.includes(s.lambda)||!s.trials||![null,'map','sure','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');const r=createMapRidge();r.lambda=s.lambda;r.answer=s.answer;r.checked=s.checked;for(const l of ridgeLambdas){const t=s.trials[l];if(!t||!ridgeCandidates.includes(t.candidate)||!Array.isArray(t.tested)||t.tested.length>4||new Set(t.tested).size!==t.tested.length||!t.tested.every(v=>ridgeCandidates.includes(v))||typeof t.done!=='boolean'||t.done&&!ridgeTrialValid(l,t))throw new RangeError('途中記録が不正です');r.trials[l]={candidate:t.candidate,tested:[...t.tested],done:t.done};}return r;}
