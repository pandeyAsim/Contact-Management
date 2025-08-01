"use client";

import Link from "next/link";
import {
  FiUsers,
  FiShield,
  FiStar,
  FiArrowRight,
  FiMail,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-indigo-50 via-white to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-gray-200 dark:border-gray-800 shadow-md">
        <div className="max-w-screen-xl mx-auto px-6 py-5 flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <FiUsers className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Contact Manager
            </span>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link
              href="/login"
              className="text-sm text-slate-700 dark:text-slate-300 hover:underline"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full shadow hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
          Effortless{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-orange-500">
              Contact Management
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-orange-300 dark:bg-orange-500 opacity-30"></span>
          </span>
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          Stay connected, organized, and secure with a platform designed to
          manage your relationships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 text-base font-medium rounded-full shadow transition"
          >
            Get Started
            <FiArrowRight className="ml-2" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-base font-medium rounded-full transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-400 max-w-xl mx-auto">
            Power-packed features to simplify your contact management journey.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <FiUsers />,
              title: "Organize Smarter",
              desc: "Filter and tag your contacts with ease.",
              bg: "bg-indigo-100 dark:bg-indigo-900/20",
            },
            {
              icon: <FiShield />,
              title: "Stay Secure",
              desc: "Robust privacy with encrypted access.",
              bg: "bg-green-100 dark:bg-green-900/20",
            },
            {
              icon: <FiStar />,
              title: "Favorites & AI Insights",
              desc: "Track habits, set reminders, and more.",
              bg: "bg-orange-100 dark:bg-orange-900/20",
            },
            {
              icon: <FiMail />,
              title: "All-in-One Access",
              desc: "Emails, phones, socials—all together.",
              bg: "bg-yellow-100 dark:bg-yellow-900/20",
            },
            {
              icon: <FiPhone />,
              title: "One-Click Actions",
              desc: "Direct calling and messaging options.",
              bg: "bg-pink-100 dark:bg-pink-900/20",
            },
            {
              icon: <FiCalendar />,
              title: "Timely Reminders",
              desc: "Log events and nurture relationships.",
              bg: "bg-cyan-100 dark:bg-cyan-900/20",
            },
          ].map(({ icon, title, desc, bg }, index) => (
            <div
              key={index}
              className={`group p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition duration-300`}
            >
              <div
                className={`w-12 h-12 ${bg} rounded-md flex items-center justify-center mb-4 text-xl text-indigo-600 dark:text-indigo-300`}
              >
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 dark:bg-indigo-700 py-16">
        <div className="text-center px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let’s Get You Started
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join hundreds managing their connections effortlessly every day.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50 rounded-full shadow transition"
          >
            Register Now
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-slate-200 dark:border-slate-700 py-8">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <FiUsers className="text-indigo-600" />
            <span className="text-lg font-semibold text-slate-800 dark:text-white">
              Contact Manager
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Contact Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
