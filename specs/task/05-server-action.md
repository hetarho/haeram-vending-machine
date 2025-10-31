# Task 5: 서버 액션 구현

## 목표
초기 데이터 로딩 서버 액션 구현

## 작업 파일
`app/api/listProducts.ts`

## 작업 내용

### 5.1 listProducts 서버 액션
```typescript
'use server';

import type { InitialMachineState, ChangeReserve } from '@/types';
import { canMakeChange } from '@/utils/canMakeChange';

export async function listProducts(): Promise<InitialMachineState> {
  // 실제로는 DB에서 가져오지만, 여기서는 하드코딩
  const changeReserve: ChangeReserve = {
    10: 10,      // 10원 x 10개 = 100원
    50: 10,      // 50원 x 10개 = 500원
    100: 20,     // 100원 x 20개 = 2,000원
    500: 20,     // 500원 x 20개 = 10,000원
    1000: 10,    // 1000원 x 10개 = 10,000원
    5000: 5,     // 5000원 x 5개 = 25,000원
    10000: 3,    // 10000원 x 3개 = 30,000원
    50000: 0,    // 50000원 x 0개 = 0원
  };
  
  return {
    products: [
      {
        id: 'cola',
        name: '콜라',
        price: 1100,
        stock: 10,
      },
      {
        id: 'water',
        name: '물',
        price: 600,
        stock: 5,
      },
      {
        id: 'coffee',
        name: '커피',
        price: 700,
        stock: 0, // 재고 없음 예시
      },
    ],
    changeReserve,
    changeAvailable: canMakeChange(changeReserve),
  };
}
```

### 5.2 시뮬레이션용 서버 액션 (선택사항)
카드 결제 시뮬레이션
```typescript
export async function processCardPayment(amount: number): Promise<{
  success: boolean;
  message?: string;
}> {
  // 시뮬레이션: 90% 성공
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  if (Math.random() > 0.1) {
    return { success: true };
  }
  
  return { success: false, message: '카드 승인 실패' };
}
```

## 완료 조건
- listProducts 함수 구현 완료
- 서버 액션 정상 동작 확인
- TypeScript 에러 없음

