import Layout from "~/components/Layout";
import PrivacyPolicy from "~/components/rules/PrivacyPolicy";
import styles from "./privacy-policy.module.scss";

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className={styles.container}>
        <PrivacyPolicy />
      </div>
    </Layout>
  );
}
