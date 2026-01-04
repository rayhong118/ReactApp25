import { handleRestaurantLocationTags } from "./eatFunctions";
import * as admin from "firebase-admin";

jest.mock("firebase-admin", () => {
  const actual = jest.requireActual("firebase-admin");
  const mockFirestore = Object.assign(jest.fn(), {
    FieldValue: {
      increment: jest.fn((val) => ({ val, type: "increment" })),
    },
  });
  return {
    ...actual,
    firestore: mockFirestore,
    initializeApp: jest.fn(),
  };
});
jest.mock("firebase-admin/firestore", () => {
  const actual = jest.requireActual("firebase-admin/firestore");
  return {
    ...actual,
    FieldValue: {
      ...actual.FieldValue,
      increment: jest.fn((val) => ({ val, type: "increment" })),
    },
  };
});

jest.mock("firebase-functions/v2/firestore", () => ({
  onDocumentWritten: jest.fn((opts, handler) => handler),
}));

jest.mock("firebase-functions/https", () => ({
  onCall: jest.fn((opts, handler) => handler),
  HttpsError: jest.fn(),
}));

jest.mock("@google/genai", () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn(),
        }),
      },
    })),
  };
});

describe("handleRestaurantLocationTags", () => {
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
    jest.clearAllMocks();

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
    };

    (admin.firestore as any).mockReturnValue(mockFirestore);
  });

  it("should handle restaurant location tags", async () => {
    const change = {
      before: {
        data: () => ({
          cityAndState: "New York, NY",
        }),
      },
      after: {
        data: () => ({
          cityAndState: "San Francisco, CA",
        }),
      },
    };

    const event = {
      data: change,
      specversion: "1.0" as const,
      id: "test-id",
      source:
        "projects/test-project/databases/(default)/documents/restaurants/test-id",
      type: "google.cloud.firestore.document.v1.written",
      time: new Date().toISOString(),
      datacontenttype: "application/json",
    };

    await handleRestaurantLocationTags(event);

    // Verify that location tags collection was accessed
    expect(admin.firestore).toHaveBeenCalled();
    expect(mockCollectionRef.where).toHaveBeenCalledWith(
      "value",
      "==",
      "San Francisco, CA"
    );

    // Verify that the old tag count was decremented and new incremented
    expect(mockQuery.get).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledWith({
      count: { val: 1, type: "increment" },
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      count: { val: -1, type: "increment" },
    });
  });

  it("should increment count when new location tag is created", async () => {
    const emptyQuery = {
      get: jest.fn().mockResolvedValue({ empty: true }),
    };

    mockCollectionRef.where = jest.fn().mockReturnValue(emptyQuery);

    const change = {
      before: {
        data: () => ({}),
      },
      after: {
        data: () => ({
          cityAndState: "Los Angeles, CA",
        }),
      },
    };

    const event = {
      data: change,
      specversion: "1.0" as const,
      id: "test-id",
      source:
        "projects/test-project/databases/(default)/documents/restaurants/test-id",
      type: "google.cloud.firestore.document.v1.written",
      time: new Date().toISOString(),
      datacontenttype: "application/json",
    };

    await handleRestaurantLocationTags(event);

    // Verify that a new tag document was created with count: 1
    expect(mockDocRef.set).toHaveBeenCalledWith({
      value: "Los Angeles, CA",
      count: 1,
    });
  });

  it("should decrement count when location tag is removed", async () => {
    mockQuery.get = jest.fn().mockResolvedValue({
      empty: false,
      docs: [{ ref: { update: mockUpdate } }],
    });

    const change = {
      before: {
        data: () => ({
          cityAndState: "Chicago, IL",
        }),
      },
      after: {
        data: () => ({}),
      },
    };

    const event = {
      data: change,
      specversion: "1.0" as const,
      id: "test-id",
      source:
        "projects/test-project/databases/(default)/documents/restaurants/test-id",
      type: "google.cloud.firestore.document.v1.written",
      time: new Date().toISOString(),
      datacontenttype: "application/json",
    };

    console.log("DEBUG: event 3", JSON.stringify(event, null, 2));
    await handleRestaurantLocationTags(event);
    console.log("DEBUG: Finished function call 3");

    // Verify that the tag count was decremented
    expect(mockQuery.get).toHaveBeenCalledWith();
    expect(mockUpdate).toHaveBeenCalledWith({
      count: expect.any(Object),
    });
  });
});
