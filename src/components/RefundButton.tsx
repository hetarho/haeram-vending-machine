type Props = {
  onRefund: () => void;
  balance: number;
};

export function RefundButton({ onRefund, balance }: Props) {
  return (
    <button
      onClick={onRefund}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg mb-6 transition-all"
    >
      환불 (잔액: {balance.toLocaleString()}원)
    </button>
  );
}

