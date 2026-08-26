import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JobStatus = 'pending' | 'completed' | 'cancelled';
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
  phone: string;
  taxCeiling: number;
  profession?: string;
  customJobTypes?: string[];
}

export interface Settings {
  darkMode: boolean;
  smsReminders: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  smsReminders: true
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
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      settings: DEFAULT_SETTINGS,
      jobs: [],
      expenses: [],
      toasts: [],

      setProfile: (profile) => set({ profile }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      addJob: (jobData) => set((state) => {
        const newJob = {
          ...jobData,
          id: Date.now().toString(),
          status: 'pending' as const
        };
        // Add toast when a job is added (New request simulation)
        setTimeout(() => {
          useAppStore.getState().addToast(`עבודה חדשה התקבלה: ${jobData.jobType} אצל ${jobData.customerName}`, 'info');
        }, 500);
        
        return { jobs: [...state.jobs, newJob] };
      }),

      updateJob: (id, updates) => set((state) => {
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
      }),

      addExpense: (expenseData) => set((state) => ({
        expenses: [...state.expenses, {
          ...expenseData,
          id: Date.now().toString()
        }]
      })),

      updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
      })),

      removeExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),
      
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
      closeExpenseModal: () => set({ isExpenseModalOpen: false, editingExpenseId: null })
    }),
    {
      name: 'tami-app-storage',
    }
  )
);
