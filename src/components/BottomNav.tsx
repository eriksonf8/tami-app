import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Wallet, LayoutDashboard, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const BottomNav: React.FC = () => {
  const jobs = useAppStore(state => state.jobs);
  const hasUnpaidDebts = jobs.some(j => j.status === 'completed' && j.paymentMethod === 'unpaid');

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'דאשבורד', activeColor: 'text-indigo-600 dark:text-indigo-400', activeBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { to: '/', icon: CalendarDays, label: 'לו"ז', activeColor: 'text-blue-600 dark:text-blue-400', activeBg: 'bg-blue-50 dark:bg-blue-500/10' },
    { to: '/finances', icon: Wallet, label: 'כספים', badge: hasUnpaidDebts, activeColor: 'text-emerald-600 dark:text-emerald-400', activeBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { to: '/settings', icon: Settings, label: 'הגדרות', activeColor: 'text-slate-700 dark:text-slate-300', activeBg: 'bg-slate-100 dark:bg-slate-800' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-safe z-40 px-2 shadow-[0_-4px_25px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center h-16">
        {navItems.map((item, index) => {
          const isSpacer = index === 2;
          
          return (
            <React.Fragment key={item.to}>
              {isSpacer && <div className="w-16 flex-shrink-0" /> /* Spacer for FAB */}
              <NavLink
                to={item.to}
                onClick={() => {
                  const isActive = window.location.pathname === item.to;
                  if (isActive) {
                    if (item.to === '/dashboard') window.dispatchEvent(new Event('reset-dashboard'));
                    if (item.to === '/finances') window.dispatchEvent(new Event('reset-finances'));
                    if (item.to === '/') window.dispatchEvent(new Event('reset-agenda'));
                  }
                }}
                className="flex flex-col items-center justify-center w-16 h-full group"
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${isActive ? item.activeBg : 'bg-transparent group-hover:bg-gray-50 dark:group-hover:bg-gray-800'}`}>
                      <item.icon 
                        size={20} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={`transition-all duration-300 ${item.activeColor} ${isActive ? 'opacity-100' : 'opacity-60'}`}
                      />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></span>
                      )}
                    </div>
                    <span className={`text-[10px] mt-1 font-semibold transition-all duration-300 ${item.activeColor} ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                      {item.label}
                    </span>
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
