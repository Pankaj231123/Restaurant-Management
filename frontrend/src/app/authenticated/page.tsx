'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  role?: string;
  // (otp, otpExpires, createdAt, updatedAt are omitted since they aren’t displayed or edited)
};

const AuthenticatedPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── NEW STATE FOR EDIT MODE & FORM VALUES ─────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<{
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    address: string;
  }>({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
  });


  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await axios.get<User>('http://localhost:3001/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Authentication failed:', error);
        Cookies.remove('token');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    }
  }, [user]);


  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading user profile...</div>;
  }


  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (user) {
      setFormValues({
        name: user.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  


  const handleSave = async () => {
    if (!user) return;

    const token = Cookies.get('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axios.put<User>(
        `http://localhost:3001/users/${user.id}`,
        {
          name: formValues.name,
          username: formValues.username,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber,
          address: formValues.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };


  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🍽️</span>
            <span
              className="text-2xl font-bold text-gray-800"
              style={{ fontFamily: "'Poiret One', cursive" }}
            >
              FOODIE
            </span>
          </Link>

          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <nav
            className={`absolute md:static top-0 left-0 h-full md:h-auto w-2/3 md:w-auto bg-white md:bg-transparent md:flex items-center gap-6 p-6 md:p-0 transform transition-transform ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
          >
            
            <Link
              href="/mypayments"
              className="text-gray-700 hover:text-indigo-500 transition-colors"
            >
              My Payment History
            </Link>


            <Link
              href="/menu1"
              className="text-gray-700 hover:text-indigo-500 transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/myorder"
              className="text-gray-700 hover:text-indigo-500 transition-colors"
            >
               My Orders
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-indigo-500 transition-colors"
            >
              Contact
            </Link>
            <button
              className="mt-4 md:mt-0 w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-all"
              onClick={() => {
                Cookies.remove('token');
                router.push('/auth/login');
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
          {/* Welcome & Profile Card */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-xl">Welcome back,</p>
                <h1 className="text-4xl font-bold text-white mt-2">
                  {user?.username}!
                </h1>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* ── EDIT MODE TOGGLE ────────────────────────────────────────── */}
              {!isEditing ? (
                <button
                  onClick={handleStartEditing}
                  className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Edit Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formValues.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formValues.phoneNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Address</label>
                      <textarea
                        name="address"
                        value={formValues.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* ── END OF EDIT FORM ────────────────────────────────────────── */}

              <p className="text-gray-700 mb-4">
                Here’s your dashboard overview. Check out your profile details below or jump straight to placing an order.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card: User ID */}
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.962 13.962 0 0112 15c3.151 0 6.06.992 8.485 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">User ID</p>
                    <p className="text-gray-800 font-semibold">{user?.id}</p>
                  </div>
                </div>

                {/* Card: Name */}
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="text-gray-800 font-semibold">{user?.name}</p>
                  </div>
                </div>

                {/* Card: Username */}
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Username</p>
                    <p className="text-gray-800 font-semibold">{user?.username}</p>
                  </div>
                </div>

                {/* Card: Email */}
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-8 0v2m8-10V5a4 4 0 00-8 0v6m4 4v.01" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-800 font-semibold">{user?.email}</p>
                  </div>
                </div>

                {/* Card: Phone Number */}
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h2l3.5 7-3.5 7H3m5-7h13" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="text-gray-800 font-semibold">{user?.phoneNumber}</p>
                  </div>
                </div>

                {/* Card: Address */}
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center md:col-span-2">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l4 4-4 4-4-4 4-4zM12 22v-8m0 0l3 3m-3-3l-3 3" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="text-gray-800 font-semibold">{user?.address}</p>
                  </div>
                </div>

                {user?.role && (
                  <div className="bg-indigo-50 p-4 rounded-lg flex items-center md:col-span-2">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4-4 4 4m0-8l-4 4-4-4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-600 text-sm">Role</p>
                      <p className="text-gray-800 font-semibold">{user.role}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => router.push('/order')}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Place Order
                </button>
                <button
                  onClick={() => {
                    Cookies.remove('token');
                    router.push('/auth/login');
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          {/* Quick Links & Tips */}
          <aside className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">Quick Actions</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/menu1"
                  className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition"
                >
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                  </svg>
                  <span className="text-gray-700">Browse Menu</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition"
                >
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l3-3 3 3m0-8l-3 3-3-3" />
                  </svg>
                  <span className="text-gray-700">View Past Orders</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition"
                >
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m4 4v-8" />
                  </svg>
                  <span className="text-gray-700">Contact Support</span>
                </Link>
              </li>
            </ul>
            <div className="bg-indigo-100 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Tip of the Day</h4>
              <p className="text-gray-700 text-sm">
                Try our chef’s special “Spicy Mango Salad” for a refreshing taste!
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-2">🍽 FOODIE</h4>
            <p className="text-gray-200">Smart restaurant solutions since 2025</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Services</h5>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline text-gray-200">
                  Order Management
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-200">
                  Menu Updates
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-200">
                  Today's Offer
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Contact</h5>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:amipankaj231@gmail.com" className="hover:underline text-gray-200">
                  amipankaj231@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+8801737890284" className="hover:underline text-gray-200">
                  +880-1737890284
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-300 text-sm">
          © 2025 FOODIE. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default AuthenticatedPage;
