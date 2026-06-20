import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTranslate } from "@global/localization";

/** Light/dark toggle. Persisted by Mantine's color scheme manager (localStorage). */
export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const { t } = useTranslate();
  const isDark = computed === "dark";

  return (
    <ActionIcon
      variant="default"
      size="lg"
      radius="md"
      aria-label={t("theme.toggle")}
      onClick={() => setColorScheme(isDark ? "light" : "dark")}
    >
      {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
