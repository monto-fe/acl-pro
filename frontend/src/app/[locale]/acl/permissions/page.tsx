import { useTranslations } from 'next-intl';

import Layout from '@/components/Layout';

import List from './list';
import styles from './index.module.less';

export default function User() {
  const t = useTranslations('acl');

  return (
    <Layout curActive='/acl/permissions'>
      <main className={styles.roleWrap}>
        <section className={styles.content}>
          <h3>{t('permissions')}</h3>
          <List />
        </section>
      </main>
    </Layout>
  );
}
