"use client";

import { useState } from "react";
import { ForgotPasswordRequest } from "@/types";
import authService from "@/services/auth.service";
import { useToast } from "@/hooks/common/useToast";

export const useForgotPassword = () => {
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState<ForgotPasswordRequest>({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(form.email);
      showSuccess(response.message || "Password reset email sent successfully! Please check your inbox.");
      setForm({ email: "" }); // Clear form on success
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors: Record<string, string> = {};
        err.response.data.errors.forEach((error: any) => {
          if (error.path) {
            backendErrors[error.path] = error.message;
          }
        });
        setFieldErrors(backendErrors);
      } else {
        showError(err.response?.data?.message || "Failed to send password reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    fieldErrors,
    handleFieldChange,
    handleSubmit,
  };
};

export default useForgotPassword;
