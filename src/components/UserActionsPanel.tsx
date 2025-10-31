type Props = {
  onInsertCash: (amount: number) => void;
  onInsertCard: () => void;
  onEjectCard: () => void;
  onRefund: () => void;
  canInsertCash: boolean;
  balance: number;
  isCardInserted: boolean;
};

const CASH_AMOUNTS = [100, 500, 1000, 5000, 10000];

export function UserActionsPanel({ 
  onInsertCash, 
  onInsertCard, 
  onEjectCard,
  onRefund,
  canInsertCash,
  balance,
  isCardInserted
}: Props) {
  return (
    <div className="w-80 bg-gray-700 rounded-2xl p-6 h-fit">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">User Actions</h2>
      
      {/* 현금 투입 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-400 mb-3">💵 현금 투입</h3>
        <div className="grid grid-cols-2 gap-2">
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
      </div>
      
      {/* 카드 투입 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">💳 카드</h3>
        <div className="space-y-2">
          <button 
            onClick={onInsertCard} 
            disabled={isCardInserted}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            카드 투입
          </button>
          <button 
            onClick={onEjectCard} 
            disabled={!isCardInserted}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            카드 회수
          </button>
        </div>
      </div>
      
      {/* 환불 */}
      <div>
        <h3 className="text-lg font-semibold text-red-400 mb-3">💰 환불</h3>
        <button
          onClick={onRefund}
          disabled={balance === 0}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          환불 ({balance.toLocaleString()}원)
        </button>
      </div>
    </div>
  );
}

