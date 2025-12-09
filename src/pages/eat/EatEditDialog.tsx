import { useEffect, useState } from 'react';
import type { IRestaurant } from './Eat.types';
import './EatEditDialog.scss';


interface IEatEditDialogProps {
  restaurant?: IRestaurant;
}

export const EatEditDialog = (props?: IEatEditDialogProps) => {

  const [eatData, setEatData] = useState<IRestaurant>();
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (props?.restaurant) {
      setEatData(props.restaurant);
    }
  }, [props?.restaurant]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setIsFormValid(validateForm());
    setEatData({ ...eatData, [name]: value });

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
    <div className=' p-5 md:p-20'>
      <div className="eat-edit-dialog">
        <h1>Edit</h1>
        <form onSubmit={handleSubmit}>
          <div className="labeled-input">
            <input type="text" id="name" placeholder="" disabled value={eatData?.name} onBlur={handleChange} />
            <label htmlFor="name">Name - Populated by Google Maps</label>
          </div>
          <div className="labeled-input">
            <input type="text" id="displayName" placeholder="" value={eatData?.displayName} onBlur={handleChange} />
            <label htmlFor="displayName">Display Name</label>
          </div>



          <button disabled={!isFormValid} type="submit">Submit</button>
        </form>
      </div>
    </div>

  );
};