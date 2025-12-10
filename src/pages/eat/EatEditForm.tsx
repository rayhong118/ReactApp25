import { useEffect, useRef, useState } from 'react';
import type { IRestaurant } from './Eat.types';
import './EatEditDialog.scss';


interface IEatEditDialogProps {
  restaurant?: IRestaurant;
}

export const EatEditDialog = (props?: IEatEditDialogProps) => {

  const [eatData, setEatData] = useState<IRestaurant>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [googleSearchInput, setGoogleSearchInput] = useState('');
  const timeoutRef = useRef<any>(null);
  const placeAutocompleteRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (props?.restaurant) {
      setEatData(props.restaurant);
    }
  }, [props?.restaurant]);

  const administrativeAreaLevel1 = "administrative_area_level_1";
  const locality = "locality";

  useEffect(() => {

    if (!placeAutocompleteRef.current) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(placeAutocompleteRef.current, {
      /**
       * Restrict the autocomplete to restaurants
       */
      types: ["restaurant"],
      fields: ["name", "formatted_address", "address_components", "place_id", "url", "formatted_phone_number"],
      /**
       * Restrict the autocomplete to the United States
       */
      componentRestrictions: { country: "us" }
    });

    if (!autocomplete) {
      return;
    }
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place) {
        console.log(place);
        const city = place.address_components?.find((component) => component.types.includes(locality))?.short_name;
        const state = place.address_components?.find((component) => component.types.includes(administrativeAreaLevel1))?.short_name;
        const cityAndState = `${city}, ${state}`;
        const newEatData = {
          ...eatData,
          id: place.place_id || '',
          name: place.name || '',
          address: place.formatted_address || '',
          price: place.price_level,
          displayName: place.name,
          url: place.url,
          phoneNumber: place.formatted_phone_number,
          cityAndState: cityAndState,
        };
        console.log(newEatData);
        setEatData(newEatData);
      }
    });

    return () => {
      // clear search input to dismiss autocomplete
      setGoogleSearchInput('');
    }
  }, [placeAutocompleteRef])

  const handleGoogleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setGoogleSearchInput(value);
    }, 500);
  }

  useEffect(() => {
    if (googleSearchInput) {
      console.log('googleSearchInput', googleSearchInput);

    }

  }, [googleSearchInput]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setIsFormValid(validateForm());
    // setEatData({ ...eatData, [name]: value });
    console.log(name, value);
  };

  const validateForm = () => {
    if (!eatData?.name || !eatData?.displayName || !eatData?.description || !eatData?.address || !eatData?.price) {
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      console.log(eatData);
    }
  };
  return (
    <div className=' px-5 py-20 md:p-20'>
      <div className="eat-edit-dialog">
        <h1>Edit</h1>
        <form onSubmit={handleSubmit}>
          <div className="labeled-input">
            <input type="text" id="googleSearch" placeholder="" onChange={handleGoogleSearch} ref={placeAutocompleteRef} />
            <label htmlFor="googleSearch">Search Google Maps</label>
          </div>


          <div className="labeled-input">
            <input type="text" id="name" placeholder="" disabled value={eatData?.name} onBlur={handleChange} />
            <label htmlFor="name">Name - Populated by Google Maps</label>
          </div>
          <div className="labeled-input">
            <input type="text" id="displayName" placeholder="" value={eatData?.displayName} onBlur={handleChange} />
            <label htmlFor="displayName">Display Name</label>
          </div>
          <div className="labeled-input">
            <input type="text" id="description" placeholder="" value={eatData?.description} onBlur={handleChange} />
            <label htmlFor="description">Description</label>
          </div>
          <div className="labeled-input">
            <input disabled type="text" id="address" placeholder="" value={eatData?.address} onBlur={handleChange} />
            <label htmlFor="address">Address</label>
          </div>
          <div className="labeled-input">
            <input type="text" id="price" placeholder="" value={eatData?.price} onBlur={handleChange} />
            <label htmlFor="price">Price</label>
          </div>
          <div className="labeled-input">
            <input disabled type="text" id="phoneNumber" placeholder="" value={eatData?.phoneNumber} onBlur={handleChange} />
            <label htmlFor="phoneNumber">Phone Number</label>
          </div>
          <div className="labeled-input">
            <input disabled type="text" id="cityAndState" placeholder="" value={eatData?.cityAndState} onBlur={handleChange} />
            <label htmlFor="cityAndState">City and State</label>
          </div>
          <button disabled={!isFormValid} type="submit">Submit</button>
        </form>
      </div>
    </div>

  );
};