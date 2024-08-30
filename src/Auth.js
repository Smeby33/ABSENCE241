import React, { useState, useEffect } from 'react';
import './css/Auth.css';

function Auth({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    localStorage.setItem('users', JSON.stringify(savedUsers));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = savedUsers.find(user => user.username === username);

    if (existingUser) {
      alert('Nom d\'utilisateur déjà pris');
      return;
    }

    const newUser = { username, password };
    const updatedUsers = [...savedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    setIsSignup(false);
  };

  const handleLogin = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = savedUsers.find(user => user.username === username && user.password === password);

    if (user) {
      onLoginSuccess(user);
    } else {
      alert('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="div">
      <div className="auth">
      <h1>{isSignup ? 'Inscription' : 'Connexion'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="utilisateur" >
          <label>Nom d'utilisateur:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="utilisateur" >
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isSignup && (
          <div className="utilisateur" >
            <label>Confirmer le mot de passe:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <button className="boutonauth1"  type="submit">{isSignup ? 'S\'inscrire' : 'Se connecter'}</button>
      </form>
      <div className="boton">
        <button className="boutonauth2" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Déjà inscrit ? Connectez-vous' : 'Pas encore de compte ? Inscrivez-vous'}
        </button>
      </div>
      </div>
    </div>
  );
}

export default Auth;
