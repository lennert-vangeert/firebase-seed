import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconBolt,
  IconDatabase,
  IconShieldLock,
} from "@tabler/icons-react";
import { useTranslate } from "@global/localization";

type IconComponent = ComponentType<{ size?: number | string }>;

const FEATURES: { key: string; icon: IconComponent }[] = [
  { key: "auth", icon: IconShieldLock },
  { key: "firestore", icon: IconDatabase },
  { key: "emulator", icon: IconBolt },
];

export default function Landing() {
  const { t, tL } = useTranslate("landing");

  return (
    <Box>
      {/* Hero */}
      <Box pos="relative" style={{ overflow: "hidden" }}>
        {/* Decorative emerald→cyan glow */}
        <Box
          aria-hidden
          pos="absolute"
          inset={0}
          style={{
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(60% 55% at 50% -5%, rgba(16,185,129,0.20), rgba(6,182,212,0.10) 45%, transparent 72%)",
          }}
        />
        <Container size="md" py={{ base: 64, sm: 110 }} pos="relative">
          <Stack align="center" ta="center" gap="lg">
            <Badge size="lg" variant="light" radius="xl">
              {t("hero.badge")}
            </Badge>

            <Title order={1} fz={{ base: 34, sm: 56 }} lh={1.08} maw={760}>
              {t("hero.title")}{" "}
              <Text span inherit variant="gradient">
                {t("hero.highlight")}
              </Text>
            </Title>

            <Text size="lg" c="dimmed" maw={620}>
              {t("hero.subtitle")}
            </Text>

            <Group justify="center" mt="sm">
              <Button
                component={Link}
                to={tL("/login")}
                size="lg"
                radius="xl"
                variant="gradient"
                rightSection={<IconArrowRight size={18} />}
              >
                {t("hero.ctaPrimary")}
              </Button>
              <Button
                component={Link}
                to={tL("/app")}
                size="lg"
                radius="xl"
                variant="default"
              >
                {t("hero.ctaSecondary")}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Features */}
      <Container size="lg" pb={{ base: 64, sm: 110 }}>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          {FEATURES.map(({ key, icon: Icon }) => (
            <Card key={key} padding="xl" radius="lg">
              <ThemeIcon variant="gradient" size={52} radius="md">
                <Icon size={26} />
              </ThemeIcon>
              <Text fw={700} ff="heading" fz="lg" mt="md">
                {t(`features.${key}.title`)}
              </Text>
              <Text c="dimmed" mt="xs">
                {t(`features.${key}.description`)}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
