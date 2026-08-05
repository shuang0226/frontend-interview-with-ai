import { describe, expect, it } from 'vitest';

import { initialAddresses } from '../src/data/addresses';
import { isAddressSingleLine, splitAddressForTrailingTag } from '../src/utils/address-layout';
import { applyAddressDraft, setDefaultAddress, toDraft, validateDraft } from '../src/utils/address';

describe('address domain helpers', () => {
  it('keeps exactly one selected address', () => {
    const addresses = setDefaultAddress(initialAddresses, 'address-school');

    expect(addresses.filter((address) => address.isDefault).map((address) => address.id)).toEqual(['address-school']);
  });

  it('applies an edited address without changing its selection', () => {
    const source = initialAddresses.find((address) => address.id === 'address-default');
    if (!source) throw new Error('test address missing');
    const draft = { ...toDraft(source), contactName: '李女士', tags: [] };

    const addresses = applyAddressDraft(initialAddresses, draft);
    const updated = addresses.find((address) => address.id === source.id);

    expect(updated?.contactName).toBe('李女士');
    expect(updated?.tags).toEqual([]);
    expect(updated?.isDefault).toBe(true);
  });

  it('rejects empty tags and an invalid phone', () => {
    const source = initialAddresses[0];
    const errors = validateDraft({ ...toDraft(source), phone: '12x', tags: [{ ...source.tags[0], text: ' ' }] });

    expect(errors.phone).toBeTruthy();
    expect(errors.tags).toBeTruthy();
  });

  it('marks trailing tags for a maximum half-width layout', () => {
    const trailing = initialAddresses.find((address) => address.id === 'address-trailing-tag')?.tags;

    expect(trailing?.some((tag) => tag.placement === 'trailing')).toBe(true);
  });

  it('uses the remaining first-line width before moving address text to the trailing-tag row', () => {
    const result = splitAddressForTrailingTag('城开YOYO联合办公 6楼超过固定长度折行', ['距离最近', '父母家']);

    expect(result.firstLine).toBe('城开YOYO联合办公 6楼');
    expect(result.secondLine).toBe('超过固定长度折行');
  });

  it('keeps a short trailing-tag address on one line', () => {
    const result = splitAddressForTrailingTag('城开 6楼', ['公司']);

    expect(result.firstLine).toBe('城开 6楼');
    expect(result.secondLine).toBe('');
  });

  it('identifies a compact address item from its address and leading tags', () => {
    expect(isAddressSingleLine('城开 6楼', ['公司'])).toBe(true);
    expect(isAddressSingleLine('城开YOYO联合办公 6楼超过固定长度折行3行的长地址示例', ['距离最近', '父母家'])).toBe(false);
  });
});
