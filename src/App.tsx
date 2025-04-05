import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import SpendingPlans from './pages/SpendingPlans/SpendingPlans';
import NewSpendingPlan from './pages/SpendingPlans/NewSpendingPlan';
import EditSpendingPlan from './pages/SpendingPlans/EditSpendingPlan';
import "./App.css";

const App = () => (
  <Router>
    <div className="app">
      <Navigation />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/spending-plans" element={<SpendingPlans />} />
          <Route path="/spending-plans/new" element={<NewSpendingPlan />} />
          <Route path="/spending-plans/:id/edit" element={<EditSpendingPlan />} />
          {/* We'll add more routes as we create new pages */}
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
