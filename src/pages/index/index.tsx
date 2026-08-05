import { Button, View } from '@tarojs/components';
import { useCallback, useMemo, useState } from 'react';

import { AddressEditor } from '../../components/address-editor/AddressEditor';
import { AddressItem } from '../../components/address-item/AddressItem';
import { CouponCenterSheet } from '../../components/coupon-center/CouponCenterSheet';
import { initialAddresses } from '../../data/addresses';
import type { Address, AddressDraft } from '../../types/address';
import { applyAddressDraft, setDefaultAddress } from '../../utils/address';

import './index.scss';

export default function IndexPage(): JSX.Element {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCouponCenterOpen, setIsCouponCenterOpen] = useState(false);

  const editingAddress = useMemo(
    () => addresses.find((address) => address.id === editingId) ?? null,
    [addresses, editingId]
  );

  const handleSelect = useCallback((id: string): void => {
    setAddresses((current) => setDefaultAddress(current, id));
  }, []);

  const handleOpenEditor = useCallback((id: string): void => setEditingId(id), []);
  const handleCloseEditor = useCallback((): void => setEditingId(null), []);
  const handleSave = useCallback((draft: AddressDraft): void => {
    setAddresses((current) => applyAddressDraft(current, draft));
    setEditingId(null);
  }, []);
  const handleOpenCouponCenter = useCallback((): void => setIsCouponCenterOpen(true), []);
  const handleCloseCouponCenter = useCallback((): void => setIsCouponCenterOpen(false), []);

  return (
    <View className='address-page'>
      <View className='address-page__list' role='radiogroup' aria-label='地址列表'>
        {addresses.map((address) => (
          <AddressItem key={address.id} address={address} onSelect={handleSelect} onEdit={handleOpenEditor} />
        ))}
      </View>
      <View className='address-page__coupon-entry'>
        <Button className='address-page__coupon-entry-button' onClick={handleOpenCouponCenter}>打开优惠中心</Button>
      </View>
      <AddressEditor address={editingAddress} onCancel={handleCloseEditor} onSave={handleSave} />
      {isCouponCenterOpen && <CouponCenterSheet onClose={handleCloseCouponCenter} />}
    </View>
  );
}
