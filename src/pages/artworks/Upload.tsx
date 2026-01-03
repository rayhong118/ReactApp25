// Handles image upload to Firebase Storage, and creates a new artwork document in Firestore
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { Dialog } from "@/components/Dialog";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loading } from "@/components/Loading";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { IUpdatePayload, IUploadPayload } from "./Artworks.types";
import {
  useFetchArtworkById,
  useGetCategories,
  useUpdateArtwork,
  useUploadFile,
} from "./hooks";
import "./Upload.scss";

const Upload = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [payload, setPayload] = useState<Partial<IUploadPayload>>();

  const [searchParams] = useSearchParams();
  const { data: specificArtwork } = useFetchArtworkById(
    searchParams.get("id") || ""
  );

  const { uploadFile, isPending, isSuccess } = useUploadFile();
  const { updateArtwork } = useUpdateArtwork();
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
    setPayload({
      ...payload,
      date: new Date(file?.lastModified || Date.now()),
      file,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date") {
      setPayload({
        ...payload,
        date: new Date(value),
      });
    } else {
      setPayload({
        ...payload,
        [name]: value,
      });
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !payload || !payload.title || !payload.date) {
      alert("Please fill in all required fields.");
      return;
    }

    const finalPayload: IUploadPayload = {
      file: imageFile,
      title: payload.title,
      description: payload.description || "",
      category: payload.category || "",
      date: payload.date,
    };

    uploadFile(finalPayload);
  };

  const handleUpdate = (e: React.FormEvent) => {
    if (!specificArtwork) {
      return;
    }
    e.preventDefault();
    if (!payload || !payload.title || !payload.date) {
      alert("Please fill in all required fields.");
      return;
    }

    const finalPayload: IUpdatePayload = {
      ...(payload as IUpdatePayload),
      id: specificArtwork.id,
    };

    updateArtwork(finalPayload);
  };

  const clearForm = () => {
    setImageFile(null);
    setPayload({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      clearForm();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (specificArtwork) {
      console.log(specificArtwork);
      setPayload({
        title: specificArtwork.title,
        description: specificArtwork.description,
        category: specificArtwork.category,
        date: specificArtwork.date,
        imageURL: specificArtwork.imageURL,
      });
    }
  }, [specificArtwork]);

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
      {specificArtwork && !imageFile && (
        <img
          src={specificArtwork.imageURL}
          alt={specificArtwork.title}
          className="w-full"
        />
      )}
      {imageFile && (
        <>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full"
          />
          <SecondaryButton
            onClick={() => setImageFile(null)}
            paddingMultiplier={2}
          >
            Remove Replacement Image
          </SecondaryButton>
        </>
      )}

      <SecondaryButton onClick={onUploadClick} paddingMultiplier={2}>
        {imageFile || specificArtwork ? "Change" : "Add"} Image
      </SecondaryButton>
      {
        <form
          onSubmit={specificArtwork ? handleUpdate : handleUpload}
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
              value={payload?.title || ""}
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
              value={payload?.category || ""}
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
              value={payload?.description || ""}
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
                  payload?.date && !isNaN(payload.date.getTime())
                    ? payload.date.toISOString().split("T")[0]
                    : ""
                }
              />
              <label htmlFor="date">Date</label>
            </ErrorBoundary>
          </div>
          <PrimaryButton
            type="submit"
            className="col-span-2"
            disabled={isPending || !payload}
            paddingMultiplier={2}
          >
            {isPending ? "Submitting..." : "Submit"}
          </PrimaryButton>
        </form>
      }
    </div>
  );
};

export default Upload;
