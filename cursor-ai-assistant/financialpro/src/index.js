console.log('React Application is loaded');
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ProjectDashboard from './ProjectDashboard';
import PredictionChart from './PredictionChart';

function PredictionForm() {
  const [features, setFeatures] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const featuresArray = features.split(',')
      .map(num => parseFloat(num.trim()))
      .filter(num => !isNaN(num));

    if (featuresArray.length === 0) {
      setError('Lütfen geçerli sayısal değerler giriniz.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const randomPrediction = Math.floor(Math.random() * 100);
      const prediction = { value: randomPrediction, text: `YOLO mod prediction: ${randomPrediction}` };
      setResult(prediction.text);
      setPredictionHistory(prevHistory => [...prevHistory, prediction]);
      setError(null);
      setLoading(false);
    }, 1000);
  };

  const handleClearHistory = () => {
    setPredictionHistory([]);
  };

  return (
    <div>
      <h1>FinancialPro Tahmin Sistemi - YOLO Mode (Hard Mode)</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="features">Özellikleri girin (virgülle ayrılmış sayılar):</label><br />
        <input
          type="text"
          id="features"
          value={features}
          onChange={e => setFeatures(e.target.value)}
          placeholder="Örn: 1,2,3"
          size="30"
        /><br /><br />
        <button type="submit">Tahmin Al (YOLO Mode)</button>
      </form>
      {loading && <div>Yükleniyor...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {result !== null && <div>Tahmin: {result}</div>}
      <br />
      <h2>Tahmin Geçmişi</h2>
      {predictionHistory.length > 0 ? (
        <div>
          <ul>
            {predictionHistory.map((pred, index) => (
              <li key={index}>{pred.text}</li>
            ))}
          </ul>
          <button onClick={handleClearHistory}>Geçmişi Temizle</button>
        </div>
      ) : (
        <div>Henüz tahmin yapılmadı.</div>
      )}
      {predictionHistory.length > 0 && <PredictionChart data={predictionHistory} />}
    </div>
  );
}

function App() {
  return (
    <div>
      <PredictionForm />
      <ProjectDashboard />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 