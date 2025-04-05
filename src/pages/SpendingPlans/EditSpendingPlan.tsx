import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { spendingPlanService } from '../../services/spendingPlanService';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { validateSpendingPlan, ValidationError } from '../../utils/validation';
import './EditSpendingPlan.css';

const EditSpendingPlan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [plan, setPlan] = useState<SpendingPlan | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!plan) return;

    const { name, value } = e.target;
    setPlan(prev => prev ? {
      ...prev,
      [name]: value
    } : null);

    // Clear validation error for the field being changed
    setValidationErrors(prev => prev.filter(error => error.field !== name));
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
            className="button-primary"
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
        <h1>Edit Spending Plan</h1>
        <button 
          className="button-secondary"
          onClick={() => navigate('/spending-plans')}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="spending-plan-form">
        <div className="form-group">
          <label htmlFor="name">Plan Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={plan.name}
            onChange={handleChange}
            placeholder="e.g., Monthly Budget 2024"
            required
            disabled={isSaving}
            className={getFieldError('name') ? 'error' : ''}
          />
          {getFieldError('name') && (
            <div className="field-error">{getFieldError('name')}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={plan.description}
            onChange={handleChange}
            placeholder="Describe your spending plan..."
            rows={3}
            disabled={isSaving}
            className={getFieldError('description') ? 'error' : ''}
          />
          {getFieldError('description') && (
            <div className="field-error">{getFieldError('description')}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              name="currency"
              value={plan.currency}
              onChange={handleChange}
              disabled={isSaving}
              className={getFieldError('currency') ? 'error' : ''}
            >
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
            {getFieldError('currency') && (
              <div className="field-error">{getFieldError('currency')}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="incomeAndAllocationFrequency">Frequency</label>
            <select
              id="incomeAndAllocationFrequency"
              name="incomeAndAllocationFrequency"
              value={plan.incomeAndAllocationFrequency}
              onChange={handleChange}
              disabled={isSaving}
              className={getFieldError('incomeAndAllocationFrequency') ? 'error' : ''}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
            {getFieldError('incomeAndAllocationFrequency') && (
              <div className="field-error">{getFieldError('incomeAndAllocationFrequency')}</div>
            )}
          </div>
        </div>

        <div className="form-meta">
          <div className="meta-item">
            <label>Created</label>
            <span>{new Date(plan.created).toLocaleDateString()}</span>
          </div>
          <div className="meta-item">
            <label>Last Updated</label>
            <span>{new Date(plan.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="button-primary"
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