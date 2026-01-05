import { SecondaryButton } from "@/components/Buttons";
import Markdown from "react-markdown";
import type { INote, IRestaurant } from "./Eat.types";
import { useGenerateNotesSummary } from "./hooks/eatNoteHooks";
import { useTranslation } from "react-i18next";

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
      <SecondaryButton
        onClick={() => {
          generateNotesSummary(notes || [], restaurant, language);
        }}
      >
        Generate Summary
      </SecondaryButton>
      {summary && <Markdown>{summary}</Markdown>}
      {isStreaming && <div>Generating summary...</div>}
    </>
  );
}
