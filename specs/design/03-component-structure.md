# 컴포넌트 구조 설계

## 목적
간단하고 명확한 컴포넌트 구조

## 컴포넌트 계층

```
app/
  page.tsx                          # 메인 페이지 (서버 컴포넌트)
  └─ VendingMachineContainer        # 클라이언트 컴포넌트
      ├─ DisplayPanel               # 금액 표시부
      ├─ ProductButtons             # 음료 버튼 3개
      │   └─ ProductButton          # 개별 음료 버튼
      ├─ PaymentButtons             # 결제 버튼
      │   ├─ CashButtons            # 현금 투입 버튼 5개
      │   └─ CardButton             # 카드 결제 버튼
      ├─ RefundButton               # 환불 버튼
      └─ DispensingArea             # 음료 배출구 (애니메이션)
```

## 컴포넌트 상세

### VendingMachineContainer
최상위 클라이언트 컴포넌트
- xstate machine 초기화 및 관리
- 초기 데이터 props로 받음
- 모든 하위 컴포넌트에 state 전달

```typescript
'use client';

type Props = {
  initialData: InitialMachineState;
};

function VendingMachineContainer({ initialData }: Props) {
  const [state, send] = useVendingMachine(initialData);
  
  return (
    <div>
      <DisplayPanel balance={state.context.balance} />
      <ProductButtons 
        products={state.context.inventory}
        onSelect={(drinkId) => send({ type: 'SELECT_DRINK', drinkId })}
        paymentMethod={state.context.paymentMethod}
        balance={state.context.balance}
      />
      {/* ... */}
    </div>
  );
}
```

### DisplayPanel
금액 표시부
- 현재 잔액 표시
- Props: `balance: number`

### ProductButton
개별 음료 버튼
- 음료 이름, 가격, 재고 표시
- 버튼 상태에 따라 스타일 변경 (disabled/active/purchasable)
- Props: `product: Product, state: ButtonState, onClick: () => void`

### PaymentButtons
결제 버튼 그룹
- 현금 버튼 5개 + 카드 버튼 1개
- Props: `onInsertCash: (amount) => void, onInsertCard: () => void`

### RefundButton
환불 버튼
- 현금 환불 기능
- Props: `onRefund: () => void, disabled: boolean`

### DispensingArea
음료 배출구
- 음료 배출 애니메이션
- Props: `isDispensing: boolean, drinkName: string | null`

## 스타일링 전략

### Tailwind CSS 사용
- 버튼 상태별 클래스:
  - `disabled`: 어두운 배경, "재고없음" 표시
  - `active`: 기본 밝은 배경
  - `purchasable`: 강조된 배경 (더 밝거나 다른 색상)

### 상태별 스타일 예시
```typescript
const buttonStyles = {
  disabled: 'bg-gray-300 cursor-not-allowed opacity-50',
  active: 'bg-blue-500 hover:bg-blue-600',
  purchasable: 'bg-green-500 hover:bg-green-600 ring-4 ring-green-300',
};
```

## 파일 구조

```
src/
  components/
    VendingMachineContainer.tsx
    DisplayPanel.tsx
    ProductButton.tsx
    ProductButtons.tsx
    PaymentButtons.tsx
    RefundButton.tsx
    DispensingArea.tsx
  machines/
    vendingMachine.ts              # xstate 머신 정의
  hooks/
    useVendingMachine.ts           # xstate 머신을 래핑한 훅
  types/
    index.ts                       # 타입 정의
  utils/
    getButtonState.ts              # 비즈니스 로직
app/
  api/
    listProducts.ts                # 서버 액션
  page.tsx                         # 메인 페이지
```

