import type { Address, AddressDraft } from '../types/address';

export type AddressFieldErrors = Partial<Record<'address' | 'contactName' | 'phone' | 'tags', string>>;

export function toDraft(address: Address): AddressDraft {
  return {
    id: address.id,
    address: address.address,
    contactName: address.contactName,
    phone: address.phone,
    tags: address.tags.map((tag) => ({ ...tag }))
  };
}

export function setDefaultAddress(addresses: Address[], selectedId: string): Address[] {
  return addresses.map((address) => ({ ...address, isDefault: address.id === selectedId }));
}

export function applyAddressDraft(addresses: Address[], draft: AddressDraft): Address[] {
  return addresses.map((address) =>
    address.id === draft.id
      ? { ...address, address: draft.address, contactName: draft.contactName, phone: draft.phone, tags: draft.tags }
      : address
  );
}

export function validateDraft(draft: AddressDraft): AddressFieldErrors {
  const errors: AddressFieldErrors = {};
  const normalizedPhone = draft.phone.replace(/[\s-]/g, '');

  if (!draft.address.trim()) errors.address = '请填写地址';
  if (!draft.contactName.trim()) errors.contactName = '请填写联系人';
  if (!/^\d{6,20}$/.test(normalizedPhone)) errors.phone = '请输入 6–20 位数字手机号';
  if (draft.tags.some((tag) => !tag.text.trim())) errors.tags = '标签内容不能为空';

  return errors;
}

export function hasErrors(errors: AddressFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
