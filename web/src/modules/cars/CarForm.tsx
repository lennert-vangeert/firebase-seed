import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  TagsInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GeoPoint, Timestamp } from "firebase/firestore";
import type { FuelType } from "@data/cars";
import type { CarInput, CarWithId } from "@services/cars";
import { useTranslate } from "@global/localization";

const FUEL_TYPES: FuelType[] = ["petrol", "diesel", "electric", "hybrid"];

// Flat, primitive form state — GeoPoint/Timestamp are assembled on submit.
type CarFormValues = {
  make: string;
  model: string;
  imageUrl: string;
  year: number;
  price: number;
  mileageKm: number;
  isElectric: boolean;
  fuelType: FuelType;
  features: string[];
  horsepower: number;
  topSpeedKph: number;
  transmission: string;
  lat: number;
  lng: number;
  soldAt: string; // YYYY-MM-DD or ""
};

const toFormValues = (car?: CarWithId): CarFormValues => ({
  make: car?.make ?? "",
  model: car?.model ?? "",
  imageUrl: car?.imageUrl ?? "",
  year: car?.year ?? new Date().getFullYear(),
  price: car?.price ?? 0,
  mileageKm: car?.mileageKm ?? 0,
  isElectric: car?.isElectric ?? false,
  fuelType: car?.fuelType ?? "petrol",
  features: car?.features ?? [],
  horsepower: car?.specs.horsepower ?? 0,
  topSpeedKph: car?.specs.topSpeedKph ?? 0,
  transmission: car?.specs.transmission ?? "automatic",
  lat: car?.location.latitude ?? 50.8503,
  lng: car?.location.longitude ?? 4.3517,
  soldAt: car?.soldAt ? car.soldAt.toDate().toISOString().slice(0, 10) : "",
});

export default function CarForm({
  car,
  submitting,
  onSubmit,
  onCancel,
}: {
  car?: CarWithId;
  submitting: boolean;
  onSubmit: (input: CarInput) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslate("cars");

  const form = useForm<CarFormValues>({
    initialValues: toFormValues(car),
    validate: {
      make: (v) => (v.trim() ? null : t("form.required")),
      model: (v) => (v.trim() ? null : t("form.required")),
    },
  });

  const fuelData = FUEL_TYPES.map((value) => ({
    value,
    label: t(`fuel.${value}`),
  }));

  const handleSubmit = form.onSubmit((v) => {
    const input: CarInput = {
      make: v.make.trim(),
      model: v.model.trim(),
      imageUrl: v.imageUrl.trim(),
      year: Number(v.year),
      price: Number(v.price),
      mileageKm: Number(v.mileageKm),
      isElectric: v.isElectric,
      fuelType: v.fuelType,
      features: v.features,
      specs: {
        horsepower: Number(v.horsepower),
        topSpeedKph: Number(v.topSpeedKph),
        transmission: v.transmission.trim(),
      },
      location: new GeoPoint(Number(v.lat), Number(v.lng)),
      soldAt: v.soldAt ? Timestamp.fromDate(new Date(v.soldAt)) : null,
    };
    onSubmit(input);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Group grow>
          <TextInput label={t("form.make")} {...form.getInputProps("make")} />
          <TextInput label={t("form.model")} {...form.getInputProps("model")} />
        </Group>

        <TextInput
          label={t("form.imageUrl")}
          placeholder="https://..."
          {...form.getInputProps("imageUrl")}
        />

        <Group grow>
          <NumberInput label={t("form.year")} {...form.getInputProps("year")} />
          <NumberInput label={t("form.price")} {...form.getInputProps("price")} />
          <NumberInput
            label={t("form.mileage")}
            {...form.getInputProps("mileageKm")}
          />
        </Group>

        <Group grow align="center">
          <Select
            label={t("form.fuelType")}
            data={fuelData}
            allowDeselect={false}
            {...form.getInputProps("fuelType")}
          />
          <Switch
            label={t("form.electric")}
            mt="xl"
            {...form.getInputProps("isElectric", { type: "checkbox" })}
          />
        </Group>

        <TagsInput
          label={t("form.features")}
          placeholder={t("form.featuresPlaceholder")}
          {...form.getInputProps("features")}
        />

        <Group grow>
          <NumberInput
            label={t("form.horsepower")}
            {...form.getInputProps("horsepower")}
          />
          <NumberInput
            label={t("form.topSpeed")}
            {...form.getInputProps("topSpeedKph")}
          />
          <TextInput
            label={t("form.transmission")}
            {...form.getInputProps("transmission")}
          />
        </Group>

        <Group grow>
          <NumberInput
            label={t("form.latitude")}
            decimalScale={4}
            {...form.getInputProps("lat")}
          />
          <NumberInput
            label={t("form.longitude")}
            decimalScale={4}
            {...form.getInputProps("lng")}
          />
        </Group>

        <TextInput
          type="date"
          label={t("form.soldAt")}
          {...form.getInputProps("soldAt")}
        />

        <Group justify="flex-end" mt="sm">
          <Button variant="default" type="button" onClick={onCancel}>
            {t("form.cancel")}
          </Button>
          <Button type="submit" loading={submitting} variant="gradient">
            {car ? t("form.save") : t("form.create")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
