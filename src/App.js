import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import Auth from './Auth';
import DateSelector from './DateSelector';
import AttendanceForm from './AttendanceForm';
import AttendanceSection from './AttendanceSection';
import SettingsPanel from './SettingsPanel';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [isParametreOpen, setIsParametreOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    document.title = 'ABSENCE241';  
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (loggedInUser) {
      setIsAuthenticated(true);
      setCurrentUser(loggedInUser);
    }

    const savedRecords = JSON.parse(localStorage.getItem('attendanceRecords'));
    if (savedRecords) {
      setAttendanceRecords(savedRecords);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Recharger les données de attendanceRecords lors de la reconnexion
    const savedRecords = JSON.parse(localStorage.getItem('attendanceRecords'));
    if (savedRecords) {
      setAttendanceRecords(savedRecords);
    }
  };
  setTimeout(() => setIsLoading(false), 2000);
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }
  
  

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (!attendanceRecords[date]) {
      const updatedRecords = { ...attendanceRecords, [date]: [] };
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
    }
  };

  const handleAddAbsence = (absence) => {
    const updatedRecords = {
      ...attendanceRecords,
      [absence.date]: [...attendanceRecords[absence.date], absence],
    };
    setAttendanceRecords(updatedRecords);
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
  };

  const handleDeleteLast = () => {
    const dates = Object.keys(attendanceRecords);
    if (dates.length > 0) {
      const lastDate = dates[dates.length - 1];
      const updatedRecords = { ...attendanceRecords };
      delete updatedRecords[lastDate];
      setAttendanceRecords(updatedRecords);
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
    }
  };

  const handleDeleteAll = () => {
    setAttendanceRecords({});
    localStorage.removeItem('attendanceRecords');
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAttendanceRecords({});
    localStorage.removeItem('attendanceRecords');
  };

  function createPDF(elementId) { 
    const input = document.getElementById(elementId);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('absences.pdf');
      })
      .catch((error) => {
        console.error('Erreur lors de la génération du PDF', error);
      });
  }

  
  function handleSendViaWhatsApp() {
    const input = document.getElementById('attendance-section');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('absences.pdf');

      const message = encodeURIComponent(
        "Voici la liste des absences que je viens d'enregistrer."
      );
      window.open(`https://wa.me/?text=${message}+${pdf.save('absences.pdf')}`, '_blank');
    });
  }

  const toggleParametre = () => {
    setIsParametreOpen(!isParametreOpen);
  };

  return (
    <div className="diw">
      <div className="container">
        <div className={`parametre ${isParametreOpen ? 'ag' : ''}`}>
          <button className="parametrebutton" onClick={toggleParametre}>
            Paramètres
          </button>
          {isParametreOpen && (
            <SettingsPanel
              onDeleteLast={handleDeleteLast}
              onDeleteAll={handleDeleteAll}
              onClose={toggleParametre} // Ferme les paramètres en appuyant sur le bouton "Fermer"
              onLogout={handleLogout}
            />
          )}
        </div>
        <div className="contenu">
          <h1>Bienvenue, {currentUser.username} !</h1>

          <div className="date">
            <DateSelector onDateSelect={handleDateSelect} />
            {selectedDate && (
              <AttendanceForm date={selectedDate} onAddAbsence={handleAddAbsence} />
            )}
          </div>
          <div id="attendance-section">
            {Object.keys(attendanceRecords).map((date) => (
              <AttendanceSection
                key={date}
                date={date}
                absences={attendanceRecords[date]}
              />
            ))}
          </div>
          <button onClick={handleSendViaWhatsApp}>Envoyer via WhatsApp</button>
        </div>
      </div>
    </div>
  );
}

export default App;
