import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Wallet, LayoutDashboard, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const BottomNav: React.FC = () => {
  const jobs = useAppStore(state => state.jobs);
  const hasUnpaidDebts = jobs.some(j => j.status === 'completed' && j.paymentMethod === 'unpaid');

  const navItems = [
    { to: '/', icon: CalendarDays, label: 'לו"ז' },
    { to: '/finances', icon: Wallet, label: 'כספים', badge: hasUnpaidDebts },
    { to: '/dashboard', icon: LayoutDashboard, label: 'דאשבורד' },
    { to: '/settings', icon: Settings, label: 'הגדרות' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-dark border-t border-gray-200 dark:border-gray-800 pb-safe z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item, index) => {
          const isSpacer = index === 2;
          
          return (
            <React.Fragment key={item.to}>
              {isSpacer && <div className="w-16" /> /* Spacer for FAB */}
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-16 h-full transition-colors ${
                    isActive
                      ? 'text-sage-DEFAULT'
                      : 'text-gray-400 dark:text-gray-500 hover:text-sage-light'
                  }`
                }
              >
                <div className="relative">
                  <item.icon size={24} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
