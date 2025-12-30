import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetRestaurants } from "./hooks";
import {
  getDocs,
  orderBy,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import type { IEatQuery, IRestaurant } from "./Eat.types";
import type { ReactNode } from "react";

// Mock Firebase
vi.mock("../../firebase", () => ({
  db: {},
  firebaseFunctions: {},
}));

vi.mock("firebase/firestore", () => ({
  getDocs: vi.fn(),
  query: vi.fn(),
  collection: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  documentId: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock("@/utils/AuthenticationAtoms", () => ({
  useGetCurrentUser: vi.fn(() => ({ uid: "test-user-id" })),
}));

vi.mock("@/utils/MessageBarsAtom", () => ({
  useAddMessageBars: vi.fn(() => vi.fn()),
}));

// Helper to create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock restaurant data
const mockRestaurants: IRestaurant[] = [
  {
    id: "1",
    name: "Restaurant One",
    address: "123 Main St",
    price: 2,
    cityAndState: "San Francisco, CA",
    averageStars: "4.5",
    starRatingCount: 10,
  },
  {
    id: "2",
    name: "Restaurant Two",
    address: "456 Oak Ave",
    price: 3,
    cityAndState: "Los Angeles, CA",
    averageStars: "4.0",
    starRatingCount: 5,
  },
  {
    id: "3",
    name: "Restaurant Three",
    address: "789 Pine Rd",
    price: 1,
    cityAndState: "San Francisco, CA",
    averageStars: "3.5",
    starRatingCount: 8,
  },
];

describe("useGetRestaurants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch restaurants successfully without filters", async () => {
    // Mock Firestore response
    const mockDocs = mockRestaurants.map((restaurant) => ({
      id: restaurant.id,
      data: () => restaurant,
    }));

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(() => useGetRestaurants(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to complete
    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].restaurants).toHaveLength(3);
    expect(result.current.data?.pages[0].restaurants[0].name).toBe(
      "Restaurant One"
    );
  });

  it("should apply city and state filter", async () => {
    const eatQuery: IEatQuery = {
      cityAndState: ["San Francisco, CA"],
    };

    const filteredRestaurants = mockRestaurants.filter(
      (r) => r.cityAndState === "San Francisco, CA"
    );

    const mockDocs = filteredRestaurants.map((restaurant) => ({
      id: restaurant.id,
      data: () => restaurant,
    }));

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(() => useGetRestaurants(eatQuery), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.pages[0].restaurants).toHaveLength(2);
    expect(
      result.current.data?.pages[0].restaurants.every(
        (r) => r.cityAndState === "San Francisco, CA"
      )
    ).toBe(true);
  });

  it("should apply price range filters", async () => {
    const eatQuery: IEatQuery = {
      priceRangeLower: 2,
      priceRangeUpper: 3,
    };

    const filteredRestaurants = mockRestaurants.filter(
      (r) => r.price && r.price >= 2 && r.price <= 3
    );

    const mockDocs = filteredRestaurants.map((restaurant) => ({
      id: restaurant.id,
      data: () => restaurant,
    }));

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(() => useGetRestaurants(eatQuery), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.pages[0].restaurants).toHaveLength(2);
    expect(
      result.current.data?.pages[0].restaurants.every(
        (r) => r.price && r.price >= 2 && r.price <= 3
      )
    ).toBe(true);
  });

  it("should apply custom orderBy field and direction", async () => {
    const orderByField = { field: "name", direction: "asc" as const };

    const sortedRestaurants = [...mockRestaurants].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const mockDocs = sortedRestaurants.map((restaurant) => ({
      id: restaurant.id,
      data: () => restaurant,
    }));

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(
      () => useGetRestaurants(undefined, orderByField),
      {
        wrapper: createWrapper(),
      }
    );

    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.pages[0].restaurants[0].name).toBe(
      "Restaurant One"
    );
  });

  it("should handle errors gracefully", async () => {
    const errorMessage = "Failed to fetch restaurants";
    vi.mocked(getDocs).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useGetRestaurants(), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(
      () => {
        expect(result.current.error).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it("should filter by restaurant ID", async () => {
    const eatQuery: IEatQuery = {
      id: "1",
    };

    const filteredRestaurants = mockRestaurants.filter((r) => r.id === "1");

    const mockDocs = filteredRestaurants.map((restaurant) => ({
      id: restaurant.id,
      data: () => restaurant,
    }));

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(() => useGetRestaurants(eatQuery), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.pages[0].restaurants).toHaveLength(1);
    expect(result.current.data?.pages[0].restaurants[0].id).toBe("1");
  });

  it("should combine multiple filters", async () => {
    const eatQuery: IEatQuery = {
      cityAndState: ["San Francisco, CA"],
      priceRangeLower: 1,
      priceRangeUpper: 2,
    };

    const filteredRestaurants = mockRestaurants.filter(
      (r) =>
        r.cityAndState === "San Francisco, CA" &&
        r.price &&
        r.price >= 1 &&
        r.price <= 2
    );

    const mockDocs = filteredRestaurants.map((restaurant) => ({
      id: restaurant.id,
      data: () => restaurant,
    }));

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(() => useGetRestaurants(eatQuery), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.pages[0].restaurants).toHaveLength(2);
    expect(
      result.current.data?.pages[0].restaurants.every(
        (r) =>
          r.cityAndState === "San Francisco, CA" &&
          r.price &&
          r.price >= 1 &&
          r.price <= 2
      )
    ).toBe(true);
  });

  it("should return empty array when no restaurants match filters", async () => {
    const eatQuery: IEatQuery = {
      cityAndState: ["New York, NY"],
    };

    const mockQuerySnapshot = {
      docs: [],
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(() => useGetRestaurants(eatQuery), {
      wrapper: createWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.pages[0].restaurants).toHaveLength(0);
  });

  it("should use price as primary orderBy when price filter is applied", async () => {
    const eatQuery: IEatQuery = {
      priceRangeLower: 1,
    };

    const orderByField = { field: "name", direction: "asc" as const };

    const mockDocs = mockRestaurants.map((restaurant) => ({
      id: restaurant.id,
      data: () => restaurant,
    }));

    const mockQuerySnapshot = {
      docs: mockDocs,
    };

    vi.mocked(getDocs).mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot<DocumentData>
    );

    const { result } = renderHook(
      () => useGetRestaurants(eatQuery, orderByField),
      {
        wrapper: createWrapper(),
      }
    );

    await vi.waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    // Verify that orderBy was called with 'price' first
    expect(orderBy).toHaveBeenCalledWith("price", "asc");
    // And then with the requested field as secondary sort
    expect(orderBy).toHaveBeenCalledWith("name", "asc");
  });
});
