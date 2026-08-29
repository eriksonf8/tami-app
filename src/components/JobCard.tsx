import React, { useState } from 'react';
import { motion, useAnimation, type PanInfo } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, CheckCircle2, ChevronDown, ChevronUp, FileEdit } from 'lucide-react';
import { type Job } from '../store/useAppStore';
import Confetti from 'react-confetti';

interface JobCardProps {
  job: Job;
  onComplete: (job: Job) => void;
  onFollowUp: (job: Job) => void;
  onEdit?: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onComplete, onFollowUp, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const controls = useAnimation();
  const [isCompleted, setIsCompleted] = useState(job.status === 'completed');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const handleDragEnd = async (_e: any, info: PanInfo) => {
    if (isCompleted) return;
    
    // Check if swiped far enough in either direction
    if (Math.abs(info.offset.x) > 100) {
      // Animate out in the direction they swiped
      const direction = info.offset.x > 0 ? '100%' : '-100%';
      await controls.start({ x: direction, opacity: 0, transition: { duration: 0.2 } });
      setIsCompleted(true);
      setShowConfetti(true);
      
      if (window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
      
      setTimeout(() => {
        onComplete(job);
        setShowConfetti(false);
      }, 2500);
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: 'spring' } });
    }
  };

  const openWaze = () => {
    window.open(`https://waze.com/ul?q=${encodeURIComponent(job.address)}`, '_blank');
  };

  const sendWhatsApp = (msg: string) => {
    window.open(`https://wa.me/${job.phone.replace(/^0/, '972')}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowQuickReplies(false);
  };

  if (isCompleted && !showConfetti) {
    return null; // Usually we'd show it in a completed list, but for today's agenda, we might just hide or grey it out.
  }

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
        </div>
      )}
      
      <div className="relative mb-4 bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
        {/* Background indicating swipe action */}
        <div className="absolute inset-y-0 left-0 right-0 bg-sage flex items-center px-6 justify-start z-0 rounded-2xl">
          <span className="text-white font-bold flex items-center gap-2 text-lg">
            <CheckCircle2 size={24} /> סיום משימה
          </span>
        </div>

        <motion.div
          drag={isCompleted || job.status === 'pending' ? false : "x"}
          dragConstraints={{ left: -150, right: 150 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ touchAction: 'pan-y' }}
          className={`relative z-10 bg-white dark:bg-slate-light border border-gray-100 dark:border-gray-600 rounded-2xl shadow-sm p-4 ${isCompleted ? 'bg-sage-light text-white' : ''}`}
        >
          <div className="flex justify-between items-start" onClick={() => setExpanded(!expanded)}>
            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Clock size={14} />
                <span>{job.timeWindow}</span>
              </div>
              <h3 className="font-bold text-lg dark:text-white">{job.customerName} - {job.jobType}</h3>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-1">
                <MapPin size={16} className="text-sage" /> {job.address}
              </p>
            </div>
            <div className="text-gray-400">
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {/* Action Row */}
          {!expanded && !isCompleted && (
            <div className="flex justify-around mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
              <button onClick={openWaze} className="flex flex-col items-center gap-1 text-slate dark:text-gray-300">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <MapPin size={20} />
                </div>
                <span className="text-xs">ניווט</span>
              </button>
              <a href={`tel:${job.phone}`} className="flex flex-col items-center gap-1 text-slate dark:text-gray-300">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Phone size={20} />
                </div>
                <span className="text-xs">התקשר</span>
              </a>
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setShowQuickReplies(!showQuickReplies); }} className="flex flex-col items-center gap-1 text-slate dark:text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <MessageCircle size={20} />
                  </div>
                  <span className="text-xs">וואצאפ</span>
                </button>
                {showQuickReplies && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-20">
                    <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("אני בדרך אליך"); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm border-b dark:border-gray-700 dark:text-white">🚗 אני בדרך אליך</button>
                    <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("מתעכב כמה דקות, סליחה!"); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm border-b dark:border-gray-700 dark:text-white">⏳ מתעכב כמה דקות</button>
                    <button onClick={(e) => { e.stopPropagation(); sendWhatsApp(""); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-white font-bold">💬 פתח שיחה חופשית</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg col-span-2 sm:col-span-1">
                  <strong>טלפון:</strong> <a href={`tel:${job.phone}`} className="text-blue-500 underline ml-1" onClick={e => e.stopPropagation()}>{job.phone}</a>
                </div>
                {job.secondaryPhone && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg col-span-2 sm:col-span-1">
                    <strong>טלפון 2:</strong> <a href={`tel:${job.secondaryPhone}`} className="text-blue-500 underline ml-1" onClick={e => e.stopPropagation()}>{job.secondaryPhone}</a>
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"><strong>קומה:</strong> {job.floor || '-'}</div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"><strong>דירה:</strong> {job.apartment || '-'}</div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"><strong>מעלית:</strong> {job.hasElevator ? 'יש' : 'אין'}</div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"><strong>קוד:</strong> {job.entryCode || '-'}</div>
              </div>
              {job.parking && (
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg mt-2">
                  <strong>הוראות חניה:</strong> {job.parking}
                </div>
              )}
              
              {job.followUpNote && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/50 mt-3 font-medium">
                  <strong>פולואפ:</strong> {job.followUpNote}
                  {job.partialPayment && job.partialPayment > 0 ? ` (שולם חלקית: ₪${job.partialPayment})` : ''}
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button onClick={(e) => { e.stopPropagation(); openWaze(); }} className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 py-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-colors">
                  <MapPin size={20} />
                  <span>נווט</span>
                </button>
                <a href={`tel:${job.phone}`} onClick={e => e.stopPropagation()} className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 py-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-colors">
                  <Phone size={20} />
                  <span>חייג</span>
                </a>
                <button onClick={(e) => { e.stopPropagation(); setShowQuickReplies(!showQuickReplies); }} className={`py-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-colors ${showQuickReplies ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400'}`}>
                  <MessageCircle size={20} />
                  <span>וואצאפ</span>
                </button>
              </div>

              {/* WhatsApp Quick Replies Inline Menu */}
              {showQuickReplies && (
                <div className="mt-2 bg-emerald-50 dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col">
                  <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("אני בדרך אליך"); }} className="text-right px-4 py-3 hover:bg-emerald-100 dark:hover:bg-gray-700 text-emerald-800 dark:text-emerald-300 font-medium border-b border-emerald-100 dark:border-gray-700">🚗 אני בדרך אליך</button>
                  <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("מתעכב כמה דקות, סליחה!"); }} className="text-right px-4 py-3 hover:bg-emerald-100 dark:hover:bg-gray-700 text-emerald-800 dark:text-emerald-300 font-medium border-b border-emerald-100 dark:border-gray-700">⏳ מתעכב כמה דקות</button>
                  <button onClick={(e) => { e.stopPropagation(); sendWhatsApp(""); }} className="text-right px-4 py-3 hover:bg-emerald-100 dark:hover:bg-gray-700 text-emerald-800 dark:text-emerald-300 font-medium font-bold">💬 פתח שיחה חופשית</button>
                </div>
              )}
              
              <div className="flex gap-2 mt-4 mb-2">
                {job.status !== 'pending' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onFollowUp(job); }} 
                    className="flex-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                  >
                    <FileEdit size={18} />
                    פולו-אפ
                  </button>
                )}
                
                {onEdit && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(job); }} 
                    className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                  >
                    <FileEdit size={18} />
                    {job.status === 'pending' ? 'עריכה ואישור' : 'ערוך זמנים'}
                  </button>
                )}
              </div>

              {job.status === 'approved' && (
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    setIsCompleted(true);
                    setShowConfetti(true);
                    if (window.navigator.vibrate) window.navigator.vibrate(200);
                    setTimeout(() => {
                      onComplete(job);
                      setShowConfetti(false);
                    }, 2500);
                  }}
                  className="w-full bg-sage hover:bg-sage-dark text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <CheckCircle2 size={20} />
                  סיים עבודה וגבה תשלום
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default JobCard;
