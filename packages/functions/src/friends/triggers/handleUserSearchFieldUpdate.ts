import { onDocumentWritten } from "firebase-functions/v2/firestore";

/**
 * Trigger to maintain a normalized search field in user documents.
 * This field is used for prefix/exact search in Firestore.
 */
export const handleUserSearchFieldUpdate = onDocumentWritten(
  "users/{userId}",
  async (event) => {
    const afterData = event.data?.after.data();
    const beforeData = event.data?.before.data();

    if (!afterData) return; // Document deleted

    const alias = afterData.alias || "";
    const searchAlias = alias.toLowerCase().trim();

    const email = afterData.email || "";
    const searchEmail = email.toLowerCase().trim();

    // Avoid infinite loop if the fields are already correct
    if (
      beforeData?.searchAlias === searchAlias &&
      afterData.searchAlias === searchAlias &&
      beforeData?.searchEmail === searchEmail &&
      afterData.searchEmail === searchEmail
    ) {
      return;
    }

    // Update the document with the normalized search fields
    try {
      await event.data?.after.ref.update({
        searchAlias: searchAlias,
        searchEmail: searchEmail,
      });
      console.log(`Updated searchAlias/searchEmail for user ${event.params.userId}`);
    } catch (error) {
      console.error(
        `Error updating searchAlias/searchEmail for user ${event.params.userId}:`,
        error,
      );
    }
  },
);
