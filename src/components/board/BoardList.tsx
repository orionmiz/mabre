import Link from "next/link";
import useBoards from "~/hooks/useBoards";
import Failure from "../util/Failure";
import Spinner from "../util/Spinner";
import styles from "./BoardList.module.scss";

export default function BoardList() {
  const { data, isError, isLoading } = useBoards();

  if (isError)
    return (
      <div className={styles.container}>
        <div className={styles.item}>
          <Failure />
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className={styles.container}>
        <div className={styles.item}>
          <Spinner />
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      {Object.entries(data ?? {}).map(([key, value]) => (
        <Link href={`/${key}`} key={key}>
          <a className={styles.item}>{value.desc}</a>
        </Link>
      ))}
    </div>
  );
}
