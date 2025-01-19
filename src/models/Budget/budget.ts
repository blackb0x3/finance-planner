import { TransactionItem } from "../common/transactionItem";

export interface Budget {
    startDate: Date;
    endDate: Date;
    incoming: TransactionItem[];
    expenditures: TransactionItem[];
}