import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';

interface User {
  email: string;
  name: string;
}

interface RegistrationFormProps {
  onRegister: (user: User) => void;
}

function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    const emailResult = Email.create(email);
    if (emailResult.isFailure()) {
      setError(emailResult.getError());
      return;
    }

    const passwordResult = Password.create(password);
    if (passwordResult.isFailure()) {
      setError(passwordResult.getError());
      return;
    }

    const nameResult = Name.create(name);
    if (nameResult.isFailure()) {
      setError(nameResult.getError());
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      onRegister({ email, name });
    } catch (err: any) {
      setError(err.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Ad Soyad
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-dark border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-dark border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-dark border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
          Şifre Tekrar
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-dark border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-900/50 text-red-400 text-sm rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
      </button>
    </form>
  );
}

export default RegistrationForm; 