import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    Axios.defaults.withCredentials = true;
    setIsSigningIn(true);
    try {
      const { email } = formData;
      const response = await Axios.post(
        "http://localhost:3000/auth/forgot-password",
        {
          email,
        }
      );

      if (response.data.status) {
        setIsSigningIn(false);
        alert("Check your email to reset password");
        navigate("/sign-in");
      } else {
        setErrors({ server: response.data.message });
        setIsSigningIn(false);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Request error:", error);
      if (error.response) {
        setErrors({ server: error.response.data.message });
      } else if (error.request) {
        setErrors({
          server: "No response from server. Please try again later.",
        });
      } else {
        setErrors({ server: "An error occurred. Please try again." });
      }
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="mx-8 md:mx-4 flex w-full max-w-[500px] flex-col gap-2 md:gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="flex text-2xl font-semibold md:justify-normal justify-center">
          Forgot Password
        </h2>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSigningIn || !formData.email}
        >
          {isSigningIn ? "Sending..." : "Send to Email"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
