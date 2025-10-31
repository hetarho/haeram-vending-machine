import type { ChangeReserve } from '@/src/types';

export function getTotalChangeAmount(reserve: ChangeReserve): number {
  return (
    reserve[10] * 10 +
    reserve[50] * 50 +
    reserve[100] * 100 +
    reserve[500] * 500 +
    reserve[1000] * 1000 +
    reserve[5000] * 5000 +
    reserve[10000] * 10000 +
    reserve[50000] * 50000
  );
}

