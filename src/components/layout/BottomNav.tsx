import Logo from "./LogoRaw";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import styles from "./BottomNav.module.scss";
import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      <section className={styles.copyright}>
        <div>
          <Logo />
        </div>
        <div className={styles.copyrightLg}>
          Copyright © 2022 Mabre. All rights reserved.
        </div>
        <div className={styles.copyrightSm}>© 2022</div>
      </section>
      <section className={styles.icons}>
        <FontAwesomeIcon icon={faFacebook} />
        <FontAwesomeIcon icon={faTwitter} />
        <FontAwesomeIcon icon={faDiscord} />
      </section>
      <section className={styles.legal}>
        <Link href="/terms-of-service">
          <a>
            <div>이용약관</div>
          </a>
        </Link>
        <Link href="/privacy-policy">
          <a>
            <div>개인정보 처리방침</div>
          </a>
        </Link>
      </section>
    </nav>
  );
}
