import styles from "./Leaderboard.module.scss";
import RankPreviewItem from "./leaderboard/RankPreviewItem";

export type Ranker = {
  id: number;
  name: string;
  score: number;
};

export default function Leaderboard({
  title,
  rankers,
}: {
  title: string;
  rankers: Ranker[];
}) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      {rankers.map((user, idx) => (
        <RankPreviewItem
          key={user.id}
          name={user.name}
          rank={idx + 1}
          score={user.score}
        />
      ))}
    </div>
  );
}
