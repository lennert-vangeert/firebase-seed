import { Group, Text, ThemeIcon } from "@mantine/core";
import { IconBoltFilled } from "@tabler/icons-react";
import { useTranslate } from "@global/localization";

type BrandSize = "sm" | "md" | "lg";

const SIZES: Record<BrandSize, { icon: number; glyph: number; fz: string }> = {
  sm: { icon: 28, glyph: 16, fz: "md" },
  md: { icon: 34, glyph: 20, fz: "lg" },
  lg: { icon: 44, glyph: 26, fz: "xl" },
};

/** App wordmark: gradient bolt mark + Sora wordmark. Pure visual (wrap in a Link as needed). */
export function Brand({
  size = "md",
  withText = true,
}: {
  size?: BrandSize;
  withText?: boolean;
}) {
  const { t } = useTranslate();
  const s = SIZES[size];

  return (
    <Group gap="xs" wrap="nowrap">
      <ThemeIcon variant="gradient" size={s.icon} radius="md">
        <IconBoltFilled size={s.glyph} />
      </ThemeIcon>
      {withText && (
        <Text ff="heading" fw={700} fz={s.fz} lh={1}>
          {t("brand")}
        </Text>
      )}
    </Group>
  );
}
