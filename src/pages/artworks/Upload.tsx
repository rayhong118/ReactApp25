// Handles image upload to Firebase Storage, and creates a new artwork document in Firestore
import { useEffect, useRef, useState } from "react";
import type { IUploadPayload } from "./Artworks.types";
import { useUploadFile, useGetCategories } from "./hooks";
import "./Upload.scss";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import { Loading } from "@/components/Loading";
import ErrorBoundary from "@/components/ErrorBoundary";

const Upload = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadPayload, setUploadPayload] = useState<Partial<IUploadPayload>>();

  const { uploadFile, isPending, isSuccess } = useUploadFile();
  const { categories } = useGetCategories();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
    console.log(file?.name);
    setUploadPayload({
      ...uploadPayload,
      date: new Date(file?.lastModified || Date.now()),
      file,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date") {
      setUploadPayload({
        ...uploadPayload,
        date: new Date(value),
      });
    } else {
      setUploadPayload({
        ...uploadPayload,
        [name]: value,
      });
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !imageFile ||
      !uploadPayload ||
      !uploadPayload.title ||
      !uploadPayload.date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const finalPayload: IUploadPayload = {
      file: imageFile,
      title: uploadPayload.title,
      description: uploadPayload.description || "",
      category: uploadPayload.category || "",
      date: uploadPayload.date,
    };

    uploadFile(finalPayload);
    // console.log(finalPayload);
  };

  const clearForm = () => {
    setImageFile(null);
    setUploadPayload({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      clearForm();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={isPending}>
        <Loading />
      </Dialog>

      <h1 className="text-2xl font-bold">Upload</h1>

      <input
        type="file"
        required
        onChange={handleImageChange}
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
      />
      {imageFile && (
        <img
          src={URL.createObjectURL(imageFile)}
          alt="Preview"
          className="w-full"
        />
      )}
      <SecondaryButton onClick={onUploadClick} paddingMultiplier={2}>
        {imageFile ? "Change" : "Add"} Image
      </SecondaryButton>
      {
        <form
          onSubmit={handleUpload}
          className="upload-form grid grid-cols-2 gap-4"
          autoComplete="off"
        >
          <div className="labeled-input col-span-1">
            <input
              type="text"
              required
              placeholder=""
              name="title"
              onChange={handleInputChange}
              value={uploadPayload?.title || ""}
            />
            <label htmlFor="title">Title</label>
          </div>
          <div className="labeled-input col-span-1">
            <input
              type="text"
              placeholder=""
              name="category"
              required
              onChange={handleInputChange}
              list="categories"
              value={uploadPayload?.category || ""}
            />
            <label htmlFor="category">Category</label>
          </div>
          {/* Category options. TODO: fetch list from database. */}
          <datalist id="categories">
            {categories?.map((cat: string) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          <div className="labeled-input col-span-2">
            <input
              type="text"
              placeholder=""
              name="description"
              onChange={handleInputChange}
              value={uploadPayload?.description || ""}
            />
            <label htmlFor="description">Description</label>
          </div>
          <div className="labeled-input col-span-1">
            <ErrorBoundary
              fallback={
                <div className="text-red-500 text-xs mt-2">
                  Invalid date detected.
                </div>
              }
            >
              <input
                type="date"
                required
                placeholder=""
                name="date"
                onChange={handleInputChange}
                value={
                  uploadPayload?.date && !isNaN(uploadPayload.date.getTime())
                    ? uploadPayload.date.toISOString().split("T")[0]
                    : ""
                }
              />
              <label htmlFor="date">Date</label>
            </ErrorBoundary>
          </div>
          <PrimaryButton
            type="submit"
            className="col-span-2"
            disabled={isPending || !uploadPayload}
            paddingMultiplier={2}
          >
            {isPending ? "Uploading..." : "Upload"}
          </PrimaryButton>
        </form>
      }
    </div>
  );
};

export default Upload;
