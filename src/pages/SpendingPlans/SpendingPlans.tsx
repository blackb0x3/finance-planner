import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { spendingPlanService } from '../../services/spendingPlanService';
import './SpendingPlans.css';
import { formatDate } from '../../utils/formatDate.helper';

const SpendingPlans = () => {
  const [plans, setPlans] = useState<SpendingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SpendingPlan | null>(null);

  useEffect(() => {
    const loadSpendingPlans = async () => {
      try {
        const loadedPlans = await spendingPlanService.getSpendingPlans();
        setPlans(loadedPlans);
      } catch (err) {
        setError('Failed to load spending plans');
        console.error('Error loading spending plans:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpendingPlans();
  }, []);

  const handleDelete = async (plan: SpendingPlan) => {
    try {
      await spendingPlanService.deleteSpendingPlan(plan.id);
      setPlans(prev => prev.filter(p => p.id !== plan.id));
      setPlanToDelete(null);
    } catch (err) {
      setError('Failed to delete spending plan');
      console.error('Error deleting spending plan:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="spending-plans">
        <div className="loading-state">
          <h2>Loading spending plans...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spending-plans">
        <div className="error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spending-plans">
      <div className="spending-plans-header">
        <h1 className="spending-plans-title">Spending Plans</h1>
        <Link to="/spending-plans/new" className="spending-plans-button">
          Create New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <h2>No spending plans yet</h2>
          <p>Create your first spending plan to get started</p>
          <Link to="/spending-plans/new" className="spending-plans-button">
            Create New Plan
          </Link>
        </div>
      ) : (
        <div className="spending-plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className="spending-plan-card">
              <div className="spending-plan-card-header">
                <h2 className="spending-plan-card-title">{plan.name}</h2>
                <div className="spending-plan-card-meta">
                  <span className="spending-plan-card-currency">{plan.currency}</span>
                  <span className="spending-plan-card-date">{formatDate(plan.lastUpdated)}</span>
                </div>
              </div>
              <p className="spending-plan-card-description">{plan.description}</p>
              <div className="spending-plan-card-actions">
                <Link 
                  to={`/spending-plans/${plan.id}/edit`}
                  className="spending-plan-button spending-plan-button-primary"
                >
                  View / Edit
                </Link>
                <button
                  className="spending-plan-button spending-plan-button-delete"
                  onClick={() => setPlanToDelete(plan)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
            </div>
          ))}
        </div>
      )}

      {planToDelete && (
        <div className="delete-dialog-overlay">
          <div className="delete-dialog">
            <h3>Delete Spending Plan</h3>
            <p>Are you sure you want to delete "{planToDelete.name}"? This action cannot be undone.</p>
            <div className="delete-dialog-actions">
              <button
                className="spending-plan-button spending-plan-button-secondary"
                onClick={() => setPlanToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="spending-plan-button spending-plan-button-delete"
                onClick={() => handleDelete(planToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingPlans; 