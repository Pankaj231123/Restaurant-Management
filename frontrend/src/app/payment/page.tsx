'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as z from 'zod';

//
// Zod schema remains the same (expects a field named "token").
//
const paymentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(1, 'Amount must be more than 0'),
  currency: z.string().min(1, 'Currency is required'),
  token: z.string().min(1, 'Card token is required'),
});

type PaymentInput = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: '',
      amount: 0,
      currency: 'usd',
      token: '',
    },
  });

  const onSubmit = async (data: PaymentInput) => {
    const jwt = Cookies.get('token');
    if (!jwt) {
      toast.error('You must be logged in to make a payment');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3001/payments/process',
        {
          name: data.name,
          amount: data.amount,
          currency: data.currency,
          token: data.token,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(`Payment ${res.data.status}`);
      reset();
      setIsOpen(false);
      router.push('/authenticated'); // Redirect to authenticated page after payment
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err?.response?.data?.message || 'Payment failed');
    }
  };

  // Logout handler
  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/auth/login');
  };

  return (
    <>
      {/* Header with inline CSS */}
      <header
        style={{
          backgroundColor: '#ffffff',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px' }}>🍽️</span>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#333333',
                fontFamily: "'Poiret One', cursive",
              }}
            >
              FOODIE
            </span>
          </Link>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
         <Link
            href="/authenticated"
            style={{
              color: '#555555',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            My profile
          </Link>

          <Link
            href="/menu"
            style={{
              color: '#555555',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            Menu
          </Link>
          <Link
            href="/order"
            style={{
              color: '#555555',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            Orders
          </Link>
          <Link
            href="/contact"
            style={{
              color: '#555555',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            Contact
          </Link>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#e53e3e',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Main Payment Form */}
      <main
        style={{
          backgroundColor: '#f3f4f6',
          minHeight: 'calc(100vh - 160px)', // adjust for header+footer height
          padding: '40px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '700',
                textAlign: 'center',
                color: '#1f2937',
                marginBottom: '24px',
              }}
            >
              Enter Payment Details
            </h2>

            <Toaster position="top-center" />

            <button
              onClick={() => setIsOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#3182ce',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '16px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Make Payment
            </button>

            <Transition show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </Transition.Child>

                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                  }}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '16px',
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      }}
                    >
                      <Dialog.Title
                        style={{
                          fontSize: '20px',
                          fontWeight: '600',
                          marginBottom: '16px',
                          color: '#1f2937',
                        }}
                      >
                        Payment Details
                      </Dialog.Title>
                      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '16px' }}>
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontWeight: 500,
                              fontSize: '14px',
                              marginBottom: '4px',
                            }}
                          >
                            Name
                          </label>
                          <input
                            {...register('name')}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              outline: 'none',
                            }}
                          />
                          {errors.name && (
                            <p style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontWeight: 500,
                              fontSize: '14px',
                              marginBottom: '4px',
                            }}
                          >
                            Amount (USD)
                          </label>
                          <input
                            type="number"
                            {...register('amount', { valueAsNumber: true })}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              outline: 'none',
                            }}
                          />
                          {errors.amount && (
                            <p style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.amount.message}</p>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontWeight: 500,
                              fontSize: '14px',
                              marginBottom: '4px',
                            }}
                          >
                            Currency
                          </label>
                          <input
                            {...register('currency')}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              outline: 'none',
                            }}
                          />
                          {errors.currency && (
                            <p style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.currency.message}</p>
                          )}
                        </div>

                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontWeight: 500,
                              fontSize: '14px',
                              marginBottom: '4px',
                            }}
                          >
                            Card Token
                          </label>
                          <input
                            {...register('token')}
                            placeholder="e.g., tok_visa"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              outline: 'none',
                            }}
                          />
                          {errors.token && (
                            <p style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.token.message}</p>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '4px',
                              border: '1px solid #a0aec0',
                              backgroundColor: '#f7fafc',
                              cursor: 'pointer',
                              fontSize: '14px',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#3182ce',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: isSubmitting ? 'not-allowed' : 'pointer',
                              fontSize: '14px',
                            }}
                          >
                            {isSubmitting ? 'Processing...' : 'Pay Now'}
                          </button>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>
      </main>

      {/* Footer with inline CSS */}
      <footer
        style={{
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
          }}
        >
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>🍽 FOODIE</h4>
            <p style={{ fontSize: '14px', color: '#e2e8f0' }}>Smart restaurant solutions since 2025</p>
          </div>
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>Services</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#e2e8f0' }}>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#e2e8f0' }}>
                  Order Management
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#e2e8f0' }}>
                  Menu Updates
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#e2e8f0' }}>
                  Today’s Offer
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>Contact</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#e2e8f0' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <span>📧</span>
                <a href="mailto:amipankaj231@gmail.com" style={{ textDecoration: 'none', color: '#e2e8f0' }}>
                  amipankaj231@gmail.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>📞</span>
                <a href="tel:+8801737890284" style={{ textDecoration: 'none', color: '#e2e8f0' }}>
                  +880-1737890284
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#cbd5e0' }}>
          © 2025 FOODIE. All rights reserved.
        </div>
      </footer>
    </>
  );
}
