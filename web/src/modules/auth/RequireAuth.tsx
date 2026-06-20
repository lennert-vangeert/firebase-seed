import { Center, Loader } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@global/firebase/useAuth";
import { useTranslate } from "@global/localization";

/** Route guard: waits for auth to resolve, then redirects to /login if signed out. */
export default function RequireAuth() {
  const { user, loading } = useAuth();
  const { tL } = useTranslate();

  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to={tL("/login")} replace />;
  }

  return <Outlet />;
}
