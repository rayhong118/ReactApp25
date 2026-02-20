import { onDocumentWritten } from "firebase-functions/v2/firestore";

/**
 * Trigger to maintain a normalized search field in user documents.
 * This field is used for prefix search in Firestore.
 */
export const handleUserSearchFieldUpdate = onDocumentWritten(
  "users/{userId}",
  async (event) => {
    const afterData = event.data?.after.data();
    const beforeData = event.data?.before.data();

    if (!afterData) return; // Document deleted

    const alias = afterData.alias || "";
    const searchAlias = alias.toLowerCase();

    // Avoid infinite loop if the field is already correct
    if (
      beforeData?.searchAlias === searchAlias &&
      afterData.searchAlias === searchAlias
    ) {
      return;
    }

    // Update the document with the normalized search field
    try {
      await event.data?.after.ref.update({
        searchAlias: searchAlias,
      });
      console.log(`Updated searchAlias for user ${event.params.userId}`);
    } catch (error) {
      console.error(
        `Error updating searchAlias for user ${event.params.userId}:`,
        error,
      );
    }
  },
);
