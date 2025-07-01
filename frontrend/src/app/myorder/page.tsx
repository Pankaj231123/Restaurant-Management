'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface RawOrderExactlyMatchesBackend {
  id: number;
  quantity: number;
  totalPrice: number;
  menu: {
    id: number;
    name: string;
    price: number;
  };
  user: {
    id: number;
    email: string;
  };
}

interface OrderForUI {
  id: number;
  itemName: string;
  quantity: number;
  totalPrice: number;
}

export default function MyOrderPage() {
  const [orders, setOrders] = useState<OrderForUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('User not authenticated');
        setLoading(false);
        return;
      }

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
        const response = await axios.get<RawOrderExactlyMatchesBackend[]>(
          'http://localhost:3001/order',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allOrders = response.data;
        const myOrdersRaw = allOrders.filter((o) => o.user.id === userId);
        const myOrdersForUI: OrderForUI[] = myOrdersRaw.map((o) => ({
          id: o.id,
          itemName: o.menu.name,
          quantity: o.quantity,
          totalPrice: o.totalPrice,
        }));

        setOrders(myOrdersForUI);
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-base-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">🍽️ My Restaurant</h2>
          <nav className="space-x-4">
            <a href="/" className="hover:underline text-sm">Home</a>
            <a href="/menu1" className="hover:underline text-sm">Menu</a>
            <a href="/myorder" className="font-semibold text-sm text-primary">My Orders</a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-6 bg-base-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>

          {loading ? (
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-primary text-4xl"></span>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.itemName}</td>
                      <td>{order.quantity}</td>
                      <td>৳{order.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-base-300 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} My Restaurant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
