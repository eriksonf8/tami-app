import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Wallet, LayoutDashboard, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const BottomNav: React.FC = () => {
  const jobs = useAppStore(state => state.jobs);
  const hasUnpaidDebts = jobs.some(j => j.status === 'completed' && j.paymentMethod === 'unpaid');

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/', icon: CalendarDays, label: 'Schedule' },
    { to: '/finances', icon: Wallet, label: 'Money', badge: hasUnpaidDebts },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-40 px-2">
      <div className="flex justify-between items-center h-16">
        {navItems.map((item, index) => {
          const isSpacer = index === 2;
          
          return (
            <React.Fragment key={item.to}>
              {isSpacer && <div className="w-16 flex-shrink-0" /> /* Spacer for FAB */}
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                    isActive
                      ? 'text-slate-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                      )}
                    </div>
                    <span className="text-[10px] mt-1 font-semibold">{item.label}</span>
                  </>
                )}
              </NavLink>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
