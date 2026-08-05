export type TagPlacement = 'leading' | 'trailing';

export interface AddressTag {
  id: string;
  text: string;
  placement: TagPlacement;
  tone?: 'pink' | 'orange';
}

export interface Address {
  id: string;
  address: string;
  contactName: string;
  phone: string;
  tags: AddressTag[];
  isDefault: boolean;
}

export interface AddressDraft {
  id: string;
  address: string;
  contactName: string;
  phone: string;
  tags: AddressTag[];
}
