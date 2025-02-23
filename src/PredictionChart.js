import React from 'react';

function PredictionChart({ data }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Tahmin Grafiği</h2>
      <div>
        {data.map((pred, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>Tahmin {index + 1}: {pred.value}</span>
            <div style={{ backgroundColor: '#e0e0df', width: '300px', height: '15px', display: 'inline-block', verticalAlign: 'middle' }}>
              <div style={{
                width: `${pred.value}%`,
                backgroundColor: 'green',
                height: '100%'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PredictionChart; 