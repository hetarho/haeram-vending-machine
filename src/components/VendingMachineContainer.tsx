'use client';

import { useVendingMachine } from '@/src/hooks/useVendingMachine';
import { DisplayPanel } from './DisplayPanel';
import { ProductButtons } from './ProductButtons';
import { PaymentButtons } from './PaymentButtons';
import { RefundButton } from './RefundButton';
import { DispensingArea } from './DispensingArea';
import type { InitialMachineState } from '@/src/types';

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

