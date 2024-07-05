import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import styles from './page.module.css';

dayjs.extend(relativeTime);

export default function Home() {
  const t = useTranslations('index');
  return (
    <main className={styles.home}>
      欢迎使用 Monto ACL 中后台管理系统
      <a href="/acl/user">user</a>
    </main>
  );
}
