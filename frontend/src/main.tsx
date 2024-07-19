import ReactDOM from 'react-dom/client';
import { BrowserRouter /* , HashRouter */ } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// Register icon sprite
import 'virtual:svg-icons-register';
// 全局css
import '@/assets/css/index.less';
// App
import App from '@/App';
import { BasicContext } from '@/store/context';
import { observerRoot } from '@/store';
import { getAntdI18nMessage, i18nLocaleDefault } from '@/store/i18n';

const antdMessage = getAntdI18nMessage(i18nLocaleDefault);
const ObserveredApp = observer(() => <App />);

dayjs.locale(i18nLocaleDefault.toLocaleLowerCase());

// 挂载
ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <BrowserRouter>
    <BasicContext.Provider value={{ storeContext: observerRoot }}>
      <ConfigProvider locale={antdMessage}>
        <ObserveredApp />
      </ConfigProvider>
    </BasicContext.Provider>
  </BrowserRouter>
);
