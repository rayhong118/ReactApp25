import { SecondaryButton } from "@/components/Buttons";
import { useGenerateNotesSummary } from "./hooks/eatNoteHooks";
import type { INote, IRestaurant } from "./Eat.types";

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
      {summary && <div>{summary}</div>}
      {isStreaming && <div>Generating summary...</div>}
    </>
  );
}
