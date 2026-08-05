import { Button, Input, Text, View } from '@tarojs/components';
import type { InputProps } from '@tarojs/components';
import { useEffect, useState } from 'react';

import type { Address, AddressDraft, AddressTag, TagPlacement } from '../../types/address';
import { hasErrors, toDraft, validateDraft, type AddressFieldErrors } from '../../utils/address';

import './index.scss';

interface AddressEditorProps {
  address: Address | null;
  onCancel: () => void;
  onSave: (draft: AddressDraft) => void;
}

type InputEvent = Parameters<NonNullable<InputProps['onInput']>>[0];
type ClickEvent = { stopPropagation: () => void };

function createTagId(): string {
  return `tag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDatasetValue(event: InputEvent, name: string): string {
  const dataset = event.currentTarget.dataset as Record<string, string | undefined>;
  return dataset[name] ?? '';
}

export function AddressEditor({ address, onCancel, onSave }: AddressEditorProps): JSX.Element | null {
  const [draft, setDraft] = useState<AddressDraft | null>(null);
  const [errors, setErrors] = useState<AddressFieldErrors>({});

  useEffect(() => {
    setDraft(address ? toDraft(address) : null);
    setErrors({});
  }, [address]);

  if (!address || !draft) return null;

  const updateField = (field: keyof Pick<AddressDraft, 'address' | 'contactName' | 'phone'>, value: string): void => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleAddressChange = (event: InputEvent): void => updateField('address', event.detail.value);
  const handleContactChange = (event: InputEvent): void => updateField('contactName', event.detail.value);
  const handlePhoneChange = (event: InputEvent): void => updateField('phone', event.detail.value);

  const handleTagChange = (event: InputEvent): void => {
    const tagId = getDatasetValue(event, 'tagId');
    setDraft((current) => current && {
      ...current,
      tags: current.tags.map((tag) => (tag.id === tagId ? { ...tag, text: event.detail.value } : tag))
    });
  };

  const handlePlacementChange = (event: { currentTarget: { dataset: Record<string, string | undefined> } }): void => {
    const tagId = event.currentTarget.dataset.tagId ?? '';
    const placement = event.currentTarget.dataset.placement as TagPlacement;
    setDraft((current) => current && {
      ...current,
      tags: current.tags.map((tag) => (tag.id === tagId ? { ...tag, placement } : tag))
    });
  };

  const handleAddTag = (): void => {
    const newTag: AddressTag = { id: createTagId(), text: '新标签', placement: 'leading', tone: 'pink' };
    setDraft((current) => current && { ...current, tags: [...current.tags, newTag] });
  };

  const handleRemoveTag = (event: { currentTarget: { dataset: Record<string, string | undefined> } }): void => {
    const tagId = event.currentTarget.dataset.tagId ?? '';
    setDraft((current) => current && { ...current, tags: current.tags.filter((tag) => tag.id !== tagId) });
  };

  const handleSave = (): void => {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (!hasErrors(nextErrors)) onSave({ ...draft, tags: draft.tags.map((tag) => ({ ...tag, text: tag.text.trim() })) });
  };

  const handlePanelClick = (event: ClickEvent): void => event.stopPropagation();

  return (
    <View className='address-editor__mask' onClick={onCancel}>
      <View className='address-editor' onClick={handlePanelClick}>
        <View className='address-editor__header'>
          <Text className='address-editor__title'>编辑地址</Text>
          <Text className='address-editor__close' aria-label='关闭编辑' onClick={onCancel}>×</Text>
        </View>

        <View className='address-editor__field'>
          <Text className='address-editor__label'>地址</Text>
          <Input className='address-editor__input' value={draft.address} placeholder='请输入地址' onInput={handleAddressChange} />
          {errors.address && <Text className='address-editor__error'>{errors.address}</Text>}
        </View>
        <View className='address-editor__field'>
          <Text className='address-editor__label'>联系人</Text>
          <Input className='address-editor__input' value={draft.contactName} placeholder='请输入联系人' onInput={handleContactChange} />
          {errors.contactName && <Text className='address-editor__error'>{errors.contactName}</Text>}
        </View>
        <View className='address-editor__field'>
          <Text className='address-editor__label'>手机号</Text>
          <Input className='address-editor__input' value={draft.phone} type='number' placeholder='请输入手机号' onInput={handlePhoneChange} />
          {errors.phone && <Text className='address-editor__error'>{errors.phone}</Text>}
        </View>

        <View className='address-editor__tags-heading'>
          <Text className='address-editor__label'>标签</Text>
          <Text className='address-editor__add' onClick={handleAddTag}>+ 添加标签</Text>
        </View>
        {draft.tags.map((tag) => (
          <View className='address-editor__tag-row' key={tag.id}>
            <Input className='address-editor__tag-input' value={tag.text} data-tag-id={tag.id} placeholder='标签内容' onInput={handleTagChange} />
            <Text className='address-editor__placement' data-tag-id={tag.id} data-placement='leading' onClick={handlePlacementChange}>
              {tag.placement === 'leading' ? '开头 ✓' : '开头'}
            </Text>
            <Text className='address-editor__placement' data-tag-id={tag.id} data-placement='trailing' onClick={handlePlacementChange}>
              {tag.placement === 'trailing' ? '结尾 ✓' : '结尾'}
            </Text>
            <Text className='address-editor__remove' data-tag-id={tag.id} onClick={handleRemoveTag}>删除</Text>
          </View>
        ))}
        {errors.tags && <Text className='address-editor__error'>{errors.tags}</Text>}

        <View className='address-editor__actions'>
          <Button className='address-editor__button address-editor__button--secondary' onClick={onCancel}>取消</Button>
          <Button className='address-editor__button address-editor__button--primary' onClick={handleSave}>保存</Button>
        </View>
      </View>
    </View>
  );
}
