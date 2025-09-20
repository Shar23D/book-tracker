import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    if (!email || !password) return setMessage("Fill in both fields.");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm sign up!");
  };

  const handleLogin = async () => {
    if (!email || !password) return setMessage("Fill in both fields.");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Logged in successfully!");
  };

  const handleResetPassword = async () => {
    if (!email) return setMessage("Enter your email to reset password.");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/new-password",
    });
    if (error) setMessage(error.message);
    else setMessage("Check your email to reset your password.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (mode === "login") handleLogin();
      if (mode === "signup") handleSignUp();
      if (mode === "forgot") handleResetPassword();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login"
            ? "Login"
            : mode === "signup"
              ? "Sign Up"
              : "Reset Password"}
        </h2>

        {message && <p className="mb-4 text-red-600 text-center">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 mb-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        {mode !== "forgot" && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 mb-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        )}

        {mode === "login" && (
          <p className="text-sm text-gray-600 text-right mb-2">
            <button
              className="hover:underline"
              onClick={() => setMode("forgot")}
            >
              Forgot password?
            </button>
          </p>
        )}

        <div className="flex flex-col space-y-2">
          {mode === "login" && (
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          )}
          {mode === "signup" && (
            <button
              onClick={handleSignUp}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Sign Up
            </button>
          )}
          {mode === "forgot" && (
            <button
              onClick={handleResetPassword}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Send Reset Link
            </button>
          )}
        </div>

        <p className="text-sm text-center mt-4">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Remember your password?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
