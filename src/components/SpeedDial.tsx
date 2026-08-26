import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt, FileText, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const SpeedDial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const openExpenseModal = useAppStore(state => state.openExpenseModal);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Actions for the dial
  const actions = [
    {
      icon: <FileText size={20} />,
      label: "טופס לקוח",
      onClick: () => {
        setIsOpen(false);
        // Maybe copy the link to clipboard? Or navigate to /new
        navigate('/new');
      },
      delay: 0.1
    },
    {
      icon: <Receipt size={20} />,
      label: "הוצאה",
      onClick: () => {
        setIsOpen(false);
        openExpenseModal();
      },
      delay: 0.15
    },
    {
      icon: <CalendarPlus size={20} />,
      label: "הוסף עבודה",
      onClick: () => {
        setIsOpen(false);
        // For now, same as new customer form, but we can expand it later
        navigate('/new'); 
      },
      delay: 0.2
    }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center items-center">
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
            
            {/* The circular buttons */}
            {actions.map((action, index) => {
              // Calculate position on a semi-circle (arc) around the main button
              const angle = (Math.PI / (actions.length - 1)) * index;
              const radius = 80; // Distance from center
              
              // CSS coordinates: bottom-up so Y is negative
              const x = Math.cos(angle) * radius * -1; // -1 to flip left-to-right
              const y = Math.sin(angle) * radius * -1;

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  transition={{ delay: action.delay, type: 'spring', stiffness: 200, damping: 15 }}
                  onClick={action.onClick}
                  className="absolute bg-white dark:bg-gray-800 text-sage p-3 rounded-full shadow-xl flex items-center justify-center border-2 border-sage z-50 group"
                  style={{ width: 48, height: 48 }}
                >
                  {action.icon}
                  {/* Tooltip */}
                  <span className="absolute top-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
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
