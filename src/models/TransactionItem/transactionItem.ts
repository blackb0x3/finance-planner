export interface TransactionItem {
  id: string;
  description: string;
  detail?: string;
  date: Date;
  amount: number;
  currency: string;
}
