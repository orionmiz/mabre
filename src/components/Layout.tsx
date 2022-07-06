import Head from "next/head";
import BottomNav from "./layout/BottomNav";
import TopNav from "./layout/TopNav";
import styles from "./Layout.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>마브레 / 마인크래프트 커뮤니티</title>
        <meta
          name="description"
          content="마인크래프트 마브레 커뮤니티입니다."
        ></meta>
      </Head>
      <header className={styles.header}>
        <TopNav />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <BottomNav />
      </footer>
    </div>
  );
}
