import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Phone, MessageCircle, Check, Receipt, ChevronDown, CalendarDays } from 'lucide-react';

const Finances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'debts' | 'expenses'>('expenses');
  const jobs = useAppStore(state => state.jobs);
  const expenses = useAppStore(state => state.expenses);
  const updateJob = useAppStore(state => state.updateJob);
  const openExpenseModal = useAppStore(state => state.openExpenseModal);
  
  const [expenseMonth, setExpenseMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const monthInputRef = useRef<HTMLInputElement>(null);

  const debts = jobs.filter(j => j.status === 'completed' && j.paymentMethod === 'unpaid');

  const sendReminder = (phone: string, amount: number) => {
    const msg = `היי! תזכורת קטנה לגבי תשלום פתוח על סך ₪${amount}. אשמח שתסדיר כשתוכל, תודה!`;
    window.open(`https://wa.me/${phone.replace(/^0/, '972')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const markPaid = (id: string) => {
    updateJob(id, { paymentMethod: 'bit' });
  };

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return `${date.toLocaleDateString('he-IL', { month: 'long' })} ${year}`;
  };

  return (
    <div className="pb-24 pt-6">
      {/* Header section - Centered */}
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-4xl font-extrabold text-[#276749] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-10 py-3 rounded-3xl mb-5 tracking-tight shadow-sm border border-emerald-100 dark:border-emerald-800/50">
          כספים
        </h2>
        
        <div 
          className="relative cursor-pointer flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-200 transition-colors"
          onClick={() => {
            try { monthInputRef.current?.showPicker(); } catch (e) {}
          }}
        >
          <CalendarDays size={16} className="text-[#276749]" />
          <span className="text-lg font-bold">{getMonthName(expenseMonth)}</span>
          <ChevronDown size={16} className="text-gray-400" />
          <input 
            ref={monthInputRef}
            type="month" 
            value={expenseMonth}
            onChange={(e) => setExpenseMonth(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      
      {/* Tabs - Colored Segmented Control */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl mb-8 shadow-inner">
        <button 
          className={`flex-1 py-3 px-2 font-bold text-sm transition-all rounded-xl ${activeTab === 'debts' ? 'bg-white dark:bg-gray-700 shadow-md text-red-600 dark:text-red-400' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('debts')}
        >
          חובות פתוחים ({debts.length})
        </button>
        <button 
          className={`flex-1 py-3 px-2 font-bold text-sm transition-all rounded-xl ${activeTab === 'expenses' ? 'bg-white dark:bg-gray-700 shadow-md text-[#276749] dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('expenses')}
        >
          הוצאות החודש
        </button>
      </div>

      {/* Debts Tab */}
      {activeTab === 'debts' && (
        <div className="space-y-4">
          {debts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Receipt size={32} className="text-gray-300 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0f172a] dark:text-white mb-2">הכל נקי</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-[250px] leading-relaxed text-sm">
                אין חובות פתוחים. הכל שולם!
              </p>
            </div>
          ) : (
            debts.map(job => (
              <div key={job.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 dark:border-gray-700 flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">{job.customerName}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{job.jobType} • {new Date(job.date).toLocaleDateString('he-IL')}</p>
                  <p className="font-bold text-red-500 mt-2">₪{job.price}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${job.phone}`} className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center transition-transform active:scale-95">
                    <Phone size={18} />
                  </a>
                  <button onClick={() => sendReminder(job.phone, job.price || 0)} className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center transition-transform active:scale-95">
                    <MessageCircle size={18} />
                  </button>
                  <button onClick={() => markPaid(job.id)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 flex items-center justify-center transition-transform active:scale-95">
                    <Check size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {expenses.filter(e => e.date.startsWith(expenseMonth)).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Receipt size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0f172a] dark:text-white mb-2">הכל נקי</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-[250px] leading-relaxed text-sm">
                אין הוצאות רשומות בחודש זה. לחץ על כפתור הפלוס כדי להוסיף הוצאה חדשה.
              </p>
            </div>
            ) : (
              [...expenses]
                .filter(e => e.date.startsWith(expenseMonth))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => (
                <div 
                  key={expense.id} 
                  className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 dark:border-gray-700 cursor-pointer hover:border-blue-100 transition-colors"
                  onClick={() => openExpenseModal(expense.id)}
                >
                  <div className="flex items-center gap-4">
                    {expense.photoUrl ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0">
                        <img src={expense.photoUrl} alt="קבלה" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 shrink-0 text-2xl">
                        🧾
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold dark:text-white text-lg">₪{expense.amount}</h3>
                      <p className="text-sm font-medium text-sage">{expense.category || 'כללי'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(expense.date).toLocaleDateString('he-IL')} 
                        {expense.description ? ` • ${expense.description}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
      )}
    </div>
  );
};

export default Finances;
