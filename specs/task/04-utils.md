# Task 4: 유틸 함수 구현

## 목표
비즈니스 로직 및 헬퍼 함수 구현

## 작업 목록

### 4.1 getButtonState 함수
`src/utils/getButtonState.ts`

```typescript
import type { ButtonState, Product, PaymentMethod } from '@/types';

export function getButtonState(
  product: Product,
  balance: number,
  paymentMethod: PaymentMethod,
  changeAvailable: boolean
): ButtonState {
  // 재고 없음
  if (product.stock <= 0) {
    return 'disabled';
  }
  
  // 잔돈 부족 + 현금
  if (paymentMethod === 'cash' && !changeAvailable) {
    return 'active';
  }
  
  // 현금 + 잔액 충분
  if (paymentMethod === 'cash' && balance >= product.price) {
    return 'purchasable';
  }
  
  // 카드
  if (paymentMethod === 'card') {
    return 'purchasable';
  }
  
  // 기본 활성
  return 'active';
}
```

### 4.2 formatCurrency 함수
`src/utils/formatCurrency.ts`

```typescript
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
```

### 4.3 calculateChange 함수
`src/utils/calculateChange.ts`

```typescript
import type { ChangeReserve } from '@/types';

export function calculateChange(
  amount: number,
  reserve: ChangeReserve
): {
  success: boolean;
  change: ChangeReserve | null;
  remaining: number;
} {
  const result: ChangeReserve = {
    10: 0, 50: 0, 100: 0, 500: 0,
    1000: 0, 5000: 0, 10000: 0, 50000: 0,
  };
  
  let remaining = amount;
  const denominations = [50000, 10000, 5000, 1000, 500, 100, 50, 10] as const;
  
  // 잔돈 복사 (실제 차감하지 않고 시뮬레이션)
  const availableReserve = { ...reserve };
  
  for (const denom of denominations) {
    const needed = Math.floor(remaining / denom);
    const available = availableReserve[denom];
    const use = Math.min(needed, available);
    
    if (use > 0) {
      result[denom] = use;
      availableReserve[denom] -= use;
      remaining -= denom * use;
    }
  }
  
  if (remaining > 0) {
    // 잔돈을 만들 수 없음
    return { success: false, change: null, remaining };
  }
  
  return { success: true, change: result, remaining: 0 };
}
```

### 4.4 canMakeChange 함수
`src/utils/canMakeChange.ts`

```typescript
import type { ChangeReserve } from '@/types';

export function canMakeChange(reserve: ChangeReserve): boolean {
  // 최소한 작은 단위 화폐가 있어야 잔돈을 만들 수 있음
  // 100원, 500원, 1000원이 최소 1개씩 있어야 함
  return reserve[100] > 0 && reserve[500] > 0 && reserve[1000] > 0;
}
```

### 4.5 getTotalChangeAmount 함수
`src/utils/getTotalChangeAmount.ts`

```typescript
import type { ChangeReserve } from '@/types';

export function getTotalChangeAmount(reserve: ChangeReserve): number {
  return (
    reserve[10] * 10 +
    reserve[50] * 50 +
    reserve[100] * 100 +
    reserve[500] * 500 +
    reserve[1000] * 1000 +
    reserve[5000] * 5000 +
    reserve[10000] * 10000 +
    reserve[50000] * 50000
  );
}
```

### 4.6 canPurchase 함수
`src/utils/canPurchase.ts`

```typescript
import type { Product, PaymentMethod } from '@/types';

export function canPurchase(
  product: Product,
  balance: number,
  paymentMethod: PaymentMethod,
  changeAvailable: boolean
): boolean {
  if (product.stock <= 0) return false;
  
  if (paymentMethod === 'cash') {
    return changeAvailable && balance >= product.price;
  }
  
  if (paymentMethod === 'card') {
    return true;
  }
  
  return false;
}
```

## 완료 조건
- 모든 유틸 함수 구현 완료
- 테스트 케이스 검증
- TypeScript 에러 없음
