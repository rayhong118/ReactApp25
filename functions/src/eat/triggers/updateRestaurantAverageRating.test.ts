import {
  updateRestaurantAverageRating,
  type IStarRating,
} from "./updateRestaurantAverageRating";
import * as admin from "firebase-admin";

jest.mock("firebase-admin", () => {
  const actual = jest.requireActual("firebase-admin");
  const mockUpdate = jest.fn().mockResolvedValue(undefined);
  const mockFirestore = Object.assign(jest.fn(), {
    FieldValue: {
      increment: jest.fn((val) => ({ val, type: "increment" })),
    },
    doc: jest.fn().mockReturnValue({
      update: mockUpdate,
    }),
  });
  return {
    ...actual,
    firestore: mockFirestore,
    initializeApp: jest.fn(),
  };
});
jest.mock("firebase-admin/firestore", () => {
  const actual = jest.requireActual("firebase-admin/firestore");
  const mockUpdate = jest.fn().mockResolvedValue(undefined);
  return {
    ...actual,
    FieldValue: {
      ...actual.FieldValue,
      increment: jest.fn((val) => ({ val, type: "increment" })),
    },
    doc: jest.fn().mockReturnValue({
      update: mockUpdate,
    }),
  };
});

jest.mock("firebase-functions/v2/firestore", () => ({
  onDocumentWritten: jest.fn((opts, handler) => handler),
}));

jest.mock("firebase-functions/https", () => ({
  onCall: jest.fn((opts, handler) => handler),
  HttpsError: jest.fn(),
}));

describe("updateRestaurantAverageRating", () => {
  let mockUpdate: jest.Mock;
  let mockSet: jest.Mock;
  let mockDocRef: {
    update: jest.Mock;
    set: jest.Mock;
    ref: { update: jest.Mock };
  };
  let mockQuery: { get: jest.Mock };
  let mockCollectionRef: { where: jest.Mock; doc: jest.Mock };

  beforeEach(() => {
    mockUpdate = jest.fn().mockResolvedValue(undefined);
    mockSet = jest.fn().mockResolvedValue(undefined);
    mockDocRef = {
      update: mockUpdate,
      set: mockSet,
      ref: {
        update: mockUpdate,
      },
    };

    mockQuery = {
      get: jest.fn().mockResolvedValue({
        empty: false,
        docs: [{ ref: { update: mockUpdate } }],
      }),
    };

    mockCollectionRef = {
      where: jest.fn().mockReturnValue(mockQuery),
      doc: jest.fn().mockReturnValue(mockDocRef),
    };

    const mockFirestore = {
      collection: jest.fn().mockReturnValue(mockCollectionRef),
      doc: jest.fn().mockReturnValue(mockDocRef),
    };

    (admin.firestore as any).mockReturnValue(mockFirestore);
  });
  it("should update average rating", async () => {
    const afterStars: Partial<IStarRating> = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
    };
    const afterAverageRating: string = (
      (1 * 1 + 2 * 2 + 3 * 3 + 4 * 4 + 5 * 5) /
      15
    ).toFixed(1);
    const change = {
      before: {
        data: () => ({
          stars: {
            1: 2,
            2: 1,
            3: 3,
            4: 4,
            5: 5,
          } as Partial<IStarRating>,
        }),
      },
      after: {
        data: () => ({
          stars: afterStars,
        }),
      },
    };
    const event = {
      data: change,
      specversion: "1.0" as const,
      id: "1",
      source: "test",
      type: "test",
      time: "test",
      datacontenttype: "application/json",
      params: {
        restaurantId: "1",
      },
    };

    await updateRestaurantAverageRating(event);

    expect(mockSet).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(
      {
        averageStars: afterAverageRating,
        starRatingCount: 15,
      },
      { merge: true }
    );
  });
});
