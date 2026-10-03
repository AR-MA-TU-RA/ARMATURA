import React, { useState } from 'react';
import { 
  X, Check, ArrowRight, ArrowLeft, Sparkles, User, 
  MapPin, Euro, Calendar, Coffee, Sliders, Upload, Camera
} from 'lucide-react';
import { DISTRICTS } from '../data/mockData';

export default function OnboardingWizard({ isOpen, onClose, onComplete }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    firstName: 'Mihai',
    age: 22,
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    districts: ['Centru', 'Botanica'],
    budgetMin: 220,
    budgetMax: 320,
    moveInDate: 'October 15, 2026',
    // Step 5 Lifestyle questions
    smoking: 'No', // 'No' | 'Yes' | 'Tolerant'
    pets: 'None', // 'Has' | 'None' | 'Tolerant'
    cleanliness: 85, // 0 = Relaxed, 100 = Very tidy
    sociability: 40, // 0 = Quiet, 100 = Social
    guests: 20, // 0 = Rarely, 100 = Often
    schedule: 30, // 0 = Early bird, 100 = Night owl
    wfh: 'Sometimes', // 'Yes' | 'No' | 'Sometimes'
    // Step 6 About
    occupation: 'Student & Junior Developer',
    university: 'UTM Computer Science',
    bio: 'Calm and clean student looking for a good roommate in Centru or Botanica. I cook simple meals, enjoy quiet evenings, and always pay bills on time.',
    lookingFor: 'Looking for a clean, non-smoking person around 20-25 years old to share a 2-room flat.'
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const toggleDistrict = (d) => {
    setFormData(prev => ({
      ...prev,
      districts: prev.districts.includes(d)
        ? prev.districts.filter(x => x !== d)
        : [...prev.districts, d]
    }));
  };

  const handleFinish = (e) => {
    e.preventDefault();
    const createdProfile = {
      id: `user-${Date.now()}`,
      name: formData.firstName,
      age: Number(formData.age),
      gender: formData.gender,
      district: formData.districts[0] || 'Centru',
      districtsAllowed: formData.districts,
      headline: `Looking for a 2-room apartment in ${formData.districts[0] || 'Centru'}`,
      bio: formData.bio,
      occupation: formData.occupation,
      university: formData.university,
      languages: ['Romanian', 'English'],
      budgetMin: formData.budgetMin,
      budgetMax: formData.budgetMax,
      budgetFormatted: `€${formData.budgetMin}–${formData.budgetMax} / month`,
      moveInDate: formData.moveInDate,
      moveInKey: 'october',
      avatar: formData.avatar,
      verifiedEmail: true,
      verifiedPhone: true,
      verifiedStudent: true,
      apartmentStatus: 'wants_teamup',
      apartmentDetails: null,
      lookingFor: formData.lookingFor,
      badges: ['Student', formData.smoking === 'No' ? 'Non-smoker' : 'Smoker-friendly', 'Clean', 'Quiet'],
      lifestyle: {
        smoking: formData.smoking === 'No' ? 'Non-smoker' : formData.smoking,
        pets: formData.pets === 'None' ? 'No pets' : formData.pets,
        cleanliness: formData.cleanliness > 70 ? 'Very tidy' : 'Relaxed',
        cleanlinessLevel: formData.cleanliness,
        sociability: formData.sociability < 50 ? 'Calm & Quiet' : 'Social',
        sociabilityLevel: formData.sociability,
        guests: formData.guests < 35 ? 'Rarely' : 'Often',
        guestsLevel: formData.guests,
        schedule: formData.schedule < 40 ? 'Early bird' : 'Night owl',
        scheduleLevel: formData.schedule,
        wfh: formData.wfh
      },
      compatibility: 94,
      compatibilityBreakdown: { budget: 95, lifestyle: 92, location: 95, moveIn: 90, total: 94 },
      similarHabits: ['Non-smoker', 'Clean kitchen policy', 'Same budget', 'Quiet nights']
    };

    onComplete(createdProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER & PROGRESS BAR (Step 1 of 6) */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Step {step} of 6
              </span>
              <h2 className="text-base font-extrabold text-slate-900">
                Create Roommate Profile
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* STEP CONTENT BODY */}
        <div className="p-6 overflow-y-auto max-h-[65vh] text-xs text-slate-700 space-y-4">
          
          {/* STEP 1 — Basic information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900">
                Tell us about yourself
              </h3>
              <p className="text-slate-500 text-xs">
                Your first name, age, and a friendly photo help roommates recognize you.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                  placeholder="e.g. Anna, Mihai"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Profile Photo URL
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatar}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
                  />
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none focus:border-blue-600"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Location */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900">
                Where are you looking to live?
              </h3>
              <p className="text-slate-500 text-xs">
                Select one or more districts in Chișinău where you would consider sharing a home.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {DISTRICTS.map(d => {
                  const isChecked = formData.districts.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDistrict(d)}
                      className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50 border-blue-500 text-blue-800'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{d}</span>
                      {isChecked && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — Budget */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900">
                What's your monthly budget?
              </h3>
              <p className="text-slate-500 text-xs">
                Specify your ideal rent range per person (excluding utilities).
              </p>

              <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 text-center">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Your Target Budget</div>
                <div className="text-3xl font-black text-blue-700">
                  €{formData.budgetMin} – €{formData.budgetMax} / month
                </div>
                <div className="text-slate-400 text-xs mt-1">Average in Chișinău is €220–320 / person</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Minimum Budget (€)
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Maximum Budget (€)
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Move-in */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900">
                When do you want to move in?
              </h3>
              <p className="text-slate-500 text-xs">
                Pick your ideal availability so we can match you with roommates ready at the same time.
              </p>

              <div className="space-y-2">
                {[
                  "Immediately / Right now",
                  "October 15, 2026",
                  "November 1, 2026",
                  "Within next 2 months"
                ].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, moveInDate: opt })}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      formData.moveInDate === opt
                        ? 'bg-blue-50 border-blue-500 text-blue-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {formData.moveInDate === opt && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 — Lifestyle cards with questions (Point 7) */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Lifestyle & Living Preferences
                </h3>
                <p className="text-slate-500 text-xs">
                  This powers the compatibility algorithm so you avoid unwanted living conflicts.
                </p>
              </div>

              {/* Smoking? */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Smoking?
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['No', 'Yes', 'Tolerant'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, smoking: opt })}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        formData.smoking === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pets? */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Pets?
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Has', 'None', 'Tolerant'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, pets: opt })}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        formData.pets === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cleanliness Slider */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Cleanliness
                  </label>
                  <span className="text-xs font-extrabold text-blue-700">
                    {formData.cleanliness > 70 ? 'Very tidy / Spotless' : formData.cleanliness > 40 ? 'Moderate' : 'Relaxed'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.cleanliness}
                  onChange={(e) => setFormData({ ...formData, cleanliness: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>Relaxed</span>
                  <span>Very tidy</span>
                </div>
              </div>

              {/* Sociability Slider */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Sociability
                  </label>
                  <span className="text-xs font-extrabold text-blue-700">
                    {formData.sociability > 60 ? 'Social & Outgoing' : 'Quiet & Calm'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.sociability}
                  onChange={(e) => setFormData({ ...formData, sociability: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>Quiet</span>
                  <span>Social</span>
                </div>
              </div>

              {/* Schedule Slider */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Schedule
                  </label>
                  <span className="text-xs font-extrabold text-blue-700">
                    {formData.schedule < 40 ? 'Early bird' : 'Night owl'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-full"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>Early bird</span>
                  <span>Night owl</span>
                </div>
              </div>

              {/* Work from Home? */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Work from home?
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Yes', 'No', 'Sometimes'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, wfh: opt })}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        formData.wfh === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 6 — About you & Bio */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-slate-900">
                Describe yourself & what you are looking for
              </h3>
              <p className="text-slate-500 text-xs">
                A warm, detailed bio gets 3x more messages from high-compatibility flatmates.
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Occupation / University
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold outline-none focus:border-blue-600"
                  placeholder="e.g. Student at UTM, UI Designer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  About You (Bio)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-blue-600 resize-none font-medium"
                  placeholder="Share a few sentences about your habits, hobbies, and day-to-day rhythm..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  What kind of roommate are you looking for?
                </label>
                <textarea
                  rows={2}
                  value={formData.lookingFor}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-blue-600 resize-none font-medium"
                  placeholder="e.g. Looking for a quiet, non-smoking student..."
                />
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER NAVIGATION */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Profile & See Matches</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
