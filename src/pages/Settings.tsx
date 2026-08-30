import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Moon, LogOut, ChevronLeft, Trash2, Bell, Type, MonitorPlay, Shield, FileText, Wrench } from 'lucide-react';

const SettingsRow = ({ icon: Icon, title, subtitle, control, isDestructive, onClick }: any) => {
  const content = (
    <div className={`flex items-center justify-between py-4 ${onClick ? 'cursor-pointer active:opacity-70 transition-opacity' : ''}`} onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isDestructive ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-slate-50 text-slate-600 dark:bg-gray-700 dark:text-gray-300'}`}>
          <Icon size={22} />
        </div>
        <div className="text-right">
          <p className={`font-bold text-[15px] ${isDestructive ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>{title}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="shrink-0 pl-1">{control}</div>
    </div>
  );

  return content;
};

const ToggleControl = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-[#276749]"></div>
  </label>
);

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
    <div className="pb-24 pt-4 px-3">
      {/* Header */}
      <h2 className="text-3xl font-black text-[#0f172a] dark:text-white mb-6 text-right">
        הגדרות אפליקציה
      </h2>

      {/* UX & Display Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl px-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none divide-y divide-slate-100 dark:divide-gray-700">
        <SettingsRow 
          icon={Moon} 
          title="מצב לילה" 
          subtitle="חיסכון בסוללה ומניעת סינוור"
          control={<ToggleControl checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />}
        />
      </div>

      {/* Push Notifications Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl px-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none divide-y divide-slate-100 dark:divide-gray-700">
        <SettingsRow 
          icon={Bell} 
          title="אישור לקוח חדש" 
          control={<ToggleControl checked={settings.pushNewCustomer} onChange={() => toggleSetting('pushNewCustomer')} />}
        />
        <SettingsRow 
          icon={Bell} 
          title="תזכורת חוב פתוח" 
          control={<ToggleControl checked={settings.pushDebt} onChange={() => toggleSetting('pushDebt')} />}
        />
        <SettingsRow 
          icon={Bell} 
          title="התראת התנגשות ביומן" 
          control={<ToggleControl checked={settings.pushConflict} onChange={() => toggleSetting('pushConflict')} />}
        />
      </div>

      {/* Accessibility Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl px-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none divide-y divide-slate-100 dark:divide-gray-700">
        <SettingsRow 
          icon={Type} 
          title="הגדלת טקסט" 
          control={
            <select 
              className="px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white font-medium outline-none text-sm focus:ring-2 focus:ring-[#276749]"
              value={settings.textSize}
              onChange={(e) => updateSettings({ textSize: e.target.value as any })}
            >
              <option value="normal">רגיל</option>
              <option value="large">גדול</option>
              <option value="xlarge">גדול מאוד</option>
            </select>
          }
        />
        <SettingsRow 
          icon={MonitorPlay} 
          title="הפחתת תנועה" 
          subtitle="ביטול אנימציות והחלקות"
          control={<ToggleControl checked={settings.reduceMotion} onChange={() => toggleSetting('reduceMotion')} />}
        />
      </div>

      {/* Developer Tools Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl px-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none divide-y divide-slate-100 dark:divide-gray-700">
        <SettingsRow 
          icon={Wrench} 
          title="ייצר נתוני בדיקה (חודש שלם)" 
          subtitle="עבודות בסטטוסים: בוצע, לפני אישור, בביצוע"
          control={<ChevronLeft size={20} className="text-slate-400" />}
          onClick={() => {
            if (!window.confirm('זה יוסיף המון עבודות לבדיקה. להמשיך?')) return;
            
            const mockJobs: any[] = [];
            const jobTypes = ['תיקון מזגן', 'התקנת ברז', 'החלפת שקע', 'פתיחת סתימה', 'צביעת חדר', 'הרכבת ארון'];
            const names = ['דוד כהן', 'שרה לוי', 'ישראל ישראלי', 'רחל אברהם', 'יוסף מזרחי'];
            const cities = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון'];
            const allTimeWindows = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];
            
            const bookedTimes: Record<string, string[]> = {};
            
            for (let i = 0; i < 30; i++) {
              const date = new Date();
              const offset = Math.floor(Math.random() * 30) - 15;
              date.setDate(date.getDate() + offset);
              const dateStr = date.toISOString().split('T')[0];
              
              if (!bookedTimes[dateStr]) bookedTimes[dateStr] = [];
              const availableTimes = allTimeWindows.filter(t => !bookedTimes[dateStr].includes(t));
              if (availableTimes.length === 0) continue;
              
              const selectedTime = availableTimes[Math.floor(Math.random() * availableTimes.length)];
              bookedTimes[dateStr].push(selectedTime);
              
              // Generate diverse statuses
              const randStatus = Math.random();
              let status = 'pending';
              if (randStatus > 0.6) status = 'completed'; // 40% completed
              else if (randStatus > 0.3) status = 'approved'; // 30% approved
              
              const isUnpaid = status === 'completed' && Math.random() > 0.8;
              
              mockJobs.push({
                id: `mock-${Date.now()}-${i}`,
                customerName: names[Math.floor(Math.random() * names.length)],
                phone: `05${Math.floor(Math.random() * 100000000)}`,
                address: `${cities[Math.floor(Math.random() * cities.length)]}, הרצל ${Math.floor(Math.random() * 100)}`,
                hasElevator: Math.random() > 0.5,
                timeWindow: selectedTime,
                jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
                status,
                date: dateStr,
                price: status === 'completed' ? Math.floor(Math.random() * 500) + 200 : undefined,
                paymentMethod: status === 'completed' ? (isUnpaid ? 'unpaid' : 'bit') : undefined
              });
            }
            
            useAppStore.setState(state => ({ jobs: [...state.jobs, ...mockJobs] }));
            alert(`נוספו ${mockJobs.length} עבודות בדיקה בהצלחה!`);
          }}
        />
      </div>

      {/* Legal & Privacy Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl px-5 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none divide-y divide-slate-100 dark:divide-gray-700">
        <SettingsRow 
          icon={Shield} 
          title="הצהרת נגישות" 
          control={<ChevronLeft size={20} className="text-slate-400" />}
          onClick={() => alert('מסמך הצהרת נגישות יוצג כאן')}
        />
        <SettingsRow 
          icon={FileText} 
          title="תנאי שימוש ופרטיות" 
          control={<ChevronLeft size={20} className="text-slate-400" />}
          onClick={() => alert('מסמך תנאי שימוש ופרטיות יוצג כאן')}
        />
        <SettingsRow 
          icon={Trash2} 
          title="מחיקת חשבון" 
          isDestructive={true}
          control={<ChevronLeft size={20} className="text-red-400" />}
          onClick={() => {
            if (window.confirm('האם אתה בטוח שברצונך למחוק את החשבון וכל הנתונים לצמיתות? (לא ניתן לביטול)')) {
              useAppStore.setState({ jobs: [], expenses: [], profile: null as any });
            }
          }}
        />
      </div>

      {/* Logout Button */}
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
