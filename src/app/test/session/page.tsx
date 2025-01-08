'use client';

import { useSession, signOut } from 'next-auth/react';

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <p className="text-gray-600">{status}</p>
        </div>

        {session && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Session Data</h2>
            <pre className="p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}

        {session && (
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
} 