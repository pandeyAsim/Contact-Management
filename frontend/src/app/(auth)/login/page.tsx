"use client";

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    if (verified === "true") {
      setMessage({
        type: "success",
        text: "Email verified successfully! You can now sign in.",
      });
    } else if (error) {
      switch (error) {
        case "invalid-verification-token":
          setMessage({
            type: "error",
            text: "Invalid verification token. Please request a new verification email.",
          });
          break;
        case "verification-token-expired":
          setMessage({
            type: "error",
            text: "Verification token has expired. Please request a new verification email.",
          });
          break;
        case "verification-failed":
          setMessage({
            type: "error",
            text: "Email verification failed. Please try again.",
          });
          break;
        default:
          setMessage({
            type: "error",
            text: "An error occurred during verification.",
          });
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-950 rounded-xl shadow-lg overflow-hidden">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-10">
          <h2 className="text-3xl font-bold mb-2">Contact Manager</h2>
          <p className="text-sm text-indigo-100 text-center">
            Organize your contacts and stay connected with ease.
          </p>
        </div>

        {/* Right Panel */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Sign In
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`rounded-md px-4 py-3 text-sm font-medium border ${
                message.type === "success"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <div className="text-left pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
