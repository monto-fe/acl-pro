import { NextIntlClientProvider, useMessages } from 'next-intl';

interface Props {
  children: React.ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();

  return <NextIntlClientProvider locale={locale} messages={messages}>
    {children}
  </NextIntlClientProvider>
}