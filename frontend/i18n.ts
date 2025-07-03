import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Determine if we're in a development environment for debugging and specific loading paths.
const isDevelopment = process.env.NODE_ENV === 'development';

// Define a minimal set of fallback resources for critical common phrases.
// This ensures that even if a full translation file fails to load,
// essential UI elements still display something readable.
const fallbackResources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        appLoading: 'Loading application... Please wait.',
        error: 'Error',
      },
      auth: {
        login: 'Login',
        register: 'Register',
      },
      errors: {
        somethingWentWrong: 'Something went wrong, please try again',
      },
    },
  },
};

// In development, we can explicitly set these initial resources.
// In production, i18next-http-backend will fetch them.
const initialResources = isDevelopment ? {
  en: {
    translation: fallbackResources.en.translation,
  },
} : undefined;

const i18nInstance = i18n
  .use(Backend) // Allows loading translations from a server
  .use(LanguageDetector) // Automatically detects user language preferences
  .use(initReactI18next); // Integrates i18next with React

i18nInstance.init({
  fallbackLng: 'en', // If a translation for a specific language is missing, default to English.
  debug: isDevelopment, // Enable debug mode in development for helpful console logs.
  load: 'languageOnly', // Only load the language code (e.g., 'en', 'am') without region codes.
  supportedLngs: ['en', 'es', 'el', 'jp', 'ua', 'de', 'am'], // Explicitly declare all supported languages, including Amharic.
  nonExplicitSupportedLngs: true, // Allow for language variants (e.g., 'en-US' will fall back to 'en').
  resources: initialResources, // Provide initial resources, especially useful for faster startup in dev.
  detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator'], // Order of language detection.
    lookupQuerystring: 'lng', // URL query parameter to specify language.
    lookupCookie: 'i18next', // Cookie name for language preference.
    lookupLocalStorage: 'i18nextLng', // LocalStorage key for language preference.
    caches: ['localStorage', 'cookie'] // Where to cache detected language.
  },
  interpolation: {
    escapeValue: false, // React already escapes values, so we don't need i18next to do it.
  },
  defaultNS: 'translation', // Default namespace for translations.
  ns: ['translation'], // Namespaces to load.
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to load translation files.
    queryStringParams: { v: '1' }, // Cache busting parameter for translation files.
    requestOptions: {
      cache: 'default', // Standard caching behavior.
      credentials: 'same-origin', // Send cookies/auth headers for same-origin requests.
      mode: 'cors' // Allow cross-origin requests for translation files if needed.
    }
  },
})
.then(() => {
  // After initialization, attempt to load the current language's main translation file.
  // This helps ensure the primary namespace is loaded promptly.
  const currentLang = i18n.language;
  const loadPath = isDevelopment ? `./locales/${currentLang}/translation.json` : `/locales/${currentLang}/translation.json`;
  
  fetch(loadPath)
    .then(response => {
      // If the specific path fails in development, try the root path as a fallback.
      if (!response.ok && isDevelopment) {
        return fetch(`/locales/${currentLang}/translation.json`);
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch translation for ${currentLang}: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Add the fetched translation bundle to i18next.
      i18n.addResourceBundle(currentLang, 'translation', data, true, true);
    })
    .catch((error) => {
      // Log errors gracefully, especially in development.
      console.error(`Failed to load initial translation for ${currentLang}:`, error);
      // In development, a delayed retry can sometimes help with hot-reloading issues.
      if (isDevelopment) {
        setTimeout(() => {
          fetch(`/locales/${currentLang}/translation.json`, {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
          })
            .then(res => res.json())
            .then(data => {
              if (data) i18n.addResourceBundle(currentLang, 'translation', data, true, true);
            })
            .catch(() => { /* Swallowing error on retry as it's a fallback */ });
        }, 1000);
      }
    });
});

// Event listeners for i18next lifecycle events.
// These can be very useful for debugging or integrating with other parts of your app.
i18n.on('initialized', () => console.log('i18n initialized!'));
i18n.on('loaded', () => console.log('Translations loaded!'));
i18n.on('failedLoading', (lng, ns, msg) => console.warn(`Failed to load: ${lng}, ${ns}, ${msg}`));
i18n.on('missingKey', (lng, ns, key, res) => console.warn(`Missing translation key: ${key} in ${lng}:${ns}. Result: ${res}`));

// Helper function to dispatch a custom event when the language changes.
// This allows other parts of your application to react to language changes.
const dispatchLanguageChangeEvent = (lng: string) => {
  const event = new CustomEvent('app-language-changed', { detail: { language: lng } });
  window.dispatchEvent(event);
};

// Listen for language changes and handle resource loading and event dispatching.
i18n.on('languageChanged', (lng) => {
  console.log(`Language changed to: ${lng}`);
  localStorage.setItem('i18nextLng', lng); // Persist the selected language.
  document.documentElement.lang = lng; // Update the HTML lang attribute for accessibility.
  
  // Define a function to execute once translations are confirmed loaded or attempted.
  const handleTranslationsReady = () => {
    dispatchLanguageChangeEvent(lng);
    // Ensure resources for the new language are reloaded/available.
    i18n.reloadResources(lng, i18n.options.defaultNS || 'translation');
  };
  
  // If the new language's bundle isn't already loaded, try fetching it.
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    const loadPath = isDevelopment 
      ? `./locales/${lng}/translation.json` 
      : `/locales/${lng}/translation.json`;
    
    fetch(loadPath)
      .then(response => {
        // Fallback to root path in development if specific path fails.
        if (!response.ok && isDevelopment) {
          return fetch(`/locales/${lng}/translation.json`);
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch translation for ${lng}: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          i18n.addResourceBundle(lng, 'translation', data, true, true);
        }
        handleTranslationsReady(); // Translations fetched, now ready.
      })
      .catch((error) => {
        console.error(`Error loading language bundle for ${lng}:`, error);
        handleTranslationsReady(); // Proceed even if there's an error, using fallbacks.
      });
  } else {
    handleTranslationsReady(); // Bundle already exists, no need to fetch.
  }
});

