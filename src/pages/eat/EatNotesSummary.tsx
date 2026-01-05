import { SecondaryButton } from "@/components/Buttons";
import Markdown from "react-markdown";
import type { INote, IRestaurant } from "./Eat.types";
import { useGenerateNotesSummary } from "./hooks/eatNoteHooks";

export default function EatNotesSummary({
  notes,
  restaurant,
}: {
  notes: INote[];
  restaurant: IRestaurant;
}) {
  const { summary, isStreaming, generateNotesSummary } =
    useGenerateNotesSummary();
  return (
    <>
      <SecondaryButton
        onClick={() => {
          generateNotesSummary(notes || [], restaurant);
        }}
      >
        Generate Summary
      </SecondaryButton>
      {summary && <Markdown>{summary}</Markdown>}
      {isStreaming && <div>Generating summary...</div>}
    </>
  );
}
