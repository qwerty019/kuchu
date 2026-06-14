import { GroupedFilter } from "@/lib/db/new-search/definitions";
import { Address } from "@/lib/db/address/schema";
import { BranchWithCity } from "@/lib/db/branch/schema";
import { CategoryLeftSide } from "@/lib/db/category/schema";
import { CertOption } from "@/lib/db/certoption/schema";
import { DeliveryZone } from "@/lib/db/deliveryzone/schema";
import { Good } from "@/lib/db/good/definitions";
import { DiscountCard } from "@/lib/definitions";
import { createStore } from "zustand/vanilla";
import { CurrentOrder } from "@/lib/db/order/schema";

export type Payload = {
  id: number;
  status: string;
};

export type Onboarding = {
  stories: "true" | "show";
  search: "false" | "true" | "show";
  cart: "false" | "true" | "show";
  mounted: boolean;
};

export type MainItemsState = {
  method: string | null;
  branch: string | null;
  addresses: Address[];
  branches: BranchWithCity[];
  discountCard: DiscountCard | null;
  isUpdating: boolean;
  categories: CategoryLeftSide[];
  results: any[];
  query: string;
  sheetOpen: boolean;
  focus: boolean;
  text: string;
  zones: DeliveryZone[];
  showFilters: boolean;
  filters: GroupedFilter[];
  favorites: Good[];
  showFavorites: boolean;
  certOptions: CertOption[];
  orders: CurrentOrder[];
  showOrders: boolean;
  orderIndex: number;
  showDialog: boolean;
  /** Mobile: cart drawer from bottom nav (no floating FAB) */
  mobileCartOpen: boolean;
  onboarding: Onboarding;
};

export type MainItemActions = {
  setMethod: (method: string) => void;
  setBranch: (branch: string) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: number) => void;
  setAddresses: (
    addresses: Address[] | ((prev: Address[]) => Address[])
  ) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  setCategories: (categories: CategoryLeftSide[]) => void;
  setResults: (results: any[]) => void;
  setQuery: (query: string) => void;
  setSheetOpen: (sheetOpen: boolean) => void;
  setFocus: (focus: boolean) => void;
  setDiscountCard: (discountCard: DiscountCard | null) => void;
  setText: (text: string) => void;
  setBranches: (branches: BranchWithCity[]) => void;
  setZones: (zones: DeliveryZone[]) => void;
  setShowFilters: (showFilters: boolean) => void;
  setFilters: (filters: GroupedFilter[]) => void;
  setFavorites: (favorites: Good[]) => void;
  setShowFavorites: (showFavorites: boolean) => void;
  setCertOptions: (certOptions: CertOption[]) => void;
  setOrders: (orders: CurrentOrder[]) => void;
  setShowOrders: (showOrders: boolean) => void;
  setOrderIndex: (orderIndex: number) => void;
  setShowDialog: (showDialog: boolean) => void;
  updateOrder: (payload: Payload) => void;
  setOnboarding: (
    onboarding: Onboarding | ((prev: Onboarding) => Onboarding)
  ) => void;
  setMobileCartOpen: (open: boolean) => void;
};

export type MainStore = MainItemsState & MainItemActions;

export const defaultInitState: MainItemsState = {
  method: null,
  branch: null,
  branches: [],
  addresses: [],
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
};

export const createMainStore = (
  initState: MainItemsState = defaultInitState
) => {
  return createStore<MainStore>()((set) => ({
    ...initState,
    setMethod: (method) => set({ method }),
    setBranch: (branch) => set({ branch }),
    addAddress: (address: Address) =>
      set((state) => ({ addresses: [...state.addresses, address] })),
    removeAddress: (addressId: number) =>
      set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== addressId),
      })),
    // setAddresses: (addresses: Address[]) => set({ addresses }),
    setAddresses: (addresses) =>
      set((state) => ({
        addresses:
          typeof addresses === "function"
            ? addresses(state.addresses)
            : addresses,
      })),
    setDiscountCard: (discountCard) => set({ discountCard }),
    setIsUpdating: (isUpdating) => set({ isUpdating }),
    setCategories: (categories) => set({ categories }),
    setResults: (results) => set({ results }),
    setQuery: (query) => set({ query }),
    setSheetOpen: (sheetOpen) => set({ sheetOpen }),
    setFocus: (focus) => set({ focus }),
    setText: (text) => set({ text }),
    setBranches: (branches) => set({ branches }),
    setZones: (zones) => set({ zones }),
    setShowFilters: (showFilters) => set({ showFilters }),
    setFilters: (filters) => set({ filters }),
    setFavorites: (favorites) => set({ favorites }),
    setShowFavorites: (showFavorites) => set({ showFavorites }),
    setCertOptions: (certOptions) => set({ certOptions }),
    setOrders: (orders) => set({ orders }),
    setShowOrders: (showOrders) => set({ showOrders }),
    setOrderIndex: (orderIndex) => set({ orderIndex }),
    setShowDialog: (showDialog) => set({ showDialog }),
    updateOrder: ({ id, status }) =>
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      })),
    setOnboarding: (onboarding) =>
      set((state) => ({
        onboarding:
          typeof onboarding === "function"
            ? onboarding(state.onboarding)
            : onboarding,
      })),
    setMobileCartOpen: (mobileCartOpen) => set({ mobileCartOpen }),
  }));
};
