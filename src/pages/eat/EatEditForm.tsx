import { useEffect, useRef, useState } from "react";
import type { IRestaurant } from "./Eat.types";
import "./EatEditDialog.scss";
import { addRestaurant } from "./hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface IEatEditDialogProps {
  restaurant?: IRestaurant;
}

export const EatEditDialog = (props?: IEatEditDialogProps) => {
  const { restaurant }: IEatEditDialogProps = props || {};
  const [eatData, setEatData] = useState<Partial<IRestaurant>>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [googleSearchInput, setGoogleSearchInput] = useState("");
  const timeoutRef = useRef<any>(null);
  const placeAutocompleteRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending, isSuccess, error } = addRestaurant();

  useEffect(() => {
    if (restaurant) {
      setEatData(restaurant);
    }
  }, [restaurant]);

  const administrativeAreaLevel1 = "administrative_area_level_1";
  const locality = "locality";

  useEffect(() => {
    if (!placeAutocompleteRef.current) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      placeAutocompleteRef.current,
      {
        /**
         * Restrict the autocomplete to restaurants
         */
        types: ["restaurant"],
        fields: [
          "name",
          "formatted_address",
          "address_components",
          "place_id",
          "url",
          "formatted_phone_number",
        ],
        /**
         * Restrict the autocomplete to the United States
         */
        componentRestrictions: { country: "us" },
      }
    );

    if (!autocomplete) {
      return;
    }
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place) {
        const city = place.address_components?.find((component) =>
          component.types.includes(locality)
        )?.short_name;
        const state = place.address_components?.find((component) =>
          component.types.includes(administrativeAreaLevel1)
        )?.short_name;
        const cityAndState = `${city}, ${state}`;

        const newEatData = {
          ...eatData,
          id: place.place_id || "",
          name: place.name || "",
          address: place.formatted_address || "",
          price: place.price_level,
          displayName: "",
          description: "",
          url: place.url,
          phoneNumber: place.formatted_phone_number,
          cityAndState: cityAndState,
        };
        setEatData(newEatData);
      }
    });

    return () => {
      // clear search input to dismiss autocomplete
      setGoogleSearchInput("");
    };
  }, [placeAutocompleteRef]);

  const handleGoogleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setGoogleSearchInput(value);
    }, 500);
  };

  useEffect(() => {
    if (googleSearchInput) {
      console.log("googleSearchInput", googleSearchInput);
    }
  }, [googleSearchInput]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEatData({ ...eatData, [name]: value });
  };

  useEffect(() => {
    if (eatData && eatData.name && eatData.address && eatData.price) {
      setIsFormValid(true);
    }
  }, [eatData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid && eatData) {
      mutate(eatData);
    }
  };

  if (isPending) {
    return <div className=" px-5 py-20 md:p-20">Loading...</div>;
  }

  if (isSuccess) {
    return <div className=" px-5 py-20 md:p-20">Restaurant added successfully</div>;
  }


  return (
    <div className=" px-5 py-20 md:p-20">
      {error && <div className="text-red-500">{error.message}</div>}
      <div className="eat-edit-dialog">
        <h1 className="text-2xl font-bold py-2">{restaurant ? "Edit" : "Add"} Restaurant</h1>
        <form onSubmit={handleSubmit}>
          <div className="labeled-input">
            <input
              type="text"
              id="googleSearch"
              placeholder=""
              onChange={handleGoogleSearch}
              ref={placeAutocompleteRef}
            />
            <label htmlFor="googleSearch">
              <FontAwesomeIcon icon={faSearch} className="mr-2" />Search for the restaurant
            </label>
          </div>

          <div className="labeled-input">
            <input
              type="text"
              id="name"
              name="name"
              placeholder=""
              value={eatData?.name}
              onBlur={handleChange}
            />
            <label htmlFor="name">Name - Populated by Google Maps</label>
          </div>
          <div className="labeled-input">
            <input
              type="text"
              id="displayName"
              name="displayName"
              placeholder=""
              value={eatData?.displayName}
              onBlur={handleChange}
            />
            <label htmlFor="displayName">Display Name</label>
          </div>
          <div className="labeled-input">
            <input
              type="text"
              id="description"
              name="description"
              placeholder=""
              value={eatData?.description}
              onBlur={handleChange}
            />
            <label htmlFor="description">Description</label>
          </div>
          <div className="labeled-input">
            <input
              disabled
              type="text"
              id="address"
              placeholder=""
              value={eatData?.address}
            />
            <label htmlFor="address">Address</label>
          </div>
          <div className="labeled-input">
            <input
              type="text"
              id="price"
              name="price"
              placeholder=""
              value={eatData?.price}
              onChange={handleChange}
            />
            <label htmlFor="price">Price</label>
          </div>
          <div className="labeled-input">
            <input
              disabled
              type="text"
              id="phoneNumber"
              placeholder=""
              value={eatData?.phoneNumber}
            />
            <label htmlFor="phoneNumber">Phone Number</label>
          </div>
          <div className="labeled-input">
            <input
              disabled
              type="text"
              id="cityAndState"
              placeholder=""
              value={eatData?.cityAndState}
            />
            <label htmlFor="cityAndState">City and State</label>
          </div>

          <button disabled={!isFormValid} type="submit"
            className="bg-blue-500 text-white p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
