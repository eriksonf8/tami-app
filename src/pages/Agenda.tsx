import React, { useState, useEffect } from 'react';
import { useAppStore, type Job } from '../store/useAppStore';
import JobCard from '../components/JobCard';
import PaymentModal from '../components/PaymentModal';
import FollowUpModal from '../components/FollowUpModal';
import { ChevronRight, ChevronLeft, Shield, ShieldOff } from 'lucide-react';

const Agenda: React.FC = () => {
  const jobs = useAppStore(state => state.jobs);
  const profile = useAppStore(state => state.profile);
  const isWorking = useAppStore(state => state.isWorking);
  const toggleWorkingMode = useAppStore(state => state.toggleWorkingMode);
  const addToast = useAppStore(state => state.addToast);
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [followUpJob, setFollowUpJob] = useState<Job | null>(null);
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = currentDate.toISOString().split('T')[0];
  const pendingJobs = jobs.filter(j => j.status === 'pending' && j.date === dateStr);
  
  // Sort pending jobs by time window
  pendingJobs.sort((a, b) => a.timeWindow.localeCompare(b.timeWindow));

  // Request push notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Next-job reminder: check every 60s if a job starts in ~30 min
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const interval = setInterval(() => {
      const now = new Date();
      const todayPending = jobs.filter(j => j.status === 'pending' && j.date === todayStr);
      
      for (const job of todayPending) {
        const startHour = parseInt(job.timeWindow.split('-')[0].split(':')[0], 10);
        const startMin = parseInt(job.timeWindow.split('-')[0].split(':')[1], 10);
        
        const jobStart = new Date();
        jobStart.setHours(startHour, startMin, 0, 0);
        
        const diff = jobStart.getTime() - now.getTime();
        // Between 29 and 31 minutes (fire once per check window)
        if (diff > 29 * 60 * 1000 && diff < 31 * 60 * 1000) {
          // In-app toast
          addToast(`🚗 תזכורת: בעוד 30 דקות - ${job.jobType} אצל ${job.customerName}`, 'warning');
          
          // Push notification
          if ('Notification' in window && Notification.permission === 'granted') {
            const n = new Notification('תזכורת תנועה 🚗', {
              body: `בעוד 30 דקות: ${job.jobType} אצל ${job.customerName}\n${job.address}`,
              icon: '/vite.svg',
              tag: `reminder-${job.id}`
            });
            n.onclick = () => {
              window.open(`https://waze.com/ul?q=${encodeURIComponent(job.address)}`, '_blank');
            };
          }
        }
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [jobs, addToast]);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="pb-24">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">שלום, {profile?.name?.split(' ')[0]} 👋</h2>
          <p className="text-gray-500 dark:text-gray-400">לו"ז עבודה</p>
        </div>
        
        {/* Smart DND Toggle */}
        <button 
          onClick={toggleWorkingMode}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
            isWorking 
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          {isWorking ? <ShieldOff size={16} /> : <Shield size={16} />}
          {isWorking ? 'בעבודה' : 'רגיל'}
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        {/* In RTL, Right arrow means Previous, Left arrow means Next */}
        <button onClick={() => changeDate(-1)} className="p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-slate dark:text-gray-300 transition-colors">
          <ChevronRight size={20} />
        </button>
        
        <div 
          className="relative flex items-center justify-center flex-1 cursor-pointer"
          onClick={(e) => {
            const input = e.currentTarget.querySelector('input');
            if (input && 'showPicker' in HTMLInputElement.prototype) {
              try { input.showPicker(); } catch (err) {}
            }
          }}
        >
          {/* Invisible native date picker overlapping the text */}
          <input 
            type="date" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            value={dateStr}
            onChange={(e) => {
              if (e.target.value) setCurrentDate(new Date(e.target.value));
            }}
            onClick={(e) => {
              // Also trigger on direct input click just in case
              if ('showPicker' in HTMLInputElement.prototype) {
                try { (e.target as HTMLInputElement).showPicker(); } catch (err) {}
              }
            }}
          />
          <div className="font-bold text-lg dark:text-white flex items-center gap-2">
            {currentDate.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' })}
            <span className="text-gray-400 text-sm">📅</span>
          </div>
        </div>

        <button onClick={() => changeDate(1)} className="p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-slate dark:text-gray-300 transition-colors">
          <ChevronLeft size={20} />
        </button>
      </div>

      {pendingJobs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-5xl mb-4">☕</div>
          <h3 className="text-lg font-bold dark:text-white mb-2">אין משימות פתוחות</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">הוסף עבודה חדשה דרך כפתור ה-+</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sorting visually by time window could go here */}
          {pendingJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onComplete={(completedJob) => setSelectedJob(completedJob)} 
              onFollowUp={(job) => setFollowUpJob(job)}
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <PaymentModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
      
      {followUpJob && (
        <FollowUpModal job={followUpJob} onClose={() => setFollowUpJob(null)} />
      )}
    </div>
  );
};

export default Agenda;
