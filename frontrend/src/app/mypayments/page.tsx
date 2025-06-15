// File: src/app/mypayments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

//
// 1) Define two TypeScript interfaces:
//    - RawPaymentExactlyMatchesBackend: the shape we get from GET /payments
//    - PaymentForUI:           the minimal info we want to render in the table
//

interface RawPaymentExactlyMatchesBackend {
  id: number;
  userId: number;
  stripePaymentIntentId: string;
  amount: number;  // note: on the Nest side, amount was numeric; after JSON‐stringify it comes as a number
  currency: string;
  status: string;
  createdAt: string; // ISO timestamp
}

interface PaymentForUI {
  id: number;
  amount: number;
  currency: string;
  status: string;
  date: string;   // e.g. format from createdAt
  intentId: string; // stripePaymentIntentId
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<PaymentForUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPayments = async () => {
      // 1) Read JWT token from cookie. If missing, bail out.
      const token = Cookies.get('token');
      if (!token) {
        toast.error('User not authenticated');
        setLoading(false);
        return;
      }

      // 2) Read userId from localStorage. If missing or invalid, bail out.
      const rawUserId = localStorage.getItem('userId');
      if (!rawUserId) {
        toast.error('Missing user ID');
        setLoading(false);
        return;
      }
      const userId = parseInt(rawUserId, 10);
      if (isNaN(userId)) {
        toast.error('Invalid user ID');
        setLoading(false);
        return;
      }

      try {
        // 3) Call GET /payments (no “/:userId” param—our backend already filters).
        const response = await axios.get<RawPaymentExactlyMatchesBackend[]>(
          'http://localhost:3001/payments',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // “allPayments” is everyone's payments, but because the backend used findByUserId, it is already filtered.
        const allPayments = response.data;

        // Sanity check (optional): filter again on the client if you really want:
        const myPaymentsRaw = allPayments.filter((p) => p.userId === userId);

        // Map each “raw” payment into the shape our table wants:
        const myPaymentsForUI: PaymentForUI[] = myPaymentsRaw.map((p) => ({
          id: p.id,
          amount: p.amount,
          currency: p.currency.toUpperCase(),
          status: p.status,
          date: new Date(p.createdAt).toLocaleString(), // format however you like
          intentId: p.stripePaymentIntentId,
        }));

        setPayments(myPaymentsForUI);
      } catch (err) {
        console.error('Error fetching payments:', err);
        toast.error('Failed to load your payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* ─────── HEADER ─────── */}
      <header
        style={{
          backgroundColor: '#333',
          color: '#fff',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>MyApp Payments Dashboard</h2>
      </header>

      {/* ─────── MAIN CONTENT (unchanged) ─────── */}
      <main style={{ flex: 1 }}>
        <div className="min-h-screen p-6 bg-base-200">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Payments</h1>

            {loading ? (
              <div className="flex justify-center items-center">
                <span className="loading loading-spinner text-primary text-4xl"></span>
              </div>
            ) : payments.length === 0 ? (
              <p className="text-center text-gray-500">No payments found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Intent ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.amount}</td>
                        <td>{p.currency}</td>
                        <td>
                          <span
                            className={`badge ${
                              p.status === 'succeeded' ? 'badge-success' : 'badge-warning'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>{p.date}</td>
                        <td className="truncate max-w-xs">{p.intentId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─────── FOOTER ─────── */}
      <footer
        style={{
          backgroundColor: '#333',
          color: '#fff',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          © 2025 MyApp Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
