import { Card } from 'antd';
import { useI18n } from '@/store/i18n';
import { BasicContext } from '@/store/context';
import { useContext } from 'react';

function App() {
  const context = useContext(BasicContext) as any;
  const { i18nLocale } = context.storeContext;
  const t = useI18n(i18nLocale);
  
  return (
    <div className='layout-main-conent'>
      <Card>
        <span style={{ fontSize: '35px', color: '#FF0000' }}>↑</span>
        {t('page.custom-breadcrumbs.msg')}
      </Card>
    </div>
  );
}

export default App;
