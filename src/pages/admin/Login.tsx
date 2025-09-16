import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { getInfoAdminThunk, signInAdminThunk } from "@redux/thunk/authThunk";
import Title from "components/customer/Title";
import LoadingSpinner from "components/LoadingSpinner";
import { RoleType } from "common/enums/RoleType";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { errorAuth, loadingAuth } = useSelector(
    (state: RootState) => state.auth
  );

  const handleAuth = useCallback(async () => {
    try {
      const tokens = await dispatch(
        signInAdminThunk({
          emailOrPhone: email.trim(),
          password: password.trim(),
        })
      ).unwrap();

      const info = await dispatch(getInfoAdminThunk()).unwrap();

      if (info.role !== RoleType.CUSTOMER) {
        if (tokens?.refreshToken) {
          localStorage.setItem("REFRESH_TOKEN_ADMIN", tokens.refreshToken);
        }
        navigate("/admin/dashboard");
      } else {
        setError("You don't allow to access here!");
      }
    } catch (err: any) {
      console.error(err);
    }
  }, [dispatch, email, password]);

  return (
    <div className="flex items-center justify-center w-full h-screen text-gray-800">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAuth();
        }}
        className="w-full max-w-md bg-white  p-8 flex flex-col gap-6 border border-gray-200"
      >
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          <Title text1={"Welcome"} text2={"back"} />
        </h2>
        <p className="text-center text-gray-500 text-sm">Sign in to continue</p>

        {errorAuth && (
          <div className="flex items-center gap-2 border border-red-300 bg-red-100 text-red-700 px-3 py-2 text-sm rounded-lg">
            <span>❌</span>
            <span>{errorAuth}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 border border-red-300 bg-red-100 text-red-700 px-3 py-2 text-sm rounded-lg">
            <span>❌</span>
            <span>{error}</span>
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

        {/* Action buttons */}
        <button
          type="submit"
          disabled={
            email.trim().length === 0 ||
            password.trim().length === 0 ||
            loadingAuth
          }
          className={`w-full py-3 rounded-sm font-medium transition ${
            email.trim().length === 0 ||
            password.trim().length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loadingAuth ? (
            <LoadingSpinner size="small" color="white" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
