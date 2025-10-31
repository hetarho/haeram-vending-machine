'use client';

import { useVendingMachine } from '@/src/hooks/useVendingMachine';
import { DisplayPanel } from './DisplayPanel';
import { ProductButtons } from './ProductButtons';
import { UserActionsPanel } from './UserActionsPanel';
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
    isDispensing,
    isProcessing,
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
        <div className="bg-black rounded-lg p-4 font-mono text-xs border border-green-500">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/30">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-400 font-bold">VENDING MACHINE INTERNAL STATE</span>
        </div>
        
        <div className="space-y-1 text-green-400">
          <div className="flex gap-2">
            <span className="text-green-600">→</span>
            <span className="text-yellow-400">state:</span>
            <span className="text-white font-bold">{state}</span>
          </div>
          
          <div className="flex gap-2">
            <span className="text-green-600">→</span>
            <span className="text-yellow-400">balance:</span>
            <span className="text-white">{context.balance.toLocaleString()}원</span>
          </div>
          
          <div className="flex gap-2">
            <span className="text-green-600">→</span>
            <span className="text-yellow-400">paymentMethod:</span>
            <span className="text-white">{context.paymentMethod || 'null'}</span>
          </div>
          
          <div className="flex gap-2">
            <span className="text-green-600">→</span>
            <span className="text-yellow-400">selectedDrink:</span>
            <span className="text-white">
              {context.selectedDrink ? `${context.selectedDrink.name} (${context.selectedDrink.price}원)` : 'null'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <span className="text-green-600">→</span>
            <span className="text-yellow-400">changeAvailable:</span>
            <span className={context.changeAvailable ? 'text-green-400' : 'text-red-400'}>
              {context.changeAvailable.toString()}
            </span>
          </div>
          
          <div className="flex gap-2">
            <span className="text-green-600">→</span>
            <span className="text-yellow-400">errorMessage:</span>
            <span className="text-red-400">{context.errorMessage || 'null'}</span>
          </div>
          
          <div className="mt-3 pt-2 border-t border-green-500/30">
            <div className="text-yellow-400 mb-1">changeReserve (잔돈 보유량):</div>
            <div className="grid grid-cols-4 gap-x-4 gap-y-1 ml-4">
              <div className="flex gap-2">
                <span className="text-cyan-400">50,000원:</span>
                <span className="text-white">{context.changeReserve[50000]}개</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">10,000원:</span>
                <span className="text-white">{context.changeReserve[10000]}개</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">5,000원:</span>
                <span className="text-white">{context.changeReserve[5000]}개</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">1,000원:</span>
                <span className="text-white">{context.changeReserve[1000]}개</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">500원:</span>
                <span className="text-white">{context.changeReserve[500]}개</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">100원:</span>
                <span className="text-white">{context.changeReserve[100]}개</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">50원:</span>
                <span className="text-white">{context.changeReserve[50]}개</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">10원:</span>
                <span className="text-white">{context.changeReserve[10]}개</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-green-500/30">
            <div className="text-yellow-400 mb-1">products:</div>
            {context.products.map((product, index) => (
              <div key={product.id} className="flex gap-2 ml-4">
                <span className="text-green-600">→</span>
                <span className="text-cyan-400">[{index}]</span>
                <span className="text-white">
                  {product.name}: {product.price}원 (재고: {product.stock})
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
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

