import React from 'react';
import './LoadingScreen.css'; // Assure-toi de créer ce fichier CSS pour le style

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <img src="/favicon.ico" alt="App Icon" className="app-icon" />
      <h1>Chargement...</h1>
    </div>
  );
};

export default LoadingScreen;
