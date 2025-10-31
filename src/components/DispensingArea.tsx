type Props = {
  isDispensing: boolean;
  drinkName: string | null;
};

export function DispensingArea({ isDispensing, drinkName }: Props) {
  return (
    <div className="bg-gray-900 rounded-lg p-8 min-h-32 flex items-center justify-center">
      {isDispensing && drinkName && (
        <div className="text-white text-xl animate-bounce">
          {drinkName} 배출 중...
        </div>
      )}
    </div>
  );
}

