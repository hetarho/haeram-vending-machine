import { setup, assign } from 'xstate';
import type { VendingMachineContext, VendingMachineEvent, Product, InitialMachineState, ChangeReserve } from '@/src/types';
import { calculateChange } from '@/src/utils/calculateChange';

const vendingMachineSetup = setup({
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
    addToChangeReserve: assign({
      changeReserve: ({ context, event }) => {
        if (event.type === 'INSERT_CASH') {
          const amount = event.amount;
          // 투입된 금액을 changeReserve에 추가
          if (amount === 10 || amount === 50 || amount === 100 || amount === 500 || 
              amount === 1000 || amount === 5000 || amount === 10000 || amount === 50000) {
            return {
              ...context.changeReserve,
              [amount]: context.changeReserve[amount as keyof typeof context.changeReserve] + 1,
            };
          }
        }
        return context.changeReserve;
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
    deductFromChangeReserve: assign({
      changeReserve: ({ context }) => {
        const refundAmount = context.balance;
        if (refundAmount === 0) return context.changeReserve;
        
        // calculateChange로 환불할 금액 계산
        const changeResult = calculateChange(refundAmount, context.changeReserve);
        
        if (changeResult.success && changeResult.change) {
          // changeReserve에서 차감
          const newReserve: ChangeReserve = { ...context.changeReserve };
          const denominations = [50000, 10000, 5000, 1000, 500, 100, 50, 10] as const;
          
          for (const denom of denominations) {
            newReserve[denom] -= changeResult.change[denom];
          }
          
          return newReserve;
        }
        
        return context.changeReserve;
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
      paymentMethod: null,
      selectedDrink: null,
      errorMessage: null,
    }),
  },
});

export function createVendingMachine(initialData: InitialMachineState) {
  return vendingMachineSetup.createMachine({
    id: 'vendingMachine',
    initial: 'idle',
    context: {
      balance: 0,
      changeReserve: initialData.changeReserve,
      changeAvailable: initialData.changeAvailable,
      paymentMethod: null,
      selectedDrink: null,
      products: initialData.products,
      errorMessage: null,
    },
    states: {
      idle: {
        entry: ['resetState'],
        on: {
          INSERT_CASH: {
            guard: 'changeAvailable',
            target: 'cashInserted',
            actions: ['assignBalance', 'addToChangeReserve', 'assignPaymentMethodCash'],
          },
          INSERT_CARD: {
            target: 'cardInserted',
          },
          REFUND: {
            target: 'refunding',
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
            actions: ['assignBalance', 'addToChangeReserve'],
            reenter: true,
          },
          INSERT_CARD: {
            target: 'cardInserted',
            actions: ['assignPaymentMethodCard'],
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
          EJECT_CARD: {
            target: 'idle',
          },
          REFUND: {
            target: 'refunding',
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
        entry: ['deductFromChangeReserve', 'refundBalance'],
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
        entry: ['setError'],
        on: {
          REFUND: {
            target: 'refunding',
            actions: ['clearError'],
          },
        },
      },
    },
  });
}

// 기본 머신 (하위 호환성을 위해)
export const vendingMachine = vendingMachineSetup.createMachine({
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
          actions: ['assignBalance', 'addToChangeReserve', 'assignPaymentMethodCash'],
        },
        INSERT_CARD: {
          target: 'cardInserted',
        },
        REFUND: {
          target: 'refunding',
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
          actions: ['assignBalance', 'addToChangeReserve'],
          reenter: true,
        },
        INSERT_CARD: {
          target: 'cardInserted',
          actions: ['assignPaymentMethodCard'],
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
        EJECT_CARD: {
          target: 'idle',
        },
        REFUND: {
          target: 'refunding',
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
      entry: ['deductFromChangeReserve', 'refundBalance'],
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
      entry: ['setError'],
      on: {
        REFUND: {
          target: 'refunding',
          actions: ['clearError'],
        },
      },
    },
  },
});
