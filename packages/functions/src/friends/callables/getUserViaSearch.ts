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

    const normalizedTerm = searchTerm.toLowerCase();
    const usersRef = admin.firestore().collection("users");

    // Prefix search implementation:
    // We search for strings that are greater than or equal to the searchTerm
    // and less than the searchTerm with the last character incremented.
    // \uf8ff is a high-watermark character in Unicode.
    const query = usersRef
      .where("searchAlias", ">=", normalizedTerm)
      .where("searchAlias", "<", normalizedTerm + "\uf8ff")
      .limit(20);

    const snapshot = await query.get();

    const result = snapshot.docs
      .filter((doc) => doc.id !== userId) // Exclude current user from search results
      .map((doc) => ({
        ...(doc.data() as IUser),
        id: doc.id,
      }));

    console.log(`Search result for "${searchTerm}":`, result.length, "results");
    return result;
  },
);
