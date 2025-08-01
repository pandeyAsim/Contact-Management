"use client";
import authService from "@/services/auth.service";
import { LoginRequest } from "@/types";
import {
  saveAccessToken,
  saveLoggedInUser,
  saveRefreshToken,
} from "@/utils/storageHelper";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for the field being updated
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    clearErrors();
    const errors: Record<string, string> = {};

    if (!form.email) {
      errors.email = "Email is required";
    }

    if (!form.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(form);

      // we can either save in single object or can use multiple as below
      saveAccessToken(response.data.accessToken);
      // setSecureItem("accessToken", response.data.accessToken);
      saveRefreshToken(response.data.refreshToken);
      saveLoggedInUser(response.data.user);

      router.replace("/dashboard");
    } catch (error) {
      let message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message || "Something went wrong";
      } else {
        message = "Something went wrong";
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fieldErrors,
    form,
    handleFieldChange,
    handleSubmit,
  };
};

export default useLogin;
