/**
 * Footer Component
 * Synchronizes footer across Personal Profile and Payment pages
 */
document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('global-footer');
    if (footerContainer) {
        footerContainer.innerHTML = `
        <footer class="py-12 bg-deep-space border-t border-moon-silver/10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <div class="flex justify-center space-x-6 mb-6 flex-wrap">
                        <a href="privacy.html" class="text-moon-silver hover:text-mystic-gold transition-colors text-sm" data-i18n="footer.privacy">Privacy Policy</a>
                        <a href="support.html" class="text-moon-silver hover:text-mystic-gold transition-colors text-sm" data-i18n="footer.support">Support</a>
                        <a href="about.html" class="text-moon-silver hover:text-mystic-gold transition-colors text-sm" data-i18n="nav.about">About Us</a>
                    </div>
                    <p class="text-moon-silver mb-6 max-w-2xl mx-auto" data-i18n="footer.description">
                        Empowering lives through ancient wisdom and modern technology.
                    </p>
                    <div class="flex justify-center space-x-6 mb-8">
                        <a href="#" class="text-moon-silver hover:text-mystic-gold transition-colors">
                            <span class="sr-only">Twitter</span>
                            <i class="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" class="text-moon-silver hover:text-mystic-gold transition-colors">
                            <span class="sr-only">GitHub</span>
                            <i class="fab fa-github text-xl"></i>
                        </a>
                    </div>
                    <p class="text-moon-silver/60 text-sm" data-i18n="footer.copyright">
                        © 2024 Astre Devin. All rights reserved. Empowering lives through ancient wisdom and modern
                        technology.
                    </p>
                </div>
            </div>
        </footer>`;

        // Trigger translation update if available
        if (window.i18n && typeof window.i18n.updatePageTranslations === 'function') {
            window.i18n.updatePageTranslations();
        } else if (window.translations && window.updatePageTranslations) {
            // Fallback for older translation systems if present
            window.updatePageTranslations();
        }
    }
});
