
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const handleLocationTags = () => {
  functions.firestore.onDocumentCreated('restaurants/{cityAndState}', async(event) => {
    const { cityAndState } = event.params;
    // check cityAndStateList for cityAndState
    const locationTagsCollectionRef = admin.firestore().collection('cityAndStateList');
    const locationTagsSnapshot = await locationTagsCollectionRef.get();
    const locationTags = locationTagsSnapshot.docs.map(doc => doc.data());
    
    // if cityAndState is not in cityAndStateList, add it
    if (!locationTags.some(tag => tag.value === cityAndState)) {
      await locationTagsCollectionRef.doc().set({ value: cityAndState });
    }
  });
};