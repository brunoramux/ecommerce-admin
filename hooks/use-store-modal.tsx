import { create } from "zustand"

interface useStoreModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}


// Hook criado com Zustand para manter o estado do Modal de Store
export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))