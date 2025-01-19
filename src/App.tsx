import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import SpendingPlansEditor from './pages/SpendingPlanEditor';
import "./App.css";

const App = () => {
  const [currentPlan, setCurrentPlan] = useState(null);

  const handleOpenPlan = (plan) => {
    setCurrentPlan(plan);
  };

  const handleClosePlan = () => {
    setCurrentPlan(null);
  };

  return (
    <div>
      {currentPlan ? (
        <SpendingPlansEditor plan={currentPlan} onClose={handleClosePlan} />
      ) : (
        <Dashboard onOpenPlan={handleOpenPlan} />
      )}
    </div>
  );
};

export default App;
