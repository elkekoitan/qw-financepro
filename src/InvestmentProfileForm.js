import React, { useState } from 'react';

function InvestmentProfileForm() {
  const [riskTolerance, setRiskTolerance] = useState('');
  const [assetAllocation, setAssetAllocation] = useState('');
  const [goals, setGoals] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!riskTolerance || !assetAllocation || !goals) {
      setError('Tüm alanlar doldurulmalıdır.');
      return;
    }
    try {
      const response = await fetch('/api/investment/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1, // Dummy kullanıcı ID
          risk_tolerance: riskTolerance,
          asset_allocation: assetAllocation,
          goals: goals
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Yatırım profili başarıyla oluşturuldu!');
        setRiskTolerance('');
        setAssetAllocation('');
        setGoals('');
      } else {
        setError(data.error || 'Profil oluşturulamadı.');
      }
    } catch (err) {
      setError('Hata oluştu.');
    }
  };

  return (
    <div style={{ margin: '20px', border: '1px solid #ccc', padding: '15px' }}>
      <h2>Yatırım Profili Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Risk Toleransı: </label>
          <input
            type="text"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Varlık Dağılımı: </label>
          <input
            type="text"
            value={assetAllocation}
            onChange={(e) => setAssetAllocation(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Hedefler: </label>
          <input
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </div>
        <button type="submit">Profil Oluştur</button>
      </form>
      {message && <div style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
}

export default InvestmentProfileForm; 