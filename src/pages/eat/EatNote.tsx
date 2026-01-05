import { CustomizedButton } from "@/components/Buttons";
import { type IDialogAction, Dialog } from "@/components/Dialog";
import { useGetCurrentUser } from "@/utils/AuthenticationAtoms";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { INote } from "./Eat.types";
import { useDeleteRestaurantNote } from "./hooks/eatNoteHooks";
import { useTranslation } from "react-i18next";

/**
 * This component displays a note for a restaurant
 * @param note - note to display
 * @param refetch - function to refetch notes
 */
const EatNote = ({ note, refetch }: { note: INote; refetch: () => void }) => {
  const User = useGetCurrentUser();
  const { t } = useTranslation();
  const { mutate: deleteNote, isPending: isDeletingNote } =
    useDeleteRestaurantNote();

  const handleDelete = () => {
    deleteNote(note.id!);
    refetch();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogActions: IDialogAction[] = [
    {
      label: "Yes",
      onClick: handleDelete,
    },
    {
      label: "No",
      onClick: () => setIsDialogOpen(false),
    },
  ];

  return (
    <div className="border-l-solid border-l-gray-200 border-l-5 px-2">
      <p>{note.content}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold">
          {note.date.toDate().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {User?.uid === note.userId && (
          <CustomizedButton
            onClick={() => setIsDialogOpen(true)}
            disabled={isDeletingNote}
            className="bg-red-600 text-white hover:bg-red-700 text-sm font-bold"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            {t("eat.notes.delete")}
          </CustomizedButton>
        )}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        actions={dialogActions}
        title={t("eat.notes.deleteTitle")}
      >
        {t("eat.notes.deleteConfirmation")}
      </Dialog>
    </div>
  );
};

export default EatNote;
