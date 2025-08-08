import { create } from 'zustand';
import { Product, GroupBuy, User } from '@/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Group buy creation state
  creationForm: {
    product_url: string;
    title: string;
    description: string;
    min_participants: number;
    max_participants: number;
    deadline: string;
  };
  setCreationForm: (form: Partial<AppState['creationForm']>) => void;
  
  // Product detection state
  detectedProduct: Product | null;
  isDetecting: boolean;
  detectionError: string | null;
  setDetectedProduct: (product: Product | null) => void;
  setIsDetecting: (isDetecting: boolean) => void;
  setDetectionError: (error: string | null) => void;
  
  // Preview state
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  
  // Active group buy
  activeGroupBuy: GroupBuy | null;
  setActiveGroupBuy: (groupBuy: GroupBuy | null) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Reset all state
  reset: () => void;
}

const defaultCreationForm = {
  product_url: '',
  title: '',
  description: '',
  min_participants: 10,
  max_participants: 50,
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
};

export const useAppStore = create<AppState>((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Creation form state
  creationForm: defaultCreationForm,
  setCreationForm: (form) => set((state) => ({
    creationForm: { ...state.creationForm, ...form }
  })),
  
  // Product detection state
  detectedProduct: null,
  isDetecting: false,
  detectionError: null,
  setDetectedProduct: (product) => set({ detectedProduct: product }),
  setIsDetecting: (isDetecting) => set({ isDetecting }),
  setDetectionError: (error) => set({ detectionError: error }),
  
  // Preview state
  previewMode: 'desktop',
  setPreviewMode: (mode) => set({ previewMode: mode }),
  
  // Active group buy
  activeGroupBuy: null,
  setActiveGroupBuy: (groupBuy) => set({ activeGroupBuy: groupBuy }),
  
  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Reset function
  reset: () => set({
    creationForm: defaultCreationForm,
    detectedProduct: null,
    isDetecting: false,
    detectionError: null,
    previewMode: 'desktop',
    activeGroupBuy: null,
    isLoading: false,
  }),
}));
