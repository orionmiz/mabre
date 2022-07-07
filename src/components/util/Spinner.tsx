import styles from "./Spinner.module.scss";

export default function Spinner({ size = "30px" }: { size?: string }) {
  return (
    <>
      <div className={styles.spinner}></div>
      <style jsx>{`
        div {
          width: ${size};
          height: ${size};
        }
      `}</style>
    </>
  );
}
