import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="navigation-brand">
        <Link to="/">Spending Planner</Link>
      </div>
      <div className="navigation-links">
        <Link to="/spending-plans">Spending Plans</Link>
        <Link to="/allocations">Allocations</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </nav>
  );
};

export default Navigation; 