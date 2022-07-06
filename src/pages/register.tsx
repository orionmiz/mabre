import {
  faCheckCircle,
  faChevronRight,
  faEllipsis,
  faUserPen,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";
import Layout from "~/components/Layout";
import PrivacyPolicy from "~/components/rules/PrivacyPolicy";
import TermsOfService from "~/components/rules/TermsOfService";
import Spinner from "~/components/util/Spinner";
import { OAuthError } from "~/lib/oauth";
import styles from "./register.module.scss";

export default function Auth() {
  const router = useRouter();

  const [checked, setChecked] = useState({
    terms: false,
    privacy: false,
  });

  const [stage, setStage] = useState(1);

  const [name, setName] = useState<string>();

  const [error, setError] = useState<OAuthError>(0);

  const toggle: ChangeEventHandler<HTMLInputElement> = (e) => {
    const name = e.target.id as keyof typeof checked;
    setChecked({ ...checked, [name]: !checked[name] });
  };

  const moveStage = async () => {
    setStage(stage + 1);

    // post with body and take result (~3s)
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: router.query.code,
        redirect: router.query.redirect,
      }),
    });

    if (!res.ok) {
      setError((await res.json()).error);
      return;
    }

    setName(await res.text());
  };

  return (
    <Layout>
      <div className={styles.container}>
        {stage === 1 ? (
          <>
            <h1>
              <FontAwesomeIcon icon={faUserPen} /> 마브레 커뮤니티 가입
            </h1>
            <div className={styles.rule}>
              <TermsOfService />
            </div>
            <h4>
              <label>
                <input
                  type="checkbox"
                  id="terms"
                  checked={checked.terms}
                  onChange={toggle}
                />
                마브레의{" "}
                <Link href="/terms-of-service">
                  <a target="_blank">서비스 이용약관</a>
                </Link>
                에 동의합니다.
              </label>
            </h4>
            <div className={styles.rule}>
              <PrivacyPolicy />
            </div>
            <h4>
              <label>
                <input
                  type="checkbox"
                  id="privacy"
                  checked={checked.privacy}
                  onChange={toggle}
                />
                마브레의{" "}
                <Link href="/privacy-policy">
                  <a target="_blank">개인정보 처리방침</a>
                </Link>
                에 동의합니다.
              </label>
            </h4>

            <button
              onClick={moveStage}
              disabled={!(checked.privacy && checked.terms)}
              className={styles.next}
            >
              다음 단계로 <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        ) : (
          <>
            <h2>가입을 위한 필수 요구 조건을 확인합니다.</h2>
            <ol>
              <li>
                Xbox Live 프로필 보유 (https://xboxlive.com 로그인 후 생성)
                {!name && !error ? (
                  <Spinner />
                ) : name || error > OAuthError.XSTS ? (
                  <FontAwesomeIcon icon={faCheckCircle} color="lime" />
                ) : (
                  <FontAwesomeIcon icon={faXmarkCircle} color="red" />
                )}
              </li>
              <li>
                마인크래프트 자바 에디션 게임을 보유
                {!name && !error ? (
                  <Spinner />
                ) : name ? (
                  <FontAwesomeIcon icon={faCheckCircle} color="lime" />
                ) : error < OAuthError.MC_ACCESS ? (
                  <FontAwesomeIcon icon={faXmarkCircle} color="red" />
                ) : (
                  <FontAwesomeIcon icon={faEllipsis} color="gray" />
                )}
              </li>
            </ol>
            <h2>마인크래프트 닉네임: {name ?? "Loading..."}</h2>
            {name !== undefined && (
              <>
                <p>가입이 완료되었습니다.</p>
                <Link href="/">
                  <a>계속하기</a>
                </Link>
              </>
            )}
          </>
        )}

        <style jsx>{`
          a {
            color: darkblue;
          }
          label {
            user-select: none;
          }
        `}</style>
      </div>
    </Layout>
  );
}