// Extend the Window interface to add global helper functions for development and testing.
declare global {
  interface WindowEventMap {
    'app-language-changed': CustomEvent<{ language: string }>;
  }
  
  interface Window {
    checkTranslation: (key: string) => string | null; // Returns translation or null if not found.
    forceLanguageReload: (lng?: string) => void; // Forces a reload of translation resources.
  }
}

// Global utility to check a translation key, useful for debugging in the browser console.
window.checkTranslation = (key: string) => {
  try {
    const translation = i18n.t(key);
    // Return null if the translation is the key itself (meaning it wasn't found).
    return translation === key ? null : translation;
  } catch (e) {
    console.error(`Error checking translation for key "${key}":`, e);
    return null;
  }
};

// Global utility to force a language reload, helpful for development or recovery.
window.forceLanguageReload = (lng?: string) => {
  const targetLng = lng || i18n.language;
  console.log(`Forcing language reload for: ${targetLng}`);
  
  i18n.reloadResources(targetLng, 'translation')
    .then(() => {
      dispatchLanguageChangeEvent(targetLng);
      // A small trick to ensure React components re-render with fresh translations,
      // as sometimes i18next's internal store might need a nudge.
      if (i18n.services && i18n.services.resourceStore) {
        Object.values(i18n.services.resourceStore.data).forEach(lang => {
          if (lang.translation && typeof lang.translation === 'object' && lang.translation !== null) {
            lang.translation = { ...lang.translation as Record<string, unknown> };
          }
        });
      }
      
      // If a specific language was requested, change to it after reload.
      if (lng) {
        setTimeout(() => {
          i18n.changeLanguage(targetLng);
        }, 50); // Small delay to ensure resources are ready.
      }
    })
    .catch((error) => {
      console.error(`Failed to force language reload for ${targetLng}:`, error);
    });
};

export default i18n;