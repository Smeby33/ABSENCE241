import React, { useState } from 'react';

function AttendanceForm({ date, onAddAbsence }) {
  const [studentName, setStudentName] = useState('');

  const handleAddAbsence = () => {
    if (studentName) {
      onAddAbsence({ date, studentName });
      setStudentName(''); // Réinitialiser le champ après l'ajout
    }
  };

  return (
    <div>
      <h3>Ajouter une absence pour le {date}</h3>
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Nom de l'élève"
      />
      <button onClick={handleAddAbsence}>Ajouter l'absence</button>
    </div>
  );
}

export default AttendanceForm;
