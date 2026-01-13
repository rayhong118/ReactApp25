import type { IGift } from "./Gift.types";
interface IGiftCardProps {
  gift: IGift;
}
const GiftCard = ({ gift }: IGiftCardProps) => {
  const colorClass =
    gift.type === "preferred"
      ? "bg-amber-50 border-amber-500"
      : "bg-stone-50 border-stone-500";
  return (
    <div className={`p-4 border rounded ${colorClass}`}>
      <h2 className="text-lg font-bold">{gift.name}</h2>
      <p className="text-gray-600">{gift.description}</p>
    </div>
  );
};

export default GiftCard;
