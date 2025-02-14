import React, { useState } from "react";
import { FormInput } from "./form-input";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData.email, formData.password);
  };

  return (
    <div className="bg-[#120f0f80] p-8 rounded-lg shadow-2xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Welcome Back to{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2e5fff] to-[#e23c3c]">
          MeChat!
        </span>
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          label="Email"
        />
        <FormInput
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          label="Password"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md focus:outline-none hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-white">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};