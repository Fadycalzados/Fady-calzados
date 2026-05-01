import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from "react-router-dom";
import FadyCalzados from "../fady_final_v2.jsx";

function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

// Safety net: if /cart/* ever lands in React Router, hard-redirect to Shopify
function CartRedirect() {
  useEffect(() => {
    window.location.replace(
      "https://gfg8hj-yd.myshopify.com" + window.location.pathname + window.location.search
    );
  }, []);
  return null;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <FadyCalzados /> },
      { path: "/product/:productId", element: <FadyCalzados /> },
      { path: "/cart/*", element: <CartRedirect /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
