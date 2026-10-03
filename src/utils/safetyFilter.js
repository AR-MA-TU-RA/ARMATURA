/**
 * safetyFilter.js
 * Central safety / anti-scam / anti-harassment engine for domi chat.
 *
 * All rules and severity levels are defined here so they can be updated
 * in one place without touching component code.
 */

// ─── Keyword Groups ──────────────────────────────────────────────────────────

const FINANCIAL_SCAM_KEYWORDS = [
  // English
  'money upfront', 'upfront payment', 'advance payment', 'prepayment',
  'transfer to card', 'send money', 'wire transfer', 'western union',
  'moneygram', 'bitcoin', 'crypto', 'deposit first', 'pay first',
  'pay in advance', 'bank transfer', 'card number',
  // Romanian
  'plată în avans', 'plata in avans', 'avans', 'transfer pe card',
  'trimite bani', 'virament bancar', 'achitați în avans',
  'plătești înainte', 'depozit în avans',
  // Russian
  'аванс', 'предоплата', 'перевод на карту', 'отправь деньги',
  'банковский перевод',
];

const HARASSMENT_KEYWORDS = [
  // sexual / explicit (kept PG for code review)
  'sex', 'sexting', 'nude', 'nudes', 'send pics', 'send photos',
  'meet tonight', 'come over now', 'benefits', 'hook up',
  // threats / insults — a small representative sample
  'kill you', 'beat you', 'find you', 'idiot', 'stupid bitch',
  'whore', 'bastard',
];

const SPAM_IDENTICAL_THRESHOLD = 3; // same message sent N times → flag as spam

// ─── Severity Levels ─────────────────────────────────────────────────────────

export const SEVERITY = {
  SAFE: 'safe',
  WARNING: 'warning',   // blur + warning banner, still deliverable after user confirms
  BLOCKED: 'blocked',   // completely blocked, never delivered
};

// ─── Main analyser ───────────────────────────────────────────────────────────

/**
 * Analyse a message before it is sent.
 *
 * @param {string} text             – Raw message text typed by the user
 * @param {string[]} sentMessages   – Array of all messages previously sent by THIS user
 *                                   (used for spam detection)
 * @returns {{
 *   severity: 'safe'|'warning'|'blocked',
 *   reason: string|null,
 *   category: 'financial'|'harassment'|'spam'|null
 * }}
 */
export function analyseMessage(text, sentMessages = []) {
  const lower = text.toLowerCase();

  // 1. Financial scam keywords → BLOCKED
  for (const kw of FINANCIAL_SCAM_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        severity: SEVERITY.BLOCKED,
        reason: 'financial_scam',
        category: 'financial',
        matchedKeyword: kw,
      };
    }
  }

  // 2. Harassment / explicit content → BLOCKED
  for (const kw of HARASSMENT_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        severity: SEVERITY.BLOCKED,
        reason: 'harassment',
        category: 'harassment',
        matchedKeyword: kw,
      };
    }
  }

  // 3. Spam detection – identical message sent too many times
  const trimmed = text.trim().toLowerCase();
  const dupeCount = sentMessages.filter(m => m.trim().toLowerCase() === trimmed).length;
  if (dupeCount >= SPAM_IDENTICAL_THRESHOLD) {
    return {
      severity: SEVERITY.WARNING,
      reason: 'spam',
      category: 'spam',
      matchedKeyword: null,
    };
  }

  return { severity: SEVERITY.SAFE, reason: null, category: null, matchedKeyword: null };
}

// ─── Human-readable UI strings (EN / RO / RU) ────────────────────────────────

export const SAFETY_MESSAGES = {
  financial: {
    en: {
      title: '⚠️ Possible scam detected',
      body: 'This message mentions a financial transaction (advance payment, money transfer, etc.). domi will NEVER ask you to transfer money upfront. This message has been blocked and reported to moderators.',
      action: 'Message blocked',
    },
    ro: {
      title: '⚠️ Posibilă tentativă de înșelăciune detectată',
      body: 'Mesajul conține o referire la transfer financiar (plată în avans, virament etc.). domi NU vă va solicita NICIODATĂ bani în avans. Mesajul a fost blocat și raportat moderatorilor.',
      action: 'Mesaj blocat',
    },
    ru: {
      title: '⚠️ Возможное мошенничество',
      body: 'Сообщение содержит упоминание финансовых транзакций (предоплата, перевод денег и т.д.). domi НИКОГДА не просит переводить деньги заранее. Сообщение заблокировано и отправлено модераторам.',
      action: 'Сообщение заблокировано',
    },
  },
  harassment: {
    en: {
      title: '🚫 Message blocked',
      body: 'This message contains inappropriate or offensive content and was not delivered. Repeated violations may result in account suspension.',
      action: 'Message blocked',
    },
    ro: {
      title: '🚫 Mesaj blocat',
      body: 'Mesajul conține conținut inadecvat sau ofensator și nu a fost livrat. Încălcările repetate pot duce la suspendarea contului.',
      action: 'Mesaj blocat',
    },
    ru: {
      title: '🚫 Сообщение заблокировано',
      body: 'Сообщение содержит неприемлемый или оскорбительный контент и не было доставлено. При повторных нарушениях аккаунт может быть заблокирован.',
      action: 'Сообщение заблокировано',
    },
  },
  spam: {
    en: {
      title: '⚠️ Spam detected',
      body: 'You have sent the same message multiple times. Please avoid copy-pasting identical messages to different users.',
      action: 'Sending limited',
    },
    ro: {
      title: '⚠️ Spam detectat',
      body: 'Ai trimis același mesaj de mai multe ori. Evită trimiterea aceluiași mesaj mai multor utilizatori.',
      action: 'Trimitere limitată',
    },
    ru: {
      title: '⚠️ Обнаружен спам',
      body: 'Вы отправили одно и то же сообщение несколько раз. Пожалуйста, не копируйте одинаковые сообщения разным пользователям.',
      action: 'Отправка ограничена',
    },
  },
};

/**
 * Returns the right UI strings for a given analysis result and language.
 */
export function getSafetyUICopy(analysisResult, language = 'en') {
  const lang = ['en', 'ro', 'ru'].includes(language) ? language : 'en';
  if (!analysisResult.category) return null;
  return SAFETY_MESSAGES[analysisResult.category]?.[lang] ?? null;
}
