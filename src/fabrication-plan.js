// 工房の仮定に基づく見積もり。実際の加工費や時間ではない。
export const fabricationPlans = {
  add: {name: '積層', setupCost: 4, unitCost: 3, setupMinutes: 10, unitMinutes: 15},
  cut: {name: '切削', setupCost: 12, unitCost: 2, setupMinutes: 30, unitMinutes: 8},
};

export function fabricationEstimate(method, quantity) {
  if (!Object.hasOwn(fabricationPlans, method) || ![1, 10].includes(quantity)) {
    throw new RangeError('製作方法と個数を選んでください。');
  }
  const plan = fabricationPlans[method];
  return {
    cost: plan.setupCost + quantity * plan.unitCost,
    minutes: plan.setupMinutes + quantity * plan.unitMinutes,
  };
}

export function fabricationPlanCreate() {
  return {method: 'add', quantity: 1, checked: [], execution: {selected: 'retry', checked: []}};
}

// 実績は固定された仮想事例。増分の原因と計画との差を比較する。
export const fabricationExecutions = {
  retry: {name: '１個の積層：作り直し', method: 'add', quantity: 1, extraCost: 3, extraMinutes: 15, reason: '１個目が条件に合わず、材料と加工時間を１個分追加した'},
  setup: {name: '10個の切削：段取りの延長', method: 'cut', quantity: 10, extraCost: 6, extraMinutes: 20, reason: '段取りに追加の費用６枚と時間20分がかかった'},
};

export function fabricationExecutionResult(id) {
  if (!Object.hasOwn(fabricationExecutions, id)) throw new RangeError('事例が不正です。');
  const c = fabricationExecutions[id], planned = fabricationEstimate(c.method, c.quantity);
  return {planned, actual: {cost: planned.cost + c.extraCost, minutes: planned.minutes + c.extraMinutes}};
}

export function fabricationExecutionCheck(execution, costDifference, timeDifference) {
  const {planned, actual} = fabricationExecutionResult(execution.selected);
  if (costDifference !== actual.cost - planned.cost || timeDifference !== actual.minutes - planned.minutes) return false;
  if (!execution.checked.includes(execution.selected)) execution.checked.push(execution.selected);
  return true;
}

export function fabricationPlanCheck(plan, cost, minutes) {
  const expected = fabricationEstimate(plan.method, plan.quantity);
  if (cost !== expected.cost || minutes !== expected.minutes) return false;
  const key = `${plan.method}:${plan.quantity}`;
  if (!plan.checked.includes(key)) plan.checked.push(key);
  return true;
}

export function fabricationPlanRestore(saved) {
  if (!saved || !Array.isArray(saved.checked)) throw new RangeError('計画の記録が不正です。');
  fabricationEstimate(saved.method, saved.quantity);
  const valid = ['add:1', 'add:10', 'cut:1', 'cut:10'];
  if (saved.checked.some(key => !valid.includes(key)) || new Set(saved.checked).size !== saved.checked.length) {
    throw new RangeError('計画の記録が不正です。');
  }
  const execution = saved.execution === undefined ? {selected: 'retry', checked: []} : saved.execution;
  if (!execution || !Object.hasOwn(fabricationExecutions, execution.selected) || !Array.isArray(execution.checked) || execution.checked.some(id => !Object.hasOwn(fabricationExecutions, id)) || new Set(execution.checked).size !== execution.checked.length) {
    throw new RangeError('製作結果の記録が不正です。');
  }
  return {method: saved.method, quantity: saved.quantity, checked: [...saved.checked], execution: {selected: execution.selected, checked: [...execution.checked]}};
}
