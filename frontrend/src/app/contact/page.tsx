'use client';
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/generate-doc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) setModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>

      {/* Header */}
      <header className="bg-base-200 shadow-md px-6 py-3 flex items-center justify-between">
        <div style={{ fontFamily: "'Poiret One', cursive" }}>
          <a href="/" className="btn btn-ghost text-2xl text-black">🍽️ FOODIE</a>
        </div>
        <nav
          className="flex gap-6"
          style={{
            fontSize: "18px",
            color: "rgb(0, 0, 0)",
            fontFamily: "'Poiret One', cursive",
          }}
        >
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/myorder" className="hover:underline">Orders</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/auth/login" className="hover:underline">Log In</Link>
          <Link href="/auth/register" className="hover:underline">Create Account</Link>
        </nav>
      </header>

      {/* Main Section */}
      <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-8 flex items-center justify-center">
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <motion.button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Modal */}
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Message Sent!</h2>
              <p className="mb-4">Your message has been sent.</p>
              <a
                href="/mail.docx"
                download
                className="text-indigo-600 underline"
              >
                Download Mail.docx
              </a>
              <div className="mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
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
    </>
  );
}
