import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import logo from "../assets/images/logo/Hi5.svg";
import googleLogo from "../assets/images/logo/google.svg";
import githubLogo from "../assets/images/logo/github.svg";
import useSignup from "../hooks/useSignUp";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchemas = [
  Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 6 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character: @ $ ! % * ? &"
      )
      .matches(
        /^[A-Za-z0-9@$!%*?&]+$/,
        "Password can only contain letters, numbers, and special characters (@ $ ! % * ? &)"
      )
      .required("Password is required"),
  }),

  Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d{6}$/, "OTP must only contain numbers")
      .required("OTP is required"),
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
  }),

  Yup.object({
    fullname: Yup.string()
      .min(3, "Fullname must be at least 3 characters")
      .max(50, "Fullname must not exceed 15 characters")
      .matches(/^[A-Za-z ]+$/, "Full name can only contain letters and spaces")
      .required("Full name is required"),
    dob: Yup.date()
      .max(new Date(), "Date of birth cannot be in the future")
      .required("Date of birth is required"),
    gender: Yup.string()
      .oneOf(
        ["male", "female", "other", "prefer_not_to_say"],
        "Please select a valid gender"
      )
      .required("Gender is required"),
  }),
];

const SignUpPage = () => {
  const { step, isLoading, error, submitStepData } = useSignup(); // Using the custom hook

  const initialValues = {
    email: "",
    password: "",
    otp: "",
    username: "",
    fullname: "",
    dob: "",
    gender: "",
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
            ? "Complete Your Profile"
            : "Sign Up to Hi5"}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step]}
          onSubmit={(values) => submitStepData(values)}
        >
          {({ errors, touched }) => (
            <Form
              className={`space-y-6 transition-opacity duration-500 ${isLoading ? "opacity-50" : "opacity-100"
                }`}
            >
              {/* Email & Password Form Step */}
              {step === 0 && (
                <>
                  <div className="space-y-4">
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
                        className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                        placeholder="name@company.com"
                        disabled={isLoading}
                      />
                      {touched.email && errors.email && (
                        <p className="mt-2 ml-1 text-red-700 text-sm">
                          {errors.email}
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
                      placeholder="Enter OTP"
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

              {/* Username Form Step */}
              {step === 2 && (
                <>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Choose a unique username that will be displayed on your
                    profile.
                  </p>
                  <div>
                    <label
                      htmlFor="username"
                      className="block font-medium text-gray-900 dark:text-white text-sm"
                    >
                      Username
                    </label>
                    <Field
                      name="username"
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                      className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                      disabled={isLoading}
                    />
                    {touched.username && errors.username && (
                      <p className="mt-2 ml-1 text-red-700 text-sm">
                        {errors.username}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Full Name, DOB & Gender Form Step */}
              {step === 3 && (
                <>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Please provide your full name, date of birth, and gender to
                    complete your profile. This information will help us
                    personalize your experience.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullname"
                        className="block font-medium text-gray-900 dark:text-white text-sm"
                      >
                        Full Name
                      </label>
                      <Field
                        name="fullname"
                        type="text"
                        id="fullname"
                        placeholder="Enter your full name"
                        className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                        disabled={isLoading}
                      />
                      {touched.fullname && errors.fullname && (
                        <p className="mt-2 ml-1 text-red-700 text-sm">
                          {errors.fullname}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="dob"
                        className="block font-medium text-gray-900 dark:text-white text-sm"
                      >
                        Date of Birth
                      </label>
                      <Field
                        name="dob"
                        type="date"
                        id="dob"
                        className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                        disabled={isLoading}
                      />
                      {touched.dob && errors.dob && (
                        <p className="mt-2 ml-1 text-red-700 text-sm">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block font-medium text-gray-900 dark:text-white text-sm"
                      >
                        Gender
                      </label>
                      <Field
                        name="gender"
                        as="select"
                        id="gender"
                        className="dark:bg-gray-700 mt-2 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full dark:text-white"
                        disabled={isLoading}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </Field>
                      {touched.gender && errors.gender && (
                        <p className="mt-2 ml-1 text-red-5 text-sm 700">
                          {errors.gender}
                        </p>
                      )}
                    </div>
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
                  {step == 0
                    ? "Sign Up"
                    : step == 1
                      ? "Verify"
                      : step == 2
                        ? "Continue"
                        : "Finish"}
                </button>
              </div>

              {step == 0 && (
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  Already have an account?
                  <Link
                    to="/login"
                    className="pl-2 font-medium text-blue-600 hover:underline"
                  >
                    Login
                  </Link>
                </p>
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

export default SignUpPage;
