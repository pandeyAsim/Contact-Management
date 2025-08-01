"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Link from "next/link";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return <ResetPasswordForm token={token || undefined} />;
};

const ResetPasswordPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <section className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter a new password to secure your account.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="flex justify-center py-6">
              <div className="animate-pulse h-8 w-8 rounded-full bg-indigo-500"></div>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>

        <footer className="pt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already remember it?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-500 hover:underline hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign in here
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
