import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import PredictionForm from './PredictionForm';
import InvestmentProfileForm from './InvestmentProfileForm';
import ProjectDashboard from './ProjectDashboard';
import AIModelInfo from './AIModelInfo';

function App() {
  const [token, setToken] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (token) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="container mt-4">
      {!token ? (
        <>
          {isRegistering ? (
            <RegistrationForm onRegister={(user) => console.log('Kayıt başarılı', user)} />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
          <div style={{ marginTop: '10px' }}>
            <button onClick={toggleForm} className="btn btn-warning">
              {isRegistering ? 'Zaten hesabınız var mı? Giriş yapın.' : 'Hesap Oluştur'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>FinancialPro Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
          <PredictionForm />
          <InvestmentProfileForm />
          <ProjectDashboard />
          <AIModelInfo />
        </>
      )}
    </div>
  );
}

export default App; 