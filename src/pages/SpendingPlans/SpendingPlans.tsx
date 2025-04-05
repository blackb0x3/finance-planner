import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { spendingPlanService } from '../../services/spendingPlanService';
import './SpendingPlans.css';

const SpendingPlans = () => {
  const [spendingPlans, setSpendingPlans] = useState<SpendingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SpendingPlan | null>(null);

  useEffect(() => {
    const loadSpendingPlans = async () => {
      try {
        const plans = await spendingPlanService.getSpendingPlans();
        setSpendingPlans(plans);
      } catch (err) {
        setError('Failed to load spending plans. Please try again later.');
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
      setSpendingPlans(prev => prev.filter(p => p.id !== plan.id));
      setPlanToDelete(null);
    } catch (err) {
      setError('Failed to remove spending plan. Please try again later.');
      console.error('Error deleting spending plan:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="spending-plans">
        <div className="loading-state">
          <h2>Loading your spending plans...</h2>
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
          <button 
            className="spending-plan-button spending-plan-button-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="spending-plans">
      <div className="spending-plans-header">
        <h1 className="spending-plans-title">Your Spending Plans</h1>
        <Link to="/spending-plans/new" className="spending-plan-button spending-plan-button-primary">
          Create New Plan
        </Link>
      </div>

      {spendingPlans.length === 0 ? (
        <div className="empty-state">
          <h2>No spending plans yet</h2>
          <p>Create your first spending plan to start managing your finances</p>
          <Link to="/spending-plans/new" className="spending-plan-button spending-plan-button-primary">
            Create Your First Plan
          </Link>
        </div>
      ) : (
        <div className="spending-plans-grid">
          {spendingPlans.map((plan) => (
            <div key={plan.id} className="spending-plan-card">
              <div className="spending-plan-card-header">
                <h3 className="spending-plan-card-title">{plan.name}</h3>
                <span className="spending-plan-card-currency">{plan.currency}</span>
              </div>
              <p className="spending-plan-card-content">{plan.description}</p>
              <div className="spending-plan-card-meta">
                <span>Frequency: {plan.incomeAndAllocationFrequency}</span>
                <span>Created: {new Date(plan.created).toLocaleDateString()}</span>
              </div>
              <div className="spending-plan-card-stats">
                <div className="spending-plan-card-stat">
                  <label>Incomes</label>
                  <span>{plan.incomes.length}</span>
                </div>
                <div className="spending-plan-card-stat">
                  <label>Allocations</label>
                  <span>{plan.allocations.length}</span>
                </div>
              </div>
              <div className="spending-plan-card-actions">
                <Link to={`/spending-plans/${plan.id}/edit`} className="spending-plan-button spending-plan-button-secondary">
                  View / Edit
                </Link>
                <button 
                  className="spending-plan-button spending-plan-button-delete"
                  onClick={() => setPlanToDelete(plan)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
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
            <h3>Remove Spending Plan</h3>
            <p>Are you sure you want to remove the spending plan "{planToDelete.name}"? This action cannot be undone.</p>
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingPlans; 