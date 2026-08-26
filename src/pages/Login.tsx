import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const Login: React.FC = () => {
  const setProfile = useAppStore(state => state.setProfile);
  const profile = useAppStore(state => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      navigate('/', { replace: true });
    }
  }, [profile, navigate]);
  
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    taxCeiling: 120000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.businessName) {
      setProfile(formData);
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-offwhite dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate dark:text-white mb-2">ברוכים הבאים לתמי</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">המזכירה הווירטואלית שלך</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">שם מלא</label>
            <input 
              required
              type="text"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="ישראל ישראלי"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">שם העסק</label>
            <input 
              required
              type="text"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none transition-all"
              value={formData.businessName}
              onChange={e => setFormData({...formData, businessName: e.target.value})}
              placeholder="ישראל אינסטלציה"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">טלפון העסק (לוואצאפ)</label>
            <input 
              required
              type="tel"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none transition-all"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="05X-XXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">תקרת מס שנתית (לעוסק פטור)</label>
            <input 
              required
              type="number"
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-sage outline-none transition-all"
              value={formData.taxCeiling}
              onChange={e => setFormData({...formData, taxCeiling: Number(e.target.value)})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-sage hover:bg-sage-dark text-white py-4 rounded-xl font-bold text-lg mt-6 shadow-md transition-colors"
          >
            התחל לעבוד
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
