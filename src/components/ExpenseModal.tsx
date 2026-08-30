import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Save, X, Camera, Trash2, CalendarDays, ChevronDown } from 'lucide-react';


const CATEGORIES = ['חומרי גלם / ציוד', 'דלק / נסיעות', 'תקשורת', 'מסעדות / כיבוד', 'שיווק', 'אחר'];

const ExpenseModal: React.FC = () => {
  const isOpen = useAppStore(state => state.isExpenseModalOpen);
  const editingExpenseId = useAppStore(state => state.editingExpenseId);
  const closeExpenseModal = useAppStore(state => state.closeExpenseModal);
  
  const addExpense = useAppStore(state => state.addExpense);
  const updateExpense = useAppStore(state => state.updateExpense);
  const removeExpense = useAppStore(state => state.removeExpense);
  const expenses = useAppStore(state => state.expenses);
  
  const expense = editingExpenseId ? expenses.find(e => e.id === editingExpenseId) : undefined;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Sync state when expense changes (e.g. modal opens for editing)
  React.useEffect(() => {
    if (isOpen) {
      setAmount(expense?.amount?.toString() || '');
      setDate(expense?.date || new Date().toISOString().split('T')[0]);
      setCategory(expense?.category || CATEGORIES[0]);
      setDescription(expense?.description || '');
      setPhotoUrl(expense?.photoUrl || '');
    }
  }, [isOpen, expense]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!amount || isNaN(Number(amount))) {
      alert('נא להזין סכום תקין');
      return;
    }

    const expenseData = {
      amount: Number(amount),
      date,
      category,
      description,
      photoUrl
    };

    if (expense) {
      updateExpense(expense.id, expenseData);
    } else {
      addExpense(expenseData);
    }
    
    closeExpenseModal();
  };

  const handleDelete = () => {
    if (expense && window.confirm('האם אתה בטוח שברצונך למחוק הוצאה זו?')) {
      removeExpense(expense.id);
      closeExpenseModal();
    }
  };

  const getFormattedDateForDisplay = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate()} ב${d.toLocaleDateString('he-IL', { month: 'long' })}, ${d.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 bg-[#F8F9FA] dark:bg-gray-900 z-[100] flex flex-col pb-safe overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <button 
          onClick={closeExpenseModal} 
          className="w-10 h-10 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-extrabold text-[#0f172a] dark:text-white">
          {expense ? 'עריכת הוצאה' : 'הוצאה חדשה'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        
        {/* Amount Section */}
        <div className="flex flex-col items-center justify-center mt-6 mb-8 border-b border-gray-200 dark:border-gray-800 pb-8 relative">
          <label className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">סכום ההוצאה</label>
          <div className="flex items-center justify-center gap-2" dir="ltr">
            <span className="text-3xl font-bold text-slate-800 dark:text-gray-300">₪</span>
            <input 
              type="number"
              className="w-48 bg-transparent text-6xl font-extrabold text-slate-900 dark:text-white text-center outline-none placeholder-slate-300 dark:placeholder-gray-700"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">תאריך</label>
            <div 
              className="relative border border-slate-200 dark:border-gray-700 rounded-2xl p-4 flex justify-between items-center bg-white dark:bg-gray-800 cursor-pointer shadow-sm hover:border-emerald-200 transition-colors"
              onClick={() => {
                const el = document.getElementById('expense-date-input') as HTMLInputElement;
                if (el && 'showPicker' in el) {
                  try { el.showPicker(); } catch (e) {}
                }
              }}
            >
              <div className="text-lg font-medium text-slate-800 dark:text-white">
                {getFormattedDateForDisplay(date)}
              </div>
              <CalendarDays size={20} className="text-slate-400" />
              <input 
                id="expense-date-input"
                type="date"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">סוג ההוצאה</label>
            <div className="relative border border-slate-200 dark:border-gray-700 rounded-2xl p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm hover:border-emerald-200 transition-colors">
              <select 
                className="w-full bg-transparent text-lg font-medium text-slate-800 dark:text-white outline-none appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={20} className="text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">תיאור (רשות)</label>
            <textarea 
              className="w-full p-4 rounded-3xl bg-slate-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none h-28 border-none text-base"
              placeholder="פירוט קצר על ההוצאה..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-2">קבלות וחשבוניות</label>
            {photoUrl ? (
              <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-100 dark:border-emerald-900 bg-white dark:bg-gray-800 shadow-sm">
                <img src={photoUrl} alt="קבלה" className="w-full h-48 object-contain bg-slate-50 dark:bg-gray-900" />
                <button 
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2.5 rounded-full shadow-lg hover:bg-red-600 transition-transform active:scale-95"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 border-2 border-slate-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center text-slate-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all shadow-sm"
              >
                <div className="w-14 h-14 bg-slate-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3">
                  <Camera size={24} className="text-slate-600 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium">העלאת מסמך</span>
              </button>
            )}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />
          </div>
          
          {expense && (
            <button 
              onClick={handleDelete} 
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-bold py-2 mt-4"
            >
              <Trash2 size={18} />
              מחק הוצאה זו
            </button>
          )}

        </div>
      </div>
      
      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent dark:from-gray-900 dark:via-gray-900">
        <button 
          onClick={handleSave}
          className="w-full max-w-md mx-auto bg-[#276749] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_8px_20px_rgba(39,103,73,0.3)]"
        >
          <Save size={22} />
          שמור הוצאה
        </button>
      </div>
    </div>
  );
};

export default ExpenseModal;
