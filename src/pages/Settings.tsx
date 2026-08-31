import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Moon, LogOut, ChevronLeft, Trash2, Bell, Type, MonitorPlay, Shield, FileText, Wrench, X } from 'lucide-react';

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
  
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
            
            useAppStore.getState().addTestJobs(mockJobs);
          }}
        />
        <SettingsRow 
          icon={Trash2} 
          title="מחיקת כל הנתונים באפליקציה" 
          isDestructive={true}
          control={<ChevronLeft size={20} className="text-red-400" />}
          onClick={() => {
            if (window.confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו תמחק לצמיתות את כל העבודות וההוצאות (לא ניתן לשחזר)')) {
              useAppStore.getState().clearApp();
            }
          }}
        />
      </div>

      {/* Legal & Privacy Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl px-5 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none divide-y divide-slate-100 dark:divide-gray-700">
        <SettingsRow 
          icon={Shield} 
          title="הצהרת נגישות" 
          control={<ChevronLeft size={20} className="text-slate-400" />}
          onClick={() => setShowAccessibility(true)}
        />
        <SettingsRow 
          icon={FileText} 
          title="תנאי שימוש ופרטיות" 
          control={<ChevronLeft size={20} className="text-slate-400" />}
          onClick={() => setShowPrivacy(true)}
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

      {/* Accessibility Modal */}
      {showAccessibility && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setShowAccessibility(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white">הצהרת נגישות</h2>
              <button onClick={() => setShowAccessibility(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto pr-1 text-sm text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                אפליקציה זו פותחה מתוך מודעות והתחשבות בצרכי נגישות, במטרה לאפשר חווית שימוש מיטבית לכלל המשתמשים, לרבות אנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות.
              </p>
              <h3 className="font-bold text-lg dark:text-white mt-4">התאמות הנגישות שבוצעו:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>תמיכה בניגודיות חזותית גבוהה (קונטרסט) המותאמת לתנאי שטח ושמש.</li>
                <li>שימוש בגופנים קריאים וברורים, ללא הבהובים.</li>
                <li>התאמה למסכי מגע שונים וגדלי מסך מגוונים (רספונסיביות מלאה).</li>
                <li>מבנה סמנטי קריא לטכנולוגיות מסייעות (כגון קוראי מסך).</li>
                <li>אפשרות לביטול אנימציות והפחתת תנועה דרך הגדרות האפליקציה.</li>
              </ul>
              <h3 className="font-bold text-lg dark:text-white mt-4">סייגים לנגישות:</h3>
              <p>
                למרות מאמצינו להנגיש את כלל חלקי האפליקציה, ייתכן ויתגלו רכיבים מסוימים שאינם מונגשים במלואם. אנו ממשיכים במאמצים לשפר את הנגישות כחלק ממחויבותנו לאפשר שימוש נוח ובטוח לכלל האוכלוסייה.
              </p>
              <p className="mt-4 font-bold">
                אם נתקלתם בבעיית נגישות או שיש לכם הצעות לשיפור, נשמח לקבל פנייה ולתקן זאת בהקדם.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setShowPrivacy(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white">תנאי שימוש ומדיניות פרטיות</h2>
              <button onClick={() => setShowPrivacy(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto pr-1 text-sm text-gray-700 dark:text-gray-300 space-y-4">
              <h3 className="font-bold text-lg dark:text-white mt-2">1. כללי</h3>
              <p>השימוש באפליקציה מהווה הסכמה לתנאים המפורטים להלן. האפליקציה נועדה לסייע לבעלי עסקים ועצמאיים בניהול עבודות ולקוחות.</p>
              
              <h3 className="font-bold text-lg dark:text-white mt-4">2. שמירת נתונים ופרטיות</h3>
              <p>
                <strong>בהתאם לחוק הגנת הפרטיות, התשמ"א-1981:</strong> הנתונים המוכנסים לאפליקציה (לרבות פרטי לקוחות, טלפונים, זמני עבודה, והכנסות) <strong>נשמרים באופן מקומי בלבד</strong> על מכשיר הקצה של המשתמש (בדפדפן או במכשיר הנייד).
              </p>
              <p>
                מפתחי האפליקציה <strong>אינם</strong> אוספים, אינם קוראים, אינם שומרים בשרת חיצוני, ואינם מעבירים את המידע העסקי או האישי שלך לצד ג' כלשהו. המידע הוא בבעלותך ובאחריותך הבלעדית.
              </p>

              <h3 className="font-bold text-lg dark:text-white mt-4">3. אחריות המשתמש וגיבוי נתונים</h3>
              <p>
                מכיוון שהנתונים נשמרים מקומית על המכשיר שלך, <strong>באחריותך הבלעדית לגבות את נתוניך</strong> (למשל על ידי ייצוא דוחות או גיבוי המכשיר).
                מפתחי האפליקציה לא יישאו באחריות לאובדן מידע, נזק ישיר או עקיף שייגרם כתוצאה משימוש באפליקציה, מחיקת נתונים, או אובדן המכשיר.
              </p>

              <h3 className="font-bold text-lg dark:text-white mt-4">4. עדכונים ושינויים</h3>
              <p>
                אנו שומרים את הזכות לעדכן את תנאי השימוש ומדיניות הפרטיות מעת לעת. המשך השימוש באפליקציה מהווה את הסכמתך לתנאים המעודכנים.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
