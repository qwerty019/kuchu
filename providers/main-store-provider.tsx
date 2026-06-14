"use client";

import { MainStore, createMainStore } from "@/stores/main-store";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

export const MainStoreContext = createContext<StoreApi<MainStore> | null>(null);

export interface MainStoreProviderProps {
  children: ReactNode;
}

export const MainStoreProvider = ({ children }: MainStoreProviderProps) => {
  const storeRef = useRef<StoreApi<MainStore>>();
  if (!storeRef.current) {
    storeRef.current = createMainStore({
      method: null,
      branch: null,
      addresses: [],
      branches: [],
      discountCard: null,
      isUpdating: false,
      categories: [],
      results: [],
      query: "",
      sheetOpen: false,
      focus: false,
      text: "",
      zones: [],
      showFilters: false,
      filters: [],
      favorites: [],
      showFavorites: false,
      certOptions: [],
      orders: [],
      showOrders: false,
      orderIndex: 0,
      showDialog: false,
      mobileCartOpen: false,
      onboarding: {
        stories: "true",
        search: "false",
        cart: "false",
        mounted: false,
      },
    });
  }

  return (
    <MainStoreContext.Provider value={storeRef.current}>
      {children}
    </MainStoreContext.Provider>
  );
};

export const useMainStore = <T,>(selector: (store: MainStore) => T): T => {
  const mainStoreContext = useContext(MainStoreContext);

  if (!mainStoreContext) {
    throw new Error(`useMainStore must be use within MainStoreProvider`);
  }

  return useStore(mainStoreContext, selector);
};
