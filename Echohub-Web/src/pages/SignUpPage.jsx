import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Echohub from "../components/logo/Echohub";
import useSignUp from "../hooks/useSignUp";
import * as Yup from "yup";

const SignUpPage = () => {
  const { signUp, isLoading, error } = useSignUp();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const signUpSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    fullName: Yup.string().required("Full Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signUpSchema.validate(
        { password, fullName, username, email },
        { abortEarly: true }
      );
      signUp(email, username, fullName, password);
      setValidationError("");
    } catch (err) {
      setValidationError(err.message);
    }
  };

  return (
    <div className="max-w-screen-xl flex h-screen mx-auto p-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <Echohub />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
          </div>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {validationError && <p className="text-red-500">{validationError}</p>}

          <button
            className="btn text-lg rounded-full btn-primary text-white"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign up"}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="flex flex-col lg:w-fit gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
