import type { ButtonState, Product, PaymentMethod } from '@/src/types';

export function getButtonState(
  product: Product,
  balance: number,
  paymentMethod: PaymentMethod,
  changeAvailable: boolean
): ButtonState {
  // 재고 없음
  if (product.stock <= 0) {
    return 'disabled';
  }
  
  // 잔돈 부족 + 현금
  if (paymentMethod === 'cash' && !changeAvailable) {
    return 'active';
  }
  
  // 현금 + 잔액 충분
  if (paymentMethod === 'cash' && balance >= product.price) {
    return 'purchasable';
  }
  
  // 카드
  if (paymentMethod === 'card') {
    return 'purchasable';
  }
  
  // 기본 활성
  return 'active';
}
