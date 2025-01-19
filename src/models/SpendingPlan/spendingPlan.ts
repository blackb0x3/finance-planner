import { Budget } from "../Budget/budget";
import { TransactionItem } from "../common/transactionItem";

export interface SpendingPlan {
    name: string;
    currency: string;
    transactions: TransactionItem[];
    budgets: Budget[];
}