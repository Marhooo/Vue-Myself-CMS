import { constantRoutes, asyncRouters } from "@/router/index";
import { removeToken } from '@/utils/auth'

function hasPermission(roles, pageBtn_permission, route) {
  if (route.meta && route.meta.role && route.r_id) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0) && pageBtn_permission.some(role => route.r_id.indexOf(role) >= 0);
  } else {
    return true;
  }
}

//el-trees权限路由树结构建立函数
function ToRoleTree( data ){
  data.forEach(element => {
    if (element.r_id) {
      element.r_id = element.r_id.toString()
    }
    delete element.path
    delete element.component
    delete element.meta
    if (element.children) {
      ToRoleTree(element.children)
    }
  })
  return data
}

const state = {
  routers: constantRoutes,
  addRouters: [],
  roleTree: [],
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRoutes.concat(routers)
  },
  SET_ROLETREE: (state, roleTree) => {
    state.roleTree = ToRoleTree(roleTree)
    state.roleTree.pop() //删除404页面
  },
}

const actions = {
  GenerateRoutes({ commit }, data) {
    try {
      return new Promise(resolve => {
        const { roles } = data
        const { pageBtn_permission } = data
        const accessedRouters = asyncRouters.filter(v => {
          if (roles.indexOf("超级管理员") >= 0) return true;
          if (hasPermission(roles, pageBtn_permission, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(roles, pageBtn_permission, child)) {
                  return child;
                }
                return false;
              });
              return v;
            } else {
              return v;
            }
          }
          return false;
        });
        commit("SET_ROUTERS", accessedRouters);
        resolve();
      });
    } catch (error) {
      removeToken()
      location.reload()
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
