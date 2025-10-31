type Props = {
  onInsertCash: (amount: number) => void;
  onInsertCard: () => void;
  canInsertCash: boolean;
};

const CASH_AMOUNTS = [100, 500, 1000, 5000, 10000];

export function PaymentButtons({ onInsertCash, onInsertCard, canInsertCash }: Props) {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-5 gap-2">
        {CASH_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onInsertCash(amount)}
            disabled={!canInsertCash}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {amount.toLocaleString()}원
          </button>
        ))}
      </div>
      <button 
        onClick={onInsertCard} 
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-all"
      >
        카드 결제
      </button>
    </div>
  );
}

