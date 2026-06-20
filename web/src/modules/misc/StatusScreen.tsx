import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useTranslate } from "@global/localization";

/** Centered, on-brand status screen used by the error + 404 pages. */
export function StatusScreen({
  code,
  title,
  subtitle,
  homeLabel,
}: {
  code: string;
  title: string;
  subtitle: string;
  homeLabel: string;
}) {
  const { tL } = useTranslate();

  return (
    <Container size="sm" py={120}>
      <Stack align="center" ta="center" gap="md">
        <Text ff="heading" fw={800} fz={{ base: 72, sm: 120 }} lh={1} variant="gradient">
          {code}
        </Text>
        <Title order={2}>{title}</Title>
        <Text c="dimmed" maw={440}>
          {subtitle}
        </Text>
        <Button
          component={Link}
          to={tL("/")}
          variant="gradient"
          radius="xl"
          mt="sm"
        >
          {homeLabel}
        </Button>
      </Stack>
    </Container>
  );
}
