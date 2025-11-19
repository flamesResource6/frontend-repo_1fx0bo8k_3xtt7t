import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const I18nContext = createContext({ lang: 'en', setLang: () => {}, dir: 'ltr', t: {} })

const commonDict = {
  en: {
    nav: {
      searchPlaceholder: 'Search services',
      bookNow: 'Book Now',
      appointments: 'Appointments',
      payments: 'Payments',
      account: 'Account',
      lang: 'العربية'
    },
    hero: {
      title: 'DermaCare+',
      subtitle: 'Luxury cosmetic and aesthetic medicine at your fingertips. Browse services, book expert doctors, and manage your care with elegance.'
    },
    services: {
      heading: 'Popular Services',
      viewAll: 'View all',
      book: 'Book',
      priceSymbol: '$'
    },
    footer: {
      privacy: 'Privacy',
      terms: 'Terms',
      rights: 'All rights reserved.'
    }
  },
  ar: {
    nav: {
      searchPlaceholder: 'ابحث عن الخدمات',
      bookNow: 'احجز الآن',
      appointments: 'المواعيد',
      payments: 'المدفوعات',
      account: 'الحساب',
      lang: 'English'
    },
    hero: {
      title: 'DermaCare+',
      subtitle: 'عناية تجميلية وطبية فاخرة بين يديك. تصفّح الخدمات، واحجز الأطباء الخبراء، وأدر رعايتك بأناقة.'
    },
    services: {
      heading: 'الخدمات الشائعة',
      viewAll: 'عرض الكل',
      book: 'احجز',
      priceSymbol: '$'
    },
    footer: {
      privacy: 'الخصوصية',
      terms: 'الشروط',
      rights: 'جميع الحقوق محفوظة.'
    }
  }
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('dc_lang') || 'en')
  useEffect(() => { localStorage.setItem('dc_lang', lang) }, [lang])
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const t = useMemo(() => commonDict[lang], [lang])
  const value = useMemo(() => ({ lang, setLang, dir, t }), [lang, dir, t])
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
