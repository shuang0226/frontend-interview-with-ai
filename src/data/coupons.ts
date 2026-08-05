import type { Coupon } from '../types/coupon';

export const initialCoupons: Coupon[] = [
  {
    id: 'coupon-classic-pizza',
    kind: 'standard',
    title: '美味经典芝士风情皇家卷边披萨',
    amount: '39.9 元',
    validPeriod: '2025.10.29–11.29',
    claimState: 'unclaimed',
    availability: 'usable',
    ruleText: '规则说明'
  },
  {
    id: 'coupon-monthly-burst',
    kind: 'monthly-burst',
    title: '每月领券',
    amount: '',
    validPeriod: '',
    claimState: 'unclaimed',
    availability: 'usable',
    benefitTag: '4张待领取',
    ruleText: ''
  },
  {
    id: 'coupon-app-exclusive-secondary',
    kind: 'app-exclusive',
    title: '香辣劲爆鸡米花小份10块',
    amount: '10 元',
    validPeriod: '2025.10.29–2026.11.29',
    claimState: 'unclaimed',
    availability: 'usable',
    benefitTag: '甄选白羽鸡翅尖',
    ruleText: '规则说明'
  },
  {
    id: 'coupon-claimed-unusable',
    kind: 'standard',
    title: '美味经典芝士风情皇家卷边披萨',
    amount: '39.9 元起',
    validPeriod: '2025.10.29–11.29',
    claimState: 'claimed',
    availability: 'unusable',
    ruleText: '不可用原因：当前餐厅不可用',
    unavailableReason: '当前餐厅不可用'
  },
  {
    id: 'coupon-app-exclusive',
    kind: 'app-exclusive',
    title: '香辣劲爆鸡米花小份10块',
    amount: '10 元',
    validPeriod: '2025.10.29–2026.11.29',
    claimState: 'unclaimed',
    availability: 'usable',
    benefitTag: '甄选白羽鸡翅尖',
    ruleText: '规则说明'
  }
];
