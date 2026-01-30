import { updateRestaurantStars } from "./callables/updateRestaurantStars";
import { updateRestaurantAverageRating } from "./triggers/updateRestaurantAverageRating";
import { selectLocationTagsBasedOnCurrentLocation } from "./callables/selectLocationTagsBasedOnCurrentLocation";
import { generateNotesSummary } from "./callables/generateNotesSummary";
import { handleMenuImageUpload } from "./triggers/handleMenuImageUpload";
import { handleMenuUrlSubmission } from "./triggers/handleMenuUrlSubmission";
import { searchRestaurantByName } from "./callables/searchRestaurantByName";
import { generateSuggestionBasedOnUserPrompt } from "./callables/generateSuggestionBasedOnUserPrompt";
import { handleRestaurantLocationTags } from "./triggers/handleRestaurantLocationTags";

export {
  updateRestaurantStars,
  updateRestaurantAverageRating,
  selectLocationTagsBasedOnCurrentLocation,
  generateNotesSummary,
  handleMenuImageUpload,
  handleMenuUrlSubmission,
  searchRestaurantByName,
  generateSuggestionBasedOnUserPrompt,
  handleRestaurantLocationTags,
};
