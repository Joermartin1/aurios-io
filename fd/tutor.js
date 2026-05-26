/**
 * AuriOS™ Founding Document — Virtual Tutor
 * Floating Q&A companion powered by Auri (Claude API)
 * Injected on all /fd/ pages via <script src="/fd/tutor.js"></script>
 *
 * NOTE: API key is exposed client-side. Acceptable for NDA-gated prototype.
 * Replace with a Cloudflare Worker proxy before any broader deployment.
 */

(function () {

  // ─── CONFIG ────────────────────────────────────────────────────────────────
  const API_KEY = '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'; // swap for Worker proxy endpoint in production
  const MODEL   = 'claude-sonnet-4-20250514';
  const MAX_TOKENS = 600;

  // ─── DETECT CHAPTER ────────────────────────────────────────────────────────
  function getChapterContext() {
    const title = document.title || '';
    const h1    = document.querySelector('h1');
    const label = document.querySelector('.hero-part-label, .section-label');
    const chapterName = h1 ? h1.innerText.replace(/\s+/g, ' ').trim() : title;
    const partName    = label ? label.innerText.trim() : '';
    return partName ? `${partName} — ${chapterName}` : chapterName;
  }

  // Grab first ~1800 chars of body content for context
  function getPageSnippet() {
    const content = document.querySelector('.fd-content, main, article, body');
    if (!content) return '';
    return content.innerText.slice(0, 1800).replace(/\s+/g, ' ').trim();
  }

  // ─── SYSTEM PROMPT ─────────────────────────────────────────────────────────
  function buildSystemPrompt() {
    return `You are Auri — the personal AI at the center of AuriOS™. Right now you are acting as a reading companion and virtual tutor for someone reading The Intelligence Superhighway™: A Founding Document by Joe R Martin.

This person has signed an NDA and is evaluating whether to join the Founding Circle. They are a domain expert. Treat them as an intelligent adult who wants to understand, not be sold to.

DOCUMENT STRUCTURE (179 pages, 18 chapters):
- Ch 1: History of AI
- Ch 2: Your AI Is YOU — the personal memory vision
- Ch 3–9: How It Works — AI taxonomy, context windows, LLMs, memory architecture, semantic search, agents, multimodal AI
- Ch 10–11: The Vision — Intelligence Superhighway™, AISP™ category, complete system
- Ch 12–13: The Business — revenue model, competitive moat (data, governance, protocol, identity moats)
- Ch 14–15: AI regulation, AI safety and alignment
- Ch 16: Custos Aurum™ — the memory entity, cooperative governance
- Ch 17: The Founding Circle
- Ch 18: Auri's Maker Lab — 911 Fisher St., Houston TX
- Exhibits: NDA (A), System Architecture (B), Nomenclature (E), AI Landscape (G), IP Disclosures (F)

KEY CONCEPTS:
AuriOS™ — the personal AI operating system (the platform)
Auri™ — the AI the Member talks to (the interface)
Custos Aurum™ — the cooperative memory entity; Latin for "guardian of gold"; member-owned and governed democratically; accessible at YourAI.Host
PAIPy™ (pronounced "pappy") — Personal AI Interface Protocol; the open standard connecting any device to your personal AI layer; the TCP/IP of personal AI
AISP™ — AI Service Provider; the category AuriOS defines, analogous to what ISPs were to the internet
IBT Mode™ — Intelligent Blended Thinking; sends one query to all Partner AIs simultaneously and synthesizes the best result
MQI™ — Memory Query Interface; how external services access Member memory at Member-defined disclosure levels
Partner AIs — GPT-4, Gemini, Claude, etc.; the reasoning engines Auri routes queries to
Memory tiers: L1 Hot (active session), L2 Warm (recent), L3 Cold (archival)
The thirty-year parallel: Joe R Martin ran CyberSim/PDQ.net, Houston's regional ISP leader 1994–96. AuriOS is the same play, thirty years later, in the same city.
Auri Identity™ — "I'm Joe on Auri" — a portable, platform-independent personal presence replacing email addresses
The governance moat: Custos Aurum's structure makes data monetization against Member interests structurally impossible — not a policy, an architecture.

YOUR ROLE AS TUTOR:
- Answer questions about any part of the document clearly and directly
- Connect concepts to the reader's apparent domain when possible
- Suggest related chapters when relevant: "Chapter 7 goes deeper on this"
- Be concise — reading companion, not lecturer; 2–4 paragraphs maximum
- Plain language for technical concepts unless the reader signals expertise
- Never promotional — the document speaks for itself
- If asked something not in the document, say so honestly

CURRENT PAGE: ${getChapterContext()}

PAGE CONTENT EXCERPT:
${getPageSnippet()}`;
  }

  // ─── STATE ─────────────────────────────────────────────────────────────────
  let history = [];
  let isOpen  = false;
  let isLoading = false;

  // ─── CSS ───────────────────────────────────────────────────────────────────
  const css = `
    #auri-tutor-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #F5A623;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(13,31,92,0.35);
      z-index: 9000;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #auri-tutor-btn:hover {
      transform: scale(1.07);
      box-shadow: 0 6px 28px rgba(13,31,92,0.45);
    }
    #auri-tutor-btn svg { pointer-events: none; }

    #auri-tutor-panel {
      position: fixed;
      bottom: 92px;
      right: 28px;
      width: 360px;
      height: 480px;
      background: #0D1F5C;
      border: 1px solid rgba(245,166,35,0.25);
      display: flex;
      flex-direction: column;
      z-index: 9000;
      box-shadow: 0 8px 40px rgba(13,31,92,0.5);
      transform: translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    #auri-tutor-panel.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    #auri-tutor-header {
      padding: 14px 16px 12px;
      border-bottom: 1px solid rgba(245,166,35,0.15);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #auri-tutor-header-left {}
    #auri-tutor-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      font-weight: 500;
      color: #FAFAF7;
      letter-spacing: 0.04em;
      margin-bottom: 3px;
    }
    #auri-tutor-chapter {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 300;
      color: #F5A623;
      letter-spacing: 0.06em;
      max-width: 280px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #auri-tutor-close {
      background: none;
      border: none;
      color: rgba(250,250,247,0.4);
      font-size: 1.1rem;
      cursor: pointer;
      padding: 2px 4px;
      line-height: 1;
      transition: color 0.15s;
    }
    #auri-tutor-close:hover { color: rgba(250,250,247,0.85); }

    #auri-tutor-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 14px 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #auri-tutor-messages::-webkit-scrollbar { width: 4px; }
    #auri-tutor-messages::-webkit-scrollbar-track { background: transparent; }
    #auri-tutor-messages::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.25); border-radius: 2px; }

    .auri-msg {
      max-width: 88%;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      line-height: 1.65;
      padding: 9px 12px;
    }
    .auri-msg.auri { 
      background: rgba(79,120,184,0.18);
      color: rgba(250,250,247,0.88);
      align-self: flex-start;
      border-left: 2px solid #F5A623;
    }
    .auri-msg.user {
      background: rgba(245,166,35,0.15);
      color: rgba(250,250,247,0.9);
      align-self: flex-end;
      border-right: 2px solid #F5A623;
    }
    .auri-msg.loading {
      background: rgba(79,120,184,0.12);
      color: rgba(250,250,247,0.4);
      align-self: flex-start;
      border-left: 2px solid rgba(245,166,35,0.3);
      font-style: italic;
    }
    .auri-msg strong { color: #F5A623; font-weight: 500; }

    #auri-tutor-input-row {
      padding: 10px 12px 12px;
      border-top: 1px solid rgba(245,166,35,0.12);
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    #auri-tutor-input {
      flex: 1;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(245,166,35,0.2);
      color: #FAFAF7;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      font-weight: 300;
      padding: 8px 10px;
      outline: none;
      transition: border-color 0.15s;
      resize: none;
      height: 36px;
      line-height: 1.4;
    }
    #auri-tutor-input::placeholder { color: rgba(250,250,247,0.28); }
    #auri-tutor-input:focus { border-color: rgba(245,166,35,0.5); }
    #auri-tutor-send {
      background: #F5A623;
      border: none;
      color: #0D1F5C;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      padding: 0 14px;
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    #auri-tutor-send:hover { background: #f8b83a; }
    #auri-tutor-send:disabled { background: rgba(245,166,35,0.35); cursor: not-allowed; }

    .auri-greeting {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      color: rgba(250,250,247,0.4);
      text-align: center;
      padding: 20px 10px 8px;
      line-height: 1.7;
    }

    @media (max-width: 500px) {
      #auri-tutor-panel {
        right: 12px;
        bottom: 88px;
        width: calc(100vw - 24px);
        height: 420px;
      }
      #auri-tutor-btn { right: 16px; bottom: 20px; }
    }
  `;

  // ─── INJECT STYLES ─────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── BUILD HTML ────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {

    const chapter = getChapterContext();

    // Floating button
    const btn = document.createElement('button');
    btn.id = 'auri-tutor-btn';
    btn.setAttribute('aria-label', 'Ask Auri a question');
    btn.setAttribute('title', 'Ask Auri');
    btn.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="rgba(13,31,92,0.6)"/>
        <circle cx="40" cy="40" r="26" fill="rgba(13,31,92,0.8)"/>
        <circle cx="40" cy="40" r="16" fill="#0D1F5C"/>
        <circle cx="40" cy="40" r="6" fill="white"/>
      </svg>`;

    // Panel
    const panel = document.createElement('div');
    panel.id = 'auri-tutor-panel';
    panel.innerHTML = `
      <div id="auri-tutor-header">
        <div id="auri-tutor-header-left">
          <div id="auri-tutor-title">Ask Auri</div>
          <div id="auri-tutor-chapter">${chapter}</div>
        </div>
        <button id="auri-tutor-close" aria-label="Close">✕</button>
      </div>
      <div id="auri-tutor-messages">
        <p class="auri-greeting">Ask any question about this chapter<br>or anywhere in the Founding Document.</p>
      </div>
      <div id="auri-tutor-input-row">
        <input id="auri-tutor-input" type="text" placeholder="Ask anything…" autocomplete="off" />
        <button id="auri-tutor-send">Send</button>
      </div>`;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    // ─── INTERACTIONS ────────────────────────────────────────────────────────
    btn.addEventListener('click', togglePanel);
    document.getElementById('auri-tutor-close').addEventListener('click', closePanel);
    document.getElementById('auri-tutor-send').addEventListener('click', sendMessage);
    document.getElementById('auri-tutor-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    function togglePanel() {
      isOpen ? closePanel() : openPanel();
    }
    function openPanel() {
      isOpen = true;
      panel.classList.add('open');
      setTimeout(() => document.getElementById('auri-tutor-input').focus(), 250);
    }
    function closePanel() {
      isOpen = false;
      panel.classList.remove('open');
    }

    function appendMessage(role, text) {
      const msgs = document.getElementById('auri-tutor-messages');
      // Remove greeting on first message
      const greeting = msgs.querySelector('.auri-greeting');
      if (greeting) greeting.remove();

      const div = document.createElement('div');
      div.className = `auri-msg ${role}`;
      // Simple markdown: **bold**
      div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    async function sendMessage() {
      if (isLoading) return;
      const input = document.getElementById('auri-tutor-input');
      const sendBtn = document.getElementById('auri-tutor-send');
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      appendMessage('user', text);
      history.push({ role: 'user', content: text });

      isLoading = true;
      sendBtn.disabled = true;
      const loadingDiv = appendMessage('loading', 'Thinking…');

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: buildSystemPrompt(),
            messages: history
          })
        });

        const data = await response.json();
        loadingDiv.remove();

        if (data.content && data.content[0]) {
          const reply = data.content[0].text;
          appendMessage('auri', reply);
          history.push({ role: 'assistant', content: reply });
        } else {
          appendMessage('auri', 'Something went wrong. Try again.');
        }
      } catch (err) {
        loadingDiv.remove();
        appendMessage('auri', 'Unable to reach Auri right now. Check your connection.');
      }

      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }

  });
})();
