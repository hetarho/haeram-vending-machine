import type { Product, ButtonState } from '@/src/types';

type Props = {
  product: Product;
  buttonState: ButtonState;
  onClick: () => void;
};

export function ProductButton({ product, buttonState, onClick }: Props) {
  const getButtonClassName = () => {
    const baseClass = 'w-full p-6 rounded-xl text-lg font-bold transition-all duration-200';
    
    if (buttonState === 'disabled') {
      return `${baseClass} bg-gray-600 text-gray-400 cursor-not-allowed opacity-50`;
    }
    if (buttonState === 'active') {
      return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`;
    }
    if (buttonState === 'purchasable') {
      return `${baseClass} bg-green-500 hover:bg-green-600 text-white ring-4 ring-green-300 scale-105`;
    }
    return baseClass;
  };

  return (
    <button
      onClick={onClick}
      className={getButtonClassName()}
      data-state={buttonState}
    >
      <div className="product-name">{product.name}</div>
      <div className="product-price">{product.price.toLocaleString()}원</div>
      {buttonState === 'disabled' && (
        <div className="out-of-stock text-sm mt-2">재고없음</div>
      )}
    </button>
  );
}

