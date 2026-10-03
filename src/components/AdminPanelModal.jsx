import React, { useState } from 'react';
import {
  X, LayoutDashboard, Users, AlertTriangle, ShieldCheck,
  Ban, CheckCircle, MessageSquare, Eye, Clock, Zap
} from 'lucide-react';
import { ADMIN_STATS, ADMIN_REPORTS, ROOMMATES } from '../data/mockData';
import { moderationQueue } from './MessagesPage';

// ─── Severity badge helper ─────────────────────────────────────────────────

function SeverityBadge({ severity }) {
  const map = {
    blocked: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
  };
  const label = { blocked: 'BLOCKED', warning: 'FLAGGED' };
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${map[severity] || 'bg-slate-100 text-slate-600'}`}>
      {label[severity] || severity?.toUpperCase()}
    </span>
  );
}

function CategoryBadge({ category }) {
  const map = {
    financial: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300',
    harassment: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    spam: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300',
  };
  const label = { financial: '💰 Financial scam', harassment: '🚫 Harassment', spam: '📨 Spam' };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${map[category] || 'bg-slate-100 text-slate-600'}`}>
      {label[category] || category}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminPanelModal({ isOpen, onClose, language = 'en' }) {
  const [reports, setReports] = useState(ADMIN_REPORTS);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('modqueue'); // 'modqueue' | 'reports' | 'users'
  const [modQueue, setModQueue] = useState([]); // live snapshot updated on open
  const [resolvedIds, setResolvedIds] = useState(new Set());

  // Sync moderation queue from the exported singleton every render
  // (simple approach for demo — in real app use context/store)
  const liveQueue = [...moderationQueue].filter(e => !resolvedIds.has(e.id));

  if (!isOpen) return null;

  const handleDismissReport = (id) => setReports(prev => prev.filter(r => r.id !== id));
  const handleBlockReported = (rep) => {
    setBlockedUsers(prev => [...prev, rep.reportedUser]);
    setReports(prev => prev.filter(r => r.id !== rep.id));
  };

  const handleResolveModItem = (id) => {
    setResolvedIds(prev => new Set([...prev, id]));
  };
  const handleBanFromMod = (item) => {
    setSuspendedUsers(prev => [...prev, item.senderName]);
    setResolvedIds(prev => new Set([...prev, item.id]));
  };

  const TABS = [
    { id: 'modqueue', label: `🛡️ Moderation Queue`, count: liveQueue.length },
    { id: 'reports', label: 'Pending Reports', count: reports.length },
    { id: 'users', label: 'Registered Users', count: ROOMMATES.length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-extrabold">domi — Admin Moderation Panel</h2>
              <p className="text-[11px] text-slate-400">Community safety, automated flagging & fraud prevention</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STAT TILES */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{ADMIN_STATS.totalUsers}</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Users</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-2xl font-black text-blue-600">{ADMIN_STATS.activeListings}</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Active Flats</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-2xl font-black text-rose-600">{liveQueue.length + reports.length}</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Flagged Items</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-2xl font-black text-emerald-600">{suspendedUsers.length + blockedUsers.length}</div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Banned / Suspended</div>
          </div>
        </div>

        {/* TABS */}
        <div className="px-6 pt-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 shrink-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-px rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">

          {/* ── MODERATION QUEUE TAB ── */}
          {activeTab === 'modqueue' && (
            liveQueue.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">No flagged messages</div>
                <div className="text-xs mt-1">The automated filter hasn't caught any violations yet. Try typing a suspicious message in chat to test it.</div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                  <Zap className="w-4 h-4 shrink-0" />
                  <p className="text-[11px] font-medium">
                    These messages were automatically flagged by the domi safety filter and were either blocked or blurred before delivery. Review and take action below.
                  </p>
                </div>

                {liveQueue.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/30 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {item.senderAvatar && (
                          <img src={item.senderAvatar} alt={item.senderName} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        )}
                        <div>
                          <span className="font-black text-slate-900 dark:text-white">{item.senderName}</span>
                          <span className="text-slate-400 dark:text-slate-500 mx-1">→</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{item.recipientName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <CategoryBadge category={item.category} />
                        <SeverityBadge severity={item.severity} />
                        <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />{item.time}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Message content:</p>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{item.messageText}</p>
                      {item.matchedKeyword && (
                        <p className="mt-1.5 text-[10px] text-slate-400">
                          Matched keyword: <code className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-1 rounded">{item.matchedKeyword}</code>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium mr-1">Auto action: <strong>{item.autoAction}</strong></span>
                      <button
                        onClick={() => handleResolveModItem(item.id)}
                        className="px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition"
                      >
                        ✓ Dismiss
                      </button>
                      <button
                        onClick={() => handleBanFromMod(item)}
                        className="px-3 py-1.5 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer transition"
                      >
                        <Ban className="w-3 h-3" /> Suspend User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── PENDING REPORTS TAB ── */}
          {activeTab === 'reports' && (
            reports.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="font-bold text-slate-700 dark:text-slate-300">Zero pending reports</div>
                <div className="text-xs">All flags have been reviewed and resolved.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 dark:text-white">{rep.reportedUser}</span>
                        <span className="text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold px-2 py-0.5 rounded">
                          Reported by {rep.reporter}
                        </span>
                        <span className="text-[10px] text-slate-400">{rep.date}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs mt-1">
                        Reason: <strong>{rep.reason}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDismissReport(rep.id)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleBlockReported(rep)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer transition"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Ban User</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── USERS TAB ── */}
          {activeTab === 'users' && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROOMMATES.map((user) => {
                const isSuspended = suspendedUsers.includes(user.name);
                return (
                  <div key={user.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{user.name}, {user.age}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-2">{user.district} • {user.budgetFormatted}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSuspended ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300 px-2 py-0.5 rounded">
                          Suspended
                        </span>
                      ) : (
                        <>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded">
                            Verified
                          </span>
                          <button
                            onClick={() => setSuspendedUsers(prev => [...prev, user.name])}
                            className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                          >
                            Suspend
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
