/**
 * ==========================================================================
 * THE DOMUS — PROPERTY ADVISOR (SONAKSHI) CHATBOT & WHATSAPP ADAPTER
 * Human real-estate advisor experience styled with The Domus luxury branding.
 * ==========================================================================
 */

(function () {
  'use strict';

  // Domus WhatsApp & Advisor Contact
  const DOMUS_PHONE = '7900178900';
  const WHATSAPP_URL = `https://wa.me/91${DOMUS_PHONE}?text=${encodeURIComponent(
    "Hi Sonakshi, I'm interested in The Domus Seawoods residences (2 & 3 BHK / Commercial). Please share details."
  )}`;

  const ADVISOR_CONFIG = {
    name: 'Sonakshi',
    title: 'Property Advisor',
    avatarUrl: 'assets/images/sonakshi.jpeg',
    welcomeMessage:
      "Hello 👋 I'm Sonakshi. Welcome to The Domus! I'm here to help you find the perfect property. How can I assist you today?",
    quickQuestions: [
      { label: '🏠 Browse Projects', query: 'Tell me about The Domus projects and residences' },
      { label: '💰 Latest Price', query: 'What is the price and payment plan for The Domus?' },
      { label: '📅 Book Site Visit', query: 'How do I schedule a private site visit?' },
      { label: '📄 Download Brochure', query: 'How can I download the official brochure?' },
      { label: '📞 Request Callback', query: 'I would like to request a callback' },
      { label: '📍 Project Location', query: 'Where is The Domus located in Seawoods?' }
    ],
    responses: {
      projects:
        "The Domus is a G+18 storeyed architectural edifice situated in Seawoods, Nerul, Navi Mumbai. We offer signature 2 & 3 BHK luxury residences along with premium commercial spaces on the Ground & 1st floors.\n\nOur developments also include The Domus Privé (Seawoods), The Domus 26 West, and The Domus 26 East (Ulwe).\n\nMahaRERA: P51700019222.",
      price:
        "Residences at The Domus are crafted with an Inside-Out architectural philosophy offering spacious 2 & 3 BHK configurations. Pricing varies by floor level and view. All bookings are direct with zero brokerage.\n\nMay I have your name and contact number to share the official price sheet and payment schedules?",
      visit:
        "We would be delighted to host you for a private walkthrough of The Domus! We arrange personalized site visits and guided tour appointments.\n\nPlease share your full name and 10-digit mobile number so I can confirm your preferred date and time.",
      brochure:
        "You can download the official architectural brochure right here:\n<a href='assets/brochures/THE DOMUS Brochure.pdf' target='_blank' rel='noopener' style='color: #C8A45D; text-decoration: underline; font-weight: 600;'>Download Official Brochure (PDF) →</a>\n\nI can also send the high-res floor plans and dossier directly to your WhatsApp!",
      callback:
        "Certainly! Please share your full name and 10-digit mobile number. Our senior property advisor will call you back at your convenience.",
      location:
        "The Domus is strategically located at Seawoods, Nerul, Navi Mumbai on a wide 30m x 15m road.\n\n• Palm Beach Road: 5 min walk\n• Seawoods Grand Central Mall: 3 min walk\n• Seawoods Railway Station: 2 min walk\n• Jewels of Navi Mumbai: 1 min walk\n• D-Mart: 2 min walk\n• Don Bosco & Poddar Schools: 5 min walk",
      amenities:
        "Our 4th-floor podium recreational amenities include:\n• Swimming Pool & Changing Rooms\n• State-of-the-art Gymnasium\n• Landscaped Podium Garden\n• Kids Play Area, Trampoline & Rock Climber\n• Party Hall & Leisure Lounge\n• 3-Tier Security with CCTV & Video Door Phone",
      default:
        "I'm here to assist you with floor plans, 2 & 3 BHK configurations, amenities, RERA documentation, or scheduling a site visit. Feel free to choose one of the quick options below or type your question!"
    }
  };

  /**
   * Matches keywords to human advisor response
   */
  function getAdvisorResponse(userText) {
    const text = userText.toLowerCase();

    if (text.includes('price') || text.includes('cost') || text.includes('rate') || text.includes('payment') || text.includes('lakh') || text.includes('cr')) {
      return ADVISOR_CONFIG.responses.price;
    }
    if (text.includes('visit') || text.includes('site') || text.includes('schedule') || text.includes('appointment') || text.includes('walkthrough') || text.includes('tour')) {
      return ADVISOR_CONFIG.responses.visit;
    }
    if (text.includes('brochure') || text.includes('pdf') || text.includes('download') || text.includes('floor plan') || text.includes('plan')) {
      return ADVISOR_CONFIG.responses.brochure;
    }
    if (text.includes('callback') || text.includes('call') || text.includes('phone') || text.includes('contact') || text.includes('number')) {
      return ADVISOR_CONFIG.responses.callback;
    }
    if (text.includes('location') || text.includes('where') || text.includes('seawoods') || text.includes('nerul') || text.includes('station') || text.includes('mall') || text.includes('address') || text.includes('connectivity')) {
      return ADVISOR_CONFIG.responses.location;
    }
    if (text.includes('amenit') || text.includes('pool') || text.includes('gym') || text.includes('garden') || text.includes('party hall') || text.includes('kids') || text.includes('parking')) {
      return ADVISOR_CONFIG.responses.amenities;
    }
    if (text.includes('project') || text.includes('browse') || text.includes('2 bhk') || text.includes('3 bhk') || text.includes('bhk') || text.includes('flat') || text.includes('residence') || text.includes('domus') || text.includes('commercial') || text.includes('prive') || text.includes('rera')) {
      return ADVISOR_CONFIG.responses.projects;
    }

    return ADVISOR_CONFIG.responses.default;
  }

  function isValidFullName(text) {
    const clean = text.trim().toLowerCase();
    if (clean.length < 2 || clean.length > 50) return false;
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length > 4) return false;
    const blacklist = ['hi', 'hello', 'hey', 'price', 'visit', 'brochure', 'location', 'flat', 'bhk', 'info', 'details', 'show', 'cost', 'callback'];
    for (const w of words) {
      if (blacklist.includes(w)) return false;
    }
    return !/[\d!@#$%^&*()_+={}\[\]:;"'<>,.?\/|\\~`]/.test(clean);
  }

  // Runtime State
  let isOpen = false;
  let leadState = 'idle'; // 'idle' | 'awaiting_name' | 'awaiting_number' | 'completed'
  let leadData = { name: '', phone: '' };
  let inactivityTimer = null;

  // DOM Elements
  let floatingStackEl, chatWindowEl, messagesContainerEl, inputFieldEl, sendBtnEl, closeBtnEl, quickChipsEl;

  function injectWidgetDOM() {
    if (document.getElementById('domusChatbotWindow')) return;

    // 1. Floating Stack
    floatingStackEl = document.createElement('div');
    floatingStackEl.className = 'domus-floating-stack';
    floatingStackEl.setAttribute('role', 'region');
    floatingStackEl.setAttribute('aria-label', 'Property Advisor & WhatsApp Tools');

    floatingStackEl.innerHTML = `
      <div class="domus-floating-item">
        <span class="domus-floating-tooltip">Chat on WhatsApp</span>
        <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" class="domus-btn-floating domus-btn-whatsapp" aria-label="Chat on WhatsApp">
          <svg viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.418-.074-.125-.272-.199-.57-.348m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>
      </div>
      <div class="domus-floating-item">
        <span class="domus-floating-tooltip">Chat with ${ADVISOR_CONFIG.name} · ${ADVISOR_CONFIG.title}</span>
        <button id="domusOpenAdvisorBtn" class="domus-btn-floating domus-btn-advisor" aria-label="Open ${ADVISOR_CONFIG.name} Property Advisor">
          <img src="${ADVISOR_CONFIG.avatarUrl}" alt="${ADVISOR_CONFIG.name}" class="domus-btn-advisor-img" />
          <span class="domus-advisor-online-badge"></span>
        </button>
      </div>
    `;
    document.body.appendChild(floatingStackEl);

    // 2. Chatbot Window
    chatWindowEl = document.createElement('div');
    chatWindowEl.id = 'domusChatbotWindow';
    chatWindowEl.className = 'domus-chatbot-window';
    chatWindowEl.setAttribute('role', 'dialog');
    chatWindowEl.setAttribute('aria-label', `${ADVISOR_CONFIG.name} Property Advisor Chat Window`);

    chatWindowEl.innerHTML = `
      <header class="domus-chat-header">
        <div class="domus-chat-header-info">
          <div class="domus-header-avatar-wrap">
            <img src="${ADVISOR_CONFIG.avatarUrl}" alt="${ADVISOR_CONFIG.name}" class="domus-header-avatar-img" />
            <span class="domus-header-online-dot"></span>
          </div>
          <div class="domus-chat-header-text">
            <h3>${ADVISOR_CONFIG.name} <span class="domus-chat-header-badge">· ${ADVISOR_CONFIG.title}</span></h3>
            <div class="domus-chat-status">
              <span class="domus-status-live"></span>
              <span>Online · The Domus Advisor</span>
            </div>
          </div>
        </div>
        <button id="domusCloseChatBtn" class="domus-chat-close" aria-label="Close Chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <div id="domusChatMessages" class="domus-chat-messages" aria-label="Conversation log"></div>

      <div class="domus-chat-quick">
        <span class="domus-quick-label"><span>✦</span> Quick Options</span>
        <div id="domusQuickChips" class="domus-quick-chips"></div>
      </div>

      <form id="domusChatInputBar" class="domus-chat-inputbar">
        <input type="text" id="domusChatInput" class="domus-chat-input" placeholder="Ask a question..." autocomplete="off" />
        <button type="submit" id="domusChatSend" class="domus-chat-send" aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    `;
    document.body.appendChild(chatWindowEl);

    // Cache elements
    const advisorBtnEl = document.getElementById('domusOpenAdvisorBtn');
    closeBtnEl = document.getElementById('domusCloseChatBtn');
    messagesContainerEl = document.getElementById('domusChatMessages');
    inputFieldEl = document.getElementById('domusChatInput');
    sendBtnEl = document.getElementById('domusChatSend');
    quickChipsEl = document.getElementById('domusQuickChips');

    // Bind listeners
    advisorBtnEl.addEventListener('click', toggleChat);
    closeBtnEl.addEventListener('click', closeChat);

    document.getElementById('domusChatInputBar').addEventListener('submit', function (e) {
      e.preventDefault();
      handleUserSubmit();
    });

    // Populate Quick Questions
    ADVISOR_CONFIG.quickQuestions.forEach(function (item) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'domus-chip-btn';
      chip.textContent = item.label;
      chip.addEventListener('click', function () {
        handleSendMessage(item.query);
      });
      quickChipsEl.appendChild(chip);
    });

    // Initial greeting
    appendMessage('bot', ADVISOR_CONFIG.welcomeMessage);

    // Strict Scroll Isolation: Prevents underlying webpage from scrolling when cursor is over chatbot
    messagesContainerEl.addEventListener('wheel', function (e) {
      e.stopPropagation();
      const scrollTop = messagesContainerEl.scrollTop;
      const scrollHeight = messagesContainerEl.scrollHeight;
      const height = messagesContainerEl.clientHeight;
      const delta = e.deltaY;
      const isScrollingUp = delta < 0;

      if (!isScrollingUp && delta > scrollHeight - height - scrollTop) {
        messagesContainerEl.scrollTop = scrollHeight;
        e.preventDefault();
      } else if (isScrollingUp && -delta > scrollTop) {
        messagesContainerEl.scrollTop = 0;
        e.preventDefault();
      }
    }, { passive: false });

    chatWindowEl.addEventListener('wheel', function (e) {
      if (!messagesContainerEl.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });

    // Escape listener
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });
  }

  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    isOpen = true;
    chatWindowEl.classList.add('domus-active');
    floatingStackEl.classList.add('domus-hidden');
    inputFieldEl.focus();
    resetInactivityTimer();
  }

  function closeChat() {
    isOpen = false;
    chatWindowEl.classList.remove('domus-active');
    floatingStackEl.classList.remove('domus-hidden');
    if (inactivityTimer) clearTimeout(inactivityTimer);
  }

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (isOpen && leadState === 'idle') {
      inactivityTimer = setTimeout(function () {
        if (leadState === 'idle' && isOpen) {
          showTypingIndicator(function () {
            appendMessage('bot', 'Hi there! May I know your full name please? I can share our master floor plans and latest availability.');
            leadState = 'awaiting_name';
          });
        }
      }, 7000);
    }
  }

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(sender, text) {
    const row = document.createElement('div');
    row.className = `domus-msg-row domus-${sender}-row`;

    if (sender === 'bot') {
      const avatarImg = document.createElement('img');
      avatarImg.src = ADVISOR_CONFIG.avatarUrl;
      avatarImg.alt = ADVISOR_CONFIG.name;
      avatarImg.className = 'domus-msg-avatar';
      row.appendChild(avatarImg);
    }

    const content = document.createElement('div');
    content.className = 'domus-msg-content';

    const bubble = document.createElement('div');
    bubble.className = 'domus-msg-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    const time = document.createElement('div');
    time.className = 'domus-msg-time';
    time.textContent = formatTime();

    content.appendChild(bubble);
    content.appendChild(time);
    row.appendChild(content);

    messagesContainerEl.appendChild(row);
    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
  }

  function showTypingIndicator(callback) {
    const row = document.createElement('div');
    row.className = 'domus-typing-row';
    row.id = 'domusTypingRow';

    const avatarImg = document.createElement('img');
    avatarImg.src = ADVISOR_CONFIG.avatarUrl;
    avatarImg.alt = ADVISOR_CONFIG.name;
    avatarImg.className = 'domus-msg-avatar';

    const bubble = document.createElement('div');
    bubble.className = 'domus-typing-bubble';
    bubble.innerHTML = `
      <div class="domus-typing-dot"></div>
      <div class="domus-typing-dot"></div>
      <div class="domus-typing-dot"></div>
    `;

    row.appendChild(avatarImg);
    row.appendChild(bubble);
    messagesContainerEl.appendChild(row);
    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;

    setTimeout(function () {
      const el = document.getElementById('domusTypingRow');
      if (el) el.remove();
      if (typeof callback === 'function') callback();
    }, 750);
  }

  function saveLeadLocally(data) {
    try {
      const existing = JSON.parse(localStorage.getItem('domus_captured_leads') || '[]');
      existing.push({
        ...data,
        advisor: ADVISOR_CONFIG.name,
        source: 'The Domus Property Advisor Widget',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('domus_captured_leads', JSON.stringify(existing));
    } catch (e) {
      console.warn('[DomusAdvisor] LocalStorage note:', e);
    }
  }

  function handleUserSubmit() {
    const text = inputFieldEl.value.trim();
    if (!text) return;
    inputFieldEl.value = '';
    handleSendMessage(text);
  }

  function handleSendMessage(userText) {
    if (!userText.trim()) return;
    resetInactivityTimer();

    appendMessage('user', userText);

    // Lead State Logic
    if (leadState === 'awaiting_name') {
      if (isValidFullName(userText)) {
        leadData.name = userText.trim();
        showTypingIndicator(function () {
          appendMessage(
            'bot',
            `Thank you, ${leadData.name}! Could you please share your 10-digit mobile number so I can register your enquiry and send the requested details?`
          );
          leadState = 'awaiting_number';
        });
      } else {
        const reply = getAdvisorResponse(userText);
        showTypingIndicator(function () {
          appendMessage('bot', reply + '\n\nBefore we proceed, could you kindly tell me your full name?');
        });
      }
      return;
    }

    if (leadState === 'awaiting_number') {
      const phoneRegex = /^[0-9]{10}$/;
      const cleanedPhone = userText.replace(/\D/g, '');
      if (phoneRegex.test(cleanedPhone)) {
        leadData.phone = cleanedPhone;
        leadState = 'completed';

        saveLeadLocally({
          name: leadData.name || 'Website Visitor',
          phone: leadData.phone,
          enquiry: 'Lead captured via Property Advisor Sonakshi'
        });

        showTypingIndicator(function () {
          appendMessage(
            'bot',
            `Thank you, ${leadData.name || 'Valued Visitor'}! Your details have been submitted. Our property desk will get in touch with you shortly.\n\nYou can also message me directly on WhatsApp anytime: <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" style="color: #C8A45D; text-decoration: underline; font-weight: 600;">Connect on WhatsApp →</a>`
          );
        });
      } else {
        showTypingIndicator(function () {
          appendMessage('bot', 'Please enter a valid 10-digit mobile number (e.g., 9876543210).');
        });
      }
      return;
    }

    // Default conversational response
    const botReply = getAdvisorResponse(userText);
    showTypingIndicator(function () {
      appendMessage('bot', botReply);

      if (leadState === 'idle') {
        setTimeout(function () {
          if (leadState === 'idle' && isOpen) {
            showTypingIndicator(function () {
              appendMessage('bot', 'By the way, may I know your full name please?');
              leadState = 'awaiting_name';
            });
          }
        }, 2000);
      }
    });
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectWidgetDOM);
  } else {
    injectWidgetDOM();
  }
})();
