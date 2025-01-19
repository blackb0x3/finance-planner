
import React, { useState } from 'react';
import TransactionForm from './TransactionForm';
import PlanSummary from './PlanSummary';
import BudgetList from '../Budget/BudgetList';
import BudgetForm from '../Budget/BudgetForm';
import { TransactionItem } from '../../models/common/transactionItem';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { Budget } from '../../models/Budget/budget';

type SpendingPlanEditorProps = {
  plan: SpendingPlan;
  onUpdatePlan: (spendingPlan: SpendingPlan) => void;
}

const SpendingPlanEditor: React.FC<SpendingPlanEditorProps> = ({ plan, onUpdatePlan }) => {
  const [transactions, setTransactions] = useState(plan.transactions || []);
  const [budgets, setBudgets] = useState(plan.budgets || []);

  const handleAddTransaction = (transaction: TransactionItem) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    onUpdatePlan({ ...plan, transactions: updatedTransactions });
  };

  const handleAddBudget = (budget: Budget) => {
    const updatedBudgets = [...budgets, budget];
    setBudgets(updatedBudgets);
    onUpdatePlan({ ...plan, budgets: updatedBudgets });
  };

  return (
    <div className="spending-plan-editor">
      <section>
        <h2>Transactions</h2>
        <TransactionForm onAddTransaction={handleAddTransaction} />
        <PlanSummary transactions={transactions} />
      </section>

      <section>
        <h2>Budgets</h2>
        <BudgetForm onAddBudget={handleAddBudget} />
        <BudgetList budgets={budgets} />
      </section>
    </div>
  );
};

export default SpendingPlanEditor;