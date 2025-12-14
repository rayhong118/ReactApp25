
// import { handleLocationTags } from "./eatFunctions";
// import * as admin from 'firebase-admin';
// import * as jest from 'jest';
// import { describe, it } from "node:test";

// describe('handleLocationTags', () => {
//   it('should add a new location tag if it does not exist', async () => {
//     const mockDoc = {
//       data: jest.fn().mockReturnValue({
//         cityAndState: 'New York, NY'
//       })
//     };
//     const mockCollection = {
//       doc: jest.fn().mockReturnValue(mockDoc)
//     };
//     const mockFirestore = {
//       collection: jest.fn().mockReturnValue(mockCollection)
//     };
//     admin.firestore = jest.fn().mockReturnValue(mockFirestore);
//     await handleLocationTags();
//     expect(mockCollection.doc).toHaveBeenCalledWith('New York, NY');
//     expect(mockDoc.set).toHaveBeenCalledWith({ value: 'New York, NY' });
//   });
// });