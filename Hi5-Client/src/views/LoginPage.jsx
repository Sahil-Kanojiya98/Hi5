import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import logo from "../assets/images/logo/Hi5.svg";
import googleLogo from "../assets/images/logo/google.svg";
import githubLogo from "../assets/images/logo/github.svg";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";

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
      .required("Password is required"),
  }),

  Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must not exceed 15 characters")
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

  const handleGoogleRedirect = () => {
    console.log("login with google");
    location.href = "http://localhost:8080/oauth2/authorize/google";
  };

  const handleGithubRedirect = () => {
    console.log("login with github");
    location.href = "http://localhost:8080/oauth2/authorize/github";
  };

  // Dynamically set the validation schema based on the selected tab
  const getValidationSchema = () => {
    if (step == 0) {
      return selectedTab === "email"
        ? validationSchemas[0]
        : validationSchemas[1];
    }
    return validationSchemas[2];
  };

  return (
    <section className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 mx-auto px-6 py-8 min-h-screen">
      <div className="relative dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-6 sm:p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-center items-center my-4 text-center">
          <a href="/">
            <img className="w-auto h-16" src={logo} alt="Hi5" />
          </a>
        </div>

        <h1 className="mb-4 font-bold text-center text-gray-900 text-xl dark:text-white">
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
              className={`space-y-6 transition-opacity duration-500 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* Email/Username & Password Form Step */}
              {step === 0 && (
                <>
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      type="reset"
                      disabled={isLoading}
                      className={`p-2 text-sm font-medium transition-all duration-300 ${
                        selectedTab === "email"
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
                      className={`p-2 text-sm font-medium transition-all duration-300 ${
                        selectedTab === "username"
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
                          className="block font-medium text-gray-900 text-sm dark:text-white"
                        >
                          Your Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          id="email"
                          placeholder="name@company.com"
                          className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
                          disabled={isLoading}
                        />
                        {touched.email && errors.email && (
                          <p className="mt-2 ml-1 text-red-500 text-sm">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedTab === "username" && (
                      <div>
                        <label
                          htmlFor="username"
                          className="block font-medium text-gray-900 text-sm dark:text-white"
                        >
                          Your Username
                        </label>
                        <Field
                          name="username"
                          type="text"
                          id="username"
                          placeholder="Enter your username"
                          className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
                          disabled={isLoading}
                        />
                        {touched.username && errors.username && (
                          <p className="mt-2 ml-1 text-red-500 text-sm">
                            {errors.username}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="password"
                        className="block font-medium text-gray-900 text-sm dark:text-white"
                      >
                        Password
                      </label>
                      <Field
                        name="password"
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
                        disabled={isLoading}
                      />
                      {touched.password && errors.password && (
                        <p className="mt-2 ml-1 text-red-500 text-sm">
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
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    A one-time password (OTP) has been sent to your email.
                    Please enter the 6-digit code below to verify your email
                    address.
                  </p>
                  <div>
                    <label
                      htmlFor="otp"
                      className="block font-medium text-gray-900 text-sm dark:text-white"
                    >
                      OTP
                    </label>
                    <Field
                      name="otp"
                      type="text"
                      id="otp"
                      placeholder="Choose a username"
                      className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
                      disabled={isLoading}
                    />
                    {touched.otp && errors.otp && (
                      <p className="mt-2 ml-1 text-red-500 text-sm">
                        {errors.otp}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Show error from backend if exists */}
              {error && (
                <div className="mt-4 p-2 border-red-500 rounded-lg text-red-500 text-xs borde">
                  {error}
                </div>
              )}

              {/* Submit or Next Button */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg focus:ring-4 focus:ring-blue-300 w-full font-semibold text-white focus:outline-none"
                  disabled={isLoading}
                >
                  {step === 0 ? "Login" : "Verify"}
                </button>
              </div>

              {step == 0 && (
                <>
                  <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                  Create a new account ?
                    <Link
                      to="/signup"
                      className="pl-2 font-medium text-blue-600 hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>

                  <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
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
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-white">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="gap-3 grid grid-cols-2 mt-6">
              <button
                onClick={handleGoogleRedirect}
                className="inline-flex justify-center border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 shadow-sm px-4 py-2 border rounded-md w-full text-gray-700 dark:text-white"
                disabled={isLoading}
              >
                <img className="w-6" src={googleLogo} alt="Google Logo" />
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={handleGithubRedirect}
                className="inline-flex justify-center border-gray-300 dark:border-gray-900 bg-white hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 shadow-sm px-4 py-2 border rounded-md w-full text-gray-700 dark:text-white"
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
