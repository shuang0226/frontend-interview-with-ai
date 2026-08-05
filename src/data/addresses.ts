import type { Address } from '../types/address';

export const initialAddresses: Address[] = [
  {
    id: 'address-usual',
    address: '地址未超过一行展示',
    contactName: '张先生',
    phone: '112****3838',
    isDefault: false,
    tags: [
      { id: 'usual', text: '常用', placement: 'leading', tone: 'pink' },
      { id: 'company', text: '公司', placement: 'leading', tone: 'orange' }
    ]
  },
  {
    id: 'address-school',
    address: '地址未超过一行展示',
    contactName: '张先生',
    phone: '11212343838',
    isDefault: false,
    tags: [
      { id: 'last-order', text: '上次下单', placement: 'leading', tone: 'pink' },
      { id: 'school', text: '学校', placement: 'leading', tone: 'orange' }
    ]
  },
  {
    id: 'address-trailing-tag',
    address: '城开YOYO联合办公 6楼超过固定长度折行3行的长地址示例，第二行结尾继续展示标签',
    contactName: '张先生',
    phone: '112****3838',
    isDefault: false,
    tags: [
      { id: 'nearest', text: '距离最近', placement: 'leading', tone: 'pink' },
      { id: 'parents', text: '父母家', placement: 'leading', tone: 'orange' },
      { id: 'delivery-time', text: '04:59 后餐厅停止接单', placement: 'trailing', tone: 'pink' }
    ]
  },
  {
    id: 'address-long-leading',
    address: '一行固定宽度展示超出后折行长地址折行折行折行折行折行折行……',
    contactName: '张先生',
    phone: '112****3838',
    isDefault: false,
    tags: [
      { id: 'nearest-2', text: '距离最近', placement: 'leading', tone: 'pink' },
      { id: 'home', text: '家', placement: 'leading', tone: 'orange' }
    ]
  },
  {
    id: 'address-default',
    address: '城开YOYO联合办公 6楼',
    contactName: '张先生',
    phone: '112****3838',
    isDefault: true,
    tags: [
      { id: 'usual-2', text: '常用', placement: 'leading', tone: 'pink' },
      { id: 'company-2', text: '公司', placement: 'leading', tone: 'orange' }
    ]
  },
  {
    id: 'address-overflow',
    address: '一行固定宽度展示超出后折行文案文案文案文案文案文案文案文案文案文案',
    contactName: '张先生',
    phone: '112****3838',
    isDefault: false,
    tags: []
  }
];
