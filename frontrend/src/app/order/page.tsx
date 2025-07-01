'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // ✅ include useSearchParams
import Cookies from 'js-cookie';
import Link from 'next/link';

interface DecodedToken {
  sub: number;
  exp: number;
  iat: number;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role?: string;
}

function decodeJwt(token: string): DecodedToken {
  const payloadBase64 = token.split('.')[1];
  const payload = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(payload)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json) as DecodedToken;
}

export default function OrderPage() {
  const [menuItem, setMenuItem] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{ name: string; amount: number }>({
    name: '',
    amount: 0,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ get URL query params

  useEffect(() => {
    // ✅ Read menuItem from URL
    const menuItemFromQuery = searchParams?.get('menuItem');
    if (menuItemFromQuery) {
      const parsed = parseInt(menuItemFromQuery);
      if (!isNaN(parsed)) {
        setMenuItem(parsed);
      }
    }

    const token = Cookies.get('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const decoded = decodeJwt(token);
      if (!decoded?.sub) throw new Error('Token missing user ID');
      setUserId(decoded.sub);

      axios
        .get<UserProfile>('http://localhost:3001/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsername(res.data.username))
        .catch((err) => {
          console.error('Failed to fetch user profile:', err);
          Cookies.remove('token');
          router.push('/auth/login');
        });
    } catch (err) {
      console.error('Invalid token:', err);
      Cookies.remove('token');
      router.push('/auth/login');
    }
  }, [router, searchParams]); // ✅ include searchParams in deps

  const handleOrder = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = Cookies.get('token');
    if (!token || !userId) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3001/order',
        {
          menuItem: menuItem.toString(),
          quantity,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccess(true);
        setModalData({ name: `Menu Item #${menuItem}`, amount: quantity });
        setShowModal(true);
        setQuantity(1);
        setMenuItem(1);
        router.push(`/payment?name=Menu%20Item%20${menuItem}&amount=${quantity}`);
      } else {
        setError('Failed to place order.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (userId === null) return null;

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🍽️</span>
            <span
              className="text-2xl font-bold text-gray-800 dark:text-white"
              style={{ fontFamily: "'Poiret One', cursive" }}
            >
              FOODIE
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">Hello, {username}</span>
          </div>
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav
            className={`absolute md:static top-0 left-0 h-full md:h-auto w-2/3 md:w-auto bg-white dark:bg-gray-900 md:bg-transparent md:flex items-center gap-6 p-6 md:p-0 transform transition-transform ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
          >
            <Link href="/menu" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500">Menu</Link>
            <Link href="/order" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500">Orders</Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-indigo-500">Contact</Link>
            <button
              className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
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

      {/* Order Form */}
      <main className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Place Your Order</h2>
            {error && <div className="bg-red-50 text-red-800 px-4 py-2 rounded-md mb-4">{error}</div>}
            {success && <div className="bg-green-50 text-green-800 px-4 py-2 rounded-md mb-4">Order placed successfully!</div>}

            <div className="mb-6 flex justify-center">
              <div className="relative w-32 h-32 overflow-hidden rounded-lg shadow-inner bg-gray-100">
                <img
                  src={`/images/menu/${menuItem}.jpg`}
                  alt={`Menu item ${menuItem}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/menu/default.jpg';
                  }}
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="menuItem" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Menu Item ID</label>
                <input
                  id="menuItem"
                  type="number"
                  min={1}
                  max={10}
                  value={menuItem}
                  onChange={(e) => setMenuItem(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter item number"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="How many?"
                />
              </div>

              <button
                type="button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform"
                onClick={handleOrder}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-11/12 max-w-sm">
            <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">Order Summary</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2"><span className="font-medium">Item:</span> {modalData.name}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-4"><span className="font-medium">Quantity:</span> {modalData.amount}</p>
            <div className="flex justify-center">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-2">🍽 FOODIE</h4>
            <p className="text-gray-200">Smart restaurant solutions since 2025</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Services</h5>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline text-gray-200">Order Management</a></li>
              <li><a href="#" className="hover:underline text-gray-200">Menu Updates</a></li>
              <li><a href="#" className="hover:underline text-gray-200">Today's Offer</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Contact</h5>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:amipankaj231@gmail.com" className="hover:underline text-gray-200">amipankaj231@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+8801737890284" className="hover:underline text-gray-200">+880-1737890284</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-300 text-sm">© 2025 FOODIE. All rights reserved.</div>
      </footer>
    </>
  );
}
