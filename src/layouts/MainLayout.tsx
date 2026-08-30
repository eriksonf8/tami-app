import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { UserCircle } from 'lucide-react';

import SpeedDial from '../components/SpeedDial';
import ExpenseModal from '../components/ExpenseModal';

const MainLayout: React.FC = () => {
  const [showCrmModal, setShowCrmModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative pb-20 bg-slate-50 dark:bg-gray-950">
      <header className="bg-slate-50 dark:bg-gray-950 text-[#0f172a] dark:text-white p-4 sticky top-0 z-30 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div className="w-8"></div>
        <h1 className="text-xl font-extrabold text-center tracking-tight">זה Tami</h1>
        <button className="p-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 rounded-full transition-colors" onClick={() => window.location.href = '/profile'}>
          <UserCircle size={24} className="text-gray-600 dark:text-gray-400" />
        </button>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        <Outlet />
      </main>

      <SpeedDial onOpenCrm={() => setShowCrmModal(true)} />
      <BottomNav />
      <ExpenseModal />

      {/* Basic CRM Modal placeholder */}
      {showCrmModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 dark:text-white">פתיחת קריאה חדשה</h2>
            <p className="text-sm text-gray-500 mb-4">הזן מספר טלפון לשליחת טופס קליטה ללקוח</p>
            <input 
              type="tel" 
              placeholder="05X-XXXXXXX" 
              className="w-full p-3 border rounded-xl mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              id="phoneInput"
            />
            <div className="flex gap-2">
              <button 
                className="flex-1 bg-sage text-white py-3 rounded-xl font-medium"
                onClick={() => {
                  const phone = (document.getElementById('phoneInput') as HTMLInputElement).value;
                  if (phone) {
                    const link = `${window.location.origin}/onboarding?phone=${phone}`;
                    const msg = `היי, מלינק זה תוכל למלא את הפרטים לעבודה: ${link}`;
                    window.open(`https://wa.me/${phone.replace(/^0/, '972')}?text=${encodeURIComponent(msg)}`, '_blank');
                    setShowCrmModal(false);
                  }
                }}
              >
                שלח בוואצאפ
              </button>
              <button 
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-white"
                onClick={() => setShowCrmModal(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
