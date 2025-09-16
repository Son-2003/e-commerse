import { useCallback, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import {
  getInfoThunk,
  signInUserThunk,
  signUpCustomerThunk,
} from "@redux/thunk/authThunk";
import { resetAuthError } from "@redux/slices/authSlice";
import { ShopContext } from "../../context/ShopContext";
import { CheckCircleOutlined } from "@ant-design/icons";
import Title from "components/customer/Title";
import LoadingSpinner from "components/LoadingSpinner";
import { AVA_DEFAULT } from "common/constant";

const Login = () => {
  const { currentState, setCurrentState } = useContext(ShopContext);
  const isSignIn = currentState === "Sign In";

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { errorAuth, loadingAuth } = useSelector(
    (state: RootState) => state.auth
  );

  const isLengthValid = password.length >= 8 && password.length <= 20;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_\-]/.test(password);
  const isPasswordValid =
    isLengthValid && hasUpperCase && hasDigit && hasSpecialChar;

  const handleAuth = useCallback(async () => {
    try {
      let tokens;
      if (isSignIn) {
        tokens = await dispatch(
          signInUserThunk({
            emailOrPhone: email.trim(),
            password: password.trim(),
          })
        ).unwrap();
      } else {
        tokens = await dispatch(
          signUpCustomerThunk({
            fullName: name.trim(),
            email: email.trim(),
            password: password.trim(),
            phone: "",
            image: AVA_DEFAULT,
          })
        ).unwrap();
      }

      if (tokens?.refreshToken) {
        localStorage.setItem("REFRESH_TOKEN", tokens.refreshToken);
      }

      await dispatch(getInfoThunk());
    } catch (err: any) {
      console.error(err);
    }
  }, [dispatch, name, email, password, isSignIn]);

  return (
    <div className="flex flex-col items-center w-[90%] rounded-sm m-auto mt-14 gap-4 text-gray-800 h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAuth();
        }}
        className="w-full max-w-md bg-white  p-8 flex flex-col gap-6 border border-gray-200"
      >
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          {isSignIn ? (
            <Title text1={"Welcome"} text2={"back"} />
          ) : (
            <Title text1={"Create"} text2={"account"} />
          )}
        </h2>
        <p className="text-center text-gray-500 text-sm">
          {isSignIn ? "Sign in to continue" : "Sign up to get started with us"}
        </p>

        {errorAuth && (
          <div className="flex items-center gap-2 border border-red-300 bg-red-100 text-red-700 px-3 py-2 text-sm rounded-lg">
            <span>❌</span>
            <span>{errorAuth}</span>
          </div>
        )}

        {!isSignIn && (
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-sm outline-none"
            />
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-sm outline-none"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-sm outline-none"
          />
        </div>

        {!isSignIn && (
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircleOutlined
                className={`${
                  isLengthValid ? "text-teal-500" : "text-gray-400"
                }`}
              />
              <span>Password must be 8–20 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleOutlined
                className={`${
                  hasUpperCase && hasDigit ? "text-teal-500" : "text-gray-400"
                }`}
              />
              <span>Include uppercase letters and numbers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleOutlined
                className={`${
                  hasSpecialChar ? "text-teal-500" : "text-gray-400"
                }`}
              />
              <span>At least one special character</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <button
          type="submit"
          disabled={
            email.trim().length === 0 ||
            password.trim().length === 0 ||
            (!isSignIn && !isPasswordValid) ||
            loadingAuth
          }
          className={`w-full py-3 rounded-sm font-medium transition ${
            email.trim().length === 0 ||
            password.trim().length === 0 ||
            (!isSignIn && !isPasswordValid)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loadingAuth ? (
            <LoadingSpinner size="small" color="white" />
          ) : isSignIn ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Switch Form */}
        <p className="text-center text-sm text-gray-500">
          {isSignIn ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign Up");
                  setEmail("");
                  setPassword("");
                  dispatch(resetAuthError());
                }}
                className="text-black font-medium cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign In");
                  setEmail("");
                  setPassword("");
                  setName("");
                  dispatch(resetAuthError());
                }}
                className="text-black font-medium cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
