"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // modal state

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDark = () => setDarkMode((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const specials = [
    {
      title: "Chicken Burger",
      desc: "Juicy grilled chicken patty with fresh veggies",
      img: "/images/Cajun-Chicken-Burger-2.jpg",
    },
    {
      title: "Pizza",
      desc: "Pizza With Extra Cheese.",
      img: "/images/Pepperoni-Pizza-Recipe-Sip-Bite-Go.jpg",
    },
    {
      title: "Pasta",
      desc: "Italian Pasta.",
      img: "/images/Pasta.jpg",
    },
    {
      title: "Plain Paratha",
      desc: "With Fresh Olive Oil.",
      img: "/images/Triangle-Plain-Paratha-With-Yogurt-Pickle-.jpg",
    },
        {
      title: "South Indian Dosa",
      desc: "With Fresh Olive Oil.",
      img: "/images/Dosa.jpg",
    },

  ];

  const testimonials = [
    {
      name: "Alice",
      text: "Amazing food and great ambience!",
      avatar: "/images/alice.jpg",
    },
    {
      name: "Bob",
      text: "Best restaurant experience ever.",
      avatar: "/images/Bob.png",
    },
    {
      name: "Charlie",
      text: "Delicious dishes and friendly staff.",
      avatar: "/images/Charlie.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 dark:bg-gray-900 transition-colors">
      {/* Navbar */}
      <header className="bg-base-200 dark:bg-gray-800 shadow-md px-6 py-3 flex items-center justify-between">
        <div style={{ fontFamily: "'Poiret One', cursive" }}>
          <Link
            href="/"
            className="btn btn-ghost text-2xl text-black dark:text-white flex items-center gap-2"
          >
            🍽️ FOODIE
          </Link>
        </div>

        <nav
          className={`transform transition-transform flex-col md:flex-row md:flex gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-base-200 dark:bg-gray-800 md:bg-transparent p-4 md:p-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Link href="/menu" className="hover:underline text-black dark:text-white">Menu</Link>
          <Link href="/order" className="hover:underline text-black dark:text-white">Orders</Link>
          <Link href="/contact" className="hover:underline text-black dark:text-white">Contact</Link>
          <Link href="/auth/login" className="hover:underline text-black dark:text-white">Log In</Link>
          <Link href="/auth/register" className="hover:underline text-black dark:text-white">Create Account</Link>
        </nav>
      </header>

      {/* Hero */}
      <motion.div
        className="hero min-h-[60vh]"
        style={{
          background: "linear-gradient(to right,rgb(183, 211, 239),rgb(62, 128, 214))",
          color: "#1f2937",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content flex flex-col justify-center items-center text-center">
          <div className="max-w-md">
            <h1
              className="text-5xl font-bold mb-6 dark:text-white"
              style={{ fontFamily: "'Poiret One', cursive" }}
            >
              ART OF COOKING
            </h1>
            <p
              className="py-6 text-2xl md:text-3xl dark:text-white"
              style={{ fontFamily: "'Poiret One', cursive" }}
            >
              THE BEST RESTAURANT IN TOWN.
            </p>
            <Link href="/auth/login">
              <motion.button
                className="btn bg-indigo-500 text-white border-none hover:bg-indigo-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started →
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Menu Carousel */}
      <section className="p-10 bg-base-200 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
          Our Specials Menu
        </h2>
        <div className="flex overflow-x-auto gap-4 p-4">
          {specials.map((item, idx) => (
            <motion.div
              key={idx}
              className="min-w-[20rem] card bg-base-100 dark:bg-gray-700 shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <figure className="relative h-48">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover rounded-t-xl"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-10">
        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="p-6 bg-base-100 dark:bg-gray-700 rounded-2xl shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <h3 className="font-semibold dark:text-white">{t.name}</h3>
              </div>
              <p className="dark:text-gray-300">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <style jsx>{`
          .newsletter-section {
            padding: 2.5rem;
            background-color: rgb(163, 217, 220);
            color: white;
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
          }
          .newsletter-section h2 {
            font-size: 1.875rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .newsletter-section p {
            margin-bottom: 1.5rem;
          }
          .newsletter-input {
            padding: 0.75rem;
            border-radius: 0.5rem;
            color: black;
            flex-grow: 1;
          }
          .newsletter-button {
            background-color: white;
            color: rgb(0, 0, 0);
            border: none;
            padding: 0.75rem 1.25rem;
            border-radius: 0.5rem;
            cursor: pointer;
          }
          .newsletter-button:hover {
            background-color: rgb(29, 130, 59);
          }
          .newsletter-flex {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            justify-content: center;
          }
          @media (min-width: 640px) {
            .newsletter-flex {
              flex-direction: row;
            }
          }
        `}</style>

        <div className="max-w-xl mx-auto text-center">
          <h2>Join Our Newsletter</h2>
          <p>Get updates on new dishes, offers, and more!</p>
          <div className="newsletter-flex">
            <input
              id="emailInput"
              type="email"
              placeholder="Your email"
              className="newsletter-input"
            />
            <button
              className="newsletter-button"
              onClick={async () => {
                const input = document.getElementById("emailInput") as HTMLInputElement | null;
                if (input) {
                  const email = input.value;
                  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;

                  if (emailRegex.test(email)) {
                    try {
                      const response = await fetch("/api/save-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                      });

                      const result = await response.json();
                      setShowModal(true);
                      input.value = "";
                    } catch (error) {
                      alert("Error saving email.");
                    }
                  } else {
                    alert("Please enter a valid email address");
                  }
                } else {
                  alert("Email input not found");
                }
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-sm w-full p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              🎉 Subscribed Successfully!
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Thanks for subscribing to our newsletter.
            </p>
            <button
              className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer flex flex-col md:flex-row justify-between p-10 bg-gradient-to-r from-indigo-300 to-indigo-600 text-white">
        <aside>
          <p className="text-xl font-bold mb-2">🍽 FOODIE</p>
          <p className="opacity-80">Smart restaurant solutions since 2025</p>
        </aside>
        <nav>
          <h6 className="footer-title text-lg font-semibold mb-2">Services</h6>
          <a className="link link-hover">Order Management</a>
          <br />
          <a className="link link-hover">Menu Updates</a>
          <br />
          <a className="link link-hover">Today's Offer</a>
        </nav>
        <nav>
          <h6 className="footer-title text-lg font-semibold mb-2">Contact</h6>
          <a className="link link-hover">📧 amipankaj231@gmail.com</a>
          <br />
          <a className="link link-hover">📞 +880-1737890284</a>
        </nav>
      </footer>
    </div>
  );
}
