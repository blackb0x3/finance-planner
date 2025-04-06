import { TransactionItem } from "../TransactionItem/transactionItem";

export interface Budget {
  id: string;
  startDate: Date;
  endDate: Date;
  created: Date;
  lastUpdated: Date;
  transactions: TransactionItem[];
}
