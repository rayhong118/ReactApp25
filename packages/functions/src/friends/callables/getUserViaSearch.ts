import type { IUser } from "@shared/types";
import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/https";
import { onCall } from "firebase-functions/https";

export const getUserViaSearch = onCall(
  {
    cors: true,
  },
  async (req) => {
    const userId = req.auth?.uid;
    if (!userId) {
      throw new HttpsError("unauthenticated", "User must be logged in");
    }

    const searchTerm = req.data?.searchTerm;
    if (!searchTerm || typeof searchTerm !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "Search term must be a non-empty string",
      );
    }

    const normalizedTerm = searchTerm.toLowerCase().trim();
    const usersRef = admin.firestore().collection("users");

    // Exact email or exact alias match
    const queryEmail = usersRef.where("searchEmail", "==", normalizedTerm).limit(20);
    const queryAlias = usersRef.where("searchAlias", "==", normalizedTerm).limit(20);

    const [snapshotEmail, snapshotAlias] = await Promise.all([
      queryEmail.get(),
      queryAlias.get(),
    ]);

    const mergedDocs = new Map<string, IUser>();

    snapshotEmail.docs.forEach((doc) => {
      if (doc.id !== userId) {
        mergedDocs.set(doc.id, {
          ...(doc.data() as IUser),
          id: doc.id,
        });
      }
    });

    snapshotAlias.docs.forEach((doc) => {
      if (doc.id !== userId) {
        mergedDocs.set(doc.id, {
          ...(doc.data() as IUser),
          id: doc.id,
        });
      }
    });

    const result = Array.from(mergedDocs.values());

    console.log(`Search result for "${searchTerm}":`, result.length, "results");
    return result;
  },
);
