import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import PredictionForm from './PredictionForm';
import InvestmentProfileForm from './InvestmentProfileForm';
import ProjectDashboard from './ProjectDashboard';
import AIModelInfo from './AIModelInfo';

// Protected route component to guard authenticated routes
function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (token) => setToken(token);
  const handleLogout = () => setToken(null);

  return (
    <div className="container mt-4">
      {token && (
        <nav className="mb-4">
          <ul className="nav">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </li>
          </ul>
        </nav>
      )}
      <Routes>
        {token ? (
          <>
            <Route path="/dashboard" element={
              <ProtectedRoute token={token}>
                <>
                  <PredictionForm />
                  <InvestmentProfileForm />
                  <ProjectDashboard />
                  <AIModelInfo />
                </>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LandingPage onLogin={handleLogin} onRegister={(user) => console.log('Kayıt başarılı', user)} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App; 