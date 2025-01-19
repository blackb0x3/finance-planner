import { TransactionItem } from "../common/transactionItem";

export interface SpendingPlan {
    name: string;
    currency: string;
    transactions: TransactionItem[];
}