import { useEffect, useState } from "react";
import { subscribeCars, type CarWithId } from "@services/cars";

/** Live list of all cars (newest first), kept in sync via a Firestore listener. */
export const useCars = () => {
  const [cars, setCars] = useState<CarWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeCars((next) => {
      setCars(next);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { cars, loading };
};
