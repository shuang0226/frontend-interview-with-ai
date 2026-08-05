import { Text, View } from '@tarojs/components';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

import type { CouponFlight } from '../../types/coupon';

interface CouponFlightLayerProps {
  flights: CouponFlight[];
}

type FlightPhase = 'hidden' | 'launch' | 'fan' | 'hop' | 'land';

const ROUTE_STAGGER = 90;
const LAUNCH_DELAY = 24;
const FAN_DELAY = 138;
const HOP_DELAY = 390;
const LAND_DELAY = 590;

const ROUTE_ROTATIONS = [
  { launch: -10, fan: 9, hop: -3, land: 0 },
  { launch: 8, fan: -9, hop: 3, land: 0 },
  { launch: -7, fan: 8, hop: -3, land: 0 },
  { launch: 7, fan: -8, hop: 3, land: 0 }
] as const;

function motionForPhase(flight: CouponFlight, phase: FlightPhase): {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
} {
  const rotation = ROUTE_ROTATIONS[flight.route] ?? ROUTE_ROTATIONS[ROUTE_ROTATIONS.length - 1];

  switch (phase) {
    case 'hidden':
      return {
        x: flight.origin.x - flight.target.x,
        y: flight.origin.y - flight.target.y,
        scale: 0.34,
        rotate: rotation.launch,
        opacity: 0
      };
    case 'launch':
      return {
        x: flight.origin.x - flight.target.x,
        y: flight.origin.y - flight.target.y,
        scale: 0.96,
        rotate: rotation.launch,
        opacity: 1
      };
    case 'fan':
      return {
        x: flight.fan.x - flight.target.x,
        y: flight.fan.y - flight.target.y,
        scale: 1.06,
        rotate: rotation.fan,
        opacity: 1
      };
    case 'hop':
      return {
        x: flight.hop.x - flight.target.x,
        y: flight.hop.y - flight.target.y,
        scale: 0.92,
        rotate: rotation.hop,
        opacity: 1
      };
    case 'land':
      return { x: 0, y: 0, scale: 0.82, rotate: rotation.land, opacity: 1 };
  }
}

function flightStyle(flight: CouponFlight, phase: FlightPhase): CSSProperties {
  const motion = motionForPhase(flight, phase);

  return {
    left: `${flight.target.x}px`,
    top: `${flight.target.y}px`,
    opacity: motion.opacity,
    transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale}) rotate(${motion.rotate}deg)`,
    transition: phase === 'hidden'
      ? 'none'
      : 'transform 210ms cubic-bezier(0.2, 0.7, 0.28, 1), opacity 110ms ease-out'
  };
}

export function CouponFlightLayer({ flights }: CouponFlightLayerProps): JSX.Element | null {
  const [phases, setPhases] = useState<Record<string, FlightPhase>>({});

  useEffect(() => {
    if (flights.length === 0) {
      setPhases({});
      return undefined;
    }

    setPhases(Object.fromEntries(flights.map((flight) => [flight.id, 'hidden' as FlightPhase])));
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedulePhase = (flightId: string, phase: FlightPhase, delay: number): void => {
      const timer = setTimeout(() => {
        setPhases((current) => ({ ...current, [flightId]: phase }));
      }, delay);
      timers.push(timer);
    };

    flights.forEach((flight) => {
      const stagger = flight.route * ROUTE_STAGGER;
      schedulePhase(flight.id, 'launch', LAUNCH_DELAY + stagger);
      schedulePhase(flight.id, 'fan', FAN_DELAY + stagger);
      schedulePhase(flight.id, 'hop', HOP_DELAY + stagger);
      schedulePhase(flight.id, 'land', LAND_DELAY + stagger);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [flights]);

  if (flights.length === 0) return null;

  return (
    <View className='coupon-flight-layer' aria-hidden='true'>
      {flights.map((flight) => (
        <View className='coupon-flight' key={flight.id} style={flightStyle(flight, phases[flight.id] ?? 'hidden')}>
          <View className='coupon-flight__notch coupon-flight__notch--left' />
          <Text className='coupon-flight__currency'>¥</Text>
          <View className='coupon-flight__notch coupon-flight__notch--right' />
        </View>
      ))}
    </View>
  );
}
