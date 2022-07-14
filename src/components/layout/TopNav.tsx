import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faTrophy,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import styles from "./TopNav.module.scss";
import Member from "./Member";

export default function TopNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </div>
      <div className={styles.links}>
        <Link href="/free">
          <a className={styles.link}>
            <FontAwesomeIcon icon={faCommentDots} />
            <span className={styles.linkDesc}>자유게시판</span>
          </a>
        </Link>
        <Link href="/leaderboard">
          <a className={styles.link}>
            <FontAwesomeIcon icon={faTrophy} />
            <span className={styles.linkDesc}>랭킹</span>
          </a>
        </Link>
        <Link href="/notice">
          <a className={styles.link}>
            <FontAwesomeIcon icon={faCircleExclamation} />
            <span className={styles.linkDesc}>공지사항</span>
          </a>
        </Link>
        <Member />
      </div>
    </nav>
  );
}
