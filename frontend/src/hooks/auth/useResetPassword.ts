"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResetPasswordRequest } from "@/types";
import authService from "@/services/auth.service";
import { useToast } from "@/hooks/common/useToast";

export const useResetPassword = () => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState<ResetPasswordRequest>({
    token: "",
    password: "",
    confirmPassword: "",
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

    if (!form.token) {
      errors.token = "Reset token is required";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
      const response = await authService.resetPassword(form.token, form.password);
      showSuccess(response.message || "Password reset successfully! You can now login with your new password.");
      
      // Redirect to login after successful reset
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
        showError(err.response?.data?.message || "Failed to reset password. Please try again or request a new reset link.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setToken = (token: string) => {
    setForm(prev => ({ ...prev, token }));
  };

  return {
    form,
    isLoading,
    fieldErrors,
    handleFieldChange,
    handleSubmit,
    setToken,
  };
};

export default useResetPassword;
