// File: src/app/myorder/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

//
// 1) Define two TypeScript interfaces:
//    - RawOrderExactlyMatchesBackend: the shape you get from GET /order
//    - OrderForUI:   the minimal info you want to render in your table
//

interface RawOrderExactlyMatchesBackend {
  id: number;
  quantity: number;
  totalPrice: number;
  menu: {
    id: number;
    name: string;
    price: number;
    // … any other fields your Menu entity might have
  };
  user: {
    id: number;
    email: string;
    // … any other fields your UserResponseDto contains (except password)
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
      // ——————————————————————————————————————————————————————————
      // 1) Read JWT token from cookie. If missing, bail out.
      // ——————————————————————————————————————————————————————————
      const token = Cookies.get('token');
      if (!token) {
        toast.error('User not authenticated');
        setLoading(false);
        return;
      }

      // ——————————————————————————————————————————————————————————
      // 2) Read userId from localStorage. If missing or invalid, bail out.
      // ——————————————————————————————————————————————————————————
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

      // ——————————————————————————————————————————————————————————
      // 3) Hit GET /order (no “/:userId” param, because your backend does
      //    NOT have a GET /order/:userId route). Then filter locally.
      // ——————————————————————————————————————————————————————————
      try {
        const response = await axios.get<RawOrderExactlyMatchesBackend[]>(
          'http://localhost:3001/order',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // “allOrders” is the complete array of every order in your DB:
        const allOrders = response.data;

        // Filter to only those orders where order.user.id === our userId:
        const myOrdersRaw = allOrders.filter((o) => o.user.id === userId);

        // Map each “raw” order into exactly the shape our table wants:
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
    <div className="min-h-screen p-6 bg-base-200">
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
    </div>
  );
}
