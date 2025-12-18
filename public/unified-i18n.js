// Unified I18n System for Destiny AI
// Centralized translation management with efficient DOM updates
// Author: Destiny AI Team
// Version: 1.0.0

(function () {
    'use strict';

    const STORAGE_KEY = 'destinyai_language';
    const DEFAULT_LANG = 'en';

    class UnifiedI18n {
        constructor() {
            this.currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

            // CRITICAL FIX: Sync preferredLanguage with destinyai_language on init
            // This ensures AI services always have the correct language
            const preferredLang = localStorage.getItem('preferredLanguage');
            if (!preferredLang || preferredLang !== this.currentLang) {
                localStorage.setItem('preferredLanguage', this.currentLang);
                console.log('[UnifiedI18n] Synced preferredLanguage to:', this.currentLang);
            }

            this.translations = {};
            this.observers = [];
            this.initialized = false;
        }

        /**
         * Load translation dictionary
         * @param {Object} translations - Translation object with language keys
         */
        loadTranslations(translations) {
            this.translations = translations;
            console.log('[UnifiedI18n] Loaded translations for languages:', Object.keys(translations));
        }

        /**
         * Get translated text for a key
         * @param {string} key - Translation key (e.g., 'nav.home')
         * @param {string} lang - Optional language override
         * @returns {string} Translated text or key if not found
         */
        t(key, lang = null) {
            const targetLang = lang || this.currentLang;
            const translation = this.translations[targetLang]?.[key];

            if (!translation) {
                console.warn(`[UnifiedI18n] Missing translation for key: ${key} in language: ${targetLang}`);
                return key;
            }

            return translation;
        }

        /**
         * Set current language
         * @param {string} lang - Language code (en, zh-CN, zh-TW)
         */
        setLanguage(lang) {
            if (this.currentLang === lang) {
                console.log('[UnifiedI18n] Language already set to:', lang);
                return;
            }

            console.log('[UnifiedI18n] Switching language from', this.currentLang, 'to', lang);

            this.currentLang = lang;
            localStorage.setItem(STORAGE_KEY, lang);

            // CRITICAL FIX: Also update preferredLanguage for AI services
            // AI services (divination, fengshui, iching) use 'preferredLanguage' key
            localStorage.setItem('preferredLanguage', lang);
            console.log('[UnifiedI18n] Updated preferredLanguage to:', lang);

            document.documentElement.lang = this.getLangCode(lang);

            this.updatePage();
            this.notifyObservers(lang);
        }

        /**
         * Get HTML lang attribute value
         * @param {string} lang - Language code
         * @returns {string} HTML lang code
         */
        getLangCode(lang) {
            const codes = {
                'en': 'en',
                'zh-CN': 'zh-Hans',
                'zh-TW': 'zh-Hant',
                'es': 'es'
            };
            return codes[lang] || 'en';
        }

        /**
         * Update all translatable elements on the page
         */
        updatePage() {
            console.log('[UnifiedI18n] Updating page translations...');
            let updateCount = 0;

            // 1. Update elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = this.t(key);

                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = text;
                } else if (el.tagName === 'TEXTAREA' && el.hasAttribute('placeholder')) {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
                updateCount++;
            });

            // 2. Update elements with data-i18n-placeholder attribute
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                el.placeholder = this.t(key);
                updateCount++;
            });

            // 3. Update elements with data-i18n-title attribute
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                el.title = this.t(key);
                updateCount++;
            });

            // 4. Update elements with data-i18n-html attribute (supports HTML content)
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                el.innerHTML = this.t(key);
                updateCount++;
            });

            // 5. Update select options with data-i18n-options
            document.querySelectorAll('select[data-i18n-options]').forEach(select => {
                const prefix = select.getAttribute('data-i18n-options');
                select.querySelectorAll('option').forEach(option => {
                    const key = option.getAttribute('data-i18n-key');
                    if (key) {
                        option.textContent = this.t(`${prefix}.${key}`);
                        updateCount++;
                    }
                });
            });

            console.log(`[UnifiedI18n] Updated ${updateCount} elements`);
        }

        /**
         * Add observer for language changes
         * @param {Function} callback - Callback function to execute on language change
         */
        addObserver(callback) {
            this.observers.push(callback);
        }

        /**
         * Notify all observers of language change
         * @param {string} lang - New language code
         */
        notifyObservers(lang) {
            console.log('[UnifiedI18n] Notifying', this.observers.length, 'observers');

            this.observers.forEach(callback => {
                try {
                    callback(lang);
                } catch (error) {
                    console.error('[UnifiedI18n] Observer callback error:', error);
                }
            });

            // Dispatch custom event for compatibility
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: lang }
            }));
        }

        /**
         * Get current language
         * @returns {string} Current language code
         */
        getCurrentLanguage() {
            return this.currentLang;
        }

        /**
         * Initialize the i18n system
         */
        init() {
            if (this.initialized) {
                console.warn('[UnifiedI18n] Already initialized');
                return;
            }

            console.log('[UnifiedI18n] Initializing...');

            // Setup language selector
            const selector = document.getElementById('languageSelect');
            if (selector) {
                selector.value = this.currentLang;
                selector.addEventListener('change', (e) => {
                    this.setLanguage(e.target.value);
                });
                console.log('[UnifiedI18n] Language selector initialized');
            } else {
                console.warn('[UnifiedI18n] Language selector not found');
            }

            // Apply current language translations
            this.updatePage();

            this.initialized = true;
            console.log('[UnifiedI18n] Initialization complete. Current language:', this.currentLang);
        }
    }

    // Create global instance
    window.i18n = new UnifiedI18n();

    // Load translations from translations.js if available
    if (typeof TRANSLATIONS !== 'undefined') {
        window.i18n.loadTranslations(TRANSLATIONS);
        console.log('[UnifiedI18n] Translations loaded from translations.js');
    } else {
        console.warn('[UnifiedI18n] TRANSLATIONS object not found. Make sure translations.js is loaded before unified-i18n.js');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.i18n.init();
        });
    } else {
        // DOM already loaded, initialize after a short delay to ensure all scripts are loaded
        setTimeout(() => {
            window.i18n.init();
        }, 100);
    }

    console.log('[UnifiedI18n] Script loaded');
})();
