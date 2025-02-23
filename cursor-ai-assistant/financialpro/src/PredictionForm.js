import React, { useState } from 'react';
import PredictionSummary from './PredictionSummary';

function PredictionForm() {
  const [features, setFeatures] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const handlePredict = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    // Convert comma separated string to array of numbers
    const featureArray = features.split(',').map(str => parseFloat(str.trim()));
    if (featureArray.some(isNaN)) {
      setError('Lütfen virgülle ayrılmış geçerli sayılar girin.');
      return;
    }
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featureArray })
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.prediction);
        setPredictions(prev => [...prev, data.prediction]);
      } else {
        setError(data.error || 'Tahmin alınamadı.');
      }
    } catch (err) {
      setError('Tahmin alma başarısız oldu.');
    }
  };

  const clearHistory = () => {
    setPredictions([]);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Tahmin Formu</h2>
      <form onSubmit={handlePredict}>
        <input
          type="text"
          value={features}
          placeholder="Özellikleri girin (virgülle ayrılmış)"
          onChange={(e) => setFeatures(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Tahmin Yap</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {result !== null && <div style={{ marginTop: '10px' }}>Tahmin: {result}</div>}
      <PredictionSummary predictions={predictions} />
      {predictions.length > 0 && (
        <button onClick={clearHistory} style={{ marginTop: '10px', padding: '5px 10px' }}>Tahmin Geçmişini Temizle</button>
      )}
    </div>
  );
}

export default PredictionForm; 