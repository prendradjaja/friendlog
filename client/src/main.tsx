import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HangoutsPage } from "./HangoutsPage";
import { DevtoolsPage } from "./DevtoolsPage";
import { Theme } from "@radix-ui/themes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HangoutsPage />,
  },
  {
    path: "/devtools",
    element: <DevtoolsPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  </StrictMode>,
);
