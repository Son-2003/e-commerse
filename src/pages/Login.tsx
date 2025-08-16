import { useCallback, useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { getInfoThunk, signInUserThunk } from "@redux/thunk/authThunk";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { currentState, setCurrentState } = useContext(ShopContext);
  let current = currentState.split(" ");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { accessToken, refreshToken, errorAuth } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSignIn = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both your email and password to continue.");
      return;
    }

    try {
      await dispatch(
        signInUserThunk({
          emailOrPhone: trimmedEmail,
          password: trimmedPassword,
        })
      ).unwrap();
    } catch (err: any) {
      setError(err?.message ? t(err.message) : "Something went wrong");
      return;
    }
  }, [dispatch, email, password]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("ACCESS_TOKEN", accessToken);
      if (refreshToken) {
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
      }
      dispatch(getInfoThunk());
      navigate("/");
    }
  }, [accessToken, refreshToken]);

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl">
          <Title text1={current[0]} text2={current[1]} />
        </p>
      </div>
      {error && (
        <div className="flex items-center gap-2 border border-red-300 bg-red-100 text-red-800 px-3 py-2 text-sm w-full">
          <span>❌</span>
          <span>{errorAuth}</span>
        </div>
      )}

      {currentState === "Sign In" ? (
        ""
      ) : (
        <input
          placeholder="Name"
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
        />
      )}

      <div className="w-full">
        <input
          placeholder="Email"
          type="email"
          className={`w-full px-3 py-2 border border-gray-800 ${
            email.length === 0 ? "border-red-500 outline-none" : ""
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {email.length === 0 && (
          <span className="text-red-500 text-sm">Please input your email.</span>
        )}
      </div>

      <div className="w-full">
        <input
          placeholder="Password"
          type="password"
          className={`w-full px-3 py-2 border border-gray-800 ${
            password.length === 0
              ? "border-red-500 outline-none focus:border-2"
              : ""
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password.length === 0 && (
          <span className="text-red-500 text-sm">
            Please input your password.
          </span>
        )}
      </div>

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Sign In" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Sign In")}
            className="cursor-pointer"
          >
            Sign in here
          </p>
        )}
      </div>
      <div>
        <p>{errorAuth || error}</p>
      </div>
      <div className="flex justify-center">
        <button
          disabled={email.length === 0 || password.length === 0}
          onClick={handleSignIn}
          type="button"
          className={`bg-black text-white text-sm px-10 py-4 border rounded-lg hover:bg-white hover:text-black hover:border-black hover:duration-300 ${
            email.length === 0 || password.length === 0
              ? "cursor-not-allowed"
              : ""
          }`}
        >
          {currentState}
        </button>
      </div>
    </div>
  );
};

export default Login;
