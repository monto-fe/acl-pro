/* 写一个分页计算的函数，current默认值为"1"，pageSize默认值为"10"，需要校验下current, pageSize是否为数字，如果不是数字则为默认值，pageSize最大不超过10000，如果超过10000，则取10000
入参: current, pageSize
出参: offset, limit
*/
export function pageCompute(current: number, pageSize: number) {
  if (isNaN(current)) {
    current = 1;
  }
  if (isNaN(pageSize)) {
    pageSize = 10;
  }
  if (pageSize > 100000) {
    pageSize = 100000;
  }
  return {
    offset: (Number(current) - 1) * Number(pageSize),
    limit: Number(pageSize),
  }
}
