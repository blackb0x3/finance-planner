import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spendingPlanService } from '../../services/spendingPlanService';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { validateSpendingPlan, ValidationError } from '../../utils/validation';
import './NewSpendingPlan.css';

const NewSpendingPlan = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'GBP',
    incomeAndAllocationFrequency: 'monthly' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    const validationResult = validateSpendingPlan(formData);
    setValidationErrors(validationResult.errors);

    if (!validationResult.isValid) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await spendingPlanService.createSpendingPlan(formData);
      navigate('/spending-plans');
    } catch (err) {
      setError('Failed to create spending plan. Please try again.');
      console.error('Error creating spending plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for the field being changed
    setValidationErrors(prev => prev.filter(error => error.field !== name));
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  return (
    <div className="new-spending-plan">
      <div className="new-spending-plan-header">
        <h1 className="new-spending-plan-title">Create New Spending Plan</h1>
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

      <form onSubmit={handleSubmit} className="new-spending-plan-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Plan Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Monthly Budget 2024"
            required
            disabled={isSubmitting}
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
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your spending plan..."
            rows={3}
            disabled={isSubmitting}
            className={`form-textarea ${getFieldError('description') ? 'error' : ''}`}
          />
          {getFieldError('description') && (
            <div className="form-error">{getFieldError('description')}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="currency" className="form-label">Currency</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`form-select ${getFieldError('currency') ? 'error' : ''}`}
            >
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
            {getFieldError('currency') && (
              <div className="form-error">{getFieldError('currency')}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="incomeAndAllocationFrequency" className="form-label">Frequency</label>
            <select
              id="incomeAndAllocationFrequency"
              name="incomeAndAllocationFrequency"
              value={formData.incomeAndAllocationFrequency}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`form-select ${getFieldError('incomeAndAllocationFrequency') ? 'error' : ''}`}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
            {getFieldError('incomeAndAllocationFrequency') && (
              <div className="form-error">{getFieldError('incomeAndAllocationFrequency')}</div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="form-button form-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSpendingPlan; 