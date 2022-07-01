import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";
import Layout from "~/components/Layout";
import styles from "./register.module.scss";

export default function Auth() {
  const router = useRouter();

  const [checked, setChecked] = useState({
    terms: false,
    privacy: false,
  });

  const [stage, setStage] = useState(1);

  const [name, setName] = useState("Loading...");

  const [success, setSuccess] = useState(false);

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
      setName("닉네임을 불러오는 도중 에러가 발생했습니다.");
      return;
    }

    setName(await res.text());
    setSuccess(true);
  };

  return (
    <Layout>
      <div className={styles.container}>
        {stage === 1 ? (
          <>
            <h1>Auth</h1>
            <h2>{router.query.code}</h2>
            <h2>{router.query.redirect}</h2>
            <div>
              <input
                type="checkbox"
                id="terms"
                checked={checked.terms}
                onChange={toggle}
              />
              <label htmlFor="terms">
                마브레의{" "}
                <Link href="/terms-of-service">
                  <a target="_blank">서비스 이용약관</a>
                </Link>
                에 동의합니다.
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="privacy"
                checked={checked.privacy}
                onChange={toggle}
              />
              <label htmlFor="privacy">
                마브레의{" "}
                <Link href="/privacy-policy">
                  <a target="_blank">개인정보 처리방침</a>
                </Link>
                에 동의합니다.
              </label>
            </div>
            <button
              onClick={moveStage}
              disabled={!(checked.privacy && checked.terms)}
            >
              다음 단계
            </button>
          </>
        ) : (
          <>
            <h2>마인크래프트 닉네임: {name}</h2>
            <p>{success && "가입이 완료되었습니다."}</p>
            {success && (
              <Link href="/">
                <a>계속하기</a>
              </Link>
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
