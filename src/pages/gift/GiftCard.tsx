import type { IGift } from "./Gift.types";
interface IGiftCardProps {
  gift: IGift;
}
const GiftCard = ({ gift }: IGiftCardProps) => {
  return (
    <div>
      <h2>{gift.name}</h2>
      <p>{gift.description}</p>
    </div>
  );
};

export default GiftCard;
