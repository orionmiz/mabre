import BoardPreview from "~/components/board/BoardPreview";
import Dashboard from "~/components/Dashboard";
import Layout from "~/components/Layout";
import Leaderboard, { Ranker } from "~/components/Leaderboard";
import { findArticlesFromPage } from "~/lib/services/article";
import { findUsers } from "~/lib/services/user";
import { Modelize } from "~/lib/types";
import styles from "./Home.module.scss";

const Home = ({
  notices,
  frees,
  userRanking,
}: {
  notices: Modelize<typeof findArticlesFromPage>;
  frees: Modelize<typeof findArticlesFromPage>;
  userRanking: Ranker[];
}) => {
  return (
    <Layout>
      <div className={styles.home}>
        <div className={styles.dashboard}>
          <Dashboard />
        </div>
        <div className={styles.boxes}>
          <BoardPreview boardId="notice" title="공지사항" articles={notices} />
          <BoardPreview boardId="free" title="자유게시판" articles={frees} />
          <div className={styles.rankings}>
            <Leaderboard title="유저 랭킹" rankers={userRanking} />
            <Leaderboard title="패밀리 랭킹" rankers={[]} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  // fetch rankings (user, family), boards (notice, free)

  const notices = await findArticlesFromPage({
    where: {
      boardId: "notice",
    },
    page: 1,
    count: 10,
  });

  const frees = await findArticlesFromPage({
    where: {
      boardId: "free",
    },
    page: 1,
    count: 10,
  });

  const userRanking: Ranker[] = (
    await findUsers({
      take: 6,
      orderBy: {
        score: "desc",
      },
    })
  ).map((user) => ({
    id: user.id,
    name: user.name,
    score: user.score,
  }));

  return {
    props: {
      notices,
      frees,
      userRanking,
    },
  };
}

export default Home;
