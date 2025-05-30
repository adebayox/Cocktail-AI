import React, { useState, useMemo } from "react";
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
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { publicFetch } from "../utility/fetchFunction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/ui/Button";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  const navigate = useNavigate();

  // Password strength validation
  const passwordValidation = useMemo(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    let strength = "weak";
    let color = "text-red-400";
    let bgColor = "bg-red-400";

    if (passedChecks >= 5) {
      strength = "strong";
      color = "text-green-400";
      bgColor = "bg-green-400";
    } else if (passedChecks >= 3) {
      strength = "medium";
      color = "text-yellow-400";
      bgColor = "bg-yellow-400";
    }

    return {
      checks,
      strength,
      color,
      bgColor,
      score: passedChecks,
      isValid: passedChecks >= 4, // Require at least 4 criteria
    };
  }, [formData.password]);

  const signUpMutation = useMutation({
    mutationFn: (data) =>
      publicFetch.request({
        method: "POST",
        url: "users",
        data: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      }),
    onSuccess: (res) => {
      console.log(res.data?.code);
      if (res.data?.code == "00") {
        navigate("/login");
        toast.success("Signup Successful");
      } else {
        toast.error("Invalid username or password");
      }
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

    // Show password help when user starts typing password
    if (name === "password" && value.length > 0 && !showPasswordHelp) {
      setShowPasswordHelp(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check password strength before submitting
    if (!passwordValidation.isValid) {
      toast.error("Please create a stronger password following the guidelines");
      return;
    }

    setIsLoading(true);
    signUpMutation.mutate(formData);
  };

  const PasswordStrengthIndicator = () => (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              level <= passwordValidation.score
                ? passwordValidation.bgColor
                : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${passwordValidation.color}`}>
          Password strength: {passwordValidation.strength}
        </span>
        {passwordValidation.isValid && (
          <Check className="w-4 h-4 text-green-400" />
        )}
      </div>

      {/* Password Requirements */}
      {showPasswordHelp && (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-purple-200 text-sm font-medium mb-2 flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Password Requirements:
          </p>
          <div className="space-y-1">
            {[
              { key: "length", text: "At least 8 characters long" },
              { key: "uppercase", text: "One uppercase letter (A-Z)" },
              { key: "lowercase", text: "One lowercase letter (a-z)" },
              { key: "number", text: "One number (0-9)" },
              { key: "special", text: "One special character (!@#$%^&*)" },
            ].map(({ key, text }) => (
              <div key={key} className="flex items-center text-xs">
                {passwordValidation.checks[key] ? (
                  <Check className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                ) : (
                  <X className="w-3 h-3 text-red-400 mr-2 flex-shrink-0" />
                )}
                <span
                  className={`${
                    passwordValidation.checks[key]
                      ? "text-green-300"
                      : "text-purple-300/80"
                  }`}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="absolute inset-0 w-full h-full">
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

      {/* Cocktail Elements */}
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
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-3 shadow-inner">
                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white mr-0.5" />
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                <div
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Cocktail Recipe Generator
              </h1>
              <p className="text-purple-200 text-base font-medium mb-1">
                Join the Bar!
              </p>
              <p className="text-purple-300/80 text-sm">
                Create your account to craft amazing cocktails with AI
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur border rounded-xl text-white placeholder-purple-300/60
                             focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-white/15
                             transition-all duration-200 hover:bg-white/12 ${
                               formData.password && !passwordValidation.isValid
                                 ? "border-red-400/50"
                                 : formData.password &&
                                   passwordValidation.isValid
                                 ? "border-green-400/50"
                                 : "border-white/20"
                             }`}
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

                {/* Password Strength Indicator */}
                {formData.password && <PasswordStrengthIndicator />}
              </div>

              <button
                type="submit"
                disabled={
                  signUpMutation.isPending ||
                  (formData.password && !passwordValidation.isValid)
                }
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                         text-white font-semibold rounded-xl shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-purple-400/50
                         transition-all duration-200 transform hover:scale-105
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center space-x-2"
              >
                {signUpMutation.isPending ? (
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

              {/* Password warning if weak */}
              {formData.password && !passwordValidation.isValid && (
                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 rounded-lg p-3 border border-red-400/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Please create a stronger password to secure your account
                  </span>
                </div>
              )}
            </form>

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
                  <span>Easy to Use</span>
                </span>
              </div>
            </div>

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>
          </div>

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
