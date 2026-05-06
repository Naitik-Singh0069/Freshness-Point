export type FpCartLine = {
  name: string;
  price: number;
  qty: number;
};

export type FpCartApi = {
  addItem: (name: string, price: number) => void;
  addOne: (name: string) => void;
  removeOne: (name: string) => void;
  getCart: () => Record<string, FpCartLine>;
  clearCart: () => void;
};

declare global {
  interface Window {
    fpCart?: FpCartApi;
    /** Public Razorpay key ID injected via index.html inline script */
    __FP_RAZORPAY_KEY_ID__?: string;
  }
}

export {};
