import React, { useState, useEffect, useRef } from 'react';
import {
  Send, ShieldCheck, CheckCheck,
  MoreVertical, ArrowLeft, Flag, AlertTriangle, XCircle, Info, Eye, EyeOff
} from 'lucide-react';
import { INITIAL_CONVERSATIONS, ROOMMATES, TRANSLATIONS } from '../data/mockData';
import { analyseMessage, getSafetyUICopy, SEVERITY } from '../utils/safetyFilter';

// ─── Global moderation queue (module-level singleton so AdminPanel can import it) ─
export const moderationQueue = [];

function addToModerationQueue(entry) {
  moderationQueue.unshift({ ...entry, id: `mod-${Date.now()}`, time: new Date().toLocaleTimeString() });
}

// ─── Safety Alert Banner Component ───────────────────────────────────────────

function SafetyAlertBanner({ analysisResult, language, onDismiss }) {
  const copy = getSafetyUICopy(analysisResult, language);
  if (!copy) return null;

  const isBlocked = analysisResult.severity === SEVERITY.BLOCKED;
  const borderColor = isBlocked ? 'border-rose-300 dark:border-rose-700' : 'border-amber-300 dark:border-amber-600';
  const bgColor = isBlocked ? 'bg-rose-50 dark:bg-rose-950/60' : 'bg-amber-50 dark:bg-amber-950/60';
  const iconColor = isBlocked ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400';
  const titleColor = isBlocked ? 'text-rose-800 dark:text-rose-200' : 'text-amber-800 dark:text-amber-200';
  const bodyColor = isBlocked ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300';

  return (
    <div className={`mx-4 mt-2 p-3 rounded-xl border ${borderColor} ${bgColor} flex items-start gap-3 text-xs animate-in slide-in-from-bottom-2 duration-200`}>
      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`font-bold ${titleColor} mb-0.5`}>{copy.title}</p>
        <p className={`leading-relaxed ${bodyColor}`}>{copy.body}</p>
      </div>
      <button onClick={onDismiss} className={`shrink-0 ${iconColor} hover:opacity-70 cursor-pointer`}>
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Safety Reminder Banner (persistent) ─────────────────────────────────────

const SAFETY_REMINDER = {
  en: 'domi will never ask you to transfer money upfront. Do not send money, card numbers or personal documents via chat. Report suspicious behaviour.',
  ro: 'domi nu vă va cere niciodată să transferați bani în avans. Nu trimiteți bani, numere de card sau documente personale prin chat. Raportați comportamentul suspect.',
  ru: 'domi никогда не попросит вас переводить деньги заранее. Не отправляйте деньги, номера карт или личные документы в чате. Сообщайте о подозрительном поведении.',
};

// ─── Blurred "flagged" message bubble ────────────────────────────────────────

function FlaggedMessageBubble({ text, language }) {
  const [revealed, setRevealed] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="max-w-md rounded-2xl border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/60 overflow-hidden">
      <div className="px-3.5 py-2.5 flex items-center gap-2">
        <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
          Mesaj posibil spam — faceți clic pentru a-l vedea
        </span>
        <button
          onClick={() => setRevealed(v => !v)}
          className="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 underline cursor-pointer"
        >
          {revealed ? 'Ascunde' : 'Arată'}
        </button>
      </div>
      <div className={`px-3.5 pb-3 text-xs text-slate-700 dark:text-slate-300 transition-all ${revealed ? '' : 'blur-sm select-none'}`}>
        {text}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MessagesPage({
  onSelectPerson,
  activeChatPersonId,
  onSelectApartment,
  onOpenReport,
  language = 'en'
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState(null);       // { severity, reason, category, matchedKeyword }
  const [sentTexts, setSentTexts] = useState([]);             // all my sent raw texts (for spam detection)
  const messagesEndRef = useRef(null);

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvId, conversations]);

  // ── BUG-2 FIX: sync active chat when activeChatPersonId changes ──
  useEffect(() => {
    if (!activeChatPersonId) return;
    setConversations(prev => {
      const existing = prev.find(c => c.personId === activeChatPersonId);
      if (existing) {
        setSelectedConvId(existing.id);
        return prev;
      }
      const targetPerson = ROOMMATES.find(r => r.id === activeChatPersonId);
      const newConv = {
        id: `conv-${activeChatPersonId}`,
        personId: activeChatPersonId,
        unread: false,
        lastMessage: 'Chat started',
        time: 'Just now',
        messages: [{
          id: `init-${Date.now()}`,
          sender: activeChatPersonId,
          text: `Salut! Mulțumesc că m-ai contactat. Cauți un coleg de apartament în ${targetPerson?.district || 'Chișinău'}?`,
          time: 'Acum',
          flagged: false,
        }],
      };
      setSelectedConvId(newConv.id);
      return [newConv, ...prev];
    });
    setMobileChatOpen(true);
  }, [activeChatPersonId]);

  const activeConversation = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const activePerson = ROOMMATES.find(r => r.id === activeConversation?.personId) || ROOMMATES[0];

  // ── Send Message with Safety Gate ──
  const handleSendMessage = (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed || !activeConversation) return;

    // Run safety analysis
    const analysis = analyseMessage(trimmed, sentTexts);

    if (analysis.severity === SEVERITY.BLOCKED) {
      // Block entirely — show banner, route to admin queue
      setSafetyAlert(analysis);
      addToModerationQueue({
        senderName: 'Anna Moraru',       // in real app: currentUser.name
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        recipientName: activePerson.name,
        messageText: trimmed,
        category: analysis.category,
        severity: analysis.severity,
        matchedKeyword: analysis.matchedKeyword,
        autoAction: 'Blocked',
      });
      setInputText('');
      return;
    }

    if (analysis.severity === SEVERITY.WARNING) {
      // Show warning — deliver as flagged/blurred message
      setSafetyAlert(analysis);
      addToModerationQueue({
        senderName: 'Anna Moraru',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        recipientName: activePerson.name,
        messageText: trimmed,
        category: analysis.category,
        severity: analysis.severity,
        matchedKeyword: analysis.matchedKeyword,
        autoAction: 'Flagged & blurred',
      });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: trimmed,
      time: 'Acum',
      flagged: analysis.severity === SEVERITY.WARNING,
    };

    setSentTexts(prev => [...prev, trimmed]);

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          lastMessage: trimmed,
          time: 'Acum',
          messages: [...conv.messages, newMessage],
        };
      }
      return conv;
    }));

    setInputText('');

    // Auto-reply after 1.5s
    setTimeout(() => {
      const autoReply = {
        id: `reply-${Date.now()}`,
        sender: activePerson.id,
        text: 'Mulțumesc pentru mesaj! Sună bine. Hai să vorbim mai multe detalii! 😊',
        time: 'Acum',
        flagged: false,
      };
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            lastMessage: autoReply.text,
            time: 'Acum',
            messages: [...conv.messages, autoReply],
          };
        }
        return conv;
      }));
    }, 1500);
  };

  const QUICK_TEMPLATES = [
    t.quickReply1 || 'Salut! Sunt interesat(ă).',
    t.quickReply2 || 'Când putem vizita apartamentul?',
    t.quickReply3 || 'Ce zici de un apel video?',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* MESSENGER CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex h-[calc(100vh-140px)] min-h-[580px]">

        {/* ── LEFT: CONVERSATIONS LIST ── */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/60 ${mobileChatOpen ? 'hidden md:flex' : 'flex'}`}>

          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t.conversationsTitle || 'Conversații'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.conversationsSub || 'Mesajele tale cu potențiali colegi'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map(conv => {
              const person = ROOMMATES.find(r => r.id === conv.personId) || {
                name: 'User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
                district: 'Centru', compatibility: 90,
              };
              const isSelected = conv.id === activeConversation?.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => { setSelectedConvId(conv.id); setMobileChatOpen(true); setSafetyAlert(null); }}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${isSelected ? 'bg-blue-50/80 dark:bg-blue-950/60 border-l-4 border-blue-600' : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/60'}`}
                >
                  <div className="relative shrink-0">
                    <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">{person.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-px rounded">{person.district}</span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-px rounded">{person.compatibility}% match</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-normal">{conv.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: CHAT WINDOW ── */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${!mobileChatOpen ? 'hidden md:flex' : 'flex'}`}>

          {/* CHAT HEADER */}
          <div className="p-3.5 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileChatOpen(false)}
                className="md:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <img src={activePerson.avatar} alt={activePerson.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3
                    onClick={() => onSelectPerson(activePerson)}
                    className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 cursor-pointer"
                  >
                    {activePerson.name}, {activePerson.age}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {activePerson.compatibility}% Match
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {activePerson.occupation} • {activePerson.district}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectPerson(activePerson)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                {t.viewProfile || 'Profil'}
              </button>
              {/* PROMINENT REPORT BUTTON */}
              <button
                onClick={() => onOpenReport && onOpenReport(activePerson)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-xl transition cursor-pointer"
                title="Report this user"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.reportUser || 'Raportează'}</span>
              </button>
            </div>
          </div>

          {/* SAFETY REMINDER BANNER */}
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900 flex items-center gap-2 text-[11px] text-blue-700 dark:text-blue-300 font-medium">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{SAFETY_REMINDER[language] || SAFETY_REMINDER.en}</span>
          </div>

          {/* SAFETY ALERT (dynamic, dismissible) */}
          {safetyAlert && (
            <SafetyAlertBanner
              analysisResult={safetyAlert}
              language={language}
              onDismiss={() => setSafetyAlert(null)}
            />
          )}

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40 dark:bg-slate-950/40">

            {/* MATCH NOTIFICATION BANNER */}
            <div className="max-w-md mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center shadow-xs">
              <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compatibilitate {activePerson.compatibility}% cu {activePerson.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activePerson.similarHabits?.join(' • ')}
              </p>
            </div>

            {/* MESSAGE BUBBLES */}
            {activeConversation?.messages.map((msg) => {
              const isMe = msg.sender === 'me';

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {msg.flagged && isMe ? (
                    <FlaggedMessageBubble text={msg.text} language={language} />
                  ) : (
                    <div
                      className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK TEMPLATE PILLS */}
          <div className="p-2.5 px-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              {t.quickRepliesLabel || 'Rapid:'}
            </span>
            {QUICK_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(tmpl)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 text-[11px] font-semibold transition shrink-0 cursor-pointer border border-slate-200/60 dark:border-slate-700"
              >
                {tmpl}
              </button>
            ))}
          </div>

          {/* MESSAGE INPUT FORM */}
          <div className="p-3 px-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.typeMessagePlaceholder || 'Scrie un mesaj…'}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition cursor-pointer shrink-0"
              title="Trimite"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
