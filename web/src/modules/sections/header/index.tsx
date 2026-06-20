import { AppShell, Button, Container, Group } from "@mantine/core";
import { Link } from "react-router-dom";
import { Brand } from "@common/brand";
import { ThemeToggle } from "@common/themeToggle";
import LanguageSelect from "@common/languageSelect";
import { useAuth } from "@global/firebase/useAuth";
import { useTranslate } from "@global/localization";

/** Public marketing header: wordmark · language · theme toggle · sign-in CTA. */
const Header = () => {
  const { t, tL } = useTranslate();
  const { user } = useAuth();

  return (
    <AppShell.Header withBorder>
      <Container size="lg" h="100%">
        <Group h="100%" justify="space-between">
          <Link to={tL("/")} style={{ textDecoration: "none", color: "inherit" }}>
            <Brand size="sm" />
          </Link>

          <Group gap="sm">
            <LanguageSelect />
            <ThemeToggle />
            <Button
              component={Link}
              to={tL(user ? "/app" : "/login")}
              variant="gradient"
              radius="md"
            >
              {user ? t("nav.openApp") : t("nav.signIn")}
            </Button>
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
};

export default Header;
