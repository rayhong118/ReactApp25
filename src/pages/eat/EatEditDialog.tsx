import './EatEditDialog.scss';
export const EatEditDialog = () => {
  return (
    <div className=' p-5 md:p-20'>
      <div className="eat-edit-dialog">
        <h1>Edit</h1>
        <form>
          <div className="labeled-input">
            <input type="text" id="name" placeholder="" disabled />
            <label htmlFor="name">Name - Populated by Google Maps</label>
          </div>
          <div className="labeled-input">
            <input type="text" id="displayName" placeholder="" />
            <label htmlFor="displayName">Display Name</label>
          </div>



          <button type="submit">Submit</button>
        </form>
      </div>
    </div>

  );
};