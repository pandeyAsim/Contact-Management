"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-950 rounded-xl shadow-2xl overflow-hidden">
        {/* Left Side - Info Panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10">
          <h2 className="text-3xl font-bold mb-2">
            Welcome to Contact Manager
          </h2>
          <p className="text-sm text-indigo-100 text-center">
            Organize your connections and stay in touch effortlessly.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Create Your Account
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fill in your details to get started
            </p>
          </div>

          <RegisterForm />

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
