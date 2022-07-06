import Layout from "~/components/Layout";
import TermsOfService from "~/components/rules/TermsOfService";
import styles from "./terms-of-service.module.scss";

export default function TermsOfServicePage() {
  return (
    <Layout>
      <div className={styles.container}>
        <TermsOfService />
      </div>
    </Layout>
  );
}
