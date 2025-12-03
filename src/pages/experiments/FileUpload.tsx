import { useState } from "react";

type FileUploadStatus = "idle" | "uploading" | "success" | "error";
export const FileUpload = () => {
  const [FileUploadStatus, setFileUploadStatus] =
    useState<FileUploadStatus>("idle");
  return (
    <div className="p-20">
      <h1>File Upload Experiment</h1>
      {FileUploadStatus === "idle" && (
        <input
          type="file"
          className="w-md h-md border rounded-md border-gray-200"
        ></input>
      )}
    </div>
  );
};

const progressBar = (percentage: number) => {
  return (
    <div className={`w-${percentage}/100 h-10 bg-green-100 `}>{percentage}</div>
  );
};
