import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, Moon, Download, LogOut, ArrowLeft } from 'lucide-react';

const Settings: React.FC = () => {
  const profile = useAppStore(state => state.profile);
  const settings = useAppStore(state => state.settings);
  const updateSettings = useAppStore(state => state.updateSettings);
  const setProfile = useAppStore(state => state.setProfile);
  const jobs = useAppStore(state => state.jobs);
  const expenses = useAppStore(state => state.expenses);

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
    
    // Keep track of booked times per date to avoid overlapping
    const bookedTimes: Record<string, string[]> = {};
    
    // We want 50 jobs spread across roughly the last 15 days and the next 15 days
    for (let i = 0; i < 50; i++) {
      const date = new Date();
      // Random day between -15 and +15 from today
      const offset = Math.floor(Math.random() * 30) - 15;
      date.setDate(date.getDate() + offset);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!bookedTimes[dateStr]) {
        bookedTimes[dateStr] = [];
      }
      
      const availableTimes = allTimeWindows.filter(t => !bookedTimes[dateStr].includes(t));
      
      // If a day is full, skip generating a job for this iteration (or pick another day)
      // To keep it simple, we just fall back to another random day if full.
      if (availableTimes.length === 0) continue;
      
      const selectedTime = availableTimes[Math.floor(Math.random() * availableTimes.length)];
      bookedTimes[dateStr].push(selectedTime); // mark as booked
      
      // If it's in the past, it's mostly completed. If future, it's pending.
      const isPast = offset < 0;
      const isCompleted = isPast ? Math.random() > 0.1 : false; // 90% of past jobs are done, 0% of future jobs
      const isUnpaid = isCompleted && Math.random() > 0.8; // 20% of completed are unpaid
      
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

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">הגדרות</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-sage-light/20 text-sage rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <h3 className="font-bold dark:text-white">{profile?.name}</h3>
            <p className="text-sm text-gray-500">{profile?.businessName}</p>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-gray-500 dark:text-gray-400" />
              <span className="font-medium dark:text-white">מצב לילה (Dark Mode)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.darkMode}
                onChange={e => updateSettings({ darkMode: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:-translate-x-full rtl:peer-checked:after:-translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sage"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
        <button onClick={handleExport} className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <Download size={20} className="text-blue-500" />
            <span className="font-medium dark:text-white">ייצוא לרואה חשבון</span>
          </div>
          <ArrowLeft size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
        <button onClick={handleGenerateMockData} className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛠️</span>
            <span className="font-medium dark:text-white">ייצר נתוני בדיקה (חודש שלם)</span>
          </div>
        </button>
        <button 
          onClick={() => {
            if (window.confirm('למחוק את כל העבודות וההוצאות? (לא ניתן לביטול)')) {
              useAppStore.setState({ jobs: [], expenses: [] });
            }
          }} 
          className="w-full p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700 transition-colors text-red-500"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🗑️</span>
            <span className="font-medium">נקה את כל הנתונים</span>
          </div>
        </button>
      </div>

      <button onClick={handleLogout} className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
        <LogOut size={20} />
        התנתק מהמערכת
      </button>
    </div>
  );
};

export default Settings;
