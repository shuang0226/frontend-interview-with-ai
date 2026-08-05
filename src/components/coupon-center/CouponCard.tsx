import { Button, Image, Text, View } from '@tarojs/components';

import couponPackSurface from '../../assets/coupon-pack-surface.png';
import type { Coupon } from '../../types/coupon';

interface CouponCardProps {
  coupon: Coupon;
  isClaiming: boolean;
  isAppearing: boolean;
  appearanceOrder: number;
  isHighlighted: boolean;
  onClaim: (couponId: string) => void;
}

function ClaimButtonLabel({ isClaiming, label }: { isClaiming: boolean; label: string }): JSX.Element {
  if (!isClaiming) return <Text>{label}</Text>;

  return (
    <View className='coupon-card__button-content'>
      <View className='coupon-card__button-loader' aria-hidden='true' />
      <Text>领券中...</Text>
    </View>
  );
}

function CouponCover(): JSX.Element {
  return (
    <View className='coupon-card__cover' aria-label='优惠券商品图占位'>
      <View className='coupon-card__cover-sun' />
      <View className='coupon-card__cover-mountain coupon-card__cover-mountain--back' />
      <View className='coupon-card__cover-mountain coupon-card__cover-mountain--front' />
    </View>
  );
}

function ClaimedStamp(): JSX.Element {
  return (
    <View className='coupon-card__stamp' aria-label='已领取'>
      <View className='coupon-card__stamp-inner'>
        <Text>已领取</Text>
      </View>
    </View>
  );
}

function MonthlyCouponPack({ coupon, isClaiming, onClaim }: Pick<CouponCardProps, 'coupon' | 'isClaiming' | 'onClaim'>): JSX.Element {
  const handleClaim = (): void => onClaim(coupon.id);
  const isClaimed = coupon.claimState === 'claimed';
  const canClaim = !isClaimed && coupon.availability === 'usable' && !isClaiming;
  const countParts = (coupon.benefitTag ?? '').match(/^(\d+)(.*)$/);
  const countNumber = countParts?.[1] ?? '';
  const countSuffix = countParts?.[2] ?? coupon.benefitTag ?? '';

  return (
    <View id={`coupon-card-${coupon.id}`} className={isClaiming ? 'coupon-pack coupon-pack--claiming' : 'coupon-pack'}>
      <Image className='coupon-pack__surface' src={couponPackSurface} mode='scaleToFill' />
      <View className='coupon-pack__gift-panel'>
        <View className='coupon-pack__gift'>
          <View className='coupon-pack__gift-inner'>
            <Text className='coupon-pack__gift-title'>专享券包</Text>
            <View className='coupon-pack__gift-notch' />
            <View className='coupon-pack__gift-ribbon' />
          </View>
        </View>
      </View>
      <View className='coupon-pack__join coupon-pack__join--top' />
      <View className='coupon-pack__join coupon-pack__join--bottom' />
      <View className='coupon-pack__sheet'>
        <View className='coupon-pack__content'>
          <Text className='coupon-pack__title'>{coupon.title}</Text>
          <Text className='coupon-pack__count'>
            {countNumber && <Text className='coupon-pack__count-number'>{countNumber}</Text>}
            <Text>{countSuffix}</Text>
          </Text>
        </View>
      </View>
      <Button
        className={isClaiming ? 'coupon-card__button coupon-card__button--claiming coupon-pack__button' : 'coupon-card__button coupon-pack__button'}
        data-coupon-id={coupon.id}
        disabled={!canClaim ? true : undefined}
        onClick={canClaim ? handleClaim : undefined}
      >
        <ClaimButtonLabel isClaiming={isClaiming} label={isClaimed ? '已领取' : '领券'} />
      </Button>
    </View>
  );
}

export function CouponCard({ coupon, isClaiming, isAppearing, appearanceOrder, isHighlighted, onClaim }: CouponCardProps): JSX.Element {
  if (coupon.kind === 'monthly-burst') {
    return <MonthlyCouponPack coupon={coupon} isClaiming={isClaiming} onClaim={onClaim} />;
  }

  const isClaimed = coupon.claimState === 'claimed';
  const isUnavailable = coupon.availability === 'unusable';
  const isAppExclusive = coupon.kind === 'app-exclusive';
  const hasBenefitTag = Boolean(coupon.benefitTag);
  const cardClassName = [
    'coupon-card',
    isClaiming ? 'coupon-card--claiming' : '',
    isAppearing ? 'coupon-card--appearing' : '',
    isAppearing ? `coupon-card--appearing-${appearanceOrder}` : '',
    isHighlighted ? 'coupon-card--highlighted' : '',
    isUnavailable ? 'coupon-card--unavailable' : '',
    isAppExclusive ? 'coupon-card--app-exclusive' : '',
    hasBenefitTag ? '' : 'coupon-card--without-tag'
  ].filter(Boolean).join(' ');
  const handleClaim = (): void => onClaim(coupon.id);
  const isActionDisabled = isUnavailable || isClaiming;

  return (
    <View id={`coupon-card-${coupon.id}`} className={cardClassName}>
      {isAppExclusive && <Text className='coupon-card__app-flag'>APP 专享</Text>}
      {isAppExclusive && <Text className='coupon-card__member-flag'>白金会员享</Text>}
      <View className='coupon-card__main'>
        <CouponCover />
        <View className='coupon-card__content'>
          <Text className='coupon-card__title'>{coupon.title}</Text>
          {coupon.benefitTag && <Text className='coupon-card__tag'>{coupon.benefitTag}</Text>}
          <Text className='coupon-card__amount'>{coupon.amount}</Text>
          <Text className='coupon-card__period'>{coupon.validPeriod}</Text>
        </View>
        <View className='coupon-card__action'>
          {isClaimed && <ClaimedStamp />}
          <Button
            className={[
              'coupon-card__button',
              isUnavailable ? 'coupon-card__button--disabled' : '',
              isClaiming ? 'coupon-card__button--claiming' : ''
            ].filter(Boolean).join(' ')}
            disabled={isActionDisabled ? true : undefined}
            data-coupon-id={coupon.id}
            onClick={isActionDisabled ? undefined : handleClaim}
          >
            <ClaimButtonLabel isClaiming={isClaiming} label={isClaimed ? '立即使用' : '领券'} />
          </Button>
        </View>
      </View>
      <View className='coupon-card__rule'>
        {isUnavailable && <Text className='coupon-card__reason-icon'>!</Text>}
        <Text className={isUnavailable ? 'coupon-card__rule-text coupon-card__rule-text--unavailable' : 'coupon-card__rule-text'}>
          {coupon.ruleText}
        </Text>
        {!isUnavailable && <Text className='coupon-card__rule-arrow'>›</Text>}
      </View>
      {isUnavailable && <View className='coupon-card__unavailable-mask' />}
    </View>
  );
}
