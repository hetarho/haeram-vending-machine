import { setup, assign } from 'xstate';
import type { VendingMachineContext, VendingMachineEvent, Product } from '@/src/types';

export const vendingMachine = setup({
  types: {
    context: {} as VendingMachineContext,
    events: {} as VendingMachineEvent,
  },
  guards: {
    canPurchase: ({ context, event }) => {
      if (event.type !== 'SELECT_DRINK') return false;
      const { balance, products } = context;
      const { product } = event;
      const currentProduct = products.find((p: Product) => p.id === product.id);
      return balance >= product.price && (currentProduct?.stock ?? 0) > 0;
    },
    hasStock: ({ context, event }) => {
      if (event.type !== 'SELECT_DRINK') return false;
      const { products } = context;
      const { product } = event;
      const currentProduct = products.find((p: Product) => p.id === product.id);
      return (currentProduct?.stock ?? 0) > 0;
    },
    changeAvailable: ({ context }) => context.changeAvailable,
    changeNotAvailable: ({ context }) => !context.changeAvailable,
  },
  actions: {
    assignBalance: assign({
      balance: ({ context, event }) => {
        if (event.type === 'INSERT_CASH') {
          return context.balance + event.amount;
        }
        return context.balance;
      },
    }),
    assignPaymentMethodCash: assign({
      paymentMethod: 'cash' as const,
    }),
    assignPaymentMethodCard: assign({
      paymentMethod: 'card' as const,
    }),
    selectDrink: assign({
      selectedDrink: ({ event }) => {
        if (event.type === 'SELECT_DRINK') {
          return event.product;
        }
        return null;
      },
    }),
    decrementStock: assign({
      products: ({ context }) => {
        if (!context.selectedDrink) return context.products;
        return context.products.map((p: Product) =>
          p.id === context.selectedDrink!.id
            ? { ...p, stock: p.stock - 1 }
            : p
        );
      },
    }),
    deductBalance: assign({
      balance: ({ context }) => {
        if (context.paymentMethod === 'cash' && context.selectedDrink) {
          return context.balance - context.selectedDrink.price;
        }
        return context.balance;
      },
    }),
    refundBalance: assign({
      balance: 0,
    }),
    updateChangeReserve: assign({
      changeReserve: ({ context, event }) => {
        if (event.type === 'CHANGE_REPLENISHED') {
          return { ...context.changeReserve };
        }
        return context.changeReserve;
      },
      changeAvailable: ({ event }) => {
        if (event.type === 'CHANGE_REPLENISHED') {
          return true;
        }
        return true;
      },
    }),
    setError: assign({
      errorMessage: ({ event }) => {
        if (event.type === 'PAYMENT_FAILURE' || event.type === 'DISPENSE_FAILURE') {
          return event.message;
        }
        return 'Unknown error';
      },
    }),
    clearError: assign({
      errorMessage: null,
    }),
    resetState: assign({
      balance: 0,
      paymentMethod: null,
      selectedDrink: null,
      errorMessage: null,
    }),
  },
}).createMachine({
  id: 'vendingMachine',
  initial: 'idle',
  context: {
    balance: 0,
    changeReserve: {
      10: 0,
      50: 0,
      100: 0,
      500: 0,
      1000: 0,
      5000: 0,
      10000: 0,
      50000: 0,
    },
    changeAvailable: true,
    paymentMethod: null,
    selectedDrink: null,
    products: [],
    errorMessage: null,
  },
  states: {
    idle: {
      entry: ['resetState'],
      on: {
        INSERT_CASH: {
          guard: 'changeAvailable',
          target: 'cashInserted',
          actions: ['assignBalance', 'assignPaymentMethodCash'],
        },
        INSERT_CARD: {
          target: 'cardInserted',
        },
        CHECK_CHANGE: {
          guard: 'changeNotAvailable',
          target: 'changeShortage',
        },
      },
    },
    cashInserted: {
      on: {
        INSERT_CASH: {
          target: 'cashInserted',
          actions: ['assignBalance'],
          reenter: true,
        },
        INSERT_CARD: {
          target: 'cardInserted',
          actions: ['refundBalance', 'assignPaymentMethodCard'],
        },
        SELECT_DRINK: {
          guard: 'canPurchase',
          target: 'dispensing',
          actions: ['selectDrink'],
        },
        REFUND: {
          target: 'refunding',
        },
      },
    },
    cardInserted: {
      entry: ['assignPaymentMethodCard'],
      on: {
        SELECT_DRINK: {
          guard: 'hasStock',
          target: 'processingPayment',
          actions: ['selectDrink'],
        },
      },
    },
    processingPayment: {
      on: {
        PAYMENT_SUCCESS: {
          target: 'dispensing',
        },
        PAYMENT_FAILURE: {
          target: 'error',
          actions: ['setError'],
        },
      },
    },
    dispensing: {
      entry: ['decrementStock', 'deductBalance'],
      on: {
        DISPENSE_SUCCESS: {
          target: 'idle',
        },
        DISPENSE_FAILURE: {
          target: 'error',
          actions: ['setError'],
        },
      },
    },
    refunding: {
      entry: ['refundBalance'],
      on: {
        REFUND_COMPLETE: {
          target: 'idle',
        },
      },
    },
    changeShortage: {
      on: {
        INSERT_CARD: {
          target: 'cardInserted',
        },
        CHANGE_REPLENISHED: {
          target: 'idle',
          actions: ['updateChangeReserve'],
        },
      },
    },
    error: {
      entry: ['refundBalance', 'setError'],
      on: {
        REFUND_COMPLETE: {
          target: 'idle',
          actions: ['clearError'],
        },
      },
    },
  },
});
