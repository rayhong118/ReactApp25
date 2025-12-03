export const FormValidation = () => {
  return (
    <form className={"p-20"}>
      <h1 className={"text-2xl font-bold mb-4"}>Form Validation Experiment</h1>
      <div className={"mb-4"}>
        <label className={"block mb-2"} htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className={"border p-2 w-full"}
          required
        />
      </div>
    </form>
  );
};
