"use client";

import Link from "next/link";
import {
  FiUsers,
  FiMail,
  FiShield,
  FiCalendar,
  FiPhone,
  FiStar,
  FiChevronRight,
} from "react-icons/fi";

export default function ConnectHome() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-lime-50 via-fuchsia-50 to-sky-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-all">
      {/* Top Navigation */}
      <nav className="w-full bg-white/90 dark:bg-gray-950/80 shadow-lg border-b border-fuchsia-200 dark:border-fuchsia-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 p-2 shadow">
              <FiUsers className="h-6 w-6 text-white" />
            </span>
            <span className="text-xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300 tracking-widest select-none">
              LinkNest
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 text-fuchsia-800 dark:text-fuchsia-200 font-medium rounded hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-1.5 rounded bg-gradient-to-r from-sky-400 to-fuchsia-400 text-white font-bold shadow hover:from-sky-500 hover:to-fuchsia-500 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Area */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-16 md:py-32 relative bg-gradient-to-br from-fuchsia-100/60 to-sky-100/60 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-2xl w-full mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-fuchsia-800 dark:text-fuchsia-200 tracking-tight drop-shadow mb-5">
            Manage{" "}
            <span className="bg-gradient-to-r from-sky-400 via-fuchsia-400 to-lime-400 bg-clip-text text-transparent">
              People
            </span>{" "}
            Effortlessly
          </h1>
          <p className="text-lg md:text-xl text-fuchsia-700 dark:text-fuchsia-200 mb-8 font-medium">
            LinkNest brings your contacts, reminders, and conversations into one
            secure, vibrant space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center px-8 py-3 text-lg rounded-full bg-gradient-to-tr from-fuchsia-500 to-sky-400 hover:from-fuchsia-600 hover:to-sky-500 text-white font-bold shadow-lg transition focus:outline-none"
            >
              Try LinkNest Free
              <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-3 rounded-full bg-white/80 border border-fuchsia-300 dark:bg-gray-900 dark:border-fuchsia-700 text-fuchsia-700 font-semibold hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-14 md:py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-fuchsia-700 dark:text-fuchsia-200 mb-3">
            All-in-One Personal CRM
          </h2>
          <p className="text-base md:text-lg text-fuchsia-900 dark:text-fuchsia-100 max-w-xl mx-auto font-light">
            LinkNest is not just a contact book. It’s a smart assistant for your
            life’s real connections.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureBox
            icon={<FiMail />}
            color="bg-sky-100 dark:bg-sky-900/30 text-sky-500"
            title="Central Inbox"
            desc="Email, SMS, and chat—always organized and searchable."
          />
          <FeatureBox
            icon={<FiStar />}
            color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500"
            title="Pin People"
            desc="Favorite contacts always at your fingertips, sorted by your habits."
          />
          <FeatureBox
            icon={<FiShield />}
            color="bg-lime-100 dark:bg-lime-900/30 text-lime-600"
            title="Zero-Knowledge Security"
            desc="Your personal data is encrypted end-to-end, always private."
          />
          <FeatureBox
            icon={<FiPhone />}
            color="bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-500"
            title="Instant Call & Text"
            desc="Call or message without searching, right from your dashboard."
          />
          <FeatureBox
            icon={<FiCalendar />}
            color="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600"
            title="Smart Reminders"
            desc="Birthdays, meetings, follow-ups—never forget a thing."
          />
          <FeatureBox
            icon={<FiUsers />}
            color="bg-fuchsia-200 dark:bg-fuchsia-800/30 text-fuchsia-700"
            title="Flexible Groups"
            desc="Organize contacts into dynamic groups, auto-updated for you."
          />
        </div>
      </section>

      {/* CTAction */}
      <section className="relative mt-8 py-16 bg-gradient-to-l from-sky-400 to-fuchsia-400 dark:from-fuchsia-900 dark:to-sky-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/80 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Ready to Experience the New Way to Connect?
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-8">
            Start for free. Organize your world, your way—with LinkNest.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-3 text-lg font-bold text-fuchsia-700 bg-white hover:bg-fuchsia-50 rounded-full shadow-lg transition"
          >
            Get Started
            <FiChevronRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-8 border-t border-fuchsia-100 dark:border-fuchsia-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="bg-sky-400 p-2 rounded-full">
              <FiUsers className="text-white" />
            </span>
            <span className="text-lg font-bold text-fuchsia-700 dark:text-fuchsia-200 tracking-wide">
              LinkNest
            </span>
          </div>
          <p className="text-sm text-fuchsia-900 dark:text-fuchsia-200/70">
            © {new Date().getFullYear()} LinkNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureBox({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div
      className={`p-6 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-900 bg-white dark:bg-gray-950 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group`}
    >
      <div
        className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-fuchsia-800 dark:text-fuchsia-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-fuchsia-700 dark:text-fuchsia-200/80">
        {desc}
      </p>
    </div>
  );
}
