'use client';

import { useMachine } from '@xstate/react';
import { createVendingMachine } from '@/src/machines/vendingMachine';
import type { InitialMachineState, Product } from '@/src/types';
import { useMemo, useEffect } from 'react';
import { processCardPayment } from '@/app/api/listProducts';

export function useVendingMachine(initialData: InitialMachineState) {
  const machine = useMemo(() => createVendingMachine(initialData), [initialData]);
  const [state, send] = useMachine(machine);

  // 자동 이벤트 처리
  useEffect(() => {
    // 카드 결제 처리
    if (state.value === 'processingPayment' && state.context.selectedDrink) {
      processCardPayment(state.context.selectedDrink.price)
        .then((result) => {
          if (result.success) {
            send({ type: 'PAYMENT_SUCCESS' });
          } else {
            send({ type: 'PAYMENT_FAILURE', message: result.message || '결제 실패' });
          }
        })
        .catch(() => {
          send({ type: 'PAYMENT_FAILURE', message: '결제 오류' });
        });
    }
    
    // 음료 배출 처리
    if (state.value === 'dispensing') {
      const timer = setTimeout(() => {
        send({ type: 'DISPENSE_SUCCESS' });
      }, 1500); // 1.5초 후 배출 완료
      return () => clearTimeout(timer);
    }
    
    // 환불 처리
    if (state.value === 'refunding') {
      const timer = setTimeout(() => {
        send({ type: 'REFUND_COMPLETE' });
      }, 1000); // 1초 후 환불 완료
      return () => clearTimeout(timer);
    }
    
    // 에러 처리 (자동 환불)
    if (state.value === 'error') {
      const timer = setTimeout(() => {
        send({ type: 'REFUND_COMPLETE' });
      }, 2000); // 2초 후 환불 완료
      return () => clearTimeout(timer);
    }
  }, [state.value, state.context.selectedDrink, send]);

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
