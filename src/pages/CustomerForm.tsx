import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const CustomerForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const phoneFromUrl = searchParams.get('phone') || '';
  
  const addJob = useAppStore(state => state.addJob);
  const [submitted, setSubmitted] = useState(false);
  
  const jobs = useAppStore(state => state.jobs);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: phoneFromUrl,
    secondaryPhone: '',
    address: '',
    floor: '',
    apartment: '',
    entryCode: '',
    parking: '',
    hasElevator: false,
    preferredDate: new Date().toISOString().split('T')[0],
    timeWindow: '',
    jobType: ''
  });

  // Calculate available time windows for the selected date
  const allTimeWindows = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];
  const bookedWindows = jobs
    .filter(j => j.date === formData.preferredDate && j.status === 'pending')
    .map(j => j.timeWindow);
    
  const availableWindows = allTimeWindows.filter(w => !bookedWindows.includes(w));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.timeWindow) {
      alert('נא לבחור חלון זמן פנוי');
      return;
    }
    
    // Extract preferredDate out of formData since Job doesn't have it directly named as preferredDate
    const { preferredDate, ...jobData } = formData;
    
    addJob({
      ...jobData,
      date: preferredDate,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-sage text-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-2">תודה רבה!</h2>
          <p className="text-gray-600">הפרטים התקבלו בהצלחה. ניפגש בקרוב.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite p-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate p-6 text-white text-center">
          <h1 className="text-2xl font-bold">טופס קליטת לקוח</h1>
          <p className="opacity-80 text-sm mt-1">נא למלא את הפרטים לקראת הגעתנו</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">שם מלא</label>
            <input required type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
              value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">טלפון נייד</label>
              <input required type="tel" className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-sage outline-none ${phoneFromUrl ? 'bg-gray-200 text-gray-500' : 'bg-gray-50'}`} 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} readOnly={!!phoneFromUrl} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">טלפון נוסף (רשות)</label>
              <input type="tel" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
                value={formData.secondaryPhone} onChange={e => setFormData({...formData, secondaryPhone: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">סוג העבודה</label>
            <input required type="text" placeholder="לדוגמה: תיקון מזגן, התקנת ברז..." className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
              value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">כתובת מלאה</label>
            <input required type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">קומה</label>
              <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
                value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">דירה</label>
              <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
                value={formData.apartment} onChange={e => setFormData({...formData, apartment: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">קוד אינטרקום / כניסה</label>
            <input type="text" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
              value={formData.entryCode} onChange={e => setFormData({...formData, entryCode: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">הוראות חניה</label>
            <input type="text" placeholder="היכן כדאי לחנות?" className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
              value={formData.parking} onChange={e => setFormData({...formData, parking: e.target.value})} />
          </div>
          
          <label className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-sage" 
              checked={formData.hasElevator} onChange={e => setFormData({...formData, hasElevator: e.target.checked})} />
            <span className="font-medium">יש מעלית?</span>
          </label>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">תאריך מבוקש</label>
              <input type="date" required className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none" 
                value={formData.preferredDate} onChange={e => setFormData({...formData, preferredDate: e.target.value, timeWindow: ''})} 
                min={new Date().toISOString().split('T')[0]} />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">חלון זמן</label>
              <select className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-sage outline-none"
                value={formData.timeWindow} 
                onChange={e => {
                  const val = e.target.value;
                  setFormData({...formData, timeWindow: val});
                  if (!availableWindows.includes(val)) {
                    useAppStore.getState().addToast('⚠️ שים לב: חלון הזמן הזה כבר תפוס!', 'warning');
                  }
                }}
                required
              >
                <option value="" disabled>בחר זמן</option>
                {allTimeWindows.map(w => (
                  <option key={w} value={w} className={!availableWindows.includes(w) ? "text-amber-600 font-bold" : ""}>
                    {w} {!availableWindows.includes(w) ? '(תפוס)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-sage text-white font-bold text-lg py-4 rounded-xl shadow-md mt-6 active:scale-95 transition-transform">
            שלח פרטים
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
