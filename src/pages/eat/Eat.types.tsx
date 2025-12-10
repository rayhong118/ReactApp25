export interface IRestaurant {
  id: string;
  /**
   * Primary store name from google maps
   */
  name: string;
  /**
   * Display name will be used as primary name if provided
   */
  displayName?: string;
  description?: string;
  address: string;
  price?: number;
  /**
   * Star ratings. Used to calculate average rating and show rating given by current user
   */
  stars?: IStarRating;
  /**
   * Notes. Used to store notes given by current user
   */
  notes?: INotes[];
  url?: string;
  phoneNumber?: string;
  cityAndState?: string;
}

export interface IStarRating {
  /**
   * User id of the user who gave the rating
   */
  [userId: string]: number;
}

export interface INotes {
  /**
   * User id of the user who gave the note.
   */
  userId: string;
  content: string;
  date: Date;
}