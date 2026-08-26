import React, { useState } from 'react';
import { type Job, useAppStore } from '../store/useAppStore';
import { Save, X } from 'lucide-react';

interface FollowUpModalProps {
  job: Job;
  onClose: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ job, onClose }) => {
  const updateJob = useAppStore(state => state.updateJob);
  const jobs = useAppStore(state => state.jobs);
  
  const [note, setNote] = useState(job.followUpNote || '');
  const [partialAmount, setPartialAmount] = useState(job.partialPayment?.toString() || '');
  
  // Date for follow up, defaulting to tomorrow if not already set or in past
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const [followUpDate, setFollowUpDate] = useState(job.date < tomorrowStr ? tomorrowStr : job.date);
  const [timeWindow, setTimeWindow] = useState(job.timeWindow);

  // Available times logic
  const allTimeWindows = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];
  const bookedWindows = jobs
    .filter(j => j.date === followUpDate && j.status === 'pending' && j.id !== job.id)
    .map(j => j.timeWindow);
  const availableWindows = allTimeWindows.filter(w => !bookedWindows.includes(w));

  // Ensure selected time is valid for the new date
  React.useEffect(() => {
    if (!availableWindows.includes(timeWindow) && availableWindows.length > 0) {
      setTimeWindow(availableWindows[0]);
    }
  }, [followUpDate]);

  const handleSave = () => {
    updateJob(job.id, {
      followUpNote: note,
      partialPayment: partialAmount ? Number(partialAmount) : 0,
      date: followUpDate,
      timeWindow: timeWindow
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">פולואפ והמשך טיפול</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">עבור: {job.customerName}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">הערות לפולואפ (מה חסר?)</label>
            <textarea 
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none resize-none h-20"
              placeholder="לדוגמה: צריך להזמין דלת..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">תאריך המשך</label>
              <input 
                type="date" 
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                onClick={(e) => {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    try { (e.target as HTMLInputElement).showPicker(); } catch (err) {}
                  }
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">שעה</label>
              <select className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none"
                value={timeWindow} onChange={e => setTimeWindow(e.target.value)}
              >
                {availableWindows.length === 0 && <option value="" disabled>אין שעות</option>}
                {availableWindows.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
                {/* Always include the current time window if it was already theirs, even if technically booked by them */}
                {!availableWindows.includes(timeWindow) && <option value={timeWindow}>{timeWindow}</option>}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">תשלום חלקי שנגבה היום (₪)</label>
            <input 
              type="number"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none text-lg"
              placeholder="0"
              value={partialAmount}
              onChange={(e) => setPartialAmount(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-sage hover:bg-sage-dark text-white py-4 rounded-xl font-bold text-lg mt-2 flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={20} />
            שמור עדכון
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
