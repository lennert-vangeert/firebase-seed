import { AppShell, Container, Group } from "@mantine/core";
import { Link, Outlet } from "react-router-dom";
import { Brand } from "@common/brand";
import { ThemeToggle } from "@common/themeToggle";
import { UserMenu } from "@common/userMenu";
import ScrollToTop from "@common/scrollToTop";
import { useTranslate } from "@global/localization";

/** Protected app shell: top bar (wordmark · theme toggle · user menu) + content. */
export default function AppLayout() {
  const { tL } = useTranslate();

  return (
    <AppShell header={{ height: 64 }} padding="md">
      <ScrollToTop />
      <AppShell.Header withBorder>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Link
              to={tL("/app")}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Brand size="sm" />
            </Link>
            <Group gap="sm">
              <ThemeToggle />
              <UserMenu />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
