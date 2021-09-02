import request from '@/utils/request'

export function login (data) {
  return request({
    url: 'wxlogin', // /login/login   /user/login
    method: 'post',
    data:{body:data}
  })
}
export function getInfo (token) {
  return request({
    url: '/wxgetUserInfo',
    method: 'post',
    token
  })
}
export function wxLogin(data) {
  return request({
    url: '/getcode',
    method: 'get',
    params: data
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
