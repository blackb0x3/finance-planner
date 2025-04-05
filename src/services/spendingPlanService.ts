import { SpendingPlan } from '../models/SpendingPlan/spendingPlan';
import { dataService } from './dataService';

class SpendingPlanService {
  private readonly FILENAME = 'spending_plans.json';

  async getSpendingPlans(): Promise<SpendingPlan[]> {
    var plans = await dataService.readFile<SpendingPlan[]>(this.FILENAME);

    if (typeof(plans) === 'undefined') {
      return [];
    }

    return plans;
  }

  async getSpendingPlan(id: string): Promise<SpendingPlan | undefined> {
    const plans = await this.getSpendingPlans();

    return plans.find(plan => plan.id === id);
  }

  async saveSpendingPlan(plan: SpendingPlan): Promise<void> {
    const plans = await this.getSpendingPlans();
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }

    await dataService.writeFile(this.FILENAME, plans);
  }

  async deleteSpendingPlan(planId: string): Promise<void> {
    const plans = await this.getSpendingPlans();
    const filteredPlans = plans.filter(p => p.id !== planId);

    await dataService.writeFile(this.FILENAME, filteredPlans);
  }

  async createSpendingPlan(data: Omit<SpendingPlan, 'id' | 'created' | 'lastUpdated' | 'incomes' | 'allocations'>): Promise<SpendingPlan> {
    const newPlan: SpendingPlan = {
      ...data,
      id: crypto.randomUUID(),
      created: new Date(),
      lastUpdated: new Date(),
      incomes: [],
      allocations: [],
    };

    await this.saveSpendingPlan(newPlan);

    return newPlan;
  }
}

export const spendingPlanService = new SpendingPlanService();