import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from 'firebase-admin';

// on restaurant document creation, add cityAndState to cityAndStateList
// handle count of restaurants per cityAndState on document creation, deletion and update
export const handleRestaurantLocationTags = onDocumentWritten("restaurants/{cityAndState}", async (event) => {
  const change = event.data;

  const beforeTag = change?.before.data()?.cityAndState;
  const afterTag = change?.after.data()?.cityAndState;

  // check cityAndStateList for cityAndState
  const locationTagsCollectionRef = admin.firestore().collection('restaurant-location-tags');
  
  if (!afterTag && !beforeTag) return; // Handle cases where cityAndState might be missing

  // Logic for afterTag (addition or update to new value)
  if (afterTag) {
    const afterTagSnapshot = await locationTagsCollectionRef.where('value', '==', afterTag).get();
    if (afterTagSnapshot.empty) {
        // Tag doesn't exist, create it
        await locationTagsCollectionRef.doc(afterTag).set({ value: afterTag, count: 1 });
    } else {
        // Tag exists
        if (beforeTag !== afterTag) {
            // Only increment if it's a new tag for this doc (change or creation)
             const afterTagData = afterTagSnapshot.docs[0].data() as { count: number };
             await locationTagsCollectionRef.doc(afterTag).update({ count: afterTagData.count + 1 });
        }
    }
  }

  // Logic for beforeTag (deletion or update from old value)
  if (beforeTag && beforeTag !== afterTag) {
      const beforeTagSnapshot = await locationTagsCollectionRef.where('value', '==', beforeTag).get();
      if (!beforeTagSnapshot.empty) {
          const beforeTagData = beforeTagSnapshot.docs[0].data() as { count: number };
          // Optional: delete tag if count goes to 0? For now just decrement.
          await locationTagsCollectionRef.doc(beforeTag).update({ count: Math.max(0, beforeTagData.count - 1) });
      }
  }
});