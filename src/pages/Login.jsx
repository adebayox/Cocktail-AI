import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { publicFetch } from "../utility/fetchFunction";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (data) =>
      publicFetch.request({
        method: "POST",
        url: "auth",
        data: {
          username: data.username,
          password: data.password,
        },
      }),
    onSuccess: (res) => {
      const token = res.data?.user?.token;
      const username = res.data?.user?.username;
      const id = res.data?.user?.id;

      useUserStore.getState().setUser({ token, username, id });

      if (res.data?.code == "00") {
        toast.success("Logged in");
        navigate("/home");
      } else {
        setError("Invalid username or password");
        toast.error("Invalid username or password");
      }
    },
    onError: (error) => {
      console.log("Error callback triggered:", error);
      setError("Login failed. Try again.");
      toast.error("Login failed. Try again.");
      console.error(error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-brutal-black flex items-center justify-center px-4 py-12">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            #00ff41 50px,
            #00ff41 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            #00ff41 50px,
            #00ff41 51px
          )`
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-5xl sm:text-6xl font-black uppercase text-brutal-white leading-[0.9] mb-3">
            Welcome<br/>Back
          </h1>
          <p className="font-mono text-brutal-accent text-sm uppercase tracking-wide">
            Enter your credentials
          </p>
        </div>

        {/* Form Card */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-brutal-white border-4 border-black p-6 sm:p-8 shadow-brutal-accent-lg"
        >
          {/* Error State */}
          {error && (
            <div className="mb-6 bg-brutal-error/10 border-4 border-brutal-error p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-brutal-error mr-3 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="font-bold uppercase text-brutal-error text-sm mb-1">Error</p>
                  <p className="font-mono text-sm text-brutal-error">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Username Field */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-black">
              Username
            </label>
            <div className="relative">
              <input
                className="w-full border-4 border-black px-4 py-4 text-lg font-mono focus:outline-none focus:border-brutal-accent bg-white placeholder:text-brutal-disabled"
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Your username"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brutal-disabled" strokeWidth={2.5} />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-black">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full border-4 border-black px-4 py-4 text-lg font-mono focus:outline-none focus:border-brutal-accent bg-white placeholder:text-brutal-disabled pr-12"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brutal-disabled hover:text-black transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-black text-brutal-accent py-4 px-8 text-xl font-display font-black uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors duration-150 shadow-brutal-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-brutal-accent flex items-center justify-center gap-3"
          >
            {loginMutation.isPending ? (
              <>
                <div className="w-6 h-6 border-4 border-brutal-accent border-t-transparent animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-sm font-mono text-brutal-disabled">
            No account?{" "}
            <a 
              href="/" 
              className="font-bold text-black underline decoration-2 underline-offset-2 hover:text-brutal-accent transition-colors"
            >
              Sign Up
            </a>
          </p>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-brutal-disabled uppercase tracking-wide">
            Cocktail Generator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
