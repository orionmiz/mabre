import Link from "next/link";
import Layout from "~/components/Layout";
import { host } from "~/lib/constants";
import styles from "./terms-of-service.module.scss";

export default function TermsOfService() {
  return (
    <Layout>
      <div className={styles.container}>
        <h1>서비스 이용약관</h1>
        <h2>1. 조건</h2>
        <p>
          <Link href="/">
            <a>마브레 커뮤니티({host})</a>
          </Link>
          에 접근함으로써, 귀하는 본 서비스 약관, 모든 관련 법률 및 규정을
          준수하기로 동의하며, 해당 지역 법률을 준수할 책임이 있다는 데
          동의합니다. 이러한 조건에 동의하지 않으면 이 사이트를 사용하거나
          액세스할 수 없습니다. 이 웹 사이트에 포함된 자료는 해당 저작권 및
          상표법에 의해 보호됩니다.
        </p>
        <h2>2. 라이선스 사용</h2>
        <ol>
          <li>
            마브레의 웹사이트에서 자료(정보 또는 소프트웨어)를 일부 다운로드하여
            개인적이고 비상업적인 임시 열람만을 할 수 있습니다. 이는 라이선스의
            부여이며, 권리의 양도가 아닙니다. 이 라이선스에 따라 다음 작업을
            수행할 수 없습니다.
          </li>
          <ol>
            <li>자료를 수정 또는 복사한다.</li>
            <li>상업적 목적 또는 공공 전시를 위해 재료를 사용한다.</li>
            <li>
              마브레 웹사이트에 포함된 소프트웨어의 디컴파일 또는 리버스
              엔지니어링을 시도한다.
            </li>
            <li>자료에서 저작권 또는 기타 소유권 표시를 삭제한다.</li>
            <li>
              다른 사람에게 자료를 전송하거나 다른 서버의 자료를 {"미러링"}한다.
            </li>
          </ol>
          <br />
          <li>
            본 라이선스는 사용자가 이러한 제한 중 하나를 위반할 경우 자동으로
            종료되며 언제든지 마브레에 의해 종료될 수 있습니다.이러한 자료의
            열람을 종료하거나 본 라이선스의 종료와 동시에, 전자 형식 또는 인쇄
            형식의 다운로드 자료를 파기해야 합니다.
          </li>
        </ol>
        <h2>3. 면책사항</h2>
        <ol>
          <li>
            마브레 웹사이트의 자료는 {"있는 그대로"} 제공됩니다. 마브레는
            명시적이든 묵시적이든 어떠한 보증도 하지 않으며, 이에 한정되지 않고
            묵시적인 상품성 보증 또는 조건, 특정 목적에 대한 적합성, 지적 재산에
            대한 비침해 또는 기타 권리 침해를 포함한 기타 모든 보증을 하지
            않습니다.
          </li>
          <li>
            또한 마브레는 웹 사이트 또는 기타 관련 자료 또는 본 사이트에 링크된
            사이트의 자료 사용의 정확성, 예상되는 결과 또는 신뢰성에 대해
            보증하거나 표명하지 않습니다.
          </li>
        </ol>
        <h2>4. 제한사항</h2>
        <p>
          어떠한 경우에도 마브레 또는 그 공급자는 마브레의 웹사이트에 있는
          자료의 사용 또는 사용 불능으로 인해 발생하는 손해(데이터 또는 이익의
          손실 또는 업무 중단에 의한 손해 포함)에 대해 책임을 지지 않습니다.
          그런 손해에 대해서는 마브레 또는 수권 대리인이 통지 또는 서면으로
          가능성을 인정받았더라도 마찬가지입니다. 일부 국가에서는 묵시적 보증에
          대한 제한 또는 결과적 또는 우발적 손해에 대한 책임 제한을 허용하지
          않으므로 이러한 제한 사항이 적용되지 않을 수 있습니다.
        </p>
        <h2>5. 자료의 정확성</h2>
        <p>
          마브레의 웹사이트에 나타나는 자료에는 기술적 오류, 인쇄적 오류 또는
          사진적 오류가 포함될 수 있습니다. 마브레는 웹 사이트의 모든 자료가
          정확하거나 완전하거나 최신임을 보증하지 않습니다. 마브레는 예고 없이
          언제든지 웹사이트에 포함된 자료를 변경할 수 있습니다. 하지만 마브레는
          자료를 업데이트하기 위한 어떠한 약속도 하지 않습니다.
        </p>
        <h2>6. 링크</h2>
        <p>
          마브레는 웹사이트에 링크된 모든 사이트를 검토하지 않았으며 링크된
          사이트의 콘텐츠에 대한 책임을 지지 않습니다. 링크를 포함한다고 해서
          마브레가 사이트를 승인하는 것은 아닙니다. 이러한 링크된 웹 사이트의
          이용은 사용자의 책임입니다.
        </p>
        <h2>7. 변경</h2>
        <p>
          마브레는 예고 없이 언제든지 웹사이트에 대해 본 서비스 약관을 개정할 수
          있습니다. 이 웹사이트를 이용하는 것은 당시 서비스 약관의 최신 버전에
          구속되는 것에 동의하는 것입니다.
        </p>
        <h2>8. 국가</h2>
        <p>이 약관은 대한민국 법률에 의해 관리되고 해석됩니다.</p>
        <h2>9. 기타</h2>
        <p>
          본 약관의 조항 중 하나가 적용법 하에서 무효라고 판단될 경우, 해당
          조항은 해당 조항이 유효하고 집행 가능하게 하기 위해 필요한 최소한의
          범위 내에서 개정되어야 합니다.
        </p>
        <p>
          이러한 계약 조건 또는 웹 사이트 사용에 따라 귀하와 마브레 사이에
          대리점, 파트너십 또는 기타 기업과의 아무런 관계가 형성되지 않습니다.
        </p>
        <style jsx>{`
          li:not(:last-child) {
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    </Layout>
  );
}
