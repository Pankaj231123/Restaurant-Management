// ── app/menu/page.tsx ── (or wherever your MenuPage lives)
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export type MenuItem = {
  id: string;
  title: string;
  description: string;
  price: number | string;
};

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const placeholder = '/images/placeholder.png';

  useEffect(() => {
    axios
      .get<MenuItem[]>('http://localhost:3001/menu')
      .then(res => setMenu(res.data))
      .catch(err => setError(err.message || 'Failed to load menu'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col justify-between">
      <header className="bg-base-200 shadow-md px-6 py-3 flex items-center justify-between">
        <div style={{ fontFamily: "'Poiret One', cursive" }}>
          <a href="/" className="btn btn-ghost text-2xl text-black">🍽️ FOODIE</a>
        </div>
        <nav
          className="flex gap-6"
          style={{ fontSize: '18px', color: 'rgb(0, 0, 0)', fontFamily: "'Poiret One', cursive" }}
        >
          <a href="/" className="hover:underline">Home</a>
          <a className="hover:underline cursor-pointer">Orders</a>
          <a href="/authenticated" className="hover:underline">My Profile</a>
          <a className="hover:underline cursor-pointer">Contact</a>
        </nav>
      </header>

      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map(item => {
            const priceNum =
              typeof item.price === 'number'
                ? item.price
                : parseFloat(item.price as string) || 0;
            const localImage = `/images/menu/${item.id}.jpg`;

            return (
              <div key={item.id} className="card bg-white shadow-lg rounded-lg overflow-hidden">
                <figure className="h-48 bg-gray-100">
                  <img
                    src={localImage}
                    alt={item.title}
                    className="object-cover w-full h-full"
                    onError={e => { e.currentTarget.src = placeholder; }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-lg">${priceNum.toFixed(2)}</span>
                    <button
                      className="btn btn-sm bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-full transition duration-300 ease-in-out hover:scale-105 hover:shadow-md flex items-center gap-2"
                      onClick={() => router.push(`/order?menuItem=${item.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
                      </svg>
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="footer flex flex-col md:flex-row justify-between p-10 bg-gradient-to-r from-indigo-300 to-indigo-600 text-white">
        <aside>
          <p className="text-xl font-bold mb-2">🍽 FOODIE</p>
          <p className="opacity-80">Smart restaurant solutions since 2025</p>
        </aside>
        <nav>
          <h6 className="footer-title text-lg font-semibold mb-2">Services</h6>
          <a className="link link-hover">Order Management</a><br />
          <a className="link link-hover">Menu Updates</a><br />
          <a className="link link-hover">Today's Offer</a>
        </nav>
        <nav>
          <h6 className="footer-title text-lg font-semibold mb-2">Contact</h6>
          <a className="link link-hover">📧 amipankaj231@gmail.com</a><br />
          <a className="link link-hover">📞 +880-1737890284</a>
        </nav>
      </footer>
    </div>
  );
}