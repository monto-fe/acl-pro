import { memo, useCallback, useContext, useMemo } from 'react';
import { Dropdown, Menu } from 'antd';
import { setLocale } from '@/utils/i18n';

import IconSvg from '@/components/IconSvg';

import { ItemType } from 'antd/lib/menu/interface';
import { I18nKey } from '@/@types/i18n.d';
import { BasicContext } from '@/store/context';

export interface SelectLangProps {
  className?: string;
}

export default memo(({ className }: SelectLangProps) => {
  const context = useContext(BasicContext) as any;
  const { i18n, updateI18n } = context.storeContext;

  const menuItems = useMemo<ItemType[]>(
    () => [
      {
        key: 'zh-CN',
        label: <> 简体中文</>,
        icon: <>🇨🇳 </>,
        disabled: i18n === 'zh-CN',
      },
      {
        key: 'zh-TW',
        label: <> 繁体中文</>,
        icon: <>🇭🇰 </>,
        disabled: i18n === 'zh-TW',
      },
      {
        key: 'en-US',
        label: <> English</>,
        icon: <>🇺🇸 </>,
        disabled: i18n === 'en-US',
      },
    ],
    [i18n],
  );

  const onMenuClick = useCallback(
    ({ key }: { key: string }) => {
      const lang = key as I18nKey;
      updateI18n(lang);
      setLocale(lang);
    },
    [i18n, updateI18n],
  );
  return (
    <Dropdown className={className} overlay={<Menu onClick={onMenuClick} items={menuItems} />}>
      <span>
        <IconSvg name='language-outline' />
      </span>
    </Dropdown>
  );
});
