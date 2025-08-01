"use client";

import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { FiMail, FiArrowLeft } from "react-icons/fi";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const {
    form,
    isLoading,
    fieldErrors,
    handleFieldChange,
    handleSubmit,
  } = useForgotPassword();

  return (
    <div className="space-y-6 w-full max-w-md">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
          <FiMail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Forgot Password?
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            autoComplete="email"
            value={form.email}
            onChange={handleFieldChange}
            disabled={isLoading}
            className={`mt-1 block w-full rounded-md border border-secondary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldErrors.email ? "border-red-500 dark:border-red-500" : ""
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
        >
          <FiArrowLeft className="w-4 h-4 mr-1" />
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
