import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { token } = useParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
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

    setIsPending(true);
    try {
      const { password } = formData;
      const response = await Axios.post(
        "http://localhost:3000/auth/reset-password",
        {
          password,
          token, // Pass the token in the request body
        }
      );

      if (response.data.status) {
        setIsPending(false);
        toast.success("Password reset successful. Please sign in.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/sign-in");
      } else {
        setErrors({ server: response.data.message });
        setIsPending(false);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.response) {
        setErrors({ server: error.response.data.message });
      } else {
        setErrors({ server: "An error occurred. Please try again." });
      }
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="mx-8 md:mx-4 flex w-full max-w-[500px] flex-col gap-2 md:gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="flex text-2xl font-semibold md:justify-normal justify-center">
          Reset Password
        </h2>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm">
            New Password
          </label>
          <div className="input input-bordered relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              className="pr-4 w-full"
              style={{
                paddingTop: "calc(0.73rem - 1px)",
                paddingBottom: "calc(0.375rem - 1px)",
              }}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          </div>
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="text-sm">
            Confirm New Password
          </label>
          <div className="input input-bordered relative">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              className="pr-4 w-full"
              style={{
                paddingTop: "calc(0.73rem - 1px)",
                paddingBottom: "calc(0.375rem - 1px)",
              }}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your new password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              {isConfirmPasswordVisible ? (
                <EyeOutlined />
              ) : (
                <EyeInvisibleOutlined />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.server && <p className="text-red-500">{errors.server}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            isPending || !formData.password || !formData.confirmPassword
          }
        >
          {isPending ? "Resetting password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
