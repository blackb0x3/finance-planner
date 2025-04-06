import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { spendingPlanService } from '../../services/spendingPlanService';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { validateSpendingPlan, ValidationError } from '../../utils/validation';
import './EditSpendingPlan.css';
import { formatDate } from '../../utils/formatDate.helper';
import { getCurrencySymbol } from '../../utils/getCurrencySymbol.helper';

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
        setPlan(loadedPlan);
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

  const handleRemoveIncome = (incomeId: string) => {
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      incomes: plan.incomes.filter(income => income.id !== incomeId),
      lastUpdated: new Date()
    };

    setPlan(updatedPlan);
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(error => error.field === fieldName)?.message;
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
    </div>
  );
};

export default EditSpendingPlan; 