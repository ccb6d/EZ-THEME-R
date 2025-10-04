import request from './request';



export function fetchCoupons() {
  return request({
    url: '/user/coupon/fetch',
    method: 'get'
  });
}