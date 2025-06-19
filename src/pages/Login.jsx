import React, { useState } from "react";
import Title from "../components/Title";
import { NavLink } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign In");
  let current = currentState.split(" ");

  const onSubmitHandler = async (event) => {
    event.preventDetfault();
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl">
          <Title text1={current[0]} text2={current[1]} />
        </p>
      </div>
      {currentState === "Sign In" ? (
        ""
      ) : (
        <input
          placeholder="Name"
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
        />
      )}

      <input
        placeholder="Email"
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
      />
      <input
        placeholder="Password"
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
      />
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
            Sign In here
          </p>
        )}
      </div>
      <div className="flex justify-center">
        <button
          to={"/favorite"}
          type="submit"
          className="bg-black text-white text-sm px-10 py-4 border rounded-lg hover:bg-white hover:text-black hover:border-black hover:duration-300"
        >
          {currentState}
        </button>
      </div>
    </form>
  );
};

export default Login;
