import type { CarData } from "../../src/data/cars";

/**
 * Portable car fixtures.
 *
 * - `import type { CarData }` shares the model's portable fields with no runtime
 *   dependency on the browser Firestore SDK (the type import is erased).
 * - `ownerId` is omitted: the seed assigns owners round-robin across the test
 *   users, so cars end up spread across accounts.
 * - `lat`/`lng`/`soldDaysAgo` carry the data the seed turns into a GeoPoint and
 *   Timestamps via the Admin SDK at write time.
 */
export type CarFixture = Omit<CarData, "ownerId"> & {
  lat: number;
  lng: number;
  /** Days ago the car was sold, or null if still available. */
  soldDaysAgo: number | null;
};

export const CAR_FIXTURES: CarFixture[] = [
  {
    make: "Tesla",
    model: "Model 3",
    imageUrl: "https://placehold.co/600x400?text=Tesla+Model+3",
    year: 2023,
    price: 42000,
    mileageKm: 12000,
    isElectric: true,
    fuelType: "electric",
    features: ["Autopilot", "Glass roof", "Heated seats"],
    specs: { horsepower: 283, topSpeedKph: 225, transmission: "automatic" },
    lat: 50.8503,
    lng: 4.3517,
    soldDaysAgo: null,
  },
  {
    make: "Toyota",
    model: "Corolla",
    imageUrl: "https://placehold.co/600x400?text=Toyota+Corolla",
    year: 2020,
    price: 18500,
    mileageKm: 54000,
    isElectric: false,
    fuelType: "petrol",
    features: ["Adaptive cruise", "Apple CarPlay"],
    specs: { horsepower: 139, topSpeedKph: 180, transmission: "manual" },
    lat: 51.2194,
    lng: 4.4025,
    soldDaysAgo: null,
  },
  {
    make: "Volkswagen",
    model: "Golf",
    imageUrl: "https://placehold.co/600x400?text=VW+Golf",
    year: 2019,
    price: 16900,
    mileageKm: 78000,
    isElectric: false,
    fuelType: "diesel",
    features: ["Parking sensors", "Lane assist"],
    specs: { horsepower: 115, topSpeedKph: 200, transmission: "manual" },
    lat: 51.0543,
    lng: 3.7174,
    soldDaysAgo: 14,
  },
  {
    make: "BMW",
    model: "i4",
    imageUrl: "https://placehold.co/600x400?text=BMW+i4",
    year: 2022,
    price: 56000,
    mileageKm: 21000,
    isElectric: true,
    fuelType: "electric",
    features: ["Harman Kardon", "Heads-up display", "Heated steering wheel"],
    specs: { horsepower: 340, topSpeedKph: 190, transmission: "automatic" },
    lat: 50.6326,
    lng: 5.5797,
    soldDaysAgo: 3,
  },
  {
    make: "Porsche",
    model: "911 Carrera",
    imageUrl: "https://placehold.co/600x400?text=Porsche+911",
    year: 2021,
    price: 128000,
    mileageKm: 9000,
    isElectric: false,
    fuelType: "petrol",
    features: ["Sport Chrono", "PASM", "Bose surround"],
    specs: { horsepower: 385, topSpeedKph: 293, transmission: "automatic" },
    lat: 50.4674,
    lng: 4.8718,
    soldDaysAgo: null,
  },
  {
    make: "Toyota",
    model: "Prius",
    imageUrl: "https://placehold.co/600x400?text=Toyota+Prius",
    year: 2018,
    price: 14200,
    mileageKm: 96000,
    isElectric: false,
    fuelType: "hybrid",
    features: ["Eco mode", "Backup camera"],
    specs: { horsepower: 121, topSpeedKph: 180, transmission: "automatic" },
    lat: 51.1788,
    lng: 4.4286,
    soldDaysAgo: null,
  },
];
