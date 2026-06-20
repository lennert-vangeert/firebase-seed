import type { FunctionComponent, SVGProps } from "react";
import { Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useTranslate, type Locale } from "@global/localization";
import BelgiumFlag from "./_assets/belgium.svg?react";
import UKFlag from "./_assets/uk.svg?react";

type Flag = FunctionComponent<SVGProps<SVGSVGElement>>;

const FLAGS: Record<Locale, Flag> = {
  "en-US": UKFlag,
  "nl-BE": BelgiumFlag,
};

const flagBox = { width: 22, height: 16, style: { borderRadius: 3 } };

const LanguageSelect = () => {
  const { locale, locales, changeLocale } = useTranslate();
  const CurrentFlag = FLAGS[locale];

  return (
    <Menu position="bottom-end" width={180} shadow="md" withArrow>
      <Menu.Target>
        <UnstyledButton aria-label="Language">
          <Group gap={6} wrap="nowrap">
            <CurrentFlag {...flagBox} />
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        {locales.map((l) => {
          const FlagIcon = FLAGS[l.id];
          return (
            <Menu.Item
              key={l.id}
              onClick={() => changeLocale(l.id)}
              leftSection={<FlagIcon {...flagBox} />}
              fw={l.id === locale ? 600 : 400}
            >
              <Text size="sm">{l.label}</Text>
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSelect;
