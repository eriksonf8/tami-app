import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Moon, LogOut, ChevronLeft, Trash2, Bell, Type, MonitorPlay, Shield, FileText } from 'lucide-react';

const Settings: React.FC = () => {
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const setProfile = useAppStore(state => state.setProfile);

  const handleLogout = () => {
    if (window.confirm('האם אתה בטוח שברצונך להתנתק?')) {
      setProfile(null as any);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="pb-24 pt-4 px-2">
      <div className="flex justify-end mb-8">
        <h2 className="text-[2.5rem] font-black text-[#0f172a] dark:text-white tracking-tight leading-none text-right">
          הגדרות <br/>אפליקציה
        </h2>
      </div>

      {/* UX & Display */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">תצוגה וחוויית משתמש</h4>
        
        <div className="flex items-center justify-between">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.darkMode}
              onChange={() => toggleSetting('darkMode')}
            />
            <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
          </label>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-800 dark:text-white">מצב לילה (Dark Mode)</p>
              <p className="text-xs text-slate-500">חיסכון בסוללה ומניעת סינוור</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <Moon size={22} className="text-slate-600 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">התראות (Push Notifications)</h4>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.pushNewCustomer} onChange={() => toggleSetting('pushNewCustomer')} />
              <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
            </label>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">אישור לקוח חדש</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-slate-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.pushDebt} onChange={() => toggleSetting('pushDebt')} />
              <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
            </label>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">תזכורת חוב פתוח</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-slate-600 dark:text-gray-300" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.pushConflict} onChange={() => toggleSetting('pushConflict')} />
              <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
            </label>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">התראת התנגשות ביומן</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-slate-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">הגדרות נגישות (Accessibility)</h4>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <select 
              className="p-3 bg-slate-50 dark:bg-gray-700 border-none rounded-xl text-slate-700 dark:text-white font-medium outline-none"
              value={settings.textSize}
              onChange={(e) => updateSettings({ textSize: e.target.value as any })}
            >
              <option value="normal">רגיל</option>
              <option value="large">גדול</option>
              <option value="xlarge">גדול מאוד</option>
            </select>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">הגדלת טקסט</p>
                <p className="text-xs text-slate-500">קריאה נוחה בשמש</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Type size={18} className="text-slate-600 dark:text-gray-300" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.reduceMotion} onChange={() => toggleSetting('reduceMotion')} />
              <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
            </label>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-slate-800 dark:text-white">הפחתת תנועה</p>
                <p className="text-xs text-slate-500">ביטול אנימציות והחלקות</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <MonitorPlay size={18} className="text-slate-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Privacy */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none">
        <h4 className="text-sm font-extrabold text-[#0f172a] dark:text-white mb-6 text-right">רגולציה וחוק</h4>
        
        <button onClick={() => alert('מסמך הצהרת נגישות יוצג כאן')} className="w-full flex items-center justify-between py-3 mb-2 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-slate-600 dark:text-gray-300" />
            </div>
            <span className="font-bold text-slate-800 dark:text-gray-200">הצהרת נגישות</span>
          </div>
          <ChevronLeft size={20} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <div className="h-px bg-slate-100 dark:bg-gray-700 my-2"></div>
        
        <button onClick={() => alert('מסמך תנאי שימוש ופרטיות יוצג כאן')} className="w-full flex items-center justify-between py-3 mb-6 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <FileText size={18} className="text-slate-600 dark:text-gray-300" />
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 dark:text-gray-200">תנאי שימוש ופרטיות</p>
              <p className="text-xs text-slate-500 mt-0.5">כיצד נשמר המידע</p>
            </div>
          </div>
          <ChevronLeft size={20} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <button 
          onClick={() => {
            if (window.confirm('האם אתה בטוח שברצונך למחוק את החשבון וכל הנתונים לצמיתות? (לא ניתן לביטול)')) {
              useAppStore.setState({ jobs: [], expenses: [], profile: null as any });
            }
          }} 
          className="w-full bg-[#fef2f2] dark:bg-red-900/10 border border-[#fecaca] dark:border-red-900/30 rounded-2xl p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-[0.98]"
        >
          <div className="text-right w-full pr-4">
            <span className="font-bold text-red-600 block">מחיקת חשבון (Right to be Forgotten)</span>
            <span className="text-xs text-red-400 mt-1 block">מחיקה סופית של כל הנתונים</span>
          </div>
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout} 
        className="w-full bg-red-600 py-5 rounded-[2rem] font-extrabold text-white flex justify-center items-center gap-3 shadow-[0_4px_20px_rgba(220,38,38,0.2)] hover:bg-red-700 transition-all active:scale-95 mb-4"
      >
        <span className="text-lg">התנתק מהמערכת</span>
        <LogOut size={22} className="text-red-100" />
      </button>
    </div>
  );
};

export default Settings;
