import type { IMenu, IRestaurant } from "./Eat.types";

export const MOCK_RESTAURANT: IRestaurant = {
  id: "mock-restaurant-id",
  name: "Mock Restaurant",
  displayName: "Mock Restaurant",
  description: "This is a mock restaurant for testing.",
  address: "123 Test St",
  price: 2,
  averageStars: "5",
  stars: { 5: 1 },
  cityAndState: "Test City, TS",
  url: "https://example.com",
  hasMenu: true,
};

export const MOCK_MENU: IMenu = {
  id: "mock-menu-id",
  restaurantId: "mock-restaurant-id",
  categories: {},
  isAYCE: false,
};
