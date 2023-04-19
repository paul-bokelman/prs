import { createStore } from 'zustand/vanilla';

interface UserStore {
  pin: number | undefined;
  setPin: (pin: number | undefined) => void;
}

export const userStore = createStore<UserStore>((set) => ({
  pin: undefined,
  setPin: (pin) => set({ pin }),
}));
