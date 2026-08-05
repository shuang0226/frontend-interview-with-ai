import type { Coupon } from '../types/coupon';

export function claimCoupon(coupons: Coupon[], couponId: string): Coupon[] {
  return coupons.map((coupon) => (
    coupon.id === couponId && coupon.claimState === 'unclaimed'
      ? { ...coupon, claimState: 'claimed' }
      : coupon
  ));
}

export function claimCoupons(coupons: Coupon[], couponIds: string[]): Coupon[] {
  const couponIdSet = new Set(couponIds);

  return coupons.map((coupon) => (
    couponIdSet.has(coupon.id) && coupon.claimState === 'unclaimed' && coupon.availability === 'usable'
      ? { ...coupon, claimState: 'claimed' }
      : coupon
  ));
}

export function createBurstCoupons(random: () => number = Math.random): Coupon[] {
  const count = 4;
  const seed = `${Date.now()}-${Math.floor(random() * 1000000)}`;

  return Array.from({ length: count }, (_, index): Coupon => ({
    id: `coupon-burst-${seed}-${index}`,
    kind: 'burst-reward',
    title: '招牌香辣鸡腿堡鸡腿鸡腿鸡腿',
    amount: '19.9 元',
    validPeriod: '2025.10.29–11.29',
    claimState: 'claimed',
    availability: 'usable',
    benefitTag: '新品尝鲜',
    ruleText: '规则说明：今日剩余3次；每周三可用'
  }));
}

export function replaceCoupon(coupons: Coupon[], couponId: string, newCoupons: Coupon[]): Coupon[] {
  const targetIndex = coupons.findIndex((coupon) => coupon.id === couponId);
  if (targetIndex < 0) return coupons;

  return [
    ...coupons.slice(0, targetIndex),
    ...newCoupons,
    ...coupons.slice(targetIndex + 1)
  ];
}

export function insertCouponsAfter(coupons: Coupon[], anchorId: string, newCoupons: Coupon[]): Coupon[] {
  const anchorIndex = coupons.findIndex((coupon) => coupon.id === anchorId);
  if (anchorIndex < 0) return coupons;

  return [
    ...coupons.slice(0, anchorIndex + 1),
    ...newCoupons,
    ...coupons.slice(anchorIndex + 1)
  ];
}
