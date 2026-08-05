import Taro from '@tarojs/taro';
import { Button, ScrollView, Text, View } from '@tarojs/components';
import { useCallback, useEffect, useRef, useState } from 'react';

import { initialCoupons } from '../../data/coupons';
import type { Coupon, CouponFlight, CouponFlightPoint } from '../../types/coupon';
import { claimCoupons, createBurstCoupons, replaceCoupon } from '../../utils/coupon';
import { CouponCard } from './CouponCard';
import { CouponFlightLayer } from './CouponFlightLayer';

import './index.scss';

interface CouponCenterSheetProps {
  onClose: () => void;
}

const MONTHLY_COUPON_ID = 'coupon-monthly-burst';
const CLAIMING_DURATION = 1000;
const FLIGHT_DURATION = 760;
const FLIGHT_STAGGER_DURATION = 270;
const HIGHLIGHT_DURATION = 520;
const BURST_REWARD_COUNT = 4;
const FLIGHT_RENDER_DELAY = 32;
const SUCCESS_TOAST_DURATION = 1200;
const MEASURE_TIMEOUT = 80;

interface LayoutRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface CouponClaimFooterProps {
  isClaiming: boolean;
  canClaim: boolean;
  onClaim: () => void;
}

function CouponClaimFooter({ isClaiming, canClaim, onClaim }: CouponClaimFooterProps): JSX.Element {
  const label = isClaiming ? '领券中...' : canClaim ? '一键领券' : '已全部领取';

  return (
    <View className='coupon-center__footer'>
      <Button
        className={`coupon-center__footer-button ${isClaiming ? 'coupon-center__footer-button--claiming' : ''}`}
        disabled={isClaiming || !canClaim ? true : undefined}
        onClick={canClaim ? onClaim : undefined}
      >
        {isClaiming && <View className='coupon-center__footer-loader' aria-hidden='true' />}
        <Text>{label}</Text>
      </Button>
    </View>
  );
}

function CouponSuccessToast({ count }: { count: number }): JSX.Element {
  return (
    <View className='coupon-center__success-toast' role='status' aria-live='polite'>
      <View className='coupon-center__success-check'>✓</View>
      <Text>成功领取{count}张券</Text>
    </View>
  );
}

function isLayoutRect(rect: unknown): rect is LayoutRect {
  if (!rect || typeof rect !== 'object') return false;

  const candidate = rect as Partial<LayoutRect>;
  return typeof candidate.left === 'number'
    && typeof candidate.top === 'number'
    && typeof candidate.width === 'number'
    && typeof candidate.height === 'number';
}

function measureRect(selector: string): Promise<LayoutRect | null> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (rect: LayoutRect | null): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(rect);
    };
    const timeout = setTimeout(() => finish(null), MEASURE_TIMEOUT);

    try {
      Taro.createSelectorQuery()
        .select(selector)
        .boundingClientRect((rect) => finish(isLayoutRect(rect) ? rect : null))
        .exec();
    } catch {
      finish(null);
    }
  });
}

function viewportSize(): { width: number; height: number } {
  try {
    const systemInfo = Taro.getSystemInfoSync();
    return {
      width: typeof systemInfo.windowWidth === 'number' && systemInfo.windowWidth > 0
        ? systemInfo.windowWidth
        : 375,
      height: typeof systemInfo.windowHeight === 'number' && systemInfo.windowHeight > 0
        ? systemInfo.windowHeight
        : 667
    };
  } catch {
    return { width: 375, height: 667 };
  }
}

function fallbackOrigin(): CouponFlightPoint {
  const { width, height } = viewportSize();
  const centerHeight = height * 0.84;
  return { x: width * 0.82, y: centerHeight * 0.36 };
}

function pointInCenter(rect: LayoutRect, container: LayoutRect): CouponFlightPoint {
  return {
    x: rect.left - container.left + rect.width / 2,
    y: rect.top - container.top + rect.height / 2
  };
}

function fallbackTarget(route: number): CouponFlightPoint {
  const { width, height } = viewportSize();
  const centerHeight = height * 0.84;
  return {
    x: width * 0.14,
    y: Math.min(centerHeight * (0.34 + route * 0.16), centerHeight * 0.82)
  };
}

function fallbackDirectOrigin(route: number): CouponFlightPoint {
  const { width } = viewportSize();
  const target = fallbackTarget(route);
  return { x: width * 0.82, y: target.y };
}

