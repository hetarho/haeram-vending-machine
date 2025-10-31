import type { Product, PaymentMethod } from '@/src/types';

export function canPurchase(
  product: Product,
  balance: number,
  paymentMethod: PaymentMethod,
  changeAvailable: boolean
): boolean {
  if (product.stock <= 0) return false;
  
  if (paymentMethod === 'cash') {
    return changeAvailable && balance >= product.price;
  }
  
  if (paymentMethod === 'card') {
    return true;
  }
  
  return false;
}

