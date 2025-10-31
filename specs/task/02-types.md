# Task 2: 타입 정의

## 목표
TypeScript 타입 시스템 구축

## 작업 목록

### 2.1 Product 타입
`src/types/index.ts`

```typescript
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};
```

### 2.2 ChangeReserve 타입
```typescript
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
```

### 2.3 VendingMachine 관련 타입
```typescript
export type PaymentMethod = 'cash' | 'card' | null;

export type VendingMachineContext = {
  balance: number;
  changeReserve: ChangeReserve;
  changeAvailable: boolean;
  paymentMethod: PaymentMethod;
  selectedDrink: Product | null;
  products: Product[];
  errorMessage: string | null;
};

export type VendingMachineState =
  | 'idle'
  | 'cashInserted'
  | 'cardInserted'
  | 'processingPayment'
  | 'dispensing'
  | 'refunding'
  | 'changeShortage'
  | 'error';
```

### 2.4 이벤트 타입
```typescript
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
```

### 2.5 초기 데이터 타입
```typescript
export type InitialMachineState = {
  products: Product[];
  changeReserve: ChangeReserve;
  changeAvailable: boolean;
};
```

### 2.6 버튼 상태 타입
```typescript
export type ButtonState = 'disabled' | 'active' | 'purchasable';
```

## 완료 조건
- 모든 타입 정의 완료
- TypeScript 컴파일 에러 없음
- export 정상 동작

