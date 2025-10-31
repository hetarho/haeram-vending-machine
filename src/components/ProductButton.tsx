import type { Product, ButtonState } from '@/src/types';

type Props = {
  product: Product;
  buttonState: ButtonState;
  onClick: () => void;
};

export function ProductButton({ product, buttonState, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`product-button ${buttonState}`}
      data-state={buttonState}
    >
      <div className="product-name">{product.name}</div>
      <div className="product-price">{product.price.toLocaleString()}원</div>
      {buttonState === 'disabled' && (
        <div className="out-of-stock">재고없음</div>
      )}
    </button>
  );
}

