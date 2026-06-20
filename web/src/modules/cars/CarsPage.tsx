import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  Modal,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useAuth } from "@global/firebase/useAuth";
import { useTranslate } from "@global/localization";
import {
  createCar,
  deleteCar,
  updateCar,
  type CarInput,
  type CarWithId,
} from "@services/cars";
import { useCars } from "./useCars";
import CarForm from "./CarForm";

export default function CarsPage() {
  const { user } = useAuth();
  const { t } = useTranslate("cars");
  const { cars, loading } = useCars();
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<CarWithId | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const startCreate = () => {
    setEditing(undefined);
    open();
  };
  const startEdit = (car: CarWithId) => {
    setEditing(car);
    open();
  };

  const handleSubmit = async (input: CarInput) => {
    if (!user) return;
    setSubmitting(true);
    try {
      if (editing) {
        await updateCar(editing.id, input);
        notifications.show({ message: t("notifications.updated"), color: "green" });
      } else {
        await createCar(user.uid, input);
        notifications.show({ message: t("notifications.created"), color: "green" });
      }
      close();
    } catch {
      notifications.show({ color: "red", message: t("notifications.error") });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (car: CarWithId) => {
    try {
      await deleteCar(car.id);
      notifications.show({ message: t("notifications.deleted"), color: "green" });
    } catch {
      notifications.show({ color: "red", message: t("notifications.error") });
    }
  };

  return (
    <Container size="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>{t("title")}</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          variant="gradient"
          radius="md"
          onClick={startCreate}
        >
          {t("addCar")}
        </Button>
      </Group>

      {loading ? (
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      ) : cars.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {t("empty")}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {cars.map((car) => {
            const isOwner = car.ownerId === user?.uid;
            return (
              <Card key={car.id} shadow="sm" padding="md">
                {car.imageUrl && (
                  <Card.Section>
                    <Image
                      src={car.imageUrl}
                      h={160}
                      alt={`${car.make} ${car.model}`}
                      fallbackSrc="https://placehold.co/600x400?text=Car"
                    />
                  </Card.Section>
                )}

                <Group justify="space-between" mt="md">
                  <Text fw={700} ff="heading">
                    {car.make} {car.model}
                  </Text>
                  <Badge variant={car.isElectric ? "gradient" : "light"}>
                    {t(`fuel.${car.fuelType}`)}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  {t("meta", {
                    year: car.year,
                    km: car.mileageKm.toLocaleString(),
                  })}
                </Text>

                <Text fw={800} fz="xl" variant="gradient" mt="xs">
                  €{car.price.toLocaleString()}
                </Text>

                {car.features.length > 0 && (
                  <Group gap={4} mt="xs">
                    {car.features.map((f) => (
                      <Badge key={f} variant="light" color="gray" size="sm">
                        {f}
                      </Badge>
                    ))}
                  </Group>
                )}

                <Text size="xs" c="dimmed" mt="xs">
                  {t("specs", {
                    hp: car.specs.horsepower,
                    topSpeed: car.specs.topSpeedKph,
                    transmission: car.specs.transmission,
                  })}
                </Text>

                {car.soldAt && (
                  <Badge color="red" variant="light" mt="xs">
                    {t("soldOn", { date: car.soldAt.toDate().toLocaleDateString() })}
                  </Badge>
                )}

                {isOwner && (
                  <Group mt="md" gap="xs">
                    <ActionIcon
                      variant="light"
                      aria-label={t("actions.edit")}
                      onClick={() => startEdit(car)}
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      aria-label={t("actions.delete")}
                      onClick={() => handleDelete(car)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                )}
              </Card>
            );
          })}
        </SimpleGrid>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={editing ? t("modal.edit") : t("modal.add")}
        size="lg"
      >
        <CarForm
          key={editing?.id ?? "new"}
          car={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </Modal>
    </Container>
  );
}
