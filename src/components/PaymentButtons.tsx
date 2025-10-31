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

