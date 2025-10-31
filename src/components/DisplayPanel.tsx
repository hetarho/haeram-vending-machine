type Props = {
  balance: number;
  errorMessage: string | null;
};

export function DisplayPanel({ balance, errorMessage }: Props) {
  return (
    <div className="bg-black text-green-400 font-mono text-3xl p-6 rounded-lg mb-6 text-center">
      {errorMessage ? (
        <div className="text-red-500">{errorMessage}</div>
      ) : (
        <div>잔액: {balance.toLocaleString()}원</div>
      )}
    </div>
  );
}

