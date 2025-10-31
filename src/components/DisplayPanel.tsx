type Props = {
  balance: number;
  errorMessage: string | null;
};

export function DisplayPanel({ balance, errorMessage }: Props) {
  return (
    <div>
      {errorMessage ? (
        <div className="error">{errorMessage}</div>
      ) : (
        <div className="balance">잔액: {balance.toLocaleString()}원</div>
      )}
    </div>
  );
}

