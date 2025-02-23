import React, { useState } from 'react';

function RegistrationForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Kayıt başarılı, lütfen giriş yapın!');
        if (onRegister) onRegister(data.user);
      } else {
        setError(data.error || 'Kayıt başarısız.');
      }
    } catch (err) {
      setError('Kayıt sırasında hata oluştu.');
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Kullanıcı Adı: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Şifre: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Şifre (Tekrar): </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>Kayıt Ol</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
    </div>
  );
}

export default RegistrationForm; 