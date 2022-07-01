import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import styles from "./PageNavigator.module.scss";

export default function PageNavigator({
  page,
  totalPages,
  // for dynamic rendering
  change,
  // for pre-rendering
  baseURL,
}: {
  page: number;
  totalPages: number;
  change?: (page: number) => void;
  baseURL?: string;
}) {
  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faAngleLeft} />
      <div className={styles.pageButtons}>
        {Array(totalPages)
          .fill(0)
          .map((_, i) => {
            const p = i + 1;
            const active = p === page;

            // active: dynamic rendering
            // true => x
            // false => change
            //
            // active: for pre-rendering
            // true => x
            // false => Link

            const className = `${styles.pageButton} ${
              active ? styles.active : ""
            }`;

            const eventProps = change
              ? {
                  onClick: () => change(p),
                }
              : {};
            const RenderComponent = active ? "span" : "a";

            return baseURL && !active ? (
              <Link href={`${baseURL}/${p}`} key={p}>
                {/* https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component */}
                <RenderComponent className={className}>{p}</RenderComponent>
              </Link>
            ) : (
              <RenderComponent className={className} {...eventProps} key={p}>
                {p}
              </RenderComponent>
            );
          })}
      </div>
      <FontAwesomeIcon icon={faAngleRight} />
    </div>
  );
}
