import React from 'react';
import './css/AttendanceSection.css';


function AttendanceSection({ date, absences }) {
  return (
    <div className='liste' >
      <div className="docliste">
        <h3>Absences pour le {date}</h3>
        <ul>
          {absences.map((absence, index) => (
            <li key={index}>{absence.studentName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AttendanceSection;
