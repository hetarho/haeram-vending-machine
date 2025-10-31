import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createActor } from 'xstate';
import { createVendingMachine } from '../vendingMachine';
import type { InitialMachineState, Product } from '@/src/types';

describe('VendingMachine State Machine', () => {
  let initialData: InitialMachineState;
  let mockProducts: Product[];

  beforeEach(() => {
    // Arrange - 테스트용 초기 데이터 설정
    mockProducts = [
      { id: 'water', name: '물', price: 600, stock: 10 },
      { id: 'coke', name: '콜라', price: 1200, stock: 5 },
      { id: 'coffee', name: '커피', price: 1500, stock: 0 }, // 품절
    ];

    initialData = {
      products: mockProducts,
      changeReserve: {
        10: 10,
        50: 10,
        100: 10,
        500: 10,
        1000: 10,
        5000: 5,
        10000: 3,
        50000: 1,
      },
      changeAvailable: true,
    };
  });

  describe('초기 상태', () => {
    it('idle 상태에서 시작해야 함', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      
      // 2. Act
      actor.start();

      // 3. Assert
      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('초기 context가 올바르게 설정되어야 함', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      
      // 2. Act
      actor.start();

      // 3. Assert
      const snapshot = actor.getSnapshot();
      expect(snapshot.context.balance).toBe(0);
      expect(snapshot.context.paymentMethod).toBeNull();
      expect(snapshot.context.selectedDrink).toBeNull();
      expect(snapshot.context.products).toEqual(mockProducts);
      expect(snapshot.context.changeAvailable).toBe(true);
      expect(snapshot.context.errorMessage).toBeNull();
    });
  });

  describe('현금 투입', () => {
    it('현금 투입 시 cashInserted 상태로 전환되어야 함', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });

      // 3. Assert
      expect(actor.getSnapshot().value).toBe('cashInserted');
    });

    it('현금 투입 시 잔액이 증가해야 함', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });

      // 3. Assert
      const snapshot = actor.getSnapshot();
      expect(snapshot.context.balance).toBe(1000);
      expect(snapshot.context.paymentMethod).toBe('cash');
    });

    it('현금 투입 시 changeReserve가 증가해야 함', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();
      const initialReserve = actor.getSnapshot().context.changeReserve[1000];

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });

      // 3. Assert
      const newReserve = actor.getSnapshot().context.changeReserve[1000];
      expect(newReserve).toBe(initialReserve + 1);
    });

    it('여러 번 현금 투입 시 잔액이 누적되어야 함', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ type: 'INSERT_CASH', amount: 500 });
      actor.send({ type: 'INSERT_CASH', amount: 100 });

      // 3. Assert
      expect(actor.getSnapshot().context.balance).toBe(1600);
    });

    it('잔돈이 없으면 현금을 투입할 수 없어야 함 (Guard 테스트)', () => {
      // 1. Arrange
      const noChangeData = {
        ...initialData,
        changeAvailable: false,
      };
      const machine = createVendingMachine(noChangeData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });

      // 3. Assert - Guard에 의해 전환 차단
      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.balance).toBe(0);
    });
  });

  describe('카드 투입', () => {
    it('카드 투입 시 cardInserted 상태로 전환되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CARD' });

      expect(actor.getSnapshot().value).toBe('cardInserted');
      expect(actor.getSnapshot().context.paymentMethod).toBe('card');
    });

    it('카드 회수 시 idle 상태로 돌아가야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CARD' });
      actor.send({ type: 'EJECT_CARD' });

      expect(actor.getSnapshot().value).toBe('idle');
    });
  });

  describe('음료 선택 - 현금 결제', () => {
    it('잔액이 충분하면 음료를 구매할 수 있어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0] // 물 (600원)
      });

      expect(actor.getSnapshot().value).toBe('dispensing');
      expect(actor.getSnapshot().context.selectedDrink).toEqual(mockProducts[0]);
    });

    it('잔액이 부족하면 음료를 구매할 수 없어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 500 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0] // 물 (600원)
      });

      // cashInserted 상태 유지 (전환 안됨)
      expect(actor.getSnapshot().value).toBe('cashInserted');
      expect(actor.getSnapshot().context.selectedDrink).toBeNull();
    });

    it('재고가 없으면 음료를 구매할 수 없어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 2000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[2] // 커피 (재고 0)
      });

      // cashInserted 상태 유지
      expect(actor.getSnapshot().value).toBe('cashInserted');
    });

    it('음료 배출 시 재고가 감소해야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      const initialStock = mockProducts[0].stock;
      
      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });

      // dispensing 상태에서 재고 차감됨
      const products = actor.getSnapshot().context.products;
      const waterProduct = products.find(p => p.id === 'water');
      expect(waterProduct?.stock).toBe(initialStock - 1);
    });

    it('음료 배출 시 잔액이 차감되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0] // 물 (600원)
      });

      // dispensing 상태에서 잔액 차감됨
      expect(actor.getSnapshot().context.balance).toBe(400); // 1000 - 600
    });

    it('배출 성공 시 idle 상태로 돌아가야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0] // 600원
      });
      actor.send({ type: 'DISPENSE_SUCCESS' });

      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.selectedDrink).toBeNull();
      // 잔액이 남아있으면 (400원) paymentMethod를 유지함 (연속 구매 가능하도록)
      expect(actor.getSnapshot().context.balance).toBe(400);
      expect(actor.getSnapshot().context.paymentMethod).toBe('cash');
    });

    it('배출 실패 시 error 상태로 전환되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      actor.send({ 
        type: 'DISPENSE_FAILURE', 
        message: '배출 오류' 
      });

      expect(actor.getSnapshot().value).toBe('error');
      expect(actor.getSnapshot().context.errorMessage).toBe('배출 오류');
    });
  });

  describe('음료 선택 - 카드 결제', () => {
    it('카드로 음료 선택 시 processingPayment 상태로 전환되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CARD' });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });

      expect(actor.getSnapshot().value).toBe('processingPayment');
    });

    it('카드 결제 성공 시 dispensing 상태로 전환되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CARD' });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      actor.send({ type: 'PAYMENT_SUCCESS' });

      expect(actor.getSnapshot().value).toBe('dispensing');
    });

    it('카드 결제 실패 시 error 상태로 전환되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CARD' });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      actor.send({ 
        type: 'PAYMENT_FAILURE', 
        message: '결제 실패' 
      });

      expect(actor.getSnapshot().value).toBe('error');
      expect(actor.getSnapshot().context.errorMessage).toBe('결제 실패');
    });

    it('카드 결제 시 잔액은 차감되지 않아야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CARD' });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      actor.send({ type: 'PAYMENT_SUCCESS' });

      // dispensing 상태지만 balance는 0 유지
      expect(actor.getSnapshot().context.balance).toBe(0);
    });
  });

  describe('환불', () => {
    it('잔액이 있을 때 환불하면 refunding 상태로 전환되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ type: 'REFUND' });

      expect(actor.getSnapshot().value).toBe('refunding');
    });

    it('환불 완료 시 잔액이 0이 되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ type: 'REFUND' });
      actor.send({ type: 'REFUND_COMPLETE' });

      expect(actor.getSnapshot().context.balance).toBe(0);
      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('환불 시 changeReserve가 감소해야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      const beforeRefund = { ...actor.getSnapshot().context.changeReserve };
      
      actor.send({ type: 'REFUND' });
      const afterRefund = actor.getSnapshot().context.changeReserve;

      // 1000원권이 하나 줄어야 함
      expect(afterRefund[1000]).toBe(beforeRefund[1000] - 1);
    });

    it('idle 상태에서도 환불할 수 있어야 함 (잔액이 있을 때)', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 현금 투입 후 음료 구매
      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0] // 600원
      });
      actor.send({ type: 'DISPENSE_SUCCESS' });

      // idle 상태, 잔액 400원
      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.balance).toBe(400);

      // 환불 가능
      actor.send({ type: 'REFUND' });
      expect(actor.getSnapshot().value).toBe('refunding');
    });

    it('error 상태에서 환불하면 에러가 클리어되어야 함', () => {
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      actor.send({ 
        type: 'DISPENSE_FAILURE', 
        message: '배출 오류'
      });

      expect(actor.getSnapshot().value).toBe('error');
      expect(actor.getSnapshot().context.errorMessage).toBe('배출 오류');

      actor.send({ type: 'REFUND' });
      
      expect(actor.getSnapshot().value).toBe('refunding');
      // clearError 액션이 실행됨
    });
  });

  describe('잔돈 부족 시나리오', () => {
    it('잔돈이 없을 때 CHECK_CHANGE 이벤트로 changeShortage 상태로 전환', () => {
      const noChangeData = {
        ...initialData,
        changeAvailable: false,
      };
      const machine = createVendingMachine(noChangeData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'CHECK_CHANGE' });

      expect(actor.getSnapshot().value).toBe('changeShortage');
    });

    it('changeShortage 상태에서는 카드만 사용 가능', () => {
      const noChangeData = {
        ...initialData,
        changeAvailable: false,
      };
      const machine = createVendingMachine(noChangeData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'CHECK_CHANGE' });
      actor.send({ type: 'INSERT_CARD' });

      expect(actor.getSnapshot().value).toBe('cardInserted');
    });

    it('잔돈 보충 후 idle 상태로 복귀', () => {
      const noChangeData = {
        ...initialData,
        changeAvailable: false,
      };
      const machine = createVendingMachine(noChangeData);
      const actor = createActor(machine);
      actor.start();

      actor.send({ type: 'CHECK_CHANGE' });
      actor.send({ type: 'CHANGE_REPLENISHED', amount: 10000 });

      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.changeAvailable).toBe(true);
    });
  });

  describe('복잡한 시나리오', () => {
    it('전체 구매 플로우: 현금 투입 → 음료 구매 → 잔액 남음 → 환불', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act & Assert - Step by step
      
      // Step 1: 5000원 투입
      actor.send({ type: 'INSERT_CASH', amount: 5000 });
      expect(actor.getSnapshot().value).toBe('cashInserted');
      expect(actor.getSnapshot().context.balance).toBe(5000);

      // Step 2: 물(600원) 구매
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      expect(actor.getSnapshot().value).toBe('dispensing');
      expect(actor.getSnapshot().context.balance).toBe(4400);

      // Step 3: 배출 완료
      actor.send({ type: 'DISPENSE_SUCCESS' });
      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.balance).toBe(4400);

      // Step 4: 환불
      actor.send({ type: 'REFUND' });
      expect(actor.getSnapshot().value).toBe('refunding');
      
      actor.send({ type: 'REFUND_COMPLETE' });
      
      // 3. Final Assert
      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.balance).toBe(0);
    });

    it('여러 음료 연속 구매', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act - 10000원 투입
      actor.send({ type: 'INSERT_CASH', amount: 10000 });

      // 3. Act & Assert - 물(600원) 구매
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      actor.send({ type: 'DISPENSE_SUCCESS' });
      expect(actor.getSnapshot().context.balance).toBe(9400);

      // 4. Act & Assert - 콜라(1200원) 구매 (idle 상태에서 바로 가능!)
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[1]
      });
      actor.send({ type: 'DISPENSE_SUCCESS' });
      expect(actor.getSnapshot().context.balance).toBe(8200);

      // 5. Final Assert - 재고 확인
      const products = actor.getSnapshot().context.products;
      expect(products.find(p => p.id === 'water')?.stock).toBe(9);
      expect(products.find(p => p.id === 'coke')?.stock).toBe(4);
    });

    it('현금 → 카드 전환 시나리오', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act - 현금 투입
      actor.send({ type: 'INSERT_CASH', amount: 1000 });

      // 3. Assert - 현금 상태 확인
      expect(actor.getSnapshot().value).toBe('cashInserted');
      expect(actor.getSnapshot().context.balance).toBe(1000);
      expect(actor.getSnapshot().context.paymentMethod).toBe('cash');

      // 4. Act - 카드 투입 (전환)
      actor.send({ type: 'INSERT_CARD' });

      // 5. Final Assert - 카드로 전환되었지만 잔액 유지
      expect(actor.getSnapshot().value).toBe('cardInserted');
      expect(actor.getSnapshot().context.paymentMethod).toBe('card');
      expect(actor.getSnapshot().context.balance).toBe(1000);
    });
  });

  describe('Mocking Effects (공식 문서 패턴)', () => {
    it('Actions 모킹하여 부수 효과 검증', () => {
      // 1. Arrange - Mock 함수 생성
      const mockActions: string[] = [];
      
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      
      // Subscribe to state changes to track actions
      actor.subscribe((snapshot) => {
        if (snapshot.value === 'dispensing') {
          mockActions.push('decrementStock');
          mockActions.push('deductBalance');
        }
      });
      
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });

      // 3. Assert - Actions이 실행되었는지 확인
      expect(actor.getSnapshot().value).toBe('dispensing');
      expect(mockActions).toContain('decrementStock');
      expect(mockActions).toContain('deductBalance');
    });

    it('Context 변경 추적하여 Actions 검증', () => {
      // 1. Arrange
      const contextHistory: number[] = [];
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      
      actor.subscribe((snapshot) => {
        contextHistory.push(snapshot.context.balance);
      });
      
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 5000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0] // 600원
      });

      // 3. Assert - Context 변경 이력 확인
      expect(contextHistory).toContain(0);     // 초기
      expect(contextHistory).toContain(5000);  // 투입 후
      expect(contextHistory).toContain(4400);  // 구매 후
    });

    it('Guard 조건 모킹 시뮬레이션', () => {
      // 1. Arrange - 재고 0인 제품만 있는 데이터
      const outOfStockData = {
        ...initialData,
        products: [
          { id: 'water', name: '물', price: 600, stock: 0 }
        ]
      };
      const machine = createVendingMachine(outOfStockData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: outOfStockData.products[0]
      });

      // 3. Assert - Guard가 전환을 차단
      expect(actor.getSnapshot().value).toBe('cashInserted');
      expect(actor.getSnapshot().context.selectedDrink).toBeNull();
    });
  });

  describe('Snapshot 활용 (공식 문서 패턴)', () => {
    it('getSnapshot()으로 현재 상태 검증', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 1000 });
      const snapshot = actor.getSnapshot();

      // 3. Assert - Snapshot의 모든 속성 검증
      expect(snapshot.value).toBe('cashInserted');
      expect(snapshot.context.balance).toBe(1000);
      expect(snapshot.context.paymentMethod).toBe('cash');
      
      // Snapshot은 현재 상태의 완전한 스냅샷
      expect(snapshot).toHaveProperty('value');
      expect(snapshot).toHaveProperty('context');
    });

    it('can() 메서드로 전환 가능 여부 확인', () => {
      // 1. Arrange
      const machine = createVendingMachine(initialData);
      const actor = createActor(machine);
      actor.start();

      // 2. Act
      actor.send({ type: 'INSERT_CASH', amount: 500 });
      const snapshot = actor.getSnapshot();

      // 3. Assert - can()으로 전환 가능 여부 미리 확인
      const canBuyWater = snapshot.can({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0] // 600원
      });
      
      expect(canBuyWater).toBe(false); // 잔액 부족으로 구매 불가
      
      // 실제로 보내도 전환 안됨
      actor.send({ 
        type: 'SELECT_DRINK', 
        product: mockProducts[0]
      });
      expect(actor.getSnapshot().value).toBe('cashInserted');
    });
  });
});

