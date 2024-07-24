import { memo, useContext, useEffect } from 'react';

import { setHtmlLang } from '@/utils/i18n';
import Routes from '@/config/routes';
import { BasicContext } from '@/store/context';

export default memo(() => {
  const context = useContext(BasicContext) as any;
  const { i18nLocale } = context.storeContext;

  useEffect(() => {
    setHtmlLang(i18nLocale);
  }, []);

  return (
    <Routes />
  );
});
