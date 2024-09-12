import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnonHomePage } from "./AnonHomePage";
import { HangoutsPage } from "./HangoutsPage";
import { DevtoolsPage } from "./DevtoolsPage";
import { CreateHangoutPage } from "./CreateHangoutPage";
import { Theme } from "@radix-ui/themes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AnonHomePage />,
    loader: AnonHomePage.loader,
  },
  {
    path: "/home",
    element: <HangoutsPage />,
    loader: HangoutsPage.loader,
  },
  {
    path: "/friends/:friendId",
    element: <HangoutsPage />,
    loader: HangoutsPage.loader,
  },
  {
    path: "/hangouts/new",
    element: <CreateHangoutPage />,
    loader: CreateHangoutPage.loader,
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
