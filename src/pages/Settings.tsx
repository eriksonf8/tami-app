import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, Moon, Download, LogOut, ChevronLeft, Plus, X, Wrench, Trash2, Camera } from 'lucide-react';
import { PROFESSION_NAMES } from '../constants/professions';

const Settings: React.FC = () => {
  const profile = useAppStore(state => state.profile);
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const setProfile = useAppStore(state => state.setProfile);
  const jobs = useAppStore(state => state.jobs);
  const expenses = useAppStore(state => state.expenses);

  const [newCustomJob, setNewCustomJob] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const report = {
      profile,
      summary: {
        totalJobs: jobs.length,
        totalIncome: jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + (j.price || 0), 0) + jobs.filter(j => j.status === 'pending').reduce((sum, j) => sum + (j.partialPayment || 0), 0),
        totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0)
      }
    };
    
    const text = `דו"ח חודשי - ${profile?.businessName}\nהכנסות: ₪${report.summary.totalIncome}\nהוצאות: ₪${report.summary.totalExpenses}\nסה"כ עבודות: ${report.summary.totalJobs}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleLogout = () => {
    if (window.confirm('האם אתה בטוח שברצונך להתנתק?')) {
      setProfile(null as any);
    }
  };

  const handleGenerateMockData = () => {
    if (!window.confirm('זה יוסיף 50 עבודות לבדיקה. להמשיך?')) return;
    
    const mockJobs: any[] = [];
    const jobTypes = ['תיקון מזגן', 'התקנת ברז', 'החלפת שקע', 'פתיחת סתימה', 'צביעת חדר', 'הרכבת ארון', 'תיקון דלת'];
    const names = ['דוד כהן', 'שרה לוי', 'ישראל ישראלי', 'רחל אברהם', 'יוסף מזרחי', 'מיכל דהן', 'אבי כץ', 'נועה ארגמני', 'שלומי שבת', 'עידן רייכל'];
    const cities = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה'];
    const allTimeWindows = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];
    
    const bookedTimes: Record<string, string[]> = {};
    
    for (let i = 0; i < 50; i++) {
      const date = new Date();
      const offset = Math.floor(Math.random() * 30) - 15;
      date.setDate(date.getDate() + offset);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!bookedTimes[dateStr]) {
        bookedTimes[dateStr] = [];
      }
      
      const availableTimes = allTimeWindows.filter(t => !bookedTimes[dateStr].includes(t));
      if (availableTimes.length === 0) continue;
      
      const selectedTime = availableTimes[Math.floor(Math.random() * availableTimes.length)];
      bookedTimes[dateStr].push(selectedTime);
      
      const isPast = offset < 0;
      const isCompleted = isPast ? Math.random() > 0.1 : false; 
      const isUnpaid = isCompleted && Math.random() > 0.8;
      
      mockJobs.push({
        id: `mock-${Date.now()}-${i}`,
        customerName: names[Math.floor(Math.random() * names.length)],
        phone: `05${Math.floor(Math.random() * 100000000)}`,
        address: `${cities[Math.floor(Math.random() * cities.length)]}, הרצל ${Math.floor(Math.random() * 100)}`,
        hasElevator: Math.random() > 0.5,
        timeWindow: selectedTime,
        jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
        status: isCompleted ? 'completed' : 'pending',
        date: dateStr,
        price: isCompleted ? Math.floor(Math.random() * 500) + 200 : undefined,
        paymentMethod: isCompleted ? (isUnpaid ? 'unpaid' : 'bit') : undefined,
        partialPayment: (!isCompleted && Math.random() > 0.8) ? 100 : 0
      });
    }
    
    useAppStore.setState(state => ({ jobs: [...state.jobs, ...mockJobs] }));
    alert(`נוספו ${mockJobs.length} עבודות ריאליסטיות בהצלחה!`);
  };

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

  return (
    <div className="pb-24 pt-4 px-2">
      <div className="flex justify-end mb-8">
        <h2 className="text-[2.5rem] font-black text-[#0f172a] dark:text-white tracking-tight">הגדרות</h2>
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

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">כללי</h4>
        
        <div className="flex items-center justify-between mb-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.darkMode}
              onChange={e => updateSettings({ darkMode: e.target.checked })}
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
          </label>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-gray-300">מצב לילה</span>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-gray-700 flex items-center justify-center">
              <Moon size={20} className="text-slate-600 dark:text-gray-300" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-gray-700 pt-6">
          <p className="font-semibold text-slate-700 dark:text-gray-300 mb-3 text-right">סוג העסק שלך</p>
          <div className="relative">
            <select 
              className="w-full p-4 bg-slate-50 dark:bg-gray-700 border-none rounded-2xl text-slate-700 dark:text-white font-medium appearance-none outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50"
              value={profile?.profession || ''}
              onChange={(e) => profile && setProfile({ ...profile, profession: e.target.value })}
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
        </div>
      </div>

      {/* Customization */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">התאמה אישית</h4>
        
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
                    setProfile({ ...profile, customJobTypes: newArr });
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
                setProfile({ ...profile, customJobTypes: newArr });
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
                    setProfile({ ...profile, customJobTypes: newArr });
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

      {/* Data & Security */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">נתונים ואבטחה</h4>
        
        <button onClick={handleExport} className="w-full flex items-center justify-between py-3 mb-2 group">
          <ChevronLeft size={20} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700 dark:text-gray-200">ייצוא לרואה חשבון</span>
            <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <Download size={18} className="text-slate-600 dark:text-gray-300" />
            </div>
          </div>
        </button>
        
        <div className="h-px bg-slate-100 dark:bg-gray-700 my-2"></div>
        
        <button onClick={handleGenerateMockData} className="w-full flex items-center justify-between py-3 mb-4 group">
          <ChevronLeft size={20} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700 dark:text-gray-200">ייצר נתוני בדיקה (חודש שלם)</span>
            <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <Wrench size={18} className="text-slate-600 dark:text-gray-300" />
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => {
            if (window.confirm('למחוק את כל העבודות וההוצאות? (לא ניתן לביטול)')) {
              useAppStore.setState({ jobs: [], expenses: [] });
            }
          }} 
          className="w-full bg-[#fef2f2] dark:bg-red-900/10 border border-[#fecaca] dark:border-red-900/30 rounded-2xl p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-[0.98]"
        >
          <span className="font-bold text-red-600 mx-auto mr-0">נקה את כל הנתונים</span>
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
            <Trash2 size={18} className="text-red-600" />
          </div>
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout} 
        className="w-full bg-[#f1f5f9] dark:bg-gray-800 py-4.5 p-4 rounded-[2rem] font-extrabold text-slate-700 dark:text-gray-200 flex justify-center items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-[#e2e8f0] dark:hover:bg-gray-700 transition-all active:scale-95"
      >
        <span className="text-lg">התנתק מהמערכת</span>
        <LogOut size={22} className="text-slate-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

export default Settings;
