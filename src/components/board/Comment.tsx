import styles from "./Comment.module.scss";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modelize } from "~/lib/types";
import { findCommentsFromPage } from "~/lib/services/comment";
import useProfile from "~/hooks/useProfile";
import { parseDate } from "~/lib/util";
import { useState } from "react";

type Comment = Modelize<typeof findCommentsFromPage>[number];

interface CommentProps extends Comment {
  boardId: string;
  articleId: number;
  refresh: (count: number) => Promise<void>;
}

export default function Comment({
  id,
  author,
  text,
  createdAt,
  boardId,
  articleId,
  refresh,
}: CommentProps) {
  const { profile } = useProfile();

  const [pending, setPending] = useState(false);

  const erase = async () => {
    if (pending) return;

    setPending(true);

    if (!window.confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    const res = await fetch(
      `/api/boards/${boardId}/${articleId}/comments/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      setPending(false);
      return;
    }

    alert("댓글이 삭제되었습니다.");

    const { count } = await res.json();

    await refresh(count);
  };

  return (
    <div className={styles.container}>
      <div className={styles.author}>
        <div>{author.name}</div>
        {profile && profile.name === author.name && (
          <div onClick={erase} className={styles.delete}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        )}
      </div>
      <div>{text}</div>
      <div className={styles.date}>
        {format(parseDate(createdAt), "yyyy.M.d hh:mm")}
      </div>
    </div>
  );
}
