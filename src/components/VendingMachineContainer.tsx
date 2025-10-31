'use client';

import { useVendingMachine } from '@/src/hooks/useVendingMachine';
import { DisplayPanel } from './DisplayPanel';
import { ProductButtons } from './ProductButtons';
import { PaymentButtons } from './PaymentButtons';
import { RefundButton } from './RefundButton';
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
    selectDrink,
    refund,
    isDispensing,
    isProcessing,
    canInsertCash,
  } = useVendingMachine(initialData);

  const getStatusMessage = () => {
    if (state === 'processingPayment') return '결제 처리 중...';
    if (state === 'dispensing') return `${context.selectedDrink?.name} 배출 중...`;
    if (state === 'refunding') return '환불 처리 중...';
    if (state === 'error') return context.errorMessage || '오류 발생';
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-8 shadow-2xl">
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
      
      <PaymentButtons
        onInsertCash={insertCash}
        onInsertCard={insertCard}
        canInsertCash={canInsertCash}
      />
      
      <RefundButton
        onRefund={refund}
        balance={context.balance}
      />
      
      <div className="bg-gray-900 rounded-lg p-8 min-h-32 flex items-center justify-center">
        {getStatusMessage() && (
          <div className="text-white text-xl animate-bounce">
            {getStatusMessage()}
          </div>
        )}
      </div>
    </div>
  );
}

