import React, { useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, ArrowRight, Camera, Plus, X, Building, Mail, Target, Phone, Info, Download } from 'lucide-react';
import { PROFESSION_NAMES } from '../constants/professions';
import { useNavigate } from 'react-router-dom';

const SettingsRow = ({ icon: Icon, title, subtitle, control }: any) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-600 dark:bg-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0">
        <Icon size={22} />
      </div>
      <div className="text-right">
        <p className="font-bold text-[15px] text-slate-800 dark:text-white">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="shrink-0 pl-1">{control}</div>
  </div>
);

const ToggleControl = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
  </label>
);

const InputField = ({ icon: Icon, placeholder, value, onChange, type = "text" }: any) => (
  <div className="relative">
    <input 
      type={type} 
      className="w-full py-3.5 pr-11 pl-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#779982] focus:border-transparent outline-none text-right shadow-sm transition-shadow" 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
    />
    <Icon size={20} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

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
    <div className="pb-24 pt-4 px-3 bg-slate-50 dark:bg-gray-950 min-h-screen max-w-md mx-auto w-full">
      <div className="flex justify-start mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowRight size={18} />
          חזור
        </button>
      </div>

      <h2 className="text-3xl font-black text-[#0f172a] dark:text-white text-right mb-8">
        הגדרות משתמש
      </h2>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-gray-800">
        <div className="flex items-center justify-start gap-5">
          <div 
            className="relative w-20 h-20 bg-slate-100 dark:bg-gray-700 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer shadow-inner border border-slate-200/50 dark:border-gray-600/50 group shrink-0"
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
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
          </div>
          
          <div className="text-right">
            <h3 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight mb-1">{profile?.name}</h3>
            <p className="text-[#64748b] dark:text-gray-400 font-medium mb-3">{profile?.businessName}</p>
            <span className="inline-block bg-[#d1fae5] dark:bg-emerald-900/30 text-[#059669] dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
              חשבון פעיל
            </span>
          </div>
        </div>
      </div>

      {/* Basic Business Details */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-gray-800">
        <div className="space-y-4">
          <InputField icon={User} placeholder="שם מלא" value={profile?.name || ''} onChange={(e: any) => updateProfile({ name: e.target.value })} />
          <InputField icon={Building} placeholder="שם העסק" value={profile?.businessName || ''} onChange={(e: any) => updateProfile({ businessName: e.target.value })} />
          <InputField icon={Info} placeholder="ח.פ / תעודת זהות" value={profile?.businessId || ''} onChange={(e: any) => updateProfile({ businessId: e.target.value })} />
          <InputField icon={Phone} type="tel" placeholder="טלפון נייד" value={profile?.phone || ''} onChange={(e: any) => updateProfile({ phone: e.target.value })} />
        </div>
      </div>

      {/* Tax & Accountant */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-gray-800">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <InputField icon={Mail} type="email" placeholder="מייל רואה חשבון (לשליחת דוחות)" value={profile?.accountantEmail || ''} onChange={(e: any) => updateProfile({ accountantEmail: e.target.value })} />
            </div>
            <button 
              onClick={() => {
                const jobs = useAppStore.getState().jobs;
                const expenses = useAppStore.getState().expenses;
                // Only count completed jobs
                const completedJobs = jobs.filter(j => j.status === 'completed');
                
                const report = {
                  summary: {
                    totalJobs: completedJobs.length,
                    totalIncome: completedJobs.reduce((sum, j) => sum + (j.price || 0), 0),
                    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0)
                  }
                };
                
                const text = `דו"ח חודשי - ${profile?.businessName || profile?.name}\nהכנסות מבוצעות: ₪${report.summary.totalIncome}\nהוצאות: ₪${report.summary.totalExpenses}\nסה"כ עבודות שהסתיימו: ${report.summary.totalJobs}`;
                
                if (profile?.accountantEmail) {
                  window.open(`mailto:${profile.accountantEmail}?subject=דו"ח חודשי - ${profile?.businessName || profile?.name}&body=${encodeURIComponent(text)}`, '_blank');
                } else {
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }
              }}
              className="w-14 bg-[#779982] text-white rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm hover:bg-[#658570]"
              title="ייצוא דוח"
            >
              <Download size={22} />
            </button>
          </div>
          
          <div className="pt-2">
            <label className="block text-right text-sm font-bold text-slate-500 mb-2 px-1">תקרת עוסק פטור שנתית</label>
            <input 
              type="number" 
              className="w-full py-3.5 px-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white font-bold text-xl text-center focus:ring-2 focus:ring-[#779982] focus:border-transparent outline-none shadow-sm transition-shadow" 
              value={profile?.taxCeiling || 120000} 
              onChange={e => updateProfile({ taxCeiling: Number(e.target.value) })} 
            />
          </div>
        </div>
      </div>

      {/* Gamification */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl px-5 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-gray-800 divide-y divide-slate-100 dark:divide-gray-700">
        <SettingsRow 
          icon={Target}
          title="יעד הכנסות חודשי"
          subtitle="הצג מדד יעד כדי להישאר בפוקוס"
          control={<ToggleControl checked={profile?.enableMonthlyGoal ?? true} onChange={() => updateProfile({ enableMonthlyGoal: !(profile?.enableMonthlyGoal ?? true) })} />}
        />
        <SettingsRow 
          icon={() => <span className="text-[22px] leading-none">🎉</span>}
          title='אנימציות "כל הכבוד"'
          subtitle="קונפטי בעת סיום עבודה מוצלחת"
          control={<ToggleControl checked={profile?.enableConfetti ?? true} onChange={() => updateProfile({ enableConfetti: !(profile?.enableConfetti ?? true) })} />}
        />
      </div>

      {/* Customization (Profession & Tags) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-gray-800">
        <div className="relative mb-6">
          <select 
            className="w-full py-3.5 pr-4 pl-10 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-700 dark:text-white font-medium appearance-none outline-none focus:ring-2 focus:ring-[#779982] focus:border-transparent text-right shadow-sm"
            value={profile?.profession || ''}
            onChange={(e) => updateProfile({ profession: e.target.value })}
          >
            <option value="" disabled>בחר סוג עסק</option>
            {PROFESSION_NAMES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <input 
              type="text" 
              className="w-full h-full px-4 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-700 dark:text-white font-medium placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#779982] shadow-sm text-right"
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
            className="w-[3.25rem] h-[3.25rem] bg-[#779982] text-white rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm hover:bg-[#658570]"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {profile?.customJobTypes?.map((job, idx) => (
            <div key={idx} className="bg-[#e2ebe5] text-[#4a6b57] dark:bg-[#779982]/20 dark:text-[#779982] px-3 py-1.5 rounded-full flex items-center gap-2 border border-[#779982]/30">
              <span className="font-semibold text-sm">{job}</span>
              <button 
                onClick={() => {
                  if (profile) {
                    const newArr = profile.customJobTypes?.filter(j => j !== job) || [];
                    updateProfile({ customJobTypes: newArr });
                  }
                }}
                className="hover:bg-[#779982]/20 dark:hover:bg-[#779982]/40 rounded-full p-0.5 transition-colors"
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
