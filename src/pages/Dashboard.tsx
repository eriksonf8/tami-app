import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ChevronRight, ChevronLeft, ArrowRight, Calendar as CalendarIcon, TrendingUp, FileText, Trophy, PieChart } from 'lucide-react';

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

const Dashboard: React.FC = () => {
  const jobs = useAppStore(state => state.jobs);
  const expenses = useAppStore(state => state.expenses);
  
  const [viewMode, setViewMode] = useState<'main' | Period>('main');
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Helper to format date strings YYYY-MM-DD safely
  const toISODate = (d: Date) => {
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
  };

  // Date Range Calculator
  const getDateRange = (date: Date, period: Period) => {
    const d = new Date(date);
    let start = new Date(d);
    let end = new Date(d);

    if (period === 'daily') {
      start = d;
      end = d;
    } else if (period === 'weekly') {
      const day = d.getDay(); // 0 is Sunday
      start.setDate(d.getDate() - day);
      end.setDate(d.getDate() + (6 - day));
    } else if (period === 'monthly') {
      start = new Date(d.getFullYear(), d.getMonth(), 1);
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    } else if (period === 'quarterly') {
      const q = Math.floor(d.getMonth() / 3);
      start = new Date(d.getFullYear(), q * 3, 1);
      end = new Date(d.getFullYear(), q * 3 + 3, 0);
    } else if (period === 'yearly') {
      start = new Date(d.getFullYear(), 0, 1);
      end = new Date(d.getFullYear(), 11, 31);
    }

    return { start, end };
  };

  // Range Navigation
  const shiftDate = (direction: -1 | 1) => {
    const d = new Date(referenceDate);
    if (viewMode === 'daily') d.setDate(d.getDate() + direction);
    else if (viewMode === 'weekly') d.setDate(d.getDate() + direction * 7);
    else if (viewMode === 'monthly') d.setMonth(d.getMonth() + direction);
    else if (viewMode === 'quarterly') d.setMonth(d.getMonth() + direction * 3);
    else if (viewMode === 'yearly') d.setFullYear(d.getFullYear() + direction);
    
    setReferenceDate(d);
  };

  // Formatting strings
  const formatDateRangeStr = (start: Date, end: Date, period: Period) => {
    if (period === 'daily') return start.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });
    if (period === 'yearly') return `שנת ${start.getFullYear()}`;
    if (period === 'monthly') return start.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
    if (period === 'quarterly') return `רבעון ${Math.floor(start.getMonth() / 3) + 1}, ${start.getFullYear()}`;
    // Weekly
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  const getMetrics = (start: Date, end: Date) => {
    const startStr = toISODate(start);
    const endStr = toISODate(end);

    const periodJobs = jobs.filter(j => j.status === 'completed' && j.date.split('T')[0] >= startStr && j.date.split('T')[0] <= endStr);
    const periodExpenses = expenses.filter(e => e.date.split('T')[0] >= startStr && e.date.split('T')[0] <= endStr);
    
    const income = periodJobs.reduce((sum, j) => sum + Number(j.price || 0), 0);
    const cost = periodExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    return { income, cost, profit: income - cost, periodJobs, periodExpenses };
  };

  const generateInsights = (metrics: ReturnType<typeof getMetrics>, period: Period) => {
    const insights = [];
    if (metrics.cost > metrics.income * 0.4 && metrics.income > 0) {
      insights.push("⚠️ ההוצאות שלך מהוות נתח משמעותי מההכנסות. כדאי לסקור את רשימת ההוצאות ולבדוק איפה ניתן לצמצם (למשל דלק או חומרים).");
    }
    
    if (metrics.periodJobs.length > 0 && (period === 'weekly' || period === 'monthly')) {
      const days = [0,0,0,0,0,0,0];
      metrics.periodJobs.forEach(j => { days[new Date(j.date).getDay()] += (j.price || 0); });
      const bestDayIndex = days.indexOf(Math.max(...days));
      const dayNames = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
      if (days[bestDayIndex] > 0) {
        insights.push(`📈 יום ${dayNames[bestDayIndex]} היה היום הרווחי ביותר שלך בתקופה זו. כדאי לשקול לרכז בו עבודות גדולות בעתיד.`);
      }
    }

    if (insights.length === 0) {
      if (metrics.income === 0) insights.push("אין מספיק נתונים בתקופה זו כדי לייצר תובנות.");
      else insights.push("💡 הכל נראה תקין, אחוזי הרווח שלך מצוינים!");
    }
    return insights;
  };

  // --------------------------------------------------------
  // RENDER MAIN VIEW
  // --------------------------------------------------------
  if (viewMode === 'main') {
    const cards = [
      { id: 'daily', title: 'דוח יומי', icon: <CalendarIcon size={22} /> },
      { id: 'weekly', title: 'דוח שבועי', icon: <CalendarIcon size={22} /> },
      { id: 'monthly', title: 'דוח חודשי', icon: <CalendarIcon size={22} /> },
      { id: 'quarterly', title: 'דוח רבעוני', icon: <PieChart size={22} /> },
      { id: 'yearly', title: 'דוח שנתי', icon: <Trophy size={22} /> },
    ] as const;

    return (
      <div className="pb-24 pt-4 px-2">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-1">לוח בקרה פיננסי</h2>
          <p className="text-slate-500 text-sm">סקירה כלכלית מקיפה</p>
        </div>
        
        <div className="flex flex-col gap-5">
          {cards.map(card => {
            const range = getDateRange(new Date(), card.id);
            const metrics = getMetrics(range.start, range.end);
            const profit = metrics.profit;
            const isNegative = profit < 0;
            const displayValue = Math.abs(profit);
            
            return (
              <div 
                key={card.id}
                onClick={() => { setReferenceDate(new Date()); setViewMode(card.id); setShowBreakdown(false); }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-none flex items-center justify-between cursor-pointer active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isNegative ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-gray-100 text-[15px]">{card.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDateRangeStr(range.start, range.end, card.id)}</p>
                  </div>
                </div>
                
                <div className="text-left pl-2">
                  <p className={`text-2xl font-black tracking-tight ${isNegative ? 'text-red-600 dark:text-red-500' : 'text-[#276749] dark:text-emerald-400'}`}>
                    ₪{displayValue.toLocaleString()}
                    {isNegative ? '-' : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER DETAILED REPORT VIEW
  // --------------------------------------------------------
  const range = getDateRange(referenceDate, viewMode);
  const metrics = getMetrics(range.start, range.end);
  const insights = generateInsights(metrics, viewMode);

  return (
    <div className="pb-24">
      {/* Header Back Button */}
      <button onClick={() => setViewMode('main')} className="flex items-center gap-2 text-gray-500 mb-6 font-bold hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowRight size={20} />
        חזור ללוח הראשי
      </button>

      {/* TIME NAVIGATION */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <button onClick={() => shiftDate(-1)} className="p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 rounded-full text-slate dark:text-gray-300 transition-colors">
          <ChevronRight size={20} />
        </button>
        
        <div className="relative flex items-center justify-center flex-1 cursor-pointer group">
          <input 
            type="date" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            value={toISODate(referenceDate)}
            onChange={(e) => { if (e.target.value) setReferenceDate(new Date(e.target.value)); }}
            onClick={(e) => { if ('showPicker' in HTMLInputElement.prototype) { try { (e.target as HTMLInputElement).showPicker(); } catch (err) {} } }}
          />
          <div className="font-bold text-lg dark:text-white flex items-center gap-2">
            {formatDateRangeStr(range.start, range.end, viewMode)}
            <CalendarIcon size={16} className="text-gray-400 group-hover:text-sage transition-colors" />
          </div>
        </div>

        <button onClick={() => shiftDate(1)} className="p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 rounded-full text-slate dark:text-gray-300 transition-colors">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* CORE METRICS */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 p-6">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-1">הכנסות נטו (רווח)</p>
          <p className={`text-6xl font-black tracking-tight ${metrics.profit >= 0 ? 'text-sage' : 'text-red-500'}`}>
            ₪{metrics.profit}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">הכנסות 🟢</p>
            <p className="text-xl font-bold dark:text-white">₪{metrics.income}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">הוצאות 🔴</p>
            <p className="text-xl font-bold dark:text-white">₪{metrics.cost}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500 mb-1">לקוחות 👥</p>
            <p className="text-xl font-bold dark:text-white">{metrics.periodJobs.length}</p>
          </div>
        </div>
      </div>

      {/* BUSINESS INSIGHTS */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-3">
          <TrendingUp size={20} />
          תובנות והמלצות
        </h3>
        <ul className="space-y-3">
          {insights.map((insight, idx) => (
            <li key={idx} className="text-blue-900 dark:text-blue-200 text-sm leading-relaxed bg-white/50 dark:bg-black/20 p-3 rounded-lg">
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* BREAKDOWN OPTION */}
      <button 
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-4 rounded-2xl font-bold dark:text-white flex justify-center items-center gap-2 shadow-sm mb-4"
      >
        <FileText size={20} />
        {showBreakdown ? 'הסתר פירוט עסקאות' : 'הצג פירוט עסקאות מלא'}
      </button>

      {showBreakdown && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-500 dark:text-gray-400 mt-4">פירוט הכנסות</h4>
          {metrics.periodJobs.length === 0 ? <p className="text-sm text-gray-400">אין הכנסות</p> : metrics.periodJobs.map(j => (
            <div key={j.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between">
              <div>
                <p className="font-bold dark:text-white">{j.customerName}</p>
                <p className="text-xs text-gray-500">{j.date} • {j.jobType}</p>
              </div>
              <p className="font-bold text-sage">₪{j.price}</p>
            </div>
          ))}

          <h4 className="font-bold text-gray-500 dark:text-gray-400 mt-6">פירוט הוצאות</h4>
          {metrics.periodExpenses.length === 0 ? <p className="text-sm text-gray-400">אין הוצאות</p> : metrics.periodExpenses.map(e => (
            <div key={e.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between">
              <div>
                <p className="font-bold dark:text-white">{e.category || 'כללי'}</p>
                <p className="text-xs text-gray-500">{e.date} {e.description ? `• ${e.description}` : ''}</p>
              </div>
              <p className="font-bold text-red-500">₪{e.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
