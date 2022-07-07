import { faCheckCircle, faEllipsis, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "./Spinner";

export default function StatusIcon({
  loading, error, success
}: {
  loading: boolean;
  error: boolean;
  success: boolean;
}) {
  return (
    loading ? (
      <Spinner size={"1rem"} />
    ) : success ? (
      <FontAwesomeIcon icon={faCheckCircle} color="lime" />
    ) : error ? (
      <FontAwesomeIcon icon={faXmarkCircle} color="red" />
    ) : (
      <FontAwesomeIcon icon={faEllipsis} color="gray" />
    )
  );
}