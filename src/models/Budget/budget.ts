import { TransactionItem } from "../TransactionItem/transactionItem";

export interface Budget {
  id: string;
  start: Date;
  end: Date;
  transactions: TransactionItem[];
}
