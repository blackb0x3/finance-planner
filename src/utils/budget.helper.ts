import { SpendingPlan, MonetaryFrequency } from '../models/SpendingPlan/spendingPlan';
import { Budget } from '../models/Budget/budget';

export const calculateBudgetDates = (
  frequency: MonetaryFrequency,
  startDate: Date,
  index: number
): { startDate: Date; endDate: Date } => {
  const date = new Date(startDate);
  
  switch (frequency) {
    case 'monthly':
      date.setMonth(date.getMonth() + index);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return { startDate: start, endDate: end };
    case 'weekly':
      date.setDate(date.getDate() + (index * 7));
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return { startDate: weekStart, endDate: weekEnd };
    case 'daily':
      date.setDate(date.getDate() + index);
      return { startDate: date, endDate: date };
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
};

export const getCurrentBudget = (budgets: Budget[]): Budget | null => {
  const now = new Date();
  return budgets.find(budget => {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    return now >= startDate && now <= endDate;
  }) || null;
};

export const generateBudgets = (
  plan: SpendingPlan,
  numberOfBudgets: number = 12
): Budget[] => {
  const budgets: Budget[] = [];
  const startDate = new Date(plan.created);
  
  for (let i = 0; i < numberOfBudgets; i++) {
    const { startDate: budgetStart, endDate: budgetEnd } = calculateBudgetDates(
      plan.incomeAndAllocationFrequency,
      startDate,
      i
    );
    
    budgets.push({
      id: Date.now().toString() + i,
      startDate: budgetStart,
      endDate: budgetEnd,
      created: new Date(),
      lastUpdated: new Date(),
      transactions: []
    });
  }
  
  return budgets;
};

export const shouldGenerateBudgets = (plan: SpendingPlan): boolean => {
  if (plan.allocations.length === 0) return false;
  
  // Find the first allocation that requires budgets
  const allocationWithBudgets = plan.allocations.find(allocation => allocation.requiresBudgets);
  if (!allocationWithBudgets) return false;
  
  const currentBudget = getCurrentBudget(allocationWithBudgets.budgets);
  if (!currentBudget) return true;
  
  const now = new Date();
  const endDate = new Date(currentBudget.endDate);
  
  // If we're within 7 days of the current budget's end date, generate new budgets
  const daysUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilEnd <= 7;
}; 