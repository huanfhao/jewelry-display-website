'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function TestLoginPage() {
  const [result, setResult] = useState<any>(null);

  async function handleLogin() {
    try {
      const response = await signIn('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });

      setResult(response);
    } catch (error) {
      setResult(error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Login Test</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login as Test User
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
} 