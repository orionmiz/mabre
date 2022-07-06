import { useRef, useState } from "react";
import useComments from "~/hooks/useComments";
import { getTotalPages } from "~/lib/util";
import PageNavigator from "../PageNavigator";
import styles from "./CommentList.module.scss";
import styleVariables from "~/styles/variables.module.scss";

import useProfile from "~/hooks/useProfile";
import Comment from "./Comment";
import Failure from "../util/Failure";
import Spinner from "../util/Spinner";

const commentsPerPage = 10;

export default function CommentList({
  boardId,
  articleId,
}: {
  boardId: string;
  articleId: number;
}) {
  const [commentsPage, setCommentsPage] = useState(1);

  const { profile } = useProfile();

  const { data, isError, isLoading, mutate } = useComments(
    boardId,
    articleId,
    commentsPage
  );

  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);

  const ref = useRef<HTMLElement>(null);

  if (isError) {
    return (
      <div className={styles.container}>
        <Failure />
      </div>
    );
  }

  if (isLoading || !data || !profile) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  const meet = !pending && comment.length >= 2 && comment.length <= 100;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meet) return;

    setPending(true);

    const res = await fetch(`/api/boards/${boardId}/${articleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: comment,
    });

    if (res.ok) {
      setComment("");
      const { count } = await res.json();
      await refresh(count, true);
    } else {
      alert(res.statusText);
    }
    setPending(false);
  };

  const refresh = async (count: number, forward = false) => {
    const totalPages = getTotalPages(count, commentsPerPage);

    if (commentsPage > totalPages || (forward && commentsPage < totalPages)) {
      // imply mutation
      setCommentsPage(totalPages);
    } else {
      // same page
      await mutate();
    }

    focus();
  };

  const focus = () =>
    window.scrollTo({
      top:
        (ref.current?.offsetTop ?? 0) - parseInt(styleVariables.headerHeight),
    });

  return (
    <section className={styles.container} ref={ref}>
      <div className={styles.total}>댓글 {data?.total}개</div>
      <div className={styles.items}>
        {data.comments.map((comment) => (
          <div className={styles.item} key={comment.id}>
            <Comment
              {...comment}
              refresh={refresh}
              boardId={boardId}
              articleId={articleId}
            />
          </div>
        ))}
      </div>
      {data.writable && (
        <form className={styles.write} onSubmit={submit}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={100}
            placeholder="댓글을 입력해보세요. (최소 2자, 최대 100자)"
          />
          <button disabled={!meet}>등록</button>
        </form>
      )}
      <PageNavigator
        page={commentsPage}
        totalPages={getTotalPages(data?.total, commentsPerPage)}
        change={(p) => {
          setCommentsPage(p);
          focus();
        }}
      />
    </section>
  );
}
