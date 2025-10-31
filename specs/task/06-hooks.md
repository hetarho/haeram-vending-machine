# Task 6: Custom Hooks 구현

## 목표
xstate 머신을 React에서 사용하기 위한 훅 구현

## 작업 파일
`src/hooks/useVendingMachine.ts`

## 작업 내용

### 6.1 useVendingMachine 훅
```typescript
'use client';

import { useMachine } from '@xstate/react';
import { vendingMachine } from '@/machines/vendingMachine';
import type { InitialMachineState } from '@/types';
import { useEffect } from 'react';

export function useVendingMachine(initialData: InitialMachineState) {
  const [state, send] = useMachine(vendingMachine, {
    context: {
      balance: 0,
      changeReserve: initialData.changeReserve,
      changeAvailable: initialData.changeAvailable,
      paymentMethod: null,
      selectedDrink: null,
      products: initialData.products,
      errorMessage: null,
    },
  });

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
```

## 완료 조건
- useVendingMachine 훅 구현 완료
- xstate와 React 연동 확인
- TypeScript 에러 없음
- 빌드 성공

