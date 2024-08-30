import React from 'react';
import './css/SettingsPanel.css'

function SettingsPanel({ onDeleteLast, onDeleteAll,onLogout, onClose }) {
  return (
    <div className="settings-panel">
      <button onClick={onDeleteLast}>Supprimer les dernières informations</button>
      <button onClick={onDeleteAll}>Supprimer toutes les informations</button>
      <button onClick={onLogout}>Changer de compte</button>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}

export default SettingsPanel;
