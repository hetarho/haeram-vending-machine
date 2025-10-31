import type { Product, VendingMachineContext } from "@/src/types";

type StateItemProps = {
  label: string;
  value: string | number;
  valueColor?: string;
};

function StateItem({
  label,
  value,
  valueColor = "text-white",
}: StateItemProps) {
  return (
    <div className="flex gap-2">
      <span className="text-green-600">→</span>
      <span className="text-yellow-400">{label}:</span>
      <span className={valueColor}>{value}</span>
    </div>
  );
}

type ChangeReserveItemProps = {
  denomination: number;
  count: number;
};

function ChangeReserveItem({ denomination, count }: ChangeReserveItemProps) {
  return (
    <div className="flex gap-2">
      <span className="text-cyan-400">{denomination.toLocaleString()}원:</span>
      <span className="text-white">{count}개</span>
    </div>
  );
}

type Props = {
  state: string;
  context: VendingMachineContext;
};

export function DevConsole({ state, context }: Props) {
  const denominations = [50000, 10000, 5000, 1000, 500, 100, 50, 10] as const;

  return (
    <div className="bg-black rounded-lg p-4 font-mono text-xs border border-green-500">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/30">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-green-400 font-bold">
          VENDING MACHINE INTERNAL STATE
        </span>
      </div>

      <div className="space-y-1 text-green-400">
        <StateItem
          label="state"
          value={state}
          valueColor="text-white font-bold"
        />

        <StateItem
          label="balance"
          value={`${context.balance.toLocaleString()}원`}
        />

        <StateItem
          label="paymentMethod"
          value={context.paymentMethod || "null"}
        />

        <StateItem
          label="selectedDrink"
          value={
            context.selectedDrink
              ? `${context.selectedDrink.name} (${context.selectedDrink.price}원)`
              : "null"
          }
        />

        <StateItem
          label="changeAvailable"
          value={context.changeAvailable.toString()}
          valueColor={
            context.changeAvailable ? "text-green-400" : "text-red-400"
          }
        />

        <StateItem
          label="errorMessage"
          value={context.errorMessage || "null"}
          valueColor="text-red-400"
        />

        <div className="mt-3 pt-2 border-t border-green-500/30">
          <div className="text-yellow-400 mb-1">
            changeReserve (잔돈 보유량):
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-1 ml-4">
            {denominations.map((denomination) => (
              <ChangeReserveItem
                key={denomination}
                denomination={denomination}
                count={context.changeReserve[denomination]}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-green-500/30">
          <div className="text-yellow-400 mb-1">products:</div>
          {context.products.map((product: Product, index: number) => (
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
  );
}
