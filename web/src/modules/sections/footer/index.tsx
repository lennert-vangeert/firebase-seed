import { Container, Divider, Group, Stack, Text } from "@mantine/core";
import { Brand } from "@common/brand";
import LanguageSelect from "@common/languageSelect";
import { useTranslate } from "@global/localization";

/** Slim public footer: wordmark, copyright, built-with note, language switch. */
const Footer = () => {
  const { t } = useTranslate();
  const year = new Date().getFullYear();

  return (
    <>
      <Divider />
      <Container size="lg" py="xl">
        <Group justify="space-between" align="center" wrap="wrap" gap="lg">
          <Stack gap={6}>
            <Brand size="sm" />
            <Text size="xs" c="dimmed">
              © {year} {t("brand")}. {t("footer.rights")}
            </Text>
          </Stack>
          <Group gap="lg">
            <Text size="xs" c="dimmed" visibleFrom="xs">
              {t("footer.builtWith")}
            </Text>
            <LanguageSelect />
          </Group>
        </Group>
      </Container>
    </>
  );
};

export default Footer;
