import type { ChangeReserve } from '@/src/types';

export function calculateChange(
  amount: number,
  reserve: ChangeReserve
): {
  success: boolean;
  change: ChangeReserve | null;
  remaining: number;
} {
  const result: ChangeReserve = {
    10: 0, 50: 0, 100: 0, 500: 0,
    1000: 0, 5000: 0, 10000: 0, 50000: 0,
  };
  
  let remaining = amount;
  const denominations = [50000, 10000, 5000, 1000, 500, 100, 50, 10] as const;
  
  // 잔돈 복사 (실제 차감하지 않고 시뮬레이션)
  const availableReserve = { ...reserve };
  
  for (const denom of denominations) {
    const needed = Math.floor(remaining / denom);
    const available = availableReserve[denom];
    const use = Math.min(needed, available);
    
    if (use > 0) {
      result[denom] = use;
      availableReserve[denom] -= use;
      remaining -= denom * use;
    }
  }
  
  if (remaining > 0) {
    // 잔돈을 만들 수 없음
    return { success: false, change: null, remaining };
  }
  
  return { success: true, change: result, remaining: 0 };
}

