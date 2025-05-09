import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import logo from "../assets/images/logo/Hi5.svg";
import googleLogo from "../assets/images/logo/google.svg";
import githubLogo from "../assets/images/logo/github.svg";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchemas = [
  Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      )
      .matches(
        /^[A-Za-z0-9@$!%*?&]+$/,
        "Password can only contain letters, numbers, and special characters (@ $ ! % * ? &)"
      )
      .required("Password is required"),
  }),

  Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must not exceed 15 characters")
      .matches(
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores"
      )
      .required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  }),

  Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d{6}$/, "OTP must only contain numbers")
      .required("OTP is required"),
  }),
];

const LoginPage = () => {
  const {
    step,
    isLoading,
    error,
    submitStepData,
    selectedTab,
    setSelectedTab,
  } = useLogin();

  const initialValues = {
    email: "",
    username: "",
    password: "",
    otp: "",
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleRedirect = () => {
    console.log("login with google");
    location.href = "http://localhost:8080/oauth2/authorize/google";
  };

  const handleGithubRedirect = () => {
    console.log("login with github");
    location.href = "http://localhost:8080/oauth2/authorize/github";
  };

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
      <div className="relative bg-white dark:bg-black shadow-lg p-6 sm:px-8 border-gray-300 dark:border-gray-700 rounded-lg w-full max-w-md">
        <div className="flex justify-center items-center mt-1 mb-3 text-center">
          <Link to="/">
            <img className="w-auto h-16" src={logo} alt="Hi5" />
          </Link>
        </div>

        <h1 className="mb-4 font-bold text-xl text-center">
          {step === validationSchemas.length
            ? "Complete Your Profile"
            : "Login to Hi5"}
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
                </>
              )}

              {/* Show error from backend if exists */}
              {error && (
                <div className="ml-1 text-red-700 text-xs">{error}</div>
              )}

              {/* Submit or Next Button */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 w-full font-semibold text-white"
                  disabled={isLoading}
                >
                  {step === 0 ? "Login" : "Verify"}
                </button>
              </div>

              {step == 0 && (
                <>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    Create a new account ?
                    <Link
                      to="/signup"
                      className="pl-2 font-medium text-blue-600 hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>

                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    Forgot password ?
                    <Link
                      to="/forgot-password"
                      className="pl-2 font-medium text-blue-600 hover:underline"
                    >
                      Reset it here
                    </Link>
                  </p>
                </>
              )}
            </Form>
          )}
        </Formik>

        {step == 0 && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="border-gray-300 border-t w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-md text-gray-500 dark:text-white">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="gap-3 grid grid-cols-2 mt-6">
              <button
                onClick={handleGoogleRedirect}
                className="inline-flex justify-center bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 shadow-sm px-4 py-2 rounded-md w-full text-gray-700 dark:text-white"
                disabled={isLoading}
              >
                <img className="w-6" src={googleLogo} alt="Google Logo" />
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={handleGithubRedirect}
                className="inline-flex justify-center bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 shadow-sm px-4 py-2 rounded-md w-full text-gray-700 dark:text-white"
                disabled={isLoading}
              >
                <img className="w-6" src={githubLogo} alt="GitHub Logo" />
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoginPage;