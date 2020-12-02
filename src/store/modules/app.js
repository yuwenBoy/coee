const app = {
    state: {
        userInfo:{},//用户信息
        menuList: [],//菜单列表
        pageRole: [],//页面权限
        opendMenu: [],//左侧菜单展开的菜单
        activeMenu: ''//左侧菜单选中菜单节点
    },
    mutations: {
        updateMenulist(state, list) {
            state.menuList = list;
        },
        updateRole(state, list) {
            state.pageRole = list;
        },
        updateOpenMenu(state, name) {
            state.opendMenu.length = 0;
            state.opendMenu.push(name);
        },
        updateActionMenu(state, name) {
            state.activeMenu = name;
        },
        updateUserInfo(state,userInfo){
            state.userInfo=userInfo;
        }
    }
}

export default app