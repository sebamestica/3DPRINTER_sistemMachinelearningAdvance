/**
 * UI STORE
 * Interface state and interactions
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type ModalType = 'protocol' | 'export' | 'settings' | 'help' | 'variant' | 'compare' | null;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface UIState {
  // Panels
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomDockOpen: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
  bottomDockHeight: number;

  // Modals
  activeModal: ModalType;
  modalData: Record<string, any>;

  // Mode
  engineeringMode: boolean;
  presentationMode: boolean;
  compactMode: boolean;

  // Toasts
  toasts: ToastMessage[];

  // Sidebar (for Advanced Lab)
  sidebarOpen: boolean;
  activeSidebarTab: string;

  // Theme
  theme: 'dark' | 'light' | 'system';

  // Mobile
  isMobileMenuOpen: boolean;
  activeMobileView: 'viewport' | 'controls' | 'results';
}

export interface UIActions {
  // Panels
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomDock: () => void;
  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;
  setBottomDockHeight: (height: number) => void;

  // Modals
  openModal: (modal: ModalType, data?: Record<string, any>) => void;
  closeModal: () => void;

  // Mode
  toggleEngineeringMode: () => void;
  togglePresentationMode: () => void;
  toggleCompactMode: () => void;

  // Toasts
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Sidebar
  toggleSidebar: () => void;
  setSidebarTab: (tab: string) => void;

  // Theme
  setTheme: (theme: 'dark' | 'light' | 'system') => void;

  // Mobile
  toggleMobileMenu: () => void;
  setMobileView: (view: 'viewport' | 'controls' | 'results') => void;

  // Reset
  resetUI: () => void;
}

const DEFAULT_UI: UIState = {
  leftPanelOpen: true,
  rightPanelOpen: true,
  bottomDockOpen: true,
  leftPanelWidth: 320,
  rightPanelWidth: 380,
  bottomDockHeight: 120,

  activeModal: null,
  modalData: {},

  engineeringMode: true,
  presentationMode: false,
  compactMode: false,

  toasts: [],

  sidebarOpen: true,
  activeSidebarTab: 'architecture',

  theme: 'dark',

  isMobileMenuOpen: false,
  activeMobileView: 'viewport'
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...DEFAULT_UI,

        // Panels
        toggleLeftPanel: () => set(
          (state) => ({ leftPanelOpen: !state.leftPanelOpen }),
          false,
          'toggleLeftPanel'
        ),

        toggleRightPanel: () => set(
          (state) => ({ rightPanelOpen: !state.rightPanelOpen }),
          false,
          'toggleRightPanel'
        ),

        toggleBottomDock: () => set(
          (state) => ({ bottomDockOpen: !state.bottomDockOpen }),
          false,
          'toggleBottomDock'
        ),

        setLeftPanelWidth: (width: number) => set(
          { leftPanelWidth: Math.max(240, Math.min(600, width)) },
          false,
          'setLeftPanelWidth'
        ),

        setRightPanelWidth: (width: number) => set(
          { rightPanelWidth: Math.max(280, Math.min(600, width)) },
          false,
          'setRightPanelWidth'
        ),

        setBottomDockHeight: (height: number) => set(
          { bottomDockHeight: Math.max(80, Math.min(300, height)) },
          false,
          'setBottomDockHeight'
        ),

        // Modals
        openModal: (modal: ModalType, data: Record<string, any> = {}) => set(
          { activeModal: modal, modalData: data },
          false,
          'openModal'
        ),

        closeModal: () => set(
          { activeModal: null, modalData: {} },
          false,
          'closeModal'
        ),

        // Mode
        toggleEngineeringMode: () => set(
          (state) => ({ engineeringMode: !state.engineeringMode }),
          false,
          'toggleEngineeringMode'
        ),

        togglePresentationMode: () => set(
          (state) => ({
            presentationMode: !state.presentationMode,
            // Auto-adjust panels for presentation
            leftPanelOpen: state.presentationMode ? true : false,
            rightPanelOpen: state.presentationMode ? true : false,
            bottomDockOpen: false
          }),
          false,
          'togglePresentationMode'
        ),

        toggleCompactMode: () => set(
          (state) => ({ compactMode: !state.compactMode }),
          false,
          'toggleCompactMode'
        ),

        // Toasts
        addToast: (toast: Omit<ToastMessage, 'id'>) => {
          const id = generateId();
          const newToast: ToastMessage = { ...toast, id };

          set(
            (state) => ({
              toasts: [...state.toasts, newToast]
            }),
            false,
            'addToast'
          );

          // Auto-remove after duration
          const duration = toast.duration || 5000;
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        },

        removeToast: (id: string) => set(
          (state) => ({
            toasts: state.toasts.filter(t => t.id !== id)
          }),
          false,
          'removeToast'
        ),

        clearToasts: () => set(
          { toasts: [] },
          false,
          'clearToasts'
        ),

        // Sidebar
        toggleSidebar: () => set(
          (state) => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          'toggleSidebar'
        ),

        setSidebarTab: (tab: string) => set(
          { activeSidebarTab: tab },
          false,
          'setSidebarTab'
        ),

        // Theme
        setTheme: (theme: 'dark' | 'light' | 'system') => set(
          { theme },
          false,
          'setTheme'
        ),

        // Mobile
        toggleMobileMenu: () => set(
          (state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }),
          false,
          'toggleMobileMenu'
        ),

        setMobileView: (view: 'viewport' | 'controls' | 'results') => set(
          { activeMobileView: view },
          false,
          'setMobileView'
        ),

        // Reset
        resetUI: () => set(
          DEFAULT_UI,
          false,
          'resetUI'
        )
      }),
      {
        name: 'pla-ui-store',
        partialize: (state) => ({
          leftPanelOpen: state.leftPanelOpen,
          rightPanelOpen: state.rightPanelOpen,
          bottomDockOpen: state.bottomDockOpen,
          engineeringMode: state.engineeringMode,
          theme: state.theme
        })
      }
    ),
    { name: 'UIStore' }
  )
);

// Selectors
export const selectPanels = (state: UIState) => ({
  left: state.leftPanelOpen,
  right: state.rightPanelOpen,
  bottom: state.bottomDockOpen
});

export const selectModal = (state: UIState) => ({
  active: state.activeModal,
  data: state.modalData
});

export const selectIsMobile = (state: UIState) =>
  state.compactMode || state.activeMobileView !== 'viewport';