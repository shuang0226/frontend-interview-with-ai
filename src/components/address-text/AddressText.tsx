import { Text, View } from '@tarojs/components';

import type { Address, AddressTag } from '../../types/address';
import { splitAddressForTrailingTag } from '../../utils/address-layout';

import { TagPill } from './TagPill';
import './index.scss';

interface AddressTextProps {
  address: Address;
}

function tagsAt(tags: AddressTag[], placement: AddressTag['placement']): AddressTag[] {
  return tags.filter((tag) => tag.placement === placement);
}

export function AddressText({ address }: AddressTextProps): JSX.Element {
  const leadingTags = tagsAt(address.tags, 'leading');
  const trailingTags = tagsAt(address.tags, 'trailing');
  const hasTrailingTag = trailingTags.length > 0;
  const trailingLines = hasTrailingTag
    ? splitAddressForTrailingTag(address.address, leadingTags.map((tag) => tag.text))
    : null;

  if (trailingLines) {
    if (!trailingLines.secondLine) {
      return (
        <View className='address-text address-text--single-trailing' aria-label={`地址：${address.address}`}>
          <View className='address-text__first-line'>
            {leadingTags.map((tag) => <TagPill key={tag.id} tag={tag} />)}
            <Text className='address-text__first-copy'>{trailingLines.firstLine}</Text>
            <View className='address-text__trailing-row' aria-label='地址附加标签'>
              {trailingTags.map((tag) => <TagPill key={tag.id} tag={tag} />)}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View className='address-text address-text--with-trailing' aria-label={`地址：${address.address}`}>
        <View className='address-text__first-line'>
          {leadingTags.map((tag) => <TagPill key={tag.id} tag={tag} />)}
          <Text className='address-text__first-copy'>{trailingLines.firstLine}</Text>
        </View>
        <View className='address-text__second-line'>
          <Text className='address-text__second-copy'>{trailingLines.secondLine}</Text>
          <View className='address-text__trailing-row' aria-label='地址附加标签'>
            {trailingTags.map((tag) => <TagPill key={tag.id} tag={tag} />)}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className='address-text' aria-label={`地址：${address.address}`}>
      <Text className='address-text__copy'>
        {leadingTags.map((tag) => <TagPill key={tag.id} tag={tag} />)}
        {address.address}
      </Text>
    </View>
  );
}
