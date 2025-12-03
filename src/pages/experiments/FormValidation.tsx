import { useState } from "react";

interface IFormData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  date?: string;
}

export const FormValidation = () => {
  const [formData, setFormData] = useState<IFormData>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData({});
  };

  const submitForm = () => {
    console.log("Form submitted:", formData);
  };
  return (
    <div className={"p-20"}>
      <form action={() => submitForm()}>
        <h1 className={"text-2xl font-bold mb-4"}>
          Form Validation Experiment
        </h1>
        <div className={"mb-4"}>
          <label className={"block mb-2"} htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData?.email || ""}
            className={"border p-2 w-full"}
            onChange={handleChange}
            required
          />
          <label className={"block mb-2 mt-4"} htmlFor="firstName">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData?.firstName || ""}
            className={"border p-2 w-full"}
            onChange={handleChange}
            required
          />
          <label className={"block mb-2 mt-4"} htmlFor="lastName">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData?.lastName || ""}
            className={"border p-2 w-full"}
            onChange={handleChange}
            required
          />
          <label className={"block mb-2 mt-4"} htmlFor="phoneNumber">
            Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData?.date || ""}
            className={"border p-2 w-full"}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="submit"
          className="cursor-pointer hover:opacity-50 border border-gray-300 shadow-md rounded-md w-24 py-2 mix-blend-darken"
          value="Submit"
        ></input>
        <input
          type="button"
          className="cursor-pointer hover:opacity-50 border border-gray-300 shadow-md rounded-md w-24 py-2 mix-blend-darken"
          value="Clear"
          onClick={clearForm}
        ></input>
      </form>

      <h1>Form Data</h1>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};
