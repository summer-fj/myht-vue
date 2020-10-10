export default {
    // 定义mutation 变更store中的数据
    setmenulist(state, data){
        state.menulist = data;
    },
    setrolelist(state, data){
        state.roles = data;
    },
    
    setuserinfo(state, data){
        state.userinfo = data;
    },

    setcatelist(state, data){
        state.catelist = data;
    },

    // 退出清空用户信息
    loginout(state){
        state.userinfo = null;
    }

    

}