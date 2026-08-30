import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';

export type JobStatus = 'pending' | 'approved' | 'completed' | 'cancelled';
export type PaymentStatus = 'cash' | 'bit' | 'transfer' | 'unpaid' | 'none';

export interface Job {
  id: string;
  customerName: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  floor?: string;
  apartment?: string;
  entryCode?: string;
  parking?: string;
  hasElevator: boolean;
  timeWindow: string; // e.g., '08:00-10:00'
  jobType: string;
  status: JobStatus;
  date: string; // YYYY-MM-DD
  price?: number;
  partialPayment?: number;
  paymentMethod?: PaymentStatus;
  notes?: string;
  followUpNote?: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category?: string;
  photoUrl?: string; // Base64 or local URL
  description?: string;
}

export interface UserProfile {
  name: string;
  businessName: string;
  businessId?: string; // תעודת זהות / ח.פ
  phone: string;
  email?: string;
  taxCeiling: number;
  profession?: string;
  customJobTypes?: string[];
  photoUrl?: string;
  accountantEmail?: string;
  businessHours?: { start: string; end: string; closedDays: number[] };
  enableMonthlyGoal?: boolean;
  enableConfetti?: boolean;
  quickMessages?: {
    imOutside?: string;
    onMyWay?: string;
    delayed?: string;
  };
}

