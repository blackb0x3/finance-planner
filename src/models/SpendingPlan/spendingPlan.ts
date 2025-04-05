import { Allocation } from "../Allocation/allocation";
import { Income } from "../Income/income";

type MonetaryFrequency = 'monthly' | 'weekly' | 'daily';

export interface SpendingPlan {
    id: string;
    name: string;
    description: string;
    incomeAndAllocationFrequency: MonetaryFrequency;
    currency: string;
    created: Date;
    lastUpdated: Date;
    incomes: Income[];
    allocations: Allocation[];
}
