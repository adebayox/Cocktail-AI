import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDom from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import "./index.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Homepage from "./pages/HomePage";
// bug fixed

import SharedRecipe from "./pages/SharedRecipe";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: () => notifyError(`Failed to get data`),
    },
    mutations: {
      onError: () => notifyError("Failed to get mutate data"),
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Homepage />,
  },
  {
    path: "/home/recipe/:recipeId",
    element: <SharedRecipe />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>
);
