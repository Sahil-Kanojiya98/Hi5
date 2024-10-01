import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Echohub from "../components/logo/Echohub";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import useLogin from "../hooks/useLogin";
import * as Yup from "yup";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const loginSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginSchema.validate({ password, email }, { abortEarly: true });
      await login(email, password);
      if (error) {
        throw new Error(error);
      }
      setValidationError("");
      if (user) {
        if (user.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setValidationError(err.message || "Login failed");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen p-4">
      <div className="flex-1 flex flex-col justify-center items-center sm:min-w-96">
        <form
          className="flex flex-col gap-4 w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          <Echohub />
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Let&apos;s go.
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow bg-transparent border-none focus:outline-none text-white"
              placeholder="Email"
              name="email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow bg-transparent border-none focus:outline-none text-white"
              placeholder="Password"
              name="password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {validationError && <p className="text-red-500">{validationError}</p>}
          <button
            type="submit"
            className="btn rounded-full btn-primary text-white text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
            aria-label="Login"
            disabled={isLoading} 
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button
              className="btn rounded-full btn-primary text-white btn-outline w-full hover:bg-white hover:text-primary focus:ring-4 focus:ring-blue-500"
              aria-label="Sign up"
            >
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
