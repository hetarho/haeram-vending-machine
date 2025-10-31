# Task 9: 스타일링

## 목표
Tailwind CSS로 자판기 UI 스타일 적용

## 작업 파일
각 컴포넌트 파일 + `app/globals.css`

## 작업 목록

### 9.1 globals.css 기본 스타일
```css
.vending-machine {
  @apply max-w-2xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-2xl;
}
```

### 9.2 DisplayPanel 스타일
```typescript
<div className="bg-black text-green-400 font-mono text-3xl p-6 rounded-lg mb-6 text-center">
  {errorMessage ? (
    <div className="text-red-500">{errorMessage}</div>
  ) : (
    <div>잔액: {balance.toLocaleString()}원</div>
  )}
</div>
```

### 9.3 ProductButton 상태별 스타일
```typescript
<button
  className={cn(
    'w-full p-6 rounded-xl text-lg font-bold transition-all duration-200',
    {
      // disabled: 재고 없음
      'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50':
        buttonState === 'disabled',
      // active: 활성
      'bg-blue-600 hover:bg-blue-700 text-white':
        buttonState === 'active',
      // purchasable: 구매 가능
      'bg-green-500 hover:bg-green-600 text-white ring-4 ring-green-300 scale-105':
        buttonState === 'purchasable',
    }
  )}
>
  {/* ... */}
</button>
```

### 9.4 ProductButtons 레이아웃
```typescript
<div className="grid grid-cols-3 gap-4 mb-6">
  {/* 음료 버튼들 */}
</div>
```

### 9.5 PaymentButtons 스타일
```typescript
<div className="space-y-4 mb-6">
  <div className="grid grid-cols-5 gap-2">
    {CASH_AMOUNTS.map((amount) => (
      <button
        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {amount.toLocaleString()}원
      </button>
    ))}
  </div>
  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg">
    카드 결제
  </button>
</div>
```

### 9.6 RefundButton 스타일
```typescript
<button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg mb-6">
  환불 (잔액: {balance.toLocaleString()}원)
</button>
```

### 9.7 DispensingArea 애니메이션
```typescript
<div className="bg-gray-900 rounded-lg p-8 min-h-32 flex items-center justify-center">
  {isDispensing && drinkName && (
    <div className="text-white text-xl animate-bounce">
      {drinkName} 배출 중...
    </div>
  )}
</div>
```

### 9.8 반응형 디자인
- 모바일: 1열 레이아웃
- 태블릿: 현재 레이아웃 유지
- 데스크탑: 중앙 정렬, 최대 너비 제한

## 완료 조건
- 모든 컴포넌트 스타일 적용 완료
- 버튼 상태별 시각적 차이 명확
- 반응형 동작 확인
- 애니메이션 자연스러움
- 실제 자판기와 유사한 느낌

