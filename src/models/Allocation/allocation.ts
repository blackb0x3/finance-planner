import { Budget } from "../Budget/budget";

export interface Allocation {
  id: string;
  name: string;
  amount: number;
  created: Date;
  lastUpdated: Date;
  requiresBudgets: boolean;
  budgets: Budget[];
}