import { memo } from 'react';
import { Result, Spin } from 'antd';

export default memo(() => {
  return <Result icon={<Spin size='large' />} />
});
