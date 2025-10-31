# Task 11: 요구사항 수정 및 버그 수정

## 목표
사용자 피드백을 반영하여 자판기 동작 개선

## 문제점 및 개선사항

### 11.1 환불 시 잔돈 보유량 업데이트
**문제**: 환불 시 changeReserve가 업데이트되지 않음

**해결**: 
- `src/machines/vendingMachine.ts`의 `refundBalance` 액션 수정
- 환불 시 잔돈에서 차감된 금액을 changeReserve에 추가

```typescript
refundBalance: assign({
  balance: ({ context }) => {
    // 환불할 금액을 잔돈 보유량에 추가
    const refundAmount = context.balance;
    // calculateChange로 필요한 화폐 계산 후 changeReserve 업데이트
    return 0;
  },
  changeReserve: ({ context }) => {
    // 환불 금액을 화폐로 변환하여 changeReserve에 추가
    // (실제 구현에서는 투입된 화폐를 기억하거나, 잔돈으로 반환)
    return context.changeReserve;
  },
}),
```

### 11.2 자동 환불 기능 제거
**문제**: 카드 삽입 시, 에러 발생 시 자동 환불됨

**해결**:
1. 카드 삽입 시 자동 환불 제거
   - `cashInserted` → `cardInserted` 전환에서 `refundBalance` 액션 제거
   
2. 에러 상태에서 자동 환불 제거
   - `error` 상태에서 `refundBalance` entry 액션 제거
   - 사용자가 명시적으로 환불 버튼을 눌러야 함
   - `error` 상태에서 `REFUND` 이벤트 추가

```typescript
error: {
  entry: ['setError'], // refundBalance 제거
  on: {
    REFUND: {  // 명시적 환불 버튼
      target: 'refunding',
    },
  },
},
```

3. useVendingMachine 훅에서 자동 환불 타이머 제거
   - error 상태 자동 처리 로직 삭제

### 11.3 용어 변경: "카드 결제" → "카드 투입"
**변경 위치**:
- `src/components/PaymentButtons.tsx`: 버튼 텍스트 변경
- 기타 주석이나 문서에서 "카드 결제" → "카드 투입"

### 11.4 UI 레이아웃 변경
**목표**: 결제 수단 버튼을 자판기 우측으로 분리

**현재 구조**:
```
[자판기]
  - Display
  - 음료 버튼들
  - 결제 버튼들 (현금/카드)
  - 환불 버튼
  - 배출구
```

**변경 후 구조**:
```
[자판기]                [User Actions]
  - Display               - 현금 투입 (100원~10000원)
  - 음료 버튼들           - 카드 투입
  - 환불 버튼             - 환불
  - 배출구
  - 개발자 콘솔
```

**구현**:
1. `VendingMachineContainer.tsx` 레이아웃을 flex로 변경
2. PaymentButtons를 UserActionsPanel로 이름 변경
3. RefundButton을 UserActionsPanel로 이동
4. 우측에 배치

```typescript
<div className="flex gap-6">
  {/* 왼쪽: 자판기 */}
  <div className="flex-1 bg-gray-800 rounded-2xl p-8">
    {/* 자판기 내부 */}
  </div>
  
  {/* 오른쪽: User Actions */}
  <div className="w-80 bg-gray-700 rounded-2xl p-6">
    <h2>User Actions</h2>
    {/* 결제 버튼들 */}
    {/* 환불 버튼 */}
  </div>
</div>
```

## 작업 순서
1. State machine 수정 (자동 환불 제거, error 상태 수정)
2. Hook 수정 (자동 환불 타이머 제거)
3. 용어 변경 (카드 결제 → 카드 투입)
4. UI 레이아웃 변경 (User Actions 패널 분리)
5. 잔돈 보유량 업데이트 로직 (추후 구현 가능)

## 완료 조건
- [ ] 카드 삽입 시 자동 환불 안됨
- [ ] 에러 발생 시 자동 환불 안됨
- [ ] 에러 상태에서 환불 버튼으로만 환불 가능
- [ ] "카드 결제" → "카드 투입"으로 변경
- [ ] User Actions 패널이 자판기 우측에 분리됨
- [ ] TypeScript 에러 없음

## 참고사항
**잔돈 보유량 업데이트**는 복잡한 로직이 필요하므로:
- 현재는 잔돈이 무한하다고 가정
- 추후 Task 12로 분리하여 구현 가능

