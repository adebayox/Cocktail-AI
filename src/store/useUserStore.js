import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: {},
      setUser: (user) => set(() => ({ user: user })),
      logout: () => {
        set(() => ({ user: {} }));
      },
    }),

    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useUserStore;
