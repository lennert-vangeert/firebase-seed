import { GeoPoint, Timestamp } from "firebase-admin/firestore";
import { db } from "./firestore";
import { seedAdmin, seedUsers, SEED_PASSWORD, type SeedUser } from "./auth";
import { CAR_FIXTURES } from "./fixtures/cars";

const DAY_MS = 24 * 60 * 60 * 1000;

const clearCollection = async (name: string): Promise<void> => {
  const snap = await db.collection(name).get();
  await Promise.all(snap.docs.map((d) => d.ref.delete()));
};

const seedCars = async (owners: SeedUser[]): Promise<number> => {
  await clearCollection("cars");
  const now = Date.now();

  for (let i = 0; i < CAR_FIXTURES.length; i++) {
    const { lat, lng, soldDaysAgo, ...data } = CAR_FIXTURES[i];
    const owner = owners[i % owners.length];

    await db.collection("cars").add({
      ...data,
      ownerId: owner.uid,
      location: new GeoPoint(lat, lng),
      soldAt:
        soldDaysAgo == null
          ? null
          : Timestamp.fromMillis(now - soldDaysAgo * DAY_MS),
      // Stagger createdAt so the "newest first" ordering is visible.
      createdAt: Timestamp.fromMillis(now - i * DAY_MS),
      updatedAt: Timestamp.fromMillis(now - i * DAY_MS),
    });
  }

  return CAR_FIXTURES.length;
};

const main = async (): Promise<void> => {
  const bootstrapOnly = process.argv.includes("--bootstrap");

  if (bootstrapOnly) {
    const admin = await seedAdmin();
    console.log(`✓ Bootstrapped admin user: ${admin.email}`);
    return;
  }

  const users = await seedUsers();
  const carCount = await seedCars(users);

  console.log(`✓ Seeded ${users.length} users and ${carCount} cars.`);
  console.log(`  Logins: ${users.map((u) => u.email).join(", ")}`);
  console.log(`  Password: ${SEED_PASSWORD}`);
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
