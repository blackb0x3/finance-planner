import { TransactionItem } from "../common/transactionItem";

export interface SpendingPlan {
    name: string;
    transactions: TransactionItem[];
}