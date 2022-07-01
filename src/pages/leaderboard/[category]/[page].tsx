import { GetServerSideProps } from "next";
import Layout from "~/components/Layout";
import Leaderboard, { Ranker } from "~/components/Leaderboard";
import { findUsers } from "~/lib/services/user";

const titles = {
  user: "유저 랭킹",
  family: "패밀리 랭킹",
};

export default function LeaderboardPage({
  title,
  rankers,
}: {
  title: string;
  rankers: Ranker[];
}) {
  return (
    <Layout>
      <Leaderboard title={title} rankers={rankers} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const category = (query.category as string) ?? "user";
  const page = parseInt((query.page as string) ?? 1);

  let rankers: Ranker[];

  switch (category) {
    case "user": {
      const users = await findUsers({
        skip: (page - 1) * 10,
        take: 10,
        orderBy: {
          score: "desc",
        },
      });
      rankers = users.map((user) => ({
        id: user.id,
        name: user.name,
        score: user.score,
      }));
      break;
    }
    case "family":
      rankers = [];
      break;
    default:
      return {
        props: {},
        redirect: {
          destination: "404",
          permanent: false,
        },
      };
  }

  return {
    props: {
      title: titles[category],
      rankers,
    },
  };
};