export interface Settings {
  darkMode: boolean;
  smsReminders: boolean;
  pushNewCustomer: boolean;
  pushDebt: boolean;
  pushConflict: boolean;
  textSize: 'normal' | 'large' | 'xlarge';
  reduceMotion: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  smsReminders: true,
  pushNewCustomer: true,
  pushDebt: true,
  pushConflict: true,
  textSize: 'normal',
  reduceMotion: false
};

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface AppState {
  profile: UserProfile | null;
  settings: Settings;
  jobs: Job[];
  expenses: Expense[];
  toasts: Toast[];
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addJob: (job: Omit<Job, 'id' | 'status'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  
  addToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  
  isWorking: boolean;
  toggleWorkingMode: () => void;
  
  isExpenseModalOpen: boolean;
  editingExpenseId: string | null;
  openExpenseModal: (expenseId?: string) => void;
  closeExpenseModal: () => void;
  
  initializeFirebase: () => void;
  addTestJobs: (jobs: Job[]) => void;
  clearApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      settings: DEFAULT_SETTINGS,
      jobs: [],
      expenses: [],
      toasts: [],
      
      initializeFirebase: () => {
        // Listen to jobs
        onSnapshot(collection(db, 'jobs'), (snapshot) => {
          const fetchedJobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Job));
          set({ jobs: fetchedJobs });
        });
        // Listen to expenses
        onSnapshot(collection(db, 'expenses'), (snapshot) => {
          const fetchedExpenses = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Expense));
          set({ expenses: fetchedExpenses });
        });
        // Listen to profile
        onSnapshot(doc(db, 'system', 'profile'), (docSnap) => {
          if (docSnap.exists()) {
            set({ profile: docSnap.data() as UserProfile });
          }
        });
        // Listen to settings
        onSnapshot(doc(db, 'system', 'settings'), (docSnap) => {
          if (docSnap.exists()) {
            set({ settings: docSnap.data() as Settings });
          }
        });
      },

      setProfile: (profile) => {
        set({ profile });
        setDoc(doc(db, 'system', 'profile'), profile).catch(console.error);
      },
      
      updateSettings: (newSettings) => {
        set((state) => {
          const updated = { ...state.settings, ...newSettings };
          setDoc(doc(db, 'system', 'settings'), updated).catch(console.error);
          return { settings: updated };
        });
      },

      addJob: (jobData) => {
        const id = Date.now().toString();
        const newJob = {
          ...jobData,
          id,
          status: 'pending' as const,
          paymentMethod: 'unpaid' as const
        };
        
        // Optimistic update
        set((state) => ({ jobs: [...state.jobs, newJob] }));
        
        // Save to Firebase
        setDoc(doc(db, 'jobs', id), newJob).catch(console.error);

        // Add toast when a job is added (New request simulation)
        setTimeout(() => {
          useAppStore.getState().addToast(`עבודה חדשה התקבלה: ${jobData.jobType} אצל ${jobData.customerName}`, 'info');
        }, 500);
      },

      updateJob: (id, updates) => {
        set((state) => {
          const job = state.jobs.find(j => j.id === id);
          if (job && updates.status === 'completed' && job.status !== 'completed') {
            setTimeout(() => useAppStore.getState().addToast('כל הכבוד! עבודה נוספת הושלמה 💪', 'success'), 300);
          }
          if (job && updates.paymentMethod === 'bit' && job.paymentMethod === 'unpaid') {
            setTimeout(() => useAppStore.getState().addToast('איזה יופי! החוב נסגר בהצלחה 💸', 'success'), 300);
          }
          return {
            jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
          };
        });
        
        updateDoc(doc(db, 'jobs', id), updates).catch(console.error);
      },

      addExpense: (expenseData) => {
        const id = Date.now().toString();
        const newExpense = { ...expenseData, id };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
        setDoc(doc(db, 'expenses', id), newExpense).catch(console.error);
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
        }));
        updateDoc(doc(db, 'expenses', id), updates).catch(console.error);
      },

      removeExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter(e => e.id !== id)
        }));
        deleteDoc(doc(db, 'expenses', id)).catch(console.error);
      },
      
      addToast: (message, type = 'info') => set((state) => {
        // Smart DND: block non-urgent notifications if working
        if (state.isWorking && type === 'info') {
          return state; // skip
        }
        const id = Date.now().toString();
        // Auto remove after 4 seconds
        setTimeout(() => {
          useAppStore.getState().removeToast(id);
        }, 4000);
        return { toasts: [...state.toasts, { id, message, type }] };
      }),
      
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      isWorking: false,
      toggleWorkingMode: () => set((state) => {
        const nextState = !state.isWorking;
        setTimeout(() => {
          if (nextState) {
            useAppStore.getState().addToast('מצב עבודה הופעל: השתקה חכמה פעילה 🤫', 'success');
          } else {
            useAppStore.getState().addToast('מצב עבודה כובה: התראות רגילות חזרו', 'success');
          }
        }, 10);
        return { isWorking: nextState };
      }),
      
      isExpenseModalOpen: false,
      editingExpenseId: null,
      openExpenseModal: (expenseId) => set({ isExpenseModalOpen: true, editingExpenseId: expenseId || null }),
      closeExpenseModal: () => set({ isExpenseModalOpen: false, editingExpenseId: null }),

      addTestJobs: (jobs) => {
        jobs.forEach(job => {
          setDoc(doc(db, 'jobs', job.id), job).catch(console.error);
        });
        useAppStore.getState().addToast('נוספו ' + jobs.length + ' עבודות בדיקה בהצלחה!', 'success');
      },

      clearApp: async () => {
        set({ jobs: [], expenses: [], profile: null as any });
        try {
          const jobsRef = collection(db, 'jobs');
          const qJobs = await getDocs(jobsRef);
          qJobs.forEach(d => deleteDoc(d.ref));
          
          const expRef = collection(db, 'expenses');
          const qExp = await getDocs(expRef);
          qExp.forEach(d => deleteDoc(d.ref));
          
          await deleteDoc(doc(db, 'system', 'profile'));
          useAppStore.getState().addToast('כל הנתונים נמחקו בהצלחה!', 'success');
        } catch (error) {
          console.error("Error clearing app data:", error);
          useAppStore.getState().addToast('שגיאה במחיקת הנתונים', 'warning');
        }
      }
    }),
    {
      name: 'tami-app-storage',
    }
  )
);
