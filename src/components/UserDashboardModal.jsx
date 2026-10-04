import React, { useState } from 'react';
import { 
  X, User, Sparkles, Heart, MessageSquare, Home, Settings, 
  ShieldCheck, Check, ArrowRight, Bell, Users, Camera, Upload, Loader2, AlertCircle
} from 'lucide-react';
import { compressImage } from '../utils/imageUtils';

export default function UserDashboardModal({ 
  isOpen, 
  onClose, 
  currentUser,
  onNavigate,
  onOpenCreateProfile,
  onOpenPublishApartment,
  onUpdateAvatar,
  language = 'ro'
}) {
  if (!isOpen) return null;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);

    try {
      const compressed = await compressImage(file, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
      if (onUpdateAvatar) {
        await onUpdateAvatar(compressed);
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) {
      setUploadError(err.message || 'Eroare la procesarea fotografiei');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER WITH INTERACTIVE AVATAR UPLOAD */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Circular Avatar with Camera Overlay */}
            <div 
              className="relative group cursor-pointer shrink-0"
              onClick={() => document.getElementById('dashboard-avatar-upload')?.click()}
              title="Apasă pentru a schimba poza"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-md bg-slate-200">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow border-2 border-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <input
                type="file"
                id="dashboard-avatar-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-slate-900">
                  Hi, {currentUser?.name} 👋
                </h2>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Active resident in Chișinău • {currentUser?.district || 'Centru'}
              </p>

              <button
                type="button"
                onClick={() => document.getElementById('dashboard-avatar-upload')?.click()}
                disabled={isUploading}
                className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Se comprimă...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3" />
                    <span>Schimbă poza de profil</span>
                  </>
                )}
              </button>

              {uploadSuccess && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Fotografie salvată cu succes!</span>
                </div>
              )}
              {uploadError && (
                <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="self-start sm:self-auto p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROFILE COMPLETENESS (Point 16) */}
        <div className="p-6 border-b border-slate-100 bg-blue-50/50">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Profile completeness</span>
            <span className="text-blue-700 font-extrabold">80% completed</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-blue-600 h-full w-[80%]" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Add student ID proof to reach 100% verified badge</span>
            <button
              onClick={() => {
                onClose();
                onOpenCreateProfile();
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer"
            >
              Update profile →
            </button>
          </div>
        </div>

        {/* STATS TILES (Point 16: 12 matches, 5 saved, 3 conversations) */}
        <div className="p-6 grid grid-cols-3 gap-3 text-center border-b border-slate-100">
          <div 
            onClick={() => { onClose(); onNavigate('matches'); }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer"
          >
            <div className="text-2xl font-black text-slate-900">12</div>
            <div className="text-[11px] font-bold text-slate-500">Matches</div>
          </div>

          <div 
            onClick={() => { onClose(); onNavigate('favorites'); }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
          >
            <div className="text-2xl font-black text-slate-900">5</div>
            <div className="text-[11px] font-bold text-slate-500">Saved</div>
          </div>

          <div 
            onClick={() => { onClose(); onNavigate('messages'); }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50 hover:border-emerald-200 transition cursor-pointer"
          >
            <div className="text-2xl font-black text-slate-900">3</div>
            <div className="text-[11px] font-bold text-slate-500">Chats</div>
          </div>
        </div>

        {/* DASHBOARD ACTIONS LIST */}
        <div className="p-6 space-y-2 text-xs">
          {[
            { label: "My Matches & Compatibility", icon: Sparkles, color: "text-emerald-600", action: () => { onClose(); onNavigate('matches'); } },
            { label: "Messages & Chats", icon: MessageSquare, color: "text-blue-600", action: () => { onClose(); onNavigate('messages'); } },
            { label: "Saved Roommates & Apartments", icon: Heart, color: "text-rose-600", action: () => { onClose(); onNavigate('favorites'); } },
            { label: "Publish or Edit My Flat", icon: Home, color: "text-blue-600", action: () => { onClose(); onOpenPublishApartment(); } },
            { label: "Redo Lifestyle Onboarding", icon: User, color: "text-purple-600", action: () => { onClose(); onOpenCreateProfile(); } }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full p-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 transition flex items-center justify-between cursor-pointer font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
