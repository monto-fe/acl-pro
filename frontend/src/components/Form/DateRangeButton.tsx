import React, { useState, useEffect } from 'react';
import { DatePicker, Radio, Space } from 'antd';
import dayjs from 'dayjs';

import { getDateRange as getUtilDateRange, timeFormatType } from '../../utils/timeFormat';

const { RangePicker } = DatePicker;

interface IDateRange {
  dateList: string[];
  value: dayjs.Dayjs[];
  size: 'small' | 'middle' | 'large' | undefined;
  rangePickerOptions: any;
  defaultRangeBtn: string;
  showTime: boolean;
  onChange: Function;
  getCustomDateRange: Function;
}

/**
 * 带快捷键的时间范围封装，主要参数value、onChange，类似一个Input组件
 * @param dateList 快捷键，来源于DateRange中的key
 * @param rangePickerOptions 时间范围组件的参数
 * @param defaultRangeBtn 默认时间键，仅展示，不带时间赋值，赋值字段为value
 */
export default function DateRangeButton(props: IDateRange) {
  const { dateList, value, size, rangePickerOptions, defaultRangeBtn = '当日', showTime, onChange, getCustomDateRange } = props;

  const getDateRange = getCustomDateRange || getUtilDateRange;

  const [rangeBtn, setRangeBtn] = useState(defaultRangeBtn);
  const [dates, setDates] = useState<dayjs.Dayjs[]>();

  const options = dateList.map((item) => ({ label: item, value: item }));

  useEffect(() => {
    setDates(value);
  }, [value]);

  const onRadioChange = (e: any) => {
    setRangeBtn(e.target.value);
    if (e.target.value !== '自定义') {
      const dateRange = getDateRange(e.target.value);
      setDates(dateRange);
      onChange(dateRange, e.target.value);
    }
  };

  const onDatesChange = (values: dayjs.Dayjs[]) => {
    let rangeDates = values;
    setDates(rangeDates);
    onChange(rangeDates, rangeBtn);
  };

  return (
    <Space>
      <Radio.Group
        options={[...options]}
        onChange={onRadioChange}
        defaultValue={rangeBtn}
        value={rangeBtn}
        optionType="button"
        buttonStyle="solid"
        style={{ whiteSpace: 'nowrap' }}
        size={size}
      />
      <RangePicker
        value={dates}
        onChange={onDatesChange}
        size={size}
        showTime={showTime}
        format={timeFormatType.date}
        onOpenChange={(open) => {
          if (open) {
            setDates(undefined);
          }
        }}
        {...rangePickerOptions}
      />
    </Space>
  );
}
