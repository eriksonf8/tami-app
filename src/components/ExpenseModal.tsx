import React, { useState, useRef } from 'react';
import { type Expense, useAppStore } from '../store/useAppStore';
import { Save, X, Camera, Trash2 } from 'lucide-react';

interface ExpenseModalProps {
  expense?: Expense;
  onClose: () => void;
}

const CATEGORIES = ['חומרי גלם / ציוד', 'דלק / נסיעות', 'תקשורת', 'מסעדות / כיבוד', 'שיווק', 'אחר'];

const ExpenseModal: React.FC<ExpenseModalProps> = ({ expense, onClose }) => {
  const addExpense = useAppStore(state => state.addExpense);
  const updateExpense = useAppStore(state => state.updateExpense);
  const removeExpense = useAppStore(state => state.removeExpense);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState(expense?.amount?.toString() || '');
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(expense?.category || CATEGORIES[0]);
  const [description, setDescription] = useState(expense?.description || '');
  const [photoUrl, setPhotoUrl] = useState(expense?.photoUrl || '');

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
    
    onClose();
  };

  const handleDelete = () => {
    if (expense && window.confirm('האם אתה בטוח שברצונך למחוק הוצאה זו?')) {
      removeExpense(expense.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            {expense ? 'עריכת הוצאה' : 'הוצאה חדשה'}
          </h2>
          <div className="flex gap-2">
            {expense && (
              <button onClick={handleDelete} className="text-red-500 hover:text-red-600 p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">סכום (₪)</label>
              <input 
                type="number"
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none text-xl font-bold text-left"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                dir="ltr"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">תאריך</label>
              <input 
                type="date"
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none h-[54px]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    try { (e.target as HTMLInputElement).showPicker(); } catch (err) {}
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">סוג ההוצאה</label>
            <select 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">תיאור (רשות)</label>
            <input 
              type="text"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none"
              placeholder="פירוט קצר על ההוצאה..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">צילום קבלה</label>
            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                <img src={photoUrl} alt="קבלה" className="w-full h-48 object-contain" />
                <button 
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Camera size={32} className="mb-2" />
                <span>לחץ לצילום / העלאת קבלה</span>
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

          <button 
            onClick={handleSave}
            className="w-full bg-sage hover:bg-sage-dark text-white py-4 rounded-xl font-bold text-lg mt-6 flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Save size={20} />
            שמור הוצאה
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
