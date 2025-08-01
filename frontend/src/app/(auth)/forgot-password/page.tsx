"use client";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border-l-4 border-indigo-500 dark:border-indigo-600 shadow-xl rounded-lg p-6 space-y-6">
        {/* Branding Header */}
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Forgot Password
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form Card */}
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />

        {/* Link to login */}
        <div className="text-left pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
