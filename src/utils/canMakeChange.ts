import type { ChangeReserve } from '@/src/types';

export function canMakeChange(reserve: ChangeReserve): boolean {
  // 최소한 작은 단위 화폐가 있어야 잔돈을 만들 수 있음
  // 100원, 500원, 1000원이 최소 1개씩 있어야 함
  return reserve[100] > 0 && reserve[500] > 0 && reserve[1000] > 0;
}

