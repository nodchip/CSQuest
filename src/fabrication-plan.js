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
  return {method: 'add', quantity: 1, checked: []};
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
  return {method: saved.method, quantity: saved.quantity, checked: [...saved.checked]};
}
