import React, { useState } from 'react';
import { motion, useAnimation, type PanInfo } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, CheckCircle2, ChevronDown, ChevronUp, Navigation, Calendar, ClipboardList } from 'lucide-react';
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
    
    if (Math.abs(info.offset.x) > 100) {
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
    return null;
  }

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
        </div>
      )}
      
      <div className="relative mb-4 bg-gray-200 dark:bg-gray-700 rounded-[20px] overflow-hidden">
        <div className="absolute inset-y-0 left-0 right-0 bg-[#276749] flex items-center px-6 justify-start z-0 rounded-[20px]">
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
          className={`relative z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[20px] shadow-sm p-4 ${isCompleted ? 'bg-[#276749] text-white' : ''}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
              <span className="font-medium pt-0.5">{job.timeWindow}</span>
              <Clock size={16} />
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </div>
          </div>

          {/* Title & Address */}
          <div className="text-right mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-1.5 leading-tight">
              {job.customerName} - {job.jobType}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 flex items-center justify-start gap-1.5 text-sm">
              <MapPin size={16} className="text-gray-500" />
              <span className="pt-0.5">{job.address}</span>
            </p>
          </div>

          {!expanded && !isCompleted && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-2">
              <a href={`tel:${job.phone}`} onClick={e => e.stopPropagation()} className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-400 rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 font-bold transition-colors">
                <Phone size={22} />
                <span className="text-sm">חייג</span>
              </a>
              <button onClick={(e) => { e.stopPropagation(); setShowQuickReplies(!showQuickReplies); }} className="flex-1 bg-[#dcf8c6] hover:bg-[#c8efaf] dark:bg-[#128C7E]/30 dark:hover:bg-[#128C7E]/50 text-[#075e54] dark:text-[#25D366] rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 font-bold transition-colors">
                <MessageCircle size={22} />
                <span className="text-sm">וואצאפ</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); openWaze(); }} className="flex-1 bg-[#e6e8fa] hover:bg-[#d8dbf7] dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-[#1d1b84] dark:text-indigo-400 rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 font-bold transition-colors">
                <Navigation size={22} />
                <span className="text-sm">נווט</span>
              </button>
              </div>
              {showQuickReplies && (
                <div className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm mt-1">
                  <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("אני בדרך אליך"); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 dark:text-white">🚗 אני בדרך אליך</button>
                  <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("מתעכב כמה דקות, סליחה!"); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 dark:text-white">⏳ מתעכב כמה דקות</button>
                  <button onClick={(e) => { e.stopPropagation(); sendWhatsApp(""); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-white font-bold">💬 פתח שיחה חופשית</button>
                </div>
              )}
            </div>
          )}

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4">
              <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-4" />
              
              {/* Data Grid */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#f4f5f7] dark:bg-gray-700/50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">טלפון:</span>
                    <a href={`tel:${job.phone}`} className="font-semibold text-gray-900 dark:text-white" onClick={e => e.stopPropagation()}>{job.phone}</a>
                  </div>
                  <div className="w-24 bg-[#f4f5f7] dark:bg-gray-700/50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">קומה:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{job.floor || '-'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#f4f5f7] dark:bg-gray-700/50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">דירה:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{job.apartment || '-'}</span>
                  </div>
                  <div className="flex-1 bg-[#f4f5f7] dark:bg-gray-700/50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">מעלית:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{job.hasElevator ? 'יש' : 'אין'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#f4f5f7] dark:bg-gray-700/50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">קוד:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{job.entryCode || '-'}</span>
                  </div>
                  {job.secondaryPhone && (
                    <div className="flex-1 bg-[#f4f5f7] dark:bg-gray-700/50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">טלפון נוסף:</span>
                      <a href={`tel:${job.secondaryPhone}`} className="font-semibold text-gray-900 dark:text-white" onClick={e => e.stopPropagation()}>{job.secondaryPhone}</a>
                    </div>
                  )}
                </div>
                {job.parking && (
                  <div className="bg-[#f4f5f7] dark:bg-gray-700/50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">הוראות חניה:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{job.parking}</span>
                  </div>
                )}
              </div>

              {/* Top Actions Row */}
              <div className="flex flex-col gap-2 mb-3">
              <div className="flex gap-2">
                <a href={`tel:${job.phone}`} onClick={e => e.stopPropagation()} className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-400 rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 font-bold transition-colors">
                  <Phone size={22} />
                  <span className="text-sm">חייג</span>
                </a>
                <button onClick={(e) => { e.stopPropagation(); setShowQuickReplies(!showQuickReplies); }} className="flex-1 bg-[#dcf8c6] hover:bg-[#c8efaf] dark:bg-[#128C7E]/30 dark:hover:bg-[#128C7E]/50 text-[#075e54] dark:text-[#25D366] rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 font-bold transition-colors">
                  <MessageCircle size={22} />
                  <span className="text-sm">וואצאפ</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); openWaze(); }} className="flex-1 bg-[#e6e8fa] hover:bg-[#d8dbf7] dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-[#1d1b84] dark:text-indigo-400 rounded-xl py-3.5 flex flex-col items-center justify-center gap-1.5 font-bold transition-colors">
                  <Navigation size={22} />
                  <span className="text-sm">נווט</span>
                </button>
              </div>
              {/* WhatsApp Quick Replies Inline Menu */}
              {showQuickReplies && (
                  <div className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm mt-1">
                    <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("אני בדרך אליך"); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 dark:text-white">🚗 אני בדרך אליך</button>
                    <button onClick={(e) => { e.stopPropagation(); sendWhatsApp("מתעכב כמה דקות, סליחה!"); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 dark:text-white">⏳ מתעכב כמה דקות</button>
                    <button onClick={(e) => { e.stopPropagation(); sendWhatsApp(""); }} className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-white font-bold">💬 פתח שיחה חופשית</button>
                  </div>
                )}
              </div>

              {/* Secondary Actions Row */}
              <div className="flex gap-2 mb-4">
                {onEdit && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(job); }} 
                    className="flex-1 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Calendar size={18} />
                    <span className="text-sm">{job.status === 'pending' ? 'עריכה ואישור' : 'ערוך זמנים'}</span>
                  </button>
                )}
                {job.status !== 'pending' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onFollowUp(job); }} 
                    className="flex-1 bg-[#fbebc8] hover:bg-[#fae1b1] dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-[#855910] dark:text-orange-400 rounded-xl py-3 flex items-center justify-center gap-2 font-bold transition-colors"
                  >
                    <ClipboardList size={18} />
                    <span className="text-sm">פולו-אפ</span>
                  </button>
                )}
              </div>

              {job.followUpNote && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/50 mb-4 text-sm font-medium text-right">
                  <strong>פולואפ:</strong> {job.followUpNote}
                  {job.partialPayment && job.partialPayment > 0 ? ` (שולם חלקית: ₪${job.partialPayment})` : ''}
                </div>
              )}

              {/* Primary Action */}
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
                  className="w-full bg-[#276749] hover:bg-[#1f533a] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-extrabold text-[15px] shadow-sm transition-colors"
                >
                  <span>סיים עבודה וגבה תשלום</span>
                  <CheckCircle2 size={20} />
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
