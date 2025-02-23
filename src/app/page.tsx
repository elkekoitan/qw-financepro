'use client';

import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await signUp(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to FinancePro
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in or create an account
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <button
              onClick={() => handleLogin('test@example.com', 'password')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
            <button
              onClick={() => handleRegister('test@example.com', 'password')}
              className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 