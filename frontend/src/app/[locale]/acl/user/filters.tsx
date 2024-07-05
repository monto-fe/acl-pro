'use client'
import React from 'react'
import dayjs from 'dayjs';

import { timeFormatType } from '@/utils/timeFormat';
import SearchForm from '@/components/Form';

const dateList = ['当日', '本周', '本月', '上月'];
const defaultRangeBtn = '本周';

const formItems = [
  {
    label: '时间筛选',
    key: 'SendTime', // BeginTime,EndTime
    type: 'DateRangeButton',
    option: {
      dateList,
      defaultRangeBtn,
      rangePickerOptions: {
        style: {
          width: '100%',
        },
        format: timeFormatType.date,
        disabledDate: (current: dayjs.Dayjs) => {
          const tooLate = current && current < dayjs().subtract(1, 'years').startOf('day');
          const tooEarly = current && current > dayjs();
          return tooEarly || tooLate;
        },
      },
    },
    span: 14,
  },
  {
    label: '替换类型',
    key: 'ChannelType',
    type: 'SelectMultiple',
    options: [
      { value: 'Main', name: '主通道替换' },
      { value: 'Backup', name: '备用通道替换' },
    ],
    span: 5,
  },
  {
    label: '公司ID',
    key: 'CompanyId',
    type: 'Input',
    span: 5
  },
  {
    label: '公司ID',
    key: 'CompanyId',
    type: 'Input',
    required: true,
    span: 5
  },
]

export default function Filters() {
  return (
    <SearchForm items={formItems} />
  )
}
