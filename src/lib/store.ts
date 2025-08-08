import { create } from 'zustand';
import { Product, GroupOrder, User, CountryCode, CreateOrderData, PricingRequest, ShippingRequest } from '@/types';
import { DEFAULT_VALUES, getCountryConfig } from '@/lib/constants';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // User's detected country
  userCountry: CountryCode;
  setUserCountry: (country: CountryCode) => void;
  
  // Order creation state
  creationForm: CreateOrderData;
  setCreationForm: (form: Partial<CreateOrderData>) => void;
  
  // Product detection state
  detectedProduct: Product | null;
  isDetecting: boolean;
  detectionError: string | null;
  setDetectedProduct: (product: Product | null) => void;
  setIsDetecting: (isDetecting: boolean) => void;
  setDetectionError: (error: string | null) => void;
  
  // AI Agent state
  pricingAI: {
    isOpen: boolean;
    isLoading: boolean;
    request: PricingRequest | null;
    response: any | null;
    error: string | null;
  };
  setPricingAI: (state: Partial<AppState['pricingAI']>) => void;
  
  shippingAI: {
    isOpen: boolean;
    isLoading: boolean;
    request: ShippingRequest | null;
    response: any | null;
    error: string | null;
  };
  setShippingAI: (state: Partial<AppState['shippingAI']>) => void;
  
  // Preview state
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  
  // Active order
  activeOrder: GroupOrder | null;
  setActiveOrder: (order: GroupOrder | null) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Browse filters
  browseFilters: {
    country: CountryCode | 'all';
    category: string | 'all';
    minSavings: number;
    maxPrice: number | null;
    sortBy: 'newest' | 'ending_soon' | 'most_popular' | 'highest_savings';
  };
  setBrowseFilters: (filters: Partial<AppState['browseFilters']>) => void;
  
  // Reset all state
  reset: () => void;
}

const defaultCreationForm: CreateOrderData = {
  product_url: '',
  title: '',
  description: '',
  images: [],
  category: undefined,
  country: 'US', // Default to US, will be updated based on user's location
  individual_price: undefined,
  group_price: 0,
  min_orders: DEFAULT_VALUES.MIN_ORDERS,
  max_orders: DEFAULT_VALUES.MAX_ORDERS,
  payment_methods: {},
  payment_deadline: undefined,
  deadline: new Date(Date.now() + DEFAULT_VALUES.ORDER_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

export const useAppStore = create<AppState>((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // User's detected country
  userCountry: 'US',
  setUserCountry: (country) => {
    set({ userCountry: country });
    // Update creation form country if it's still default
    const currentForm = get().creationForm;
    if (currentForm.country === 'US') {
      set({ creationForm: { ...currentForm, country } });
    }
  },
  
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
  
  // AI Agent state
  pricingAI: {
    isOpen: false,
    isLoading: false,
    request: null,
    response: null,
    error: null,
  },
  setPricingAI: (state) => set((current) => ({
    pricingAI: { ...current.pricingAI, ...state }
  })),
  
  shippingAI: {
    isOpen: false,
    isLoading: false,
    request: null,
    response: null,
    error: null,
  },
  setShippingAI: (state) => set((current) => ({
    shippingAI: { ...current.shippingAI, ...state }
  })),
  
  // Preview state
  previewMode: 'desktop',
  setPreviewMode: (mode) => set({ previewMode: mode }),
  
  // Active order
  activeOrder: null,
  setActiveOrder: (order) => set({ activeOrder: order }),
  
  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Browse filters
  browseFilters: {
    country: 'all',
    category: 'all',
    minSavings: 0,
    maxPrice: null,
    sortBy: 'newest',
  },
  setBrowseFilters: (filters) => set((state) => ({
    browseFilters: { ...state.browseFilters, ...filters }
  })),
  
  // Reset function
  reset: () => set({
    creationForm: defaultCreationForm,
    detectedProduct: null,
    isDetecting: false,
    detectionError: null,
    previewMode: 'desktop',
    activeOrder: null,
    isLoading: false,
    pricingAI: {
      isOpen: false,
      isLoading: false,
      request: null,
      response: null,
      error: null,
    },
    shippingAI: {
      isOpen: false,
      isLoading: false,
      request: null,
      response: null,
      error: null,
    },
    browseFilters: {
      country: 'all',
      category: 'all',
      minSavings: 0,
      maxPrice: null,
      sortBy: 'newest',
    },
  }),
}));
