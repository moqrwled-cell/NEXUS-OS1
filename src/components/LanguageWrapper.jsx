import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const languages = [
  { code: 'en', name: 'English', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'ar', name: 'العربية', fontBody: 'font-["Almarai"]', fontHeading: 'font-["Almarai"]', dir: 'rtl' },
  { code: 'es', name: 'Español', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'fr', name: 'Français', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'tr', name: 'Türkçe', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'ja', name: '日本語', fontBody: 'font-["Noto_Sans_JP"]', fontHeading: 'font-["Noto_Sans_JP"]' },
  { code: 'zh', name: '中文', fontBody: 'font-["Noto_Sans_SC"]', fontHeading: 'font-["Noto_Sans_SC"]' },
];

export default function LanguageWrapper({ children }) {
  const { i18n } = useTranslation();
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
  const isRtl = currentLang.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.className = `${currentLang.fontBody} ${isRtl ? 'rtl' : 'ltr'}`;
  }, [isRtl, currentLang]);

  // We pass the current language settings down via context or just let the body classes handle it.
  // By setting the class on documentElement, Tailwind will apply the fonts globally!
  return <>{children}</>;
}
