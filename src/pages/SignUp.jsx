import React, { useState, useMemo } from "react";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { publicFetch } from "../utility/fetchFunction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    let strength = "WEAK";
    let color = "text-brutal-error";
    let bgColor = "bg-brutal-error";

    if (passedChecks >= 5) {
      strength = "STRONG";
      color = "text-brutal-accent";
      bgColor = "bg-brutal-accent";
    } else if (passedChecks >= 3) {
      strength = "MEDIUM";
      color = "text-yellow-500";
      bgColor = "bg-yellow-500";
    }

    return {
      checks,
      strength,
      color,
      bgColor,
      score: passedChecks,
      isValid: passedChecks >= 4,
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
        toast.success("Signed up");
      } else {
        toast.error("Invalid username or password");
      }
    },
    onError: (error) => {
      console.log("Error callback triggered:", error);
      toast.error("Error. Try again.");
      console.error(error);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password" && value.length > 0 && !showPasswordHelp) {
      setShowPasswordHelp(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      toast.error("Password too weak");
      return;
    }

    setIsLoading(true);
    signUpMutation.mutate(formData);
  };

  const PasswordStrengthIndicator = () => (
    <div className="mt-4">
      {/* Strength Bar */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 border-2 border-black transition-all duration-300 ${
              level <= passwordValidation.score
                ? passwordValidation.bgColor
                : "bg-brutal-white"
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-mono font-bold uppercase ${passwordValidation.color}`}>
          Strength: {passwordValidation.strength}
        </span>
        {passwordValidation.isValid && (
          <Check className="w-5 h-5 text-brutal-accent" strokeWidth={3} />
        )}
      </div>

      {/* Password Requirements */}
      {showPasswordHelp && (
        <div className="bg-brutal-white border-4 border-black p-4">
          <p className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center text-black">
            <Lock className="w-4 h-4 mr-2" strokeWidth={3} />
            Requirements
          </p>
          <div className="space-y-2">
            {[
              { key: "length", text: "8+ characters" },
              { key: "uppercase", text: "Uppercase (A-Z)" },
              { key: "lowercase", text: "Lowercase (a-z)" },
              { key: "number", text: "Number (0-9)" },
              { key: "special", text: "Special (!@#$%)" },
            ].map(({ key, text }) => (
              <div key={key} className="flex items-center font-mono text-sm">
                {passwordValidation.checks[key] ? (
                  <Check className="w-4 h-4 text-brutal-accent mr-2 flex-shrink-0" strokeWidth={3} />
                ) : (
                  <X className="w-4 h-4 text-brutal-error mr-2 flex-shrink-0" strokeWidth={3} />
                )}
                <span className={passwordValidation.checks[key] ? "text-brutal-accent" : "text-brutal-disabled"}>
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
            Create<br/>Account
          </h1>
          <p className="font-mono text-brutal-accent text-sm uppercase tracking-wide">
            Sign up to save recipes
          </p>
        </div>

        {/* Form Card */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-brutal-white border-4 border-black p-6 sm:p-8 shadow-brutal-accent-lg"
        >
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
                placeholder="Username"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brutal-disabled" strokeWidth={2.5} />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-black">
              Email
            </label>
            <div className="relative">
              <input
                className="w-full border-4 border-black px-4 py-4 text-lg font-mono focus:outline-none focus:border-brutal-accent bg-white placeholder:text-brutal-disabled"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brutal-disabled" strokeWidth={2.5} />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-black">
              Password
            </label>
            <div className="relative">
              <input
                className={`w-full border-4 px-4 py-4 text-lg font-mono focus:outline-none bg-white placeholder:text-brutal-disabled pr-12 ${
                  formData.password && !passwordValidation.isValid
                    ? "border-brutal-error"
                    : formData.password && passwordValidation.isValid
                    ? "border-brutal-accent"
                    : "border-black focus:border-brutal-accent"
                }`}
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
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

            {/* Password Strength Indicator */}
            {formData.password && <PasswordStrengthIndicator />}
          </div>

          {/* Error Message */}
          {formData.password && !passwordValidation.isValid && (
            <div className="mb-6 bg-brutal-error/10 border-l-4 border-brutal-error px-4 py-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-brutal-error mr-2 flex-shrink-0" strokeWidth={2.5} />
                <span className="font-mono text-sm text-brutal-error">
                  Stronger password required
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={signUpMutation.isPending || (formData.password && !passwordValidation.isValid)}
            className="w-full bg-black text-brutal-accent py-4 px-8 text-xl font-display font-black uppercase border-4 border-black hover:bg-brutal-accent hover:text-black transition-colors duration-150 shadow-brutal-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-brutal-accent flex items-center justify-center gap-3"
          >
            {signUpMutation.isPending ? (
              <>
                <div className="w-6 h-6 border-4 border-brutal-accent border-t-transparent animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm font-mono text-brutal-disabled">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="font-bold text-black underline decoration-2 underline-offset-2 hover:text-brutal-accent transition-colors"
            >
              Log In
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

export default SignUp;
