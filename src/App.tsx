import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useAppStore } from './store/useAppStore';

// Lazy loading pages for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Agenda = React.lazy(() => import('./pages/Agenda'));
const Finances = React.lazy(() => import('./pages/Finances'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));
const CustomerForm = React.lazy(() => import('./pages/CustomerForm'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const profile = useAppStore(state => state.profile);
  if (!profile) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const darkMode = useAppStore(state => state.settings.darkMode);
  const toasts = useAppStore(state => state.toasts);
  const removeToast = useAppStore(state => state.removeToast);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div className="flex h-screen items-center justify-center dark:text-white">טוען...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<CustomerForm />} />
          
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<Agenda />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
      
      {/* Global Toasts */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[999] w-[90%] max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg flex items-center justify-between text-white animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto ${
              toast.type === 'success' ? 'bg-emerald-500' :
              toast.type === 'warning' ? 'bg-amber-500 text-amber-950' :
              'bg-sage-dark'
            }`}
          >
            <p className="font-medium text-sm">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100">
              ×
            </button>
          </div>
        ))}
      </div>
    </BrowserRouter>
  );
};

export default App;
