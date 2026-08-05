import { Text, View } from '@tarojs/components';

import type { Address } from '../../types/address';
import { isAddressSingleLine } from '../../utils/address-layout';
import { AddressText } from '../address-text/AddressText';

import './index.scss';

interface AddressItemProps {
  address: Address;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

export function AddressItem({ address, onSelect, onEdit }: AddressItemProps): JSX.Element {
  const leadingTagTexts = address.tags.filter((tag) => tag.placement === 'leading').map((tag) => tag.text);
  const isCompact = isAddressSingleLine(address.address, leadingTagTexts);
  const handleSelect = (): void => onSelect(address.id);
  const handleEdit = (event: { stopPropagation: () => void }): void => {
    event.stopPropagation();
    onEdit(address.id);
  };

  return (
    <View
      className={`address-item ${address.isDefault ? 'address-item--selected' : ''} ${isCompact ? 'address-item--compact' : ''}`}
      role='radio'
      aria-checked={address.isDefault}
      aria-label={`选择${address.address}`}
      onClick={handleSelect}
    >
      <View className={`address-item__radio ${address.isDefault ? 'address-item__radio--checked' : ''}`}>
        {address.isDefault && <Text className='address-item__check'>✓</Text>}
      </View>
      <View className='address-item__content'>
        <AddressText address={address} />
        <View className='address-item__meta'>
          <Text>{address.contactName}</Text>
          <Text className='address-item__phone'>{address.phone}</Text>
        </View>
      </View>
      <View className='address-item__edit' role='button' aria-label={`编辑${address.address}`} onClick={handleEdit}>
        <View className='address-item__edit-icon' aria-hidden>
          <View className='address-item__edit-paper'>
            <View className='address-item__edit-line address-item__edit-line--first' />
            <View className='address-item__edit-line address-item__edit-line--second' />
          </View>
          <View className='address-item__edit-pen' />
        </View>
      </View>
    </View>
  );
}
