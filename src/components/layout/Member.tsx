import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { faSignOut, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useProfile from "~/hooks/useProfile";
import Failure from "../util/Failure";
import Spinner from "../util/Spinner";
import styles from "./Member.module.scss";

export default function Member() {
  const [opened, setOpened] = useState(false);

  const [authURL, setAuthURL] = useState("");

  const { profile, isLoading, isError, mutate } = useProfile();

  useEffect(() => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_MS_CLIENT_ID as string,
      response_type: "code",
      redirect_uri: `${location.origin}/api/auth?redirect=${location.pathname}${location.search}`,
      scope: "Xboxlive.signin Xboxlive.offline_access",
    });

    setAuthURL(
      `https://login.live.com/oauth20_authorize.srf?${params.toString()}`
    );
  }, []);

  useEffect(() => {
    // setOpened(false) when the outside area from the dropdown(#member) is clicked
    const handleClick = (e: MouseEvent) => {
      if (opened) {
        const target = e.target as HTMLElement;
        if (!target.closest("#member")) {
          setOpened(false);
        }
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  });

  if (isLoading || !profile) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <Failure />
      </div>
    );
  }

  const signOut = async () => {
    await fetch("/api/signout");
    await mutate();
  };

  return (
    <div className={styles.container} id="member">
      <div className={styles.icon} onClick={() => setOpened(!opened)}>
        <FontAwesomeIcon
          icon={faUserAlt}
          color={opened ? "skyblue" : "white"}
        />
      </div>
      <div
        className={styles.dropdown}
        style={{
          visibility: opened ? "visible" : "hidden",
          opacity: opened ? 1 : 0,
        }}
      >
        {profile.guest ? (
          <a className={styles.dropdownItem} href={authURL}>
            <FontAwesomeIcon icon={faMicrosoft} color="cornflowerblue" />
            <span>Microsoft로 로그인</span>
          </a>
        ) : (
          <>
            <div className={styles.name}>{profile.name}</div>
            <div onClick={signOut}>
              <FontAwesomeIcon icon={faSignOut} />
              로그아웃
            </div>
          </>
        )}
      </div>
    </div>
  );
}
