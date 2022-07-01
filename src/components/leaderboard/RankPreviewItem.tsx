import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "~/styles/leaderboard/LeaderboardPreview.module.scss";

enum MedalColor {
  "gold" = 1,
  "silver",
  "peru",
}

export default function RankPreviewItem({
  name: username,
  rank,
  score,
}: {
  name: string;
  rank: number;
  score: number;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <span className={styles.rank}>
          {rank <= 3 ? (
            <FontAwesomeIcon icon={faMedal} color={MedalColor[rank]} />
          ) : (
            rank
          )}
        </span>
        <span>{username}</span>
      </div>
      <div className={styles.score}>{score}</div>
    </div>
  );
}
