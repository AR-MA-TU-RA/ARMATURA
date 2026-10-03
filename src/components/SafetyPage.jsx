import React from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Lock, 
  MapPin, Eye, FileText, UserCheck, Flag, ArrowRight, Coffee
} from 'lucide-react';
import { SAFETY_TIPS, TRANSLATIONS } from '../data/mockData';

export default function SafetyPage({ onStartSearch, onOpenReportModal, language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Trust & Safety at domi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          {t.safetyTitle}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.safetySub}
        </p>
      </div>

      {/* CORE 4 RULES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {SAFETY_TIPS.map((tip, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4">
              {idx === 0 && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {idx === 1 && <Coffee className="w-5 h-5 text-blue-600" />}
              {idx === 2 && <FileText className="w-5 h-5 text-emerald-600" />}
              {idx === 3 && <UserCheck className="w-5 h-5 text-blue-600" />}
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-2">
              {tip.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {tip.desc}
            </p>
          </div>
        ))}
      </div>

      {/* VERIFICATION CHECKLIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm mb-12">
        <div className="max-w-xl mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t.verificationHowTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t.verificationHowSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Email Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Verified active institutional or private email address with zero spam strikes.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Phone Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              SMS verified Moldovan mobile carrier (+373) ensuring real local residents.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Student / ID Badge</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Validated university affiliation (UTM, USM, ASEM, USMF) or employer badge.
            </p>
          </div>
        </div>
      </div>

      {/* REPORT & BLOCK ACTIONS */}
      <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold mb-1">{t.reportSuspiciousTitle}</h3>
          <p className="text-xs text-slate-400 max-w-md">
            {t.reportSuspiciousSub}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Flag className="w-4 h-4" />
          <span>{t.reportBtn}</span>
        </button>
      </div>

    </div>
  );
}
