import React, { useState } from 'react';
import SpendingPlansEditor from './SpendingPlanEditor';

const DashboardPage = ({ onOpenPlan }) => {
  const handleNewPlan = () => {
    const newPlan = {
      name: 'Untitled Spending Plan',
      incomes: [],
      expenditures: [],
    };
    onOpenPlan(newPlan);
  };

  const handleOpenPlan = async () => {
    // Use Tauri to open a file dialog and load the plan
    const { open } = window.__TAURI__.dialog;
    const { readTextFile } = window.__TAURI__.fs;

    const filePath = await open({ filters: [{ name: 'JSON', extensions: ['json'] }] });
    if (filePath) {
      const planData = JSON.parse(await readTextFile(filePath));
      onOpenPlan(planData);
    }
  };

  return (
    <div>
      <h1>Welcome to the Spending Planner</h1>
      <button onClick={handleNewPlan}>Create New Plan</button>
      <button onClick={handleOpenPlan}>Open Existing Plan</button>
    </div>
  );
};

export default DashboardPage;