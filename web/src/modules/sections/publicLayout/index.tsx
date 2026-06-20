import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import ScrollToTop from "@common/scrollToTop";
import Header from "../header";
import Footer from "../footer";

/** Public/marketing shell: sticky header, full-bleed content, footer at the end. */
export default function PublicLayout() {
  return (
    <AppShell header={{ height: 64 }} padding={0}>
      <ScrollToTop />
      <Header />
      <AppShell.Main>
        <Outlet />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
