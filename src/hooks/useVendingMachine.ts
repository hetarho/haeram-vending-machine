'use client';

import { useMachine } from '@xstate/react';
import { createVendingMachine } from '@/src/machines/vendingMachine';
import type { InitialMachineState, Product } from '@/src/types';
import { useMemo, useEffect, useState } from 'react';
import { processCardPayment } from '@/app/api/listProducts';
import { calculateChange } from '@/src/utils/calculateChange';

export function useVendingMachine(initialData: InitialMachineState) {
  const machine = useMemo(() => createVendingMachine(initialData), [initialData]);
  const [state, send] = useMachine(machine);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
  }, [state.value, state.context.selectedDrink, send]);

  // 상태 변화에 따른 메시지 표시
  useEffect(() => {
    if (state.value === 'cashInserted') {
      setStatusMessage('💵 현금이 투입되었습니다');
      setTimeout(() => setStatusMessage(null), 2000);
    } else if (state.value === 'cardInserted') {
      setStatusMessage('💳 카드가 투입되었습니다');
      setTimeout(() => setStatusMessage(null), 2000);
    } else if (state.value === 'processingPayment') {
      setStatusMessage('💳 결제 처리 중...');
    } else if (state.value === 'dispensing') {
      setStatusMessage(`🥤 ${state.context.selectedDrink?.name} 배출 중...`);
    } else if (state.value === 'refunding') {
      setStatusMessage('💰 환불 처리 중...');
    } else if (state.value === 'error') {
      setStatusMessage(`❌ ${state.context.errorMessage || '오류 발생'}`);
    } else if (state.value === 'idle' && statusMessage && !statusMessage.includes('투입')) {
      setStatusMessage(null);
    }
  }, [state.value, state.context.selectedDrink, state.context.errorMessage, statusMessage]);

  // 헬퍼 함수들
  const insertCash = (amount: number) => {
    send({ type: 'INSERT_CASH', amount });
  };

  const insertCard = () => {
    send({ type: 'INSERT_CARD' });
  };

  const ejectCard = () => {
    send({ type: 'EJECT_CARD' });
  };

  const selectDrink = (product: Product) => {
    send({ type: 'SELECT_DRINK', product });
  };

  const refund = () => {
    // 잔돈이 충분한지 체크
    const changeResult = calculateChange(state.context.balance, state.context.changeReserve);
    if (!changeResult.success) {
      setStatusMessage('❌ 잔돈이 부족하여 환불할 수 없습니다');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    send({ type: 'REFUND' });
  };

  return {
    state: state.value,
    context: state.context,
    products: state.context.products,
    insertCash,
    insertCard,
    ejectCard,
    selectDrink,
    refund,
    isDispensing: state.value === 'dispensing',
    isProcessing: state.value === 'processingPayment',
    canInsertCash: state.context.changeAvailable,
    statusMessage,
  };
}
