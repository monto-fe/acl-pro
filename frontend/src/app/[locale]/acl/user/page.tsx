import { useTranslations } from 'next-intl';

import Layout from '@/components/Layout';

import List from './list';
import styles from './index.module.less';

export default function User() {
  const t = useTranslations('acl');

  return (
    <Layout curActive='/acl/user'>
      <main className={styles.userWrap}>
        <section className={styles.content}>
          <h3>{t('userList')}</h3>
          <List />
        </section>
      </main>
    </Layout>
  );
}
