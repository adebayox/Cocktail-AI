import React, { useState } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Wine,
  Zap,
  ArrowRight,
} from "lucide-react";
import { publicFetch } from "../utility/fetchFunction";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/ui/Button";
import Loader from "../components/Loader";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
        toast.success("Login Successful");
      } else {
        toast.error("Invalid username or password");
      }
      navigate("/home");
    },
    onError: (error) => {
      console.log("Error callback triggered:", error);
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const forgotPasswordMutation = () => {};

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        {/* Large gradient orbs matching homepage theme */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div
          className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-500/25 to-purple-500/25 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-10 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Floating Cocktail Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Wine className="w-6 h-6 text-purple-300 transform rotate-12" />
            ) : i % 4 === 1 ? (
              <Sparkles className="w-4 h-4 text-pink-300" />
            ) : i % 4 === 2 ? (
              <Zap className="w-5 h-5 text-indigo-300" />
            ) : (
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Decorative Cocktail Glass SVGs */}
      <div className="absolute top-20 left-20 opacity-10">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="text-purple-300"
        >
          <path
            d="M20 30 L80 30 L55 55 L55 80 L45 80 L45 55 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <path
            d="M30 25 Q35 20 40 25"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="absolute bottom-32 right-16 opacity-10">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="text-indigo-400"
        >
          <rect
            x="35"
            y="20"
            width="30"
            height="60"
            rx="15"
            fill="currentColor"
          />
          <circle
            cx="50"
            cy="15"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M42 35 Q50 30 58 35"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Premium Glass Card with Purple Theme */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header Section */}
            <div className="text-center mb-8">
              {/* AI Cocktail Logo */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-2xl shadow-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 shadow-inner">
                  <div className="flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white mr-1" />
                    <Wine className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Sparkling effect */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
                <div
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300 bg-clip-text text-transparent">
                CocktailCraft AI
              </h1>
              <p className="text-purple-200 text-lg font-medium mb-1">
                Welcome Back, Mixologist!
              </p>
              <p className="text-purple-300/80 text-sm">
                Sign in to craft amazing cocktails with AI
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-purple-200 mb-3">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className="h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-300" />
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur border border-purple-400/30 rounded-2xl text-white placeholder-purple-300/60
                             focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 focus:bg-white/15
                             transition-all duration-300 ease-in-out hover:bg-white/12 hover:border-purple-400/50
                             shadow-inner"
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your mixologist name"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-purple-200 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-purple-400 group-focus-within:text-purple-300 transition-colors duration-300" />
                  </div>
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur border border-purple-400/30 rounded-2xl text-white placeholder-purple-300/60
                             focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/60 focus:bg-white/15
                             transition-all duration-300 ease-in-out hover:bg-white/12 hover:border-purple-400/50
                             shadow-inner"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your secret recipe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 group"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 pointer-events-none"></div>
                </div>
              </div>

              {/* Premium Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="group relative w-full overflow-hidden py-4 px-6 
                         bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 
                         hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800
                         text-white font-bold rounded-2xl shadow-xl
                         focus:outline-none focus:ring-4 focus:ring-purple-400/40
                         transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                         before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
              >
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {loginMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-lg">Mixing Your Access...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 animate-pulse" />
                      <span className="text-lg">Start Mixing Cocktails</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>

                {/* Button shimmer effect */}
                <div className="absolute inset-0 -top-full group-hover:top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-1000 ease-out"></div>
              </button>
            </form>

            {/* Footer with Purple Theme */}
            <div className="mt-8 text-center">
              <p className="text-purple-300/80 text-sm mb-4">
                New to cocktail crafting?{" "}
                <a
                  href="/"
                  className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-200 hover:underline decoration-purple-400"
                >
                  Join the bar
                </a>
              </p>

              {/* Premium badges */}
              <div className="flex justify-center space-x-4 text-xs text-purple-400/60">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>AI-Powered</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Wine className="w-3 h-3" />
                  <span>Premium Recipes</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Craft Perfect</span>
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-ping"></div>
            <div
              className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-ping"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute top-1/2 right-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>

            {/* Glass reflection effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Bottom Tagline */}
          <div className="text-center mt-6">
            <p className="text-purple-400/60 text-sm font-medium">
              "Where AI meets the art of mixology" 🍹✨
            </p>
          </div>
        </div>
      </div>

      {/* Additional floating elements for extra visual appeal */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-60"></div>
      <div
        className="absolute top-3/4 right-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-40"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/6 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-50"
        style={{ animationDelay: "4s" }}
      ></div>
    </div>
  );
};

export default Login;
