import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LanguageContext = createContext();

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
];

export const LanguageProvider = ({ children }) => {
  // useTranslation subscribes to i18next loading events and triggers
  // re-renders when translations finish loading asynchronously
  const { t, ready } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(!ready);

  useEffect(() => {
    setIsLoading(!ready);
  }, [ready]);

  useEffect(() => {
    // Get saved language from localStorage or detect browser language
    const savedLanguage = localStorage.getItem('shilpkari_language');
    const browserLanguage = navigator.language.split('-')[0];
    
    const language = savedLanguage || (languages.find(lang => lang.code === browserLanguage) ? browserLanguage : 'en');
    
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, []);

  const changeLanguage = async (languageCode) => {
    if (languageCode === currentLanguage) return;
    
    setIsLoading(true);
    
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      localStorage.setItem('shilpkari_language', languageCode);
      
      // Update document direction for RTL languages
      if (['ar', 'he', 'fa'].includes(languageCode)) {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      
      // Update document language
      document.documentElement.lang = languageCode;
      
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const getAvailableLanguages = () => {
    return languages;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    t,
    isLoading,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
