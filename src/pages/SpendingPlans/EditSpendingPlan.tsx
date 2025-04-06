import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { spendingPlanService } from '../../services/spendingPlanService';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { validateSpendingPlan, ValidationError } from '../../utils/validation';
import './EditSpendingPlan.css';
import { formatDate } from '../../utils/formatDate.helper';
import { getCurrencySymbol } from '../../utils/getCurrencySymbol.helper';
import { generateBudgets, shouldGenerateBudgets } from '../../utils/budget.helper';
import { Allocation } from '../../models/SpendingPlan/allocation';

const EditSpendingPlan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [plan, setPlan] = useState<SpendingPlan | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [newIncome, setNewIncome] = useState({
    name: '',
    amount: ''
  });
  const [incomeErrors, setIncomeErrors] = useState({
    name: '',
    amount: ''
  });

  const [newAllocation, setNewAllocation] = useState({
    name: '',
    amount: '',
    requiresBudgets: true
  });
  const [allocationErrors, setAllocationErrors] = useState({
    name: '',
    amount: ''
  });

  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: ''
  });
  const [transactionErrors, setTransactionErrors] = useState({
    name: '',
    amount: ''
  });

  const formatFrequency = (frequency: string): string => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1).toLowerCase();
  };

  useEffect(() => {
    const loadSpendingPlan = async () => {
      if (!id) {
        setError('No spending plan ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const loadedPlan = await spendingPlanService.getSpendingPlan(id);
        if (!loadedPlan) {
          setError('Spending plan not found');
          setIsLoading(false);
          return;
        }

        // Check if we need to generate new budgets
        if (shouldGenerateBudgets(loadedPlan)) {
          const updatedPlan = {
            ...loadedPlan,
            allocations: loadedPlan.allocations.map(allocation => ({
              ...allocation,
              budgets: generateBudgets(loadedPlan)
            })),
            lastUpdated: new Date()
          };
          setPlan(updatedPlan);
        } else {
          setPlan(loadedPlan);
        }
      } catch (err) {
        setError('Failed to load spending plan');
        console.error('Error loading spending plan:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpendingPlan();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    // Validate the form
    const validationResult = validateSpendingPlan(plan);
    setValidationErrors(validationResult.errors);

    if (!validationResult.isValid) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await spendingPlanService.saveSpendingPlan({
        ...plan,
        lastUpdated: new Date(),
      });
      navigate('/spending-plans');
    } catch (err) {
      setError('Failed to save spending plan');
      console.error('Error saving spending plan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!plan) return;

    const { name, value } = e.target;
    setPlan(prev => prev ? {
      ...prev,
      [name]: value
    } : null);

    // Clear validation error for the field being changed
    setValidationErrors(prev => prev.filter(error => error.field !== name));
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIncome(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAllocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateIncome = () => {
    const errors = {
      name: '',
      amount: ''
    };

    if (!newIncome.name.trim()) {
      errors.name = 'Name is required';
    }

    const amount = parseFloat(newIncome.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    setIncomeErrors(errors);
    return !errors.name && !errors.amount;
  };

  const validateAllocation = () => {
    const errors = {
      name: '',
      amount: ''
    };

    if (!newAllocation.name.trim()) {
      errors.name = 'Name is required';
    }

    const amount = parseFloat(newAllocation.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    setAllocationErrors(errors);
    return !errors.name && !errors.amount;
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    if (!validateIncome()) {
      return;
    }

    const updatedPlan = {
      ...plan,
      incomes: [
        ...plan.incomes,
        {
          id: Date.now().toString(),
          name: newIncome.name,
          amount: parseFloat(newIncome.amount),
          created: new Date(),
          lastUpdated: new Date()
        }
      ],
      lastUpdated: new Date()
    };

    setPlan(updatedPlan);
    setNewIncome({
      name: '',
      amount: ''
    });
    setIncomeErrors({
      name: '',
      amount: ''
    });
  };

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    if (!validateAllocation()) {
      return;
    }

    const updatedPlan = {
      ...plan,
      allocations: [
        ...plan.allocations,
        {
          id: Date.now().toString(),
          name: newAllocation.name,
          amount: parseFloat(newAllocation.amount),
          requiresBudgets: newAllocation.requiresBudgets,
          budgets: newAllocation.requiresBudgets ? generateBudgets(plan) : [],
          created: new Date(),
          lastUpdated: new Date()
        }
      ],
      lastUpdated: new Date()
    };

    setPlan(updatedPlan);
    setNewAllocation({
      name: '',
      amount: '',
      requiresBudgets: true
    });
    setAllocationErrors({
      name: '',
      amount: ''
    });
  };

  const handleRemoveIncome = (incomeId: string) => {
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      incomes: plan.incomes.filter(income => income.id !== incomeId),
      lastUpdated: new Date()
    };

    setPlan(updatedPlan);
  };

  const handleRemoveAllocation = (allocationId: string) => {
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      allocations: plan.allocations.filter(allocation => allocation.id !== allocationId),
      lastUpdated: new Date()
    };

    setPlan(updatedPlan);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  const handleAllocationClick = (allocation: Allocation) => {
    setSelectedAllocation(allocation);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAllocation(null);
    setNewTransaction({
      name: '',
      amount: ''
    });
    setTransactionErrors({
      name: '',
      amount: ''
    });
  };

  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateTransaction = () => {
    const errors = {
      name: '',
      amount: ''
    };

    if (!newTransaction.name.trim()) {
      errors.name = 'Name is required';
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    setTransactionErrors(errors);
    return !errors.name && !errors.amount;
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !selectedAllocation) return;

    if (!validateTransaction()) {
      return;
    }

    const updatedPlan = {
      ...plan,
      allocations: plan.allocations.map(allocation => {
        if (allocation.id === selectedAllocation.id) {
          return {
            ...allocation,
            budgets: allocation.budgets.map(budget => {
              if (budget.id === getCurrentBudget(allocation.budgets)?.id) {
                return {
                  ...budget,
                  transactions: [
                    ...budget.transactions,
                    {
                      id: Date.now().toString(),
                      name: newTransaction.name,
                      amount: parseFloat(newTransaction.amount),
                      created: new Date(),
                      lastUpdated: new Date()
                    }
                  ]
                };
              }
              return budget;
            })
          };
        }
        return allocation;
      }),
      lastUpdated: new Date()
    };

    setPlan(updatedPlan);
    setNewTransaction({
      name: '',
      amount: ''
    });
    setTransactionErrors({
      name: '',
      amount: ''
    });
  };

  if (isLoading) {
    return (
      <div className="edit-spending-plan">
        <div className="loading-state">
          <h2>Loading spending plan...</h2>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="edit-spending-plan">
        <div className="error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button 
            className="form-button form-button-primary"
            onClick={() => navigate('/spending-plans')}
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-spending-plan">
      <div className="edit-spending-plan-header">
        <h1 className="edit-spending-plan-title">Edit Spending Plan</h1>
        <button 
          className="form-button form-button-secondary"
          onClick={() => navigate('/spending-plans')}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-spending-plan-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Plan Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={plan.name}
            onChange={handleChange}
            placeholder="e.g., Monthly Budget 2024"
            required
            disabled={isSaving}
            className={`form-input ${getFieldError('name') ? 'error' : ''}`}
          />
          {getFieldError('name') && (
            <div className="form-error">{getFieldError('name')}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={plan.description}
            onChange={handleChange}
            placeholder="Describe your spending plan..."
            rows={3}
            disabled={isSaving}
            className={`form-textarea ${getFieldError('description') ? 'error' : ''}`}
          />
          {getFieldError('description') && (
            <div className="form-error">{getFieldError('description')}</div>
          )}
        </div>

        <div className="form-meta">
          <div className="meta-chip">
            <span className="meta-chip-label">Currency</span>
            <span className="meta-chip-value">{plan.currency}</span>
          </div>
          <div className="meta-chip">
            <span className="meta-chip-label">Frequency</span>
            <span className="meta-chip-value">{formatFrequency(plan.incomeAndAllocationFrequency)}</span>
          </div>
          <div className="meta-chip">
            <span className="meta-chip-label">Created</span>
            <span className="meta-chip-value">{formatDate(plan.created)}</span>
          </div>
          <div className="meta-chip">
            <span className="meta-chip-label">Last Updated</span>
            <span className="meta-chip-value">{formatDate(plan.lastUpdated)}</span>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Incomes</h2>
          
          <div className="income-list">
            {plan.incomes.map(income => (
              <div key={income.id} className="income-item">
                <div className="income-item-details">
                  <span className="income-item-name">{income.name}</span>
                  <div className="income-item-meta">
                    <div className="meta-chip">
                      <span className="meta-chip-value">
                        {getCurrencySymbol(plan.currency)}{income.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="income-item-remove"
                  onClick={() => handleRemoveIncome(income.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 7l16 0"></path>
                    <path d="M10 11l0 6"></path>
                    <path d="M14 11l0 6"></path>
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                  </svg>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="income-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="income-name" className="form-label">Name</label>
                <input
                  type="text"
                  id="income-name"
                  name="name"
                  value={newIncome.name}
                  onChange={handleIncomeChange}
                  placeholder="e.g., Salary"
                  className={`form-input ${incomeErrors.name ? 'error' : ''}`}
                />
                {incomeErrors.name && (
                  <div className="form-error">{incomeErrors.name}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="income-amount" className="form-label">Amount</label>
                <input
                  type="number"
                  id="income-amount"
                  name="amount"
                  value={newIncome.amount}
                  onChange={handleIncomeChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`form-input ${incomeErrors.amount ? 'error' : ''}`}
                />
                {incomeErrors.amount && (
                  <div className="form-error">{incomeErrors.amount}</div>
                )}
              </div>
            </div>
            <button 
              type="button" 
              className="form-button form-button-primary"
              onClick={handleAddIncome}
            >
              Add Income
            </button>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Allocations</h2>
          
          <div className="allocation-list">
            {plan.allocations.map(allocation => (
              <div key={allocation.id} className="allocation-item" onClick={() => handleAllocationClick(allocation)}>
                <div className="allocation-item-details">
                  <span className="allocation-item-name">{allocation.name}</span>
                  <div className="allocation-item-meta">
                    <div className="meta-chip">
                      <span className="meta-chip-value">
                        {getCurrencySymbol(plan.currency)} {allocation.amount.toFixed(2)} • Budgets? {allocation.requiresBudgets ? '✅' : '❌'}
                      </span>
                      <div className="meta-chip-tooltip">
                        {allocation.requiresBudgets ? 'With Budgets' : 'No Budgets'}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="allocation-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAllocation(allocation.id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 7l16 0"></path>
                    <path d="M10 11l0 6"></path>
                    <path d="M14 11l0 6"></path>
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                  </svg>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="allocation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="allocation-name" className="form-label">Name</label>
                <input
                  type="text"
                  id="allocation-name"
                  name="name"
                  value={newAllocation.name}
                  onChange={handleAllocationChange}
                  placeholder="e.g., Rent"
                  className={`form-input ${allocationErrors.name ? 'error' : ''}`}
                />
                {allocationErrors.name && (
                  <div className="form-error">{allocationErrors.name}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="allocation-amount" className="form-label">Amount</label>
                <input
                  type="number"
                  id="allocation-amount"
                  name="amount"
                  value={newAllocation.amount}
                  onChange={handleAllocationChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`form-input ${allocationErrors.amount ? 'error' : ''}`}
                />
                {allocationErrors.amount && (
                  <div className="form-error">{allocationErrors.amount}</div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="requiresBudgets"
                  checked={newAllocation.requiresBudgets}
                  onChange={(e) => setNewAllocation(prev => ({
                    ...prev,
                    requiresBudgets: e.target.checked
                  }))}
                />
                <span>Require budgets for this allocation</span>
              </label>
            </div>
            <button
              type="button"
              className="form-button form-button-primary"
              onClick={handleAddAllocation}
            >
              Add Allocation
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="form-button form-button-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {selectedAllocation && (
        <div className={`modal-overlay ${isModalVisible ? 'visible' : ''}`}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{selectedAllocation.name}</h2>
              <button className="modal-close" onClick={handleModalClose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M18 6l-12 12"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="allocation-name" className="form-label">Name</label>
                <input
                  type="text"
                  id="allocation-name"
                  name="name"
                  value={selectedAllocation.name}
                  onChange={(e) => {
                    const updatedPlan = {
                      ...plan!,
                      allocations: plan!.allocations.map(allocation => {
                        if (allocation.id === selectedAllocation.id) {
                          return {
                            ...allocation,
                            name: e.target.value,
                            lastUpdated: new Date()
                          };
                        }
                        return allocation;
                      }),
                      lastUpdated: new Date()
                    };
                    setPlan(updatedPlan);
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="allocation-amount" className="form-label">Amount</label>
                <input
                  type="number"
                  id="allocation-amount"
                  name="amount"
                  value={selectedAllocation.amount}
                  onChange={(e) => {
                    const updatedPlan = {
                      ...plan!,
                      allocations: plan!.allocations.map(allocation => {
                        if (allocation.id === selectedAllocation.id) {
                          return {
                            ...allocation,
                            amount: parseFloat(e.target.value),
                            lastUpdated: new Date()
                          };
                        }
                        return allocation;
                      }),
                      lastUpdated: new Date()
                    };
                    setPlan(updatedPlan);
                  }}
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="requiresBudgets"
                    checked={selectedAllocation.requiresBudgets}
                    onChange={(e) => {
                      const updatedPlan = {
                        ...plan!,
                        allocations: plan!.allocations.map(allocation => {
                          if (allocation.id === selectedAllocation.id) {
                            return {
                              ...allocation,
                              requiresBudgets: e.target.checked,
                              budgets: e.target.checked ? generateBudgets(plan!) : [],
                              lastUpdated: new Date()
                            };
                          }
                          return allocation;
                        }),
                        lastUpdated: new Date()
                      };
                      setPlan(updatedPlan);
                    }}
                  />
                  <span>Require budgets for this allocation</span>
                </label>
              </div>

              {selectedAllocation.requiresBudgets && (
                <>
                  <h3 className="form-section-title">Current Budget Transactions</h3>
                  <div className="transaction-list">
                    {getCurrentBudget(selectedAllocation.budgets)?.transactions.map(transaction => (
                      <div key={transaction.id} className="transaction-item">
                        <div className="transaction-item-details">
                          <span className="transaction-item-name">{transaction.name}</span>
                          <span className="transaction-item-date">{formatDate(transaction.created)}</span>
                        </div>
                        <span className="transaction-item-amount">
                          {getCurrencySymbol(plan.currency)} {transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="form-section-title">Add Transaction</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="transaction-name" className="form-label">Name</label>
                      <input
                        type="text"
                        id="transaction-name"
                        name="name"
                        value={newTransaction.name}
                        onChange={handleTransactionChange}
                        placeholder="e.g., Groceries"
                        className={`form-input ${transactionErrors.name ? 'error' : ''}`}
                      />
                      {transactionErrors.name && (
                        <div className="form-error">{transactionErrors.name}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="transaction-amount" className="form-label">Amount</label>
                      <input
                        type="number"
                        id="transaction-amount"
                        name="amount"
                        value={newTransaction.amount}
                        onChange={handleTransactionChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`form-input ${transactionErrors.amount ? 'error' : ''}`}
                      />
                      {transactionErrors.amount && (
                        <div className="form-error">{transactionErrors.amount}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="form-button form-button-primary"
                    onClick={handleAddTransaction}
                  >
                    Add Transaction
                  </button>
                </>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="form-button form-button-secondary"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSpendingPlan; 