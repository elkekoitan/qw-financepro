import React, { useState, useEffect } from 'react';

function AIModelInfo() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchModelInfo() {
      try {
        const response = await fetch('/api/ai/model-info');
        if (!response.ok) {
          throw new Error('Model bilgisi alınamadı.');
        }
        const data = await response.json();
        setModelInfo(data.model);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchModelInfo();
  }, []);

  if (loading) return <div>Yapay Zeka Model Bilgisi Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Yapay Zeka Model Bilgisi</h3>
      <p>{modelInfo}</p>
    </div>
  );
}

export default AIModelInfo; 