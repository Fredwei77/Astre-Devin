/**
 * Support AI Service Logic
 * Handles 24/7 AI Customer Service, Complaint Mechanism, and Compensation.
 */

class SupportAI {
    constructor() {
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.languageSelect = document.getElementById('languageSelect');
        this.quickReplies = document.querySelectorAll('.quick-reply');

        this.init();
    }

    init() {
        // Initialize i18n
        if (window.i18n) {
            window.i18n.init();
        }

        // Event Listeners
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });

        this.quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.reply;
                const text = btn.innerText;
                this.addMessage(text, 'user');
                this.processChat(type || text);
            });
        });

        // Initial AI Message
        setTimeout(() => {
            this.addMessage(i18n.t('support.ai_greeting') || "Greetings. I am the Oracle Assistant. How may I help you with your journey today?", 'ai');
        }, 500);
    }

    addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message-bubble ${sender === 'ai' ? 'message-ai' : 'message-user'}`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <p>${text}</p>
            <p class="text-[10px] mt-1 opacity-50">${time}</p>
        `;

        this.chatMessages.appendChild(div);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTyping() {
        const div = document.createElement('div');
        div.className = 'message-bubble message-ai typing-indicator';
        div.innerHTML = `
            <div class="flex space-x-1">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        this.chatMessages.appendChild(div);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        return div;
    }

    handleSendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.chatInput.value = '';
        this.processChat(text);
    }

    async processChat(input) {
        const typing = this.showTyping();

        // Simulate local AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        typing.remove();

        const lowercaseInput = input.toLowerCase();

        // Complaint Logic (Misleading/Engañoso/误导)
        if (lowercaseInput.includes('complaint') ||
            lowercaseInput.includes('misleading') ||
            lowercaseInput.includes('误导') ||
            lowercaseInput.includes(' engaño') ||
            lowercaseInput.includes('reclamación') ||
            input === 'complaint') {

            const slaMsg = i18n.t('support.sla');
            const compensationDesc = i18n.t('support.compensation_desc');
            const compensationTitle = i18n.t('support.compensation_title');

            this.addMessage(`
                <div class="space-y-3">
                    <p class="font-bold text-mystic-gold"><i class="fas fa-shield-check mr-2"></i>${compensationTitle}</p>
                    <p>${slaMsg}</p>
                    <p>${compensationDesc}</p>
                    <div class="mt-4 p-3 bg-white/10 rounded-lg border border-mystic-gold/30">
                        <p class="text-xs mb-2">🎁 Your Exclusive Gift:</p>
                        <a href="#" onclick="alert('Downloading Feng Shui Mastery E-Book (PDF)...'); return false;" class="inline-flex items-center text-mystic-gold hover:underline">
                            <i class="fas fa-file-pdf mr-2"></i>[Download] Feng Shui Mastery.pdf
                        </a>
                    </div>
                </div>
            `, 'ai');
            return;
        }

        // Generic Responses based on language
        const currentLang = localStorage.getItem('destinyai_language') || 'en';
        let response = "";

        if (currentLang === 'es') {
            response = "Entiendo su consulta. Un experto revisará su solicitud pronto. ¿Desea saber más sobre nuestros servicios?";
        } else if (currentLang.includes('zh')) {
            response = "我明白您的意思。我们的团队会认真对待每一个反馈。您可以继续提问，或者查看我们的常见问题。";
        } else {
            response = "I understand. Our team has been notified and we will look into your request. Is there anything else I can guide you with regarding ancient wisdom?";
        }

        this.addMessage(response, 'ai');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.supportAI = new SupportAI();
});
