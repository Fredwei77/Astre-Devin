// Cookie Consent Banner for GDPR Compliance
// Destiny AI - Cookie Management

class CookieConsent {
    constructor() {
        this.consentKey = 'destinyai_cookie_consent';
        this.consentValue = localStorage.getItem(this.consentKey);
        
        if (!this.consentValue) {
            this.showBanner();
        }
    }
    
    showBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookieConsent';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <p>
                        <strong>🍪 We value your privacy</strong><br>
                        We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
                        By clicking "Accept All", you consent to our use of cookies.
                        <a href="privacy.html" class="cookie-link">Learn more about our Privacy Policy</a>
                    </p>
                </div>
                <div class="cookie-consent-buttons">
                    <button onclick="cookieConsent.acceptAll()" class="cookie-btn cookie-btn-accept">
                        Accept All
                    </button>
                    <button onclick="cookieConsent.acceptEssential()" class="cookie-btn cookie-btn-essential">
                        Essential Only
                    </button>
                    <button onclick="cookieConsent.decline()" class="cookie-btn cookie-btn-decline">
                        Decline
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Animate in
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }
    
    hideBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }
    
    acceptAll() {
        localStorage.setItem(this.consentKey, 'all');
        this.hideBanner();
        this.enableAnalytics();
        this.showNotification('All cookies accepted. Thank you!', 'success');
    }
    
    acceptEssential() {
        localStorage.setItem(this.consentKey, 'essential');
        this.hideBanner();
        this.showNotification('Essential cookies only. You can change this anytime.', 'info');
    }
    
    decline() {
        localStorage.setItem(this.consentKey, 'declined');
        this.hideBanner();
        this.showNotification('Cookies declined. Some features may be limited.', 'info');
    }
    
    enableAnalytics() {
        // Enable Google Analytics or other tracking
        // This is where you would initialize GA4, etc.
        console.log('Analytics enabled');
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `cookie-notification cookie-notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize on page load
let cookieConsent;
document.addEventListener('DOMContentLoaded', () => {
    cookieConsent = new CookieConsent();
});
