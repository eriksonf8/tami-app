import React, { useState } from 'react';
import { type Job, useAppStore } from '../store/useAppStore';
import { Save, X, CheckCircle2 } from 'lucide-react';

interface EditJobModalProps {
  job: Job;
  onClose: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ job, onClose }) => {
  const updateJob = useAppStore(state => state.updateJob);
  const [date, setDate] = useState(job.date);
  const [timeWindow, setTimeWindow] = useState(job.timeWindow);

  const handleApprove = () => {
    updateJob(job.id, { date, timeWindow, status: 'approved' });
    onClose();
  };

  const handleSave = () => {
    updateJob(job.id, { date, timeWindow });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            {job.status === 'pending' ? 'אישור עבודה' : 'עריכת עבודה'}
          </h2>
          <button onClick={onClose} className="text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">תאריך</label>
            <input 
              type="date" 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-sage"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">חלון זמן (שעה)</label>
            <input 
              type="text" 
              placeholder="לדוגמה: 08:00-10:00"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-sage"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {job.status === 'pending' && (
            <button 
              onClick={handleApprove}
              className="w-full bg-sage hover:bg-sage-dark text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
            >
              <CheckCircle2 size={20} />
              אשר עבודה וקבע ביומן
            </button>
          )}
          <button 
            onClick={handleSave}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
          >
            <Save size={20} />
            שמור שינויים
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
