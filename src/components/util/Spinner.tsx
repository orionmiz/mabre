import styles from "./Spinner.module.scss";

export default function Spinner({ size = "30px" }: { size?: string }) {
  return (
    <div
      className={styles.spinner}
      style={{
        width: size,
        height: size,
      }}
    ></div>
  );
}
