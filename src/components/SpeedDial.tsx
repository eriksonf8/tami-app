import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt, UserPlus, ChevronLeft, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface SpeedDialProps {
  onOpenCrm: () => void;
}

const SpeedDial: React.FC<SpeedDialProps> = ({ onOpenCrm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openExpenseModal = useAppStore(state => state.openExpenseModal);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* The Menu Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-20 w-[90vw] max-w-sm bg-slate-50 dark:bg-gray-800 rounded-3xl p-6 shadow-2xl z-50 flex flex-col gap-4 border border-white/50 dark:border-gray-700"
            >
              <div className="text-center mb-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">פעולה מהירה</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">בחר את הפעולה שברצונך לבצע</p>
              </div>

              <button 
                onClick={() => { setIsOpen(false); onOpenCrm(); }}
                className="w-full bg-[#276749] text-white p-4 rounded-2xl flex items-center justify-between transition-transform active:scale-[0.98] shadow-md shadow-[#276749]/20"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                    <UserPlus size={24} />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg leading-tight">יצירת לקוח חדש</div>
                    <div className="text-xs text-white/80 font-medium">הוסף פרטי התקשרות</div>
                  </div>
                </div>
                <ChevronLeft className="text-white/70" size={20} />
              </button>

              <button 
                onClick={() => { setIsOpen(false); openExpenseModal(); }}
                className="w-full bg-[#B91C1C] text-white p-4 rounded-2xl flex items-center justify-between transition-transform active:scale-[0.98] shadow-md shadow-[#B91C1C]/20"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                    <Receipt size={24} />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg leading-tight">יצירת הוצאה חדשה</div>
                    <div className="text-xs text-white/80 font-medium">תעד הוצאה עסקית</div>
                  </div>
                </div>
                <ChevronLeft className="text-white/70" size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB - Rotated Square Design */}
      <motion.button 
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center relative z-50 transition-colors duration-300 bg-[#0f172a] rotate-45`}
      >
        <motion.div 
          animate={{ rotate: isOpen ? 45 : -45 }}
          className="text-white flex items-center justify-center"
        >
          {isOpen ? <X size={28} /> : <Plus size={28} />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default SpeedDial;
