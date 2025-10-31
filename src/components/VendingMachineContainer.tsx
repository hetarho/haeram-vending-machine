'use client';

import { useVendingMachine } from '@/src/hooks/useVendingMachine';
import { DisplayPanel } from './DisplayPanel';
import { ProductButtons } from './ProductButtons';
import { UserActionsPanel } from './UserActionsPanel';
import { DevConsole } from './DevConsole';
import type { InitialMachineState } from '@/src/types';

type Props = {
  initialData: InitialMachineState;
};

export function VendingMachineContainer({ initialData }: Props) {
  const {
    state,
    context,
    products,
    insertCash,
    insertCard,
    ejectCard,
    selectDrink,
    refund,
    canInsertCash,
    statusMessage,
  } = useVendingMachine(initialData);

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      {/* 왼쪽: 자판기 */}
      <div className="flex-1 bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">자판기</h1>
        
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
        
        {/* 상태 메시지 영역 */}
        <div className="bg-gray-900 rounded-lg p-8 min-h-32 flex items-center justify-center mb-6">
          {statusMessage ? (
            <div className="text-white text-xl font-semibold animate-pulse">
              {statusMessage}
            </div>
          ) : (
            <div className="text-gray-600 text-lg">
              음료를 선택해주세요
            </div>
          )}
        </div>

        {/* 개발자 콘솔 */}
        <DevConsole state={state} context={context} />
      </div>
      
      {/* 오른쪽: User Actions */}
      <UserActionsPanel
        onInsertCash={insertCash}
        onInsertCard={insertCard}
        onEjectCard={ejectCard}
        onRefund={refund}
        canInsertCash={canInsertCash}
        balance={context.balance}
        isCardInserted={state === 'cardInserted'}
      />
    </div>
  );
}

