import React, { useState, FormEvent } from 'react';
import { TransactionItem } from '../../models/common/transactionItem';

type TransactionFormProps = {
  onAddTransaction: (transaction: TransactionItem) => void;
};

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name || !amount) {
      alert('Please fill in all fields.');
      return;
    }

    const transaction: TransactionItem = {
      name: name,
      description: description,
      amount: parseFloat(amount)
    };

    onAddTransaction(transaction);
    setName('');
    setDescription('');
    setAmount('');
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input
            type="number"
            step={0.01}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default TransactionForm;
