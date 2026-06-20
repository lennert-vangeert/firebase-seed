import type {
  DocumentData,
  FirestoreDataConverter,
} from "firebase/firestore";

/**
 * Generic identity converter.
 *
 * Firestore converters are how you get typed collection/document references.
 * They're nearly always pure passthroughs, so this factory removes the
 * per-collection boilerplate — each data/<collection>.ts just calls
 * `converter<MyType>()`.
 */
export const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data) => data as DocumentData,
  fromFirestore: (snap) => snap.data() as T,
});
