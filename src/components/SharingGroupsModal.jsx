import React, { useState } from 'react';
import { X, Users, Sparkles, Home, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { INITIAL_GROUPS, ROOMMATES } from '../data/mockData';

export default function SharingGroupsModal({ 
  isOpen, 
  onClose, 
  onNavigateToApartments,
  onStartChat,
  targetRoommate
}) {
  if (!isOpen) return null;

  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [createdToast, setCreatedToast] = useState(false);

  const handleCreateGroupWithTarget = () => {
    if (!targetRoommate) return;
    const newGroup = {
      id: `group-${Date.now()}`,
      name: `Team: You & ${targetRoommate.name}`,
      members: ["You", targetRoommate.name],
      combinedBudget: `€${250 + targetRoommate.budgetMin}–${350 + targetRoommate.budgetMax} / month`,
      targetDistrict: targetRoommate.district,
      status: "Team formed • Ready to view 2-room flats",
      targetRooms: 2
    };
    setGroups([newGroup, ...groups]);
    setCreatedToast(true);
    setTimeout(() => setCreatedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Roommate Team-ups (Group Search)
              </h2>
              <p className="text-[11px] text-slate-500">
                Team up with compatible people to search for 2 or 3 room apartments together
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 text-xs">
          
          {/* Target roommate team-up invite prompt if opened from a profile */}
          {targetRoommate && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={targetRoommate.avatar}
                    alt={targetRoommate.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Team up with {targetRoommate.name}?
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Combined budget: ~€{250 + targetRoommate.budgetMin}–{350 + targetRoommate.budgetMax} / mo in {targetRoommate.district}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCreateGroupWithTarget}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Team</span>
                </button>
              </div>

              {createdToast && (
                <div className="mt-2 text-emerald-700 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Team created! You can now search for 2-room flats together.</span>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TEAMS LIST */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
              Active Roommate Teams
            </h3>

            {groups.map(grp => (
              <div
                key={grp.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{grp.name}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Members: <strong className="text-slate-800">{grp.members.join(", ")}</strong>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {grp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Combined Budget</span>
                    <span className="font-extrabold text-blue-700">{grp.combinedBudget}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Target Area</span>
                    <span className="font-extrabold text-slate-800">{grp.targetDistrict}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToApartments();
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Search 2-room flats for this group</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
