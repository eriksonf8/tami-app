import React, { useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, ArrowRight, Camera, Plus, X, Building, Mail, Target, Phone, Info } from 'lucide-react';
import { PROFESSION_NAMES } from '../constants/professions';
import { useNavigate } from 'react-router-dom';

const ProfileSettings: React.FC = () => {
  const profile = useAppStore(state => state.profile);
  const setProfile = useAppStore(state => state.setProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCustomJob, setNewCustomJob] = useState('');
  const navigate = useNavigate();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (profile) setProfile({ ...profile, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = (updates: Partial<typeof profile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  return (
    <div className="pb-24 pt-4 px-2 bg-slate-50 dark:bg-gray-950 min-h-screen max-w-md mx-auto w-full">
      <div className="flex justify-start mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowRight size={18} />
          חזור
        </button>
      </div>

      <div className="flex justify-end mb-8">
        <h2 className="text-[2.5rem] font-black text-[#0f172a] dark:text-white tracking-tight leading-none text-right">
          הגדרות <br/>משתמש
        </h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none flex justify-between items-center transition-all">
        <div className="text-right">
          <h3 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight mb-1">{profile?.name}</h3>
          <p className="text-[#64748b] dark:text-gray-400 font-medium mb-3">{profile?.businessName}</p>
          <span className="inline-block bg-[#d1fae5] dark:bg-emerald-900/30 text-[#059669] dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
            חשבון פעיל
          </span>
        </div>
        
        <div 
          className="relative w-20 h-20 bg-slate-100 dark:bg-gray-700 rounded-[1.25rem] overflow-hidden flex items-center justify-center cursor-pointer shadow-inner border border-slate-200/50 dark:border-gray-600/50 group"
          onClick={() => fileInputRef.current?.click()}
        >
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-slate-400 dark:text-gray-500" />
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={20} className="text-white" />
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      {/* Basic Business Details */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">פרטי עסק בסיסיים</h4>
        
        <div className="space-y-4">
          <div className="relative">
            <input type="text" className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-900 dark:text-white font-medium pr-12 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none text-right" placeholder="שם מלא" value={profile?.name || ''} onChange={e => updateProfile({ name: e.target.value })} />
            <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          
          <div className="relative">
            <input type="text" className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-900 dark:text-white font-medium pr-12 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none text-right" placeholder="שם העסק" value={profile?.businessName || ''} onChange={e => updateProfile({ businessName: e.target.value })} />
            <Building size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <input type="text" className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-900 dark:text-white font-medium pr-12 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none text-right" placeholder="ח.פ / תעודת זהות" value={profile?.businessId || ''} onChange={e => updateProfile({ businessId: e.target.value })} />
            <Info size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          
          <div className="relative">
            <input type="tel" className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-900 dark:text-white font-medium pr-12 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none text-right" placeholder="טלפון נייד" value={profile?.phone || ''} onChange={e => updateProfile({ phone: e.target.value })} />
            <Phone size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Tax & Accountant */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">מיסוי ורואה חשבון</h4>
        
        <div className="space-y-4">
          <div className="relative">
            <input type="email" className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-900 dark:text-white font-medium pr-12 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none text-right" placeholder="מייל רואה חשבון (לשליחת דוחות)" value={profile?.accountantEmail || ''} onChange={e => updateProfile({ accountantEmail: e.target.value })} />
            <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          
          <div className="relative">
            <label className="block text-right text-sm font-bold text-slate-500 mb-2">תקרת עוסק פטור שנתית</label>
            <input type="number" className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-xl text-center focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 outline-none" value={profile?.taxCeiling || 120000} onChange={e => updateProfile({ taxCeiling: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      {/* Gamification */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">יעדים וחיזוקים חיוביים</h4>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={profile?.enableMonthlyGoal ?? true} onChange={() => updateProfile({ enableMonthlyGoal: !(profile?.enableMonthlyGoal ?? true) })} />
              <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
            </label>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">יעד הכנסות חודשי</p>
                <p className="text-xs text-slate-500">הצג מדד יעד כדי להישאר בפוקוס</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Target size={18} className="text-slate-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={profile?.enableConfetti ?? true} onChange={() => updateProfile({ enableConfetti: !(profile?.enableConfetti ?? true) })} />
              <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
            </label>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">אנימציות "כל הכבוד"</p>
                <p className="text-xs text-slate-500">קונפטי בעת סיום עבודה מוצלחת</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <span className="text-xl">🎉</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization (Profession & Tags) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">התאמה אישית של שירותים</h4>
        
        <p className="font-semibold text-slate-700 dark:text-gray-300 mb-3 text-right">סוג העסק</p>
        <div className="relative mb-6">
          <select 
            className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-700 dark:text-white font-medium appearance-none outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50"
            value={profile?.profession || ''}
            onChange={(e) => updateProfile({ profession: e.target.value })}
          >
            <option value="" disabled>בחר סוג עסק</option>
            {PROFESSION_NAMES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <p className="font-semibold text-slate-700 dark:text-gray-300 mb-3 text-right">סוגי עבודות מותאמים אישית</p>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-slate-50 dark:bg-gray-700 rounded-2xl">
            <input 
              type="text" 
              className="w-full h-full px-4 py-4 bg-transparent border-none outline-none text-slate-700 dark:text-white font-medium placeholder-slate-400"
              placeholder="הכנס סוג עבודה..."
              value={newCustomJob}
              onChange={e => setNewCustomJob(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newCustomJob.trim() && profile) {
                    const newArr = [...(profile.customJobTypes || []), newCustomJob.trim()];
                    updateProfile({ customJobTypes: newArr });
                    setNewCustomJob('');
                  }
                }
              }}
            />
          </div>
          <button 
            onClick={() => {
              if (newCustomJob.trim() && profile) {
                const newArr = [...(profile.customJobTypes || []), newCustomJob.trim()];
                updateProfile({ customJobTypes: newArr });
                setNewCustomJob('');
              }
            }}
            className="w-[3.25rem] h-[3.25rem] bg-[#0f172a] dark:bg-slate-700 text-white rounded-2xl flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-md hover:bg-slate-800"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {profile?.customJobTypes?.map((job, idx) => (
            <div key={idx} className="bg-[#d1fae5] text-[#059669] dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#a7f3d0] dark:border-emerald-800">
              <span className="font-semibold text-sm">{job}</span>
              <button 
                onClick={() => {
                  if (profile) {
                    const newArr = profile.customJobTypes?.filter(j => j !== job) || [];
                    updateProfile({ customJobTypes: newArr });
                  }
                }}
                className="hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
