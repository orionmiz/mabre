import useGame from "~/hooks/useGame";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const { game, isError, isLoading } = useGame();

  const status = isError ? "닫힘" : isLoading || !game ? "확인 중" : "정상";

  return (
    <div className={styles.container}>
      <div className={styles.server}>
        <span>마브레 공식서버 (mabre.org</span>
        {game?.version && ` / ${game.version}`}) :{" "}
        <span
          className={
            isError
              ? styles.statusError
              : isLoading || !game
              ? styles.statusLoading
              : styles.statusOk
          }
        >
          {status}
        </span>
      </div>
      {!(isError || isLoading) && (
        <div className={styles.players}>
          현재 플레이 중: {game?.connected}명 / {game?.maxPlayers}명
        </div>
      )}
    </div>
  );
}
