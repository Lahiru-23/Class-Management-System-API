/**
 * SmartClass AI Assistant — floating chat widget.
 * Injects a toggle button + chat panel into the page and talks to
 * POST /api/ai/chat (JWT-authenticated, same Api client as the rest of the app).
 * Call AiChat.init() once, after api.js and icons.js have loaded and Auth.isLoggedIn() is true.
 */
const AiChat = (() => {
    let panelOpen = false;
    let history = [];

    const SUGGESTIONS = [
        'How many students do we have?',
        'Any overdue invoices?',
        'How do I add a new class?',
        'What can you help with?'
    ];

    function init(opts = {}) {
        if (document.getElementById('aiChatToggle')) return; // already injected
        injectMarkup();
        wireEvents();
    }

    function injectMarkup() {
        const toggle = document.createElement('button');
        toggle.id = 'aiChatToggle';
        toggle.setAttribute('aria-label', 'Open AI assistant');
        toggle.innerHTML = Icons.html('bot', 30) + '<span class="pulse-dot"></span>';
        document.body.appendChild(toggle);

        const panel = document.createElement('div');
        panel.id = 'aiChatPanel';
        panel.innerHTML = `
            <div class="ai-chat-header">
                ${Icons.html('bot', 30, 'indigo').replace('icon-3d', 'icon-3d')}
                <div>
                    <div class="ai-chat-title">SmartClass Assistant</div>
                    <div class="ai-chat-sub">Ask about students, classes & fees</div>
                </div>
                <button class="ai-chat-close" id="aiChatClose" aria-label="Close">${Icons.html('close', 16)}</button>
            </div>
            <div class="ai-chat-body" id="aiChatBody"></div>
            <div class="ai-chat-suggestions" id="aiChatSuggestions"></div>
            <div class="ai-chat-input-row">
                <input type="text" id="aiChatInput" placeholder="Type a message..." autocomplete="off">
                <button id="aiChatSend">${Icons.html('send', 18)}</button>
            </div>`;
        document.body.appendChild(panel);

        const suggWrap = document.getElementById('aiChatSuggestions');
        suggWrap.innerHTML = SUGGESTIONS.map(s => `<button class="ai-chip" data-q="${s.replace(/"/g, '&quot;')}">${s}</button>`).join('');
    }

    function wireEvents() {
        document.getElementById('aiChatToggle').addEventListener('click', togglePanel);
        document.getElementById('aiChatClose').addEventListener('click', togglePanel);
        document.getElementById('aiChatSend').addEventListener('click', sendCurrentInput);
        document.getElementById('aiChatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendCurrentInput();
        });
        document.getElementById('aiChatSuggestions').addEventListener('click', (e) => {
            const btn = e.target.closest('.ai-chip');
            if (!btn) return;
            sendMessage(btn.dataset.q);
        });
    }

    function togglePanel() {
        panelOpen = !panelOpen;
        const panel = document.getElementById('aiChatPanel');
        panel.classList.toggle('show', panelOpen);
        if (panelOpen && history.length === 0) {
            const user = Auth.getUser();
            const name = user ? user.username : 'there';
            addMessage('bot', `Hi ${name} 👋 I'm the SmartClass assistant. Ask me about students, classes, teachers or overdue fees, or how to use a feature.`);
        }
    }

    function sendCurrentInput() {
        const input = document.getElementById('aiChatInput');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        sendMessage(text);
    }

    async function sendMessage(text) {
        addMessage('user', text);
        const typingEl = addTyping();
        const sendBtn = document.getElementById('aiChatSend');
        sendBtn.disabled = true;
        try {
            const res = await Api.post('/ai/chat', { message: text });
            typingEl.remove();
            addMessage('bot', res.reply);
        } catch (err) {
            typingEl.remove();
            addMessage('bot', "Sorry, I couldn't reach the assistant service right now. (" + err.message + ")");
        } finally {
            sendBtn.disabled = false;
        }
    }

    function addMessage(role, text) {
        history.push({ role, text });
        const body = document.getElementById('aiChatBody');
        const div = document.createElement('div');
        div.className = 'ai-msg ' + (role === 'user' ? 'ai-msg-user' : 'ai-msg-bot');
        div.textContent = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
        return div;
    }

    function addTyping() {
        const body = document.getElementById('aiChatBody');
        const div = document.createElement('div');
        div.className = 'ai-msg ai-msg-bot ai-msg-typing';
        div.innerHTML = '<span></span><span></span><span></span>';
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
        return div;
    }

    return { init };
})();
