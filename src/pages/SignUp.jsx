import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Wine,
  Zap,
  ChefHat,
  Star,
} from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Signup attempted with:", formData);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 w-full h-full">
        {/* Large gradient bubbles */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-10 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Floating Cocktail Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Wine className="w-4 h-4 text-purple-300" />
            ) : i % 4 === 1 ? (
              <Sparkles className="w-3 h-3 text-pink-300" />
            ) : i % 4 === 2 ? (
              <ChefHat className="w-4 h-4 text-blue-300" />
            ) : (
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header with Logo */}
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-3 shadow-inner">
                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white mr-0.5" />
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* Sparkling effects */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                <div
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                CocktailCraft AI
              </h1>
              <p className="text-purple-200 text-base font-medium mb-1">
                Join the Bar, Mixologist!
              </p>
              <p className="text-purple-300/80 text-sm">
                Create your account to craft amazing cocktails with AI
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-purple-300/60
                             focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/15
                             transition-all duration-200 hover:bg-white/12"
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose your mixologist name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-purple-300/60
                             focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/15
                             transition-all duration-200 hover:bg-white/12"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-purple-300/60
                             focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/15
                             transition-all duration-200 hover:bg-white/12"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-purple-400 hover:text-purple-300 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-purple-400 hover:text-purple-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                         text-white font-semibold rounded-xl shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-purple-400/50
                         transition-all duration-200 transform hover:scale-105
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Joining the Bar...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Join the Cocktail Masters</span>
                    <ChefHat className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-purple-300/80 text-sm">
                Already a master mixologist?{" "}
                <a
                  href="/login"
                  className="text-purple-300 hover:text-purple-200 font-medium transition-colors hover:underline"
                >
                  Sign in to your bar
                </a>
              </p>
            </div>

            {/* Premium Features */}
            <div className="mt-6 bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-purple-200 text-sm font-medium mb-3 text-center">
                ✨ What you'll get as a member:
              </p>
              <div className="flex justify-center space-x-6 text-xs text-purple-300/80">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>AI-Powered</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Wine className="w-3 h-3" />
                  <span>Premium Recipes</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Craft Perfect</span>
                </span>
              </div>
            </div>

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
    </div>
  );
};

export default SignUp;
