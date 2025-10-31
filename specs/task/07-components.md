# Task 7: 컴포넌트 구현

## 목표
자판기 UI 컴포넌트 구현

## 작업 목록

### 7.1 DisplayPanel 컴포넌트
`src/components/DisplayPanel.tsx`

```typescript
type Props = {
  balance: number;
  errorMessage: string | null;
};

export function DisplayPanel({ balance, errorMessage }: Props) {
  return (
    <div>
      {errorMessage ? (
        <div className="error">{errorMessage}</div>
      ) : (
        <div className="balance">잔액: {balance.toLocaleString()}원</div>
      )}
    </div>
  );
}
```

### 7.2 ProductButton 컴포넌트
`src/components/ProductButton.tsx`

```typescript
import type { Product, ButtonState } from '@/types';

type Props = {
  product: Product;
  buttonState: ButtonState;
  onClick: () => void;
};

export function ProductButton({ product, buttonState, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`product-button ${buttonState}`}
      data-state={buttonState}
    >
      <div className="product-name">{product.name}</div>
      <div className="product-price">{product.price.toLocaleString()}원</div>
      {buttonState === 'disabled' && (
        <div className="out-of-stock">재고없음</div>
      )}
    </button>
  );
}
```

### 7.3 ProductButtons 컴포넌트
`src/components/ProductButtons.tsx`

```typescript
import { ProductButton } from './ProductButton';
import { getButtonState } from '@/utils/getButtonState';
import type { Product, PaymentMethod } from '@/types';

type Props = {
  products: Product[];
  balance: number;
  paymentMethod: PaymentMethod;
  changeAvailable: boolean;
  onSelectDrink: (product: Product) => void;
};

export function ProductButtons({
  products,
  balance,
  paymentMethod,
  changeAvailable,
  onSelectDrink,
}: Props) {
  return (
    <div className="product-buttons">
      {products.map((product) => {
        const buttonState = getButtonState(
          product,
          balance,
          paymentMethod,
          changeAvailable
        );
        
        return (
          <ProductButton
            key={product.id}
            product={product}
            buttonState={buttonState}
            onClick={() => onSelectDrink(product)}
          />
        );
      })}
    </div>
  );
}
```

### 7.4 PaymentButtons 컴포넌트
`src/components/PaymentButtons.tsx`

```typescript
type Props = {
  onInsertCash: (amount: number) => void;
  onInsertCard: () => void;
  canInsertCash: boolean;
};

const CASH_AMOUNTS = [100, 500, 1000, 5000, 10000];

export function PaymentButtons({ onInsertCash, onInsertCard, canInsertCash }: Props) {
  return (
    <div className="payment-buttons">
      <div className="cash-buttons">
        {CASH_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onInsertCash(amount)}
            disabled={!canInsertCash}
            className="cash-button"
          >
            {amount.toLocaleString()}원
          </button>
        ))}
      </div>
      <button onClick={onInsertCard} className="card-button">
        카드 결제
      </button>
    </div>
  );
}
```

### 7.5 RefundButton 컴포넌트
`src/components/RefundButton.tsx`

```typescript
type Props = {
  onRefund: () => void;
  balance: number;
};

export function RefundButton({ onRefund, balance }: Props) {
  return (
    <button
      onClick={onRefund}
      className="refund-button"
    >
      환불 (잔액: {balance.toLocaleString()}원)
    </button>
  );
}
```

### 7.6 DispensingArea 컴포넌트
`src/components/DispensingArea.tsx`

```typescript
type Props = {
  isDispensing: boolean;
  drinkName: string | null;
};

export function DispensingArea({ isDispensing, drinkName }: Props) {
  return (
    <div className="dispensing-area">
      {isDispensing && drinkName && (
        <div className="dispensing-animation">
          {drinkName} 배출 중...
        </div>
      )}
    </div>
  );
}
```

### 7.7 VendingMachineContainer 컴포넌트
`src/components/VendingMachineContainer.tsx`

```typescript
'use client';

import { useVendingMachine } from '@/hooks/useVendingMachine';
import { DisplayPanel } from './DisplayPanel';
import { ProductButtons } from './ProductButtons';
import { PaymentButtons } from './PaymentButtons';
import { RefundButton } from './RefundButton';
import { DispensingArea } from './DispensingArea';
import type { InitialMachineState } from '@/types';

type Props = {
  initialData: InitialMachineState;
};

export function VendingMachineContainer({ initialData }: Props) {
  const {
    context,
    products,
    insertCash,
    insertCard,
    selectDrink,
    refund,
    isDispensing,
    canInsertCash,
  } = useVendingMachine(initialData);

  return (
    <div className="vending-machine">
      <h1>자판기</h1>
      
      <DisplayPanel
        balance={context.balance}
        errorMessage={context.errorMessage}
      />
      
      <ProductButtons
        products={products}
        balance={context.balance}
        paymentMethod={context.paymentMethod}
        changeAvailable={context.changeAvailable}
        onSelectDrink={selectDrink}
      />
      
      <PaymentButtons
        onInsertCash={insertCash}
        onInsertCard={insertCard}
        canInsertCash={canInsertCash}
      />
      
      <RefundButton
        onRefund={refund}
        balance={context.balance}
      />
      
      <DispensingArea
        isDispensing={isDispensing}
        drinkName={context.selectedDrink?.name ?? null}
      />
    </div>
  );
}
```

## 완료 조건
- 모든 컴포넌트 구현 완료
- 컴포넌트 간 데이터 전달 정상 동작
- TypeScript 에러 없음
- 빌드 성공

