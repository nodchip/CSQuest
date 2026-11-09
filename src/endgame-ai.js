// Each history records only decisions verified against the fixed examples.
export const forecastCases=[
 {cloud:true,actual:'rain',rule:'cloud'},
 {cloud:false,actual:'sun',rule:'cloud'},
 {cloud:true,actual:'sun',rule:'cloud'},
 {cloud:true,actual:'rain',rule:'always'},
 {cloud:false,actual:'sun',rule:'always'},
 {cloud:true,actual:'sun',rule:'always'}
];
export function replayForecast(history){
 if(!Array.isArray(history))return null;let scene=0;const results=[];
 for(const action of history){
  if(scene<forecastCases.length){const task=forecastCases[scene],prediction=task.rule==='always'||task.cloud?'rain':'sun';if(action!==prediction)return null;results.push(prediction===task.actual);}
  else if(scene===6){if(action!=='cloud')return null;}
  else if(scene===7){if(action!=='uncertain')return null;}
  else return null;
  scene++;
 }
 return {scene,results,done:scene===8};
}
export const errorCases=[
 {prediction:'rain',actual:'rain',answer:'hit'},
 {prediction:'sun',actual:'rain',answer:'miss'},
 {prediction:'rain',actual:'sun',answer:'false-alarm'},
 {prediction:'sun',actual:'sun',answer:'clear'}
];
export function replayForecastErrors(history){
 if(!Array.isArray(history))return null;let scene=0;
 for(const action of history){if(scene<errorCases.length){if(action!==errorCases[scene].answer)return null;}else if(scene===4){if(action!=='B')return null;}else return null;scene++;}
 return {scene,done:scene===5};
}
