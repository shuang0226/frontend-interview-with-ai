export type CouponKind = 'standard' | 'app-exclusive' | 'monthly-burst' | 'burst-reward';
export type CouponClaimState = 'unclaimed' | 'claimed';
export type CouponAvailability = 'usable' | 'unusable';

export interface Coupon {
  id: string;
  kind: CouponKind;
  title: string;
  amount: string;
  validPeriod: string;
  claimState: CouponClaimState;
  availability: CouponAvailability;
  benefitTag?: string;
  ruleText: string;
  unavailableReason?: string;
}

export interface CouponFlight {
  id: string;
  targetId: string;
  route: number;
  origin: CouponFlightPoint;
  target: CouponFlightPoint;
  fan: CouponFlightPoint;
  hop: CouponFlightPoint;
}

export interface CouponFlightPoint {
  x: number;
  y: number;
}
