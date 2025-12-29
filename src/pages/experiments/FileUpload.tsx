import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

type FileUploadStatus = "idle" | "uploading" | "success" | "error";
const FileUpload = () => {
  const [FileUploadStatus, setFileUploadStatus] =
    useState<FileUploadStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onUploadClick = () => {
    //setFileUploadStatus("uploading");
    fileInputRef.current?.click();
  };
  return (
    <div>
      <h1>File Upload Experiment</h1>
      <input ref={fileInputRef} type="file" className="hidden"></input>
      {FileUploadStatus === "idle" && (
        <div
          onClick={onUploadClick}
          className="w-xs h-xs p-30 border rounded-md border-gray-200"
        >
          <FontAwesomeIcon
            icon={faPlusSquare}
            onClick={() => setFileUploadStatus("success")}
          />
        </div>
      )}
      <ProgressBar percentage={5} />
    </div>
  );
};

const ProgressBar = (props: { percentage: number }) => {
  const { percentage } = props;
  return (
    <div className="w-full">
      <div className={`w-${percentage} h-10 bg-green-100 `}>{percentage}</div>
    </div>
  );
};

export default FileUpload;
