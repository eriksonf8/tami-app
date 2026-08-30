import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Phone, MessageCircle, Check, Receipt, ChevronDown } from 'lucide-react';

const Finances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'debts' | 'expenses'>('expenses');
  const jobs = useAppStore(state => state.jobs);
  const expenses = useAppStore(state => state.expenses);
  const updateJob = useAppStore(state => state.updateJob);
  const openExpenseModal = useAppStore(state => state.openExpenseModal);
  
  const [expenseMonth, setExpenseMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

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
    <div className="pb-24 pt-4">
      <div className="flex flex-col items-start mb-8">
        <h2 className="text-5xl font-extrabold text-[#0f172a] dark:text-white mb-4 tracking-tight">כספים</h2>
        
        <div className="relative cursor-pointer flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors">
          <ChevronDown size={16} />
          <span className="text-lg font-medium">{getMonthName(expenseMonth)}</span>
          <input 
            type="month" 
            value={expenseMonth}
            onChange={(e) => setExpenseMonth(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 mb-8 relative px-2">
        <button 
          className={`pb-3 px-2 font-bold text-sm transition-colors relative ${activeTab === 'debts' ? 'text-[#0f172a] dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}
          onClick={() => setActiveTab('debts')}
        >
          חובות פתוחים ({debts.length})
          {activeTab === 'debts' && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0f172a] dark:bg-white rounded-t-full"></div>
          )}
        </button>
        <button 
          className={`pb-3 px-2 font-bold text-sm transition-colors relative ${activeTab === 'expenses' ? 'text-[#0f172a] dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}`}
          onClick={() => setActiveTab('expenses')}
        >
          הוצאות החודש
          {activeTab === 'expenses' && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0f172a] dark:bg-white rounded-t-full"></div>
          )}
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
