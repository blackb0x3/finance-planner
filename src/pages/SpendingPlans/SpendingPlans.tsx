import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SpendingPlan } from '../../models/SpendingPlan/spendingPlan';
import { spendingPlanService } from '../../services/spendingPlanService';
import './SpendingPlans.css';

const SpendingPlans = () => {
  const [spendingPlans, setSpendingPlans] = useState<SpendingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            className="button-primary"
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
        <h1>Your Spending Plans</h1>
        <Link to="/spending-plans/new" className="button-primary">
          Create New Plan
        </Link>
      </div>

      {spendingPlans.length === 0 ? (
        <div className="empty-state">
          <h2>No spending plans yet</h2>
          <p>Create your first spending plan to start managing your finances</p>
          <Link to="/spending-plans/new" className="button-primary">
            Create Your First Plan
          </Link>
        </div>
      ) : (
        <div className="spending-plans-grid">
          {spendingPlans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-card-header">
                <h3>{plan.name}</h3>
                <span className="plan-currency">{plan.currency}</span>
              </div>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-meta">
                <span>Frequency: {plan.incomeAndAllocationFrequency}</span>
                <span>Created: {new Date(plan.created).toLocaleDateString()}</span>
              </div>
              <div className="plan-stats">
                <div className="stat">
                  <label>Incomes</label>
                  <span>{plan.incomes.length}</span>
                </div>
                <div className="stat">
                  <label>Allocations</label>
                  <span>{plan.allocations.length}</span>
                </div>
              </div>
              <Link to={`/spending-plans/${plan.id}`} className="button-secondary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpendingPlans; 