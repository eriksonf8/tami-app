import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Phone, MessageCircle, Check, Plus } from 'lucide-react';

const Finances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'debts' | 'expenses'>('debts');
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

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">כספים</h2>
      
      {/* Tabs */}
      <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl mb-6">
        <button 
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeTab === 'debts' ? 'bg-white dark:bg-gray-800 shadow-sm text-sage' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('debts')}
        >
          חובות פתוחים ({debts.length})
        </button>
        <button 
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeTab === 'expenses' ? 'bg-white dark:bg-gray-800 shadow-sm text-sage' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('expenses')}
        >
          הוצאות החודש
        </button>
      </div>

      {/* Debts Tab */}
      {activeTab === 'debts' && (
        <div className="space-y-4">
          {debts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400">אין חובות פתוחים. הכל שולם! 🎉</p>
            </div>
          ) : (
            debts.map(job => (
              <div key={job.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="font-bold dark:text-white">{job.customerName}</h3>
                  <p className="text-sm text-gray-500">{job.jobType} • {new Date(job.date).toLocaleDateString('he-IL')}</p>
                  <p className="font-bold text-red-500 mt-1">₪{job.price}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${job.phone}`} className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <Phone size={18} />
                  </a>
                  <button onClick={() => sendReminder(job.phone, job.price || 0)} className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                    <MessageCircle size={18} />
                  </button>
                  <button onClick={() => markPaid(job.id)} className="w-10 h-10 rounded-full bg-sage-light/20 text-sage flex items-center justify-center">
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
        <div>
          <button 
            onClick={() => openExpenseModal()}
            className="w-full bg-sage hover:bg-sage-dark text-white py-4 rounded-xl font-bold text-lg mb-6 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={24} />
            הוסף הוצאה חדשה
          </button>

          <div className="flex justify-between items-center mb-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold dark:text-white">סינון לפי חודש:</h3>
            <input 
              type="month" 
              value={expenseMonth}
              onChange={(e) => setExpenseMonth(e.target.value)}
              className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-sage dark:text-white"
            />
          </div>
          
          <div className="space-y-4">
            {expenses.filter(e => e.date.startsWith(expenseMonth)).length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400">אין הוצאות בחודש זה</p>
              </div>
            ) : (
              [...expenses]
                .filter(e => e.date.startsWith(expenseMonth))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => (
                <div 
                  key={expense.id} 
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-sage transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default Finances;
