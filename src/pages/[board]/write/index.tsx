import { faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetStaticPaths } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import BoardList from "~/components/board/BoardList";
import Layout from "~/components/Layout";
import Spinner from "~/components/util/Spinner";
import { findBoard, findBoards } from "~/lib/services/board";
import styles from "./WritePage.module.scss";

const Editor = dynamic(() => import("~/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className={styles.editor}>
      <Spinner />
    </div>
  ),
});

export default function WritePage({
  board,
  article,
  mode,
}: {
  board: string;
  article: {
    title: string;
    content: EditorJS.OutputData;
  };
  mode: "new" | "edit";
}) {
  const router = useRouter();

  const [title, setTitle] = useState(article.title);

  const [content, setContent] = useState<EditorJS.OutputData>(article.content);

  const [pending, setPending] = useState(false);

  const save = () => {
    // temporal save
  };

  const submit = async () => {
    if (!title.length) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.blocks.length) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (pending) {
      return;
    }

    setPending(true);

    const endpoint = `/api/boards/${router.query.board}${
      mode === "edit" ? `/${router.query.article}` : ""
    }`;

    const method = mode === "new" ? "POST" : "PUT";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (res.ok) {
      alert("저장되었습니다.");
      const result = await res.json();
      router.push(
        mode === "new"
          ? result.redirect
          : `/${router.query.board}/${router.query.article}`
      );
    } else {
      alert(res.statusText);
      setPending(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.boardList}>
          <BoardList />
        </div>
        <div className={styles.write}>
          <h1 className={styles.writeDesc}>
            <span>{board}</span>
            <span>/</span>
            <span>게시글 {mode === "new" ? "작성" : "수정"}</span>
          </h1>
          <div className={styles.title}>
            <input
              className={styles.titleInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={"제목을 입력하세요"}
              maxLength={30}
              autoFocus={true}
            ></input>
          </div>
          <div className={styles.editor}>
            <Editor content={content} changeContent={setContent} />
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.writeBtn}
              onClick={save}
              disabled={pending}
            >
              <FontAwesomeIcon icon={faSave} />
              <span>임시저장</span>
            </button>
            <button
              className={styles.writeBtn}
              onClick={submit}
              disabled={pending}
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>업로드</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async ({
  params,
}: {
  params: {
    board: string;
  };
}) => {
  const { board: boardId } = params;

  const board = await findBoard({
    id: boardId,
  });

  if (!board) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  return {
    props: {
      board: board.desc,
      article: {
        title: "",
        content: {
          blocks: [],
        },
      },
      mode: "new",
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const boardList = await findBoards();

  const paths = boardList.map((board) => ({
    params: {
      board: board.id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};
