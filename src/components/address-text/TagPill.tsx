import { Text } from '@tarojs/components';

import type { AddressTag } from '../../types/address';

interface TagPillProps {
  tag: AddressTag;
}

export function TagPill({ tag }: TagPillProps): JSX.Element {
  const tone = tag.tone ?? 'pink';
  return <Text className={`address-tag address-tag--${tone}`}>{tag.text}</Text>;
}
