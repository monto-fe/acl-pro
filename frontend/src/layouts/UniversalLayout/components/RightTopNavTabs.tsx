import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { BasicContext } from '@/store/context';
import { observer } from 'mobx-react-lite';
import { IRouter } from '@/@types/router';
import { useI18n } from '@/store/i18n';
import { useNavigate } from 'react-router-dom';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface RightTopNavTabsItem {
  label: string;
  key: string;
  closable?: boolean;
}

interface RightTopNavTabsProps {
  currentRouter: IRouter;
}

export default memo(observer((props: RightTopNavTabsProps) => {
  const { currentRouter } = props;
  const navigate = useNavigate();

  const storeContext = (useContext(BasicContext) as any).storeContext;
  const { globalConfig, i18nLocale } = storeContext;
  const t = useI18n(i18nLocale);

  const items = globalConfig.headTabNavList as RightTopNavTabsItem[];
  const [activeKey, setActiveKey] = useState(items.length ? items[0].key : void 0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    navigate(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    storeContext.updateGlobalConfig({ ...globalConfig, headTabNavList: newPanes });

    setActiveKey(newActiveKey);

  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    remove(targetKey);
  };

  useEffect(() => {
    setActiveKey(currentRouter.path);

    if (!items.length) {
      storeContext.updateGlobalConfig({ ...globalConfig, headTabNavList: [{ label: t(currentRouter.meta?.title || ''), key: currentRouter.path, closable: false }] });
      return;
    }
    if (items.find(item => item.key === currentRouter.path)) {
      return;
    }

    // 新增一个，并点亮
    storeContext.updateGlobalConfig({ ...globalConfig, headTabNavList: [...globalConfig.headTabNavList, { label: t(currentRouter.meta?.title || ''), key: currentRouter.path }] });
  }, [currentRouter]);

  return (
    <Tabs
      size="small"
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
      hideAdd
    />
  );
}));