import Markdown from "react-markdown";
import type { INote, IRestaurant } from "./Eat.types";
import { useGenerateNotesSummary } from "./hooks/eatNoteHooks";
import { useTranslation } from "react-i18next";
import { CustomizedButton } from "@/components/Buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function EatNotesSummary({
  notes,
  restaurant,
}: {
  notes: INote[];
  restaurant: IRestaurant;
}) {
  const language = useTranslation().i18n.language;
  const { summary, isStreaming, generateNotesSummary } =
    useGenerateNotesSummary();
  return (
    <>
      <CustomizedButton
        onClick={() => {
          generateNotesSummary(notes || [], restaurant, language);
        }}
        disabled={isStreaming}
      >
        {isStreaming && (
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        )}
        Generate Summary
      </CustomizedButton>
      {summary && <Markdown>{summary}</Markdown>}
    </>
  );
}
