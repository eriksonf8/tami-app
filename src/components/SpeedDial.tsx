import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt, FileText } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface SpeedDialProps {
  onOpenCrm: () => void;
}

const SpeedDial: React.FC<SpeedDialProps> = ({ onOpenCrm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openExpenseModal = useAppStore(state => state.openExpenseModal);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Actions for the dial
  const actions = [
    {
      icon: <Receipt size={20} />,
      label: "הוצאה חדשה",
      onClick: () => {
        setIsOpen(false);
        openExpenseModal();
      }
    },
    {
      icon: <FileText size={20} />,
      label: "שליחת טופס לקוח",
      onClick: () => {
        setIsOpen(false);
        onOpenCrm();
      }
    }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* The vertical buttons */}
            <div className="absolute bottom-16 flex flex-col items-center gap-3 z-50 mb-2">
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={action.onClick}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 text-sage p-3 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 w-max pr-5 pl-4 group hover:bg-sage hover:text-white transition-colors"
                >
                  <span className="font-bold text-sm">{action.label}</span>
                  <div className="bg-sage/10 group-hover:bg-white/20 p-2 rounded-full">
                    {action.icon}
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button 
        onClick={toggleOpen}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="bg-sage text-white p-4 rounded-full shadow-[0_4px_20px_rgba(46,125,119,0.4)] flex items-center justify-center relative z-50"
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
};

export default SpeedDial;
