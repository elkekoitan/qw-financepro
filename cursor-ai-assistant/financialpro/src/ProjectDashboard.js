import React, { useEffect, useState } from 'react';

function ProjectDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Dashboard bilgisi alınamadı');
        }
        const data = await response.json();
        setDashboard(data.dashboard);
      } catch (err) {
        setError(err.message || 'Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Yatırım Profilleri</h3>
        {dashboard.profiles && dashboard.profiles.length > 0 ? (
          <ul>
            {dashboard.profiles.map(profile => (
              <li key={profile.id || profile.user_id}>{`Kullanıcı ID: ${profile.user_id}, Risk Toleransı: ${profile.risk_tolerance}`}</li>
            ))}
          </ul>
        ) : (
          <p>Yatırım profili bulunamadı.</p>
        )}
      </div>
      <div>
        <h3>Haberler</h3>
        {dashboard.news && dashboard.news.length > 0 ? (
          <ul>
            {dashboard.news.map((newsItem, index) => (
              <li key={index}>{`${newsItem.title} - ${newsItem.content}`}</li>
            ))}
          </ul>
        ) : (
          <p>Haber bulunamadı</p>
        )}
      </div>
      <div>
        <h3>Sinyaller</h3>
        {dashboard.signals && dashboard.signals.length > 0 ? (
          <ul>
            {dashboard.signals.map((sig, index) => (
              <li key={index}>{`${sig.symbol}: ${sig.action}`}</li>
            ))}
          </ul>
        ) : (
          <p>Sinyal bulunamadı</p>
        )}
      </div>
    </div>
  );
}

export default ProjectDashboard; 