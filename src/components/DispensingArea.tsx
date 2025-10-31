type Props = {
  isDispensing: boolean;
  drinkName: string | null;
};

export function DispensingArea({ isDispensing, drinkName }: Props) {
  return (
    <div className="dispensing-area">
      {isDispensing && drinkName && (
        <div className="dispensing-animation">
          {drinkName} 배출 중...
        </div>
      )}
    </div>
  );
}

