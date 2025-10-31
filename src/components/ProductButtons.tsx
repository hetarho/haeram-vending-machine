import { ProductButton } from './ProductButton';
import { getButtonState } from '@/src/utils/getButtonState';
import type { Product, PaymentMethod } from '@/src/types';

type Props = {
  products: Product[];
  balance: number;
  paymentMethod: PaymentMethod;
  changeAvailable: boolean;
  onSelectDrink: (product: Product) => void;
};

export function ProductButtons({
  products,
  balance,
  paymentMethod,
  changeAvailable,
  onSelectDrink,
}: Props) {
  return (
    <div className="product-buttons">
      {products.map((product) => {
        const buttonState = getButtonState(
          product,
          balance,
          paymentMethod,
          changeAvailable
        );
        
        return (
          <ProductButton
            key={product.id}
            product={product}
            buttonState={buttonState}
            onClick={() => onSelectDrink(product)}
          />
        );
      })}
    </div>
  );
}

