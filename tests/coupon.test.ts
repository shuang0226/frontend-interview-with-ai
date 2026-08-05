import { describe, expect, it } from 'vitest';

import { initialCoupons } from '../src/data/coupons';
import { claimCoupon, claimCoupons, createBurstCoupons, insertCouponsAfter, replaceCoupon } from '../src/utils/coupon';

describe('coupon domain helpers', () => {
  it('claims an unclaimed coupon exactly once', () => {
    const claimed = claimCoupon(initialCoupons, 'coupon-classic-pizza');
    const claimedAgain = claimCoupon(claimed, 'coupon-classic-pizza');

    expect(claimed.find((coupon) => coupon.id === 'coupon-classic-pizza')?.claimState).toBe('claimed');
    expect(claimedAgain).toEqual(claimed);
  });

  it('claims only usable, unclaimed coupons in a batch', () => {
    const unavailableUnclaimedCoupon = {
      ...initialCoupons[0],
      id: 'coupon-unavailable-unclaimed',
      availability: 'unusable' as const
    };
    const claimed = claimCoupons([...initialCoupons, unavailableUnclaimedCoupon], [
      'coupon-classic-pizza',
      'coupon-app-exclusive',
      'coupon-unavailable-unclaimed'
    ]);

    expect(claimed.find((coupon) => coupon.id === 'coupon-classic-pizza')?.claimState).toBe('claimed');
    expect(claimed.find((coupon) => coupon.id === 'coupon-app-exclusive')?.claimState).toBe('claimed');
    expect(claimed.find((coupon) => coupon.id === 'coupon-unavailable-unclaimed')?.claimState).toBe('unclaimed');
  });

  it('creates exactly four claimed burst coupons with a shared rule', () => {
    const rewards = createBurstCoupons(() => 0.74);

    expect(rewards).toHaveLength(4);
    expect(rewards.every((coupon) => coupon.claimState === 'claimed')).toBe(true);
    expect(new Set(rewards.map((coupon) => coupon.ruleText)).size).toBe(1);
    expect(new Set(rewards.map((coupon) => coupon.id)).size).toBe(rewards.length);
  });

  it('advertises the same four-coupon monthly reward count', () => {
    expect(initialCoupons.find((coupon) => coupon.id === 'coupon-monthly-burst')?.benefitTag).toBe('4张待领取');
  });

  it('inserts burst rewards directly after the monthly coupon pack', () => {
    const rewards = createBurstCoupons(() => 0);
    const coupons = insertCouponsAfter(initialCoupons, 'coupon-monthly-burst', rewards);

    expect(coupons[2].id).toBe(rewards[0].id);
  });

  it('replaces the monthly coupon pack with newly claimed rewards', () => {
    const rewards = createBurstCoupons(() => 0);
    const coupons = replaceCoupon(initialCoupons, 'coupon-monthly-burst', rewards);

    expect(coupons[1].id).toBe(rewards[0].id);
    expect(coupons.some((coupon) => coupon.id === 'coupon-monthly-burst')).toBe(false);
  });
});
