import React, { useState } from 'react';

const SpendingPlansEditor = ({ plan, onClose }) => {
  const [spendingPlan, closePlan] = useState(plan);

  const handleSavePlan = async () => {
    const { save } = window.__TAURI__.dialog;
    const { writeTextFile } = window.__TAURI__.fs;

    const filePath = await save({
      defaultPath: `${spendingPlan.name}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });

    if (filePath) {
      await writeTextFile(filePath, JSON.stringify(spendingPlan, null, 2));
      alert('Spending Plan saved successfully!');
    }
  };

  return (
    <div>
      <h1>Editing: {spendingPlan.name}</h1>
      {/* Add income and expenditure management logic here */}
      <button onClick={handleSavePlan}>Save Plan</button>
      <button onClick={closePlan}>Close Plan</button>
    </div>
  );
};

export default SpendingPlansEditor;