import { RouteObject } from "react-router-dom";
import PublicLayout from "../sections/publicLayout";
import Landing from "./landing";

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [{ index: true, element: <Landing /> }],
  },
];
