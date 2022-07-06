import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Failure() {
  return (
    <div>
      <FontAwesomeIcon icon={faTriangleExclamation} size="lg" color="red" />
    </div>
  );
}
