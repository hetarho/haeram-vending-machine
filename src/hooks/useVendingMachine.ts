'use client';

import { useMachine } from '@xstate/react';
import { createVendingMachine } from '@/src/machines/vendingMachine';
import type { InitialMachineState, Product } from '@/src/types';
import { useMemo } from 'react';

export function useVendingMachine(initialData: InitialMachineState) {
  const machine = useMemo(() => createVendingMachine(initialData), [initialData]);
  const [state, send] = useMachine(machine);

  // 헬퍼 함수들
  const insertCash = (amount: number) => {
    send({ type: 'INSERT_CASH', amount });
  };

  const insertCard = () => {
    send({ type: 'INSERT_CARD' });
  };

  const selectDrink = (product: Product) => {
    send({ type: 'SELECT_DRINK', product });
  };

  const refund = () => {
    send({ type: 'REFUND' });
  };

  return {
    state: state.value,
    context: state.context,
    products: state.context.products,
    insertCash,
    insertCard,
    selectDrink,
    refund,
    isDispensing: state.value === 'dispensing',
    isProcessing: state.value === 'processingPayment',
    canInsertCash: state.context.changeAvailable,
  };
}
