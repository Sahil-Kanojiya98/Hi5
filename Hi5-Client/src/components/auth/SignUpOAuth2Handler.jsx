import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo/Hi5.svg";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { activateUser, checkUsername } from "../../services/api";
import { setToken } from "../../utils/localStorage";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";

const validationSchemas = [
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
      .max(50, "Fullname must not exceed 30 characters")
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

const SignUpOAuth2Handler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [identificationToken, setIdentificationToken] = useState(null);

  const initialValues = {
    username: "",
    fullname: "",
    dob: "",
    gender: "",
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      console.log("IdentificationToken: " + token);
      setIdentificationToken(token);
    } else {
      navigate("/signup");
    }
  }, [location.search, setIdentificationToken, navigate]);

  const submitStepData = async (values) => {
    if (step == 0) {
      setIsLoading(true);
      try {
        console.log("Form Value username:", values.username);
        const response = await checkUsername({ username: values.username });
        if (response.data?.isAvailable) {
          setStep(1);
        }
        setError(null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong, please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else if (step == 1) {
      setIsLoading(true);
      console.log("Form Values fullname:", values.fullname);
      console.log("Form Values dob:", values.dob);
      console.log("Form Values gender:", values.gender);
      try {
        const response = await activateUser(identificationToken, {
          username: values.username,
          fullname: values.fullname,
          dateOfBirth: values.dob,
          gender: values.gender.toUpperCase(),
        });

        if (response.data?.authToken) {
          setToken(response.data?.authToken);
          dispatch(
            setAuth({
              isAuthenticated: false,
              isInitializing: false,
              token: response.data?.authToken,
            })
          );
        }

        setError(null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong, please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 mx-auto px-6 py-8 min-h-screen">
      <div className="relative border-gray-300 dark:border-gray-700 bg-white dark:bg-black shadow-lg p-6 sm:p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-center items-center my-4 text-center">
          <a href="/">
            <img className="w-auto h-16" src={logo} alt="Hi5" />
          </a>
        </div>

        <h1 className="mb-4 font-bold text-center text-xl">
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
              className={`space-y-6 transition-opacity duration-500 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* Username Form Step */}
              {step === 0 && (
                <>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    Choose a unique username that will be displayed on your
                    profile.
                  </p>
                  <div>
                    <label
                      htmlFor="username"
                      className="block font-medium text-gray-900 text-sm dark:text-white"
                    >
                      Username
                    </label>
                    <Field
                      name="username"
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                      className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
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
              {step === 1 && (
                <>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    Please provide your full name, date of birth, and gender to
                    complete your profile. This information will help us
                    personalize your experience.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullname"
                        className="block font-medium text-gray-900 text-sm dark:text-white"
                      >
                        Full Name
                      </label>
                      <Field
                        name="fullname"
                        type="text"
                        id="fullname"
                        placeholder="Enter your full name"
                        className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
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
                        className="block font-medium text-gray-900 text-sm dark:text-white"
                      >
                        Date of Birth
                      </label>
                      <Field
                        name="dob"
                        type="date"
                        id="dob"
                        className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
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
                        className="block font-medium text-gray-900 text-sm dark:text-white"
                      >
                        Gender
                      </label>
                      <Field
                        name="gender"
                        as="select"
                        id="gender"
                        className="dark:border-gray-600 dark:bg-gray-700 mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 w-full dark:text-white focus:outline-none"
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
                        <p className="mt-2 ml-1 text-red-700 text-sm">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Show error from backend if exists */}
              {error && (
                <div className="ml-1 text-red-500 text-xs">{error}</div>
              )}

              {/* Submit or Next Button */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg focus:ring-4 focus:ring-blue-300 w-full font-semibold text-white focus:outline-none"
                  disabled={isLoading}
                >
                  {step == 0 ? "Continue" : "Finish"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default SignUpOAuth2Handler;
