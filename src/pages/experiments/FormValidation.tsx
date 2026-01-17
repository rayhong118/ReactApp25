import { SecondaryButton } from "@/components/Buttons";
import { useState } from "react";

interface IFormData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  date?: Date;
  number?: number;
}

const FormValidation = () => {
  const [formData, setFormData] = useState<IFormData>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    switch (type) {
      case "number":
        setFormData({ ...formData, [name]: e.target.valueAsNumber });
        break;
      case "date":
        setFormData({ ...formData, [name]: e.target.valueAsDate });
        break;
      default:
        setFormData({ ...formData, [name]: value });
    }
  };

  const clearForm = () => {
    setFormData({});
  };

  const submitForm = () => {
    console.log("Form submitted:", formData);
  };

  return (
    <div>
      <form onSubmit={() => submitForm()}>
        <h1 className={"text-2xl font-bold mb-4"}>
          Form Validation Experiment
        </h1>
        <div className={"mb-4 flex flex-col gap-4"}>
          <div className="labeled-input">
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email || ""}
              className={"border p-2 w-full"}
              placeholder=""
              onChange={handleChange}
              required
            />
            <label className={"block mb-2"} htmlFor="email">
              Email:
            </label>
          </div>
          <div className="labeled-input">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData?.firstName || ""}
              className={"border p-2 w-full"}
              placeholder=""
              onChange={handleChange}
              required
            />
            <label className={"block mb-2 mt-4"} htmlFor="firstName">
              First Name:
            </label>
          </div>
          <div className="labeled-input">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData?.lastName || ""}
              className={"border p-2 w-full"}
              placeholder=""
              onChange={handleChange}
              required
            />
            <label className={"block mb-2 mt-4"} htmlFor="lastName">
              Last Name:
            </label>
          </div>
          <div className="labeled-input">
            <input
              type="number"
              id="number"
              name="number"
              value={formData?.number || ""}
              className={"border p-2 w-full"}
              placeholder=""
              onChange={handleChange}
              required
            />
            <label className={"block mb-2 mt-4"} htmlFor="number">
              Number:
            </label>
          </div>
          <div className="labeled-input">
            <input
              type="date"
              id="date"
              name="date"
              value={formData?.date?.toISOString().split("T")[0] || ""}
              className={"border p-2 w-full"}
              placeholder=""
              onChange={handleChange}
              required
            />
            <label className={"block mb-2 mt-4"} htmlFor="date">
              Date:
            </label>
          </div>
        </div>
        <SecondaryButton type="button" onClick={submitForm}>
          Submit
        </SecondaryButton>
        <SecondaryButton type="button" onClick={clearForm}>
          Clear
        </SecondaryButton>
      </form>

      <h1>Form Data</h1>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default FormValidation;
