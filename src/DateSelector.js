import React, { useState } from 'react';
import './css/DateSelector.css';

function DateSelector({ onDateSelect }) {
  const [date, setDate] = useState('');

  const handleAddDate = () => {
    if (date) {
      onDateSelect(date);
      setDate(''); // Réinitialiser la date après l'ajout
    }
  };

  return (
    <div>
      <h2>Ajouter une date</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleAddDate}>Ajouter la date</button>
    </div>
  );
}

export default DateSelector;
