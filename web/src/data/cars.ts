import {
  collection,
  GeoPoint,
  Timestamp,
  type CollectionReference,
} from "firebase/firestore";
import { db } from "@global/firebase/config";
import { converter } from "./_shared";

export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";

/**
 * Portable scalar fields of a car.
 *
 * This part of the model carries no SDK-specific types (no Timestamp/GeoPoint),
 * so the Admin-SDK seed can `import type { CarData }` and reuse the exact shape
 * without pulling in the browser Firestore SDK. The seed produces its own
 * GeoPoint/Timestamp values at write time.
 *
 * Cars deliberately exercise every common Firestore field type — treat this as
 * a living cheat sheet:
 *   string, number, boolean, enum (string union), array, nested map,
 *   geopoint, timestamp, nullable, and a uid reference.
 */
export type CarData = {
  make: string; // string
  model: string; // string
  imageUrl: string; // string (plain URL — no Storage in this seed)
  year: number; // number
  price: number; // number
  mileageKm: number; // number
  isElectric: boolean; // boolean
  fuelType: FuelType; // enum (string union)
  features: string[]; // array
  specs: {
    // nested map
    horsepower: number;
    topSpeedKph: number;
    transmission: string;
  };
  ownerId: string; // uid reference -> users/{uid}
};

/** The full Firestore document: portable data + SDK-stamped fields. */
export type Car = CarData & {
  location: GeoPoint; // geopoint
  soldAt: Timestamp | null; // nullable timestamp
  createdAt: Timestamp; // timestamp
  updatedAt: Timestamp; // timestamp
};

const carConverter = converter<Car>();

export const carsCol = (): CollectionReference<Car> =>
  collection(db, "cars").withConverter(carConverter);
