import { useNavigate } from "react-router-dom";
import { SecondaryButton } from "@/components/Buttons";
import { useFetchArtworkById } from "./hooks";
import { useParams } from "react-router-dom";
import { Loading } from "@/components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const SingleDrawing = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isLoading } = useFetchArtworkById(id as string);

  if (!id || (!data && !isLoading)) return null;

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex w-full justify-between items-center">
        <SecondaryButton onClick={() => navigate("/drawings")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </SecondaryButton>
        <h1 className="text-2xl font-bold">{data?.title}</h1>
        <p>{data?.date?.toLocaleDateString()}</p>
      </div>

      <img src={data?.imageURL} alt={data?.title} />
      <p>{data?.description}</p>
    </div>
  );
};

export default SingleDrawing;
