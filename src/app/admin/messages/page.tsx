'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      <div className="grid gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg border ${
              message.read ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{message.name}</h3>
                <p className="text-sm text-gray-600">{message.email}</p>
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(message.createdAt), 'PPp')}
              </div>
            </div>
            <p className="text-gray-700 mb-4">{message.message}</p>
            {!message.read && (
              <button
                onClick={() => markAsRead(message.id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 