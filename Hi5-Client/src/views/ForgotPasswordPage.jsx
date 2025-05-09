import { Field, Form, Formik } from "formik";
import logo from "../assets/images/logo/Hi5.svg";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import useForgotPassword from "../hooks/useForgotPassword";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchemas = [
  Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
  }),

  Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must not exceed 15 characters")
      .required("Username is required"),
  }),

  Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d{6}$/, "OTP must only contain numbers")
      .required("OTP is required"),
    password: Yup.string()
      .min(8, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      )
      .matches(
        /^[A-Za-z0-9@$!%*?&]+$/, // Ensures NO other characters are allowed
        "Password can only contain letters, numbers, and special characters (@ $ ! % * ? &)"
      )
      .required("Password is required"),
  }),
];

const ForgotPasswordPage = () => {
  const {
    step,
    isLoading,
    error,
    submitStepData,
    selectedTab,
    setSelectedTab,
  } = useForgotPassword();

  const initialValues = {
    email: "",
    username: "",
    otp: "",
    password: "",
  };

  const [showPassword, setShowPassword] = useState(false);

  const getValidationSchema = () => {
    if (step == 0) {
      return selectedTab === "email"
        ? validationSchemas[0]
        : validationSchemas[1];
    }
    return validationSchemas[2];
  };

  return (
    <section className="flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 mx-auto px-6 py-8 min-h-screen">
      <div className="relative bg-white dark:bg-black shadow-lg p-6 sm:p-8 border-gray-300 dark:border-gray-700 rounded-lg w-full max-w-md">
        <div className="flex justify-center items-center my-4 text-center">
          <a href="/">
            <img className="w-auto h-16" src={logo} alt="Hi5" />
          </a>
        </div>

        <h1 className="mb-4 font-bold text-xl text-center">
          {step === validationSchemas.length
            ? "Reset Your Password"
            : "Forgot Password"}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={(values) => submitStepData(values)}
        >
          {({ errors, touched }) => (
            <Form
              className={`space-y-6 transition-opacity duration-500 ${isLoading ? "opacity-50" : "opacity-100"
                }`}
            >
              {/* Email/Username & Password Form Step */}
              {step === 0 && (
                <>
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      type="reset"
                      disabled={isLoading}
                      className={`p-2 text-sm font-medium transition-all duration-300 ${selectedTab === "email"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 border-b-2 border-white hover:border-gray-200"
                        }`}
                      onClick={() => setSelectedTab("email")}
                    >
                      Email
                    </button>
                    <button
                      type="reset"
                      disabled={isLoading}
                      className={`p-2 text-sm font-medium transition-all duration-300 ${selectedTab === "username"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 border-b-2 border-white hover:border-gray-200"
                        }`}
                      onClick={() => setSelectedTab("username")}
                    >
                      Username
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedTab === "email" && (
                      <div>
                        <label
                          htmlFor="email"
                          className="block font-medium text-gray-900 dark:text-white text-sm"
                        >
                          Your Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          id="email"
                          placeholder="name@company.com"
                          className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                          disabled={isLoading}
                        />
                        {touched.email && errors.email && (
                          <p className="mt-2 ml-1 text-red-700 text-sm">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedTab === "username" && (
                      <div>
                        <label
                          htmlFor="username"
                          className="block font-medium text-gray-900 dark:text-white text-sm"
                        >
                          Your Username
                        </label>
                        <Field
                          name="username"
                          type="text"
                          id="username"
                          placeholder="Enter your username"
                          className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                          disabled={isLoading}
                        />
                        {touched.username && errors.username && (
                          <p className="mt-2 ml-1 text-red-700 text-sm">
                            {errors.username}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* OTP Form Step */}
              {step === 1 && (
                <>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    A one-time password (OTP) has been sent to your email.
                    Please enter the 6-digit code below to verify your email
                    address.
                  </p>
                  <div>
                    <label
                      htmlFor="otp"
                      className="block font-medium text-gray-900 dark:text-white text-sm"
                    >
                      OTP
                    </label>
                    <Field
                      name="otp"
                      type="text"
                      id="otp"
                      placeholder="Choose a username"
                      className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                      disabled={isLoading}
                    />
                    {touched.otp && errors.otp && (
                      <p className="mt-2 ml-1 text-red-700 text-sm">
                        {errors.otp}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label
                      htmlFor="password"
                      className="block font-medium text-gray-900 dark:text-white text-sm"
                    >
                      Password
                    </label>
                    <div className="flex justify-between items-center gap-2 dark:bg-gray-700 mt-2 border dark:border-gray-600 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 w-full dark:text-white">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="bg-transparent p-2 focus:outline-none w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="p-2 focus:outline-none text-blue-600 hover:text-blue-800"
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="mt-2 ml-1 text-red-700 text-sm">
                        {errors.password}
                      </p>
                    )}
                  </div>

                </>
              )}

              {/* Show error from backend if exists */}
              {error && (
                <div className="ml-1 text-red-500 text-xs">{error}</div>
              )}

              {(step == 0 || step == 1) && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 w-full font-semibold text-white"
                    disabled={isLoading}
                  >
                    {step === 0 ? "Continue" : "Verify"}
                  </button>
                </div>
              )}

              {step == 2 && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  Your Password reset successful
                </p>
              )}

              {(step == 0 || step == 2) && (
                <>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    Back to
                    <Link
                      to="/login"
                      className="pl-2 font-medium text-blue-600 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
