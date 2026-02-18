import { CustomizedButton } from "@/components/Buttons";

export const ErrorMessagePanel = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => {
  return (
    <div>
      <div
        className={`p-4 flex items-center justify-between gap-10 flex-wrap 
          border border-red-200 bg-red-50 text-red-800 rounded-md shadow-lg`}
      >
        {message}
        {onRetry && (
          <CustomizedButton
            className="text-red-800 font-semibold border-2 border-red-800 hover:bg-red-200"
            onClick={onRetry}
          >
            Try again?
          </CustomizedButton>
        )}
      </div>
    </div>
  );
};
