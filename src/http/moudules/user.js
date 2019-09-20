import axios from '../axios'

/*
 * 用户管理模块
 */

// 保存
export const sava = (data) => {
    return axios({
        url: '/sysUser/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/user/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/sysUser/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/menu/findPermissions',
        method: 'post',
        params
    })
}
// 查找用户的菜单权限标识集合
export const getUserRole = (params) => {
  return axios({
    url: '/menu/getUserRole',
    method: 'post',
    params
  })
}
// 给用户分配角色
export const savaUserRole = (params) => {
  return axios({
    url: '/menu/savaUserRole',
    method: 'post',
    params
  })
}

