# 도메인 모델 설계

## DDD Aggregates

### VendingMachine (자판기)
Root Aggregate - 전체 자판기 상태 관리

```typescript
type ChangeReserve = {
  10: number;      // 10원 개수
  50: number;      // 50원 개수
  100: number;     // 100원 개수
  500: number;     // 500원 개수
  1000: number;    // 1000원 개수
  5000: number;    // 5000원 개수
  10000: number;   // 10000원 개수
  50000: number;   // 50000원 개수
};

type VendingMachine = {
  balance: number;              // 현재 투입 금액 (사용자)
  changeReserve: ChangeReserve; // 자판기 보유 잔돈 (화폐별 개수)
  changeAvailable: boolean;     // 잔돈 충분 여부
  paymentMethod: 'cash' | 'card' | null;
  selectedDrink: Product | null; // 선택된 음료
  products: Product[];          // 음료 목록 (재고 포함)
  state: MachineState;          // 상태 머신 상태
};
```

### Product (음료)
Value Object

```typescript
type Product = {
  id: string;                   // 'cola' | 'water' | 'coffee'
  name: string;                 // 표시 이름
  price: number;                // 가격
  stock: number;                // 재고 수량
};
```

### Transaction (거래)
Entity - 단일 구매 거래

```typescript
type Transaction = {
  drinkId: string;
  drinkName: string;
  price: number;
  paymentMethod: 'cash' | 'card';
  timestamp: number;
  status: 'success' | 'failed';
};
```

## 초기 데이터 구조

```typescript
type InitialMachineState = {
  products: Product[];
  changeReserve: ChangeReserve; // 자판기 보유 잔돈 (화폐별 개수)
  changeAvailable: boolean;     // 거스름돈 가능 여부
};
```

## 비즈니스 로직

### 구매 가능 여부 확인
```typescript
function canPurchase(
  product: Product,
  balance: number,
  paymentMethod: 'cash' | 'card' | null
): boolean {
  if (product.stock <= 0) return false;
  
  if (paymentMethod === 'cash') {
    return balance >= product.price;
  }
  
  if (paymentMethod === 'card') {
    return true;
  }
  
  return false;
}
```

### 버튼 상태 계산
```typescript
type ButtonState = 'disabled' | 'active' | 'purchasable';

function getButtonState(
  product: Product,
  balance: number,
  paymentMethod: 'cash' | 'card' | null
): ButtonState {
  if (product.stock <= 0) return 'disabled';
  
  if (paymentMethod === 'cash' && balance >= product.price) {
    return 'purchasable';
  }
  
  if (paymentMethod === 'card') {
    return 'purchasable';
  }
  
  return 'active';
}
```

## 서버 액션

### listProducts
위치: `app/api/listProducts.ts`

```typescript
'use server';

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
      { id: 'cola', name: '콜라', price: 1100, stock: 10 },
      { id: 'water', name: '물', price: 600, stock: 5 },
      { id: 'coffee', name: '커피', price: 700, stock: 0 }, // 재고 없음 예시
    ],
    changeReserve,
    changeAvailable: canMakeChange(changeReserve),
  };
}

// 잔돈을 만들 수 있는지 체크
function canMakeChange(reserve: ChangeReserve): boolean {
  // 최소한 100원, 500원, 1000원이 있어야 함
  return reserve[100] > 0 && reserve[500] > 0 && reserve[1000] > 0;
}
```

## 데이터 흐름

1. **초기화**: 서버 액션으로 초기 데이터 로드
2. **상태 관리**: xstate machine의 context에 저장
3. **업데이트**: 이벤트 발생 시 context 업데이트
4. **새로고침**: 페이지 새로고침 시 초기 데이터로 리셋