function createFlight(couponId: string, route: number, origin: CouponFlightPoint, target: CouponFlightPoint): CouponFlight {
  const startX = origin.x - target.x;
  const startY = origin.y - target.y;
  const fanOffsets = [
    { x: 62, y: -78 },
    { x: 0, y: -22 },
    { x: -58, y: 52 },
    { x: 48, y: 106 }
  ];
  const fanOffset = fanOffsets[route] ?? fanOffsets[fanOffsets.length - 1];

  return {
    id: `flight-${couponId}-${route}`,
    targetId: couponId,
    route,
    origin,
    target,
    fan: {
      x: target.x + startX * 0.62 + fanOffset.x,
      y: target.y + startY * 0.48 + fanOffset.y
    },
    hop: {
      x: target.x + startX * 0.18,
      y: target.y + startY * 0.18 - 28
    }
  };
}

export function CouponCenterSheet({ onClose }: CouponCenterSheetProps): JSX.Element {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [flights, setFlights] = useState<CouponFlight[]>([]);
  const [claimingIds, setClaimingIds] = useState<string[]>([]);
  const [appearingIds, setAppearingIds] = useState<string[]>([]);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [claimedRewardCount, setClaimedRewardCount] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMountedRef = useRef(true);

  const clearTimers = useCallback((): void => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  const finishRewardAnimation = useCallback((couponIds: string[], claimedCount: number): void => {
    const landingTimer = setTimeout(() => {
      setFlights([]);
      setAppearingIds([]);
      setHighlightedIds(couponIds);
      setClaimedRewardCount(claimedCount);
      setShowSuccessToast(true);
      const successTimer = setTimeout(() => setShowSuccessToast(false), SUCCESS_TOAST_DURATION);
      timersRef.current.push(successTimer);
      const completeTimer = setTimeout(() => {
        setHighlightedIds([]);
        setIsAnimating(false);
      }, HIGHLIGHT_DURATION);
      timersRef.current.push(completeTimer);
    }, FLIGHT_DURATION + FLIGHT_STAGGER_DURATION);
    timersRef.current.push(landingTimer);
  }, []);

  const launchBurstFlights = useCallback((rewardIds: string[], origin: CouponFlightPoint): void => {
    const renderTimer = setTimeout(() => {
      void Promise.all([
        measureRect('.coupon-center'),
        ...rewardIds.map((id) => measureRect(`#coupon-card-${id} .coupon-card__cover`))
      ]).then(([centerRect, ...coverRects]) => {
        if (!isMountedRef.current) return;
        const targets = coverRects.map((coverRect, route) => (
          centerRect && coverRect ? pointInCenter(coverRect, centerRect) : fallbackTarget(route)
        ));
        setFlights(rewardIds.slice(0, BURST_REWARD_COUNT).map((id, route) => (
          createFlight(id, route, origin, targets[route] ?? fallbackTarget(route))
        )));
      });
    }, FLIGHT_RENDER_DELAY);
    timersRef.current.push(renderTimer);
  }, []);

  const launchDirectFlights = useCallback((couponIds: string[]): void => {
    const renderTimer = setTimeout(() => {
      void Promise.all([
        measureRect('.coupon-center'),
        Promise.all(couponIds.map((id) => Promise.all([
          measureRect(`#coupon-card-${id} .coupon-card__button`),
          measureRect(`#coupon-card-${id} .coupon-card__cover`)
        ])))
      ]).then(([centerRect, couponRects]) => {
        if (!isMountedRef.current) return;
        setFlights(couponIds.map((id, route) => {
          const [buttonRect, coverRect] = couponRects[route] ?? [null, null];
          const origin = centerRect && buttonRect
            ? pointInCenter(buttonRect, centerRect)
            : fallbackDirectOrigin(route);
          const target = centerRect && coverRect
            ? pointInCenter(coverRect, centerRect)
            : fallbackTarget(route);
          return createFlight(id, route, origin, target);
        }));
      });
    }, FLIGHT_RENDER_DELAY);
    timersRef.current.push(renderTimer);
  }, []);

  const startClaim = useCallback((requestedCouponIds?: string[]): void => {
    if (isAnimating) return;

    const requestedIdSet = requestedCouponIds ? new Set(requestedCouponIds) : null;
    const claimableIds = coupons
      .filter((coupon) => (
        (!requestedIdSet || requestedIdSet.has(coupon.id))
        && coupon.claimState === 'unclaimed'
        && coupon.availability === 'usable'
      ))
      .map((coupon) => coupon.id);
    if (claimableIds.length === 0) return;

    const includesMonthlyPack = claimableIds.includes(MONTHLY_COUPON_ID);
    const directlyClaimedIds = claimableIds.filter((couponId) => couponId !== MONTHLY_COUPON_ID);
    const rewards = includesMonthlyPack ? createBurstCoupons() : [];
    const rewardIds = rewards.map((coupon) => coupon.id);
    let monthlyOrigin = fallbackOrigin();

    clearTimers();
    setIsAnimating(true);
    setClaimingIds(claimableIds);
    setHighlightedIds([]);
    setShowSuccessToast(false);

    if (directlyClaimedIds.length > 0) {
      launchDirectFlights(directlyClaimedIds);
    }

    if (includesMonthlyPack) {
      void Promise.all([
        measureRect(`#coupon-card-${MONTHLY_COUPON_ID} .coupon-pack__button`),
        measureRect('.coupon-center')
      ]).then(([buttonRect, centerRect]) => {
        if (!isMountedRef.current) return;
        monthlyOrigin = buttonRect && centerRect ? pointInCenter(buttonRect, centerRect) : fallbackOrigin();
      });
    }

    const claimTimer = setTimeout(() => {
      setClaimingIds([]);
      if (directlyClaimedIds.length > 0) setFlights([]);
      setCoupons((current) => {
        const claimedCoupons = claimCoupons(current, directlyClaimedIds);
        return includesMonthlyPack ? replaceCoupon(claimedCoupons, MONTHLY_COUPON_ID, rewards) : claimedCoupons;
      });

      if (directlyClaimedIds.length > 0) {
        setHighlightedIds(directlyClaimedIds);
        const directHighlightTimer = setTimeout(() => {
          setHighlightedIds((current) => current.filter((couponId) => !directlyClaimedIds.includes(couponId)));
        }, HIGHLIGHT_DURATION);
        timersRef.current.push(directHighlightTimer);
      }

      if (includesMonthlyPack) {
        setAppearingIds(rewardIds);
        launchBurstFlights(rewardIds, monthlyOrigin);
        finishRewardAnimation(rewardIds, directlyClaimedIds.length + rewardIds.length);
        return;
      }

      const completeTimer = setTimeout(() => setIsAnimating(false), HIGHLIGHT_DURATION);
      timersRef.current.push(completeTimer);
    }, CLAIMING_DURATION);
    timersRef.current.push(claimTimer);
  }, [clearTimers, coupons, finishRewardAnimation, isAnimating, launchBurstFlights, launchDirectFlights]);

  const handleClaim = useCallback((couponId: string): void => {
    startClaim([couponId]);
  }, [startClaim]);

  const handleFooterClaim = useCallback((): void => {
    startClaim();
  }, [startClaim]);

  const handleClose = useCallback((): void => {
    clearTimers();
    onClose();
  }, [clearTimers, onClose]);

  const canClaimCoupons = coupons.some((coupon) => (
    coupon.claimState === 'unclaimed' && coupon.availability === 'usable'
  ));
  const couponCards = coupons.map((coupon) => {
    const appearanceOrder = appearingIds.indexOf(coupon.id);

    return (
      <CouponCard
        appearanceOrder={appearanceOrder}
        coupon={coupon}
        isClaiming={claimingIds.includes(coupon.id)}
        isAppearing={appearanceOrder >= 0}
        isHighlighted={highlightedIds.includes(coupon.id)}
        key={coupon.id}
        onClaim={handleClaim}
      />
    );
  });

  return (
    <View className='coupon-center__mask'>
      <View className='coupon-center' role='dialog' aria-label='优惠中心'>
        <View className='coupon-center__header'>
          <Text className='coupon-center__title'>优惠中心</Text>
          <Button className='coupon-center__close' aria-label='关闭优惠中心' onClick={handleClose}>×</Button>
          <Text className='coupon-center__bubble'>气泡装饰</Text>
        </View>
        <View className='coupon-center__tabs' aria-label='优惠券分类'>
          <Text className='coupon-center__tab'>我的优惠券</Text>
          <Text className='coupon-center__tab'>付费会员</Text>
          <Text className='coupon-center__tab'>代金券</Text>
          <Text className='coupon-center__tab coupon-center__tab--active'>领券</Text>
        </View>
        <ScrollView
          className='coupon-center__scroll'
          enhanced={false}
          scrollY
        >
          <View className='coupon-center__list'>
            {couponCards}
          </View>
        </ScrollView>
        <CouponFlightLayer flights={flights} />
        {showSuccessToast && <CouponSuccessToast count={claimedRewardCount} />}
        <CouponClaimFooter isClaiming={isAnimating} canClaim={canClaimCoupons} onClaim={handleFooterClaim} />
      </View>
    </View>
  );
}
