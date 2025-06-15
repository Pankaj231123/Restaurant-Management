'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token'); // ✅ Replace with cookie or auth context if needed

      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        router.push('/auth/login'); // ⛔ redirect to login
        return;
      }

      try {
        const res = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/auth/login');
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error || 'No user data.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg bg-white shadow-xl rounded-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Your Profile</h2>

          <div className="space-y-3">
            <div className="flex">
              <span className="font-semibold w-28">Full Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-28">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-28">Phone:</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-28">Address:</span>
              <span>{user.address}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-28">Username:</span>
              <span>{user.username}</span>
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}
