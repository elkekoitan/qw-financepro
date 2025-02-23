import React from 'react';

function PredictionSummary({ predictions }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Tahmin Geçmişi</h3>
      {predictions.length === 0 ? (
        <div>Henüz tahmin yapılmadı.</div>
      ) : (
        <ul>
          {predictions.map((pred, index) => (
            <li key={index}>Tahmin #{index + 1}: {pred}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PredictionSummary; 