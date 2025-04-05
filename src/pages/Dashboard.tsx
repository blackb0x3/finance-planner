import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Spending Planner</h1>
        <p>Manage your finances with ease and precision</p>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/spending-plans/new" className="action-card">
          <h3>Create New Spending Plan</h3>
          <p>Start planning your monthly budget</p>
        </Link>
        
        <Link to="/spending-plans" className="action-card">
          <h3>View Spending Plans</h3>
          <p>Review and manage your existing plans</p>
        </Link>
        
        <Link to="/transactions" className="action-card">
          <h3>Record Transactions</h3>
          <p>Log your recent spending</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;