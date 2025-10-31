# Task 3: xstate 머신 구현

## 목표
자판기 상태 머신 구현

## 작업 파일
`src/machines/vendingMachine.ts`

## 작업 목록

### 3.1 머신 기본 구조 생성
```typescript
import { setup, assign } from 'xstate';
import type { VendingMachineContext, VendingMachineEvent } from '@/types';

export const vendingMachine = setup({
  types: {
    context: {} as VendingMachineContext,
    events: {} as VendingMachineEvent,
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
    // 상태 정의
  },
});
```

### 3.2 idle 상태 구현
- 진입: balance, paymentMethod, selectedDrink, errorMessage 초기화
- 전환:
  - INSERT_CASH [changeAvailable] → cashInserted
  - INSERT_CARD → cardInserted
  - CHECK_CHANGE [!changeAvailable] → changeShortage

### 3.3 cashInserted 상태 구현
- 진입: paymentMethod = 'cash'
- 전환:
  - INSERT_CASH → cashInserted (balance 누적)
  - INSERT_CARD → cardInserted (자동 환불 액션)
  - SELECT_DRINK [guard: canPurchase] → dispensing
  - REFUND → refunding

### 3.4 cardInserted 상태 구현
- 진입: paymentMethod = 'card'
- 전환:
  - SELECT_DRINK [guard: hasStock] → processingPayment

### 3.5 processingPayment 상태 구현
- 전환:
  - PAYMENT_SUCCESS → dispensing
  - PAYMENT_FAILURE → error

### 3.6 dispensing 상태 구현
- 진입: 재고 차감, balance 차감 (현금인 경우)
- 전환:
  - DISPENSE_SUCCESS → idle
  - DISPENSE_FAILURE → error

### 3.7 refunding 상태 구현
- 전환:
  - REFUND_COMPLETE → idle

### 3.8 changeShortage 상태 구현
- 전환:
  - INSERT_CARD → cardInserted
  - CHANGE_REPLENISHED → idle

### 3.9 error 상태 구현
- 진입: 자동 환불 로직
- 전환:
  - REFUND_COMPLETE → idle

### 3.10 Guards 구현
```typescript
guards: {
  canPurchase: ({ context, event }) => {
    const { balance, products } = context;
    const { product } = event;
    const currentProduct = products.find(p => p.id === product.id);
    return balance >= product.price && (currentProduct?.stock ?? 0) > 0;
  },
  hasStock: ({ context, event }) => {
    const { products } = context;
    const { product } = event;
    const currentProduct = products.find(p => p.id === product.id);
    return (currentProduct?.stock ?? 0) > 0;
  },
  changeAvailable: ({ context }) => context.changeAvailable,
}
```

### 3.11 Actions 구현
- assignBalance: balance 업데이트
- assignPaymentMethod: paymentMethod 업데이트
- selectDrink: selectedDrink 설정
- decrementStock: 재고 차감
- refund: balance 0으로 설정
- updateChangeReserve: 잔돈 업데이트
- setError: errorMessage 설정
- clearError: errorMessage null

## 완료 조건
- 모든 상태 구현 완료
- 모든 전환 구현 완료
- Guards 동작 확인
- Actions 동작 확인
- TypeScript 에러 없음

