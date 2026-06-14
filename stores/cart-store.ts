import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

type Item = {
  ost: {
    branchId: number;
    uQntOst: number;
    recipe: boolean;
    priceRoznWNDS: number;
    fixPriceValue: number;
    naklDataId: number;
  }[];
  id: number;
  regId: number;
  drug: string;
  title: string | null;
  subtitle: string | null;
  form: string;
  img: string | null;
};

export type CartItemState = {
  id: number;
  regId: number;
  drug: string;
  title: string | null;
  subtitle: string | null;
  qnt: number;
  form: string;
  img: string;
  disabled?: boolean;
  comment?: string;
  updated?: boolean;
  qnts: {
    branchId: number;
    price: number;
    qnt: number;
    added: number;
    fixPrice: number;
    naklDataId: number;
  }[];
};

export type CartItemsState = {
  items: CartItemState[];
  hydrated: boolean;
  loading: boolean;
  lastShown: number | null;
};

export type CartItemActions = {
  addCartItem: (item: Item, branch: string) => void;
  decreaseQnt: (id: number) => void;
  removeCartItem: (id: number) => void;
  removeAllCartItems: () => void;
  setItems: (items: CartItemState[]) => void;
  addFormCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  setHydrated: () => void;
  setLoading: (loading: boolean) => void;
  setLastShown: (timestamp: number) => void;
};

export type CartStore = CartItemsState & CartItemActions;

export const defaultInitState: CartItemsState = {
  items: [],
  hydrated: false,
  loading: false,
  lastShown: null,
};

export const createCartStore = (
  initState: CartItemsState = defaultInitState
) => {
  return createStore<CartStore>()(
    persist(
      (set) => ({
        ...initState,
        addCartItem: (item, branch) =>
          set((state) => {
            let cartItem = state.items.find(
              (cartItem) => cartItem.id === item.id
            );

            const osts = item.ost.filter((x) => x.branchId === Number(branch));

            if (!cartItem) {
              cartItem = {
                id: item.id,
                regId: item.regId,
                drug: item.drug,
                title: item.title,
                subtitle: item.subtitle,
                form: item.form,
                img: item.img || "",
                qnt: 1,
                qnts: osts.map((ost, i) => ({
                  branchId: ost.branchId,
                  price: ost.priceRoznWNDS,
                  qnt: ost.uQntOst,
                  added: i === 0 ? 1 : 0,
                  fixPrice: ost.fixPriceValue,
                  naklDataId: ost.naklDataId,
                })),
              };

              return { items: [...state.items, cartItem] };
            }

            const first = cartItem.qnts.find((qnt) => qnt.qnt > qnt.added);

            if (first) {
              first.added++;
              cartItem.qnt++;
            }

            return { items: [...state.items] };
          }),
        decreaseQnt: (id) =>
          set((state) => {
            const cartItem = state.items.find((cartItem) => cartItem.id === id);

            if (cartItem) {
              const last = cartItem.qnts
                .slice()
                .reverse()
                .find((qnt) => qnt.added > 0);

              if (last) {
                last.added--;
                cartItem.qnt--;

                if (cartItem.qnts.every((qnt) => qnt.added === 0)) {
                  return {
                    items: state.items.filter((cartItem) => cartItem.id !== id),
                  };
                }
              }
            }

            return { items: [...state.items] };
          }),
        removeCartItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),
        removeAllCartItems: () => set(() => ({ items: [] })),
        setItems: (items) => set(() => ({ items })),
        addFormCart: (id) =>
          set((state) => {
            const cartItem = state.items.find((cartItem) => cartItem.id === id);

            if (!cartItem) return state;

            for (let i = 0; i < cartItem.qnts.length; i++) {
              const qntItem = cartItem.qnts[i];

              // If there is available quantity, add it
              if (qntItem.added < qntItem.qnt) {
                qntItem.added++;
                cartItem.qnt++; // Increment the total quantity in the cartItem
                break; // Stop after adding to the first available quantity
              }
            }

            return { items: [...state.items] };
          }),
        removeFromCart: (id) =>
          set((state) => {
            const cartItem = state.items.find((cartItem) => cartItem.id === id);
            // Iterate through the qnts array in reverse to find the last added quantity to remove

            if (!cartItem) return state;

            for (let i = cartItem.qnts.length - 1; i >= 0; i--) {
              const qntItem = cartItem.qnts[i];

              // If there is a quantity that has been added, remove it
              if (qntItem.added > 0) {
                qntItem.added--;
                cartItem.qnt--; // Decrement the total quantity in the cartItem
                break; // Stop after removing from the first found added quantity
              }
            }

            return { items: [...state.items] };
          }),
        setHydrated: () => set({ hydrated: true }),
        setLoading: (loading) => set({ loading }),
        setLastShown: (timestamp) => set({ lastShown: timestamp }),
      }),
      {
        name: "cart-store",
        onRehydrateStorage: () => (state) => state?.setHydrated(),
      }
    )
  );
};
