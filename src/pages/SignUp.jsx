import React, { useState } from "react";
import { LockIcon, MailIcon, User } from "lucide-react";
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

  const navigate = useNavigate();

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
      // console.log(res);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signUpMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border border-gray-200 rounded-md p-4">
          <div className="flex items-center text-xl font-bold justify-center ">
            Create an Account
          </div>
          <div className="flex justify-center text-gray-600">
            Enter your credentials to create your account
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition duration-150 ease-in-out"
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition duration-150 ease-in-out"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition duration-150 ease-in-out"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              disabled={signUpMutation.isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                     text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 
                     to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all 
                     duration-150 ease-in-out transform hover:scale-[1.02]"
            >
              {signUpMutation.isPending ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-2" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="flex gap-2 justify-center text-sm mt-2">
            Already have an account? <a href="/login"> Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
