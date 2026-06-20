import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";

import { theme } from "@global/style/mantineTheme";
import { router } from "./modules/routes";
import { store } from "@global/store/store";
import { AuthProvider } from "@global/firebase/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Provider store={store}>
        <Notifications />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Provider>
    </MantineProvider>
  </StrictMode>
);
