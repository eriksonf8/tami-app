import React, { useState } from 'react';
import { type Job, type PaymentStatus, useAppStore } from '../store/useAppStore';

interface PaymentModalProps {
  job: Job;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ job, onClose }) => {
  const updateJob = useAppStore(state => state.updateJob);
  const [price, setPrice] = useState(job.price?.toString() || '');
  
  const handlePayment = (method: PaymentStatus) => {
    updateJob(job.id, { 
      status: 'completed',
      price: price ? Number(price) : 0,
      paymentMethod: method 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-1 dark:text-white">איך שולם?</h2>
        <p className="text-center text-gray-500 mb-6">{job.customerName}</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-center dark:text-gray-300">סכום שחויב (₪)</label>
          <input 
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full text-center text-3xl p-4 border rounded-2xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <button onClick={() => handlePayment('cash')} className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform">
            מזומן
          </button>
          <button onClick={() => handlePayment('bit')} className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform">
            ביט / פייבוקס
          </button>
          <button onClick={() => handlePayment('transfer')} className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform">
            העברה בנקאית
          </button>
          <button onClick={() => handlePayment('unpaid')} className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform">
            לא שולם (חוב)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
