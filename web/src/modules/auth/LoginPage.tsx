import { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconBoltFilled, IconBrandGoogle } from "@tabler/icons-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@global/firebase/useAuth";
import { useTranslate } from "@global/localization";
import { IS_DEV } from "@global/env";
import { authErrorKey } from "./authErrors";

type Mode = "signin" | "register";

export default function LoginPage() {
  const {
    user,
    loading,
    signInWithEmail,
    registerWithEmail,
    signInWithGoogle,
  } = useAuth();
  const { t } = useTranslate("auth");
  const { t: tc, tL } = useTranslate("common");
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";

  // Dev convenience: against the emulator, prefill the seeded admin account.
  const devCreds = IS_DEV
    ? { email: "admin@seed.dev", password: "password" }
    : { email: "", password: "" };

  const form = useForm({
    initialValues: { displayName: "", ...devCreds },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : t("validation.email")),
      password: (v) => (v.length >= 6 ? null : t("validation.password")),
    },
  });

  if (!loading && user) {
    return <Navigate to={tL("/app")} replace />;
  }

  const run = async (action: () => Promise<unknown>) => {
    setSubmitting(true);
    try {
      await action();
      navigate(tL("/app"));
    } catch (err) {
      notifications.show({ color: "red", message: t(authErrorKey(err)) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = form.onSubmit((values) =>
    run(() =>
      isRegister
        ? registerWithEmail(values.email, values.password, values.displayName)
        : signInWithEmail(values.email, values.password)
    )
  );

  return (
    <Flex mih="100vh">
      {/* Brand panel (desktop only) */}
      <Box
        visibleFrom="md"
        flex={1}
        p={48}
        pos="relative"
        style={{
          overflow: "hidden",
          background: "linear-gradient(135deg, #10b981, #06b6d4)",
        }}
      >
        <Box
          aria-hidden
          pos="absolute"
          inset={0}
          style={{
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 78% 18%, rgba(255,255,255,0.28), transparent 46%)",
          }}
        />
        <Flex h="100%" direction="column" justify="space-between" pos="relative">
          <Link
            to={tL("/")}
            style={{ textDecoration: "none", width: "fit-content" }}
          >
            <Group gap="xs">
              <ThemeIcon variant="white" size={34} radius="md" color="brand">
                <IconBoltFilled size={20} />
              </ThemeIcon>
              <Text ff="heading" fw={700} fz="lg" c="white">
                {tc("brand")}
              </Text>
            </Group>
          </Link>

          <Stack gap="sm" maw={440}>
            <Title order={2} c="white" fz={40} lh={1.1}>
              {t("panel.title")}
            </Title>
            <Text c="white" opacity={0.9}>
              {t("panel.subtitle")}
            </Text>
          </Stack>

          <span />
        </Flex>
      </Box>

      {/* Auth form */}
      <Flex flex={1} align="center" justify="center" p="lg">
        <Box w="100%" maw={400}>
          <Stack gap="lg">
            <Group hiddenFrom="md" justify="center">
              <Link
                to={tL("/")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Group gap="xs">
                  <ThemeIcon variant="gradient" size={32} radius="md">
                    <IconBoltFilled size={18} />
                  </ThemeIcon>
                  <Text ff="heading" fw={700} fz="lg">
                    {tc("brand")}
                  </Text>
                </Group>
              </Link>
            </Group>

            <div>
              <Title order={2}>
                {isRegister ? t("register.title") : t("signIn.title")}
              </Title>
              <Text c="dimmed" size="sm">
                {isRegister ? t("register.subtitle") : t("signIn.subtitle")}
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack>
                {isRegister && (
                  <TextInput
                    label={t("fields.name")}
                    placeholder={t("placeholders.name")}
                    {...form.getInputProps("displayName")}
                  />
                )}
                <TextInput
                  label={t("fields.email")}
                  placeholder={t("placeholders.email")}
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label={t("fields.password")}
                  placeholder={t("placeholders.password")}
                  {...form.getInputProps("password")}
                />
                <Button
                  type="submit"
                  loading={submitting}
                  fullWidth
                  size="md"
                  radius="md"
                  variant="gradient"
                >
                  {isRegister ? t("register.submit") : t("signIn.submit")}
                </Button>
              </Stack>
            </form>

            <Divider label={t("or")} labelPosition="center" />

            <Button
              variant="default"
              fullWidth
              size="md"
              radius="md"
              loading={submitting}
              leftSection={<IconBrandGoogle size={18} />}
              onClick={() => run(signInWithGoogle)}
            >
              {t("google")}
            </Button>

            <Text size="sm" ta="center" c="dimmed">
              {isRegister ? t("toggle.toSignIn") : t("toggle.toRegister")}{" "}
              <Anchor
                component="button"
                type="button"
                onClick={() => setMode(isRegister ? "signin" : "register")}
              >
                {isRegister ? t("toggle.toSignInCta") : t("toggle.toRegisterCta")}
              </Anchor>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
}
