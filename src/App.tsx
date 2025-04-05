import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import SpendingPlans from './pages/SpendingPlans/SpendingPlans';
import NewSpendingPlan from './pages/SpendingPlans/NewSpendingPlan';
import EditSpendingPlan from './pages/SpendingPlans/EditSpendingPlan';
import Settings from './pages/Settings/Settings';
import { SettingsProvider } from './contexts/SettingsContext';
import "./App.css";

const App = () => (
  <SettingsProvider>
    <Router>
      <div className="app">
        <Navigation />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/spending-plans" element={<SpendingPlans />} />
            <Route path="/spending-plans/new" element={<NewSpendingPlan />} />
            <Route path="/spending-plans/:id/edit" element={<EditSpendingPlan />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  </SettingsProvider>
);

export default App;
