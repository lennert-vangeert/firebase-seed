import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { carsCol, type Car } from "@data/cars";

/** A car document plus its Firestore id (what the UI consumes). */
export type CarWithId = Car & { id: string };

/** Fields a user supplies on create/edit — server/auth manage the rest. */
export type CarInput = Omit<Car, "ownerId" | "createdAt" | "updatedAt">;

/** Live-subscribe to all cars, newest first. Returns the unsubscribe fn. */
export const subscribeCars = (
  cb: (cars: CarWithId[]) => void
): Unsubscribe => {
  const q = query(carsCol(), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const createCar = async (
  ownerId: string,
  input: CarInput
): Promise<string> => {
  const ref = await addDoc(carsCol(), {
    ...input,
    ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateCar = async (
  id: string,
  input: Partial<CarInput>
): Promise<void> => {
  await updateDoc(doc(carsCol(), id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCar = async (id: string): Promise<void> => {
  await deleteDoc(doc(carsCol(), id));
};
