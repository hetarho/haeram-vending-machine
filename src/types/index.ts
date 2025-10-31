// Product type
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

// Change reserve type
export type ChangeReserve = {
  10: number;      // 10원 개수
  50: number;      // 50원 개수
  100: number;     // 100원 개수
  500: number;     // 500원 개수
  1000: number;    // 1000원 개수
  5000: number;    // 5000원 개수
  10000: number;   // 10000원 개수
  50000: number;   // 50000원 개수
};

// Payment method type
export type PaymentMethod = 'cash' | 'card' | null;

// Vending machine context type
export type VendingMachineContext = {
  balance: number;
  changeReserve: ChangeReserve;
  changeAvailable: boolean;
  paymentMethod: PaymentMethod;
  selectedDrink: Product | null;
  products: Product[];
  errorMessage: string | null;
};

// Vending machine state type
export type VendingMachineState =
  | 'idle'
  | 'cashInserted'
  | 'cardInserted'
  | 'processingPayment'
  | 'dispensing'
  | 'refunding'
  | 'changeShortage'
  | 'error';

// Event types
export type VendingMachineEvent =
  | { type: 'INSERT_CASH'; amount: number }
  | { type: 'INSERT_CARD' }
  | { type: 'SELECT_DRINK'; product: Product }
  | { type: 'PAYMENT_SUCCESS' }
  | { type: 'PAYMENT_FAILURE'; message: string }
  | { type: 'DISPENSE_SUCCESS' }
  | { type: 'DISPENSE_FAILURE'; message: string }
  | { type: 'REFUND' }
  | { type: 'REFUND_COMPLETE' }
  | { type: 'CHECK_CHANGE' }
  | { type: 'CHANGE_REPLENISHED'; amount: number };

// Initial machine state type
export type InitialMachineState = {
  products: Product[];
  changeReserve: ChangeReserve;
  changeAvailable: boolean;
};

// Button state type
export type ButtonState = 'disabled' | 'active' | 'purchasable';
