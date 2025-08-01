"use client";
import useLogin from "@/hooks/auth/useLogin";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ForgotPasswordForm from "./ForgotPasswordForm";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const {
    form,
    error,
    isLoading,
    fieldErrors,
    handleFieldChange,
    handleSubmit,
  } = useLogin();

  // Show forgot password form
  if (showForgotPassword) {
    return (
      <ForgotPasswordForm 
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
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
          placeholder="Email address"
          autoComplete="email"
          value={form.email}
          onChange={handleFieldChange}
          className={`mt-1 block w-full rounded-md border border-secondary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-3 ${
            fieldErrors.email ? "border-red-500 dark:border-red-500" : ""
          }`}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleFieldChange}
            className={`mt-1 block w-full rounded-md border border-secondary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-3 pr-10 ${
              fieldErrors.password ? "border-red-500 dark:border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
        >
          Forgot your password?
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isLoading ? "Logging in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
