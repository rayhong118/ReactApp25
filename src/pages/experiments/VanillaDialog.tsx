import { XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

export const VanillaDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-10">
      <h1>Vanilla Dialog Experiment</h1>
      <button onClick={() => setOpen(true)}>Show Dialog</button>
      <DialogComponent
        open={open}
        title="Dialog Title"
        actions={[
          { label: "Confirm", onClick: () => setOpen(false) },
          { label: "Cancel", onClick: () => setOpen(false) },
        ]}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

interface IAction {
  label: string;
  onClick: () => void;
}

interface IDialogComponentProps {
  open: boolean;
  title: string;
  actions: IAction[];
  onClose?: () => void;
}

const DialogComponent = (props: IDialogComponentProps) => {
  const { title, actions, open, onClose } = props;
  if (!open) return null;
  return (
    <dialog
      id="dialog"
      open={open}
      aria-modal="true"
      className="border rounded-md p-5 flex flex-col justify-between gap-2 backdrop-blur-xs backdrop-grayscale"
    >
      <div className="flex flex-row justify-between items-center">
        <h2>{title}</h2>
        <button
          onClick={onClose}
          className="cursor-pointer hover:bg-gray-100 border-gray-200 border rounded-md "
        >
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex flex-row justify-end gap-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="cursor-pointer hover:bg-gray-100 p-1 border-gray-200 border-1 rounded-md"
          >
            {action.label}
          </button>
        ))}
      </div>
    </dialog>
  );
};
