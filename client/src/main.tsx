import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnonHomePage } from "./AnonHomePage";
import { HangoutsPage } from "./HangoutsPage";
import { EditFriendPage } from "./EditFriendPage";
import { DevtoolsPage } from "./DevtoolsPage";
import { SettingsPage } from "./SettingsPage";
import { SandboxPage } from "./SandboxPage";
import { StatisticsPage } from "./StatisticsPage";
import { EditHangoutPage } from "./EditHangoutPage";
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
    path: "/friends/:friendId/edit",
    element: <EditFriendPage />,
    loader: EditFriendPage.loader,
  },
  {
    path: "/hangouts/new",
    element: <EditHangoutPage />,
    loader: EditHangoutPage.loader,
  },
  {
    path: "/hangouts/:hangoutId/edit",
    element: <EditHangoutPage />,
    loader: EditHangoutPage.loader,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/statistics",
    element: <StatisticsPage />,
    loader: StatisticsPage.loader,
  },
  {
    path: "/devtools",
    element: <DevtoolsPage />,
  },
  {
    path: "/devtools/sandbox",
    element: <SandboxPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  </StrictMode>,
);
