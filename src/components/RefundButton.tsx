type Props = {
  onRefund: () => void;
  balance: number;
};

export function RefundButton({ onRefund, balance }: Props) {
  return (
    <button
      onClick={onRefund}
      className="refund-button"
    >
      환불 (잔액: {balance.toLocaleString()}원)
    </button>
  );
}

