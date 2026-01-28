import { type RouteObject } from "react-router-dom";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import SignupPage from "@/pages/signup";
import ForgotPasswordPage from "@/pages/forgot-password";
import PublicErrorPage from "@/pages/public-error";
import PublicLayout from "@/layouts/publicLayout";
import AboutPage from "@/pages/about";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <PublicErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export default publicRoutes;
