export const state = () => ({
  role: false, // 标识当前用户角色，false为老人家属，true为志愿者
})

export default {
  namespaced: true, // 命名空间
  state,
  // getters,
  // actions,
  // mutations,
}
