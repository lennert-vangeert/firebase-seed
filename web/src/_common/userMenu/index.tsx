import { Avatar, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { useAuth } from "@global/firebase/useAuth";
import { useTranslate } from "@global/localization";

const initialsOf = (name: string) =>
  name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

/** Avatar + dropdown with the user's email and a sign-out action. */
export function UserMenu() {
  const { user, signOut } = useAuth();
  const { t } = useTranslate();
  if (!user) return null;

  const label = user.displayName || user.email || "User";

  return (
    <Menu position="bottom-end" width={220} shadow="md" withArrow>
      <Menu.Target>
        <UnstyledButton aria-label={label}>
          <Group gap="xs" wrap="nowrap">
            <Avatar
              src={user.photoURL ?? undefined}
              variant="gradient"
              radius="xl"
              size={34}
            >
              {initialsOf(label)}
            </Avatar>
            <Text size="sm" fw={500} visibleFrom="sm" maw={140} truncate>
              {label}
            </Text>
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user.email}</Menu.Label>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={() => signOut()}
        >
          {t("nav.signOut")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
